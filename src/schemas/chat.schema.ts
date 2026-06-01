import { z } from 'zod';

// Message role enum
const messageRoleEnum = z.enum(['USER', 'ASSISTANT', 'SYSTEM']);

// ===========================================
// Conversation Schemas
// ===========================================

export const createConversationSchema = z.object({
  title: z.string().max(200, 'Title must be less than 200 characters').optional(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;

export const updateConversationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;

export const conversationIdSchema = z.object({
  id: z.string().cuid('Invalid conversation ID'),
});

export type ConversationIdParam = z.infer<typeof conversationIdSchema>;

// ===========================================
// Message Schemas
// ===========================================

export const createMessageSchema = z.object({
  conversationId: z.string().cuid('Invalid conversation ID'),
  role: messageRoleEnum,
  content: z.string().min(1, 'Message content is required'),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

// ===========================================
// Chat API Schemas
// ===========================================

export const sendMessageSchema = z.object({
  conversationId: z.string().cuid('Invalid conversation ID').nullish(),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(32000, 'Message is too long'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// ===========================================
// Conversation List Query Schema
// ===========================================

export const conversationListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export type ConversationListQuery = z.infer<typeof conversationListQuerySchema>;
