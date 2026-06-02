import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getResumesAction } from '@/actions/resume.actions';
import { ResumeList } from '@/components/resume';

export const metadata: Metadata = {
  title: 'My Resumes',
  description: 'Manage your resumes and CVs',
};

export default async function ResumesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?callbackUrl=/resumes');
  }

  const result = await getResumesAction();
  const resumes = result.success ? result.data || [] : [];

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="mt-2 text-gray-600">
              Create and manage your professional resumes
            </p>
          </div>
          <Link href="/resumes/new">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Create New Resume
            </Button>
          </Link>
        </div>

        {/* Resume List */}
        <ResumeList resumes={resumes} />
      </div>
    </div>
  );
}
