import type { Message } from '@prisma/client';
import { messageRepository } from '@/repositories/message.repository';
import { conversationRepository } from '@/repositories/conversation.repository';
import { generateConversationTitle } from '@/lib/gemini';
import type { ActionState } from '@/types';
import type { ChatMessage } from '@/types/chat';

// Chat Service - Business logic for chat messages
export const chatService = {
  // Get messages for a conversation
  async getMessages(
    conversationId: string,
    userId: string
  ): Promise<ActionState<ChatMessage[]>> {
    // Check ownership
    const isOwner = await conversationRepository.isOwner(conversationId, userId);

    if (!isOwner) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    const messages = await messageRepository.findByConversationId(conversationId);

    const chatMessages: ChatMessage[] = messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    return {
      success: true,
      data: chatMessages,
    };
  },

  // Add a user message to a conversation
  async addUserMessage(
    conversationId: string,
    userId: string,
    content: string
  ): Promise<ActionState<Message>> {
    // Check ownership
    const isOwner = await conversationRepository.isOwner(conversationId, userId);

    if (!isOwner) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Create the user message
    const message = await messageRepository.create({
      conversationId,
      role: 'USER',
      content,
    });

    // Check if this is the first message and update title
    const messageCount = await messageRepository.countByConversationId(conversationId);

    if (messageCount === 1) {
      // Generate and update title asynchronously (don't await)
      generateConversationTitle(content)
        .then((title) => {
          conversationRepository.update(conversationId, { title });
        })
        .catch(() => {
          // Silently fail title generation
        });
    }

    return {
      success: true,
      data: message,
    };
  },

  // Add an assistant message to a conversation
  async addAssistantMessage(
    conversationId: string,
    content: string
  ): Promise<ActionState<Message>> {
    const message = await messageRepository.create({
      conversationId,
      role: 'ASSISTANT',
      content,
    });

    return {
      success: true,
      data: message,
    };
  },

  // Get conversation history for AI context (limited messages)
  async getConversationHistory(
    conversationId: string,
    limit: number = 50
  ): Promise<ChatMessage[]> {
    const messages = await messageRepository.findLatest(conversationId, limit);

    return messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt,
    }));
  },

  // Create a new conversation and add the first message
  async createConversationWithMessage(
    userId: string,
    content: string
  ): Promise<ActionState<{ conversationId: string; messageId: string }>> {
    // Create conversation
    const conversation = await conversationRepository.create({
      title: 'New Chat',
      user: {
        connect: { id: userId },
      },
    });

    // Add the first message
    const message = await messageRepository.create({
      conversationId: conversation.id,
      role: 'USER',
      content,
    });

    // Generate and update title asynchronously
    generateConversationTitle(content)
      .then((title) => {
        conversationRepository.update(conversation.id, { title });
      })
      .catch(() => {
        // Silently fail title generation
      });

    return {
      success: true,
      data: {
        conversationId: conversation.id,
        messageId: message.id,
      },
    };
  },

  // Update the last assistant message (for streaming)
  async updateLastAssistantMessage(
    conversationId: string,
    content: string
  ): Promise<ActionState<Message>> {
    const lastMessage = await messageRepository.getLastMessage(conversationId);

    if (!lastMessage || lastMessage.role !== 'ASSISTANT') {
      return {
        success: false,
        error: 'No assistant message to update',
      };
    }

    const message = await messageRepository.update(lastMessage.id, content);

    return {
      success: true,
      data: message,
    };
  },
};
