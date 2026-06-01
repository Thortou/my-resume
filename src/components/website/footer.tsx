import Link from 'next/link';
import { APP_NAME, ROUTES } from '@/constants';

const footerLinks = {
  product: [
    { href: ROUTES.PRODUCTS, label: 'ຜະລິດຕະພັນ' },
    { href: '#', label: 'ລາຄາ' },
    { href: '#', label: 'ຄຸນສົມບັດ' },
  ],
  company: [
    { href: ROUTES.ABOUT, label: 'ກ່ຽວກັບ' },
    { href: ROUTES.CONTACT, label: 'ຕິດຕໍ່' },
    { href: '#', label: 'ອາຊີບ' },
  ],
  legal: [
    { href: '#', label: 'ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ' },
    { href: '#', label: 'ເງື່ອນໄຂການບໍລິການ' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* ແບຣນ */}
          <div>
            <Link href={ROUTES.HOME} className="text-xl font-bold text-gray-900">
              {APP_NAME}
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              ແມ່ແບບເລີ່ມຕົ້ນ full-stack ທີ່ພ້ອມສຳລັບການຜະລິດ
              ສຳລັບແອັບພລິເຄຊັນເວັບທັນສະໄໝ.
            </p>
          </div>

          {/* ລິ້ງຜະລິດຕະພັນ */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-900">
              ຜະລິດຕະພັນ
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ລິ້ງບໍລິສັດ */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-900">
              ບໍລິສັດ
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ລິ້ງທາງກົດໝາຍ */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-900">
              ທາງກົດໝາຍ
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ລຸ່ມ */}
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-gray-600">
            &copy; {currentYear} {APP_NAME}. ສະຫງວນລິຂະສິດທັງໝົດ.
          </p>
        </div>
      </div>
    </footer>
  );
}
