'use client';

import { Plus, PanelLeftClose, PanelLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatSidebarItem } from './chat-sidebar-item';
import { cn } from '@/lib/utils';
import type { ConversationListItem } from '@/types/chat';

interface ChatSidebarProps {
  conversations: ConversationListItem[];
  currentConversationId: string | null;
  isLoading: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  isLoading,
  isCollapsed,
  onToggle,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}: ChatSidebarProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col border-r bg-muted/30 transition-all duration-300',
        isCollapsed ? 'w-0 overflow-hidden' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        )}
      </div>

      {/* Conversation list */}
      {!isCollapsed && (
        <ScrollArea className="flex-1 p-2">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start a new chat to begin
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <ChatSidebarItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === currentConversationId}
                  onSelect={() => onSelectConversation(conversation.id)}
                  onDelete={() => onDeleteConversation(conversation.id)}
                  onRename={(title) =>
                    onRenameConversation(conversation.id, title)
                  }
                />
              ))}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}
