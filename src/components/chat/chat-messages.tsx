'use client';

import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { ChatLoading } from './chat-loading';
import { ChatWelcome } from './chat-welcome';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { useChatStore } from '@/stores/chat-store';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isStreaming: boolean;
  streamingContent: string;
  onRegenerate: () => void;
  onSuggestionClick?: (suggestion: string) => void;
  userImage?: string | null;
  userName?: string | null;
}

export function ChatMessages({
  messages,
  isStreaming,
  streamingContent,
  onRegenerate,
  onSuggestionClick,
  userImage,
  userName,
}: ChatMessagesProps) {
  const { isLoadingMessages } = useChatStore();

  // Auto-scroll when messages change or streaming content updates
  const { containerRef, scrollToBottom } = useAutoScroll<HTMLDivElement>({
    dependency: isStreaming ? streamingContent : messages.length,
  });

  // Scroll to bottom on initial load
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          <span>Loading messages...</span>
        </div>
      </div>
    );
  }

  if (messages.length === 0 && !isStreaming) {
    return <ChatWelcome onSuggestionClick={onSuggestionClick} />;
  }

  return (
    <ScrollArea className="flex-1" ref={containerRef}>
      <div className="mx-auto max-w-3xl">
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          const isLastAssistantMessage =
            isLastMessage && message.role === 'ASSISTANT';

          return (
            <ChatMessage
              key={message.id}
              message={message}
              isStreaming={isLastAssistantMessage && isStreaming}
              streamingContent={
                isLastAssistantMessage && isStreaming
                  ? streamingContent
                  : undefined
              }
              onRegenerate={isLastAssistantMessage ? onRegenerate : undefined}
              userImage={userImage}
              userName={userName}
            />
          );
        })}

        {/* Show streaming message when there's content to display */}
        {isStreaming && streamingContent && (messages.length === 0 || messages[messages.length - 1]?.role === 'USER') && (
          <ChatMessage
            message={{
              id: 'streaming',
              role: 'ASSISTANT',
              content: '',
              createdAt: new Date(),
            }}
            isStreaming={true}
            streamingContent={streamingContent}
            userImage={userImage}
            userName={userName}
          />
        )}

        {/* Loading indicator when waiting for stream to start */}
        {isStreaming && !streamingContent && (messages.length === 0 || messages[messages.length - 1]?.role === 'USER') && (
          <ChatLoading />
        )}
      </div>
    </ScrollArea>
  );
}
