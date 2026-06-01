'use client';

import { useState } from 'react';
import { Form, Input, Button, Alert, Space, Result } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendOutlined, ReloadOutlined } from '@ant-design/icons';
import { contactSchema, type ContactInput } from '@/schemas';
import { submitContactAction } from '@/actions/contact.actions';

const { TextArea } = Input;

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactInput) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const result = await submitContactAction(data);

      if (result.success) {
        setIsSuccess(true);
        reset();
      } else {
        setSubmitError(result.error || 'Failed to send message. Please try again.');
      }
    } catch {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAnother = () => {
    setIsSuccess(false);
    setSubmitError(null);
    reset();
  };

  if (isSuccess) {
    return (
      <Result
        status="success"
        title="ສົ່ງຂໍ້ຄວາມສຳເລັດແລ້ວ!"
        subTitle="ຂອບໃຈທີ່ຕິດຕໍ່ຫາພວກເຮົາ. ພວກເຮົາຈະຕອບກັບທ່ານພາຍໃນ 24 ຊົ່ວໂມງ."
        extra={[
          <Button
            key="another"
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleSendAnother}
          >
            ສົ່ງຂໍ້ຄວາມອີກ
          </Button>,
        ]}
      />
    );
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-2">
      {submitError && (
        <Alert
          message={submitError}
          type="error"
          showIcon
          closable
          onClose={() => setSubmitError(null)}
          className="mb-4"
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Form.Item
          label="ຊື່"
          validateStatus={errors.name ? 'error' : undefined}
          help={errors.name?.message}
          required
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="ຊື່ເຕັມຂອງທ່ານ"
                size="large"
                maxLength={100}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="ອີເມວ"
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
                placeholder="your@email.com"
                size="large"
                maxLength={255}
              />
            )}
          />
        </Form.Item>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Form.Item
          label="ໂທລະສັບ"
          validateStatus={errors.phone ? 'error' : undefined}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                placeholder="+856 20 1234 5678"
                size="large"
                maxLength={20}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="ຫົວຂໍ້"
          validateStatus={errors.subject ? 'error' : undefined}
          help={errors.subject?.message}
          required
        >
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="ກ່ຽວກັບຫຍັງ?"
                size="large"
                maxLength={200}
              />
            )}
          />
        </Form.Item>
      </div>

      <Form.Item
        label="ຂໍ້ຄວາມ"
        validateStatus={errors.message ? 'error' : undefined}
        help={errors.message?.message}
        required
      >
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              placeholder="ຂໍ້ຄວາມຂອງທ່ານ..."
              rows={5}
              size="large"
              maxLength={5000}
              showCount
            />
          )}
        />
      </Form.Item>

      <Form.Item className="mb-0">
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            icon={<SendOutlined />}
            size="large"
          >
            ສົ່ງຂໍ້ຄວາມ
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
