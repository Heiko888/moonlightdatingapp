import { SubscriptionPackage } from './types';

export const subscriptionPackages: SubscriptionPackage[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfekt für den Einstieg in Human Design',
    price: 'Kostenlos',
    priceMonthly: 0,
    priceYearly: 0,
    color: '#6b7280',
    icon: '⭐',
    features: [
      'Grundlegende Chart-Berechnung',
      'Vollständiger Mondkalender',
      'Community-Zugang (Basis)',
      'Basis-Matching (5 Matches/Tag)',
      'Standard-Support',
      'Mobile App Zugang'
    ],
    limitations: [
      'Begrenzte Chart-Details',
      'Keine erweiterten Analytics',
      'Keine VIP-Features',
      'Werbung in der App'
    ],
    maxCharts: 1,
    maxCoachingSessions: 0,
    maxDatingMatches: 5,
    hasAdvancedAnalytics: false,
    hasVIPCommunity: false,
    hasPersonalCoach: false,
    hasPrioritySupport: false,
    hasEarlyAccess: false
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Erweiterte Features für tieferes Verständnis',
    price: '19,99€/Monat',
    priceMonthly: 19.99,
    priceYearly: 199.99,
    color: '#8b5cf6',
    icon: '💎',
    features: [
      'Alle Basic-Features',
      'Erweiterte Chart-Analyse',
      'Erweiterte Matching-Algorithmen',
      'Coaching-Zugang (2 Sessions/Monat)',
      'Prioritäts-Support',
      'Werbefreie Erfahrung',
      'Erweiterte Analytics',
      'Export-Funktionen',
      'Chart-Vergleichs-Tool'
    ],
    limitations: [
      'Keine VIP-Exklusiv-Features',
      'Begrenzte API-Zugriffe',
      'Kein persönlicher Coach'
    ],
    maxCharts: 5,
    maxCoachingSessions: 2,
    maxDatingMatches: 50,
    hasAdvancedAnalytics: true,
    hasVIPCommunity: false,
    hasPersonalCoach: false,
    hasPrioritySupport: true,
    hasEarlyAccess: false
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'Das ultimative Human Design Erlebnis',
    price: '49,99€/Monat',
    priceMonthly: 49.99,
    priceYearly: 499.99,
    color: '#f59e0b',
    icon: '👑',
    features: [
      'Alle Premium-Features',
      'Exklusive VIP-Community',
      'Persönlicher Coach (unbegrenzt)',
      'Unbegrenzte API-Zugriffe',
      'Früher Zugang zu neuen Features',
      'Premium-Analytics & Insights',
      'Exklusive Events & Workshops',
      '1:1 Beratung',
      'White-Label Optionen',
      'API-Zugang für Entwickler'
    ],
    limitations: [],
    maxCharts: -1, // Unbegrenzt
    maxCoachingSessions: -1, // Unbegrenzt
    maxDatingMatches: -1, // Unbegrenzt
    hasAdvancedAnalytics: true,
    hasVIPCommunity: true,
    hasPersonalCoach: true,
    hasPrioritySupport: true,
    hasEarlyAccess: true
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Administrativer Zugang für Systemverwaltung',
    price: 'N/A',
    priceMonthly: 0,
    priceYearly: 0,
    color: '#dc2626',
    icon: '🔐',
    features: [
      'Vollständiger Systemzugang',
      'Benutzerverwaltung',
      'Datenbank-Management',
      'System-Monitoring',
      'Sicherheits-Logs',
      'Content-Management',
      'API-Verwaltung',
      'Backup & Export',
      'System-Einstellungen',
      'Aktivitäts-Logs'
    ],
    limitations: [],
    maxCharts: -1, // Unbegrenzt
    maxCoachingSessions: -1, // Unbegrenzt
    maxDatingMatches: -1, // Unbegrenzt
    hasAdvancedAnalytics: true,
    hasVIPCommunity: true,
    hasPersonalCoach: true,
    hasPrioritySupport: true,
    hasEarlyAccess: true
  }
];

export const getPackageById = (id: string): SubscriptionPackage | undefined => {
  return subscriptionPackages.find(pkg => pkg.id === id);
};

export const getPackagePrice = (packageId: string, yearly: boolean = false): number => {
  const pkg = getPackageById(packageId);
  if (!pkg) return 0;
  return yearly ? pkg.priceYearly : pkg.priceMonthly;
};
