'use client';

import '@/lib/suppress-warnings';
import '@ant-design/v5-patch-for-react-19';
import { SessionProvider } from 'next-auth/react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App as AntdApp } from 'antd';
import { TooltipProvider } from '@/components/ui/tooltip';
import { antdTheme } from '@/configs/antd.config';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AntdRegistry>
        <ConfigProvider theme={antdTheme}>
          <AntdApp>
            <TooltipProvider>{children}</TooltipProvider>
          </AntdApp>
        </ConfigProvider>
      </AntdRegistry>
    </SessionProvider>
  );
}
