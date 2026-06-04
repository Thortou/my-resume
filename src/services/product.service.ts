import {
  productRepository,
  type ProductFilterOptions,
} from '@/repositories/product.repository';
import { stockService } from '@/services/stock.service';
import type { ActionState } from '@/types';

// Helper to generate slug from name (URL-safe ASCII)
function generateSlug(name: string): string {
  // Generate a unique slug using timestamp and random string for non-ASCII names
  const asciiSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);

  // If slug is empty or too short (non-ASCII name), use a generated slug
  if (!asciiSlug || asciiSlug.length < 3) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `product-${timestamp}-${random}`;
  }

  return asciiSlug;
}

// Helper to ensure unique slug
async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await productRepository.slugExists(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// Helper to generate SKU
function generateSku(): string {
  const prefix = 'PRD';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export interface CreateProductInput {
  categoryId?: string | null;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number | null;
  sku?: string | null;
  barcode?: string | null;
  thumbnail?: string | null;
  stockQuantity?: number;
  minStockLevel?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  images?: string[];
}

export interface UpdateProductInput {
  categoryId?: string | null;
  name?: string;
  description?: string | null;
  shortDescription?: string | null;
  price?: number;
  salePrice?: number | null;
  costPrice?: number | null;
  sku?: string | null;
  barcode?: string | null;
  thumbnail?: string | null;
  stockQuantity?: number;
  minStockLevel?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  images?: string[];
}

export const productService = {
  // Get all products with pagination and filters
  async getAll(options?: ProductFilterOptions) {
    return productRepository.findAll(options);
  },

  // Get all active products for shop
  async getAllActive(options?: {
    categoryId?: string;
    search?: string;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    return productRepository.findAllActive(options);
  },

  // Get featured products
  async getFeatured(limit?: number) {
    return productRepository.findFeatured(limit);
  },

  // Get product by ID
  async getById(id: string) {
    return productRepository.findById(id);
  },

  // Get product by slug
  async getBySlug(slug: string) {
    return productRepository.findBySlug(slug);
  },

  // Get products by category
  async getByCategory(categoryId: string, limit?: number) {
    return productRepository.findByCategory(categoryId, limit);
  },

  // Get related products
  async getRelated(productId: string, categoryId: string, limit?: number) {
    return productRepository.findRelated(productId, categoryId, limit);
  },

  // Get best selling products
  async getBestSelling(limit?: number) {
    return productRepository.findBestSelling(limit);
  },

  // Get low stock products
  async getLowStock(limit?: number) {
    return productRepository.findLowStock(limit);
  },

  // Get out of stock products
  async getOutOfStock(limit?: number) {
    return productRepository.findOutOfStock(limit);
  },

  // Create product
  async create(
    input: CreateProductInput,
    userId?: string
  ): Promise<ActionState> {
    try {
      const slug = await ensureUniqueSlug(generateSlug(input.name));

      // Generate SKU if not provided
      let sku = input.sku;
      if (!sku) {
        sku = generateSku();
        // Ensure unique SKU
        while (await productRepository.skuExists(sku)) {
          sku = generateSku();
        }
      } else {
        // Check if provided SKU exists
        if (await productRepository.skuExists(sku)) {
          return {
            success: false,
            error: 'SKU ນີ້ມີຢູ່ແລ້ວ',
          };
        }
      }

      const initialStock = input.stockQuantity ?? 0;

      const product = await productRepository.create(
        {
          name: input.name,
          slug,
          description: input.description,
          shortDescription: input.shortDescription,
          price: input.price,
          salePrice: input.salePrice,
          costPrice: input.costPrice,
          sku,
          barcode: input.barcode,
          thumbnail: input.thumbnail,
          stockQuantity: initialStock,
          minStockLevel: input.minStockLevel ?? 5,
          isFeatured: input.isFeatured ?? false,
          isActive: input.isActive ?? true,
          ...(input.categoryId && {
            category: { connect: { id: input.categoryId } },
          }),
        },
        input.images
      );

      // Log initial stock if any
      if (product && initialStock > 0) {
        await stockService.logStockMovement({
          productId: product.id,
          type: 'IN',
          quantity: initialStock,
          previousStock: 0,
          newStock: initialStock,
          notes: 'ສ້າງສິນຄ້າໃໝ່',
          createdBy: userId,
        });
      }

      return {
        success: true,
        message: 'ສ້າງສິນຄ້າສຳເລັດແລ້ວ',
        data: product,
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດສ້າງສິນຄ້າໄດ້',
      };
    }
  },

  // Update product
  async update(
    id: string,
    input: UpdateProductInput,
    userId?: string
  ): Promise<ActionState> {
    try {
      const existing = await productRepository.findById(id);
      if (!existing) {
        return {
          success: false,
          error: 'ບໍ່ພົບສິນຄ້າ',
        };
      }

      const updateData: Record<string, unknown> = {};

      // Update name and slug
      if (input.name !== undefined) {
        updateData.name = input.name;
        if (input.name !== existing.name) {
          updateData.slug = await ensureUniqueSlug(
            generateSlug(input.name),
            id
          );
        }
      }

      // Update other fields
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.shortDescription !== undefined)
        updateData.shortDescription = input.shortDescription;
      if (input.price !== undefined) updateData.price = input.price;
      if (input.salePrice !== undefined) updateData.salePrice = input.salePrice;
      if (input.costPrice !== undefined) updateData.costPrice = input.costPrice;
      if (input.barcode !== undefined) updateData.barcode = input.barcode;
      if (input.thumbnail !== undefined) updateData.thumbnail = input.thumbnail;
      if (input.minStockLevel !== undefined)
        updateData.minStockLevel = input.minStockLevel;
      if (input.isFeatured !== undefined)
        updateData.isFeatured = input.isFeatured;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;

      // Update SKU if changed
      if (input.sku !== undefined && input.sku !== existing.sku) {
        if (input.sku && (await productRepository.skuExists(input.sku, id))) {
          return {
            success: false,
            error: 'SKU ນີ້ມີຢູ່ແລ້ວ',
          };
        }
        updateData.sku = input.sku;
      }

      // Update category
      if (input.categoryId !== undefined) {
        if (input.categoryId) {
          updateData.category = { connect: { id: input.categoryId } };
        } else {
          updateData.category = { disconnect: true };
        }
      }

      // Handle stock quantity change
      if (
        input.stockQuantity !== undefined &&
        input.stockQuantity !== existing.stockQuantity
      ) {
        const previousStock = existing.stockQuantity;
        const newStock = input.stockQuantity;
        updateData.stockQuantity = newStock;

        // Log the stock adjustment
        await stockService.logStockMovement({
          productId: id,
          type: 'ADJUSTMENT',
          quantity: Math.abs(newStock - previousStock),
          previousStock,
          newStock,
          notes: `ປັບປຸງສິນຄ້າດ້ວຍຕົນເອງ: ${previousStock} → ${newStock}`,
          createdBy: userId,
        });
      }

      const product = await productRepository.update(
        id,
        updateData,
        input.images
      );

      return {
        success: true,
        message: 'ອັບເດດສິນຄ້າສຳເລັດແລ້ວ',
        data: product,
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດອັບເດດສິນຄ້າໄດ້',
      };
    }
  },

  // Delete product
  async delete(id: string): Promise<ActionState> {
    try {
      const existing = await productRepository.findById(id);
      if (!existing) {
        return {
          success: false,
          error: 'ບໍ່ພົບສິນຄ້າ',
        };
      }

      // Check if product has orders
      if (existing._count.orderItems > 0) {
        return {
          success: false,
          error: `ບໍ່ສາມາດລຶບສິນຄ້າໄດ້ ເພາະມີ ${existing._count.orderItems} ຄຳສັ່ງຊື້ທີ່ກ່ຽວຂ້ອງ`,
        };
      }

      await productRepository.delete(id);

      return {
        success: true,
        message: 'ລຶບສິນຄ້າສຳເລັດແລ້ວ',
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດລຶບສິນຄ້າໄດ້',
      };
    }
  },

  // Get product statistics
  async getStats() {
    return productRepository.getStats();
  },

  // Get total count
  async getTotalCount() {
    return productRepository.count();
  },

  // Get active count
  async getActiveCount() {
    return productRepository.count({ isActive: true });
  },
};
