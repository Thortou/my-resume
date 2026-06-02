import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicResumeAction } from '@/actions/resume.actions';
import { PublicResumeView } from './PublicResumeView';

interface PublicResumePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PublicResumePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicResumeAction(slug);

  if (!result.success || !result.data) {
    return {
      title: 'Resume Not Found',
    };
  }

  const { fullName, jobTitle } = result.data;
  const title = jobTitle ? `${fullName} - ${jobTitle}` : fullName;

  return {
    title: `${title} | Resume`,
    description: `Professional resume of ${fullName}${jobTitle ? ` - ${jobTitle}` : ''}`,
    openGraph: {
      title: `${title} | Resume`,
      description: `Professional resume of ${fullName}${jobTitle ? ` - ${jobTitle}` : ''}`,
      type: 'profile',
    },
  };
}

export default async function PublicResumePage({
  params,
}: PublicResumePageProps) {
  const { slug } = await params;
  const result = await getPublicResumeAction(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  return <PublicResumeView resumeData={result.data} />;
}
