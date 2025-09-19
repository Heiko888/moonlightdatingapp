import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// Für All-Inkl Hosting: Echte Supabase-Verbindung verwenden
const isProduction = process.env.NODE_ENV === 'production' || 
  (supabaseUrl !== 'https://your-project.supabase.co' && supabaseKey !== 'your-anon-key');

if (isProduction) {
  console.log('[SUPABASE] Produktionsumgebung - verwende echte Supabase-Verbindung');
} else {
  console.log('[SUPABASE] Entwicklungsumgebung - verwende Mock-Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Mock-Funktionen für lokale Entwicklung
export const mockSupabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      limit: (count: number) => Promise.resolve({ data: [], error: null }),
      then: (callback: any) => Promise.resolve({ data: [], error: null })
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null })
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signUp: (credentials: any) => Promise.resolve({ data: null, error: null }),
    signInWithPassword: (credentials: any) => Promise.resolve({ data: null, error: null })
  }
};

// Typen für Human Design Daten
export interface HDUser {
  id: string;
  username: string;
  email: string;
  password_hash?: string;
  name?: string;
  birthdate?: string;
  birthplace?: string;
  hd_type?: string;
  profile?: string;
  centers?: string[];
  channels?: string[];
  gates?: string[];
  planets?: string[];
  chart?: any;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface HDChart {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  chart_data: any;
  centers?: string[];
  channels?: string[];
  gates?: string[];
  planets?: string[];
  created_at: string;
  updated_at: string;
}

export interface HDReading {
  id: string;
  user_id: string;
  chart_id: string;
  scope: string;
  content: string;
  title?: string;
  summary?: string;
  sources?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface HDKnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: 'gate' | 'channel' | 'center' | 'profile' | 'type';
  ref_key: string;
  scope: string;
  quality: 'verified' | 'draft' | 'needs_review';
  created_at: string;
  updated_at: string;
}

export interface HDChat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface HDMessage {
  id: string;
  chat_id: string;
  user_id: string;
  text: string;
  file_url?: string;
  file_name?: string;
  reactions?: string[];
  read: boolean;
  created_at: string;
}
