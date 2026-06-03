'use client';

import { useState } from 'react';
import { Modal, Form, Input, Button, Result, Typography, Divider } from 'antd';
import {
  CreditCardOutlined,
  LockOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  demoPaymentSchema,
  type DemoPaymentInput,
  PRO_TEMPLATE_PRICE,
  PRODUCT_TYPES,
} from '@/schemas/payment.schema';
import { processDemoPaymentAction } from '@/actions/payment.actions';

const { Text, Title } = Typography;

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  templateName?: string;
}

export function PaymentModal({
  open,
  onClose,
  onSuccess,
  templateName = 'Pro Template',
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DemoPaymentInput>({
    resolver: zodResolver(demoPaymentSchema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      productType: PRODUCT_TYPES.PRO_TEMPLATE,
      amount: PRO_TEMPLATE_PRICE.amount,
    },
  });

  const onSubmit = async (data: DemoPaymentInput) => {
    setIsLoading(true);

    const result = await processDemoPaymentAction(data);

    if (result.success && result.data) {
      setTransactionId(result.data.transactionId);
      setIsSuccess(true);
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    if (isSuccess) {
      onSuccess();
    }
    setIsSuccess(false);
    setTransactionId(null);
    reset();
    onClose();
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={480}
      centered
      destroyOnClose
    >
      {isSuccess ? (
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="ການຊຳລະເງິນສຳເລັດ!"
          subTitle={
            <div className="space-y-2">
              <p>ຂອບໃຈທີ່ຊື້ {templateName}</p>
              <p className="text-gray-500">
                ລະຫັດທຸລະກຳ: <span className="font-mono">{transactionId}</span>
              </p>
            </div>
          }
          extra={[
            <Button key="close" type="primary" onClick={handleClose}>
              ເລີ່ມໃຊ້ງານ
            </Button>,
          ]}
        />
      ) : (
        <div className="py-2">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
              <CreditCardOutlined className="text-2xl text-white" />
            </div>
            <Title level={4} className="mb-1">
              ຊຳລະເງິນສຳລັບ {templateName}
            </Title>
            <div className="flex items-center justify-center gap-2">
              <Text className="text-2xl font-bold text-indigo-600">
                {PRO_TEMPLATE_PRICE.displayPrice}
              </Text>
              <Text type="secondary">(ຈ່າຍຄັ້ງດຽວ)</Text>
            </div>
          </div>

          <Divider className="my-4" />

          {/* Demo Notice */}
          <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            <SafetyOutlined className="mr-2" />
            <strong>ໂໝດສາທິດ:</strong> ນີ້ແມ່ນການຈ່າຍເງິນສາທິດ.
            ໃຊ້ຂໍ້ມູນບັດໃດກໍໄດ້ (ເຊັ່ນ: 4242 4242 4242 4242)
          </div>

          {/* Payment Form */}
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
              label="ໝາຍເລກບັດ"
              validateStatus={errors.cardNumber ? 'error' : undefined}
              help={errors.cardNumber?.message}
            >
              <Controller
                name="cardNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="4242 4242 4242 4242"
                    prefix={<CreditCardOutlined className="text-gray-400" />}
                    size="large"
                    maxLength={19}
                    onChange={(e) => {
                      field.onChange(formatCardNumber(e.target.value));
                    }}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="ຊື່ຜູ້ຖືບັດ"
              validateStatus={errors.cardHolder ? 'error' : undefined}
              help={errors.cardHolder?.message}
            >
              <Controller
                name="cardHolder"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="JOHN DOE"
                    size="large"
                    style={{ textTransform: 'uppercase' }}
                    onChange={(e) => {
                      field.onChange(e.target.value.toUpperCase());
                    }}
                  />
                )}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="ວັນໝົດອາຍຸ"
                validateStatus={errors.expiryDate ? 'error' : undefined}
                help={errors.expiryDate?.message}
              >
                <Controller
                  name="expiryDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="MM/YY"
                      size="large"
                      maxLength={5}
                      onChange={(e) => {
                        field.onChange(formatExpiryDate(e.target.value));
                      }}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="CVV"
                validateStatus={errors.cvv ? 'error' : undefined}
                help={errors.cvv?.message}
              >
                <Controller
                  name="cvv"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="123"
                      prefix={<LockOutlined className="text-gray-400" />}
                      size="large"
                      maxLength={4}
                      type="password"
                    />
                  )}
                />
              </Form.Item>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
              className="mt-4 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLoading
                ? 'ກຳລັງດຳເນີນການ...'
                : `ຊຳລະ ${PRO_TEMPLATE_PRICE.displayPrice}`}
            </Button>
          </Form>

          {/* Security Notice */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <LockOutlined />
            <span>ການເຊື່ອມຕໍ່ປອດໄພດ້ວຍ SSL</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
