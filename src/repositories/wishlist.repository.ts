import prisma from '@/lib/prisma';

export const wishlistRepository = {
  // Get user's wishlist
  async getByUserId(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Check if product is in wishlist
  async isInWishlist(userId: string, productId: string) {
    const item = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!item;
  },

  // Add to wishlist
  async add(userId: string, productId: string) {
    return prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });
  },

  // Remove from wishlist
  async remove(userId: string, productId: string) {
    return prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  },

  // Clear wishlist
  async clearByUserId(userId: string) {
    return prisma.wishlist.deleteMany({
      where: { userId },
    });
  },

  // Get wishlist count
  async getCount(userId: string) {
    return prisma.wishlist.count({
      where: { userId },
    });
  },

  // Get wishlist item IDs
  async getProductIds(userId: string) {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true },
    });
    return items.map((item) => item.productId);
  },
};
