import type { Prisma, Message, MessageRole } from '@prisma/client';
import prisma from '@/lib/prisma';

// Message Repository - Data access layer
export const messageRepository = {
  // Find message by ID
  async findById(id: string): Promise<Message | null> {
    return prisma.message.findUnique({
      where: { id },
    });
  },

  // Find all messages in a conversation
  async findByConversationId(conversationId: string): Promise<Message[]> {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  },

  // Find latest messages in a conversation (for context)
  async findLatest(conversationId: string, limit: number = 50): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    // Reverse to get chronological order
    return messages.reverse();
  },

  // Create message
  async create(data: {
    conversationId: string;
    role: MessageRole;
    content: string;
  }): Promise<Message> {
    // Create message and update conversation's updatedAt
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId: data.conversationId,
          role: data.role,
          content: data.content,
        },
      }),
      prisma.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  },

  // Create many messages (for batch operations)
  async createMany(
    messages: Array<{
      conversationId: string;
      role: MessageRole;
      content: string;
    }>
  ): Promise<Prisma.BatchPayload> {
    return prisma.message.createMany({
      data: messages,
    });
  },

  // Update message content
  async update(id: string, content: string): Promise<Message> {
    return prisma.message.update({
      where: { id },
      data: { content },
    });
  },

  // Delete message
  async delete(id: string): Promise<Message> {
    return prisma.message.delete({
      where: { id },
    });
  },

  // Delete all messages in a conversation
  async deleteByConversationId(conversationId: string): Promise<Prisma.BatchPayload> {
    return prisma.message.deleteMany({
      where: { conversationId },
    });
  },

  // Count messages in a conversation
  async countByConversationId(conversationId: string): Promise<number> {
    return prisma.message.count({
      where: { conversationId },
    });
  },

  // Get the last message in a conversation
  async getLastMessage(conversationId: string): Promise<Message | null> {
    return prisma.message.findFirst({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
