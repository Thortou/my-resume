'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, Alert, Card } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/schemas';
import { loginAction } from '@/actions';
import { ROUTES } from '@/constants';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || ROUTES.ADMIN_DASHBOARD;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    const result = await loginAction(data);

    if (result.success) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">ຍິນດີຕ້ອນຮັບກັບມາ</h1>
        <p className="mt-2 text-gray-600">ເຂົ້າສູ່ລະບົບບັນຊີຂອງທ່ານ</p>
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
                autoComplete="current-password"
              />
            )}
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
          >
            ເຂົ້າສູ່ລະບົບ
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
