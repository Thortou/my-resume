import { create } from 'zustand';
import type { ChatStore, ConversationListItem, ChatMessage } from '@/types/chat';

const initialState = {
  conversations: [] as ConversationListItem[],
  currentConversationId: null as string | null,
  messages: [] as ChatMessage[],
  isStreaming: false,
  streamingContent: '',
  isLoadingConversations: false,
  isLoadingMessages: false,
  error: null as string | null,
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  // Conversation actions
  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  updateConversation: (id, data) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...data } : conv
      ),
    })),

  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((conv) => conv.id !== id),
      currentConversationId:
        state.currentConversationId === id ? null : state.currentConversationId,
      messages: state.currentConversationId === id ? [] : state.messages,
    })),

  setCurrentConversationId: (id) =>
    set({
      currentConversationId: id,
      messages: [],
      streamingContent: '',
      error: null,
    }),

  // Message actions
  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg
      ),
    })),

  // Streaming actions
  setIsStreaming: (isStreaming) => set({ isStreaming }),

  setStreamingContent: (content) => set({ streamingContent: content }),

  appendStreamingContent: (content) =>
    set((state) => ({
      streamingContent: state.streamingContent + content,
    })),

  clearStreamingContent: () => set({ streamingContent: '' }),

  // Loading states
  setIsLoadingConversations: (loading) =>
    set({ isLoadingConversations: loading }),

  setIsLoadingMessages: (loading) => set({ isLoadingMessages: loading }),

  // Error handling
  setError: (error) => set({ error }),

  // Reset
  reset: () => set(initialState),
}));
