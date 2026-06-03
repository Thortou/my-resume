import prisma from '@/lib/prisma';

export const cartRepository = {
  // Get or create cart for user
  async getOrCreate(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                  images: {
                    orderBy: { sortOrder: 'asc' },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  },

  // Get cart by user ID
  async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },

  // Get cart item
  async findCartItem(cartId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  },

  // Add item to cart
  async addItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      create: {
        cartId,
        productId,
        quantity,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      include: {
        product: true,
      },
    });
  },

  // Update item quantity
  async updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number
  ) {
    return prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      data: { quantity },
      include: {
        product: true,
      },
    });
  },

  // Remove item from cart
  async removeItem(cartId: string, productId: string) {
    return prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  },

  // Clear cart
  async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  },

  // Get cart items count
  async getItemsCount(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          select: { quantity: true },
        },
      },
    });

    if (!cart) return 0;

    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },

  // Get cart total
  async getCartTotal(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                price: true,
                salePrice: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return 0;

    return cart.items.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + Number(price) * item.quantity;
    }, 0);
  },

  // Delete cart
  async delete(userId: string) {
    return prisma.cart.delete({
      where: { userId },
    });
  },
};
