'use server';

import { revalidatePath } from 'next/cache';
import { bannerService } from '@/services';
import {
  createBannerSchema,
  updateBannerSchema,
  type CreateBannerInput,
  type UpdateBannerInput,
} from '@/schemas';
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

// Get all banners (admin)
export async function getBannersAction(params: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  return bannerService.getAll(params);
}

// Get all active banners (public)
export async function getActiveBannersAction(): Promise<ActionState> {
  return bannerService.getAllActive();
}

// Get banner by ID
export async function getBannerByIdAction(id: string): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  return bannerService.getById(id);
}

// Create banner
export async function createBannerAction(
  input: CreateBannerInput
): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  // Validate input
  const validatedFields = createBannerSchema.safeParse(input);

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

  const result = await bannerService.create(validatedFields.data);

  if (result.success) {
    revalidatePath('/admin/banners');
    revalidatePath('/');
  }

  return result;
}

// Update banner
export async function updateBannerAction(
  id: string,
  input: UpdateBannerInput
): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  // Validate input
  const validatedFields = updateBannerSchema.safeParse(input);

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

  const result = await bannerService.update(id, validatedFields.data);

  if (result.success) {
    revalidatePath('/admin/banners');
    revalidatePath('/');
  }

  return result;
}

// Delete banner
export async function deleteBannerAction(id: string): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  const result = await bannerService.delete(id);

  if (result.success) {
    revalidatePath('/admin/banners');
    revalidatePath('/');
  }

  return result;
}

// Get banner statistics
export async function getBannerStatisticsAction(): Promise<ActionState> {
  const accessError = await checkAdminAccess();
  if (accessError) return accessError;

  return bannerService.getStatistics();
}
