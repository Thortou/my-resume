'use client';

import { useCallback, useRef } from 'react';
import { useChatStore } from '@/stores/chat-store';
import type { ChatStreamEvent } from '@/types/chat';

export function useChat() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    messages,
    isStreaming,
    streamingContent,
    currentConversationId,
    setIsStreaming,
    setStreamingContent,
    appendStreamingContent,
    clearStreamingContent,
    addMessage,
    addConversation,
    updateConversation,
    setCurrentConversationId,
    setError,
  } = useChatStore();

  // Send a message and stream the response
  const sendMessage = useCallback(
    async (content: string, conversationId?: string | null) => {
      if (isStreaming) return;

      const targetConversationId = conversationId ?? currentConversationId;

      // Add user message to local state immediately
      const userMessage = {
        id: `temp-${Date.now()}`,
        role: 'USER' as const,
        content,
        createdAt: new Date(),
      };
      addMessage(userMessage);

      // Start streaming
      setIsStreaming(true);
      clearStreamingContent();
      setError(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId: targetConversationId,
            message: content,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send message');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let newConversationId: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;

              try {
                const data: ChatStreamEvent = JSON.parse(jsonStr);

                switch (data.type) {
                  case 'start':
                    if (data.conversationId) {
                      newConversationId = data.conversationId;
                      // If this is a new conversation, update the store
                      if (!targetConversationId) {
                        setCurrentConversationId(data.conversationId);
                        addConversation({
                          id: data.conversationId,
                          title: 'New Chat',
                          updatedAt: new Date(),
                          createdAt: new Date(),
                          messageCount: 1,
                        });
                      }
                    }
                    break;

                  case 'delta':
                    if (data.content) {
                      appendStreamingContent(data.content);
                    }
                    break;

                  case 'done':
                    // Add the complete assistant message
                    const finalContent = useChatStore.getState().streamingContent;
                    addMessage({
                      id: data.messageId || `assistant-${Date.now()}`,
                      role: 'ASSISTANT',
                      content: finalContent,
                      createdAt: new Date(),
                    });
                    // Update conversation's updatedAt
                    if (newConversationId || targetConversationId) {
                      updateConversation(
                        newConversationId || targetConversationId!,
                        { updatedAt: new Date() }
                      );
                    }
                    break;

                  case 'error':
                    throw new Error(data.error || 'Stream error');
                }
              } catch (parseError) {
                // Only log actual JSON parse errors, not empty strings
                if (jsonStr && jsonStr !== '') {
                  console.warn('Failed to parse SSE data:', jsonStr, parseError);
                }
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // Request was cancelled
          console.log('Request cancelled');
        } else {
          console.error('Chat error:', error);
          setError(
            error instanceof Error ? error.message : 'Failed to send message'
          );
        }
      } finally {
        setIsStreaming(false);
        clearStreamingContent();
        abortControllerRef.current = null;
      }
    },
    [
      isStreaming,
      currentConversationId,
      addMessage,
      setIsStreaming,
      clearStreamingContent,
      setError,
      appendStreamingContent,
      setCurrentConversationId,
      addConversation,
      updateConversation,
    ]
  );

  // Stop generating
  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, [setIsStreaming]);

  // Regenerate the last response
  const regenerateResponse = useCallback(async () => {
    if (messages.length < 2) return;

    // Find the last user message
    const lastUserMessageIndex = [...messages]
      .reverse()
      .findIndex((m) => m.role === 'USER');

    if (lastUserMessageIndex === -1) return;

    const actualIndex = messages.length - 1 - lastUserMessageIndex;
    const lastUserMessage = messages[actualIndex];

    // Remove all messages after the last user message (including the assistant response)
    const messagesToKeep = messages.slice(0, actualIndex);
    useChatStore.setState({ messages: messagesToKeep });

    // Re-send the message
    await sendMessage(lastUserMessage.content, currentConversationId);
  }, [messages, currentConversationId, sendMessage]);

  return {
    messages,
    isStreaming,
    streamingContent,
    sendMessage,
    stopGenerating,
    regenerateResponse,
  };
}
