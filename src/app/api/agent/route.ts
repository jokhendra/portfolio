import { NextResponse } from 'next/server';
import { corpus, type CorpusChunk } from '@/data/agentCorpus';
import { projects } from '@/data/projects';
import { profile } from '@/data/profile';

/**
 * Grounded portfolio interview agent.
 *
 * Pipeline per turn:
 *   1. Resolve follow-ups against conversation history (entity memory)
 *   2. Classify a fine-grained intent
 *   3. Retrieve broadly, then rerank
 *   4. Gate on confidence — refuse instead of inventing
 *   5. Answer (model when available, structured extractive otherwise)
 *   6. Emit follow-up suggestions matched to the turn
 *
 * Every step is traced so the Ask UI can show the real execution path.
 */

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 8;
const RATE_LIMIT_WINDOW_MS = 5 * 60_000;
const RATE_LIMIT_MAX = 15;
const RETRIEVE_CANDIDATES = 10;
const RERANK_KEEP = 4;
/** Below this top score the agent refuses rather than stitching weak matches. */
const CONFIDENCE_FLOOR = 8;

type Intent =
  | 'greeting'
  | 'hire'
  | 'github'
  | 'capability'
  | 'case_study'
  | 'how_why'
  | 'incident'
  | 'compare'
  | 'out_of_scope'
  | 'portfolio';

interface AgentTurn {
  role: 'user' | 'assistant';
  content: string;
}

interface ScoredChunk {
  chunk: CorpusChunk;
  score: number;
}

interface ResolvedQuery {
  /** Query after pronoun / entity resolution. */
  text: string;
  /** Original user text. */
  original: string;
  /** Project slug pinned from this turn or prior context. */
  projectSlug: string | null;
  /** True when the user said "it/that/this" and we resolved a project. */
  resolvedFollowUp: boolean;
}

const rateLimitBuckets = new Map<string, number[]>();

function clientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'local';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (rateLimitBuckets.size > 500) {
    for (const [bucketKey, stamps] of rateLimitBuckets) {
      if (stamps.every((stamp) => stamp <= windowStart)) rateLimitBuckets.delete(bucketKey);
    }
  }

  const stamps = (rateLimitBuckets.get(key) ?? []).filter((stamp) => stamp > windowStart);
  if (stamps.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(key, stamps);
    return true;
  }
  stamps.push(now);
  rateLimitBuckets.set(key, stamps);
  return false;
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'did', 'do', 'does', 'for', 'from',
  'has', 'have', 'how', 'i', 'in', 'is', 'it', 'its', 'me', 'my', 'of', 'on', 'or', 'that', 'the',
  'their', 'them', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'what', 'when', 'where',
  'which', 'who', 'why', 'will', 'with', 'you', 'your', 'about', 'tell', 'use', 'used', 'more',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

/** Inverse document frequency over the corpus, computed once per process. */
const documentFrequency = (() => {
  const frequency = new Map<string, number>();
  for (const chunk of corpus) {
    const unique = new Set([...tokenize(chunk.text), ...chunk.tags.map((tag) => tag.toLowerCase())]);
    for (const token of unique) frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }
  return frequency;
})();

const PROJECT_ALIASES: Array<{ slug: string; title: string; patterns: RegExp[] }> = projects.map(
  (project) => ({
    slug: project.slug,
    title: project.title,
    patterns: [
      new RegExp(project.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      new RegExp(project.slug.replace(/-/g, '[\\s-]?'), 'i'),
    ],
  })
);

// Extra spoken aliases that do not match the formal title exactly.
PROJECT_ALIASES.push(
  { slug: 'my-live', title: 'My Live', patterns: [/\bmy\s*live\b/i, /\blive\s+stream(ing)?\b/i] },
  {
    slug: 'cynayd-connect',
    title: 'Cynayd Connect',
    patterns: [/\bcynayd\s*connect\b/i, /\bmediasoup\b/i, /\bwebrtc\b/i],
  },
  { slug: 'hybrid-rag-search', title: 'Hybrid RAG Search', patterns: [/\bhybrid\s+rag\b/i, /\brag\b/i] },
  { slug: 'solar-savings-agent', title: 'Solar Savings Agent', patterns: [/\bsolar\b/i, /\blanggraph\b/i] },
  { slug: 'portfolio-agent', title: 'Groot', patterns: [/\bgroot\b/i, /\bthis\s+site\b/i, /\bportfolio\s+agent\b/i] },
  { slug: 'recommendation-engine', title: 'Recommendation Engine', patterns: [/\brecommend/i] },
  {
    slug: 'aviation-booking',
    title: 'Aviation Training Booking',
    patterns: [/\baviation\b/i, /\bwhistler\b/i, /\bflight\s+train/i],
  }
);

function detectProjectsInText(text: string): string[] {
  const found = new Set<string>();
  for (const alias of PROJECT_ALIASES) {
    if (alias.patterns.some((pattern) => pattern.test(text))) found.add(alias.slug);
  }
  return [...found];
}

function lastMentionedProject(history: AgentTurn[], current: string): string | null {
  const fromCurrent = detectProjectsInText(current);
  if (fromCurrent.length === 1) return fromCurrent[0];

  for (let i = history.length - 1; i >= 0; i -= 1) {
    const mentioned = detectProjectsInText(history[i].content);
    if (mentioned.length > 0) return mentioned[0];
  }
  return null;
}

/**
 * Rewrites follow-ups ("tell me more about that architecture") into a
 * retrieval-friendly query by pinning the active project from history.
 */
function resolveQuery(message: string, history: AgentTurn[]): ResolvedQuery {
  const pronounFollowUp =
    /\b(it|that|this|the (project|system|one|architecture|stack|incident|decision))\b/i.test(message) &&
    detectProjectsInText(message).length === 0;

  const projectSlug = lastMentionedProject(history, message);
  let text = message;

  if (pronounFollowUp && projectSlug) {
    const title = projects.find((project) => project.slug === projectSlug)?.title ?? projectSlug;
    text = `${message} (regarding ${title})`;
  }

  // Expand shorthand so sparse retrieval hits the right tags.
  text = text
    .replace(/\bws\b/gi, 'websocket')
    .replace(/\bfs\b/gi, 'full-stack')
    .replace(/\bllm\b/gi, 'language model')
    .replace(/\bsfu\b/gi, 'mediasoup sfu webrtc');

  return {
    text,
    original: message,
    projectSlug,
    resolvedFollowUp: Boolean(pronounFollowUp && projectSlug),
  };
}

function routeIntent(message: string): Intent {
  const text = message.toLowerCase().trim();

  if (text.length <= 12 && /^(hi|hey|hello|yo|sup|good (morning|evening))\b/.test(text)) {
    return 'greeting';
  }

  if (/(github|repo|repositor|commit|open source|building lately|working on lately)/.test(text)) {
    return 'github';
  }

  if (
    /(hire|hiring|available for|availability|contact|your email|reach out|book a call|schedule a call|freelance|consulting|get in touch)/.test(
      text
    )
  ) {
    return 'hire';
  }

  if (
    /(weather|stock market|recipe|homework|write (me )?code for|leetcode|who won|joke|translate this|unicorn|quantum cobol|cobol|astrology|horoscope)/.test(
      text
    )
  ) {
    return 'out_of_scope';
  }

  if (
    /\b(compare|compared to|versus|vs|difference between|both|and also)\b/.test(text) &&
    detectProjectsInText(text).length >= 2
  ) {
    return 'compare';
  }

  if (/\b(broke|break|incident|fail(ed|ure)?|bug|outage|lesson|fixed|went wrong)\b/.test(text)) {
    return 'incident';
  }

  if (
    /^(how|why|explain)\b/.test(text) ||
    /\b(structure|structured|architecture|design|approach|tradeoff|decision|rationale|why did|how do|how did|how does)\b/.test(
      text
    )
  ) {
    return 'how_why';
  }

  if (
    detectProjectsInText(text).length > 0 &&
    /\b(tell me about|what is|describe|walk me through|overview|case study)\b/.test(text)
  ) {
    return 'case_study';
  }

  if (
    /\b(experience|experiences|skill|skills|know|proficient|worked with|backend|frontend|aws|fastapi|nestjs|express|websocket|mediasoup|rag|langgraph|mcp|docker|python|node)\b/.test(
      text
    )
  ) {
    return 'capability';
  }

  if (detectProjectsInText(text).length === 1) return 'case_study';

  return 'portfolio';
}

function scoreChunk(chunk: CorpusChunk, query: string, intent: Intent, projectSlug: string | null): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  const lowerQuery = query.toLowerCase();
  const totalDocs = corpus.length;
  const haystack = `${chunk.title} ${chunk.text}`.toLowerCase();
  const chunkTokens = tokenize(haystack);
  const tags = new Set(chunk.tags.map((tag) => tag.toLowerCase()));

  let score = 0;
  for (const token of new Set(queryTokens)) {
    const df = documentFrequency.get(token) ?? 0;
    const idf = Math.log((totalDocs + 1) / (df + 1)) + 1;
    const termCount = chunkTokens.filter((candidate) => candidate === token).length;
    if (termCount > 0) score += idf * (1 + Math.log(termCount));
    if (tags.has(token)) score += idf * 1.5;
    if (chunk.title.toLowerCase().includes(token)) score += idf * 0.9;
  }

  for (let i = 0; i < queryTokens.length - 1; i += 1) {
    const bigram = `${queryTokens[i]} ${queryTokens[i + 1]}`;
    if (haystack.includes(bigram)) score += 2.8;
  }
  if (lowerQuery.length > 12 && haystack.includes(lowerQuery)) score += 4;

  // Intent-aware boosts.
  const idTitle = `${chunk.id} ${chunk.title}`.toLowerCase();
  if (intent === 'how_why' && /(architecture|decisions|structured)/.test(idTitle)) score += 4;
  if (intent === 'incident' && /incident/.test(idTitle)) score += 5;
  if (intent === 'capability' && /(profile|stack|focus|capability)/.test(idTitle)) score += 3.5;
  if (intent === 'hire' && /contact/.test(idTitle)) score += 6;
  if (intent === 'case_study' && /overview/.test(idTitle)) score += 2.5;
  if (intent === 'compare' && /(overview|architecture)/.test(idTitle)) score += 2;

  if (projectSlug && (chunk.id.startsWith(projectSlug) || chunk.source.toLowerCase().includes(projectSlug.replace(/-/g, ' ')))) {
    score += 5;
  }

  // Soft penalty for pure index chunks unless the question is a listing.
  if (chunk.id === 'work-index' && intent !== 'portfolio' && intent !== 'compare') score *= 0.55;

  return score;
}

function retrieve(query: string, intent: Intent, projectSlug: string | null): ScoredChunk[] {
  const scored = corpus
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, query, intent, projectSlug) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, RETRIEVE_CANDIDATES);

  return rerank(scored, query, intent).slice(0, RERANK_KEEP);
}

/**
 * Second-pass rerank: diversify sources and prefer complementary chunk types
 * (overview + architecture + incident) over three near-duplicate overviews.
 */
function rerank(candidates: ScoredChunk[], query: string, intent: Intent): ScoredChunk[] {
  if (candidates.length <= 1) return candidates;

  const queryTokens = new Set(tokenize(query));
  const typed = candidates.map((entry) => {
    const kind = entry.chunk.id.includes('incident')
      ? 'incident'
      : entry.chunk.id.includes('architecture')
        ? 'architecture'
        : entry.chunk.id.includes('decisions')
          ? 'decisions'
          : entry.chunk.id.includes('metrics')
            ? 'metrics'
            : entry.chunk.id.includes('overview')
              ? 'overview'
              : entry.chunk.source === 'Profile' || entry.chunk.source === 'Stack' || entry.chunk.source === 'Expertise'
                ? 'profile'
                : 'other';

    const coverage = tokenize(entry.chunk.text).filter((token) => queryTokens.has(token)).length;
    let boost = coverage * 0.35;
    if (intent === 'incident' && kind === 'incident') boost += 3;
    if (intent === 'how_why' && (kind === 'architecture' || kind === 'decisions')) boost += 2.5;
    if (intent === 'capability' && kind === 'profile') boost += 2;
    if (intent === 'case_study' && kind === 'overview') boost += 1.5;

    return { ...entry, score: entry.score + boost, kind, source: entry.chunk.source };
  });

  typed.sort((a, b) => b.score - a.score);

  const picked: typeof typed = [];
  const seenKinds = new Set<string>();
  const seenSources = new Map<string, number>();

  for (const entry of typed) {
    const sourceCount = seenSources.get(entry.source) ?? 0;
    if (sourceCount >= 2) continue;
    if (seenKinds.has(entry.kind) && entry.kind !== 'profile' && picked.length >= 2) {
      // Allow a second of same kind only if score is clearly ahead.
      if (entry.score < picked[0].score * 0.85) continue;
    }
    picked.push(entry);
    seenKinds.add(entry.kind);
    seenSources.set(entry.source, sourceCount + 1);
    if (picked.length >= RERANK_KEEP) break;
  }

  // Fill remaining slots if diversity filter was too aggressive.
  if (picked.length < Math.min(RERANK_KEEP, typed.length)) {
    for (const entry of typed) {
      if (picked.some((item) => item.chunk.id === entry.chunk.id)) continue;
      picked.push(entry);
      if (picked.length >= RERANK_KEEP) break;
    }
  }

  return picked.map(({ chunk, score }) => ({ chunk, score }));
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"'(\[])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function selectSentences(text: string, query: string, count: number): string {
  const sentences = splitSentences(text);
  if (sentences.length <= count) return sentences.join(' ');

  const queryTokens = new Set(tokenize(query));
  const ranked = sentences
    .map((sentence, index) => {
      const tokens = tokenize(sentence);
      const overlap = tokens.filter((token) => queryTokens.has(token)).length;
      return { sentence, index, score: overlap / Math.sqrt(tokens.length || 1) };
    })
    .sort((a, b) => b.score - a.score);

  const chosen = (ranked[0].score > 0 ? ranked.slice(0, count) : []).sort((a, b) => a.index - b.index);
  const fallback = sentences.slice(0, count);

  return (chosen.length > 0 ? chosen.map((entry) => entry.sentence) : fallback).join(' ');
}

function refuseMessage(): string {
  return [
    `I don't have solid material in this portfolio for that.`,
    `I can talk about My Live, Cynayd Connect, Hybrid RAG Search, Solar Savings Agent, Recommendation Engine, Groot, Aviation Training Booking, agent architecture, backend and realtime systems, the stack, GitHub activity, or how to get in touch.`,
  ].join(' ');
}

function buildExtractiveAnswer(
  intent: Intent,
  results: ScoredChunk[],
  toolSummary: string | null,
  query: string,
  confident: boolean,
  projectSlug: string | null = null
): string {
  if (intent === 'greeting') {
    return `Hey — ask me about the realtime work (My Live, Cynayd Connect), hybrid RAG, LangGraph agents, backend and cloud delivery, or what broke in production.`;
  }

  if (intent === 'out_of_scope') {
    return `That's outside what I can answer from this portfolio. Ask about my AI, backend, realtime, or delivery work — for example My Live scaling, hybrid retrieval, or how I structure LangGraph agents.`;
  }

  if (intent === 'github' && toolSummary) {
    const grounded = results.length > 0 && confident
      ? `\n\nRelated portfolio context: ${selectSentences(results[0].chunk.text, query, 2)}`
      : '';
    return `Most recently updated public repositories:\n\n${toolSummary}${grounded}`;
  }

  if (intent === 'hire') {
    const contact = results.find((entry) => entry.chunk.id.includes('contact')) ?? results[0];
    if (!contact) return refuseMessage();
    return [
      selectSentences(contact.chunk.text, query, 3),
      `You can use the Contact section on this page, or email me at ${profile.email}.`,
    ].join('\n\n');
  }

  if (!confident || results.length === 0) {
    return refuseMessage();
  }

  if (intent === 'compare' && results.length >= 2) {
    const [a, b] = results;
    return [
      `${a.chunk.source}: ${selectSentences(a.chunk.text, query, 2)}`,
      `${b.chunk.source}: ${selectSentences(b.chunk.text, query, 2)}`,
      'Both sit on the same engineering spine: explicit service boundaries, durable state where it matters, and failure paths designed as part of the product.',
    ].join('\n\n');
  }

  if (intent === 'incident') {
    const incident =
      results.find(
        (entry) =>
          entry.chunk.id.includes('incident') &&
          (!projectSlug || entry.chunk.id.startsWith(projectSlug))
      ) ??
      results.find((entry) => entry.chunk.id.includes('incident')) ??
      results[0];
    const extras = results.filter(
      (entry) =>
        entry.chunk.id !== incident.chunk.id &&
        (!projectSlug || entry.chunk.id.startsWith(projectSlug) || entry.chunk.source === incident.chunk.source)
    ).slice(0, 1);
    const parts = [`${incident.chunk.source} — ${incident.chunk.title}: ${selectSentences(incident.chunk.text, query, 4)}`];
    if (extras[0]) {
      parts.push(`Context: ${selectSentences(extras[0].chunk.text, query, 2)}`);
    }
    return parts.join('\n\n');
  }

  if (intent === 'capability') {
    const parts = results.slice(0, 3).map((entry, index) => {
      const prefix = index === 0 ? '' : `${entry.chunk.title}: `;
      return `${prefix}${selectSentences(entry.chunk.text, query, index === 0 ? 3 : 2)}`;
    });
    return parts.join('\n\n');
  }

  if (intent === 'how_why' || intent === 'case_study') {
    const primary = results[0];
    const support = results.slice(1, 3);
    const parts = [selectSentences(primary.chunk.text, query, 3)];
    for (const entry of support) {
      parts.push(`From ${entry.chunk.title}: ${selectSentences(entry.chunk.text, query, 2)}`);
    }
    return parts.join('\n\n');
  }

  const [primary, ...rest] = results;
  const parts = [selectSentences(primary.chunk.text, query, 3)];
  if (rest[0]) {
    parts.push(`From ${rest[0].chunk.title}: ${selectSentences(rest[0].chunk.text, query, 2)}`);
  }
  return parts.join('\n\n');
}

function buildFollowUps(intent: Intent, projectSlug: string | null, results: ScoredChunk[]): string[] {
  const projectTitle =
    (projectSlug && projects.find((project) => project.slug === projectSlug)?.title) ||
    results[0]?.chunk.source ||
    null;

  const suggestions: string[] = [];

  if (intent === 'greeting' || intent === 'out_of_scope') {
    return [
      'How did you scale realtime on My Live?',
      'Why hybrid retrieval instead of dense-only?',
      'What backend and WebRTC experience do you have?',
    ];
  }

  if (intent === 'hire') {
    return [
      'What kind of AI and full-stack work do you take on?',
      'Which production systems best show your backend depth?',
    ];
  }

  if (intent === 'github') {
    return [
      'How does MCP or tool calling show up in your work?',
      'Walk me through Groot on this site.',
    ];
  }

  if (intent === 'incident') {
    suggestions.push(
      projectTitle ? `How is ${projectTitle} architected?` : 'What broke in Cynayd Connect?',
      'Why did you choose Redis pub/sub for fanout?'
    );
    return suggestions.slice(0, 3);
  }

  if (intent === 'capability') {
    return [
      'How did you scale realtime on My Live?',
      'Why hybrid retrieval instead of dense-only?',
      'What broke in one of these projects?',
    ];
  }

  if (projectTitle) {
    suggestions.push(
      `What broke in ${projectTitle}?`,
      `How is ${projectTitle} architected?`,
      `What tradeoffs did you make on ${projectTitle}?`
    );
  } else {
    suggestions.push(
      'Tell me about Cynayd Connect',
      'How do you structure a LangGraph agent?',
      'What broke in one of these projects?'
    );
  }

  return [...new Set(suggestions)].slice(0, 3);
}

function buildSystemPrompt(intent: Intent, turnCount: number): string {
  const shape =
    intent === 'compare'
      ? 'Compare the systems in short parallel points, then one sentence on what is shared.'
      : intent === 'incident'
        ? 'Lead with what broke, then the fix. Keep it concrete.'
        : intent === 'capability'
          ? 'Answer with evidence from specific systems or stack layers, not a skill list.'
          : intent === 'hire'
            ? 'Say if you are available and how to reach you. No soft sell.'
            : intent === 'greeting'
              ? 'Greet briefly in one short sentence, then invite a concrete question. Do not give a long bio.'
              : 'Be concise and technical: two short paragraphs at most, or short labelled bullets for multi-part questions.';

  return [
    `You are ${profile.agentName}, answering for ${profile.name} (${profile.role}) on his portfolio site.`,
    'Speak in first person as Jokhendra — like a real technical conversation with a hiring manager or peer. Natural, direct, no corporate filler.',
    'Never introduce yourself. Do not start with "I am Groot", "As the portfolio agent", "I am the portfolio agent", or any name/role preamble. Jump straight into the answer.',
    turnCount > 0
      ? 'This is a follow-up in an ongoing chat. Continue naturally. Do not re-greet or re-introduce.'
      : 'If this is only a greeting, one short hello is enough — then ask what they want to know.',
    'Answer only from the CONTEXT provided. If the context does not cover it, say so plainly and suggest what you can cover.',
    shape,
    'No marketing language, no emoji, no fluff.',
    'Format with clean Markdown when useful: short paragraphs, bullet lists with -, and **bold** for labels. Do not wrap the whole answer in a code fence.',
    'Never invent metrics, client names, employers, or links. Do not claim numbers that are not in the context.',
  ].join(' ');
}

interface Provider {
  url: string;
  key: string;
  model: string;
  label: string;
  /** OpenAI-compatible chat completions vs Gemini native SSE. */
  protocol: 'openai' | 'gemini';
}

function resolveProvider(): Provider | null {
  // Prefer Google when configured — primary model for this portfolio agent.
  const googleKey = process.env.GOOGLE_API_KEY;
  if (googleKey) {
    const model = process.env.GOOGLE_MODEL || process.env.AGENT_MODEL || 'gemini-2.5-flash-lite';
    return {
      url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
      key: googleKey,
      model,
      label: 'google',
      protocol: 'gemini',
    };
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    return {
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: groqKey,
      model: process.env.AGENT_MODEL || 'llama-3.3-70b-versatile',
      label: 'groq',
      protocol: 'openai',
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      key: openaiKey,
      model: process.env.AGENT_MODEL || 'gpt-4o-mini',
      label: 'openai',
      protocol: 'openai',
    };
  }

  return null;
}

function toGeminiBody(messages: Array<{ role: string; content: string }>) {
  const system = messages
    .filter((message) => message.role === 'system')
    .map((message) => message.content)
    .join('\n\n');

  const contents = messages
    .filter((message) => message.role === 'user' || message.role === 'assistant')
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

  return {
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    contents,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 550,
    },
  };
}

async function* streamProviderTokens(
  provider: Provider,
  messages: Array<{ role: string; content: string }>
): AsyncGenerator<string> {
  const response =
    provider.protocol === 'gemini'
      ? await fetch(provider.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': provider.key,
          },
          body: JSON.stringify(toGeminiBody(messages)),
        })
      : await fetch(provider.url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${provider.key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: provider.model,
            messages,
            stream: true,
            temperature: 0.2,
            max_tokens: 550,
          }),
        });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => '');
    throw new Error(`provider responded ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === '[DONE]') {
        if (payload === '[DONE]') return;
        continue;
      }
      try {
        const parsed = JSON.parse(payload);
        if (provider.protocol === 'gemini') {
          const parts = parsed?.candidates?.[0]?.content?.parts;
          if (Array.isArray(parts)) {
            for (const part of parts) {
              if (typeof part?.text === 'string' && part.text.length > 0) yield part.text;
            }
          }
        } else {
          const token = parsed?.choices?.[0]?.delta?.content;
          if (typeof token === 'string' && token.length > 0) yield token;
        }
      } catch {
        // Ignore keep-alive and partial frames.
      }
    }
  }
}

async function fetchGithubActivity(): Promise<{ ok: boolean; summary: string }> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${profile.social.githubHandle}/repos?sort=pushed&per_page=6`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 900 },
      }
    );

    if (!response.ok) throw new Error(`github responded ${response.status}`);

    const repos = (await response.json()) as Array<{
      name: string;
      description: string | null;
      language: string | null;
      html_url: string;
      stargazers_count: number;
      pushed_at: string;
      fork: boolean;
    }>;
    const recent = repos.filter((repo) => !repo.fork).slice(0, 5);
    if (recent.length === 0) return { ok: false, summary: 'No public repositories were returned.' };

    const summary = recent
      .map((repo) => {
        const updated = new Date(repo.pushed_at).toISOString().slice(0, 10);
        const parts = [repo.name];
        if (repo.language) parts.push(repo.language);
        parts.push(`updated ${updated}`);
        return `${parts.join(' · ')}${repo.description ? `: ${repo.description}` : ''}`;
      })
      .join('\n');

    return { ok: true, summary };
  } catch {
    return { ok: false, summary: 'Live GitHub data could not be fetched for this turn.' };
  }
}

export async function POST(req: Request) {
  try {
    const key = clientKey(req);
    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: 'Too many questions in a short window. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    const body = (await req.json()) as { message?: unknown; history?: unknown };
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json({ error: 'Ask a question to get started.' }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Please keep questions under ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const history: AgentTurn[] = Array.isArray(body.history)
      ? (body.history as unknown[])
          .filter(
            (turn): turn is AgentTurn =>
              typeof turn === 'object' &&
              turn !== null &&
              'role' in turn &&
              'content' in turn &&
              typeof (turn as AgentTurn).content === 'string' &&
              ((turn as AgentTurn).role === 'user' || (turn as AgentTurn).role === 'assistant')
          )
          .slice(-MAX_HISTORY_TURNS)
          .map((turn) => ({ role: turn.role, content: turn.content.slice(0, MAX_MESSAGE_LENGTH) }))
      : [];

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        };
        const trace = (step: string, detail: string) => {
          send({ type: 'trace', step, detail });
        };

        try {
          const resolved = resolveQuery(message, history);
          if (resolved.resolvedFollowUp) {
            trace('rewrite', `resolved follow-up → "${resolved.text}"`);
          }

          const intent = routeIntent(resolved.original);
          trace('route', `intent classified as "${intent}"`);

          // Ambiguous project mention: ask one clarifying question instead of guessing.
          const mentioned = detectProjectsInText(resolved.original);
          if (
            mentioned.length >= 2 &&
            intent !== 'compare' &&
            /\b(it|that|this|the project|the system)\b/i.test(resolved.original)
          ) {
            const titles = mentioned
              .map((slug) => projects.find((project) => project.slug === slug)?.title ?? slug)
              .join(' or ');
            trace('clarify', `ambiguous project reference among ${mentioned.join(', ')}`);
            send({
              type: 'mode',
              mode: 'clarify',
              detail: 'needs a sharper project reference',
            });
            send({
              type: 'token',
              value: `That could refer to more than one system. Did you mean ${titles}?`,
            });
            send({
              type: 'followups',
              followups: mentioned
                .map((slug) => {
                  const title = projects.find((project) => project.slug === slug)?.title;
                  return title ? `Tell me about ${title}` : null;
                })
                .filter(Boolean),
            });
            send({ type: 'done' });
            return;
          }

          let toolSummary: string | null = null;
          if (intent === 'github') {
            const tool = await fetchGithubActivity();
            toolSummary = tool.summary;
            trace(
              'tool: github_activity',
              tool.ok ? 'fetched recent public repositories' : 'tool failed, continuing without live data'
            );
          }

          const skipRetrieve = intent === 'greeting' || intent === 'out_of_scope';
          const results = skipRetrieve
            ? []
            : retrieve(resolved.text, intent, resolved.projectSlug);

          const topScore = results[0]?.score ?? 0;
          const confident =
            intent === 'greeting' ||
            intent === 'out_of_scope' ||
            intent === 'github' ||
            intent === 'hire' ||
            topScore >= CONFIDENCE_FLOOR;

          if (!skipRetrieve) {
            trace(
              'retrieve',
              results.length > 0
                ? `${results.length} passage(s) after rerank, top score ${topScore.toFixed(1)}${
                    confident ? '' : ' (below confidence floor)'
                  }`
                : 'no passage passed the relevance threshold'
            );
          }

          if (!confident) {
            trace('gate', `confidence ${topScore.toFixed(1)} < ${CONFIDENCE_FLOOR} — refusing instead of guessing`);
          }

          if (results.length > 0 && confident) {
            send({
              type: 'sources',
              sources: results.map((entry) => ({
                title: entry.chunk.title,
                source: entry.chunk.source,
              })),
            });
          }

          const followups = buildFollowUps(intent, resolved.projectSlug, results);
          const provider = resolveProvider();
          const contextBlock = results
            .map((entry) => `[${entry.chunk.source} - ${entry.chunk.title}]\n${entry.chunk.text}`)
            .join('\n\n');

          const canGenerate =
            provider &&
            confident &&
            (results.length > 0 || toolSummary || intent === 'greeting' || intent === 'out_of_scope');

          if (canGenerate && provider) {
            send({ type: 'mode', mode: 'generated', detail: `grounded generation via ${provider.label}` });
            trace('answer', `generating from ${results.length} passage(s) for intent "${intent}"`);

            const messages = [
              { role: 'system', content: buildSystemPrompt(intent, history.length) },
              ...history.map((turn) => ({ role: turn.role, content: turn.content })),
              {
                role: 'user',
                content: [
                  `QUESTION: ${resolved.original}`,
                  resolved.resolvedFollowUp ? `RESOLVED_QUERY: ${resolved.text}` : '',
                  `INTENT: ${intent}`,
                  '',
                  'CONTEXT:',
                  contextBlock || '(no retrieved passages)',
                  toolSummary ? `\nLIVE TOOL OUTPUT (github_activity):\n${toolSummary}` : '',
                ]
                  .filter(Boolean)
                  .join('\n'),
              },
            ];

            try {
              let streamed = false;
              for await (const token of streamProviderTokens(provider, messages)) {
                streamed = true;
                send({ type: 'token', value: token });
              }
              if (!streamed) throw new Error('empty provider stream');
            } catch {
              trace('answer', 'provider unavailable, falling back to extractive grounding');
              send({ type: 'mode', mode: 'extractive', detail: 'grounded retrieval (provider unavailable)' });
              send({ type: 'reset' });
              send({
                type: 'token',
                value: buildExtractiveAnswer(intent, results, toolSummary, resolved.text, confident, resolved.projectSlug),
              });
            }
          } else {
            send({
              type: 'mode',
              mode: confident ? 'extractive' : 'refuse',
              detail: !confident
                ? 'low confidence — refused rather than invent'
                : provider
                  ? 'grounded retrieval'
                  : 'grounded retrieval (no model key configured)',
            });
            trace(
              'answer',
              confident
                ? `composing structured extractive answer for intent "${intent}"`
                : 'emitting grounded refusal'
            );
            send({
              type: 'token',
              value: buildExtractiveAnswer(intent, results, toolSummary, resolved.text, confident, resolved.projectSlug),
            });
          }

          if (followups.length > 0) {
            send({ type: 'followups', followups });
          }

          send({ type: 'done' });
        } catch {
          send({
            type: 'token',
            value: 'Something went wrong handling that question. Please try again.',
          });
          send({ type: 'done' });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('[agent] request failed:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
