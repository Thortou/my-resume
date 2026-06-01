'use client';

import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Button, Space, Upload, App } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Banner } from '@prisma/client';
import Image from 'next/image';
import { createBannerSchema, updateBannerSchema, type CreateBannerInput } from '@/schemas';
import { uploadImageAction } from '@/actions';
import { CLOUDINARY_FOLDERS } from '@/constants';

interface BannerFormProps {
  banner?: Banner | null;
  isLoading?: boolean;
  onSubmit: (data: CreateBannerInput) => void;
  onCancel?: () => void;
}

export function BannerForm({ banner, isLoading, onSubmit, onCancel }: BannerFormProps) {
  const { message } = App.useApp();
  const isEditing = !!banner;
  const [imageUrl, setImageUrl] = useState<string>(banner?.image || '');
  const [uploading, setUploading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateBannerInput>({
    resolver: zodResolver(isEditing ? updateBannerSchema : createBannerSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      link: '',
      sortOrder: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (banner) {
      reset({
        title: banner.title,
        description: banner.description || '',
        image: banner.image,
        link: banner.link || '',
        sortOrder: banner.sortOrder,
        isActive: banner.isActive,
      });
      setImageUrl(banner.image);
    } else {
      reset({
        title: '',
        description: '',
        image: '',
        link: '',
        sortOrder: 0,
        isActive: true,
      });
      setImageUrl('');
    }
  }, [banner, reset]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const result = await uploadImageAction(base64, CLOUDINARY_FOLDERS.BANNERS);

        if (result.success && result.data) {
          setImageUrl(result.data.secureUrl);
          setValue('image', result.data.secureUrl);
          message.success('Image uploaded successfully');
        } else {
          message.error(result.error || 'Upload failed');
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      message.error('Upload failed');
      setUploading(false);
    }

    return false;
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Title"
        validateStatus={errors.title ? 'error' : undefined}
        help={errors.title?.message}
        required
      >
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Enter banner title" size="large" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Description"
        validateStatus={errors.description ? 'error' : undefined}
        help={errors.description?.message}
      >
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              value={field.value || ''}
              placeholder="Enter banner description"
              rows={3}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Banner Image"
        validateStatus={errors.image ? 'error' : undefined}
        help={errors.image?.message}
        required
      >
        <div className="space-y-3">
          {imageUrl && (
            <div className="relative h-40 w-full overflow-hidden rounded-lg border">
              <Image
                src={imageUrl}
                alt="Banner preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleImageUpload}
          >
            <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} loading={uploading}>
              {uploading ? 'Uploading...' : imageUrl ? 'Change Image' : 'Upload Image'}
            </Button>
          </Upload>
          <Controller
            name="image"
            control={control}
            render={({ field }) => <input type="hidden" {...field} />}
          />
        </div>
      </Form.Item>

      <Form.Item
        label="Link URL (optional)"
        validateStatus={errors.link ? 'error' : undefined}
        help={errors.link?.message}
      >
        <Controller
          name="link"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ''}
              placeholder="https://example.com"
              size="large"
            />
          )}
        />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="Sort Order"
          validateStatus={errors.sortOrder ? 'error' : undefined}
          help={errors.sortOrder?.message}
        >
          <Controller
            name="sortOrder"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                className="w-full"
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Active"
          validateStatus={errors.isActive ? 'error' : undefined}
          help={errors.isActive?.message}
        >
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Form.Item>
      </div>

      <Form.Item className="mb-0">
        <Space>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEditing ? 'Update Banner' : 'Create Banner'}
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
