import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat - AI Assistant',
  description: 'Chat with our AI assistant',
};

export default function ChatRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
