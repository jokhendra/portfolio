import { NextResponse } from 'next/server';
import { corpus, type CorpusChunk } from '@/data/agentCorpus';
import { profile } from '@/data/profile';

/**
 * Grounded portfolio agent.
 *
 * Shape mirrors the larger systems in the case studies: route the turn, run a
 * tool (retrieval or live GitHub), then answer from what came back. Every step
 * is emitted as a trace event so the UI can show the execution path instead of
 * hiding it.
 *
 * Runs with or without a model provider. Without a key it answers extractively
 * from retrieved passages and says so, rather than failing silently.
 */

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 6;
const RATE_LIMIT_WINDOW_MS = 5 * 60_000;
const RATE_LIMIT_MAX = 15;

type Intent = 'portfolio' | 'github' | 'contact' | 'greeting';

interface AgentTurn {
  role: 'user' | 'assistant';
  content: string;
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

  // Sweep stale buckets so a long-lived instance does not grow unbounded.
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
  'which', 'who', 'why', 'will', 'with', 'you', 'your', 'about', 'tell', 'does', 'use', 'used',
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

interface ScoredChunk {
  chunk: CorpusChunk;
  score: number;
}

/**
 * Hybrid scoring: sparse term weighting for exact vocabulary, plus phrase and
 * tag bonuses so questions phrased in domain language land on the right chunk.
 */
function retrieve(query: string, limit = 3): ScoredChunk[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const lowerQuery = query.toLowerCase();
  const totalDocs = corpus.length;

  // "How"/"why" questions want explanation chunks, not project summaries.
  const wantsExplanation =
    /^(how|why|explain)\b/.test(lowerQuery) ||
    /\b(structure|structured|architecture|design|approach|tradeoff|decision|rationale)\b/.test(lowerQuery);

  const scored = corpus.map((chunk) => {
    const haystack = `${chunk.title} ${chunk.text}`.toLowerCase();
    const chunkTokens = tokenize(haystack);
    const tags = new Set(chunk.tags.map((tag) => tag.toLowerCase()));

    let score = 0;
    for (const token of new Set(queryTokens)) {
      const df = documentFrequency.get(token) ?? 0;
      const idf = Math.log((totalDocs + 1) / (df + 1)) + 1;
      const termCount = chunkTokens.filter((candidate) => candidate === token).length;
      if (termCount > 0) score += idf * (1 + Math.log(termCount));
      if (tags.has(token)) score += idf * 1.4;
      if (chunk.title.toLowerCase().includes(token)) score += idf * 0.8;
    }

    // Phrase bonus: consecutive query terms appearing verbatim.
    for (let i = 0; i < queryTokens.length - 1; i += 1) {
      const bigram = `${queryTokens[i]} ${queryTokens[i + 1]}`;
      if (haystack.includes(bigram)) score += 2.5;
    }
    if (lowerQuery.length > 12 && haystack.includes(lowerQuery)) score += 4;

    if (wantsExplanation && /(architecture|decisions|structured|incident)/.test(`${chunk.id} ${chunk.title.toLowerCase()}`)) {
      score += 3.5;
    }

    return { chunk, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function routeIntent(message: string): Intent {
  const text = message.toLowerCase();

  if (/(github|repo|repositor|commit|open source|building lately|working on lately)/.test(text)) {
    return 'github';
  }
  // Deliberately narrow: technical questions mention words like "rate limit" and
  // "call" too, and they belong on the portfolio path.
  if (
    /(hire|hiring|available for|availability|contact|your email|reach out|book a call|schedule a call|freelance|consulting)/.test(
      text
    )
  ) {
    return 'contact';
  }
  if (text.trim().length <= 12 && /^(hi|hey|hello|yo|sup|good (morning|evening))\b/.test(text.trim())) {
    return 'greeting';
  }
  return 'portfolio';
}

interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
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

    const repos = (await response.json()) as GithubRepo[];
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
    // Tool failure is a routed path, not a dead end: the answer continues
    // without live data and says what could not be fetched.
    return { ok: false, summary: 'Live GitHub data could not be fetched for this turn.' };
  }
}

/**
 * Splits on terminators only when the next sentence actually starts, so
 * "Next.js" and "name@example.com" stay intact.
 */
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"'(\[])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/**
 * Extractive selection: return the sentences that actually answer the question,
 * in their original order, rather than whatever happens to come first.
 */
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

function buildExtractiveAnswer(
  intent: Intent,
  results: ScoredChunk[],
  toolSummary: string | null,
  query: string
): string {
  if (intent === 'greeting') {
    return `Hello. I answer questions about ${profile.shortName}'s work using this site's own project and profile data. Ask about the LangGraph agent structure, the hybrid retrieval setup, the backend and realtime work (FastAPI, Express, NestJS, WebSockets, AWS), or what broke in a project.`;
  }

  if (intent === 'github' && toolSummary) {
    return `Most recently updated public repositories:\n\n${toolSummary}`;
  }

  if (results.length === 0) {
    return `I could not find anything in the portfolio material that answers that. I can cover the case studies (My Live, Cynayd Connect, Hybrid RAG Search, Solar Savings Agent, Recommendation Engine, this site's agent, Aviation Training Booking), the agent architecture, the backend and platform approach, the stack by layer, or how to get in touch.`;
  }

  const [primary, ...rest] = results;
  const parts = [selectSentences(primary.chunk.text, query, 3)];

  const secondary = rest[0];
  if (secondary) {
    parts.push(`From ${secondary.chunk.title}: ${selectSentences(secondary.chunk.text, query, 2)}`);
  }

  return parts.join('\n\n');
}

function buildSystemPrompt(): string {
  return [
    `You are the portfolio agent for ${profile.name}, a ${profile.role}.`,
    'Answer only from the CONTEXT provided. If the context does not cover the question, say so plainly and suggest what you can cover.',
    'Be concise and technical: two short paragraphs at most, no marketing language, no emoji.',
    'Never invent metrics, client names, employers, or links. Do not claim numbers that are not in the context.',
    'Write in third person about the engineer, or neutral prose. Prefer specifics from the context over generalities.',
  ].join(' ');
}

interface Provider {
  url: string;
  key: string;
  model: string;
  label: string;
}

function resolveProvider(): Provider | null {
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    return {
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: groqKey,
      model: process.env.AGENT_MODEL || 'llama-3.3-70b-versatile',
      label: 'groq',
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      key: openaiKey,
      model: process.env.AGENT_MODEL || 'gpt-4o-mini',
      label: 'openai',
    };
  }

  return null;
}

async function* streamProviderTokens(
  provider: Provider,
  messages: Array<{ role: string; content: string }>
): AsyncGenerator<string> {
  const response = await fetch(provider.url, {
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
      max_tokens: 500,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`provider responded ${response.status}`);
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
      if (payload === '[DONE]') return;
      try {
        const parsed = JSON.parse(payload);
        const token = parsed?.choices?.[0]?.delta?.content;
        if (typeof token === 'string' && token.length > 0) yield token;
      } catch {
        // Ignore keep-alive and partial frames.
      }
    }
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
          const intent = routeIntent(message);
          trace('route', `intent classified as "${intent}"`);

          let toolSummary: string | null = null;
          if (intent === 'github') {
            const tool = await fetchGithubActivity();
            toolSummary = tool.summary;
            trace(
              'tool: github_activity',
              tool.ok ? 'fetched recent public repositories' : 'tool failed, continuing without live data'
            );
          }

          const results = intent === 'greeting' ? [] : retrieve(message);
          if (intent !== 'greeting') {
            trace(
              'retrieve',
              results.length > 0
                ? `${results.length} passage(s) matched, top score ${results[0].score.toFixed(1)}`
                : 'no passage passed the relevance threshold'
            );
          }

          if (results.length > 0) {
            send({
              type: 'sources',
              sources: results.map((entry) => ({
                title: entry.chunk.title,
                source: entry.chunk.source,
              })),
            });
          }

          const provider = resolveProvider();
          const contextBlock = results
            .map((entry) => `[${entry.chunk.source} - ${entry.chunk.title}]\n${entry.chunk.text}`)
            .join('\n\n');

          if (provider && (results.length > 0 || toolSummary || intent === 'greeting')) {
            send({ type: 'mode', mode: 'generated', detail: `grounded generation via ${provider.label}` });
            trace('answer', `generating from ${results.length} passage(s)`);

            const messages = [
              { role: 'system', content: buildSystemPrompt() },
              ...history.map((turn) => ({ role: turn.role, content: turn.content })),
              {
                role: 'user',
                content: [
                  `QUESTION: ${message}`,
                  '',
                  'CONTEXT:',
                  contextBlock || '(no retrieved passages)',
                  toolSummary ? `\nLIVE TOOL OUTPUT (github_activity):\n${toolSummary}` : '',
                ].join('\n'),
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
              // Provider trouble degrades to the extractive path rather than
              // showing the visitor an error.
              trace('answer', 'provider unavailable, falling back to extractive grounding');
              send({ type: 'mode', mode: 'extractive', detail: 'grounded retrieval (provider unavailable)' });
              send({ type: 'reset' });
              send({ type: 'token', value: buildExtractiveAnswer(intent, results, toolSummary, message) });
            }
          } else {
            send({
              type: 'mode',
              mode: 'extractive',
              detail: provider ? 'grounded retrieval' : 'grounded retrieval (no model key configured)',
            });
            trace('answer', 'composing extractive answer from retrieved passages');
            send({ type: 'token', value: buildExtractiveAnswer(intent, results, toolSummary, message) });
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
