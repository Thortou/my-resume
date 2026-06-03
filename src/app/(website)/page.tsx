import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  ShopHero,
  BannerSlideshow,
  FeaturedProducts,
  FeaturedProductsSkeleton,
  CategoriesSection,
  CategoriesSectionSkeleton,
  BestSellers,
  BestSellersSkeleton,
  PromoSection,
} from '@/components/website';
import { bannerService } from '@/services';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';

export const metadata: Metadata = {
  title: 'ຮ້ານຄ້າອອນລາຍ | ຊ້ອບປິ້ງງ່າຍ ສະດວກສະບາຍ',
  description:
    'ຄົ້ນພົບສິນຄ້າຄຸນນະພາບສູງໃນລາຄາທີ່ດີທີ່ສຸດ. ບໍລິການຈັດສົ່ງໄວ, ປອດໄພ ແລະ ໄດ້ມາດຕະຖານ.',
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

// Featured Products Component
async function FeaturedProductsSection() {
  const products = await productService.getFeatured(8);
  return <FeaturedProducts products={serializeProducts(products)} />;
}

// Categories Component
async function CategoriesSectionWrapper() {
  const categories = await categoryService.getAllActive();
  return <CategoriesSection categories={categories as any[]} />;
}

// Best Sellers Component
async function BestSellersSection() {
  const products = await productService.getBestSelling(4);
  return <BestSellers products={serializeProducts(products)} />;
}

// Hero Section with Banner
async function HeroSection() {
  const bannersResult = await bannerService.getAllActive();
  const banners = bannersResult.data || [];

  if (banners.length > 0) {
    return <BannerSlideshow banners={banners} />;
  }

  return <ShopHero />;
}

export default async function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Suspense fallback={<ShopHero />}>
        <HeroSection />
      </Suspense>

      {/* Categories Section */}
      <Suspense fallback={<CategoriesSectionSkeleton />}>
        <CategoriesSectionWrapper />
      </Suspense>

      {/* Featured Products Section */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* Promo Section */}
      <PromoSection />

      {/* Best Sellers Section */}
      <Suspense fallback={<BestSellersSkeleton />}>
        <BestSellersSection />
      </Suspense>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              ເປັນຫຍັງຕ້ອງເລືອກພວກເຮົາ?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              ພວກເຮົາມຸ່ງໝັ້ນໃນການໃຫ້ບໍລິການທີ່ດີທີ່ສຸດແກ່ລູກຄ້າ
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'ສິນຄ້າຄຸນນະພາບ',
                description: 'ຄັດສັນສິນຄ້າຄຸນນະພາບສູງຈາກແຫຼ່ງທີ່ໜ້າເຊື່ອຖື',
                icon: '🏆',
              },
              {
                title: 'ລາຄາຍຸດຕິທຳ',
                description: 'ລາຄາທີ່ແຂ່ງຂັນໄດ້ ພ້ອມໂປຣໂມຊັ່ນພິເສດຕະຫຼອດ',
                icon: '💰',
              },
              {
                title: 'ຈັດສົ່ງໄວ',
                description: 'ບໍລິການຈັດສົ່ງໄວພາຍໃນ 1-3 ມື້ລັດຖະການ',
                icon: '🚚',
              },
              {
                title: 'ຮັບປະກັນ',
                description: 'ຮັບປະກັນຄືນເງິນພາຍໃນ 7 ມື້ຖ້າບໍ່ພໍໃຈ',
                icon: '✅',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              ຮັບຂ່າວສານ ແລະ ໂປຣໂມຊັ່ນ
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-100">
              ລົງທະບຽນເພື່ອຮັບຂ່າວສານໃໝ່ ແລະ ໂປຣໂມຊັ່ນພິເສດກ່ອນໃຜ
            </p>
            <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <input
                type="email"
                placeholder="ໃສ່ອີເມວຂອງທ່ານ"
                className="rounded-lg border-0 px-5 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-300 sm:w-80"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-900"
              >
                ລົງທະບຽນ
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
