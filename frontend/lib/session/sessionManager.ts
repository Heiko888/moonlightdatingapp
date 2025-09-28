/**
 * Session-Management für die Human Design App
 * Verwaltet Benutzer-Sessions, Token-Refresh und automatische Abmeldung
 */

import { api } from '@/lib/api/client';
import { API_CONFIG } from '@/lib/api/config';

export interface UserData {
  id: string;
  email: string;
  name?: string;
  role?: string;
  subscription?: {
    type: string;
    status: string;
    expiresAt?: number;
  };
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
  };
  createdAt: number;
  lastLoginAt?: number;
}

export interface SessionData {
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: number;
  userData: UserData;
}

export interface SessionConfig {
  refreshThreshold: number; // Minuten vor Ablauf
  maxRetries: number;
  retryDelay: number; // Millisekunden
}

class SessionManager {
  private static instance: SessionManager;
  private sessionData: SessionData | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private config: SessionConfig = {
    refreshThreshold: 5, // 5 Minuten vor Ablauf
    maxRetries: 3,
    retryDelay: 1000
  };

  private constructor() {
    this.initializeSession();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Initialisiert die Session aus localStorage
   */
  private initializeSession(): void {
    try {
      // Prüfe ob wir im Browser sind
      if (typeof window === 'undefined') {
        return;
      }
      
      const storedSession = localStorage.getItem('sessionData');
      if (storedSession) {
        this.sessionData = JSON.parse(storedSession);
        this.scheduleTokenRefresh();
      }
    } catch (error) {
      console.error('Fehler beim Initialisieren der Session:', error);
      this.clearSession();
    }
  }

  /**
   * Speichert Session-Daten
   */
  public setSession(sessionData: SessionData): void {
    this.sessionData = sessionData;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
    }
    this.scheduleTokenRefresh();
  }

  /**
   * Holt aktuelle Session-Daten
   */
  public getSession(): SessionData | null {
    return this.sessionData;
  }

  /**
   * Prüft ob Session gültig ist
   */
  public isSessionValid(): boolean {
    if (!this.sessionData) return false;
    
    const now = Date.now();
    const expiresAt = this.sessionData.expiresAt;
    
    // Session ist gültig wenn sie noch nicht abgelaufen ist
    return now < expiresAt;
  }

  /**
   * Holt den aktuellen Token
   */
  public getToken(): string | null {
    return this.sessionData?.token || null;
  }

  /**
   * Holt Benutzerdaten
   */
  public getUserData(): UserData | null {
    return this.sessionData?.userData || null;
  }

  /**
   * Holt Benutzer-ID
   */
  public getUserId(): string | null {
    return this.sessionData?.userId || null;
  }

  /**
   * Plant Token-Refresh
   */
  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.sessionData) return;

    const now = Date.now();
    const expiresAt = this.sessionData.expiresAt;
    const refreshThreshold = this.config.refreshThreshold * 60 * 1000; // in Millisekunden
    const refreshTime = expiresAt - refreshThreshold;

    if (refreshTime > now) {
      const delay = refreshTime - now;
      this.refreshTimer = setTimeout(() => {
        this.refreshToken();
      }, delay);
    } else {
      // Token ist bereits abgelaufen oder läuft bald ab
      this.refreshToken();
    }
  }

  /**
   * Aktualisiert den Token
   */
  public async refreshToken(): Promise<boolean> {
    if (!this.sessionData?.refreshToken) {
      this.clearSession();
      return false;
    }

    try {
      const response = await api.post<{
        token: string;
        refreshToken: string;
        expiresIn: number;
      }>(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refreshToken: this.sessionData.refreshToken
      });

      if (response.success && response.data) {
        const newSessionData: SessionData = {
          ...this.sessionData,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          expiresAt: Date.now() + (response.data.expiresIn * 1000)
        };

        this.setSession(newSessionData);
        return true;
      } else {
        console.error('Token-Refresh fehlgeschlagen:', response.error);
        this.clearSession();
        return false;
      }
    } catch (error) {
      console.error('Fehler beim Token-Refresh:', error);
      this.clearSession();
      return false;
    }
  }

  /**
   * Löscht die Session
   */
  public clearSession(): void {
    this.sessionData = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sessionData');
    }
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Prüft Session-Status und aktualisiert bei Bedarf
   */
  public async validateSession(): Promise<boolean> {
    if (!this.sessionData) return false;

    // Wenn Session bald abläuft, versuche Refresh
    const now = Date.now();
    const refreshThreshold = this.config.refreshThreshold * 60 * 1000;
    
    if (this.sessionData.expiresAt - now < refreshThreshold) {
      return await this.refreshToken();
    }

    // Validiere Token mit Backend
    try {
      const response = await api.post<{ valid: boolean }>(
        API_CONFIG.ENDPOINTS.AUTH.VALIDATE_TOKEN,
        { token: this.sessionData.token }
      );

      if (response.success && response.data?.valid) {
        return true;
      } else {
        this.clearSession();
        return false;
      }
    } catch (error) {
      console.error('Session-Validierung fehlgeschlagen:', error);
      this.clearSession();
      return false;
    }
  }

  /**
   * Aktualisiert Benutzerdaten
   */
  public updateUserData(userData: UserData): void {
    if (this.sessionData) {
      this.sessionData.userData = userData;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionData', JSON.stringify(this.sessionData));
      }
    }
  }

  /**
   * Konfiguration aktualisieren
   */
  public updateConfig(config: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Session-Status für Debugging
   */
  public getSessionStatus(): {
    hasSession: boolean;
    isValid: boolean;
    expiresAt: Date | null;
    timeUntilExpiry: number | null;
  } {
    if (!this.sessionData) {
      return {
        hasSession: false,
        isValid: false,
        expiresAt: null,
        timeUntilExpiry: null
      };
    }

    const now = Date.now();
    const expiresAt = new Date(this.sessionData.expiresAt);
    const timeUntilExpiry = this.sessionData.expiresAt - now;

    return {
      hasSession: true,
      isValid: this.isSessionValid(),
      expiresAt,
      timeUntilExpiry: timeUntilExpiry > 0 ? timeUntilExpiry : 0
    };
  }
}

// Singleton-Instanz exportieren
export const sessionManager = SessionManager.getInstance();

// Convenience-Funktionen
export const getSession = () => sessionManager.getSession();
export const getToken = () => sessionManager.getToken();
export const getUserData = () => sessionManager.getUserData();
export const getUserId = () => sessionManager.getUserId();
export const isSessionValid = () => sessionManager.isSessionValid();
export const validateSession = () => sessionManager.validateSession();
export const clearSession = () => sessionManager.clearSession();
export const refreshToken = () => sessionManager.refreshToken();
export const updateUserData = (userData: UserData) => sessionManager.updateUserData(userData);
export const getSessionStatus = () => sessionManager.getSessionStatus();
