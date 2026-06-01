'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { CodeBlock } from './code-block';
import { cn } from '@/lib/utils';

// Import highlight.js styles
import 'highlight.js/styles/github-dark.css';

interface ChatMessageContentProps {
  content: string;
  className?: string;
}

export function ChatMessageContent({
  content,
  className,
}: ChatMessageContentProps) {
  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom code block rendering
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock language={match[1]}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            );
          },
          // Custom pre rendering (remove default wrapping)
          pre({ children }) {
            return <>{children}</>;
          },
          // Custom link rendering
          a({ href, children, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Custom table rendering
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          // Custom blockquote rendering
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          // Custom list rendering
          ul({ children, ...props }) {
            return (
              <ul className="list-disc pl-6 space-y-1" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol className="list-decimal pl-6 space-y-1" {...props}>
                {children}
              </ol>
            );
          },
          // Custom heading rendering
          h1({ children, ...props }) {
            return (
              <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }) {
            return (
              <h2 className="text-xl font-bold mt-5 mb-3" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            return (
              <h3 className="text-lg font-bold mt-4 mb-2" {...props}>
                {children}
              </h3>
            );
          },
          // Custom paragraph rendering
          p({ children, ...props }) {
            return (
              <p className="mb-3 last:mb-0 leading-relaxed" {...props}>
                {children}
              </p>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
