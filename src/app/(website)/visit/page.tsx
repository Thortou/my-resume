import type { Metadata } from 'next';
import { VisitStats } from '@/components/website';

export const metadata: Metadata = {
  title: 'ສະຖິຕິຜູ້ເຂົ້າຊົມ',
};

export default function VisitPage() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">ສະຖິຕິຜູ້ເຂົ້າຊົມ</h1>
        <VisitStats />
      </div>
    </div>
  );
}
