'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/constants';
import { getCartCountAction } from '@/actions/cart.actions';
import { cn } from '@/lib/utils';

interface CartIndicatorProps {
  className?: string;
  isActive?: boolean;
}

export function CartIndicator({ className, isActive }: CartIndicatorProps) {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const cartCount = await getCartCountAction();
      setCount(cartCount);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  }, []);

  useEffect(() => {
    fetchCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCount();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [fetchCount]);

  return (
    <Link
      href={ROUTES.CART}
      className={cn(
        'relative flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary-600',
        isActive ? 'text-primary-600' : 'text-gray-600',
        className
      )}
    >
      <div className="relative">
        <ShoppingCart size={20} />
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
      <span className="hidden sm:inline">ກະຕ່າ</span>
    </Link>
  );
}
