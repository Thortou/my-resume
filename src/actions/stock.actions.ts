'use server';

import { auth } from '@/lib/auth';
import { stockService } from '@/services/stock.service';
import type { StockMovementType } from '@prisma/client';
import type { ActionState } from '@/types';

// Adjust stock (admin only)
export async function adjustStockAction(
  productId: string,
  type: 'IN' | 'OUT' | 'ADJUSTMENT',
  quantity: number,
  notes?: string
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  return stockService.adjustStock({
    productId,
    type,
    quantity,
    notes,
    createdBy: session.user.id,
  });
}

// Stock in (admin only)
export async function stockInAction(
  productId: string,
  quantity: number,
  notes?: string
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  return stockService.stockIn(productId, quantity, notes, session.user.id);
}

// Stock out (admin only)
export async function stockOutAction(
  productId: string,
  quantity: number,
  notes?: string
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  return stockService.stockOut(productId, quantity, notes, session.user.id);
}

// Get stock history for a product (admin only)
export async function getProductStockHistoryAction(
  productId: string,
  options?: { page?: number; limit?: number }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  }

  return stockService.getProductHistory(productId, options);
}

// Get all stock logs (admin only)
export async function getStockLogsAction(options?: {
  page?: number;
  limit?: number;
  productId?: string;
  type?: StockMovementType;
  startDate?: Date;
  endDate?: Date;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  }

  return stockService.getAll(options);
}

// Get stock movement summary (admin only)
export async function getStockMovementSummaryAction(
  startDate?: Date,
  endDate?: Date
) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }

  return stockService.getMovementSummary(startDate, endDate);
}
