'use client';

import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from 'react';
import { Send, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStopGenerating?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  initialValue?: string;
}

export function ChatInput({
  onSendMessage,
  onStopGenerating,
  isStreaming = false,
  disabled = false,
  placeholder = 'Type a message...',
  initialValue = '',
}: ChatInputProps) {
  const [message, setMessage] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update message when initialValue changes (for suggestions)
  useEffect(() => {
    if (initialValue) {
      setMessage(initialValue);
      textareaRef.current?.focus();
    }
  }, [initialValue]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isStreaming && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [message, isStreaming, disabled, onSendMessage]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Send on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const canSend = message.trim().length > 0 && !isStreaming && !disabled;

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2 rounded-lg border bg-background shadow-sm">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isStreaming || disabled}
            className={cn(
              'min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent px-4 py-3 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            rows={1}
          />

          <div className="absolute bottom-2 right-2">
            <AnimatePresence mode="wait">
              {isStreaming ? (
                <motion.div
                  key="stop"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={onStopGenerating}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    type="button"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!canSend}
                    onClick={handleSend}
                  >
                    {disabled ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Enter</kbd> to send,{' '}
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
}
