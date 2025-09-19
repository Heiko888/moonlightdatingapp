import { PageAccess, AccessControl, UserSubscription } from './types';

export const pageAccessConfig: PageAccess[] = [
  // Öffentliche Seiten (kein Login erforderlich)
  { path: '/', name: 'Startseite', requiredPackage: 'free', description: 'Hauptseite der Anwendung', category: 'Öffentlich' },
  { path: '/login', name: 'Login', requiredPackage: 'free', description: 'Benutzer anmelden', category: 'Öffentlich' },
  { path: '/register', name: 'Registrierung', requiredPackage: 'free', description: 'Neuen Account erstellen', category: 'Öffentlich' },
  { path: '/sales', name: 'Verkaufsseite', requiredPackage: 'free', description: 'Paket-Informationen', category: 'Öffentlich' },
  { path: '/pricing', name: 'Preise', requiredPackage: 'free', description: 'Preisübersicht', category: 'Öffentlich' },

  // Basic-Paket (kostenlos nach Registrierung) - für Basic und höher
  { path: '/dashboard', name: 'Dashboard', requiredPackage: 'basic', description: 'Benutzer-Dashboard', category: 'Basic' },
  { path: '/mobile-dashboard', name: 'Mobile Dashboard', requiredPackage: 'basic', description: 'Mobile-optimiertes Dashboard', category: 'Basic' },
  { path: '/chart', name: 'Chart', requiredPackage: 'basic', description: 'Human Design Chart berechnen', category: 'Basic' },
  { path: '/human-design-chart', name: 'Human Design Chart', requiredPackage: 'basic', description: 'Detailliertes Human Design Chart', category: 'Basic' },
  { path: '/profil-einrichten', name: 'Profil Einrichten', requiredPackage: 'free', description: 'Profil einrichten', category: 'Öffentlich' },
  { path: '/community', name: 'Community', requiredPackage: 'basic', description: 'Community-Zugang (Basis)', category: 'Basic' },
  { path: '/community/hub', name: 'Community Hub', requiredPackage: 'basic', description: 'Community Hub - Erweiterte Community-Features', category: 'Basic' },
  { path: '/friends', name: 'Friends', requiredPackage: 'basic', description: 'Freunde-System', category: 'Basic' },
  { path: '/settings', name: 'Einstellungen', requiredPackage: 'basic', description: 'Anwendungseinstellungen', category: 'Basic' },

  // Basic-Paket (kostenlos nach Registrierung)
  { path: '/mondkalender', name: 'Mondkalender', requiredPackage: 'basic', description: 'Vollständiger Mondkalender', category: 'Basic' },
  { path: '/chart-comparison', name: 'Chart-Vergleich', requiredPackage: 'premium', description: 'Chart-Vergleichs-Tool', category: 'Premium' },
  { path: '/bodygraph-advanced', name: 'Bodygraph Advanced', requiredPackage: 'premium', description: 'Erweiterte Chart-Analyse', category: 'Premium' },
  { path: '/coaching-new', name: 'Coaching', requiredPackage: 'premium', description: 'Coaching-System', category: 'Premium' },
  { path: '/coaching/britta/reiki', name: 'Reiki-Sessions', requiredPackage: 'premium', description: 'Reiki-Behandlungen und Einweihungen', category: 'Premium' },
  { path: '/dating', name: 'Dating', requiredPackage: 'free', description: 'Dating-System', category: 'Öffentlich' },
  { path: '/dating-new', name: 'Dating New', requiredPackage: 'basic', description: 'Dating-System (New)', category: 'Basic' },
  { path: '/knowledge', name: 'Knowledge', requiredPackage: 'premium', description: 'Wissensdatenbank', category: 'Premium' },
  { path: '/journal', name: 'Journal', requiredPackage: 'premium', description: 'Persönliches Journal', category: 'Premium' },
  { path: '/reading', name: 'Reading', requiredPackage: 'premium', description: 'Reading-System', category: 'Premium' },
  { path: '/realtime-analysis', name: 'Realtime Analysis', requiredPackage: 'premium', description: 'Echtzeit Chart-Analyse', category: 'Premium' },
  { path: '/ai-moon-insights', name: 'AI Moon Insights', requiredPackage: 'premium', description: 'KI-Mond-Erkenntnisse', category: 'Premium' },
  { path: '/planets', name: 'Planeten-Energien', requiredPackage: 'premium', description: 'Alle 64 Gates und 9 Centers erkunden', category: 'Premium' },
  { path: '/roadmap', name: 'Roadmap', requiredPackage: 'premium', description: 'Projekt-Roadmap', category: 'Premium' },
  { path: '/premium-dashboard', name: 'Premium Dashboard', requiredPackage: 'premium', description: 'Premium-Dashboard', category: 'Premium' },
  { path: '/chat-new', name: 'Chat', requiredPackage: 'basic', description: 'Chat-System', category: 'Basic' },

  // VIP-Paket erforderlich
  { path: '/dashboard-vip', name: 'VIP Dashboard', requiredPackage: 'vip', description: 'Exklusives VIP-Dashboard', category: 'VIP' },
  { path: '/vip-community', name: 'VIP Community', requiredPackage: 'vip', description: 'Exklusive VIP-Community', category: 'VIP' },
  { path: '/personal-coach', name: 'Persönlicher Coach', requiredPackage: 'vip', description: '1:1 Coaching-Sessions', category: 'VIP' },
  { path: '/analytics', name: 'Analytics', requiredPackage: 'vip', description: 'Premium-Analytics', category: 'VIP' },
  { path: '/api-access', name: 'API-Zugang', requiredPackage: 'vip', description: 'Entwickler-API-Zugang', category: 'VIP' },

  // Admin-Bereich (separate Berechtigung - NICHT VIP)
  { path: '/admin', name: 'Admin', requiredPackage: 'admin', description: 'Administrationsbereich', category: 'Admin' },
  { path: '/admin/content/advanced', name: 'Content Management', requiredPackage: 'admin', description: 'Content-Verwaltung', category: 'Admin' },
  { path: '/admin/users', name: 'User Management', requiredPackage: 'admin', description: 'Benutzer-Verwaltung', category: 'Admin' }
];

export const checkPageAccess = (
  path: string, 
  userSubscription: UserSubscription | null
): AccessControl => {
  // Normalisiere den Pfad (entferne trailing slash)
  if (!path) {
    return {
      canAccess: false,
      requiredPackage: 'free',
      currentPackage: userSubscription?.packageId || 'none',
      upgradeRequired: true,
      message: 'Ungültiger Pfad'
    };
  }
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  const pageConfig = pageAccessConfig.find(page => page.path === normalizedPath);
  
  // Debug-Logs entfernt für bessere Performance
  
  if (!pageConfig) {
    return {
      canAccess: false,
      requiredPackage: 'unknown',
      currentPackage: userSubscription?.packageId || 'none',
      upgradeRequired: true,
      message: 'Seite nicht gefunden'
    };
  }

  // Öffentliche Seiten sind immer zugänglich
  if (pageConfig.requiredPackage === 'free') {
    return {
      canAccess: true,
      requiredPackage: 'free',
      currentPackage: userSubscription?.packageId || 'none',
      upgradeRequired: false,
      message: 'Öffentlich zugänglich'
    };
  }

  // Kein Login = kein Zugang zu geschützten Seiten
  if (!userSubscription) {
    return {
      canAccess: false,
      requiredPackage: pageConfig.requiredPackage,
      currentPackage: 'none',
      upgradeRequired: true,
      message: 'Bitte melden Sie sich an'
    };
  }

  // Prüfe Paket-Berechtigung
  const packageHierarchy = ['free', 'basic', 'premium', 'vip', 'admin'];
  const currentLevel = packageHierarchy.indexOf(userSubscription.packageId);
  const requiredLevel = packageHierarchy.indexOf(pageConfig.requiredPackage);

  // Package Hierarchy Debug entfernt

  // Wenn exactPackage true ist, nur exakt dieses Paket erlauben
  if (pageConfig.exactPackage) {
    if (userSubscription.packageId === pageConfig.requiredPackage) {
      return {
        canAccess: true,
        requiredPackage: pageConfig.requiredPackage,
        currentPackage: userSubscription.packageId,
        upgradeRequired: false,
        message: 'Zugang gewährt'
      };
    } else {
      return {
        canAccess: false,
        requiredPackage: pageConfig.requiredPackage,
        currentPackage: userSubscription.packageId,
        upgradeRequired: true,
        message: `Diese Seite ist nur für ${pageConfig.requiredPackage} Benutzer verfügbar`
      };
    }
  }

  // Normale Hierarchie-Prüfung für andere Seiten
  if (currentLevel >= requiredLevel) {
    return {
      canAccess: true,
      requiredPackage: pageConfig.requiredPackage,
      currentPackage: userSubscription.packageId,
      upgradeRequired: false,
      message: 'Zugang gewährt'
    };
  } else {
    return {
      canAccess: false,
      requiredPackage: pageConfig.requiredPackage,
      currentPackage: userSubscription.packageId,
      upgradeRequired: true,
      message: `Upgrade auf ${pageConfig.requiredPackage} erforderlich`
    };
  }
};

export const getAccessiblePages = (userSubscription: UserSubscription | null): PageAccess[] => {
  return pageAccessConfig.filter(page => {
    const access = checkPageAccess(page.path, userSubscription);
    return access.canAccess;
  });
};

export const getUpgradeOptions = (currentPackage: string): string[] => {
  const packageHierarchy = ['free', 'basic', 'premium', 'vip'];
  const currentLevel = packageHierarchy.indexOf(currentPackage);
  
  if (currentLevel === -1 || currentLevel === packageHierarchy.length - 1) {
    return []; // Kein Upgrade möglich
  }
  
  return packageHierarchy.slice(currentLevel + 1);
};
