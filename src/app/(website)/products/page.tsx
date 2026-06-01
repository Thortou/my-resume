import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ຜະລິດຕະພັນ',
  description: 'ສຳຫຼວດຜະລິດຕະພັນ ແລະ ບໍລິການຂອງພວກເຮົາ.',
};

const products = [
  {
    id: 1,
    name: 'ແມ່ແບບເລີ່ມຕົ້ນ',
    description: 'ເໝາະສົມສຳລັບໂຄງການຂະໜາດນ້ອຍ ແລະ MVP.',
    price: 'ຟຣີ',
    features: ['ຄຸນສົມບັດພື້ນຖານ', 'ການຊ່ວຍເຫຼືອຈາກຊຸມຊົນ', 'ໃບອະນຸຍາດ MIT'],
  },
  {
    id: 2,
    name: 'ແມ່ແບບ Pro',
    description: 'ສຳລັບທີມງານ ແລະ ທຸລະກິດທີ່ກຳລັງເຕີບໂຕ.',
    price: '$99',
    features: [
      'ທຸກຄຸນສົມບັດເລີ່ມຕົ້ນ',
      'ອົງປະກອບພຣີມຽມ',
      'ການຊ່ວຍເຫຼືອບູລິມະສິດ',
      'ໃບອະນຸຍາດການຄ້າ',
    ],
    popular: true,
  },
  {
    id: 3,
    name: 'ອົງກອນ',
    description: 'ວິທີແກ້ໄຂແບບກຳນົດເອງສຳລັບອົງກອນຂະໜາດໃຫຍ່.',
    price: 'ຕິດຕໍ່ພວກເຮົາ',
    features: [
      'ທຸກຄຸນສົມບັດ Pro',
      'ການພັດທະນາແບບກຳນົດເອງ',
      'ການຊ່ວຍເຫຼືອສະເພາະ',
      'ການຮັບປະກັນ SLA',
    ],
  },
];

export default function ProductsPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ສ່ວນຫົວ */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">ຜະລິດຕະພັນ</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            ເລືອກແຜນທີ່ສົມບູນແບບສຳລັບຄວາມຕ້ອງການຂອງທ່ານ.
          </p>
        </div>

        {/* ຕາຕະລາງຜະລິດຕະພັນ */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`relative rounded-xl border bg-white p-8 shadow-sm ${
                product.popular ? 'border-primary-500 ring-2 ring-primary-500' : ''
              }`}
            >
              {product.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-4 py-1 text-sm font-medium text-white">
                  ນິຍົມທີ່ສຸດ
                </div>
              )}

              <h3 className="text-xl font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="mt-2 text-gray-600">{product.description}</p>

              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  {product.price}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full rounded-lg px-6 py-3 text-base font-medium transition-colors ${
                  product.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                ເລີ່ມຕົ້ນ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
