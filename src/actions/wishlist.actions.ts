'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { wishlistService } from '@/services/wishlist.service';

// Get current user's wishlist
export async function getWishlistAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return wishlistService.getWishlist(session.user.id);
}

// Toggle wishlist (add/remove)
export async function toggleWishlistAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ',
    };
  }

  const result = await wishlistService.toggleWishlist(
    session.user.id,
    productId
  );

  if (result.success) {
    revalidatePath('/wishlist');
    revalidatePath('/shop');
  }

  return result;
}

// Add to wishlist
export async function addToWishlistAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ',
    };
  }

  const result = await wishlistService.addToWishlist(
    session.user.id,
    productId
  );

  if (result.success) {
    revalidatePath('/wishlist');
    revalidatePath('/shop');
  }

  return result;
}

// Remove from wishlist
export async function removeFromWishlistAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ',
    };
  }

  const result = await wishlistService.removeFromWishlist(
    session.user.id,
    productId
  );

  if (result.success) {
    revalidatePath('/wishlist');
    revalidatePath('/shop');
  }

  return result;
}

// Clear wishlist
export async function clearWishlistAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ',
    };
  }

  const result = await wishlistService.clearWishlist(session.user.id);

  if (result.success) {
    revalidatePath('/wishlist');
  }

  return result;
}

// Get wishlist count
export async function getWishlistCountAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return 0;
  }

  return wishlistService.getWishlistCount(session.user.id);
}

// Check if product is in wishlist
export async function isInWishlistAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return false;
  }

  return wishlistService.isInWishlist(session.user.id, productId);
}

// Get wishlist product IDs
export async function getWishlistProductIdsAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return wishlistService.getWishlistProductIds(session.user.id);
}
