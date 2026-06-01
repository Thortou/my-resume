'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, App } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { User } from '@prisma/client';
import { PageHeader } from '@/components/ui';
import { UsersTable } from '@/components/tables';
import { UserForm } from '@/components/forms';
import { getUsersAction, createUserAction, updateUserAction } from '@/actions';
import type { CreateUserInput } from '@/schemas';
import { useDebounce } from '@/hooks';
import { DEFAULT_PAGE_SIZE, MESSAGES } from '@/constants';

export default function UsersPage() {
  const { message } = App.useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const result = await getUsersAction({
      page,
      limit,
      search: debouncedSearch || undefined,
    });

    if (result.success && result.data) {
      setUsers(result.data.users);
      setTotal(result.data.total);
    }
    setIsLoading(false);
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateUserInput) => {
    setIsSubmitting(true);

    const result = editingUser
      ? await updateUserAction(editingUser.id, data)
      : await createUserAction(data);

    if (result.success) {
      message.success(
        editingUser ? MESSAGES.UPDATE_SUCCESS : MESSAGES.CREATE_SUCCESS
      );
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } else {
      message.error(result.error || MESSAGES.SERVER_ERROR);
    }

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div>
      <PageHeader
        title="ຜູ້ໃຊ້"
        description="ຈັດການບັນຊີຜູ້ໃຊ້"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            ເພີ່ມຜູ້ໃຊ້
          </Button>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="ຄົ້ນຫາຜູ້ໃຊ້..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 300 }}
        />
      </div>

      <UsersTable
        users={users}
        total={total}
        page={page}
        limit={limit}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onRefresh={fetchUsers}
      />

      <Modal
        title={editingUser ? 'ແກ້ໄຂຜູ້ໃຊ້' : 'ສ້າງຜູ້ໃຊ້'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
      >
        <UserForm
          user={editingUser}
          isLoading={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
}
