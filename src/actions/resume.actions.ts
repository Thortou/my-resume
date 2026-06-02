'use server';

import { revalidatePath } from 'next/cache';
import { resumeService } from '@/services/resume.service';
import {
  createResumeSchema,
  updateResumeSchema,
  type CreateResumeInput,
  type UpdateResumeInput,
} from '@/schemas/resume.schema';
import type { ActionState } from '@/types';
import type { ResumeData } from '@/types/resume';
import { getCurrentUser } from '@/lib/auth';

// Helper to get current user ID
async function getCurrentUserId(): Promise<string | null> {
  const currentUser = await getCurrentUser();
  return currentUser?.id ?? null;
}

// Get all resumes for the current user
export async function getResumesAction(): Promise<ActionState<ResumeData[]>> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  return resumeService.getAllByUserId(userId);
}

// Get resume by ID (for editing)
export async function getResumeByIdAction(
  id: string
): Promise<ActionState<ResumeData>> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  return resumeService.getByIdForUser(id, userId);
}

// Get public resume by slug
export async function getPublicResumeAction(
  slug: string
): Promise<ActionState<ResumeData>> {
  return resumeService.getPublicBySlug(slug);
}

// Create resume
export async function createResumeAction(
  input: CreateResumeInput
): Promise<ActionState<ResumeData>> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validate input
  const validatedFields = createResumeSchema.safeParse(input);

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

  const result = await resumeService.create({
    userId,
    ...validatedFields.data,
  });

  if (result.success) {
    revalidatePath('/resumes');
  }

  return result;
}

// Update resume
export async function updateResumeAction(
  id: string,
  input: UpdateResumeInput
): Promise<ActionState<ResumeData>> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validate input
  const validatedFields = updateResumeSchema.safeParse(input);

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

  const result = await resumeService.update(id, userId, validatedFields.data);

  if (result.success) {
    revalidatePath('/resumes');
    revalidatePath(`/resumes/${id}/edit`);
    if (result.data?.slug) {
      revalidatePath(`/r/${result.data.slug}`);
    }
  }

  return result;
}

// Delete resume
export async function deleteResumeAction(
  id: string
): Promise<ActionState<ResumeData>> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const result = await resumeService.delete(id, userId);

  if (result.success) {
    revalidatePath('/resumes');
  }

  return result;
}

// Get resume count for current user
export async function getResumeCountAction(): Promise<ActionState<number>> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  return resumeService.getCountByUserId(userId);
}
