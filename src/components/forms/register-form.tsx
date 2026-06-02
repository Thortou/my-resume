'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Input, Button, Alert, Card } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/schemas';
import { registerAction } from '@/actions';
import { ROUTES } from '@/constants';

export function RegisterForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    const result = await registerAction(data);

    if (result.success) {
      // After successful registration, redirect to home (user role always goes to home)
      router.push(ROUTES.HOME);
      router.refresh();
    } else {
      setError(result.error || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">ສ້າງບັນຊີໃໝ່</h1>
        <p className="mt-2 text-gray-600">ລົງທະບຽນເພື່ອເລີ່ມຕົ້ນໃຊ້ງານ</p>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          className="mb-4"
          closable
          onClose={() => setError(null)}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="ຊື່"
          validateStatus={errors.name ? 'error' : undefined}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="ປ້ອນຊື່ຂອງທ່ານ"
                size="large"
                autoComplete="name"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="ອີເມວ"
          validateStatus={errors.email ? 'error' : undefined}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="ປ້ອນອີເມວຂອງທ່ານ"
                size="large"
                autoComplete="email"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="ລະຫັດຜ່ານ"
          validateStatus={errors.password ? 'error' : undefined}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="ປ້ອນລະຫັດຜ່ານຂອງທ່ານ"
                size="large"
                autoComplete="new-password"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="ຢືນຢັນລະຫັດຜ່ານ"
          validateStatus={errors.confirmPassword ? 'error' : undefined}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="ປ້ອນລະຫັດຜ່ານອີກຄັ້ງ"
                size="large"
                autoComplete="new-password"
              />
            )}
          />
        </Form.Item>

        <Form.Item className="mb-4">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
          >
            ລົງທະບຽນ
          </Button>
        </Form.Item>

        <div className="text-center text-sm text-gray-600">
          ມີບັນຊີແລ້ວບໍ?{' '}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            ເຂົ້າສູ່ລະບົບ
          </Link>
        </div>
      </Form>
    </Card>
  );
}
