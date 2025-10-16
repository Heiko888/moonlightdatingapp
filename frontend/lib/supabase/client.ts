// Alias für backwards compatibility
// Importiert den eigentlichen Client aus utils/supabase/client.ts

import { createClient as createSupabaseClient } from '@/utils/supabase/client';

export { createClient } from '@/utils/supabase/client';

// Singleton Client-Instanz für direkten Import
export const supabase = createSupabaseClient();

// Helper-Funktionen
export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}
