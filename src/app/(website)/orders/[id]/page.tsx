import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, Tag, Descriptions, Button, Steps } from 'antd';
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { ROUTES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants';
import { getOrderByIdAction } from '@/actions/order.actions';
import { OrderItemsTable } from '@/components/shop/order-items-table';

export const metadata: Metadata = {
  title: 'ລາຍລະອຽດຄຳສັ່ງຊື້',
};

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderByIdAction(id);

  if (!order) {
    notFound();
  }

  // Determine current step
  const getStepStatus = () => {
    switch (order.status) {
      case 'PENDING':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'COMPLETED':
        return 2;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getStepStatus();
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="mb-3 flex items-center gap-3">
          <Link href={ROUTES.ORDERS}>
            <Button icon={<ArrowLeftOutlined />} className="sm:hidden" />
            <Button icon={<ArrowLeftOutlined />} className="hidden sm:flex">
              ກັບຄືນ
            </Button>
          </Link>
          <h1 className="text-lg font-bold sm:text-2xl">
            ຄຳສັ່ງຊື້ #{order.orderNumber}
          </h1>
        </div>
        <p className="text-sm text-gray-500 sm:text-base">
          {new Date(order.createdAt).toLocaleDateString('lo-LA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Order Status Steps */}
      {!isCancelled ? (
        <Card className="mb-4 sm:mb-6">
          {/* Mobile Status - Simple Badge */}
          <div className="flex items-center justify-between sm:hidden">
            <span className="text-sm font-medium">ສະຖານະ:</span>
            <Tag
              color={
                ORDER_STATUS_COLORS[
                  order.status as keyof typeof ORDER_STATUS_COLORS
                ]
              }
              className="m-0"
            >
              {
                ORDER_STATUS_LABELS[
                  order.status as keyof typeof ORDER_STATUS_LABELS
                ]
              }
            </Tag>
          </div>
          {/* Desktop Status - Steps */}
          <div className="hidden sm:block">
            <Steps
              current={currentStep}
              items={[
                {
                  title: 'ລໍຖ້າ',
                  icon: <ClockCircleOutlined />,
                },
                {
                  title: 'ກຳລັງດຳເນີນການ',
                  icon: <SyncOutlined />,
                },
                {
                  title: 'ສຳເລັດ',
                  icon: <CheckCircleOutlined />,
                },
              ]}
            />
          </div>
        </Card>
      ) : (
        <Card className="mb-4 bg-red-50 sm:mb-6">
          <div className="flex items-center gap-3 text-red-500">
            <CloseCircleOutlined className="text-xl sm:text-2xl" />
            <div>
              <p className="font-medium">ຄຳສັ່ງຊື້ນີ້ຖືກຍົກເລີກແລ້ວ</p>
              {order.cancelledAt && (
                <p className="text-sm">
                  ວັນທີ:{' '}
                  {new Date(order.cancelledAt).toLocaleDateString('lo-LA')}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Mobile Summary Card */}
      <div className="mb-4 rounded-lg border bg-primary-50 p-4 sm:hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium">ຍອດລວມທັງໝົດ</span>
          <span className="text-xl font-bold text-primary-600">
            {Number(order.total).toLocaleString()} ₭
          </span>
        </div>
        {Number(order.discount) > 0 && (
          <p className="mt-1 text-sm text-green-600">
            ສ່ວນຫຼຸດ: -{Number(order.discount).toLocaleString()} ₭
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Order Items */}
        <div className="order-2 lg:order-1 lg:col-span-2">
          <Card title="ລາຍການສິນຄ້າ" className="shadow-sm">
            <OrderItemsTable
              items={order.items}
              subtotal={Number(order.subtotal)}
              discount={Number(order.discount)}
              total={Number(order.total)}
              couponCode={order.couponCode}
            />
          </Card>
        </div>

        {/* Order Info */}
        <div className="order-1 space-y-4 lg:order-2 lg:space-y-6">
          {/* Order Info Card */}
          <Card title="ຂໍ້ມູນການສັ່ງຊື້" className="shadow-sm">
            {/* Mobile Layout */}
            <div className="space-y-3 sm:hidden">
              <div className="flex justify-between">
                <span className="text-gray-500">ເລກທີ່</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ສະຖານະ</span>
                <Tag
                  color={
                    ORDER_STATUS_COLORS[
                      order.status as keyof typeof ORDER_STATUS_COLORS
                    ]
                  }
                  className="m-0"
                >
                  {
                    ORDER_STATUS_LABELS[
                      order.status as keyof typeof ORDER_STATUS_LABELS
                    ]
                  }
                </Tag>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ວັນທີສັ່ງ</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString('lo-LA')}
                </span>
              </div>
              {order.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">ວັນທີສຳເລັດ</span>
                  <span>
                    {new Date(order.completedAt).toLocaleDateString('lo-LA')}
                  </span>
                </div>
              )}
            </div>
            {/* Desktop Layout */}
            <Descriptions column={1} size="small" className="hidden sm:block">
              <Descriptions.Item label="ເລກທີ່">
                {order.orderNumber}
              </Descriptions.Item>
              <Descriptions.Item label="ສະຖານະ">
                <Tag
                  color={
                    ORDER_STATUS_COLORS[
                      order.status as keyof typeof ORDER_STATUS_COLORS
                    ]
                  }
                >
                  {
                    ORDER_STATUS_LABELS[
                      order.status as keyof typeof ORDER_STATUS_LABELS
                    ]
                  }
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="ວັນທີສັ່ງ">
                {new Date(order.createdAt).toLocaleDateString('lo-LA')}
              </Descriptions.Item>
              {order.completedAt && (
                <Descriptions.Item label="ວັນທີສຳເລັດ">
                  {new Date(order.completedAt).toLocaleDateString('lo-LA')}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Shipping Info Card */}
          <Card title="ຂໍ້ມູນການຈັດສົ່ງ" className="shadow-sm">
            {/* Mobile Layout */}
            <div className="space-y-3 sm:hidden">
              <div className="flex justify-between">
                <span className="text-gray-500">ຊື່</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ອີເມວ</span>
                <span className="max-w-[180px] truncate text-right">
                  {order.customerEmail}
                </span>
              </div>
              {order.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">ເບີໂທ</span>
                  <span>{order.customerPhone}</span>
                </div>
              )}
              {order.shippingAddress && (
                <div>
                  <span className="text-gray-500">ທີ່ຢູ່</span>
                  <p className="mt-1 text-sm">{order.shippingAddress}</p>
                </div>
              )}
            </div>
            {/* Desktop Layout */}
            <Descriptions column={1} size="small" className="hidden sm:block">
              <Descriptions.Item label="ຊື່">
                {order.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="ອີເມວ">
                {order.customerEmail}
              </Descriptions.Item>
              {order.customerPhone && (
                <Descriptions.Item label="ເບີໂທ">
                  {order.customerPhone}
                </Descriptions.Item>
              )}
              {order.shippingAddress && (
                <Descriptions.Item label="ທີ່ຢູ່">
                  {order.shippingAddress}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {order.notes && (
            <Card title="ໝາຍເຫດ" className="shadow-sm">
              <p className="text-sm sm:text-base">{order.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
