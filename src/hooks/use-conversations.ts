'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/stores/chat-store';
import {
  getConversationsAction,
  getMessagesAction,
  deleteConversationAction,
  renameConversationAction,
} from '@/actions/chat.actions';

export function useConversations() {
  const router = useRouter();

  const {
    conversations,
    currentConversationId,
    isLoadingConversations,
    isLoadingMessages,
    setConversations,
    setCurrentConversationId,
    setMessages,
    removeConversation,
    updateConversation,
    setIsLoadingConversations,
    setIsLoadingMessages,
    setError,
  } = useChatStore();

  // Load conversations
  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    setError(null);

    try {
      const result = await getConversationsAction();

      if (result.success && result.data) {
        setConversations(result.data.conversations);
      } else {
        setError(result.error || 'Failed to load conversations');
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setError('Failed to load conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  }, [setConversations, setIsLoadingConversations, setError]);

  // Load messages for a conversation
  const loadMessages = useCallback(
    async (conversationId: string) => {
      setIsLoadingMessages(true);
      setError(null);

      try {
        const result = await getMessagesAction(conversationId);

        if (result.success && result.data) {
          setMessages(result.data);
        } else {
          setError(result.error || 'Failed to load messages');
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        setError('Failed to load messages');
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [setMessages, setIsLoadingMessages, setError]
  );

  // Select a conversation
  const selectConversation = useCallback(
    async (conversationId: string) => {
      setCurrentConversationId(conversationId);
      router.push(`/chat/${conversationId}`);
      await loadMessages(conversationId);
    },
    [setCurrentConversationId, loadMessages, router]
  );

  // Create new chat
  const createNewChat = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
    router.push('/chat');
  }, [setCurrentConversationId, setMessages, router]);

  // Delete conversation
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      try {
        const result = await deleteConversationAction(conversationId);

        if (result.success) {
          removeConversation(conversationId);

          // If the deleted conversation was current, go to new chat
          if (currentConversationId === conversationId) {
            createNewChat();
          }
        } else {
          setError(result.error || 'Failed to delete conversation');
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        setError('Failed to delete conversation');
      }
    },
    [removeConversation, currentConversationId, createNewChat, setError]
  );

  // Rename conversation
  const renameConversation = useCallback(
    async (conversationId: string, title: string) => {
      try {
        const result = await renameConversationAction(conversationId, title);

        if (result.success) {
          updateConversation(conversationId, { title });
        } else {
          setError(result.error || 'Failed to rename conversation');
        }
      } catch (error) {
        console.error('Failed to rename conversation:', error);
        setError('Failed to rename conversation');
      }
    },
    [updateConversation, setError]
  );

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    currentConversationId,
    isLoadingConversations,
    isLoadingMessages,
    loadConversations,
    loadMessages,
    selectConversation,
    createNewChat,
    deleteConversation,
    renameConversation,
  };
}
