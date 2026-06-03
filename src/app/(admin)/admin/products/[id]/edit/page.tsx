import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui';
import { ProductForm } from '@/components/admin/product-form';
import { getProductByIdAction } from '@/actions/product.actions';

export const metadata: Metadata = {
  title: 'ແກ້ໄຂສິນຄ້າ | Admin',
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Helper to serialize product data (convert Decimal to number)
function serializeProduct(product: any) {
  return {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductByIdAction(id);

  if (!product) {
    notFound();
  }

  const serializedProduct = serializeProduct(product);

  return (
    <div>
      <PageHeader
        title="ແກ້ໄຂສິນຄ້າ"
        description={`ແກ້ໄຂຂໍ້ມູນ: ${product.name}`}
      />
      <ProductForm initialData={serializedProduct} isEdit />
    </div>
  );
}
