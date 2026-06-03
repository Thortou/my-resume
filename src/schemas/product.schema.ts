import { z } from 'zod';

// Create product schema
export const createProductSchema = z.object({
  categoryId: z.string().cuid('ໝວດໝູ່ບໍ່ຖືກຕ້ອງ').optional().nullable(),
  name: z
    .string()
    .min(1, 'ຊື່ສິນຄ້າຈຳເປັນ')
    .max(200, 'ຊື່ສິນຄ້າຕ້ອງສັ້ນກວ່າ 200 ຕົວອັກສອນ'),
  description: z
    .string()
    .max(5000, 'ຄຳອະທິບາຍຕ້ອງສັ້ນກວ່າ 5000 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  shortDescription: z
    .string()
    .max(500, 'ຄຳອະທິບາຍສັ້ນຕ້ອງສັ້ນກວ່າ 500 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  price: z.number().min(0, 'ລາຄາຕ້ອງບໍ່ຕິດລົບ').max(999999999, 'ລາຄາສູງເກີນໄປ'),
  salePrice: z.number().min(0, 'ລາຄາຂາຍຕ້ອງບໍ່ຕິດລົບ').optional().nullable(),
  costPrice: z.number().min(0, 'ລາຄາທຶນຕ້ອງບໍ່ຕິດລົບ').optional().nullable(),
  sku: z
    .string()
    .max(50, 'SKU ຕ້ອງສັ້ນກວ່າ 50 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  barcode: z
    .string()
    .max(50, 'ບາໂຄ້ດຕ້ອງສັ້ນກວ່າ 50 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  thumbnail: z.string().optional().nullable(),
  stockQuantity: z.number().int().min(0, 'ຈຳນວນສິນຄ້າຕ້ອງບໍ່ຕິດລົບ').default(0),
  minStockLevel: z
    .number()
    .int()
    .min(0, 'ລະດັບສິນຄ້າຕ່ຳສຸດຕ້ອງບໍ່ຕິດລົບ')
    .default(5),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  images: z.array(z.string()).optional().default([]),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// Update product schema
export const updateProductSchema = z.object({
  categoryId: z.string().cuid('ໝວດໝູ່ບໍ່ຖືກຕ້ອງ').optional().nullable(),
  name: z
    .string()
    .min(1, 'ຊື່ສິນຄ້າຈຳເປັນ')
    .max(200, 'ຊື່ສິນຄ້າຕ້ອງສັ້ນກວ່າ 200 ຕົວອັກສອນ')
    .optional(),
  description: z
    .string()
    .max(5000, 'ຄຳອະທິບາຍຕ້ອງສັ້ນກວ່າ 5000 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  shortDescription: z
    .string()
    .max(500, 'ຄຳອະທິບາຍສັ້ນຕ້ອງສັ້ນກວ່າ 500 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  price: z
    .number()
    .min(0, 'ລາຄາຕ້ອງບໍ່ຕິດລົບ')
    .max(999999999, 'ລາຄາສູງເກີນໄປ')
    .optional(),
  salePrice: z.number().min(0, 'ລາຄາຂາຍຕ້ອງບໍ່ຕິດລົບ').optional().nullable(),
  costPrice: z.number().min(0, 'ລາຄາທຶນຕ້ອງບໍ່ຕິດລົບ').optional().nullable(),
  sku: z
    .string()
    .max(50, 'SKU ຕ້ອງສັ້ນກວ່າ 50 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  barcode: z
    .string()
    .max(50, 'ບາໂຄ້ດຕ້ອງສັ້ນກວ່າ 50 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  thumbnail: z.string().optional().nullable(),
  stockQuantity: z.number().int().min(0, 'ຈຳນວນສິນຄ້າຕ້ອງບໍ່ຕິດລົບ').optional(),
  minStockLevel: z
    .number()
    .int()
    .min(0, 'ລະດັບສິນຄ້າຕ່ຳສຸດຕ້ອງບໍ່ຕິດລົບ')
    .optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z.array(z.string()).optional(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// Product ID param schema
export const productIdSchema = z.object({
  id: z.string().cuid('Invalid product ID'),
});

export type ProductIdParam = z.infer<typeof productIdSchema>;

// Product list query schema
export const productListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  stockStatus: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']).optional(),
  sortBy: z
    .enum(['name', 'price', 'createdAt', 'stockQuantity'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
