'use client';

import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Check, Copy, RefreshCw, User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChatMessageContent } from './chat-message-content';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
  streamingContent?: string;
  onRegenerate?: () => void;
  userImage?: string | null;
  userName?: string | null;
}

export function ChatMessage({
  message,
  isStreaming,
  streamingContent,
  onRegenerate,
  userImage,
  userName,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'USER';
  const displayContent = isStreaming ? streamingContent : message.content;

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [message.content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('group flex gap-4 px-4 py-6', isUser ? 'bg-transparent' : 'bg-muted/30')}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <>
            <AvatarImage src={userImage || undefined} alt={userName || 'User'} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>

      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {isUser ? userName || 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.createdAt), 'h:mm a')}
          </span>
        </div>

        {/* Message content */}
        <div className="text-sm">
          {displayContent ? (
            <ChatMessageContent content={displayContent} />
          ) : isStreaming ? (
            <span className="inline-block h-4 w-2 animate-pulse bg-foreground/70" />
          ) : null}
        </div>

        {/* Actions */}
        {!isUser && !isStreaming && message.content && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? 'Copied!' : 'Copy message'}
              </TooltipContent>
            </Tooltip>

            {onRegenerate && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onRegenerate}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Regenerate response</TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
