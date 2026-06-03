import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="text-center">
          {/* ປ້າຍ */}
          <div className="mb-6 inline-flex items-center rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
            ແມ່ແບບເລີ່ມຕົ້ນທີ່ພ້ອມສຳລັບການຜະລິດ
          </div>

          {/* ຫົວຂໍ້ */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            ສ້າງແອັບທັນສະໄໝ
            <span className="block text-primary-600">ໄວກວ່າເກົ່າ</span>
          </h1>

          {/* ລາຍລະອຽດ */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            ແມ່ແບບເລີ່ມຕົ້ນ full-stack ທີ່ຂະຫຍາຍໄດ້ ພ້ອມ Next.js, TypeScript,
            Prisma ແລະ ອື່ນໆ.
            ທຸກຢ່າງທີ່ທ່ານຕ້ອງການເພື່ອສ້າງແອັບພລິເຄຊັນລະດັບອົງກອນ
            ດ້ວຍສະຖາປັດຕະຍະກຳທີ່ສະອາດ.
          </p>

          {/* ປຸ່ມ CTA */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={ROUTES.SHOP}
              className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-700"
            >
              ເລີ່ມຕົ້ນ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={ROUTES.ABOUT}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              ຮຽນຮູ້ເພີ່ມເຕີມ
            </Link>
          </div>

          {/* ລາຍການຄຸນສົມບັດ */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Next.js 15', description: 'App Router ລ່າສຸດ' },
              { title: 'TypeScript', description: 'ຄວາມປອດໄພປະເພດເຕັມຮູບແບບ' },
              { title: 'Prisma', description: 'ORM ແບບ type-safe' },
              { title: 'Auth.js', description: 'ການພິສູດຕົວຕົນທີ່ປອດໄພ' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-white p-6 text-left shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
