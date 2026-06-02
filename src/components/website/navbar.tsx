'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, MessageSquare, LogOut, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME, ROUTES } from '@/constants';

const navLinks = [
  { href: ROUTES.HOME, label: 'ໜ້າຫຼັກ' },
  { href: ROUTES.ABOUT, label: 'ກ່ຽວກັບ' },
  { href: ROUTES.PRODUCTS, label: 'ຜະລິດຕະພັນ' },
  { href: ROUTES.CONTACT, label: 'ຕິດຕໍ່' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const handleSignOut = () => {
    signOut({ callbackUrl: ROUTES.HOME });
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="text-xl font-bold text-gray-900">
          {APP_NAME}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-600',
                pathname === link.href ? 'text-primary-600' : 'text-gray-600'
              )}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href={ROUTES.RESUMES}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary-600',
                  pathname?.startsWith(ROUTES.RESUMES)
                    ? 'text-primary-600'
                    : 'text-gray-600'
                )}
              >
                <FileText size={16} />
                Resumes
              </Link>
              <Link
                href={ROUTES.CHAT}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary-600',
                  pathname?.startsWith(ROUTES.CHAT)
                    ? 'text-primary-600'
                    : 'text-gray-600'
                )}
              >
                <MessageSquare size={16} />
                ສົນທະນາ
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {session?.user?.name || session?.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <LogOut size={16} />
                  ອອກຈາກລະບົບ
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
              >
                ເຂົ້າສູ່ລະບົບ
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                ລົງທະບຽນ
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600',
                  pathname === link.href ? 'text-primary-600' : 'text-gray-600'
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href={ROUTES.RESUMES}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary-600',
                    pathname?.startsWith(ROUTES.RESUMES)
                      ? 'text-primary-600'
                      : 'text-gray-600'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <FileText size={16} />
                  Resumes
                </Link>
                <Link
                  href={ROUTES.CHAT}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary-600',
                    pathname?.startsWith(ROUTES.CHAT)
                      ? 'text-primary-600'
                      : 'text-gray-600'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <MessageSquare size={16} />
                  ສົນທະນາ
                </Link>
                <div className="border-t pt-4">
                  <p className="mb-2 text-sm text-gray-600">
                    {session?.user?.name || session?.user?.email}
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    <LogOut size={16} />
                    ອອກຈາກລະບົບ
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href={ROUTES.LOGIN}
                  className="rounded-lg border border-primary-600 px-4 py-2 text-center text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
                  onClick={() => setIsOpen(false)}
                >
                  ເຂົ້າສູ່ລະບົບ
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  onClick={() => setIsOpen(false)}
                >
                  ລົງທະບຽນ
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
