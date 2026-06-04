import Link from 'next/link';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookFilled,
  InstagramFilled,
  TwitterOutlined,
  SendOutlined,
  HeartFilled,
  ShoppingOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { APP_NAME, ROUTES } from '@/constants';

const footerLinks = {
  shop: [
    { href: ROUTES.SHOP, label: 'ຮ້ານຄ້າ', icon: <ShoppingOutlined /> },
    { href: ROUTES.CART, label: 'ກະຕ່າສິນຄ້າ', icon: <ShoppingCartOutlined /> },
    { href: ROUTES.WISHLIST, label: 'ລາຍການທີ່ມັກ', icon: <HeartFilled /> },
    { href: ROUTES.ORDERS, label: 'ຄຳສັ່ງຊື້', icon: <OrderedListOutlined /> },
  ],
  company: [
    { href: ROUTES.HOME, label: 'ໜ້າຫຼັກ', icon: <HomeOutlined /> },
    { href: ROUTES.ABOUT, label: 'ກ່ຽວກັບ', icon: <InfoCircleOutlined /> },
    { href: ROUTES.CONTACT, label: 'ຕິດຕໍ່', icon: <MailOutlined /> },
  ],
  legal: [
    { href: '#', label: 'ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ', icon: <FileTextOutlined /> },
    { href: '#', label: 'ເງື່ອນໄຂການບໍລິການ', icon: <FileTextOutlined /> },
  ],
};

const socialLinks = [
  {
    href: 'https://facebook.com',
    icon: <FacebookFilled />,
    label: 'Facebook',
    color: 'hover:text-blue-600',
  },
  {
    href: 'https://instagram.com',
    icon: <InstagramFilled />,
    label: 'Instagram',
    color: 'hover:text-pink-600',
  },
  {
    href: 'https://twitter.com',
    icon: <TwitterOutlined />,
    label: 'Twitter',
    color: 'hover:text-sky-500',
  },
];

const contactInfo = [
  {
    icon: <PhoneOutlined />,
    text: '+856 20 1234 5678',
    href: 'tel:+85620123456789',
  },
  {
    icon: <MailOutlined />,
    text: 'info@example.com',
    href: 'mailto:info@example.com',
  },
  {
    icon: <EnvironmentOutlined />,
    text: 'ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    href: null,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Mobile Layout */}
        <div className="space-y-8 md:hidden">
          {/* Brand & Social */}
          <div className="text-center">
            <Link
              href={ROUTES.HOME}
              className="inline-block text-2xl font-bold text-primary-600"
            >
              {APP_NAME}
            </Link>
            <p className="mx-auto mt-3 max-w-xs text-sm text-gray-600">
              ແມ່ແບບເລີ່ມຕົ້ນ full-stack ທີ່ພ້ອມສຳລັບການຜະລິດ
            </p>
            {/* Social Icons */}
            <div className="mt-4 flex justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition-all ${social.color} hover:shadow-md`}
                  aria-label={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info - Mobile */}
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-center text-sm font-semibold text-gray-900">
              ຕິດຕໍ່ພວກເຮົາ
            </h3>
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-2 text-sm text-gray-600"
                >
                  <span className="text-primary-500">{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} className="hover:text-primary-600">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links - Mobile Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Shop Links */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                ຮ້ານຄ້າ
              </h3>
              <ul className="space-y-2">
                {footerLinks.shop.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
                    >
                      <span className="text-xs text-gray-400">{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                ບໍລິສັດ
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
                    >
                      <span className="text-xs text-gray-400">{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter - Mobile */}
          <div className="rounded-xl bg-primary-50 p-4">
            <h3 className="mb-2 text-center text-sm font-semibold text-gray-900">
              ຮັບຂ່າວສານລ່າສຸດ
            </h3>
            <p className="mb-3 text-center text-xs text-gray-600">
              ສະໝັກຮັບຂ່າວສານ ແລະ ໂປຣໂມຊັ່ນພິເສດ
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ອີເມວຂອງທ່ານ"
                className="flex-1 rounded-lg border-0 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                className="flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-primary-700"
              >
                <SendOutlined />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              href={ROUTES.HOME}
              className="inline-block text-2xl font-bold text-primary-600"
            >
              {APP_NAME}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
              ແມ່ແບບເລີ່ມຕົ້ນ full-stack ທີ່ພ້ອມສຳລັບການຜະລິດ
              ສຳລັບແອັບພລິເຄຊັນເວັບທັນສະໄໝ.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="transition-colors hover:text-primary-600"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition-all ${social.color} hover:-translate-y-0.5 hover:shadow-md`}
                  aria-label={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              ຮ້ານຄ້າ
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
                  >
                    <span className="text-gray-400 transition-colors group-hover:text-primary-500">
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              ບໍລິສັດ
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
                  >
                    <span className="text-gray-400 transition-colors group-hover:text-primary-500">
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Legal Links */}
              <li className="!mt-6 border-t pt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  ທາງກົດໝາຍ
                </span>
              </li>
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
                  >
                    <span className="text-gray-400 transition-colors group-hover:text-primary-500">
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              ຂ່າວສານ
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              ສະໝັກຮັບຂ່າວສານ ແລະ ໂປຣໂມຊັ່ນພິເສດຈາກພວກເຮົາ
            </p>
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="ອີເມວຂອງທ່ານ"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
                >
                  <SendOutlined />
                  ສະໝັກຮັບຂ່າວ
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                ປອດໄພ 100%
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                ຈັດສົ່ງທົ່ວປະເທດ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-center text-xs text-gray-500 sm:text-left sm:text-sm">
              &copy; {currentYear} {APP_NAME}. ສະຫງວນລິຂະສິດທັງໝົດ.
            </p>
            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">ຊຳລະຜ່ານ:</span>
              <div className="flex gap-2">
                <div className="flex h-6 w-10 items-center justify-center rounded bg-white shadow-sm">
                  <span className="text-[10px] font-bold text-blue-600">
                    VISA
                  </span>
                </div>
                <div className="flex h-6 w-10 items-center justify-center rounded bg-white shadow-sm">
                  <span className="text-[10px] font-bold text-red-500">MC</span>
                </div>
                <div className="flex h-6 w-10 items-center justify-center rounded bg-white shadow-sm">
                  <span className="text-[10px] font-bold text-green-600">
                    BCEL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
