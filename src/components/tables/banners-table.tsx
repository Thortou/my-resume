'use client';

import { useState } from 'react';
import { Table, Tag, Space, Button, Modal, message } from 'antd';
import type { TableColumnsType, TablePaginationConfig } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Banner } from '@prisma/client';
import Image from 'next/image';
import { deleteBannerAction } from '@/actions';
import { formatDate, truncate } from '@/lib/utils';
import { MESSAGES } from '@/constants';

interface BannersTableProps {
  banners: Banner[];
  total: number;
  page: number;
  limit: number;
  isLoading?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (banner: Banner) => void;
  onRefresh: () => void;
}

export function BannersTable({
  banners,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
  onEdit,
  onRefresh,
}: BannersTableProps) {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleDelete = async (banner: Banner) => {
    Modal.confirm({
      title: 'Delete Banner',
      content: `Are you sure you want to delete "${banner.title}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setDeleteLoading(banner.id);
        const result = await deleteBannerAction(banner.id);

        if (result.success) {
          message.success(MESSAGES.DELETE_SUCCESS);
          onRefresh();
        } else {
          message.error(result.error || MESSAGES.SERVER_ERROR);
        }
        setDeleteLoading(null);
      },
    });
  };

  const columns: TableColumnsType<Banner> = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image) => (
        <div className="relative h-16 w-24 overflow-hidden rounded">
          <Image
            src={image}
            alt="Banner"
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <div className="font-medium">{title}</div>
          {record.description && (
            <div className="text-sm text-gray-500">
              {truncate(record.description, 50)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={deleteLoading === record.id}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize: limit,
    total,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} banners`,
    onChange: onPageChange,
  };

  return (
    <Table
      columns={columns}
      dataSource={banners}
      rowKey="id"
      pagination={pagination}
      loading={isLoading}
      scroll={{ x: 800 }}
    />
  );
}
