'use client';

import { useEffect } from 'react';
import { Form, Input, Select, Switch, Button, Space } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User, Role } from '@prisma/client';
import { createUserSchema, updateUserSchema, type CreateUserInput } from '@/schemas';
import { ROLE_LABELS } from '@/constants';

interface UserFormProps {
  user?: User | null;
  isLoading?: boolean;
  onSubmit: (data: CreateUserInput) => void;
  onCancel?: () => void;
}

const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value: value as Role,
  label,
}));

export function UserForm({ user, isLoading, onSubmit, onCancel }: UserFormProps) {
  const isEditing = !!user;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        role: 'USER',
      });
    }
  }, [user, reset]);

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Name"
        validateStatus={errors.name ? 'error' : undefined}
        help={errors.name?.message}
        required
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Enter name" size="large" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        validateStatus={errors.email ? 'error' : undefined}
        help={errors.email?.message}
        required
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              placeholder="Enter email"
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
        validateStatus={errors.password ? 'error' : undefined}
        help={errors.password?.message}
        required={!isEditing}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              placeholder={isEditing ? 'Enter new password' : 'Enter password'}
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Role"
        validateStatus={errors.role ? 'error' : undefined}
        help={errors.role?.message}
        required
      >
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={roleOptions}
              placeholder="Select role"
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item className="mb-0">
        <Space>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEditing ? 'Update User' : 'Create User'}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}
