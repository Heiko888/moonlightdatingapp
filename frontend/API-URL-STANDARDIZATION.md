# 🔧 **API-URL-Standardisierung - Human Design App**

## ❌ **Problem: Inkonsistente API-URLs**

### **Aktuelle Probleme:**

#### **1. Hardcodierte URLs:**

```typescript
// ❌ Verschiedene hardcodierte URLs
fetch('http://localhost:4001/dashboard/${userId}')
fetch('http://localhost:4001/sessionrequest')
fetch('http://localhost:4001/api/users/${userId}')
fetch('http://localhost:4001/moon-calendar/current')
fetch('http://localhost:4001/data-persistence/moon-tracking')
```

#### **2. Inkonsistente Endpunkte:**

```typescript
// ❌ Verschiedene URL-Formate
'/api/users'           // Mit /api/ Prefix
'/moon-calendar/current' // Ohne /api/ Prefix
'/sessionrequest'      // Direkter Endpunkt
'/data-persistence/moon-tracking' // Längerer Pfad
```

#### **3. Keine zentrale Konfiguration:**

- 40+ Dateien mit hardcodierten URLs
- Keine einheitliche API-Base-URL
- Verschiedene URL-Formate in verschiedenen Komponenten

## ✅ **Lösung: Zentrale API-URL-Standardisierung**

### **1. Zentrale API-Konfiguration:**

```typescript
// lib/api/config.ts
export const API_CONFIG = {
  // Haupt-Backend-URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001',
  
  // API-Endpunkte - ALLE standardisiert
  ENDPOINTS: {
    // Authentifizierung
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      VALIDATE_TOKEN: '/api/auth/validate-token',
      REFRESH_TOKEN: '/api/auth/refresh-token',
      LOGOUT: '/api/auth/logout'
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
      UPLOAD: '/api/admin/upload'
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
  }
} as const;
```

### **2. Zentraler API-Service:**

```typescript
// lib/services/apiService.ts
class ApiService {
  // ==================== DASHBOARD ====================
  async getDashboardData(userId: string): Promise<DashboardStats | null> {
    try {
      const response = await api.get<DashboardStats>(`${API_CONFIG.ENDPOINTS.DASHBOARD.DATA}/${userId}`);
      return response.success ? response.data! : null;
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
      return null;
    }
  }

  // ==================== MOON CALENDAR ====================
  async getCurrentMoonPhase(): Promise<MoonPhase | null> {
    try {
      const response = await api.get<MoonPhase>(API_CONFIG.ENDPOINTS.MOON.CURRENT_PHASE);
      return response.success ? response.data! : null;
    } catch (error) {
      console.error('Fehler beim Laden der aktuellen Mondphase:', error);
      return null;
    }
  }

  async getMoonTracking(userId: string): Promise<MoonTracking[]> {
    try {
      const response = await api.get<MoonTracking[]>(`${API_CONFIG.ENDPOINTS.MOON.TRACKING}?userId=${userId}`);
      return response.success ? response.data! : [];
    } catch (error) {
      console.error('Fehler beim Laden der Moon-Tracking-Daten:', error);
      return [];
    }
  }

  async saveMoonTracking(trackingData: Partial<MoonTracking>) {
    return api.post(API_CONFIG.ENDPOINTS.MOON.TRACKING, trackingData);
  }

  // ==================== COACHING ====================
  async bookCoachingSession(sessionData: Partial<CoachingSession>) {
    return api.post(API_CONFIG.ENDPOINTS.COACHING.BOOKINGS, sessionData);
  }

  // ==================== USER MANAGEMENT ====================
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const response = await api.get<User>(`${API_CONFIG.ENDPOINTS.USERS.PROFILE}/${userId}`);
      return response.success ? response.data! : null;
    } catch (error) {
      console.error('Fehler beim Laden des Benutzerprofils:', error);
      return null;
    }
  }

  // ==================== DATA PERSISTENCE ====================
  async saveMoonTrackingData(trackingData: any) {
    return api.post(API_CONFIG.ENDPOINTS.DATA_PERSISTENCE.MOON_TRACKING, trackingData);
  }

  // ==================== TEST & DEVELOPMENT ====================
  async getTestStatus() {
    return api.get(API_CONFIG.ENDPOINTS.TEST.STATUS);
  }
}
```

### **3. URL-Builder Utility:**

```typescript
// lib/api/utils.ts
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
```

### **4. Migration der hardcodierten URLs:**

#### **Vorher (❌ Inkonsistent):**

```typescript
// app/profil/page.tsx
const response = await fetch(`http://localhost:4001/api/users/${userId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// app/mondkalender/page.tsx
const response = await fetch('http://localhost:4001/moon-calendar/current', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Britta-Seite entfernt - nicht mehr verfügbar
```

#### **Nachher (✅ Standardisiert):**

```typescript
// app/profil/page.tsx
const userData = await apiService.getUserProfile(userId);

// app/mondkalender/page.tsx
const moonPhase = await apiService.getCurrentMoonPhase();

// Britta-Seite entfernt - nicht mehr verfügbar
```

### **5. Environment-Konfiguration:**

```bash
# .env.local
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4001

# Development
NEXT_PUBLIC_API_URL_DEV=http://localhost:4001
NEXT_PUBLIC_API_URL_STAGING=https://api-staging.hd-app.com
NEXT_PUBLIC_API_URL_PRODUCTION=https://api.hd-app.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://njjcywgskzepikyzhihy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Environment
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development
```

### **6. API-URL-Validierung:**

```typescript
// lib/api/validation.ts
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
```

## 🚀 **Implementierung:**

### **Schritt 1: API-Konfiguration aktualisieren**

- ✅ Zentrale API-Konfiguration erweitern
- ✅ Alle Endpunkte standardisieren
- ✅ URL-Builder-Utilities hinzufügen

### **Schritt 2: Hardcodierte URLs ersetzen**

- ✅ Alle `fetch()`-Aufrufe durch `apiService` ersetzen
- ✅ Konsistente URL-Formate verwenden
- ✅ Zentrale Fehlerbehandlung implementieren

### **Schritt 3: Environment-Konfiguration**

- ✅ Environment-Variablen standardisieren
- ✅ Development/Production-URLs konfigurieren
- ✅ API-URL-Validierung hinzufügen

### **Schritt 4: Testing & Validation**

- ✅ Alle API-Endpunkte testen
- ✅ URL-Konsistenz validieren
- ✅ Error-Handling prüfen

## ✅ **Ergebnis:**

### **Vorher:**

- ❌ 40+ Dateien mit hardcodierten URLs
- ❌ Inkonsistente Endpunkt-Formate
- ❌ Keine zentrale Konfiguration
- ❌ Verschiedene URL-Formate

### **Nachher:**

- ✅ Zentrale API-Konfiguration
- ✅ Einheitliche URL-Formate
- ✅ Zentraler API-Service
- ✅ Environment-basierte Konfiguration
- ✅ URL-Validierung und Error-Handling

**Die Human Design App hat jetzt eine vollständig standardisierte API-URL-Struktur!** 🚀
