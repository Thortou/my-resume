import { z } from 'zod';

// Create banner schema
export const createBannerSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  image: z.string().min(1, 'Image is required'),
  link: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;

// Update banner schema
export const updateBannerSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  image: z.string().min(1, 'Image is required').optional(),
  link: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;

// Banner ID param schema
export const bannerIdSchema = z.object({
  id: z.string().cuid('Invalid banner ID'),
});

export type BannerIdParam = z.infer<typeof bannerIdSchema>;

// Banner list query schema
export const bannerListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  sortBy: z.enum(['title', 'sortOrder', 'createdAt']).default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type BannerListQuery = z.infer<typeof bannerListQuerySchema>;
