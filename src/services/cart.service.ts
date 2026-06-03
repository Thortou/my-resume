import { cartRepository } from '@/repositories/cart.repository';
import { productRepository } from '@/repositories/product.repository';
import type { ActionState } from '@/types';

export const cartService = {
  // Get cart for user
  async getCart(userId: string) {
    const cart = await cartRepository.getOrCreate(userId);

    // Calculate totals
    const items = cart.items.map((item) => {
      const price = item.product.salePrice || item.product.price;
      const itemTotal = Number(price) * item.quantity;
      return {
        ...item,
        price: Number(price),
        itemTotal,
        isAvailable:
          item.product.isActive && item.product.stockQuantity >= item.quantity,
        stockQuantity: item.product.stockQuantity,
      };
    });

    const subtotal = items.reduce((total, item) => total + item.itemTotal, 0);
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return {
      id: cart.id,
      items,
      subtotal,
      itemCount,
    };
  },

  // Add item to cart
  async addItem(
    userId: string,
    productId: string,
    quantity: number = 1
  ): Promise<ActionState> {
    try {
      // Check if product exists and is active
      const product = await productRepository.findById(productId);
      if (!product) {
        return {
          success: false,
          error: 'ບໍ່ພົບສິນຄ້າ',
        };
      }

      if (!product.isActive) {
        return {
          success: false,
          error: 'ສິນຄ້ານີ້ບໍ່ມີໃຫ້ຊື້ແລ້ວ',
        };
      }

      // Check stock
      const cart = await cartRepository.getOrCreate(userId);
      const existingItem = await cartRepository.findCartItem(
        cart.id,
        productId
      );
      const currentQty = existingItem?.quantity || 0;
      const newQty = currentQty + quantity;

      if (product.stockQuantity < newQty) {
        return {
          success: false,
          error: `ສິນຄ້າບໍ່ພຽງພໍ. ມີພຽງ ${product.stockQuantity} ໜ່ວຍ`,
        };
      }

      await cartRepository.addItem(cart.id, productId, quantity);

      return {
        success: true,
        message: 'ເພີ່ມສິນຄ້າໃສ່ກະຕ່າສຳເລັດແລ້ວ',
      };
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດເພີ່ມສິນຄ້າໃສ່ກະຕ່າໄດ້',
      };
    }
  },

  // Update item quantity
  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ActionState> {
    try {
      if (quantity < 1) {
        return this.removeItem(userId, productId);
      }

      // Check stock
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

      const cart = await cartRepository.getOrCreate(userId);
      await cartRepository.updateItemQuantity(cart.id, productId, quantity);

      return {
        success: true,
        message: 'ອັບເດດຈຳນວນສຳເລັດແລ້ວ',
      };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດອັບເດດຈຳນວນໄດ້',
      };
    }
  },

  // Remove item from cart
  async removeItem(userId: string, productId: string): Promise<ActionState> {
    try {
      const cart = await cartRepository.findByUserId(userId);
      if (!cart) {
        return {
          success: false,
          error: 'ບໍ່ພົບກະຕ່າສິນຄ້າ',
        };
      }

      await cartRepository.removeItem(cart.id, productId);

      return {
        success: true,
        message: 'ລຶບສິນຄ້າອອກຈາກກະຕ່າສຳເລັດແລ້ວ',
      };
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດລຶບສິນຄ້າໄດ້',
      };
    }
  },

  // Clear cart
  async clearCart(userId: string): Promise<ActionState> {
    try {
      const cart = await cartRepository.findByUserId(userId);
      if (!cart) {
        return {
          success: true,
          message: 'ກະຕ່າວ່າງແລ້ວ',
        };
      }

      await cartRepository.clearCart(cart.id);

      return {
        success: true,
        message: 'ລ້າງກະຕ່າສຳເລັດແລ້ວ',
      };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດລ້າງກະຕ່າໄດ້',
      };
    }
  },

  // Get cart items count
  async getItemsCount(userId: string) {
    return cartRepository.getItemsCount(userId);
  },

  // Validate cart for checkout
  async validateCart(
    userId: string
  ): Promise<ActionState & { invalidItems?: string[] }> {
    const cart = await this.getCart(userId);

    if (cart.items.length === 0) {
      return {
        success: false,
        error: 'ກະຕ່າສິນຄ້າວ່າງ',
      };
    }

    const invalidItems: string[] = [];

    for (const item of cart.items) {
      if (!item.isAvailable) {
        invalidItems.push(item.product.name);
      }
    }

    if (invalidItems.length > 0) {
      return {
        success: false,
        error: 'ບາງສິນຄ້າບໍ່ມີໃຫ້ຊື້ ຫຼື ສິນຄ້າບໍ່ພຽງພໍ',
        invalidItems,
      };
    }

    return {
      success: true,
      message: 'ກະຕ່າພ້ອມສຳລັບການຊຳລະ',
    };
  },
};
