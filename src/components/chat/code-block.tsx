'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [children]);

  return (
    <div className={cn('group relative', className)}>
      {language && (
        <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted/50 px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            {language}
          </span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <pre
        className={cn(
          'overflow-x-auto bg-muted p-4 text-sm',
          language ? 'rounded-b-lg border border-t-0 border-border' : 'rounded-lg border border-border'
        )}
      >
        <code className={language ? `language-${language}` : ''}>{children}</code>
      </pre>
      {!language && (
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 flex items-center gap-1 rounded bg-background/80 p-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
      )}
    </div>
  );
}
