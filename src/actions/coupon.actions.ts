'use server';

import { auth } from '@/lib/auth';
import { couponService } from '@/services/coupon.service';
import {
  createCouponSchema,
  updateCouponSchema,
  couponListQuerySchema,
  applyCouponSchema,
  type CreateCouponInput,
  type UpdateCouponInput,
  type CouponListQuery,
} from '@/schemas/coupon.schema';
import type { ActionState } from '@/types';

// Helper to serialize coupon data (convert Decimal to number)
function serializeCoupon(coupon: any) {
  if (!coupon) return coupon;
  return {
    ...coupon,
    discountValue: coupon.discountValue ? Number(coupon.discountValue) : 0,
    minOrderAmount: coupon.minOrderAmount
      ? Number(coupon.minOrderAmount)
      : null,
    maxDiscountAmount: coupon.maxDiscountAmount
      ? Number(coupon.maxDiscountAmount)
      : null,
  };
}

function serializeCoupons(coupons: any[]) {
  return coupons.map(serializeCoupon);
}

// Get all coupons (admin)
export async function getCouponsAction(query?: Partial<CouponListQuery>) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  const validatedQuery = couponListQuerySchema.safeParse(query || {});
  const options = validatedQuery.success ? validatedQuery.data : {};
  const result = await couponService.getAll(options);
  return {
    ...result,
    data: serializeCoupons(result.data),
  };
}

// Get coupon by ID (admin)
export async function getCouponByIdAction(id: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }

  const coupon = await couponService.getById(id);
  return serializeCoupon(coupon);
}

// Get valid coupons (for showing available coupons to users)
export async function getValidCouponsAction() {
  const coupons = await couponService.getValidCoupons();
  return serializeCoupons(coupons);
}

// Create coupon (admin only)
export async function createCouponAction(
  input: CreateCouponInput
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  // Validate input
  const validatedFields = createCouponSchema.safeParse(input);

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

  return couponService.create(validatedFields.data);
}

// Update coupon (admin only)
export async function updateCouponAction(
  id: string,
  input: UpdateCouponInput
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  // Validate input
  const validatedFields = updateCouponSchema.safeParse(input);

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

  return couponService.update(id, validatedFields.data);
}

// Delete coupon (admin only)
export async function deleteCouponAction(id: string): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  return couponService.delete(id);
}

// Apply coupon (user)
export async function applyCouponAction(
  code: string,
  orderTotal: number
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບ',
    };
  }

  // Validate input
  const validatedFields = applyCouponSchema.safeParse({ code, orderTotal });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
    };
  }

  return couponService.applyCoupon(
    validatedFields.data.code,
    validatedFields.data.orderTotal
  );
}
