'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Card,
  Row,
  Col,
  Upload,
  App,
  Divider,
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { ROUTES } from '@/constants';
import { getActiveCategoriesAction } from '@/actions/category.actions';
import {
  createProductAction,
  updateProductAction,
} from '@/actions/product.actions';
import { uploadImageAction } from '@/actions/upload.actions';

const { TextArea } = Input;

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(
    initialData?.thumbnail || null
  );
  const [gallery, setGallery] = useState<string[]>(
    initialData?.images?.map((img: any) => img.url) || []
  );
  const [uploadLoading, setUploadLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getActiveCategoriesAction();
        setCategories(result as Category[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Set initial form values
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        categoryId: initialData.categoryId,
        description: initialData.description,
        shortDescription: initialData.shortDescription,
        price: Number(initialData.price),
        salePrice: initialData.salePrice ? Number(initialData.salePrice) : null,
        costPrice: initialData.costPrice ? Number(initialData.costPrice) : null,
        sku: initialData.sku,
        barcode: initialData.barcode,
        stockQuantity: initialData.stockQuantity,
        minStockLevel: initialData.minStockLevel,
        isFeatured: initialData.isFeatured,
        isActive: initialData.isActive,
      });
    }
  }, [initialData, form]);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await uploadImageAction(
        base64,
        'full-stack-starter/products'
      );
      if (result.success && result.data) {
        setThumbnail(result.data.url);
        message.success('ອັບໂຫລດຮູບສຳເລັດ');
      } else {
        message.error(result.error || 'ອັບໂຫລດລົ້ມເຫລວ');
      }
    } catch {
      message.error('ອັບໂຫລດລົ້ມເຫລວ');
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  // Handle gallery upload
  const handleGalleryUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await uploadImageAction(
        base64,
        'full-stack-starter/products'
      );
      if (result.success && result.data) {
        setGallery((prev) => [...prev, result.data!.url]);
        message.success('ອັບໂຫລດຮູບສຳເລັດ');
      } else {
        message.error(result.error || 'ອັບໂຫລດລົ້ມເຫລວ');
      }
    } catch {
      message.error('ອັບໂຫລດລົ້ມເຫລວ');
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submit
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        thumbnail,
        images: gallery,
      };

      let result;
      if (isEdit && initialData?.id) {
        result = await updateProductAction(initialData.id, data);
      } else {
        result = await createProductAction(data);
      }

      if (result.success) {
        message.success(result.message);
        router.push(ROUTES.ADMIN_PRODUCTS);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ບັນທຶກລົ້ມເຫລວ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        stockQuantity: 0,
        minStockLevel: 5,
        isFeatured: false,
        isActive: true,
      }}
    >
      <Row gutter={24}>
        {/* Left Column - Main Info */}
        <Col xs={24} lg={16}>
          <Card title="ຂໍ້ມູນພື້ນຖານ" className="mb-6">
            <Form.Item
              name="name"
              label="ຊື່ສິນຄ້າ"
              rules={[{ required: true, message: 'ກະລຸນາໃສ່ຊື່ສິນຄ້າ' }]}
            >
              <Input placeholder="ໃສ່ຊື່ສິນຄ້າ" />
            </Form.Item>

            <Form.Item name="categoryId" label="ໝວດໝູ່">
              <Select
                placeholder="ເລືອກໝວດໝູ່"
                allowClear
                options={categories.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
              />
            </Form.Item>

            <Form.Item name="shortDescription" label="ຄຳອະທິບາຍສັ້ນ">
              <Input placeholder="ຄຳອະທິບາຍສັ້ນໆ" maxLength={500} showCount />
            </Form.Item>

            <Form.Item name="description" label="ຄຳອະທິບາຍ">
              <TextArea rows={6} placeholder="ຄຳອະທິບາຍລະອຽດ" />
            </Form.Item>
          </Card>

          <Card title="ລາຄາ" className="mb-6">
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="price"
                  label="ລາຄາປົກກະຕິ (₭)"
                  rules={[{ required: true, message: 'ກະລຸນາໃສ່ລາຄາ' }]}
                >
                  <InputNumber
                    className="w-full"
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) =>
                      Number(value!.replace(/,/g, '')) as unknown as 0
                    }
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="salePrice" label="ລາຄາຂາຍ (₭)">
                  <InputNumber
                    className="w-full"
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) =>
                      Number(value!.replace(/,/g, '')) as unknown as 0
                    }
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="costPrice" label="ລາຄາທຶນ (₭)">
                  <InputNumber
                    className="w-full"
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) =>
                      Number(value!.replace(/,/g, '')) as unknown as 0
                    }
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="ສິນຄ້າຄົງຄັງ" className="mb-6">
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item name="stockQuantity" label="ຈຳນວນສິນຄ້າ">
                  <InputNumber className="w-full" min={0} placeholder="0" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="minStockLevel" label="ຈຳນວນຕ່ຳສຸດ">
                  <InputNumber className="w-full" min={0} placeholder="5" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item name="sku" label="SKU">
                  <Input placeholder="ລະຫັດສິນຄ້າ (ອັດຕະໂນມັດ)" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="barcode" label="Barcode">
                  <Input placeholder="ລະຫັດບາໂຄ້ດ" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Column - Images & Status */}
        <Col xs={24} lg={8}>
          <Card title="ຮູບພາບຫຼັກ" className="mb-6">
            <div className="flex flex-col items-center">
              {thumbnail ? (
                <div className="relative mb-4">
                  <Image
                    src={thumbnail}
                    alt="Thumbnail"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setThumbnail(null)}
                    className="absolute right-2 top-2 bg-white shadow"
                  />
                </div>
              ) : null}
              <Upload
                beforeUpload={handleThumbnailUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<PlusOutlined />} loading={uploadLoading}>
                  {thumbnail ? 'ປ່ຽນຮູບ' : 'ອັບໂຫລດຮູບ'}
                </Button>
              </Upload>
            </div>
          </Card>

          <Card title="ຮູບພາບເພີ່ມເຕີມ" className="mb-6">
            <div className="mb-4 grid grid-cols-3 gap-2">
              {gallery.map((url, index) => (
                <div key={index} className="relative">
                  <Image
                    src={url}
                    alt={`Gallery ${index}`}
                    width={80}
                    height={80}
                    className="h-20 w-full rounded object-cover"
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeGalleryImage(index)}
                    className="absolute right-0 top-0 bg-white shadow"
                  />
                </div>
              ))}
            </div>
            <Upload
              beforeUpload={handleGalleryUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<PlusOutlined />} loading={uploadLoading} block>
                ເພີ່ມຮູບ
              </Button>
            </Upload>
          </Card>

          <Card title="ສະຖານະ" className="mb-6">
            <Form.Item
              name="isActive"
              label="ສະຖານະການໃຊ້ງານ"
              valuePropName="checked"
            >
              <Switch checkedChildren="ໃຊ້ງານ" unCheckedChildren="ປິດ" />
            </Form.Item>
            <Form.Item
              name="isFeatured"
              label="ສິນຄ້າແນະນຳ"
              valuePropName="checked"
            >
              <Switch checkedChildren="ແມ່ນ" unCheckedChildren="ບໍ່" />
            </Form.Item>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
              block
            >
              ກັບຄືນ
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
              block
            >
              {isEdit ? 'ບັນທຶກ' : 'ສ້າງສິນຄ້າ'}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
