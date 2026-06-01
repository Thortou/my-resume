'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChatLayout } from '@/components/chat';
import { useChatStore } from '@/stores/chat-store';
import { getMessagesAction } from '@/actions/chat.actions';

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  const {
    setCurrentConversationId,
    setMessages,
    setIsLoadingMessages,
    setError,
  } = useChatStore();

  // Load conversation messages on mount
  useEffect(() => {
    async function loadConversation() {
      setCurrentConversationId(conversationId);
      setIsLoadingMessages(true);

      try {
        const result = await getMessagesAction(conversationId);

        if (result.success && result.data) {
          setMessages(result.data);
        } else {
          setError(result.error || 'Failed to load messages');
        }
      } catch (error) {
        console.error('Failed to load conversation:', error);
        setError('Failed to load conversation');
      } finally {
        setIsLoadingMessages(false);
      }
    }

    loadConversation();
  }, [
    conversationId,
    setCurrentConversationId,
    setMessages,
    setIsLoadingMessages,
    setError,
  ]);

  return <ChatLayout conversationId={conversationId} />;
}
