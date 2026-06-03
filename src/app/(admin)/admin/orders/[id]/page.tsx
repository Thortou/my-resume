import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Tag, Descriptions, Table, Button, Divider } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui';
import { ROUTES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants';
import { getOrderByIdAction } from '@/actions/order.actions';

export const metadata: Metadata = {
  title: 'ລາຍລະອຽດຄຳສັ່ງຊື້ | Admin',
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

  const columns = [
    {
      title: 'ສິນຄ້າ',
      key: 'product',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          {record.product?.thumbnail && (
            <Image
              src={record.product.thumbnail}
              alt={record.productName}
              width={48}
              height={48}
              className="rounded"
            />
          )}
          <div>
            <p className="font-medium">{record.productName}</p>
            <p className="text-sm text-gray-500">{record.productSku || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'ລາຄາ',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${Number(price).toLocaleString()} ₭`,
    },
    {
      title: 'ຈຳນວນ',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'ລວມ',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <span className="font-medium">{Number(total).toLocaleString()} ₭</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`ຄຳສັ່ງຊື້ #${order.orderNumber}`}
        description={`ສ້າງເມື່ອ ${new Date(order.createdAt).toLocaleDateString(
          'lo-LA',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }
        )}`}
        actions={
          <div className="flex gap-2">
            <Link href={ROUTES.ADMIN_ORDERS}>
              <Button icon={<ArrowLeftOutlined />}>ກັບຄືນ</Button>
            </Link>
            <Button icon={<PrinterOutlined />}>ພິມໃບບິນ</Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Info */}
        <div className="space-y-6 lg:col-span-2">
          <Card
            title="ລາຍການສິນຄ້າ"
            extra={
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
            }
          >
            <Table
              columns={columns}
              dataSource={order.items}
              rowKey="id"
              pagination={false}
              summary={() => (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={3}
                      className="text-right"
                    >
                      ລວມຍ່ອຍ:
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      {Number(order.subtotal).toLocaleString()} ₭
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  {Number(order.discount) > 0 && (
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        index={0}
                        colSpan={3}
                        className="text-right"
                      >
                        ສ່ວນຫຼຸດ ({order.couponCode}):
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} className="text-green-500">
                        -{Number(order.discount).toLocaleString()} ₭
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={3}
                      className="text-right font-bold"
                    >
                      ລວມທັງໝົດ:
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} className="text-lg font-bold">
                      {Number(order.total).toLocaleString()} ₭
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              )}
            />
          </Card>

          {order.notes && (
            <Card title="ໝາຍເຫດ">
              <p>{order.notes}</p>
            </Card>
          )}
        </div>

        {/* Customer & Order Info */}
        <div className="space-y-6">
          <Card title="ຂໍ້ມູນລູກຄ້າ">
            <Descriptions column={1} size="small">
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

          <Card title="ຂໍ້ມູນຄຳສັ່ງຊື້">
            <Descriptions column={1} size="small">
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
              {order.cancelledAt && (
                <Descriptions.Item label="ວັນທີຍົກເລີກ">
                  {new Date(order.cancelledAt).toLocaleDateString('lo-LA')}
                </Descriptions.Item>
              )}
              {order.coupon && (
                <Descriptions.Item label="ລະຫັດສ່ວນຫຼຸດ">
                  <Tag color="green">{order.couponCode}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          <Card title="ບັນຊີຜູ້ໃຊ້">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="ຊື່">
                {order.user?.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="ອີເມວ">
                {order.user?.email}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </div>
    </div>
  );
}
