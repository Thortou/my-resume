import type { Conversation } from '@prisma/client';
import { conversationRepository } from '@/repositories/conversation.repository';
import type { UpdateConversationInput } from '@/schemas/chat.schema';
import type { ActionState } from '@/types';
import type { ConversationListItem, ConversationWithMessages } from '@/types/chat';

// Conversation Service - Business logic layer
export const conversationService = {
  // Get conversation by ID
  async getById(id: string): Promise<ActionState<Conversation>> {
    const conversation = await conversationRepository.findById(id);

    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    return {
      success: true,
      data: conversation,
    };
  },

  // Get conversation by ID with messages
  async getByIdWithMessages(
    id: string,
    userId: string
  ): Promise<ActionState<ConversationWithMessages>> {
    // Check ownership first
    const isOwner = await conversationRepository.isOwner(id, userId);

    if (!isOwner) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    const conversation = await conversationRepository.findByIdWithMessages(id);

    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    return {
      success: true,
      data: conversation,
    };
  },

  // Get all conversations for a user
  async getAll(params: {
    userId: string;
    page?: number;
    limit?: number;
  }): Promise<
    ActionState<{
      conversations: ConversationListItem[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    const result = await conversationRepository.findMany(params);

    return {
      success: true,
      data: result,
    };
  },

  // Create conversation
  async create(
    userId: string,
    title?: string
  ): Promise<ActionState<Conversation>> {
    const conversation = await conversationRepository.create({
      title: title || 'New Chat',
      user: {
        connect: { id: userId },
      },
    });

    return {
      success: true,
      data: conversation,
      message: 'Conversation created successfully',
    };
  },

  // Update conversation
  async update(
    id: string,
    userId: string,
    input: UpdateConversationInput
  ): Promise<ActionState<Conversation>> {
    // Check ownership
    const isOwner = await conversationRepository.isOwner(id, userId);

    if (!isOwner) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Update conversation
    const conversation = await conversationRepository.update(id, input);

    return {
      success: true,
      data: conversation,
      message: 'Conversation updated successfully',
    };
  },

  // Delete conversation (soft delete)
  async delete(id: string, userId: string): Promise<ActionState<Conversation>> {
    // Check ownership
    const isOwner = await conversationRepository.isOwner(id, userId);

    if (!isOwner) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Soft delete
    const conversation = await conversationRepository.softDelete(id);

    return {
      success: true,
      data: conversation,
      message: 'Conversation deleted successfully',
    };
  },

  // Update conversation title
  async updateTitle(
    id: string,
    userId: string,
    title: string
  ): Promise<ActionState<Conversation>> {
    // Check ownership
    const isOwner = await conversationRepository.isOwner(id, userId);

    if (!isOwner) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    const conversation = await conversationRepository.update(id, { title });

    return {
      success: true,
      data: conversation,
      message: 'Title updated successfully',
    };
  },

  // Check if user owns the conversation
  async isOwner(conversationId: string, userId: string): Promise<boolean> {
    return conversationRepository.isOwner(conversationId, userId);
  },
};
