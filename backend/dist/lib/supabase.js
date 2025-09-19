"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockSupabase = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
// Für All-Inkl Hosting: Echte Supabase-Verbindung verwenden
const isProduction = process.env.NODE_ENV === 'production' ||
    (supabaseUrl !== 'https://your-project.supabase.co' && supabaseKey !== 'your-anon-key');
if (isProduction) {
    console.log('[SUPABASE] Produktionsumgebung - verwende echte Supabase-Verbindung');
}
else {
    console.log('[SUPABASE] Entwicklungsumgebung - verwende Mock-Supabase');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});
// Mock-Funktionen für lokale Entwicklung
exports.mockSupabase = {
    from: (table) => ({
        select: (columns = '*') => ({
            eq: (column, value) => Promise.resolve({ data: [], error: null }),
            limit: (count) => Promise.resolve({ data: [], error: null }),
            then: (callback) => Promise.resolve({ data: [], error: null })
        }),
        insert: (data) => Promise.resolve({ data: null, error: null }),
        update: (data) => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null })
    }),
    auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signUp: (credentials) => Promise.resolve({ data: null, error: null }),
        signInWithPassword: (credentials) => Promise.resolve({ data: null, error: null })
    }
};
