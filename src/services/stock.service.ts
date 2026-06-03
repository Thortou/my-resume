import { stockRepository } from '@/repositories/stock.repository';
import { productRepository } from '@/repositories/product.repository';
import { notificationService } from '@/services/notification.service';
import type { StockMovementType } from '@prisma/client';
import type { ActionState } from '@/types';

export interface StockMovementInput {
  productId: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reference?: string;
  notes?: string;
  createdBy?: string;
}

export interface StockAdjustmentInput {
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  notes?: string;
  createdBy?: string;
}

export const stockService = {
  // Log stock movement
  async logStockMovement(input: StockMovementInput) {
    return stockRepository.create({
      productId: input.productId,
      type: input.type,
      quantity: input.quantity,
      previousStock: input.previousStock,
      newStock: input.newStock,
      reference: input.reference,
      notes: input.notes,
      createdBy: input.createdBy,
    });
  },

  // Adjust stock (add or remove)
  async adjustStock(input: StockAdjustmentInput): Promise<ActionState> {
    try {
      const product = await productRepository.findById(input.productId);
      if (!product) {
        return {
          success: false,
          error: 'ບໍ່ພົບສິນຄ້າ',
        };
      }

      const previousStock = product.stockQuantity;
      let newStock: number;

      switch (input.type) {
        case 'IN':
          newStock = previousStock + input.quantity;
          break;
        case 'OUT':
          if (previousStock < input.quantity) {
            return {
              success: false,
              error: `ສິນຄ້າບໍ່ພຽງພໍ. ມີພຽງ ${previousStock} ໜ່ວຍ`,
            };
          }
          newStock = previousStock - input.quantity;
          break;
        case 'ADJUSTMENT':
          newStock = input.quantity; // Direct set
          break;
        default:
          return {
            success: false,
            error: 'ປະເພດການປັບປຸງບໍ່ຖືກຕ້ອງ',
          };
      }

      // Update product stock
      await productRepository.updateStock(input.productId, newStock);

      // Log the movement
      await stockRepository.create({
        productId: input.productId,
        type: input.type,
        quantity: input.quantity,
        previousStock,
        newStock,
        notes: input.notes,
        createdBy: input.createdBy,
      });

      // Check for low stock and create notification
      if (newStock <= product.minStockLevel && newStock > 0) {
        await notificationService.createLowStockNotification(
          product.id,
          product.name,
          newStock
        );
      }

      return {
        success: true,
        message: 'ປັບປຸງສິນຄ້າສຳເລັດແລ້ວ',
        data: { previousStock, newStock },
      };
    } catch (error) {
      console.error('Error adjusting stock:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດປັບປຸງສິນຄ້າໄດ້',
      };
    }
  },

  // Stock in (add stock)
  async stockIn(
    productId: string,
    quantity: number,
    notes?: string,
    userId?: string
  ): Promise<ActionState> {
    return this.adjustStock({
      productId,
      type: 'IN',
      quantity,
      notes: notes || 'ນຳເຂົ້າສິນຄ້າ',
      createdBy: userId,
    });
  },

  // Stock out (remove stock)
  async stockOut(
    productId: string,
    quantity: number,
    notes?: string,
    userId?: string
  ): Promise<ActionState> {
    return this.adjustStock({
      productId,
      type: 'OUT',
      quantity,
      notes: notes || 'ນຳອອກສິນຄ້າ',
      createdBy: userId,
    });
  },

  // Reserve stock for pending orders
  async reserveStock(
    productId: string,
    quantity: number,
    orderId: string
  ): Promise<ActionState> {
    try {
      const product = await productRepository.findById(productId);
      if (!product) {
        return {
          success: false,
          error: 'ບໍ່ພົບສິນຄ້າ',
        };
      }

      if (product.stockQuantity < quantity) {
        return {
          success: false,
          error: `ສິນຄ້າບໍ່ພຽງພໍ. ມີພຽງ ${product.stockQuantity} ໜ່ວຍ`,
        };
      }

      const previousStock = product.stockQuantity;
      const newStock = previousStock - quantity;

      await productRepository.updateStock(productId, newStock);

      await stockRepository.create({
        productId,
        type: 'RESERVED',
        quantity,
        previousStock,
        newStock,
        reference: orderId,
        notes: `ຈອງສິນຄ້າສຳລັບຄຳສັ່ງຊື້ ${orderId}`,
      });

      return {
        success: true,
        message: 'ຈອງສິນຄ້າສຳເລັດແລ້ວ',
      };
    } catch (error) {
      console.error('Error reserving stock:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດຈອງສິນຄ້າໄດ້',
      };
    }
  },

  // Release reserved stock (when order is cancelled)
  async releaseStock(
    productId: string,
    quantity: number,
    orderId: string
  ): Promise<ActionState> {
    try {
      const product = await productRepository.findById(productId);
      if (!product) {
        return {
          success: false,
          error: 'ບໍ່ພົບສິນຄ້າ',
        };
      }

      const previousStock = product.stockQuantity;
      const newStock = previousStock + quantity;

      await productRepository.updateStock(productId, newStock);

      await stockRepository.create({
        productId,
        type: 'RELEASED',
        quantity,
        previousStock,
        newStock,
        reference: orderId,
        notes: `ປ່ອຍສິນຄ້າຈາກຄຳສັ່ງຊື້ທີ່ຖືກຍົກເລີກ ${orderId}`,
      });

      return {
        success: true,
        message: 'ປ່ອຍສິນຄ້າສຳເລັດແລ້ວ',
      };
    } catch (error) {
      console.error('Error releasing stock:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດປ່ອຍສິນຄ້າໄດ້',
      };
    }
  },

  // Deduct stock when order is completed
  async deductStock(
    productId: string,
    quantity: number,
    orderId: string
  ): Promise<ActionState> {
    try {
      // Stock was already reserved, just log the OUT movement
      const product = await productRepository.findById(productId);
      if (!product) {
        return { success: false, error: 'ບໍ່ພົບສິນຄ້າ' };
      }

      await stockRepository.create({
        productId,
        type: 'OUT',
        quantity,
        previousStock: product.stockQuantity,
        newStock: product.stockQuantity,
        reference: orderId,
        notes: `ຫັກສິນຄ້າສຳລັບຄຳສັ່ງຊື້ສຳເລັດ ${orderId}`,
      });

      return {
        success: true,
        message: 'ຫັກສິນຄ້າສຳເລັດແລ້ວ',
      };
    } catch (error) {
      console.error('Error deducting stock:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດຫັກສິນຄ້າໄດ້',
      };
    }
  },

  // Get stock history for a product
  async getProductHistory(
    productId: string,
    options?: { page?: number; limit?: number }
  ) {
    return stockRepository.findByProduct(productId, options);
  },

  // Get all stock logs
  async getAll(options?: {
    page?: number;
    limit?: number;
    productId?: string;
    type?: StockMovementType;
    startDate?: Date;
    endDate?: Date;
  }) {
    return stockRepository.findAll(options);
  },

  // Get stock movement summary
  async getMovementSummary(startDate?: Date, endDate?: Date) {
    return stockRepository.getMovementSummary(startDate, endDate);
  },
};
