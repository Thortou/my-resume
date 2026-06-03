import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Grid3X3 } from 'lucide-react';
import { ROUTES } from '@/constants';

interface Category {
  id: string;
  name: string;
  slug: string | null;
  image: string | null;
  description: string | null;
  _count?: {
    products: number;
  };
}

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600">
            <Grid3X3 className="mr-2 h-4 w-4" />
            ໝວດໝູ່ສິນຄ້າ
          </div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            ຊອກຫາຕາມໝວດໝູ່
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            ເລືອກໝວດໝູ່ສິນຄ້າທີ່ທ່ານສົນໃຈ ເພື່ອຄົ້ນຫາສິນຄ້າໄດ້ງ່າຍຂຶ້ນ
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`${ROUTES.SHOP}?category=${category.id}`}
              className="group relative flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-lg"
            >
              {/* Category Image */}
              <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full bg-gray-100 transition-transform group-hover:scale-105">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <Grid3X3 className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Category Name */}
              <h3 className="text-center text-sm font-medium text-gray-900 group-hover:text-primary-600">
                {category.name}
              </h3>

              {/* Product Count */}
              {category._count && (
                <p className="mt-1 text-xs text-gray-500">
                  {category._count.products} ສິນຄ້າ
                </p>
              )}
            </Link>
          ))}
        </div>

        {/* View All Categories */}
        {categories.length > 6 && (
          <div className="mt-8 text-center">
            <Link
              href={ROUTES.SHOP}
              className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700"
            >
              ເບິ່ງໝວດໝູ່ທັງໝົດ ({categories.length})
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Loading skeleton
export function CategoriesSectionSkeleton() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-8 w-32 animate-pulse rounded-full bg-gray-200" />
          <div className="mx-auto h-8 w-64 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto mt-3 h-5 w-96 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-xl border p-4"
            >
              <div className="mb-3 h-20 w-20 animate-pulse rounded-full bg-gray-200" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              <div className="mt-1 h-3 w-12 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
