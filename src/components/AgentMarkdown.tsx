"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  content: string;
  className?: string;
}

/**
 * Renders Groot's streamed answers as Markdown (lists, bold, code, links).
 * Kept intentionally small — chat replies, not full MDX pages.
 */
export default function AgentMarkdown({ content, className = '' }: Props) {
  return (
    <div className={`agent-md ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="agent-md__p">{children}</p>,
          ul: ({ children }) => <ul className="agent-md__ul">{children}</ul>,
          ol: ({ children }) => <ol className="agent-md__ol">{children}</ol>,
          li: ({ children }) => <li className="agent-md__li">{children}</li>,
          strong: ({ children }) => <strong className="agent-md__strong">{children}</strong>,
          em: ({ children }) => <em className="agent-md__em">{children}</em>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="agent-md__a">
              {children}
            </a>
          ),
          code: ({ className: codeClass, children }) => {
            const isBlock = Boolean(codeClass);
            if (isBlock) {
              return (
                <pre className="agent-md__pre">
                  <code className="agent-md__code">{children}</code>
                </pre>
              );
            }
            return <code className="agent-md__inline-code">{children}</code>;
          },
          pre: ({ children }) => <>{children}</>,
          h1: ({ children }) => <p className="agent-md__heading">{children}</p>,
          h2: ({ children }) => <p className="agent-md__heading">{children}</p>,
          h3: ({ children }) => <p className="agent-md__heading">{children}</p>,
          blockquote: ({ children }) => <blockquote className="agent-md__quote">{children}</blockquote>,
          hr: () => <hr className="agent-md__hr" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
