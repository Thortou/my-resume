'use server';

import { revalidatePath } from 'next/cache';
import type { Role, User } from '@prisma/client';
import { userService } from '@/services';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from '@/schemas';
import type { ActionState } from '@/types';
import { getCurrentUser } from '@/lib/auth';

// Get current logged in user action
export async function getCurrentUserAction() {
  const user = await getCurrentUser();
  return user;
}

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

// Get all users action
export async function getUsersAction(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<
  ActionState<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>
> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError as ActionState<never>;

  return userService.getAll(params);
}

// Get user by ID action
export async function getUserByIdAction(id: string): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  return userService.getById(id);
}

// Create user action
export async function createUserAction(
  input: CreateUserInput
): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  // Validate input
  const validatedFields = createUserSchema.safeParse(input);

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

  const result = await userService.create(validatedFields.data);

  if (result.success) {
    revalidatePath('/admin/users');
  }

  return result;
}

// Update user action
export async function updateUserAction(
  id: string,
  input: UpdateUserInput
): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  // Validate input
  const validatedFields = updateUserSchema.safeParse(input);

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

  const result = await userService.update(id, validatedFields.data);

  if (result.success) {
    revalidatePath('/admin/users');
  }

  return result;
}

// Delete user action
export async function deleteUserAction(id: string): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  const currentUser = await getCurrentUser();

  // Prevent self-deletion
  if (currentUser?.id === id) {
    return {
      success: false,
      error: 'You cannot delete your own account',
    };
  }

  const result = await userService.delete(id);

  if (result.success) {
    revalidatePath('/admin/users');
  }

  return result;
}

// Get user statistics action
export async function getUserStatisticsAction(): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  return userService.getStatistics();
}
