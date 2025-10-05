import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Hilfsfunktionen für sichere JSON-Operationen
export const safeJsonParse = (jsonString: string, fallback: any = null) => {
  if (!jsonString || jsonString.trim() === '') {
    return fallback;
  }

  try {
    return JSON.parse(jsonString);
    } catch (error) {
    console.error('JSON.parse Fehler:', error);
    console.error('Ungültiger JSON-String:', jsonString);
    return fallback;
  }
};

// Supabase-spezifische Fehlerbehandlung
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} Error:`, error);
  
  if (error?.message) {
    return error.message;
  }
  
  return `Fehler bei ${operation}`;
};