import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Row, Col, Card, Spin, Empty, Breadcrumb, Input, Select } from 'antd';
import { HomeOutlined, ShopOutlined } from '@ant-design/icons';
import { ROUTES } from '@/constants';
import { ProductCard } from '@/components/shop/product-card';
import {
  getShopProductsAction,
  getFeaturedProductsAction,
} from '@/actions/product.actions';
import { getActiveCategoriesAction } from '@/actions/category.actions';

export const metadata: Metadata = {
  title: 'ຮ້ານຄ້າ',
  description: 'ສິນຄ້າທັງໝົດຂອງພວກເຮົາ',
};

// Helper to serialize product data (convert Decimal to number)
function serializeProducts(products: any[]) {
  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  }));
}

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

async function ProductGrid({
  searchParams,
}: {
  searchParams: ShopPageProps['searchParams'];
}) {
  const params = await searchParams;
  const result = await getShopProductsAction({
    categoryId: params.category,
    search: params.search,
    page: params.page ? parseInt(params.page) : 1,
    limit: 12,
    sortBy: params.sort || 'createdAt',
    sortOrder: 'desc',
  });

  if (result.data.length === 0) {
    return <Empty description="ບໍ່ພົບສິນຄ້າ" className="py-12" />;
  }

  const serializedProducts = serializeProducts(result.data);

  return (
    <Row gutter={[16, 16]}>
      {serializedProducts.map((product: any) => (
        <Col key={product.id} xs={12} sm={8} md={6} lg={6}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
}

async function CategorySidebar({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const categories = await getActiveCategoriesAction();

  return (
    <Card title="ໝວດໝູ່" size="small">
      <div className="space-y-2">
        <Link
          href={ROUTES.SHOP}
          className={`block rounded px-3 py-2 transition ${
            !selectedCategory
              ? 'bg-primary-50 text-primary-600'
              : 'hover:bg-gray-50'
          }`}
        >
          ທັງໝົດ
        </Link>
        {(categories as any[]).map((cat) => (
          <Link
            key={cat.id}
            href={`${ROUTES.SHOP}?category=${cat.id}`}
            className={`block rounded px-3 py-2 transition ${
              selectedCategory === cat.id
                ? 'bg-primary-50 text-primary-600'
                : 'hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </Card>
  );
}

async function FeaturedSection() {
  const products = await getFeaturedProductsAction(4);

  if (!products || products.length === 0) return null;

  const serializedProducts = serializeProducts(products);

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-bold">ສິນຄ້າແນະນຳ</h2>
      <Row gutter={[16, 16]}>
        {serializedProducts.map((product) => (
          <Col key={product.id} xs={12} sm={8} md={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-6"
        items={[
          {
            href: ROUTES.HOME,
            title: (
              <>
                <HomeOutlined />
                <span>ໜ້າຫຼັກ</span>
              </>
            ),
          },
          {
            title: (
              <>
                <ShopOutlined />
                <span>ຮ້ານຄ້າ</span>
              </>
            ),
          },
        ]}
      />

      {/* Featured Products */}
      {!params.category && !params.search && (
        <Suspense
          fallback={
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold">ສິນຄ້າແນະນຳ</h2>
              <div className="flex justify-center py-12">
                <Spin />
              </div>
            </div>
          }
        >
          <FeaturedSection />
        </Suspense>
      )}

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Sidebar */}
        <Col xs={24} md={6}>
          <Suspense fallback={<Card loading className="h-48" />}>
            <CategorySidebar selectedCategory={params.category} />
          </Suspense>
        </Col>

        {/* Products */}
        <Col xs={24} md={18}>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {params.search ? `ຄົ້ນຫາ: "${params.search}"` : 'ສິນຄ້າທັງໝົດ'}
            </h1>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <Spin size="large" />
              </div>
            }
          >
            <ProductGrid searchParams={searchParams} />
          </Suspense>
        </Col>
      </Row>
    </div>
  );
}
