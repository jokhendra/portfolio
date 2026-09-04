"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { agentSuggestions } from '@/data/agentCorpus';
import { profile } from '@/data/profile';

interface Source {
  title: string;
  source: string;
}

interface TraceStep {
  step: string;
  detail: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  mode?: string;
}

const INTRO: Message = {
  role: 'assistant',
  content: `Ask me about ${profile.shortName}'s work. I retrieve from this site's own project and profile data, then answer from what I find and show the passages I used.`,
};

export default function AgentConsole() {
  const [messages, setMessages] = useState<Message[]>([INTRO]);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  const ask = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isStreaming) return;

    setError('');
    setTrace([]);
    setInput('');
    setIsStreaming(true);

    const history = messages
      .filter((message) => message !== INTRO)
      .map((message) => ({ role: message.role, content: message.content }));

    setMessages((previous) => [
      ...previous,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: '' },
    ]);

    const patchAssistant = (patch: (message: Message) => Message) => {
      setMessages((previous) => {
        const next = [...previous];
        const lastIndex = next.length - 1;
        next[lastIndex] = patch(next[lastIndex]);
        return next;
      });
    };

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'The agent is unavailable right now.');
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
          if (!line.trim()) continue;
          let event: Record<string, unknown>;
          try {
            event = JSON.parse(line);
          } catch {
            continue;
          }

          switch (event.type) {
            case 'trace':
              setTrace((previous) => [
                ...previous,
                { step: String(event.step), detail: String(event.detail) },
              ]);
              break;
            case 'sources':
              patchAssistant((message) => ({ ...message, sources: event.sources as Source[] }));
              break;
            case 'mode':
              patchAssistant((message) => ({ ...message, mode: String(event.detail) }));
              break;
            case 'reset':
              patchAssistant((message) => ({ ...message, content: '' }));
              break;
            case 'token':
              patchAssistant((message) => ({
                ...message,
                content: message.content + String(event.value),
              }));
              break;
            default:
              break;
          }
        }
      }

      patchAssistant((message) =>
        message.content
          ? message
          : { ...message, content: 'No answer came back for that question. Try rephrasing it.' }
      );
    } catch (caught) {
      const detail = caught instanceof Error ? caught.message : 'The agent is unavailable right now.';
      setError(detail);
      setMessages((previous) => previous.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <section id="ask" className="section-band py-20 sm:py-28">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="eyebrow">Ask about my work</p>
          <h2 className="section-heading mt-4">A working agent, not a scripted widget</h2>
          <p className="lede mt-5">
            This runs the routing, retrieval and tool pattern from the case studies against this site&apos;s
            own content. The execution trace on the right is the agent&apos;s actual path through the turn.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-px lg:grid-cols-[1fr_20rem]" style={{ background: 'var(--line)' }}>
          <div className="flex min-h-[30rem] flex-col bg-surface">
            <div
              ref={transcriptRef}
              className="scrollbar-slim flex-1 space-y-6 overflow-y-auto p-6"
              style={{ maxHeight: '30rem' }}
              aria-live="polite"
            >
              {messages.map((message, index) => (
                <div key={index} className={message.role === 'user' ? 'text-right' : ''}>
                  <p className="mono mb-2 text-[10px] uppercase tracking-[0.16em] text-faint">
                    {message.role === 'user' ? 'you' : 'agent'}
                  </p>
                  <div
                    className={
                      message.role === 'user'
                        ? 'inline-block max-w-[85%] border px-4 py-3 text-left text-sm text-ink'
                        : 'text-sm leading-relaxed text-ink'
                    }
                    style={
                      message.role === 'user'
                        ? { borderColor: 'var(--line)', background: 'var(--bg-elevated)' }
                        : undefined
                    }
                  >
                    {message.content
                      ? message.content.split('\n\n').map((paragraph, paragraphIndex) => (
                          <p key={paragraphIndex} className={paragraphIndex > 0 ? 'mt-3' : undefined}>
                            {paragraph}
                          </p>
                        ))
                      : isStreaming && (
                          <span className="mono text-xs text-faint">working…</span>
                        )}
                  </div>

                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.sources.map((source) => (
                        <span key={`${source.source}-${source.title}`} className="tag">
                          {source.source}: {source.title.replace(`${source.source} - `, '')}
                        </span>
                      ))}
                    </div>
                  )}

                  {message.mode && (
                    <p className="mono mt-2 text-[10px] uppercase tracking-wider text-faint">
                      {message.mode}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t p-4" style={{ borderColor: 'var(--line)' }}>
              <div className="mb-3 flex flex-wrap gap-2">
                {agentSuggestions.slice(0, 3).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => ask(suggestion)}
                    disabled={isStreaming}
                    className="tag transition-colors hover:border-accent-line hover:text-accent disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  ask(input);
                }}
                className="flex gap-2"
              >
                <label htmlFor="agent-input" className="sr-only">
                  Ask the portfolio agent a question
                </label>
                <input
                  id="agent-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  maxLength={500}
                  placeholder="How is the LangGraph agent structured?"
                  className="field"
                  disabled={isStreaming}
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  aria-label="Send question"
                  className="btn-primary !px-4 disabled:opacity-40"
                >
                  <ArrowUpIcon className="h-4 w-4" />
                </button>
              </form>

              {error && (
                <p className="mt-3 text-xs" style={{ color: 'var(--accent)' }} role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>

          <aside className="bg-elevated p-6">
            <div className="flex items-center gap-2">
              <CommandLineIcon className="h-4 w-4 text-accent" />
              <h3 className="mono text-[11px] uppercase tracking-[0.16em] text-faint">Execution trace</h3>
            </div>

            {trace.length === 0 ? (
              <p className="mt-5 text-xs leading-relaxed text-faint">
                Ask a question to see the route, retrieval and tool steps for that turn.
              </p>
            ) : (
              <ol className="mt-5 space-y-4">
                {trace.map((step, index) => (
                  <motion.li
                    key={`${step.step}-${index}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-l pl-3"
                    style={{ borderColor: 'var(--accent-line)' }}
                  >
                    <p className="mono text-[11px] text-accent">{step.step}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{step.detail}</p>
                  </motion.li>
                ))}
              </ol>
            )}

            <div className="mt-8 border-t pt-5" style={{ borderColor: 'var(--line)' }}>
              <h3 className="mono text-[11px] uppercase tracking-[0.16em] text-faint">Also try</h3>
              <ul className="mt-3 space-y-2">
                {agentSuggestions.slice(3).map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      onClick={() => ask(suggestion)}
                      disabled={isStreaming}
                      className="text-left text-xs leading-relaxed text-muted transition-colors hover:text-accent disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
