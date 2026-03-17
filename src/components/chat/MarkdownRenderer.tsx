"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders AI responses as formatted Markdown with proper styling.
 * Supports headings, lists, code blocks, tables, links, and GFM extensions.
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="text-lg font-bold mt-4 mb-2 text-[var(--foreground)]">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-base font-bold mt-3 mb-2 text-[var(--foreground)]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-sm font-bold mt-3 mb-1 text-[var(--foreground)]">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-2 space-y-1 ml-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-2 space-y-1 ml-1">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    code: ({ className: codeClassName, children, ...props }) => {
      const isInline = !codeClassName;
      if (isInline) {
        return (
          <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[0.85em] font-mono">
            {children}
          </code>
        );
      }
      const language = codeClassName?.replace('language-', '') || '';
      return (
        <div className="my-3 rounded-lg overflow-hidden border border-[var(--border)]">
          {language && (
            <div className="px-3 py-1 bg-black/5 dark:bg-white/5 text-xs text-[var(--muted-foreground)] font-mono border-b border-[var(--border)]">
              {language}
            </div>
          )}
          <pre className="p-3 overflow-x-auto bg-black/5 dark:bg-white/5">
            <code className={`text-[0.85em] font-mono ${codeClassName || ''}`} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
    pre: ({ children }) => <>{children}</>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-3 border-[#667eea] pl-3 my-2 italic text-[var(--muted-foreground)]">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="my-3 overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-black/5 dark:bg-white/5">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2 text-left font-semibold border-b border-[var(--border)]">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 border-b border-[var(--border)]">{children}</td>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#667eea] dark:text-[#818cf8] underline underline-offset-2 hover:opacity-80"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    hr: () => (
      <hr className="my-3 border-[var(--border)]" />
    ),
  };

  return (
    <div className={`markdown-prose text-sm leading-relaxed break-words ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
