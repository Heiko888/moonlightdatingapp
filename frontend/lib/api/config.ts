/**
 * Zentrale API-Konfiguration
 * Standardisiert alle API-Aufrufe in der Anwendung
 */

// API-Base-URLs
export const API_CONFIG = {
  // Supabase Edge Functions URL (für lokale Entwicklung: Mock-Modus)
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api',
  
  // API-Endpunkte - ALLE standardisiert
  ENDPOINTS: {
    // Authentifizierung
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VALIDATE_TOKEN: '/api/auth/verify',
      REFRESH_TOKEN: '/auth/refresh-token',
      LOGOUT: '/auth/logout'
    },
    
    // Benutzer
    USERS: {
      PROFILE: '/api/users',
      UPDATE_PROFILE: '/api/users/update',
      DELETE_ACCOUNT: '/api/users/delete'
    },
    
    // Dashboard
    DASHBOARD: {
      DATA: '/api/dashboard',
      ACTIVITIES: '/api/dashboard/activities',
      NOTIFICATIONS: '/api/dashboard/notifications'
    },
    
    // Charts & Human Design
    CHARTS: {
      CALCULATE: '/api/charts/calculate',
      SAVE: '/api/charts',
      LOAD: '/api/charts'
    },
    
    // Mondkalender
    MOON: {
      CURRENT_PHASE: '/api/moon-calendar/current',
      PHASES: '/api/moon-calendar/phases',
      ENTRIES: '/api/moon-calendar/entries',
      TRACKING: '/api/moon-calendar/tracking',
      STORIES: '/api/moon-calendar/stories',
      PLANT_RITUALS: '/api/moon-calendar/plant-rituals',
      HEALTH_GUIDANCE: '/api/moon-calendar/health-guidance',
      YEARLY_DATA: '/api/moon-calendar/yearly',
      GATE_DETAILS: '/api/moon-calendar/gate-details'
    },
    
    // Community
    COMMUNITY: {
      POSTS: '/api/community/posts',
      GROUPS: '/api/community/groups',
      EVENTS: '/api/community/events',
      FRIENDS: '/api/community/friends'
    },
    
    // Dating
    DATING: {
      MATCHES: '/api/dating/matches',
      SWIPE: '/api/dating/swipe',
      PROFILE: '/api/dating/profile'
    },
    
    // Coaching
    COACHING: {
      SESSIONS: '/api/coaching/sessions',
      BOOKINGS: '/api/coaching/bookings',
      REVIEWS: '/api/coaching/reviews'
    },
    
    // Admin
    ADMIN: {
      USERS: '/api/admin/users',
      STATS: '/api/admin/stats',
      UPLOAD: '/api/admin/upload',
      DASHBOARD: '/api/admin/dashboard'
    },
    
    // Data Persistence
    DATA_PERSISTENCE: {
      MOON_TRACKING: '/api/data-persistence/moon-tracking',
      USER_PREFERENCES: '/api/data-persistence/user-preferences',
      CHART_DATA: '/api/data-persistence/chart-data'
    },
    
    // Test & Development
    TEST: {
      STATUS: '/api/test/status',
      METRICS: '/api/test/metrics'
    }
  },
  
  // Timeout-Konfiguration
  TIMEOUT: 10000, // 10 Sekunden
  
  // Retry-Konfiguration
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000 // 1 Sekunde
  }
} as const;

// HTTP-Status-Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// API-Fehler-Typen
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  status?: number;
}

// API-Response-Typen
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// Request-Konfiguration
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  requireAuth?: boolean;
}

// Loading-State-Typen
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

// Utility-Funktionen
export const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  const url = new URL(endpoint, API_CONFIG.BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// URL-Builder-Utilities
export const buildApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  if (params) {
    const url = new URL(fullUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    return url.toString();
  }
  
  return fullUrl;
};

export const getApiEndpoint = (category: keyof typeof API_CONFIG.ENDPOINTS, endpoint: string): string => {
  return API_CONFIG.ENDPOINTS[category][endpoint as keyof typeof API_CONFIG.ENDPOINTS[typeof category]];
};

// API-URL-Validierung
export const validateApiUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

export const getApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
  
  if (!validateApiUrl(baseUrl)) {
    console.warn('Invalid API base URL, falling back to localhost:4001');
    return 'http://localhost:4001';
  }
  
  return baseUrl;
};
