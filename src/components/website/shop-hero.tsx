import Link from 'next/link';
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  HeadphonesIcon,
} from 'lucide-react';
import { ROUTES } from '@/constants';

export function ShopHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <ShoppingBag className="mr-2 h-4 w-4" />
              ຍິນດີຕ້ອນຮັບສູ່ຮ້ານຄ້າອອນລາຍ
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              ຊ້ອບປິ້ງງ່າຍ
              <span className="block text-primary-200">ສະດວກສະບາຍ</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-primary-100 lg:pr-8">
              ຄົ້ນພົບສິນຄ້າຄຸນນະພາບສູງໃນລາຄາທີ່ດີທີ່ສຸດ. ບໍລິການຈັດສົ່ງໄວ, ປອດໄພ
              ແລະ ໄດ້ມາດຕະຖານ.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href={ROUTES.SHOP}
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
              >
                ເລີ່ມຊ້ອບປິ້ງ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href={`${ROUTES.SHOP}?featured=true`}
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
              >
                ສິນຄ້າແນະນຳ
              </Link>
            </div>
          </div>

          {/* Right Stats/Features */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">ຈັດສົ່ງໄວ</h3>
                <p className="mt-1 text-sm text-primary-200">
                  ສົ່ງໄວພາຍໃນ 1-3 ມື້
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">ປອດໄພ 100%</h3>
                <p className="mt-1 text-sm text-primary-200">
                  ການຊຳລະເງິນປອດໄພ
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <HeadphonesIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  ບໍລິການ 24/7
                </h3>
                <p className="mt-1 text-sm text-primary-200">
                  ພ້ອມຊ່ວຍເຫຼືອຕະຫຼອດ
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  ສິນຄ້າຄຸນນະພາບ
                </h3>
                <p className="mt-1 text-sm text-primary-200">
                  ຄັດສັນມາເປັນພິເສດ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Features */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:hidden">
          {[
            { icon: Truck, title: 'ຈັດສົ່ງໄວ' },
            { icon: Shield, title: 'ປອດໄພ' },
            { icon: HeadphonesIcon, title: '24/7' },
            { icon: ShoppingBag, title: 'ຄຸນນະພາບ' },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm"
            >
              <feature.icon className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">
                {feature.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
