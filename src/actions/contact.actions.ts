'use server';

import { revalidatePath } from 'next/cache';
import { contactService } from '@/services/contact.service';
import { contactSchema, type ContactInput } from '@/schemas';
import type { ActionState } from '@/types';
import { getCurrentUser } from '@/lib/auth';

// Helper to check admin access
async function checkAdminAccess(): Promise<ActionState | null> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  if (currentUser.role !== 'ADMIN') {
    return {
      success: false,
      error: 'Access denied',
    };
  }

  return null;
}

// Submit contact form (public - no auth required)
export async function submitContactAction(
  input: ContactInput
): Promise<ActionState> {
  // Validate input server-side
  const validatedFields = contactSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const result = await contactService.submit(validatedFields.data);

  return result;
}

// Get all contacts (admin only)
export async function getContactsAction(params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  return contactService.getAll(params);
}

// Get contact by ID (admin only)
export async function getContactByIdAction(id: string): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  return contactService.getById(id);
}

// Delete contact (admin only)
export async function deleteContactAction(id: string): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  const result = await contactService.delete(id);

  if (result.success) {
    revalidatePath('/admin/contacts');
  }

  return result;
}

// Get contact statistics (admin only)
export async function getContactStatisticsAction(): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  return contactService.getStatistics();
}
