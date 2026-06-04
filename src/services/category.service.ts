import { categoryRepository } from '@/repositories/category.repository';
import type { ActionState } from '@/types';

// Helper to generate slug from name (URL-safe ASCII)
function generateSlug(name: string): string {
  // Generate a unique slug using timestamp and random string for non-ASCII names
  const asciiSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);

  // If slug is empty or too short (non-ASCII name), use a generated slug
  if (!asciiSlug || asciiSlug.length < 3) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `category-${timestamp}-${random}`;
  }

  return asciiSlug;
}

// Helper to ensure unique slug
async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await categoryRepository.slugExists(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const categoryService = {
  // Get all categories with pagination
  async getAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) {
    return categoryRepository.findAll(options);
  },

  // Get all active categories
  async getAllActive() {
    return categoryRepository.findAllActive();
  },

  // Get category by ID
  async getById(id: string) {
    return categoryRepository.findById(id);
  },

  // Get category by slug
  async getBySlug(slug: string) {
    return categoryRepository.findBySlug(slug);
  },

  // Create category
  async create(input: CreateCategoryInput): Promise<ActionState> {
    try {
      const slug = await ensureUniqueSlug(generateSlug(input.name));

      const category = await categoryRepository.create({
        name: input.name,
        slug,
        description: input.description,
        image: input.image,
        sortOrder: input.sortOrder ?? 0,
        isActive: input.isActive ?? true,
      });

      return {
        success: true,
        message: 'ສ້າງໝວດໝູ່ສຳເລັດແລ້ວ',
        data: category,
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດສ້າງໝວດໝູ່ໄດ້',
      };
    }
  },

  // Update category
  async update(id: string, input: UpdateCategoryInput): Promise<ActionState> {
    try {
      const existing = await categoryRepository.findById(id);
      if (!existing) {
        return {
          success: false,
          error: 'ບໍ່ພົບໝວດໝູ່',
        };
      }

      const updateData: Record<string, unknown> = {};

      if (input.name !== undefined) {
        updateData.name = input.name;
        // Update slug if name changed
        if (input.name !== existing.name) {
          updateData.slug = await ensureUniqueSlug(
            generateSlug(input.name),
            id
          );
        }
      }
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.image !== undefined) updateData.image = input.image;
      if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;

      const category = await categoryRepository.update(id, updateData);

      return {
        success: true,
        message: 'ອັບເດດໝວດໝູ່ສຳເລັດແລ້ວ',
        data: category,
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດອັບເດດໝວດໝູ່ໄດ້',
      };
    }
  },

  // Delete category
  async delete(id: string): Promise<ActionState> {
    try {
      const existing = await categoryRepository.findById(id);
      if (!existing) {
        return {
          success: false,
          error: 'ບໍ່ພົບໝວດໝູ່',
        };
      }

      // Check if category has products
      if (existing._count.products > 0) {
        return {
          success: false,
          error: `ບໍ່ສາມາດລຶບໝວດໝູ່ໄດ້ ເພາະມີ ${existing._count.products} ສິນຄ້າ`,
        };
      }

      await categoryRepository.delete(id);

      return {
        success: true,
        message: 'ລຶບໝວດໝູ່ສຳເລັດແລ້ວ',
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດລຶບໝວດໝູ່ໄດ້',
      };
    }
  },

  // Get total count
  async getTotalCount() {
    return categoryRepository.count();
  },

  // Get active count
  async getActiveCount() {
    return categoryRepository.count({ isActive: true });
  },
};
