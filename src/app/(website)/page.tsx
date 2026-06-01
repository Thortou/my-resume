import type { Metadata } from 'next';
import { HeroSection, BannerSlideshow, VisitStats } from '@/components/website';
import { bannerService } from '@/services';
export const metadata: Metadata = {
  title: 'ໜ້າຫຼັກ | ເລີ່ມຕົ້ນ Full Stack',
  description:
    'ແມ່ແບບເລີ່ມຕົ້ນ full-stack ທີ່ພ້ອມສໍາລັບການຜະລິດ ດ້ວຍ Next.js, TypeScript, Prisma ແລະ ອື່ນໆ.',
};

export default async function HomePage() {
  // ດຶງຂໍ້ມູນປ້າຍໂຄສະນາທີ່ໃຊ້ງານຢູ່ສຳລັບສະໄລ້ໂຊ
  const bannersResult = await bannerService.getAllActive();
  const banners = bannersResult.data || [];

  return (
    <>
      {/* ສະໄລ້ໂຊປ້າຍໂຄສະນາ - ສະແດງຖ້າມີປ້າຍໂຄສະນາ */}
      {banners.length > 0 ? (
        <BannerSlideshow banners={banners} />
      ) : (
        <HeroSection />
      )}

      {/* ພາກສ່ວນຄຸນສົມບັດ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              ທຸກຢ່າງທີ່ທ່ານຕ້ອງການ
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              ສ້າງດ້ວຍເທັກໂນໂລຢີທັນສະໄໝ ແລະ ວິທີປະຕິບັດທີ່ດີທີ່ສຸດສຳລັບ
              ແອັບພລິເຄຊັນທີ່ຂະຫຍາຍໄດ້.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'ກຽມພ້ອມການພິສູດຕົວຕົນ',
                description:
                  'ການພິສູດຕົວຕົນທີ່ປອດໄພດ້ວຍ Auth.js v5, ຮອງຮັບ credentials, OAuth ແລະ ອື່ນໆ.',
              },
              {
                title: 'ການເຊື່ອມຕໍ່ຖານຂໍ້ມູນ',
                description:
                  'ການເຂົ້າເຖິງຖານຂໍ້ມູນແບບ type-safe ດ້ວຍ Prisma ORM ແລະ Supabase PostgreSQL.',
              },
              {
                title: 'ອັບໂຫລດໄຟລ໌',
                description:
                  'ການເຊື່ອມຕໍ່ Cloudinary ສຳລັບການຈັດການຮູບພາບ ແລະ ໄຟລ໌ຢ່າງງ່າຍດາຍ.',
              },
              {
                title: 'ແຜງຄວບຄຸມຜູ້ບໍລິຫານ',
                description:
                  'ອິນເຕີເຟສຜູ້ບໍລິຫານທີ່ສວຍງາມທີ່ສ້າງດ້ວຍອົງປະກອບ Ant Design.',
              },
              {
                title: 'ການເຂົ້າເຖິງຕາມບົດບາດ',
                description:
                  'ລະບົບສິດອະນຸຍາດລະອຽດດ້ວຍການຄວບຄຸມການເຂົ້າເຖິງຕາມບົດບາດ.',
              },
              {
                title: 'ການກວດສອບແບບຟອມ',
                description:
                  'ການຈັດການແບບຟອມທີ່ແຂງແກ່ນດ້ວຍ React Hook Form ແລະ ການກວດສອບ Zod.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ພາກສ່ວນສະຖິຕິຜູ້ເຂົ້າຊົມ */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">ສະຖິຕິຜູ້ເຂົ້າຊົມ</h2>
          <VisitStats />
        </div>
      </section>

      {/* ພາກສ່ວນ CTA */}
      <section className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            ພ້ອມທີ່ຈະເລີ່ມຕົ້ນບໍ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            ເລີ່ມສ້າງໂຄງການຕໍ່ໄປຂອງທ່ານດ້ວຍແມ່ແບບເລີ່ມຕົ້ນທີ່ພ້ອມສຳລັບການຜະລິດນີ້.
          </p>
          <div className="mt-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-medium text-primary-600 transition-colors hover:bg-gray-100"
            >
              ເບິ່ງໃນ GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
