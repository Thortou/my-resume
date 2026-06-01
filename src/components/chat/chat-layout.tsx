'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatSidebar } from './chat-sidebar';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { useChat } from '@/hooks/use-chat';
import { useConversations } from '@/hooks/use-conversations';
import { cn } from '@/lib/utils';

interface ChatLayoutProps {
  conversationId?: string;
}

export function ChatLayout({ conversationId }: ChatLayoutProps) {
  const { data: session } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [suggestionInput, setSuggestionInput] = useState('');

  const {
    messages,
    isStreaming,
    streamingContent,
    sendMessage,
    stopGenerating,
    regenerateResponse,
  } = useChat();

  const {
    conversations,
    currentConversationId,
    isLoadingConversations,
    createNewChat,
    selectConversation,
    deleteConversation,
    renameConversation,
    loadMessages,
  } = useConversations();

  // Load messages when conversationId changes
  const handleConversationChange = useCallback(
    async (id: string) => {
      await selectConversation(id);
    },
    [selectConversation]
  );

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (content: string) => {
      setSuggestionInput('');
      await sendMessage(content, currentConversationId);
    },
    [sendMessage, currentConversationId]
  );

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSuggestionInput(suggestion);
  }, []);

  return (
    <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          isLoading={isLoadingConversations}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNewChat={createNewChat}
          onSelectConversation={handleConversationChange}
          onDeleteConversation={deleteConversation}
          onRenameConversation={renameConversation}
        />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile header with sidebar toggle */}
          <div
            className={cn(
              'flex items-center border-b p-2 md:hidden',
              sidebarCollapsed ? '' : 'hidden'
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(false)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages area */}
          <ChatMessages
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            onRegenerate={regenerateResponse}
            onSuggestionClick={handleSuggestionClick}
            userImage={session?.user?.image}
            userName={session?.user?.name}
          />

          {/* Input area */}
          <ChatInput
            onSendMessage={handleSendMessage}
            onStopGenerating={stopGenerating}
            isStreaming={isStreaming}
            placeholder="Type a message..."
            initialValue={suggestionInput}
          />
        </div>
      </div>
  );
}
