import {
  orderRepository,
  type OrderFilterOptions,
} from '@/repositories/order.repository';
import { cartService } from '@/services/cart.service';
import { cartRepository } from '@/repositories/cart.repository';
import { stockService } from '@/services/stock.service';
import { couponService } from '@/services/coupon.service';
import { notificationService } from '@/services/notification.service';
import type { OrderStatus } from '@prisma/client';
import type { ActionState } from '@/types';

export interface CheckoutInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  couponCode?: string | null;
  notes?: string | null;
}

export const orderService = {
  // Get all orders with filters
  async getAll(options?: OrderFilterOptions) {
    return orderRepository.findAll(options);
  },

  // Get order by ID
  async getById(id: string) {
    return orderRepository.findById(id);
  },

  // Get order by order number
  async getByOrderNumber(orderNumber: string) {
    return orderRepository.findByOrderNumber(orderNumber);
  },

  // Get orders by user
  async getByUser(userId: string, options?: { page?: number; limit?: number }) {
    return orderRepository.findByUser(userId, options);
  },

  // Get recent orders
  async getRecent(limit?: number) {
    return orderRepository.findRecent(limit);
  },

  // Get order statistics
  async getStats(startDate?: Date, endDate?: Date) {
    return orderRepository.getStats(startDate, endDate);
  },

  // Get revenue by period
  async getRevenueByPeriod(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ) {
    return orderRepository.getRevenueByPeriod(startDate, endDate, groupBy);
  },

  // Create order (checkout)
  async checkout(userId: string, input: CheckoutInput): Promise<ActionState> {
    try {
      // Validate cart
      const cartValidation = await cartService.validateCart(userId);
      if (!cartValidation.success) {
        return cartValidation;
      }

      // Get cart
      const cart = await cartService.getCart(userId);
      if (cart.items.length === 0) {
        return {
          success: false,
          error: 'ກະຕ່າສິນຄ້າວ່າງ',
        };
      }

      const subtotal = cart.subtotal;
      let discount = 0;
      let couponId: string | null = null;
      let couponCode: string | null = null;

      // Apply coupon if provided
      if (input.couponCode) {
        const couponResult = await couponService.applyCoupon(
          input.couponCode,
          subtotal
        );
        if (!couponResult.success) {
          return {
            success: false,
            error: couponResult.error || 'ລະຫັດສ່ວນຫຼຸດບໍ່ຖືກຕ້ອງ',
          };
        }
        if (couponResult.data) {
          discount = couponResult.data.discount;
          couponId = couponResult.data.couponId;
          couponCode = input.couponCode;
        }
      }

      const total = subtotal - discount;

      // Generate order number
      const orderNumber = await orderRepository.generateOrderNumber();

      // Create order
      const order = await orderRepository.create({
        userId,
        orderNumber,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        shippingAddress: input.shippingAddress,
        subtotal,
        discount,
        tax: 0,
        total,
        couponId,
        couponCode,
        notes: input.notes,
        items: cart.items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productSku: item.product.sku,
          price: item.price,
          quantity: item.quantity,
          total: item.itemTotal,
        })),
      });

      // Reserve stock for each item
      for (const item of cart.items) {
        await stockService.reserveStock(
          item.product.id,
          item.quantity,
          order.id
        );
      }

      // Increment coupon usage if used
      if (couponId) {
        await couponService.incrementUsage(couponId);
      }

      // Clear cart
      const cartData = await cartRepository.findByUserId(userId);
      if (cartData) {
        await cartRepository.clearCart(cartData.id);
      }

      // Create notification for admin
      await notificationService.createNewOrderNotification(
        order.id,
        order.orderNumber,
        Number(order.total)
      );

      return {
        success: true,
        message: 'ສັ່ງຊື້ສຳເລັດແລ້ວ',
        data: order,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດສັ່ງຊື້ໄດ້',
      };
    }
  },

  // Update order status
  async updateStatus(
    id: string,
    status: OrderStatus,
    notes?: string
  ): Promise<ActionState> {
    try {
      const order = await orderRepository.findById(id);
      if (!order) {
        return {
          success: false,
          error: 'ບໍ່ພົບຄຳສັ່ງຊື້',
        };
      }

      const previousStatus = order.status;

      // Handle stock based on status change
      if (status === 'COMPLETED' && previousStatus !== 'COMPLETED') {
        // Stock was already reserved, just log the final deduction
        for (const item of order.items) {
          await stockService.deductStock(item.productId, item.quantity, id);
        }

        // Notify user
        await notificationService.createOrderCompletedNotification(
          order.id,
          order.orderNumber,
          order.userId
        );
      } else if (status === 'CANCELLED' && previousStatus !== 'CANCELLED') {
        // Release reserved stock
        for (const item of order.items) {
          await stockService.releaseStock(item.productId, item.quantity, id);
        }

        // Notify user
        await notificationService.createOrderCancelledNotification(
          order.id,
          order.orderNumber,
          order.userId
        );
      }

      const updatedOrder = await orderRepository.updateStatus(
        id,
        status,
        notes
      );

      return {
        success: true,
        message: 'ອັບເດດສະຖານະຄຳສັ່ງຊື້ສຳເລັດແລ້ວ',
        data: updatedOrder,
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດອັບເດດສະຖານະໄດ້',
      };
    }
  },

  // Cancel order (user)
  async cancelOrder(id: string, userId: string): Promise<ActionState> {
    try {
      const order = await orderRepository.findById(id);
      if (!order) {
        return {
          success: false,
          error: 'ບໍ່ພົບຄຳສັ່ງຊື້',
        };
      }

      // Check if order belongs to user
      if (order.userId !== userId) {
        return {
          success: false,
          error: 'ທ່ານບໍ່ມີສິດຍົກເລີກຄຳສັ່ງຊື້ນີ້',
        };
      }

      // Can only cancel pending orders
      if (order.status !== 'PENDING') {
        return {
          success: false,
          error: 'ບໍ່ສາມາດຍົກເລີກຄຳສັ່ງຊື້ທີ່ກຳລັງດຳເນີນການ ຫຼື ສຳເລັດແລ້ວ',
        };
      }

      return this.updateStatus(id, 'CANCELLED', 'ຍົກເລີກໂດຍລູກຄ້າ');
    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດຍົກເລີກຄຳສັ່ງຊື້ໄດ້',
      };
    }
  },

  // Get total count
  async getTotalCount() {
    return orderRepository.count();
  },

  // Get pending count
  async getPendingCount() {
    return orderRepository.count({ status: 'PENDING' });
  },
};
