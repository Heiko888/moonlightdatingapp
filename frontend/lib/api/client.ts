/**
 * Zentrale API-Client-Implementierung
 * Standardisiert alle HTTP-Anfragen mit Fehlerbehandlung und Retry-Logik
 */

import { API_CONFIG, HTTP_STATUS, type ApiResponse, type RequestConfig, type ApiError } from './config';

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultTimeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Zentrale HTTP-Anfrage-Methode
   */
  private async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = API_CONFIG.RETRY.ATTEMPTS,
      requireAuth = true
    } = config;

    // URL zusammenbauen
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    // Headers zusammenbauen
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Auth-Header hinzufügen wenn erforderlich
    if (requireAuth && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // Request-Body vorbereiten
    let requestBody: string | undefined;
    if (body && method !== 'GET') {
      requestBody = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Retry-Logik
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: requestBody,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Response verarbeiten
        const result = await this.handleResponse<T>(response);
        
        // Bei Erfolg direkt zurückgeben
        if (result.success) {
          return result;
        }

        // Bei Auth-Fehlern nicht retry
        if (response.status === HTTP_STATUS.UNAUTHORIZED || 
            response.status === HTTP_STATUS.FORBIDDEN) {
          this.handleAuthError();
          return result;
        }

        // Bei anderen Fehlern retry
        if (attempt < retries) {
          await this.delay(API_CONFIG.RETRY.DELAY * (attempt + 1));
          continue;
        }

        return result;

      } catch (error) {
        lastError = error as Error;
        
        // Bei Netzwerk-Fehlern retry
        if (attempt < retries && this.isRetryableError(error as Error)) {
          await this.delay(API_CONFIG.RETRY.DELAY * (attempt + 1));
          continue;
        }
      }
    }

    // Alle Retries fehlgeschlagen
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: lastError?.message || 'Netzwerkfehler',
        details: lastError
      }
    };
  }

  /**
   * Response verarbeiten
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          data: data.data || data,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: {
            code: data.code || `HTTP_${response.status}`,
            message: data.message || data.error || 'Unbekannter Fehler',
            status: response.status,
            details: data
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Fehler beim Verarbeiten der Antwort',
          status: response.status,
          details: error
        }
      };
    }
  }

  /**
   * Auth-Fehler behandeln
   */
  private handleAuthError(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userData');
      
      // Zur Login-Seite weiterleiten
      window.location.href = '/login';
    }
  }

  /**
   * Prüfen ob Fehler retry-fähig ist
   */
  private isRetryableError(error: Error): boolean {
    // Netzwerk-Fehler sind retry-fähig
    if (error.name === 'AbortError' || error.name === 'TypeError') {
      return true;
    }
    
    return false;
  }

  /**
   * Delay-Funktion für Retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Öffentliche API-Methoden
  async get<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async delete<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async patch<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }
}

// Singleton-Instanz
export const apiClient = new ApiClient();

// Convenience-Funktionen
export const api = {
  get: <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>) => 
    apiClient.get<T>(endpoint, config),
  
  post: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.post<T>(endpoint, body, config),
  
  put: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.put<T>(endpoint, body, config),
  
  delete: <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>) => 
    apiClient.delete<T>(endpoint, config),
  
  patch: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.patch<T>(endpoint, body, config)
};
