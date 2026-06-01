'use client';

import { useState } from 'react';
import { Table, Tag, Space, Button, Modal, Avatar, message } from 'antd';
import type { TableColumnsType, TablePaginationConfig } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { User } from '@prisma/client';
import { deleteUserAction } from '@/actions';
import { formatDate, getInitials } from '@/lib/utils';
import { ROLE_LABELS, MESSAGES } from '@/constants';

interface UsersTableProps {
  users: User[];
  total: number;
  page: number;
  limit: number;
  isLoading?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (user: User) => void;
  onRefresh: () => void;
}

export function UsersTable({
  users,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
  onEdit,
  onRefresh,
}: UsersTableProps) {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleDelete = async (user: User) => {
    Modal.confirm({
      title: 'Delete User',
      content: `Are you sure you want to delete "${user.name || user.email}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setDeleteLoading(user.id);
        const result = await deleteUserAction(user.id);

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

  const columns: TableColumnsType<User> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            src={record.image}
            className="bg-primary-500"
          >
            {record.name ? getInitials(record.name) : record.email[0].toUpperCase()}
          </Avatar>
          <div>
            <div className="font-medium">{record.name || '-'}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'blue' : 'default'}>
          {ROLE_LABELS[role as keyof typeof ROLE_LABELS]}
        </Tag>
      ),
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
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
    onChange: onPageChange,
  };

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      pagination={pagination}
      loading={isLoading}
      scroll={{ x: 800 }}
    />
  );
}
