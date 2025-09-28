/**
 * Paket-System für Human Design App
 * Definiert Zugriffsrechte basierend auf Benutzer-Abonnements
 */

export type UserPackage = 'free' | 'basic' | 'premium' | 'vip' | 'admin';

export interface UserSubscription {
  id: string;
  user_id: string;
  package: UserPackage;
  status: 'active' | 'inactive' | 'expired';
  expires_at: string;
  created_at: string;
}

export interface PageAccessConfig {
  path: string;
  requiredPackage: UserPackage;
  title: string;
  description: string;
  features: string[];
}

// Paket-Hierarchie (höhere Pakete haben Zugriff auf niedrigere)
const packageHierarchy: Record<UserPackage, number> = {
  'free': 0,
  'basic': 1,
  'premium': 2,
  'vip': 3,
  'admin': 4
};

// Seiten-Zugriffskonfiguration
export const pageAccessConfig: Record<string, PageAccessConfig> = {
  // Öffentliche Seiten (kein Login erforderlich)
  '/': {
    path: '/',
    requiredPackage: 'free',
    title: 'Startseite',
    description: 'Willkommen bei der Human Design App',
    features: ['Grundlegende Informationen', 'App-Übersicht']
  },
  '/login': {
    path: '/login',
    requiredPackage: 'free',
    title: 'Anmeldung',
    description: 'In dein Konto einloggen',
    features: ['Sichere Anmeldung', 'Token-basierte Authentifizierung']
  },
  '/register': {
    path: '/register',
    requiredPackage: 'free',
    title: 'Registrierung',
    description: 'Neues Konto erstellen',
    features: ['Kostenlose Registrierung', 'Sofortiger Zugriff']
  },
  '/sales': {
    path: '/sales',
    requiredPackage: 'free',
    title: 'Sales',
    description: 'App-Features entdecken',
    features: ['Feature-Übersicht', 'Pricing-Informationen']
  },
  '/pricing': {
    path: '/pricing',
    requiredPackage: 'free',
    title: 'Preise',
    description: 'Abonnement-Pläne',
    features: ['Preisvergleich', 'Paket-Details']
  },

  // Basic-Paket (kostenlos nach Registrierung)
  '/dashboard': {
    path: '/dashboard',
    requiredPackage: 'basic',
    title: 'Dashboard',
    description: 'Dein persönliches Dashboard',
    features: ['Persönliche Statistiken', 'Aktuelle Aktivitäten', 'Benachrichtigungen']
  },
  '/chart': {
    path: '/chart',
    requiredPackage: 'basic',
    title: 'Human Design Chart',
    description: 'Dein persönliches Human Design Chart',
    features: ['Chart-Berechnung', 'Grundlegende Analyse', 'Chart-Download']
  },
  '/profil-einrichten': {
    path: '/profil-einrichten',
    requiredPackage: 'basic',
    title: 'Profil einrichten',
    description: 'Dein Profil vervollständigen',
    features: ['Profil-Daten', 'Avatar-Upload', 'Präferenzen']
  },
  '/community': {
    path: '/community',
    requiredPackage: 'basic',
    title: 'Community',
    description: 'Mit der Community verbinden',
    features: ['Community-Posts', 'Gruppen', 'Events']
  },
  '/friends': {
    path: '/friends',
    requiredPackage: 'basic',
    title: 'Freunde',
    description: 'Freunde finden und verwalten',
    features: ['Freunde-Suche', 'Freundschaftsanfragen', 'Freunde-Liste']
  },
  '/settings': {
    path: '/settings',
    requiredPackage: 'basic',
    title: 'Einstellungen',
    description: 'App-Einstellungen verwalten',
    features: ['Profil-Einstellungen', 'Benachrichtigungen', 'Datenschutz']
  },
  '/dating': {
    path: '/dating',
    requiredPackage: 'basic',
    title: 'Dating',
    description: 'Liebe finden basierend auf Human Design',
    features: ['Matching-System', 'Kompatibilitäts-Analyse', 'Dating-Profil']
  },
  '/dating-new': {
    path: '/dating-new',
    requiredPackage: 'basic',
    title: 'Dating (Neu)',
    description: 'Erweiterte Dating-Features',
    features: ['Erweiterte Matches', 'Dating-Insights', 'Beziehungs-Analyse']
  },
  '/chat-new': {
    path: '/chat-new',
    requiredPackage: 'basic',
    title: 'Chat',
    description: 'Mit Matches und Freunden chatten',
    features: ['Echtzeit-Chat', 'Nachrichten', 'Gruppen-Chat']
  },

  // Premium-Paket (Bezahlpaket)
  '/mondkalender': {
    path: '/mondkalender',
    requiredPackage: 'premium',
    title: 'Mondkalender',
    description: 'Mondphasen und kosmische Energie verfolgen',
    features: ['Mondphasen-Tracking', 'Energie-Monitoring', 'Persönliche Insights']
  },
  '/chart-comparison': {
    path: '/chart-comparison',
    requiredPackage: 'premium',
    title: 'Chart-Vergleich',
    description: 'Human Design Charts vergleichen',
    features: ['Chart-Vergleich', 'Kompatibilitäts-Analyse', 'Beziehungs-Insights']
  },
  '/bodygraph-advanced': {
    path: '/bodygraph-advanced',
    requiredPackage: 'premium',
    title: 'Erweiterte Bodygraph-Analyse',
    description: 'Tiefe Human Design Analyse',
    features: ['Erweiterte Analyse', 'Detaillierte Insights', 'Professionelle Beratung']
  },
  '/coaching-new': {
    path: '/coaching-new',
    requiredPackage: 'premium',
    title: 'Coaching',
    description: 'Professionelles Human Design Coaching',
    features: ['1:1 Coaching', 'Gruppen-Coaching', 'Persönliche Beratung']
  },
  '/knowledge': {
    path: '/knowledge',
    requiredPackage: 'premium',
    title: 'Wissensdatenbank',
    description: 'Umfassende Human Design Wissensdatenbank',
    features: ['Artikel', 'Videos', 'Ressourcen', 'Lernpfade']
  },
  '/journal': {
    path: '/journal',
    requiredPackage: 'premium',
    title: 'Journal',
    description: 'Persönliches Journal für deine Reise',
    features: ['Tagebuch', 'Reflexionen', 'Fortschritt verfolgen']
  },
  '/reading': {
    path: '/reading',
    requiredPackage: 'premium',
    title: 'Reading',
    description: 'Professionelle Human Design Readings',
    features: ['Persönliche Readings', 'Detaillierte Analysen', 'Beratung']
  },

  // VIP-Paket (Premium-Paket)
  '/dashboard-vip': {
    path: '/dashboard-vip',
    requiredPackage: 'vip',
    title: 'VIP Dashboard',
    description: 'Exklusives VIP Dashboard',
    features: ['Erweiterte Analytics', 'Premium-Insights', 'Exklusive Features']
  },
  '/vip-community': {
    path: '/vip-community',
    requiredPackage: 'vip',
    title: 'VIP Community',
    description: 'Exklusive VIP Community',
    features: ['VIP-Gruppen', 'Exklusive Events', 'Premium-Netzwerk']
  },
  '/personal-coach': {
    path: '/personal-coach',
    requiredPackage: 'vip',
    title: 'Persönlicher Coach',
    description: 'Dein persönlicher Human Design Coach',
    features: ['1:1 Coaching', 'Persönliche Betreuung', 'Maßgeschneiderte Beratung']
  },
  '/analytics': {
    path: '/analytics',
    requiredPackage: 'vip',
    title: 'Analytics',
    description: 'Detaillierte Analytics und Insights',
    features: ['Fortschritts-Analyse', 'Trends', 'Persönliche Insights']
  },
  '/api-access': {
    path: '/api-access',
    requiredPackage: 'vip',
    title: 'API-Zugriff',
    description: 'Zugriff auf die Human Design API',
    features: ['API-Dokumentation', 'Entwickler-Tools', 'Integration']
  },

  // Admin-Bereich
  '/admin': {
    path: '/admin',
    requiredPackage: 'admin',
    title: 'Admin Dashboard',
    description: 'Administrationsbereich',
    features: ['Benutzerverwaltung', 'System-Übersicht', 'Admin-Tools']
  },
  '/admin/users': {
    path: '/admin/users',
    requiredPackage: 'admin',
    title: 'Benutzerverwaltung',
    description: 'Benutzer verwalten',
    features: ['Benutzer-Liste', 'Rollen verwalten', 'Berechtigungen']
  },
  '/admin/coaching': {
    path: '/admin/coaching',
    requiredPackage: 'admin',
    title: 'Coaching-Verwaltung',
    description: 'Coaching-Sessions verwalten',
    features: ['Session-Übersicht', 'Coach-Verwaltung', 'Termine']
  }
};

/**
 * Prüft, ob ein Benutzer Zugriff auf eine Seite hat
 */
export function hasAccess(userPackage: UserPackage, requiredPackage: UserPackage): boolean {
  return packageHierarchy[userPackage] >= packageHierarchy[requiredPackage];
}

/**
 * Prüft den Seitenzugriff basierend auf Pfad und Benutzer-Abonnement
 */
export function checkPageAccess(path: string, userSubscription: UserSubscription | null): boolean {
  const pageConfig = pageAccessConfig[path];
  if (!pageConfig) return true; // Unbekannte Seiten sind standardmäßig zugänglich
  
  if (pageConfig.requiredPackage === 'free') return true;
  if (!userSubscription) return false;
  
  return hasAccess(userSubscription.package, pageConfig.requiredPackage);
}

/**
 * Gibt alle verfügbaren Seiten für ein Paket zurück
 */
export function getAvailablePages(userPackage: UserPackage): PageAccessConfig[] {
  return Object.values(pageAccessConfig).filter(page => 
    hasAccess(userPackage, page.requiredPackage)
  );
}

/**
 * Gibt die Paket-Features zurück
 */
export function getPackageFeatures(userPackage: UserPackage): string[] {
  const features: Record<UserPackage, string[]> = {
    'free': [
      'App-Übersicht',
      'Grundlegende Informationen',
      'Registrierung'
    ],
    'basic': [
      'Persönliches Dashboard',
      'Human Design Chart',
      'Community-Zugriff',
      'Dating-System',
      'Chat-Funktionen',
      'Freunde-System'
    ],
    'premium': [
      'Alle Basic-Features',
      'Mondkalender',
      'Chart-Vergleich',
      'Erweiterte Bodygraph-Analyse',
      'Coaching-Sessions',
      'Wissensdatenbank',
      'Journal',
      'Professionelle Readings'
    ],
    'vip': [
      'Alle Premium-Features',
      'VIP Dashboard',
      'Exklusive Community',
      'Persönlicher Coach',
      'Analytics',
      'API-Zugriff'
    ],
    'admin': [
      'Alle VIP-Features',
      'Admin-Dashboard',
      'Benutzerverwaltung',
      'System-Administration'
    ]
  };

  return features[userPackage] || [];
}

/**
 * Gibt die Paket-Hierarchie zurück
 */
export function getPackageHierarchy(): Record<UserPackage, number> {
  return { ...packageHierarchy };
}

/**
 * Prüft, ob ein Paket-Upgrade möglich ist
 */
export function canUpgrade(currentPackage: UserPackage, targetPackage: UserPackage): boolean {
  return packageHierarchy[targetPackage] > packageHierarchy[currentPackage];
}

/**
 * Gibt das nächste höhere Paket zurück
 */
export function getNextPackage(currentPackage: UserPackage): UserPackage | null {
  const hierarchy = Object.entries(packageHierarchy)
    .sort(([,a], [,b]) => a - b);
  
  const currentIndex = hierarchy.findIndex(([pkg]) => pkg === currentPackage);
  if (currentIndex < hierarchy.length - 1) {
    return hierarchy[currentIndex + 1][0] as UserPackage;
  }
  
  return null;
}
