"use client";
import React from 'react';
import ClientErrorBoundary from '@/app/components/ClientErrorBoundary'

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ClientErrorBoundary>
      {children}
    </ClientErrorBoundary>
  );
}
