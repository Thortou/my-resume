import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/forms';
import { APP_NAME, ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'ເຂົ້າສູ່ລະບົບ',
  description: 'ເຂົ້າສູ່ລະບົບບັນຊີຂອງທ່ານ',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* ໂລໂກ້ */}
        <div className="mb-8 text-center">
          <Link href={ROUTES.HOME} className="text-2xl font-bold text-gray-900">
            {APP_NAME}
          </Link>
        </div>

        {/* ແບບຟອມເຂົ້າສູ່ລະບົບ */}
        <LoginForm />

        {/* ກັບໄປໜ້າຫຼັກ */}
        <div className="mt-6 text-center">
          <Link
            href={ROUTES.HOME}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            &larr; ກັບໄປໜ້າຫຼັກ
          </Link>
        </div>
      </div>
    </div>
  );
}
