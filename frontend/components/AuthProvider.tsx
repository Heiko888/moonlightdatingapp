"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/api/auth';
import { GlobalLoadingProvider } from '@/lib/api/loading';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      <GlobalLoadingProvider>
        {children}
      </GlobalLoadingProvider>
    </AuthContext.Provider>
  );
}
