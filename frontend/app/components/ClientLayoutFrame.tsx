'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AppHeader from '@/app/components/AppHeader';
import AppFooter from '@/app/components/AppFooter';

export default function ClientLayoutFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = (pathname === '/' || pathname?.startsWith('/landing') || pathname?.startsWith('/community-info') || pathname?.startsWith('/community/onboarding') || pathname === '/register' || pathname === '/login' || pathname?.startsWith('/connection-key') || pathname === '/impressum' || pathname === '/datenschutz') ?? false;
  const hideFooter = (pathname === '/impressum' || pathname === '/datenschutz') ?? false;

  return (
    <>
      {!hideHeader && <AppHeader />}
      <div style={{ paddingTop: hideHeader ? 0 : 72, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>{children}</div>
        {!hideFooter && <AppFooter />}
      </div>
    </>
  );
}


