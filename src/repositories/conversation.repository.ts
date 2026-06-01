import type { Prisma, Conversation } from '@prisma/client';
import prisma from '@/lib/prisma';
import type { ConversationListItem, ConversationWithMessages } from '@/types/chat';

export interface ConversationFindManyParams {
  userId: string;
  page?: number;
  limit?: number;
}

export interface ConversationFindManyResult {
  conversations: ConversationListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Conversation Repository - Data access layer
export const conversationRepository = {
  // Find conversation by ID
  async findById(id: string): Promise<Conversation | null> {
    return prisma.conversation.findUnique({
      where: { id },
    });
  },

  // Find conversation by ID with messages
  async findByIdWithMessages(id: string): Promise<ConversationWithMessages | null> {
    return prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  // Find many conversations for a user with pagination
  async findMany(params: ConversationFindManyParams): Promise<ConversationFindManyResult> {
    const { userId, page = 1, limit = 20 } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.ConversationWhereInput = {
      userId,
      isActive: true,
    };

    // Execute queries in parallel
    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { messages: true },
          },
        },
      }),
      prisma.conversation.count({ where }),
    ]);

    // Transform to ConversationListItem format
    const conversationList: ConversationListItem[] = conversations.map((conv) => ({
      id: conv.id,
      title: conv.title,
      updatedAt: conv.updatedAt,
      createdAt: conv.createdAt,
      messageCount: conv._count.messages,
    }));

    return {
      conversations: conversationList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Create conversation
  async create(data: Prisma.ConversationCreateInput): Promise<Conversation> {
    return prisma.conversation.create({ data });
  },

  // Update conversation
  async update(id: string, data: Prisma.ConversationUpdateInput): Promise<Conversation> {
    return prisma.conversation.update({
      where: { id },
      data,
    });
  },

  // Soft delete conversation (set isActive to false)
  async softDelete(id: string): Promise<Conversation> {
    return prisma.conversation.update({
      where: { id },
      data: { isActive: false },
    });
  },

  // Hard delete conversation
  async delete(id: string): Promise<Conversation> {
    return prisma.conversation.delete({
      where: { id },
    });
  },

  // Check if user owns the conversation
  async isOwner(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });
    return !!conversation;
  },

  // Get conversation count for a user
  async countByUser(userId: string): Promise<number> {
    return prisma.conversation.count({
      where: {
        userId,
        isActive: true,
      },
    });
  },
};
