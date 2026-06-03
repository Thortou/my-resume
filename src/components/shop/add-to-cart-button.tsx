'use client';

import { useState } from 'react';
import { Button, InputNumber, Space, message } from 'antd';
import {
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { addToCartAction } from '@/actions/cart.actions';

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  maxQuantity?: number;
}

export function AddToCartButton({
  productId,
  disabled = false,
  maxQuantity = 99,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const result = await addToCartAction(productId, quantity);
      if (result.success) {
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

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex items-center">
        <Button
          icon={<MinusOutlined />}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1 || disabled}
        />
        <InputNumber
          min={1}
          max={maxQuantity}
          value={quantity}
          onChange={(val) => setQuantity(val || 1)}
          disabled={disabled}
          className="mx-2 w-20"
          controls={false}
        />
        <Button
          icon={<PlusOutlined />}
          onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
          disabled={quantity >= maxQuantity || disabled}
        />
      </div>
      <Button
        type="primary"
        size="large"
        icon={<ShoppingCartOutlined />}
        onClick={handleAddToCart}
        loading={loading}
        disabled={disabled}
        className="flex-1"
      >
        {disabled ? 'ໝົດສິນຄ້າ' : 'ເພີ່ມໃສ່ກະຕ່າ'}
      </Button>
    </div>
  );
}
