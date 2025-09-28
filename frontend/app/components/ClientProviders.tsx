"use client";
import React from 'react';
import ConditionalLayout from '@/components/ConditionalLayout'
import { NotificationProvider } from '@/components/NotificationService'
import { ThemeProvider } from '@/components/ThemeProvider'
import ClientErrorBoundary from '@/app/components/ClientErrorBoundary'

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ClientErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </NotificationProvider>
      </ThemeProvider>
    </ClientErrorBoundary>
  );
}
