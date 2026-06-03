import { z } from 'zod';

// Create category schema
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'ຊື່ໝວດໝູ່ຈຳເປັນ')
    .max(100, 'ຊື່ໝວດໝູ່ຕ້ອງສັ້ນກວ່າ 100 ຕົວອັກສອນ'),
  description: z
    .string()
    .max(1000, 'ຄຳອະທິບາຍຕ້ອງສັ້ນກວ່າ 1000 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  image: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

// Update category schema
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'ຊື່ໝວດໝູ່ຈຳເປັນ')
    .max(100, 'ຊື່ໝວດໝູ່ຕ້ອງສັ້ນກວ່າ 100 ຕົວອັກສອນ')
    .optional(),
  description: z
    .string()
    .max(1000, 'ຄຳອະທິບາຍຕ້ອງສັ້ນກວ່າ 1000 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  image: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// Category ID param schema
export const categoryIdSchema = z.object({
  id: z.string().cuid('Invalid category ID'),
});

export type CategoryIdParam = z.infer<typeof categoryIdSchema>;

// Category list query schema
export const categoryListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
