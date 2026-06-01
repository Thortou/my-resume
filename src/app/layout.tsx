import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Providers } from '@/providers';
import { cn } from "@/lib/utils";
import '../styles/globals.css'
const boonBaan = localFont({
  src: [
    {
      path: '../assets/font/ttf/BoonBaan-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/font/ttf/BoonBaan-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/font/ttf/BoonBaan-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/font/ttf/BoonBaan-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-lao',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ເລີ່ມຕົ້ນ Full Stack',
    template: '%s | ເລີ່ມຕົ້ນ Full Stack',
  },
  description:
    'ແມ່ແບບເລີ່ມຕົ້ນ full-stack ທີ່ພ້ອມສໍາລັບການຜະລິດ ດ້ວຍ Next.js, TypeScript, Prisma ແລະ ອື່ນໆ.',
  keywords: ['Next.js', 'React', 'TypeScript', 'Prisma', 'Tailwind CSS'],
  authors: [{ name: 'ຊື່ຂອງທ່ານ' }],
  creator: 'ຊື່ຂອງທ່ານ',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lo" className={boonBaan.variable}>
      <body className={cn("min-h-screen bg-white antialiased", boonBaan.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
