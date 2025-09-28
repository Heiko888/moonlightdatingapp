# API-Standardisierung - Human Design App

## Übersicht

Dieses API-System standardisiert alle HTTP-Anfragen in der Human Design App mit zentraler Fehlerbehandlung, Loading-States und Authentifizierung.

## Struktur

```text
frontend/lib/api/
├── config.ts      # API-Konfiguration und Endpunkte
├── client.ts      # HTTP-Client mit Retry-Logik
├── loading.tsx    # Loading-States Management
├── auth.ts        # Authentifizierungs-Service
├── index.ts       # Zentrale Exports
└── README.md      # Diese Dokumentation
```

## Verwendung

### 1. Einfache API-Aufrufe

```typescript
import { api } from '@/lib/api';

// GET-Anfrage
const response = await api.get('/api/users');

// POST-Anfrage
const response = await api.post('/api/users', { name: 'John' });

// Mit Fehlerbehandlung
if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error?.message);
}
```

### 2. Authentifizierung

```typescript
import { useAuth } from '@/lib/api';

function LoginPage() {
  const { login, isAuthenticated, user, isLoading } = useAuth();
  
  const handleLogin = async (credentials) => {
    const response = await login(credentials);
    if (response.success) {
      // Weiterleitung erfolgt automatisch
    }
  };
}
```

### 3. Loading-States

```typescript
import { useLoadingState } from '@/lib/api';

function MyComponent() {
  const { isLoading, error, setLoading, setError } = useLoadingState();
  
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/data');
      // Daten verarbeiten
    } catch (err) {
      setError('Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };
}
```

### 4. Multi-Loading-States

```typescript
import { useMultiLoadingState } from '@/lib/api';

function ComplexComponent() {
  const { setLoading, isLoading, hasError, getError } = useMultiLoadingState();
  
  const loadUserData = async () => {
    setLoading('user', true);
    // API-Aufruf
    setLoading('user', false);
  };
  
  const loadPosts = async () => {
    setLoading('posts', true);
    // API-Aufruf
    setLoading('posts', false);
  };
  
  return (
    <div>
      {isLoading('user') && <div>Lade Benutzer...</div>}
      {isLoading('posts') && <div>Lade Posts...</div>}
      {hasError('user') && <div>Fehler: {getError('user')}</div>}
    </div>
  );
}
```

## Konfiguration

### API-Endpunkte

Alle Endpunkte sind in `config.ts` definiert:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth-test/login',
      REGISTER: '/auth-test/register',
      // ...
    },
    USERS: {
      PROFILE: '/api/users',
      // ...
    }
    // ...
  }
};
```

### Timeout und Retry

```typescript
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 Sekunden
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000 // 1 Sekunde
  }
};
```

## Fehlerbehandlung

### Automatische Retry-Logik

- Netzwerk-Fehler werden automatisch 3x wiederholt
- Auth-Fehler (401/403) werden nicht wiederholt
- Exponential Backoff zwischen Retries

### Fehler-Typen

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
  status?: number;
}
```

### Response-Format

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}
```

## Authentifizierung

### Token-Management

- Automatische Token-Validierung
- Refresh-Token-Support
- Automatische Weiterleitung bei Auth-Fehlern

### Auth-Hook

```typescript
const {
  isAuthenticated,  // boolean
  user,            // User-Objekt oder null
  isLoading,       // boolean
  login,           // Funktion
  register,        // Funktion
  logout,          // Funktion
  checkAuth        // Funktion
} = useAuth();
```

## Best Practices

### 1. Immer Loading-States verwenden

```typescript
// ✅ Gut
const { isLoading, setLoading } = useLoadingState();
setLoading(true);
const response = await api.get('/data');
setLoading(false);

// ❌ Schlecht
const response = await api.get('/data'); // Kein Loading-State
```

### 2. Fehlerbehandlung implementieren

```typescript
// ✅ Gut
try {
  const response = await api.get('/data');
  if (response.success) {
    setData(response.data);
  } else {
    setError(response.error?.message);
  }
} catch (error) {
  setError('Netzwerkfehler');
}

// ❌ Schlecht
const response = await api.get('/data');
setData(response.data); // Keine Fehlerbehandlung
```

### 3. Auth-Status prüfen

```typescript
// ✅ Gut
const { isAuthenticated } = useAuth();
if (!isAuthenticated) {
  return <LoginPrompt />;
}

// ❌ Schlecht
// Direkte API-Aufrufe ohne Auth-Check
```

### 4. Zentrale Konfiguration verwenden

```typescript
// ✅ Gut
import { API_CONFIG } from '@/lib/api';
const response = await api.get(API_CONFIG.ENDPOINTS.USERS.PROFILE);

// ❌ Schlecht
const response = await api.get('/api/users'); // Hardcoded URL
```

## Migration von altem Code

### Vorher (altes System)

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    // ...
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Nachher (neues System)

```typescript
const { isLoading, error, setLoading, setError } = useLoadingState();

const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await api.post('/api/endpoint', data);
    if (response.success) {
      // Erfolg
    } else {
      setError(response.error?.message);
    }
  } catch (err) {
    setError('Netzwerkfehler');
  } finally {
    setLoading(false);
  }
};
```

## Vorteile

1. **Konsistenz**: Alle API-Aufrufe verwenden das gleiche Format
2. **Fehlerbehandlung**: Zentrale und einheitliche Fehlerbehandlung
3. **Loading-States**: Einfache Verwaltung von Loading-Zuständen
4. **Authentifizierung**: Automatische Token-Verwaltung
5. **Retry-Logik**: Automatische Wiederholung bei Netzwerk-Fehlern
6. **TypeScript**: Vollständige Typisierung für bessere Entwicklererfahrung
7. **Wartbarkeit**: Zentrale Konfiguration und einfache Updates
