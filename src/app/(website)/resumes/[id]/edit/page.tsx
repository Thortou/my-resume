import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getResumeByIdAction } from '@/actions/resume.actions';
import { ResumeBuilder } from '@/components/resume';

interface EditResumePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditResumePageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getResumeByIdAction(id);

  if (!result.success || !result.data) {
    return {
      title: 'Resume Not Found',
    };
  }

  return {
    title: `Edit ${result.data.title}`,
    description: `Edit your resume: ${result.data.title}`,
  };
}

export default async function EditResumePage({ params }: EditResumePageProps) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user) {
    redirect(`/login?callbackUrl=/resumes/${id}/edit`);
  }

  const result = await getResumeByIdAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <ResumeBuilder mode="edit" initialData={result.data} />;
}
