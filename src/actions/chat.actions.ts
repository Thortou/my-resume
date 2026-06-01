'use server';

import { revalidatePath } from 'next/cache';
import { conversationService } from '@/services/conversation.service';
import { chatService } from '@/services/chat.service';
import {
  updateConversationSchema,
  type UpdateConversationInput,
} from '@/schemas/chat.schema';
import type { ActionState } from '@/types';
import type { ConversationListItem, ConversationWithMessages, ChatMessage } from '@/types/chat';
import { getCurrentUser } from '@/lib/auth';

// Helper to check user authentication
async function checkAuth(): Promise<{ userId: string } | ActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      error: 'Please sign in to continue',
    };
  }

  return { userId: currentUser.id };
}

// Get all conversations for the current user
export async function getConversationsAction(params?: {
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
  const auth = await checkAuth();
  if ('success' in auth) return auth;

  return conversationService.getAll({
    userId: auth.userId,
    ...params,
  });
}

// Get a single conversation with messages
export async function getConversationAction(
  conversationId: string
): Promise<ActionState<ConversationWithMessages>> {
  const auth = await checkAuth();
  if ('success' in auth) return auth;

  return conversationService.getByIdWithMessages(conversationId, auth.userId);
}

// Get messages for a conversation
export async function getMessagesAction(
  conversationId: string
): Promise<ActionState<ChatMessage[]>> {
  const auth = await checkAuth();
  if ('success' in auth) return auth;

  return chatService.getMessages(conversationId, auth.userId);
}

// Create a new conversation
export async function createConversationAction(
  title?: string
): Promise<ActionState<{ id: string; title: string }>> {
  const auth = await checkAuth();
  if ('success' in auth) return auth;

  const result = await conversationService.create(auth.userId, title);

  if (result.success && result.data) {
    revalidatePath('/chat');
    return {
      success: true,
      data: {
        id: result.data.id,
        title: result.data.title,
      },
    };
  }

  return result as ActionState<{ id: string; title: string }>;
}

// Update conversation (title)
export async function updateConversationAction(
  conversationId: string,
  input: UpdateConversationInput
): Promise<ActionState> {
  const auth = await checkAuth();
  if ('success' in auth) return auth;

  // Validate input
  const validatedFields = updateConversationSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const result = await conversationService.update(
    conversationId,
    auth.userId,
    validatedFields.data
  );

  if (result.success) {
    revalidatePath('/chat');
  }

  return result;
}

// Delete conversation
export async function deleteConversationAction(
  conversationId: string
): Promise<ActionState> {
  const auth = await checkAuth();
  if ('success' in auth) return auth;

  const result = await conversationService.delete(conversationId, auth.userId);

  if (result.success) {
    revalidatePath('/chat');
  }

  return result;
}

// Rename conversation
export async function renameConversationAction(
  conversationId: string,
  title: string
): Promise<ActionState> {
  const auth = await checkAuth();
  if ('success' in auth) return auth;

  if (!title.trim()) {
    return {
      success: false,
      error: 'Title is required',
    };
  }

  const result = await conversationService.updateTitle(
    conversationId,
    auth.userId,
    title.trim()
  );

  if (result.success) {
    revalidatePath('/chat');
  }

  return result;
}
