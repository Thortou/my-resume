import {
  couponRepository,
  type CouponFilterOptions,
} from '@/repositories/coupon.repository';
import type { ActionState } from '@/types';

export interface CreateCouponInput {
  code: string;
  description?: string | null;
  discountType?: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive?: boolean;
}

export interface UpdateCouponInput {
  code?: string;
  description?: string | null;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive?: boolean;
}

export const couponService = {
  // Get all coupons with pagination
  async getAll(options?: CouponFilterOptions) {
    return couponRepository.findAll(options);
  },

  // Get coupon by ID
  async getById(id: string) {
    return couponRepository.findById(id);
  },

  // Get coupon by code
  async getByCode(code: string) {
    return couponRepository.findByCode(code);
  },

  // Get valid coupons
  async getValidCoupons() {
    return couponRepository.findValid();
  },

  // Create coupon
  async create(input: CreateCouponInput): Promise<ActionState> {
    try {
      // Check if code already exists
      if (await couponRepository.codeExists(input.code)) {
        return {
          success: false,
          error: 'ລະຫັດສ່ວນຫຼຸດນີ້ມີຢູ່ແລ້ວ',
        };
      }

      // Validate percentage discount
      if (input.discountType === 'percentage' && input.discountValue > 100) {
        return {
          success: false,
          error: 'ເປີເຊັນສ່ວນຫຼຸດຕ້ອງບໍ່ເກີນ 100%',
        };
      }

      const coupon = await couponRepository.create({
        code: input.code.toUpperCase(),
        description: input.description,
        discountType: input.discountType || 'percentage',
        discountValue: input.discountValue,
        minOrderAmount: input.minOrderAmount,
        maxDiscountAmount: input.maxDiscountAmount,
        usageLimit: input.usageLimit,
        startDate: input.startDate,
        endDate: input.endDate,
        isActive: input.isActive ?? true,
      });

      return {
        success: true,
        message: 'ສ້າງລະຫັດສ່ວນຫຼຸດສຳເລັດແລ້ວ',
        data: coupon,
      };
    } catch (error) {
      console.error('Error creating coupon:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດສ້າງລະຫັດສ່ວນຫຼຸດໄດ້',
      };
    }
  },

  // Update coupon
  async update(id: string, input: UpdateCouponInput): Promise<ActionState> {
    try {
      const existing = await couponRepository.findById(id);
      if (!existing) {
        return {
          success: false,
          error: 'ບໍ່ພົບລະຫັດສ່ວນຫຼຸດ',
        };
      }

      // Check if new code already exists
      if (input.code && input.code !== existing.code) {
        if (await couponRepository.codeExists(input.code, id)) {
          return {
            success: false,
            error: 'ລະຫັດສ່ວນຫຼຸດນີ້ມີຢູ່ແລ້ວ',
          };
        }
      }

      const updateData: Record<string, unknown> = {};

      if (input.code !== undefined) updateData.code = input.code.toUpperCase();
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.discountType !== undefined)
        updateData.discountType = input.discountType;
      if (input.discountValue !== undefined)
        updateData.discountValue = input.discountValue;
      if (input.minOrderAmount !== undefined)
        updateData.minOrderAmount = input.minOrderAmount;
      if (input.maxDiscountAmount !== undefined)
        updateData.maxDiscountAmount = input.maxDiscountAmount;
      if (input.usageLimit !== undefined)
        updateData.usageLimit = input.usageLimit;
      if (input.startDate !== undefined) updateData.startDate = input.startDate;
      if (input.endDate !== undefined) updateData.endDate = input.endDate;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;

      const coupon = await couponRepository.update(id, updateData);

      return {
        success: true,
        message: 'ອັບເດດລະຫັດສ່ວນຫຼຸດສຳເລັດແລ້ວ',
        data: coupon,
      };
    } catch (error) {
      console.error('Error updating coupon:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດອັບເດດລະຫັດສ່ວນຫຼຸດໄດ້',
      };
    }
  },

  // Delete coupon
  async delete(id: string): Promise<ActionState> {
    try {
      const existing = await couponRepository.findById(id);
      if (!existing) {
        return {
          success: false,
          error: 'ບໍ່ພົບລະຫັດສ່ວນຫຼຸດ',
        };
      }

      // Check if coupon has been used
      if (existing._count.orders > 0) {
        return {
          success: false,
          error: `ບໍ່ສາມາດລຶບໄດ້ ເພາະລະຫັດສ່ວນຫຼຸດນີ້ຖືກໃຊ້ແລ້ວ ${existing._count.orders} ຄັ້ງ`,
        };
      }

      await couponRepository.delete(id);

      return {
        success: true,
        message: 'ລຶບລະຫັດສ່ວນຫຼຸດສຳເລັດແລ້ວ',
      };
    } catch (error) {
      console.error('Error deleting coupon:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດລຶບລະຫັດສ່ວນຫຼຸດໄດ້',
      };
    }
  },

  // Apply coupon to order
  async applyCoupon(
    code: string,
    orderTotal: number
  ): Promise<ActionState & { data?: { couponId: string; discount: number } }> {
    try {
      const coupon = await couponRepository.findByCode(code);

      if (!coupon) {
        return {
          success: false,
          error: 'ລະຫັດສ່ວນຫຼຸດບໍ່ຖືກຕ້ອງ',
        };
      }

      if (!coupon.isActive) {
        return {
          success: false,
          error: 'ລະຫັດສ່ວນຫຼຸດນີ້ບໍ່ໃຊ້ງານແລ້ວ',
        };
      }

      const now = new Date();

      // Check start date
      if (coupon.startDate && coupon.startDate > now) {
        return {
          success: false,
          error: 'ລະຫັດສ່ວນຫຼຸດນີ້ຍັງບໍ່ເລີ່ມໃຊ້ໄດ້',
        };
      }

      // Check end date
      if (coupon.endDate && coupon.endDate < now) {
        return {
          success: false,
          error: 'ລະຫັດສ່ວນຫຼຸດນີ້ໝົດອາຍຸແລ້ວ',
        };
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return {
          success: false,
          error: 'ລະຫັດສ່ວນຫຼຸດນີ້ໃຊ້ຄົບຈຳນວນແລ້ວ',
        };
      }

      // Check minimum order amount
      if (coupon.minOrderAmount && orderTotal < Number(coupon.minOrderAmount)) {
        return {
          success: false,
          error: `ຍອດສັ່ງຊື້ຕ້ອງຢ່າງໜ້ອຍ ${Number(coupon.minOrderAmount).toLocaleString()} ກີບ`,
        };
      }

      // Calculate discount
      let discount: number;

      if (coupon.discountType === 'percentage') {
        discount = (orderTotal * Number(coupon.discountValue)) / 100;
      } else {
        discount = Number(coupon.discountValue);
      }

      // Apply max discount if set
      if (
        coupon.maxDiscountAmount &&
        discount > Number(coupon.maxDiscountAmount)
      ) {
        discount = Number(coupon.maxDiscountAmount);
      }

      // Don't exceed order total
      if (discount > orderTotal) {
        discount = orderTotal;
      }

      return {
        success: true,
        message: `ໃຊ້ລະຫັດສ່ວນຫຼຸດສຳເລັດ: ຫຼຸດ ${discount.toLocaleString()} ກີບ`,
        data: {
          couponId: coupon.id,
          discount,
        },
      };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດໃຊ້ລະຫັດສ່ວນຫຼຸດໄດ້',
      };
    }
  },

  // Increment coupon usage
  async incrementUsage(id: string) {
    return couponRepository.incrementUsage(id);
  },

  // Get total count
  async getTotalCount() {
    return couponRepository.count();
  },

  // Get active count
  async getActiveCount() {
    return couponRepository.count({ isActive: true });
  },
};
