/**
 * Authentifizierungs-Service
 * Zentrale Verwaltung von Login, Logout und Token-Validierung
 */

import { api } from './client';
import { API_CONFIG, type ApiResponse } from './config';
import { safeLocalStorageParse, safeLocalStorageSet, safeLocalStorageRemove } from '../utils/safeJsonParse';

// Auth-Typen
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  subscription: 'free' | 'basic' | 'premium' | 'vip';
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    subscription: string;
    [key: string]: unknown;
  };
}

export interface TokenValidationResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    subscription: string;
    [key: string]: unknown;
  };
}

class AuthService {
  private tokenKey = 'token';
  private refreshTokenKey = 'refreshToken';
  private userIdKey = 'userId';
  private userDataKey = 'userData';

  /**
   * Benutzer anmelden
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      // Echte Supabase-Authentifizierung
      const { supabaseAuth } = await import('../supabase/client');
      const response = await supabaseAuth.login(credentials.email, credentials.password);

      if (response.success && response.user) {
        // Echte Supabase Session aus localStorage abrufen
        const sessionData = localStorage.getItem('supabase_session');
        const session = sessionData ? JSON.parse(sessionData) : null;
        
        const authData: AuthResponse = {
          token: session?.access_token || 'mock-jwt-token-' + Date.now(),
          user: {
            id: response.user.id,
            email: response.user.email,
            firstName: response.user.firstName || '',
            lastName: response.user.lastName || '',
            subscription: response.user.subscription || 'free'
          }
        };

        this.setAuthData(authData);

        return {
          success: true,
          data: authData
        };
      } else {
        return {
          success: false,
          error: {
            code: 'LOGIN_ERROR',
            message: response.error || 'Anmeldung fehlgeschlagen'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen'
        }
      };
    }
  }

  /**
   * Benutzer registrieren
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      // Echte Supabase-Registrierung
      const { supabaseAuth } = await import('../supabase/client');
      const response = await supabaseAuth.register(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.birthDate,
        data.birthTime,
        data.birthPlace,
        data.subscription
      );

      if (response.success && response.user) {
        // Echte Supabase Session aus localStorage abrufen
        const sessionData = localStorage.getItem('supabase_session');
        const session = sessionData ? JSON.parse(sessionData) : null;
        
        const authData: AuthResponse = {
          token: session?.access_token || 'mock-jwt-token-' + Date.now(),
          user: {
            id: response.user.id,
            email: response.user.email,
            firstName: response.user.firstName || '',
            lastName: response.user.lastName || '',
            subscription: response.user.subscription || 'free'
          }
        };

        this.setAuthData(authData);

        return {
          success: true,
          data: authData
        };
      } else {
        return {
          success: false,
          error: {
            code: 'REGISTER_ERROR',
            message: response.error || 'Registrierung fehlgeschlagen'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REGISTER_ERROR',
          message: error instanceof Error ? error.message : 'Registrierung fehlgeschlagen'
        }
      };
    }
  }

  /**
   * Token validieren
   */
  async validateToken(token?: string): Promise<ApiResponse<TokenValidationResponse>> {
    try {
      const tokenToValidate = token || this.getToken();
      
      if (!tokenToValidate) {
        return {
          success: false,
          error: {
            code: 'NO_TOKEN',
            message: 'Kein Token vorhanden'
          }
        };
      }

      // Supabase Session-Token-Validierung
      if (tokenToValidate === 'supabase-session-token' || tokenToValidate.startsWith('eyJ')) {
        // Echte Supabase Session aus localStorage abrufen
        const sessionData = localStorage.getItem('supabase_session');
        const session = sessionData ? JSON.parse(sessionData) : null;
        
        if (session && session.access_token) {
          const currentUser = this.getCurrentUser();
          return {
            success: true,
            data: {
              valid: true,
              user: {
                id: String(currentUser?.id || session.user?.id || 'user-id'),
                email: String(currentUser?.email || session.user?.email || 'user@example.com'),
                subscription: String(currentUser?.subscription || 'free')
              }
            }
          };
        }
      }
      
      // Mock-Token-Validierung (Fallback)
      if (tokenToValidate.startsWith('mock-jwt-token-')) {
        const currentUser = this.getCurrentUser();
        return {
          success: true,
          data: {
            valid: true,
            user: {
              id: String(currentUser?.id || 'mock-user-id'),
              email: String(currentUser?.email || 'demo@example.com'),
              subscription: String(currentUser?.subscription || 'free')
            }
          }
        };
      } else {
        return {
          success: false,
          error: {
            code: 'TOKEN_INVALID',
            message: 'Ungültiger oder abgelaufener Token'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error instanceof Error ? error.message : 'Token-Validierung fehlgeschlagen'
        }
      };
    }
  }

  /**
   * Token aktualisieren
   */
  async refreshToken(): Promise<ApiResponse<{ token: string; refreshToken?: string }>> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        return {
          success: false,
          error: {
            code: 'NO_REFRESH_TOKEN',
            message: 'Kein Refresh-Token vorhanden'
          }
        };
      }

      const response = await api.post<{ token: string; refreshToken?: string }>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN,
        { refreshToken },
        { requireAuth: false }
      );

      if (response.success && response.data) {
        this.setToken(response.data.token);
        if (response.data.refreshToken) {
          this.setRefreshToken(response.data.refreshToken);
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REFRESH_ERROR',
          message: error instanceof Error ? error.message : 'Token-Aktualisierung fehlgeschlagen'
        }
      };
    }
  }

  /**
   * Benutzer abmelden
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      // Auth-Daten löschen
      this.clearAuthData();

      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      // Auth-Daten trotzdem löschen
      this.clearAuthData();
      
      return {
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: error instanceof Error ? error.message : 'Abmeldung fehlgeschlagen'
        }
      };
    }
  }

  /**
   * Prüfen ob Benutzer angemeldet ist
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const userId = this.getUserId();
    return !!(token && userId);
  }

  /**
   * Aktuellen Benutzer abrufen
   */
  getCurrentUser(): Record<string, unknown> | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const userData = safeLocalStorageParse(this.userDataKey, null);
      if (!userData) {
        return null;
      }
      
      return userData;
    } catch (error) {
      console.warn('Fehler beim Laden der Benutzerdaten:', error);
      // Beschädigte Daten löschen
      this.clearAuthData();
      return null;
    }
  }

  /**
   * Token abrufen
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Refresh-Token abrufen
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * User-ID abrufen
   */
  getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.userIdKey);
  }

  /**
   * Auth-Daten setzen
   */
  private setAuthData(authData: AuthResponse): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.tokenKey, authData.token);
      localStorage.setItem(this.userIdKey, authData.user.id);
      safeLocalStorageSet(this.userDataKey, authData.user);
      
      if (authData.refreshToken) {
        localStorage.setItem(this.refreshTokenKey, authData.refreshToken);
      }
    } catch (error) {
      console.warn('Fehler beim Speichern der Auth-Daten:', error);
    }
  }

  /**
   * Token setzen
   */
  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Refresh-Token setzen
   */
  private setRefreshToken(refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  /**
   * Alle Auth-Daten löschen
   */
  private clearAuthData(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.userIdKey);
      safeLocalStorageRemove(this.userDataKey);
    } catch (error) {
      console.warn('Fehler beim Löschen der Auth-Daten:', error);
    }
  }

  /**
   * Automatische Token-Validierung beim App-Start
   */
  async initializeAuth(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Für Mock-Authentifizierung: Token ist gültig wenn vorhanden
    const token = this.getToken();
    if (token && token.startsWith('mock-jwt-token-')) {
      return true;
    }

    // Für echte Authentifizierung: Token validieren
    const validation = await this.validateToken();
    
    if (!validation.success || !validation.data?.valid) {
      this.clearAuthData();
      return false;
    }

    return true;
  }
}

// Singleton-Instanz
export const authService = new AuthService();

// React-Hook für Authentifizierung
import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const isValid = await authService.initializeAuth();
      setIsAuthenticated(isValid);
      
      if (isValid) {
        setUser(authService.getCurrentUser());
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth-Check fehlgeschlagen:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    
    if (response.success) {
      setIsAuthenticated(true);
      setUser(authService.getCurrentUser());
    }
    
    return response;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await authService.register(data);
    
    if (response.success) {
      setIsAuthenticated(true);
      setUser(authService.getCurrentUser());
    }
    
    return response;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    checkAuth
  };
}
