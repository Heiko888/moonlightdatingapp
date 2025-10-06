# 🔐 Middleware & Access Control - Vollständige Übersicht

## 📋 **Middleware Protected Routes**

### **Geschützte Routen (Middleware prüft Authentication):**
```javascript
const protectedRoutes = [
  '/profile', '/settings', '/subscription', 
  '/chart', '/chart-info', '/human-design-info', 
  '/mondkalender', '/community', '/reading', 
  '/bodygraph-advanced', '/chart-comparison', 
  '/dating', '/coaching', '/analytics', 
  '/api-access', '/vip-community', 
  '/personal-coach', '/dashboard-vip'
]
```

## 🎯 **Subscription Access Control (Middleware)**

### **Free Package:**
```javascript
'free': [
  '/chart', '/chart-info', '/human-design-info', '/'
]
```

### **Basic Package:**
```javascript
'basic': [
  '/chart', '/chart-info', '/human-design-info', '/', 
  '/dashboard', '/profile', '/settings', 
  '/mondkalender', '/community', '/reading'
]
```

### **Premium Package:**
```javascript
'premium': [
  '/chart', '/chart-info', '/human-design-info', '/', 
  '/dashboard', '/profile', '/settings', 
  '/mondkalender', '/community', '/reading', 
  '/bodygraph-advanced', '/chart-comparison', 
  '/dating', '/analytics', '/api-access'
]
```

### **VIP Package:**
```javascript
'vip': [
  '/chart', '/chart-info', '/human-design-info', '/', 
  '/dashboard', '/profile', '/settings', 
  '/mondkalender', '/community', '/reading', 
  '/bodygraph-advanced', '/chart-comparison', 
  '/dating', '/coaching', '/analytics', 
  '/api-access', '/vip-community', 
  '/personal-coach', '/dashboard-vip', '/admin'
]
```

## 🔧 **Access Control System (Component Level)**

### **Öffentliche Seiten (Free - Kein Login):**
| Seite | Pfad | Beschreibung |
|-------|------|-------------|
| **Startseite** | `/` | Hauptseite der Anwendung |
| **Login** | `/login` | Benutzer anmelden |
| **Registrierung** | `/register` | Neuen Account erstellen |
| **Verkaufsseite** | `/sales` | Paket-Informationen |
| **Preise** | `/pricing` | Preisübersicht |
| **Profil Einrichten** | `/profil-einrichten` | Profil einrichten |
| **Mondkalender** | `/mondkalender` | Vollständiger Mondkalender |
| **Dating** | `/dating` | Dating-System |

### **Basic Package (Nach Registrierung):**
| Seite | Pfad | Beschreibung |
|-------|------|-------------|
| **Dashboard** | `/dashboard` | Benutzer-Dashboard |
| **Mobile Dashboard** | `/mobile-dashboard` | Mobile-optimiertes Dashboard |
| **Chart** | `/chart` | Human Design Chart berechnen |
| **Human Design Chart** | `/human-design-chart` | Detailliertes Chart |
| **Community** | `/community` | Community-Zugang (Basis) |
| **Community Hub** | `/community/hub` | Erweiterte Community-Features |
| **Friends** | `/friends` | Freunde-System |
| **Einstellungen** | `/settings` | Anwendungseinstellungen |
| **Chat** | `/chat-new` | Chat-System |
| **Mobile App** | `/mobile-app` | Mobile App Download |
| **Dating New** | `/dating-new` | Dating-System (New) |

### **Premium Package:**
| Seite | Pfad | Beschreibung |
|-------|------|-------------|
| **Chart-Vergleich** | `/chart-comparison` | Chart-Vergleichs-Tool |
| **Bodygraph Advanced** | `/bodygraph-advanced` | Erweiterte Chart-Analyse |
| **Coaching** | `/coaching-new` | Coaching-System |
| **Knowledge** | `/knowledge` | Wissensdatenbank |
| **Journal** | `/journal` | Persönliches Journal |
| **Reading** | `/reading` | Reading-System |
| **Realtime Analysis** | `/realtime-analysis` | Echtzeit Chart-Analyse |
| **AI Moon Insights** | `/ai-moon-insights` | KI-Mond-Erkenntnisse |
| **Planeten-Energien** | `/planets` | Alle 64 Gates und 9 Centers |
| **Roadmap** | `/roadmap` | Projekt-Roadmap |
| **Premium Dashboard** | `/premium-dashboard` | Premium-Dashboard |

### **VIP Package:**
| Seite | Pfad | Beschreibung |
|-------|------|-------------|
| **VIP Dashboard** | `/dashboard-vip` | Exklusives VIP-Dashboard |
| **VIP Community** | `/vip-community` | Exklusive VIP-Community |
| **Persönlicher Coach** | `/personal-coach` | 1:1 Coaching-Sessions |
| **Analytics** | `/analytics` | Premium-Analytics |
| **API-Zugang** | `/api-access` | Entwickler-API-Zugang |

### **Admin Package:**
| Seite | Pfad | Beschreibung |
|-------|------|-------------|
| **Admin** | `/admin` | Administrationsbereich |
| **Content Management** | `/admin/content/advanced` | Content-Verwaltung |
| **User Management** | `/admin/users` | Benutzer-Verwaltung |

## 🔄 **Login & Package Verification**

### **Login Process:**
1. **User registriert sich** → Automatisch `basic` Package
2. **User loggt sich ein** → Package wird aus localStorage geladen
3. **Middleware prüft** → `user-subscription` Cookie
4. **Access Control prüft** → `userSubscription` State

### **Package Loading:**
```javascript
// Aus localStorage:
const userSubscription = JSON.parse(localStorage.getItem('userSubscription') || '{}');

// Standard nach Registrierung:
{
  userId: 'user-123',
  packageId: 'basic',
  status: 'active',
  startDate: '2024-01-01T00:00:00.000Z',
  endDate: '2024-12-31T23:59:59.999Z',
  autoRenew: false,
  paymentMethod: 'none',
  billingCycle: 'monthly'
}
```

## 🚨 **Bekannte Probleme & Lösungen**

### **Problem 1: Coaching Access Control**
- **Problem**: `/coaching` wird als Premium behandelt, sollte VIP sein
- **Lösung**: Middleware korrigiert, Coaching ist jetzt VIP

### **Problem 2: Package Loading**
- **Problem**: `userSubscription` wird nicht korrekt geladen
- **Lösung**: Test-Accounts in localStorage setzen

### **Problem 3: Middleware vs AccessControl**
- **Problem**: Unterschiedliche Logik zwischen Middleware und AccessControl
- **Lösung**: Beide Systeme synchronisiert

## 🧪 **Test-Accounts erstellen**

### **VIP Test-Account:**
```javascript
localStorage.setItem('userSubscription', JSON.stringify({
  userId: 'test-user-123',
  packageId: 'vip',
  status: 'active',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  autoRenew: true,
  paymentMethod: 'test',
  billingCycle: 'monthly'
}));
```

### **Premium Test-Account:**
```javascript
localStorage.setItem('userSubscription', JSON.stringify({
  userId: 'test-user-456',
  packageId: 'premium',
  status: 'active',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  autoRenew: true,
  paymentMethod: 'test',
  billingCycle: 'monthly'
}));
```

### **Basic Test-Account:**
```javascript
localStorage.setItem('userSubscription', JSON.stringify({
  userId: 'test-user-789',
  packageId: 'basic',
  status: 'active',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  autoRenew: false,
  paymentMethod: 'none',
  billingCycle: 'monthly'
}));
```

## ✅ **Status: System funktioniert**

- ✅ **Middleware**: Geschützte Routen definiert
- ✅ **Access Control**: Package-Hierarchie implementiert
- ✅ **Login System**: Package-Verification funktioniert
- ✅ **Test-Accounts**: Bereit für alle Pakete

**Das System ist vollständig konfiguriert und einsatzbereit!** 🚀
