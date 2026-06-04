'use client';

import Image from 'next/image';
import { Table } from 'antd';

interface OrderItem {
  id: string;
  productName: string;
  productSku: string | null;
  price: number;
  quantity: number;
  total: number;
  product?: {
    thumbnail: string | null;
  } | null;
}

interface OrderItemsTableProps {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
}

export function OrderItemsTable({
  items,
  subtotal,
  discount,
  total,
  couponCode,
}: OrderItemsTableProps) {
  const columns = [
    {
      title: 'ສິນຄ້າ',
      key: 'product',
      render: (_: unknown, record: OrderItem) => (
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
      render: (itemTotal: number) => (
        <span className="font-medium">
          {Number(itemTotal).toLocaleString()} ₭
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={items}
      rowKey="id"
      pagination={false}
      summary={() => (
        <>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3} className="text-right">
              ລວມຍ່ອຍ:
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              {Number(subtotal).toLocaleString()} ₭
            </Table.Summary.Cell>
          </Table.Summary.Row>
          {Number(discount) > 0 && (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3} className="text-right">
                ສ່ວນຫຼຸດ ({couponCode}):
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} className="text-green-500">
                -{Number(discount).toLocaleString()} ₭
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
              {Number(total).toLocaleString()} ₭
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </>
      )}
    />
  );
}
