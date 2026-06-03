'use client';

import Link from 'next/link';
import { Row, Col, Skeleton } from 'antd';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { ROUTES } from '@/constants';
import { ProductCard } from '@/components/shop/product-card';

interface Product {
  id: string;
  name: string;
  slug: string | null;
  thumbnail: string | null;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  minStockLevel: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images?: { url: string }[];
  _count?: {
    orderItems: number;
  };
}

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
              <TrendingUp className="mr-1.5 h-4 w-4" />
              ຂາຍດີ
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              ສິນຄ້າຂາຍດີ
            </h2>
            <p className="mt-2 text-gray-600">
              ສິນຄ້າທີ່ລູກຄ້າເລືອກຊື້ຫຼາຍທີ່ສຸດໃນຕອນນີ້
            </p>
          </div>
          <Link
            href={ROUTES.SHOP}
            className="hidden items-center font-medium text-primary-600 hover:text-primary-700 sm:inline-flex"
          >
            ເບິ່ງທັງໝົດ
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <Row gutter={[16, 16]}>
          {products.map((product, index) => (
            <Col key={product.id} xs={12} sm={8} md={6} lg={6}>
              <div className="relative">
                {/* Rank Badge */}
                {index < 3 && (
                  <div
                    className={`absolute -left-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg ${
                      index === 0
                        ? 'bg-yellow-500'
                        : index === 1
                          ? 'bg-gray-400'
                          : 'bg-amber-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                )}
                <ProductCard product={product} />
              </div>
            </Col>
          ))}
        </Row>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={ROUTES.SHOP}
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            ເບິ່ງສິນຄ້າຂາຍດີທັງໝົດ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Loading skeleton
export function BestSellersSkeleton() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton.Input active style={{ width: 80, height: 28 }} />
          <Skeleton.Input
            active
            style={{ width: 200, height: 32, marginTop: 8 }}
          />
          <Skeleton.Input
            active
            style={{ width: 300, height: 20, marginTop: 8 }}
          />
        </div>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map((i) => (
            <Col key={i} xs={12} sm={8} md={6} lg={6}>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <Skeleton.Image active style={{ width: '100%', height: 200 }} />
                <Skeleton active paragraph={{ rows: 2 }} className="mt-4" />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
