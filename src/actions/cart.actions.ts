'use server';

import { auth } from '@/lib/auth';
import { cartService } from '@/services/cart.service';
import type { ActionState } from '@/types';

// Helper to serialize cart data (convert Decimal to number)
function serializeCartItem(item: any) {
  if (!item) return item;
  return {
    ...item,
    price: item.price ? Number(item.price) : 0,
    itemTotal: item.itemTotal ? Number(item.itemTotal) : 0,
    product: item.product
      ? {
          ...item.product,
          price: item.product.price ? Number(item.product.price) : 0,
          salePrice: item.product.salePrice
            ? Number(item.product.salePrice)
            : null,
        }
      : null,
  };
}

function serializeCart(cart: any) {
  if (!cart) return cart;
  return {
    ...cart,
    subtotal: cart.subtotal ? Number(cart.subtotal) : 0,
    items: cart.items?.map(serializeCartItem) || [],
  };
}

// Get cart
export async function getCartAction() {
  const session = await auth();

  if (!session?.user) {
    return {
      id: '',
      items: [],
      subtotal: 0,
      itemCount: 0,
    };
  }

  const cart = await cartService.getCart(session.user.id);
  return serializeCart(cart);
}

// Add item to cart
export async function addToCartAction(
  productId: string,
  quantity: number = 1
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບເພື່ອເພີ່ມສິນຄ້າໃສ່ກະຕ່າ',
    };
  }

  return cartService.addItem(session.user.id, productId, quantity);
}

// Update cart item quantity
export async function updateCartItemAction(
  productId: string,
  quantity: number
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບ',
    };
  }

  return cartService.updateItemQuantity(session.user.id, productId, quantity);
}

// Remove item from cart
export async function removeFromCartAction(
  productId: string
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບ',
    };
  }

  return cartService.removeItem(session.user.id, productId);
}

// Clear cart
export async function clearCartAction(): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບ',
    };
  }

  return cartService.clearCart(session.user.id);
}

// Get cart items count
export async function getCartCountAction() {
  const session = await auth();

  if (!session?.user) {
    return 0;
  }

  return cartService.getItemsCount(session.user.id);
}

// Validate cart for checkout
export async function validateCartAction() {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບ',
    };
  }

  return cartService.validateCart(session.user.id);
}
