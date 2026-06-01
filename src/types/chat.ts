import type { MessageRole, Conversation, Message } from '@prisma/client';

// ===========================================
// Conversation Types
// ===========================================

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export interface ConversationListItem {
  id: string;
  title: string;
  updatedAt: Date;
  createdAt: Date;
  messageCount: number;
}

export interface CreateConversationInput {
  title?: string;
  userId: string;
}

export interface UpdateConversationInput {
  title?: string;
  isActive?: boolean;
}

// ===========================================
// Message Types
// ===========================================

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface CreateMessageInput {
  conversationId: string;
  role: MessageRole;
  content: string;
}

export interface StreamingMessage {
  id: string;
  role: 'ASSISTANT';
  content: string;
  isStreaming: boolean;
}

// ===========================================
// Chat Request/Response Types
// ===========================================

export interface SendMessageRequest {
  conversationId?: string;
  message: string;
}

export interface ChatStreamEvent {
  type: 'start' | 'delta' | 'done' | 'error';
  content?: string;
  conversationId?: string;
  messageId?: string;
  error?: string;
}

// ===========================================
// Chat State Types (for Zustand)
// ===========================================

export interface ChatState {
  conversations: ConversationListItem[];
  currentConversationId: string | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  error: string | null;
}

export interface ChatActions {
  // Conversation actions
  setConversations: (conversations: ConversationListItem[]) => void;
  addConversation: (conversation: ConversationListItem) => void;
  updateConversation: (id: string, data: Partial<ConversationListItem>) => void;
  removeConversation: (id: string) => void;
  setCurrentConversationId: (id: string | null) => void;

  // Message actions
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, content: string) => void;

  // Streaming actions
  setIsStreaming: (isStreaming: boolean) => void;
  setStreamingContent: (content: string) => void;
  appendStreamingContent: (content: string) => void;
  clearStreamingContent: () => void;

  // Loading states
  setIsLoadingConversations: (loading: boolean) => void;
  setIsLoadingMessages: (loading: boolean) => void;

  // Error handling
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

export type ChatStore = ChatState & ChatActions;
