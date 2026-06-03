'use client';

import { useState, useEffect } from 'react';
import { Button, message, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import {
  toggleWishlistAction,
  isInWishlistAction,
} from '@/actions/wishlist.actions';

interface WishlistButtonProps {
  productId: string;
  size?: 'small' | 'middle' | 'large';
  showText?: boolean;
  className?: string;
}

export function WishlistButton({
  productId,
  size = 'middle',
  showText = false,
  className = '',
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if product is in wishlist on mount
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const result = await isInWishlistAction(productId);
        setIsInWishlist(result);
      } catch (error) {
        // Ignore error - user might not be logged in
      } finally {
        setChecking(false);
      }
    };

    checkWishlist();
  }, [productId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      const result = await toggleWishlistAction(productId);
      if (result.success) {
        setIsInWishlist(result.added ?? false);
        message.success(result.message);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ເກີດຂໍ້ຜິດພາດ');
    } finally {
      setLoading(false);
    }
  };

  const icon = isInWishlist ? (
    <HeartFilled className="text-red-500" />
  ) : (
    <HeartOutlined />
  );

  if (showText) {
    return (
      <Button
        type={isInWishlist ? 'default' : 'text'}
        icon={icon}
        onClick={handleToggle}
        loading={loading || checking}
        size={size}
        className={className}
        danger={isInWishlist}
      >
        {isInWishlist ? 'ຢູ່ໃນລາຍການທີ່ມັກ' : 'ເພີ່ມໃສ່ລາຍການທີ່ມັກ'}
      </Button>
    );
  }

  return (
    <Tooltip
      title={isInWishlist ? 'ລຶບອອກຈາກລາຍການທີ່ມັກ' : 'ເພີ່ມໃສ່ລາຍການທີ່ມັກ'}
    >
      <Button
        type="text"
        shape="circle"
        icon={icon}
        onClick={handleToggle}
        loading={loading || checking}
        size={size}
        className={`${className} hover:bg-gray-100`}
      />
    </Tooltip>
  );
}
