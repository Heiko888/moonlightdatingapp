"use client";
import React from 'react';
import ClientErrorBoundary from '@/app/components/ClientErrorBoundary'
import { NotificationProvider } from '@/components/NotificationService'
import { ThemeProvider as ToggleThemeProvider } from '@/components/ThemeProvider'

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ClientErrorBoundary>
      <ToggleThemeProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ToggleThemeProvider>
    </ClientErrorBoundary>
  );
}
