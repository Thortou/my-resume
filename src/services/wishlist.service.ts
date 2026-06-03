import { wishlistRepository } from '@/repositories/wishlist.repository';
import { productRepository } from '@/repositories/product.repository';

export const wishlistService = {
  // Get user's wishlist with product details
  async getWishlist(userId: string) {
    const items = await wishlistRepository.getByUserId(userId);

    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: Number(item.product.price),
        salePrice: item.product.salePrice
          ? Number(item.product.salePrice)
          : null,
        thumbnail: item.product.thumbnail,
        stockQuantity: item.product.stockQuantity,
        isActive: item.product.isActive,
        category: item.product.category
          ? {
              id: item.product.category.id,
              name: item.product.category.name,
            }
          : null,
      },
    }));
  },

  // Check if product is in wishlist
  async isInWishlist(userId: string, productId: string) {
    return wishlistRepository.isInWishlist(userId, productId);
  },

  // Toggle wishlist (add/remove)
  async toggleWishlist(userId: string, productId: string) {
    // Verify product exists and is active
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) {
      return {
        success: false,
        error: 'ສິນຄ້າບໍ່ມີ ຫຼື ບໍ່ພ້ອມໃຊ້ງານ',
      };
    }

    const isInList = await wishlistRepository.isInWishlist(userId, productId);

    if (isInList) {
      await wishlistRepository.remove(userId, productId);
      return {
        success: true,
        added: false,
        message: 'ລຶບອອກຈາກລາຍການທີ່ມັກແລ້ວ',
      };
    } else {
      await wishlistRepository.add(userId, productId);
      return {
        success: true,
        added: true,
        message: 'ເພີ່ມໃສ່ລາຍການທີ່ມັກແລ້ວ',
      };
    }
  },

  // Add to wishlist
  async addToWishlist(userId: string, productId: string) {
    // Check if already in wishlist
    const isInList = await wishlistRepository.isInWishlist(userId, productId);
    if (isInList) {
      return {
        success: false,
        error: 'ສິນຄ້ານີ້ຢູ່ໃນລາຍການທີ່ມັກແລ້ວ',
      };
    }

    // Verify product exists and is active
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) {
      return {
        success: false,
        error: 'ສິນຄ້າບໍ່ມີ ຫຼື ບໍ່ພ້ອມໃຊ້ງານ',
      };
    }

    await wishlistRepository.add(userId, productId);
    return {
      success: true,
      message: 'ເພີ່ມໃສ່ລາຍການທີ່ມັກແລ້ວ',
    };
  },

  // Remove from wishlist
  async removeFromWishlist(userId: string, productId: string) {
    const isInList = await wishlistRepository.isInWishlist(userId, productId);
    if (!isInList) {
      return {
        success: false,
        error: 'ສິນຄ້ານີ້ບໍ່ຢູ່ໃນລາຍການທີ່ມັກ',
      };
    }

    await wishlistRepository.remove(userId, productId);
    return {
      success: true,
      message: 'ລຶບອອກຈາກລາຍການທີ່ມັກແລ້ວ',
    };
  },

  // Clear wishlist
  async clearWishlist(userId: string) {
    await wishlistRepository.clearByUserId(userId);
    return {
      success: true,
      message: 'ລ້າງລາຍການທີ່ມັກແລ້ວ',
    };
  },

  // Get wishlist count
  async getWishlistCount(userId: string) {
    return wishlistRepository.getCount(userId);
  },

  // Get wishlist product IDs (for checking if products are in wishlist)
  async getWishlistProductIds(userId: string) {
    return wishlistRepository.getProductIds(userId);
  },
};
