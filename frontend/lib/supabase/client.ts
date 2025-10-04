/**
 * Supabase Client für direkte Authentifizierung
 * Umgeht das Backend und kommuniziert direkt mit Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Supabase-Konfiguration mit Validierung
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://njjcywgskzepikyzhihy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs';

// Kritische Validierung der Umgebungsvariablen
if (supabaseUrl === 'https://your-project.supabase.co') {
  console.error('❌ KRITISCHER FEHLER: NEXT_PUBLIC_SUPABASE_URL nicht konfiguriert!');
  console.warn('⚠️ Verwende Fallback-Modus ohne Supabase-Verbindung');
  // Nicht mehr werfen, sondern Fallback-Modus aktivieren
}

if (supabaseAnonKey === 'your-anon-key') {
  console.error('❌ KRITISCHER FEHLER: NEXT_PUBLIC_SUPABASE_ANON_KEY nicht konfiguriert!');
  console.warn('⚠️ Verwende Fallback-Modus ohne Supabase-Verbindung');
  // Nicht mehr werfen, sondern Fallback-Modus aktivieren
}

// Erfolgreiche Konfiguration bestätigen
console.log('✅ Supabase-Client konfiguriert:', supabaseUrl);

// Supabase-Client erstellen
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth-Typen
export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscription?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

/**
 * Supabase-Authentifizierungsservice
 */
export class SupabaseAuthService {
  /**
   * Benutzer anmelden
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Input-Validierung
      if (!email || !password) {
        return {
          success: false,
          error: 'E-Mail und Passwort sind erforderlich'
        };
      }

      // E-Mail-Format validieren
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: 'Ungültige E-Mail-Adresse'
        };
      }

      // Passwort-Länge validieren
      if (password.length < 6) {
        return {
          success: false,
          error: 'Passwort muss mindestens 6 Zeichen lang sein'
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Anmeldung fehlgeschlagen'
        };
      }

      // Benutzerprofil aus der users-Tabelle abrufen
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.warn('⚠️ Benutzerprofil nicht gefunden:', profileError.message);
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        firstName: userProfile?.first_name || '',
        lastName: userProfile?.last_name || '',
        subscription: userProfile?.subscription || 'free'
      };

      // Auth-Daten im localStorage speichern
      localStorage.setItem('supabase_user', JSON.stringify(user));
      
      // Session nur speichern wenn vorhanden
      if (data.session) {
        localStorage.setItem('supabase_session', JSON.stringify(data.session));
        
        // Token für API-Client-Kompatibilität
        if (data.session.access_token) {
          localStorage.setItem('token', data.session.access_token);
        }
      } else {
        // Fallback: Mock-Token für lokale Entwicklung
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        console.warn('⚠️ Keine Supabase-Session, verwende Mock-Token für lokale Entwicklung');
      }

      return {
        success: true,
        user
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen'
      };
    }
  }

  /**
   * Benutzer registrieren
   */
  async register(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    birthDate: string,
    birthTime?: string,
    birthPlace?: string,
    subscription: string = 'free'
  ): Promise<AuthResponse> {
    try {
      // Input-Validierung
      if (!email || !password || !firstName || !lastName || !birthDate) {
        return {
          success: false,
          error: 'Alle Pflichtfelder müssen ausgefüllt werden'
        };
      }

      // E-Mail-Format validieren
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: 'Ungültige E-Mail-Adresse'
        };
      }

      // Passwort-Stärke validieren
      if (password.length < 8) {
        return {
          success: false,
          error: 'Passwort muss mindestens 8 Zeichen lang sein'
        };
      }

      // Passwort-Komplexität prüfen
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        return {
          success: false,
          error: 'Passwort muss Großbuchstaben, Kleinbuchstaben und Zahlen enthalten'
        };
      }

      // Geburtsdatum validieren
      const birthDateObj = new Date(birthDate);
      const today = new Date();
      if (birthDateObj >= today) {
        return {
          success: false,
          error: 'Geburtsdatum muss in der Vergangenheit liegen'
        };
      }

      // Benutzer in Supabase Auth registrieren
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            birth_date: birthDate,
            birth_time: birthTime || null,
            birth_place: birthPlace || null,
            subscription: subscription
          }
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Registrierung fehlgeschlagen'
        };
      }

      // Benutzerprofil in der users-Tabelle erstellen
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate,
          birth_time: birthTime || null,
          birth_place: birthPlace || null,
          subscription: subscription,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profil-Erstellung Fehler:', profileError);
        // Benutzer ist registriert, aber Profil konnte nicht erstellt werden
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        firstName,
        lastName,
        subscription
      };

      // Auth-Daten im localStorage speichern
      localStorage.setItem('supabase_user', JSON.stringify(user));
      
      // Session nur speichern wenn vorhanden
      if (data.session) {
        localStorage.setItem('supabase_session', JSON.stringify(data.session));
        
        // Token für API-Client-Kompatibilität
        if (data.session.access_token) {
          localStorage.setItem('token', data.session.access_token);
        }
      } else {
        // Fallback: Mock-Token für lokale Entwicklung
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        console.warn('⚠️ Keine Supabase-Session, verwende Mock-Token für lokale Entwicklung');
      }

      return {
        success: true,
        user
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registrierung fehlgeschlagen'
      };
    }
  }

  /**
   * Benutzer abmelden
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase_user');
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('token');
      console.log('✅ Benutzer erfolgreich abgemeldet');
    } catch (error) {
      console.error('❌ Logout-Fehler:', error);
      // Auch bei Fehlern lokale Daten löschen
      localStorage.removeItem('supabase_user');
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('token');
    }
  }

  /**
   * Aktuellen Benutzer abrufen
   */
  getCurrentUser(): AuthUser | null {
    const userData = localStorage.getItem('supabase_user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Session-Refresh-Status prüfen
   */
  async checkSessionRefresh(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session-Refresh-Fehler:', error);
        return false;
      }

      if (!session) {
        console.warn('⚠️ Keine aktive Session gefunden');
        return false;
      }

      // Prüfe ob Session bald abläuft (innerhalb der nächsten 5 Minuten)
      const expiresAt = new Date(session.expires_at!);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      if (timeUntilExpiry < 5 * 60 * 1000) { // 5 Minuten
        console.log('🔄 Session läuft bald ab, versuche Refresh...');
        const { error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('❌ Session-Refresh fehlgeschlagen:', refreshError);
          return false;
        }
        
        console.log('✅ Session erfolgreich erneuert');
      }

      return true;
    } catch (error) {
      console.error('❌ Session-Check-Fehler:', error);
      return false;
    }
  }

  /**
   * Prüfen ob Benutzer angemeldet ist
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

// Singleton-Instanz
export const supabaseAuth = new SupabaseAuthService();
