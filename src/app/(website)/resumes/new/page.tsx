import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ResumeBuilder } from '@/components/resume';

export const metadata: Metadata = {
  title: 'Create Resume',
  description: 'Create a new professional resume',
};

export default async function NewResumePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?callbackUrl=/resumes/new');
  }

  return <ResumeBuilder mode="create" />;
}
