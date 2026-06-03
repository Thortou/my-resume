'use server';

import { auth } from '@/lib/auth';
import { orderService } from '@/services/order.service';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderListQuerySchema,
  type CreateOrderInput,
  type UpdateOrderStatusInput,
  type OrderListQuery,
} from '@/schemas/order.schema';
import type { OrderStatus } from '@prisma/client';
import type { ActionState } from '@/types';

// Helper to serialize order data (convert Decimal to number)
function serializeOrderItem(item: any) {
  if (!item) return item;
  return {
    ...item,
    price: item.price ? Number(item.price) : 0,
    total: item.total ? Number(item.total) : 0,
  };
}

function serializeOrder(order: any) {
  if (!order) return order;
  return {
    ...order,
    subtotal: order.subtotal ? Number(order.subtotal) : 0,
    discount: order.discount ? Number(order.discount) : 0,
    shippingFee: order.shippingFee ? Number(order.shippingFee) : 0,
    total: order.total ? Number(order.total) : 0,
    items: order.items?.map(serializeOrderItem) || [],
    coupon: order.coupon
      ? {
          ...order.coupon,
          discountValue: order.coupon.discountValue
            ? Number(order.coupon.discountValue)
            : 0,
        }
      : null,
  };
}

function serializeOrders(orders: any[]) {
  return orders.map(serializeOrder);
}

// Get all orders (admin)
export async function getOrdersAction(query?: Partial<OrderListQuery>) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  const validatedQuery = orderListQuerySchema.safeParse(query || {});
  const options = validatedQuery.success ? validatedQuery.data : {};
  const result = await orderService.getAll(options);
  return {
    ...result,
    data: serializeOrders(result.data),
  };
}

// Get order by ID
export async function getOrderByIdAction(id: string) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const order = await orderService.getById(id);

  // Users can only view their own orders, admins can view all
  if (
    order &&
    session.user.role !== 'ADMIN' &&
    order.userId !== session.user.id
  ) {
    return null;
  }

  return serializeOrder(order);
}

// Get order by order number
export async function getOrderByNumberAction(orderNumber: string) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const order = await orderService.getByOrderNumber(orderNumber);

  if (
    order &&
    session.user.role !== 'ADMIN' &&
    order.userId !== session.user.id
  ) {
    return null;
  }

  return serializeOrder(order);
}

// Get user's orders
export async function getUserOrdersAction(options?: {
  page?: number;
  limit?: number;
}) {
  const session = await auth();

  if (!session?.user) {
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  const result = await orderService.getByUser(session.user.id, options);
  return {
    ...result,
    data: serializeOrders(result.data),
  };
}

// Get recent orders (admin)
export async function getRecentOrdersAction(limit?: number) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return [];
  }

  const orders = await orderService.getRecent(limit);
  return serializeOrders(orders);
}

// Get order statistics (admin)
export async function getOrderStatsAction(startDate?: Date, endDate?: Date) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }

  return orderService.getStats(startDate, endDate);
}

// Get revenue by period (admin)
export async function getRevenueByPeriodAction(
  startDate: Date,
  endDate: Date,
  groupBy: 'day' | 'week' | 'month' = 'day'
) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return [];
  }

  return orderService.getRevenueByPeriod(startDate, endDate, groupBy);
}

// Checkout (create order)
export async function checkoutAction(
  input: CreateOrderInput
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບເພື່ອສັ່ງຊື້',
    };
  }

  // Validate input
  const validatedFields = createOrderSchema.safeParse(input);

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

  return orderService.checkout(session.user.id, validatedFields.data);
}

// Update order status (admin)
export async function updateOrderStatusAction(
  id: string,
  input: UpdateOrderStatusInput
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  // Validate input
  const validatedFields = updateOrderStatusSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
    };
  }

  return orderService.updateStatus(
    id,
    validatedFields.data.status,
    validatedFields.data.notes || undefined
  );
}

// Cancel order (user)
export async function cancelOrderAction(id: string): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບ',
    };
  }

  return orderService.cancelOrder(id, session.user.id);
}

// Get pending orders count (admin)
export async function getPendingOrdersCountAction() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return 0;
  }

  return orderService.getPendingCount();
}
