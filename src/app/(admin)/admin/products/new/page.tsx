import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui';
import { ProductForm } from '@/components/admin/product-form';

export const metadata: Metadata = {
  title: 'ເພີ່ມສິນຄ້າໃໝ່ | Admin',
};

export default function NewProductPage() {
  return (
    <div>
      <PageHeader title="ເພີ່ມສິນຄ້າໃໝ່" description="ສ້າງສິນຄ້າໃໝ່ໃນລະບົບ" />
      <ProductForm />
    </div>
  );
}
