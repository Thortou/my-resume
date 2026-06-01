import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ກ່ຽວກັບ',
  description: 'ຮຽນຮູ້ເພີ່ມເຕີມກ່ຽວກັບບໍລິສັດ ແລະ ພາລະກິດຂອງພວກເຮົາ.',
};

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ສ່ວນຫົວ */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">ກ່ຽວກັບພວກເຮົາ</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            ສ້າງແອັບພລິເຄຊັນເວັບທັນສະໄໝດ້ວຍເທັກໂນໂລຢີລ້ຳສະໄໝ.
          </p>
        </div>

        {/* ເນື້ອຫາ */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ພາລະກິດຂອງພວກເຮົາ</h2>
            <p className="mt-4 text-gray-600">
              ພວກເຮົາເຊື່ອໃນການສ້າງແອັບພລິເຄຊັນທີ່ຂະຫຍາຍໄດ້, ບຳລຸງຮັກສາໄດ້ ແລະ ເປັນມິດກັບຜູ້ໃຊ້.
              ແມ່ແບບເລີ່ມຕົ້ນຂອງພວກເຮົາໃຫ້ທຸກຢ່າງທີ່ທ່ານຕ້ອງການເພື່ອເລີ່ມຕົ້ນໂຄງການຕໍ່ໄປຂອງທ່ານຢ່າງໝັ້ນໃຈ.
            </p>
            <p className="mt-4 text-gray-600">
              ດ້ວຍການເນັ້ນໃສ່ປະສົບການນັກພັດທະນາ ແລະ ວິທີປະຕິບັດທີ່ດີທີ່ສຸດ, ພວກເຮົາມຸ່ງໝັ້ນຊ່ວຍທີມງານ
              ສ້າງຊອບແວທີ່ດີກວ່າໄວຂຶ້ນ.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">ເທັກໂນໂລຢີຂອງພວກເຮົາ</h2>
            <ul className="mt-4 space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Next.js 15 ກັບ App Router
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                TypeScript ສຳລັບຄວາມປອດໄພຂອງປະເພດ
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Prisma ກັບ PostgreSQL
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Auth.js ສຳລັບການພິສູດຕົວຕົນ
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Tailwind CSS & Ant Design
              </li>
            </ul>
          </div>
        </div>

        {/* ພາກສ່ວນທີມງານ */}
        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            ທີມງານຂອງພວກເຮົາ
          </h2>
          <p className="mt-4 text-center text-gray-600">
            ທີມນັກພັດທະນາທີ່ອຸທິດຕົນທີ່ມີຄວາມກະຕືລືລົ້ນໃນການສ້າງຊອບແວທີ່ດີ.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border bg-white p-6 text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-gray-200" />
                <h3 className="mt-4 font-semibold text-gray-900">
                  ສະມາຊິກທີມ {i}
                </h3>
                <p className="text-sm text-gray-500">ລາຍລະອຽດບົດບາດ</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
