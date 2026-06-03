import { z } from 'zod';

// Demo payment schema
export const demoPaymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, 'ໝາຍເລກບັດຕ້ອງມີ 16 ຕົວເລກ')
    .max(19, 'ໝາຍເລກບັດບໍ່ຖືກຕ້ອງ')
    .regex(/^[\d\s-]+$/, 'ໝາຍເລກບັດຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ'),
  cardHolder: z
    .string()
    .min(2, 'ຊື່ຜູ້ຖືບັດຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ')
    .max(100, 'ຊື່ຜູ້ຖືບັດຍາວເກີນໄປ'),
  expiryDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
      'ຮູບແບບວັນໝົດອາຍຸບໍ່ຖືກຕ້ອງ (MM/YY)'
    ),
  cvv: z
    .string()
    .min(3, 'CVV ຕ້ອງມີ 3-4 ຕົວເລກ')
    .max(4, 'CVV ຕ້ອງມີ 3-4 ຕົວເລກ')
    .regex(/^\d+$/, 'CVV ຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ'),
  productType: z.string().min(1, 'ປະເພດສິນຄ້າຈຳເປັນ'),
  productId: z.string().optional(),
  amount: z.number().positive('ຈຳນວນເງິນຕ້ອງເປັນບວກ'),
});

export type DemoPaymentInput = z.infer<typeof demoPaymentSchema>;

// Payment check schema
export const checkPaymentSchema = z.object({
  productType: z.string().min(1),
  productId: z.string().optional(),
});

export type CheckPaymentInput = z.infer<typeof checkPaymentSchema>;

// Product types
export const PRODUCT_TYPES = {
  PRO_TEMPLATE: 'pro_template',
  PREMIUM_SUBSCRIPTION: 'premium_subscription',
} as const;

export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];

// Pro template pricing
export const PRO_TEMPLATE_PRICE = {
  amount: 50000, // 50,000 LAK
  currency: 'LAK',
  displayPrice: '50,000 ກີບ',
} as const;
