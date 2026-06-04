'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Card,
  Form,
  Input,
  Button,
  Divider,
  Empty,
  Spin,
  message,
  Result,
  Collapse,
} from 'antd';
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { ROUTES } from '@/constants';
import { getCartAction, validateCartAction } from '@/actions/cart.actions';
import { checkoutAction } from '@/actions/order.actions';
import { applyCouponAction } from '@/actions/coupon.actions';
import { getCurrentUserAction } from '@/actions/user.actions';

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  itemTotal: number;
  product: {
    id: string;
    name: string;
    thumbnail: string | null;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Fetch cart and user
  useEffect(() => {
    const init = async () => {
      try {
        const [cartResult, userResult] = await Promise.all([
          getCartAction(),
          getCurrentUserAction(),
        ]);

        if (cartResult.items.length === 0) {
          router.push(ROUTES.CART);
          return;
        }

        // Validate cart
        const validation = await validateCartAction();
        if (!validation.success) {
          message.error(validation.error);
          router.push(ROUTES.CART);
          return;
        }

        setCart(cartResult);

        // Pre-fill user info
        if (userResult) {
          const user = userResult as any;
          form.setFieldsValue({
            customerName: user.name || '',
            customerEmail: user.email || '',
            customerPhone: user.phone || '',
            shippingAddress: user.address || '',
          });
        }
      } catch (error) {
        message.error('ໂຫລດຂໍ້ມູນລົ້ມເຫລວ');
        router.push(ROUTES.CART);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router, form]);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      message.warning('ກະລຸນາໃສ່ລະຫັດສ່ວນຫຼຸດ');
      return;
    }

    setApplyingCoupon(true);
    try {
      const result = await applyCouponAction(couponCode, cart!.subtotal);
      if (result.success && result.data) {
        const data = result.data as { discount: number };
        setDiscount(data.discount);
        message.success(result.message);
      } else {
        message.error(result.error);
        setDiscount(0);
      }
    } catch (error) {
      message.error('ໃຊ້ລະຫັດສ່ວນຫຼຸດລົ້ມເຫລວ');
      setDiscount(0);
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Handle checkout
  const handleCheckout = async (values: any) => {
    setSubmitting(true);
    try {
      const result = await checkoutAction({
        ...values,
        couponCode: discount > 0 ? couponCode : undefined,
      });

      if (result.success && result.data) {
        const data = result.data as { orderNumber: string };
        setOrderNumber(data.orderNumber);
        setOrderComplete(true);
        // Update cart indicator
        window.dispatchEvent(new CustomEvent('cart-updated'));
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ສັ່ງຊື້ລົ້ມເຫລວ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <Spin size="large" />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="ສັ່ງຊື້ສຳເລັດແລ້ວ!"
          subTitle={
            <div className="text-center">
              <p>
                ເລກທີ່ຄຳສັ່ງຊື້: <strong>{orderNumber}</strong>
              </p>
              <p className="mt-2">ຂອບໃຈທີ່ໃຊ້ບໍລິການ</p>
            </div>
          }
          extra={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href={ROUTES.ORDERS}>
                <Button type="primary" block className="sm:w-auto">
                  ເບິ່ງຄຳສັ່ງຊື້ຂອງຂ້ອຍ
                </Button>
              </Link>
              <Link href={ROUTES.SHOP}>
                <Button block className="sm:w-auto">
                  ຊ້ອບປິ້ງຕໍ່
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Empty description="ກະຕ່າຂອງທ່ານວ່າງ">
          <Link href={ROUTES.SHOP}>
            <Button type="primary" icon={<ShoppingOutlined />}>
              ເລີ່ມຊ້ອບປິ້ງ
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  const total = cart.subtotal - discount;

  // Order Summary Component (reusable for mobile and desktop)
  const OrderSummaryContent = () => (
    <>
      {/* Items */}
      <div className="space-y-3">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 text-sm">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
              {item.product.thumbnail ? (
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.product.name}</p>
              <p className="text-gray-500">x{item.quantity}</p>
            </div>
            <span className="flex-shrink-0 font-medium">
              {item.itemTotal.toLocaleString()} ₭
            </span>
          </div>
        ))}
      </div>

      <Divider className="my-4" />

      {/* Coupon */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-600">ລະຫັດສ່ວນຫຼຸດ</p>
        <div className="flex gap-2">
          <Input
            placeholder="ໃສ່ລະຫັດ"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            disabled={discount > 0}
            className="flex-1"
          />
          {discount > 0 ? (
            <Button
              danger
              onClick={() => {
                setCouponCode('');
                setDiscount(0);
              }}
            >
              ລຶບ
            </Button>
          ) : (
            <Button onClick={handleApplyCoupon} loading={applyingCoupon}>
              ໃຊ້
            </Button>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">ລວມຍ່ອຍ</span>
          <span>{cart.subtotal.toLocaleString()} ₭</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>ສ່ວນຫຼຸດ</span>
            <span>-{discount.toLocaleString()} ₭</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">ຄ່າສົ່ງ</span>
          <span className="text-green-600">ຟຣີ</span>
        </div>
        <Divider className="my-2" />
        <div className="flex justify-between text-lg font-bold">
          <span>ລວມທັງໝົດ</span>
          <span className="text-primary-600">{total.toLocaleString()} ₭</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3 sm:mb-6">
        <Link href={ROUTES.CART}>
          <Button icon={<ArrowLeftOutlined />} className="sm:hidden" />
          <Button icon={<ArrowLeftOutlined />} className="hidden sm:flex">
            ກັບຄືນກະຕ່າ
          </Button>
        </Link>
        <h1 className="text-xl font-bold sm:text-2xl">ຊຳລະເງິນ</h1>
      </div>

      {/* Mobile Order Summary (Collapsible) */}
      <div className="mb-4 lg:hidden">
        <Collapse
          items={[
            {
              key: '1',
              label: (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCartOutlined />
                    <span>ສະຫຼຸບຄຳສັ່ງຊື້ ({cart.itemCount} ລາຍການ)</span>
                  </div>
                  <span className="font-bold text-primary-600">
                    {total.toLocaleString()} ₭
                  </span>
                </div>
              ),
              children: <OrderSummaryContent />,
            },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card title="ຂໍ້ມູນການຈັດສົ່ງ" className="shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleCheckout}
              requiredMark={false}
            >
              <Form.Item
                name="customerName"
                label="ຊື່ເຕັມ"
                rules={[{ required: true, message: 'ກະລຸນາໃສ່ຊື່' }]}
              >
                <Input placeholder="ໃສ່ຊື່ເຕັມຂອງທ່ານ" size="large" />
              </Form.Item>

              <div className="grid gap-4 sm:grid-cols-2">
                <Form.Item
                  name="customerEmail"
                  label="ອີເມວ"
                  rules={[
                    { required: true, message: 'ກະລຸນາໃສ່ອີເມວ' },
                    { type: 'email', message: 'ອີເມວບໍ່ຖືກຕ້ອງ' },
                  ]}
                >
                  <Input placeholder="email@example.com" size="large" />
                </Form.Item>

                <Form.Item name="customerPhone" label="ເບີໂທ">
                  <Input placeholder="020 XXXX XXXX" size="large" />
                </Form.Item>
              </div>

              <Form.Item name="shippingAddress" label="ທີ່ຢູ່ຈັດສົ່ງ">
                <Input.TextArea
                  rows={3}
                  placeholder="ທີ່ຢູ່ສຳລັບຈັດສົ່ງສິນຄ້າ"
                />
              </Form.Item>

              <Form.Item name="notes" label="ໝາຍເຫດ">
                <Input.TextArea
                  rows={2}
                  placeholder="ຂໍ້ມູນເພີ່ມເຕີມ (ບໍ່ບັງຄັບ)"
                />
              </Form.Item>

              {/* Mobile Submit Button */}
              <div className="lg:hidden">
                <div className="mb-3 flex justify-between rounded-lg bg-gray-50 p-3">
                  <span className="font-medium">ຍອດລວມທັງໝົດ</span>
                  <span className="text-lg font-bold text-primary-600">
                    {total.toLocaleString()} ₭
                  </span>
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitting}
                  block
                >
                  ຢືນຢັນການສັ່ງຊື້
                </Button>
              </div>

              {/* Desktop Submit Button */}
              <div className="hidden lg:block">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitting}
                  block
                >
                  ຢືນຢັນການສັ່ງຊື້
                </Button>
              </div>
            </Form>
          </Card>
        </div>

        {/* Desktop Order Summary */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <Card title="ສະຫຼຸບຄຳສັ່ງຊື້" className="shadow-sm">
              <OrderSummaryContent />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
