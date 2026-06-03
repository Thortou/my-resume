import { z } from 'zod';

// Create order schema (checkout)
export const createOrderSchema = z.object({
  customerName: z
    .string()
    .min(1, 'ຊື່ລູກຄ້າຈຳເປັນ')
    .max(100, 'ຊື່ລູກຄ້າຕ້ອງສັ້ນກວ່າ 100 ຕົວອັກສອນ'),
  customerEmail: z.string().email('ອີເມວບໍ່ຖືກຕ້ອງ'),
  customerPhone: z
    .string()
    .max(20, 'ເບີໂທຕ້ອງສັ້ນກວ່າ 20 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  shippingAddress: z
    .string()
    .max(500, 'ທີ່ຢູ່ຕ້ອງສັ້ນກວ່າ 500 ຕົວອັກສອນ')
    .optional()
    .nullable(),
  couponCode: z.string().optional().nullable(),
  notes: z
    .string()
    .max(1000, 'ໝາຍເຫດຕ້ອງສັ້ນກວ່າ 1000 ຕົວອັກສອນ')
    .optional()
    .nullable(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Update order status schema
export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']),
  notes: z.string().max(1000).optional().nullable(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// Order list query schema
export const orderListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z
    .enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'])
    .optional(),
  userId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sortBy: z
    .enum(['createdAt', 'total', 'orderNumber'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
