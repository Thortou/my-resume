import Link from 'next/link';
import { Percent, Clock, Gift } from 'lucide-react';
import { ROUTES } from '@/constants';

export function PromoSection() {
  return (
    <section className="bg-gradient-to-r from-orange-500 to-red-500 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Promo Card 1 */}
          <div className="flex items-center gap-4 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              <Percent className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ສ່ວນຫຼຸດພິເສດ</h3>
              <p className="text-sm text-orange-100">
                ສູງສຸດເຖິງ 50% ສຳລັບສິນຄ້າທີ່ເລືອກ
              </p>
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="flex items-center gap-4 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              <Clock className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ຈັດສົ່ງດ່ວນ</h3>
              <p className="text-sm text-orange-100">
                ສົ່ງຟຣີເມື່ອສັ່ງຊື້ 500,000₭ ຂຶ້ນໄປ
              </p>
            </div>
          </div>

          {/* Promo Card 3 */}
          <div className="flex items-center gap-4 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              <Gift className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ຂອງແຖມພິເສດ</h3>
              <p className="text-sm text-orange-100">
                ຮັບຂອງແຖມເມື່ອສັ່ງຊື້ 1,000,000₭ ຂຶ້ນໄປ
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href={ROUTES.SHOP}
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-orange-600 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
          >
            ຊ້ອບປິ້ງດຽວນີ້
          </Link>
        </div>
      </div>
    </section>
  );
}
