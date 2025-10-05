"use client";
import React from 'react';
import ClientErrorBoundary from '@/app/components/ClientErrorBoundary'
import { NotificationProvider } from '@/components/NotificationService'

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ClientErrorBoundary>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </ClientErrorBoundary>
  );
}
