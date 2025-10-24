'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AppHeader from '@/app/components/AppHeader';

export default function ClientLayoutFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith('/landing') ?? false;

  return (
    <>
      {!hideHeader && <AppHeader />}
      <div style={{ paddingTop: hideHeader ? 0 : 72 }}>{children}</div>
    </>
  );
}


