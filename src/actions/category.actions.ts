'use server';

import { auth } from '@/lib/auth';
import { categoryService } from '@/services/category.service';
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from '@/schemas/category.schema';
import type { ActionState } from '@/types';

// Get all categories with pagination
export async function getCategoriesAction(options?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}) {
  return categoryService.getAll(options);
}

// Get all active categories (for dropdowns)
export async function getActiveCategoriesAction() {
  return categoryService.getAllActive();
}

// Get category by ID
export async function getCategoryByIdAction(id: string) {
  return categoryService.getById(id);
}

// Create category (admin only)
export async function createCategoryAction(
  input: CreateCategoryInput
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  // Validate input
  const validatedFields = createCategorySchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
      errors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const data = {
    ...validatedFields.data,
    description: validatedFields.data.description ?? undefined,
    image: validatedFields.data.image ?? undefined,
  };
  return categoryService.create(data);
}

// Update category (admin only)
export async function updateCategoryAction(
  id: string,
  input: UpdateCategoryInput
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  // Validate input
  const validatedFields = updateCategorySchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
      errors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const data = {
    ...validatedFields.data,
    description: validatedFields.data.description ?? undefined,
    image: validatedFields.data.image ?? undefined,
  };
  return categoryService.update(id, data);
}

// Delete category (admin only)
export async function deleteCategoryAction(id: string): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  return categoryService.delete(id);
}
