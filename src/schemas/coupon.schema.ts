import { z } from 'zod';

// Create coupon schema
export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, 'ລະຫັດສ່ວນຫຼຸດຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ')
    .max(20, 'ລະຫັດສ່ວນຫຼຸດຕ້ອງສັ້ນກວ່າ 20 ຕົວອັກສອນ')
    .transform((v) => v.toUpperCase()),
  description: z
    .string()
    .max(500, 'ຄຳອະທິບາຍຕ້ອງສັ້ນກວ່າ 500 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  discountType: z.enum(['percentage', 'fixed']).default('percentage'),
  discountValue: z
    .number()
    .min(0, 'ມູນຄ່າສ່ວນຫຼຸດຕ້ອງບໍ່ຕິດລົບ')
    .max(100, 'ເປີເຊັນສ່ວນຫຼຸດຕ້ອງບໍ່ເກີນ 100%')
    .refine(
      (v) => true, // Will be validated with discountType
      'ມູນຄ່າສ່ວນຫຼຸດບໍ່ຖືກຕ້ອງ'
    ),
  minOrderAmount: z.number().min(0).optional().nullable(),
  maxDiscountAmount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

// Update coupon schema
export const updateCouponSchema = z.object({
  code: z
    .string()
    .min(3, 'ລະຫັດສ່ວນຫຼຸດຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ')
    .max(20, 'ລະຫັດສ່ວນຫຼຸດຕ້ອງສັ້ນກວ່າ 20 ຕົວອັກສອນ')
    .transform((v) => v.toUpperCase())
    .optional(),
  description: z
    .string()
    .max(500, 'ຄຳອະທິບາຍຕ້ອງສັ້ນກວ່າ 500 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  discountType: z.enum(['percentage', 'fixed']).optional(),
  discountValue: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional().nullable(),
  maxDiscountAmount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
});

export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;

// Coupon list query schema
export const couponListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CouponListQuery = z.infer<typeof couponListQuerySchema>;

// Apply coupon schema
export const applyCouponSchema = z.object({
  code: z.string().min(1, 'ກະລຸນາໃສ່ລະຫັດສ່ວນຫຼຸດ'),
  orderTotal: z.number().min(0),
});

export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
