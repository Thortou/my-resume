'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Row, Col, Skeleton, Empty } from 'antd';
import { ArrowRight } from 'lucide-react';
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
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              ສິນຄ້າແນະນຳ
            </h2>
            <p className="mt-2 text-gray-600">
              ສິນຄ້າຍອດນິຍົມທີ່ຄັດສັນມາເປັນພິເສດສຳລັບທ່ານ
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
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={8} md={6} lg={6}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={ROUTES.SHOP}
            className="inline-flex items-center justify-center rounded-lg border border-primary-600 bg-white px-6 py-3 text-sm font-medium text-primary-600 transition hover:bg-primary-50"
          >
            ເບິ່ງສິນຄ້າທັງໝົດ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Loading skeleton
export function FeaturedProductsSkeleton() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton.Input active style={{ width: 200, height: 32 }} />
          <Skeleton.Input
            active
            style={{ width: 300, height: 20, marginTop: 8 }}
          />
        </div>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map((i) => (
            <Col key={i} xs={12} sm={8} md={6} lg={6}>
              <div className="rounded-lg bg-white p-4 shadow-sm">
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
