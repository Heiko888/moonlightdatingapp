"use client";
import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion'; // Temporarily disabled due to webpack issues
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Sparkles, 
  Heart, 
  Users, 
  BookOpen, 
  BarChart3, 
  Crown, 
  TrendingUp,
  Globe,
  Brain,
  Server,
  Code,
  Settings,
  User,
  Home,
  Folder,
  ExternalLink,
  Monitor,
  Smartphone,
  Cloud,
} from 'lucide-react';
import Link from 'next/link';

// TypeScript Interfaces
interface Page {
  name: string;
  path: string;
  description: string;
  requiredPackage?: string;
}

interface Category {
  category: string;
  icon: React.ReactElement;
  requiredPackage?: string;
  pages: Page[];
}

function SeitenanzeigePage() {
  // Benutzerrechte und Menü-Konfiguration
  const [userPackage, setUserPackage] = useState('free');
  const [showAllPages, setShowAllPages] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lade Benutzerpaket aus localStorage oder API
    const storedPackage = localStorage.getItem('userPackage') || 'free';
    setUserPackage(storedPackage);
    // Stelle sicher, dass der erste Tab ausgewählt ist
    setSelectedTab(0);
  }, []);

  // Paket-Hierarchie für Zugriffsrechte
  const packageHierarchy: Record<string, number> = {
    'free': 0,
    'basic': 1,
    'premium': 2,
    'vip': 3,
    'admin': 4
  };

  // Prüfe ob Benutzer Zugriff auf eine Seite hat
  const hasAccess = (requiredPackage: string) => {
    if (showAllPages) return true;
    return packageHierarchy[userPackage] >= packageHierarchy[requiredPackage];
  };

  // Kategorien mit Zugriffsrechten
  const frontendPages: Category[] = [
    {
      category: "Öffentliche Seiten",
      icon: <Globe size={20} />,
      requiredPackage: 'free',
      pages: [
        { name: "Startseite", path: "/", description: "Hauptseite der Anwendung", requiredPackage: 'free' },
        { name: "Chart", path: "/chart", description: "Human Design Chart berechnen", requiredPackage: 'free' },
        { name: "Mondkalender", path: "/mondkalender", description: "Mondphasen und Tracking", requiredPackage: 'free' },
        { name: "Mondkalender Info", path: "/mondkalender-info", description: "Alle Mondkalender-Funktionen erklärt", requiredPackage: 'free' },
        { name: "Sales", path: "/sales", description: "Verkaufsseite", requiredPackage: 'free' },
        { name: "Admin Public", path: "/admin-public", description: "Öffentliche Admin-Übersicht", requiredPackage: 'free' },
        { name: "Seitenanzeige", path: "/seitenanzeige", description: "Übersicht aller verfügbaren Seiten", requiredPackage: 'free' }
      ]
    },
    {
      category: "Hauptseiten",
      icon: <Home size={20} />,
      requiredPackage: 'basic',
      pages: [
        { name: "Dashboard", path: "/dashboard", description: "Benutzer-Dashboard", requiredPackage: 'basic' },
        { name: "Premium Dashboard", path: "/premium-dashboard", description: "Premium Benutzer-Dashboard", requiredPackage: 'premium' }
      ]
    },
    {
      category: 'Human Design',
      icon: <Brain size={20} />,
      requiredPackage: 'free',
      pages: [
        { name: "Chart Info", path: "/chart-info", description: "Informationen zum Chart", requiredPackage: 'free' },
        { name: "Human Design Info", path: "/human-design-info", description: "Umfassende Human Design Grundlagen", requiredPackage: 'free' },
        { name: "Upgrade", path: "/upgrade", description: "Premium-Pläne und Upgrades", requiredPackage: 'free' },
        { name: "Human Design Chart", path: "/human-design-chart", description: "Detaillierte Chart-Ansicht", requiredPackage: 'free' },
        { name: "Authority", path: "/authority", description: "Autorität-Informationen", requiredPackage: 'free' },
        { name: "Centers", path: "/centers", description: "Zentren-Übersicht", requiredPackage: 'free' },
        { name: "Channels", path: "/channels", description: "Kanäle-Übersicht", requiredPackage: 'free' },
        { name: "Gates", path: "/gates", description: "Tore-Übersicht", requiredPackage: 'free' },
        { name: "Lines", path: "/lines", description: "Linien-Übersicht", requiredPackage: 'free' },
        { name: "Profiles", path: "/profiles", description: "Profile-Übersicht", requiredPackage: 'free' },
        { name: "Grundlagen HD", path: "/grundlagen-hd", description: "HD-Grundlagen Übersicht", requiredPackage: 'free' }
      ]
    },
    {
      category: 'Coaching',
      icon: <Users size={20} />,
      requiredPackage: 'basic',
      pages: [
        { name: "Coaching", path: "/coaching", description: "Coaching-Übersicht", requiredPackage: 'basic' },
        { name: "Info Hub", path: "/info-hub", description: "Alle Informationsseiten im Überblick", requiredPackage: 'free' },
        { name: "Coaching Info", path: "/coaching-info", description: "Coaching-Informationen", requiredPackage: 'free' },
        // Britta-Seite entfernt
        { name: "Elisabeth", path: "/coaching/elisabeth", description: "Coach Elisabeth", requiredPackage: 'basic' },
        { name: "Heiko", path: "/coaching/heiko", description: "Coach Heiko", requiredPackage: 'basic' },
        { name: "Janine", path: "/coaching/janine", description: "Coach Janine", requiredPackage: 'basic' },
        { name: "Louisa", path: "/coaching/louisa", description: "Coach Louisa", requiredPackage: 'basic' }
      ]
    },
    {
      category: 'Dating & Matching',
      icon: <Heart size={20} />,
      requiredPackage: 'basic',
      pages: [
        { name: "Dating", path: "/dating", description: "Dating-Übersicht (Basic) - Emotionale Landingpage", requiredPackage: 'free' },
        { name: "Dating Info", path: "/dating-info", description: "Dating-Informationen (→ /dating)", requiredPackage: 'free' },
        { name: "Match Tipps", path: "/dating/match-tips", description: "Personalisierte Dating-Tipps und Orte", requiredPackage: 'basic' },
        { name: "Swipe", path: "/swipe", description: "Swipe-Funktion", requiredPackage: 'basic' },
        { name: "Matching", path: "/matching", description: "Matching-System", requiredPackage: 'basic' },
        { name: "Generator", path: "/dating/generator", description: "Dating-Generator", requiredPackage: 'basic' },
        { name: "Manifestor", path: "/dating/manifestor", description: "Manifestor-Dating", requiredPackage: 'basic' },
        { name: "Projector", path: "/dating/projector", description: "Projector-Dating", requiredPackage: 'basic' },
        { name: "Reflector", path: "/dating/reflector", description: "Reflector-Dating", requiredPackage: 'basic' }
      ]
    },
    {
      category: 'Wissen & Journal',
      icon: <BookOpen size={20} />,
      requiredPackage: 'free',
      pages: [
        { name: "Knowledge", path: "/knowledge", description: "Wissensdatenbank" },
        { name: "Knowledge AI", path: "/knowledge-ai", description: "KI-Wissensassistent" },
        { name: "Journal", path: "/journal", description: "Persönliches Journal" },
        { name: "Journal Info", path: "/journal-info", description: "Journal-Informationen" },
        { name: "Reading", path: "/reading", description: "Reading-System (Baukasten)" },
        { name: "Reading Info", path: "/reading-info", description: "Reading-Informationen" }
      ]
    },
    {
      category: 'Community & Social',
      icon: <Users size={20} />,
      requiredPackage: 'basic',
      pages: [
        { name: "Community", path: "/community", description: "Friends-Community System" },
        { name: "Community Hub", path: "/community/hub", description: "Community-Übersicht" },
        { name: "Community Info", path: "/community-info", description: "Alle Community-Funktionen erklärt", requiredPackage: 'free' },
        { name: "KPI Dashboard", path: "/kpi-dashboard", description: "Community Analytics & Performance Metrics", requiredPackage: 'premium' },
        { name: "Admin KPI Panel", path: "/admin/kpi", description: "KPI-Verwaltung, Ziele und Einstellungen", requiredPackage: 'admin' }
      ]
    },
    {
      category: 'Profil & Einstellungen',
      icon: <User size={20} />,
      requiredPackage: 'free',
      pages: [
        { name: "Profil", path: "/profil", description: "Benutzerprofil" },
        { name: "Profil Einrichten", path: "/profil-einrichten", description: "Profil einrichten" },
        { name: "Profil Bearbeiten", path: "/profil/edit", description: "Profil bearbeiten" },
        { name: "Settings", path: "/settings", description: "Anwendungseinstellungen" }
      ]
    },
    {
      category: 'Admin (Separater Zugang)',
      icon: <Settings size={20} />,
      requiredPackage: 'admin',
      pages: [
        { name: "Admin", path: "/admin", description: "Admin-Dashboard" },
        { name: "Admin Dashboard", path: "/admin/dashboard", description: "Admin-Dashboard" },
        { name: "Admin Users", path: "/admin/users", description: "Benutzerverwaltung" },
        { name: "Admin Readings", path: "/admin/readings", description: "Reading-Management für Coach" },
        { name: "Admin Upload", path: "/admin/upload", description: "Datei-Upload" },
        { name: "Admin Uploads", path: "/admin/uploads", description: "Upload-Verwaltung" }
      ]
    },
    {
      category: 'Verkauf & Preise',
      icon: <TrendingUp size={20} />,
      requiredPackage: 'free',
      pages: [
        { name: "Pricing", path: "/pricing", description: "Preisübersicht" },
        { name: "Sales Dating", path: "/sales/dating", description: "Dating-Verkauf" },
        { name: "Sales Generator", path: "/sales/generator", description: "Generator-Verkauf" },
        { name: "Sales Manifestor", path: "/sales/manifestor", description: "Manifestor-Verkauf" },
        { name: "Sales Projector", path: "/sales/projector", description: "Projector-Verkauf" },
        { name: "Sales Reflector", path: "/sales/reflector", description: "Reflector-Verkauf" }
      ]
    },
    {
      category: 'Test & Demo',
      icon: <Code size={20} />,
      requiredPackage: 'admin',
      pages: [
        { name: "Demo", path: "/demo", description: "Demo-Seite" },
        { name: "Test", path: "/test", description: "Test-Seite" },
        { name: "Data Persistence Demo", path: "/data-persistence-demo", description: "Datenpersistierung Demo" },
        { name: "Chart Comparison", path: "/chart-comparison", description: "Chart-Vergleich" },
        { name: "Chat", path: "/chat-new", description: "Chat-System" }
      ]
    },
    {
      category: 'Erweiterte Features',
      icon: <Sparkles size={20} />,
      requiredPackage: 'premium',
      pages: [
        { name: "Realtime Analysis", path: "/realtime-analysis", description: "Echtzeit-Analyse mit WebSocket" },
        { name: "Realtime Analysis Demo", path: "/realtime-analysis-demo", description: "Demo der Echtzeit-Analyse" },
        { name: "Analytics Dashboard", path: "/analytics", description: "Detaillierte Analytics" },
        { name: "Gamification", path: "/gamification", description: "Gamification-System" },
        { name: "Live Events", path: "/live-events", description: "Live-Events System" },
        { name: "Dating Impulse", path: "/dating-impulse", description: "Dating-Impulse Generator" },
        { name: "Moon Dating", path: "/moon-dating", description: "Mond-basiertes Dating" },
        { name: "Roadmap", path: "/roadmap", description: "Projekt-Roadmap" }
      ]
    },
    {
      category: 'KI & AI Features',
      icon: <Brain size={20} />,
      requiredPackage: 'premium',
      pages: [
        { name: "AI Chart Analysis", path: "/ai-chart-analysis", description: "KI-basierte Chart-Analyse" },
        { name: "AI Compatibility", path: "/ai-compatibility", description: "KI-Kompatibilitäts-Analyse" },
        { name: "AI Reading Generator", path: "/ai-reading-generator", description: "KI-Reading-Generator" },
        { name: "AI Coaching Assistant", path: "/ai-coaching-assistant", description: "KI-Coaching-Assistent" },
        { name: "AI Relationship Advisor", path: "/ai-relationship-advisor", description: "KI-Beziehungsberater" },
        { name: "AI Life Guidance", path: "/ai-life-guidance", description: "KI-Lebensberatung" },
        { name: "AI Moon Insights", path: "/ai-moon-insights", description: "KI-Mond-Erkenntnisse" },
        { name: "AI Personal Growth", path: "/ai-personal-growth", description: "KI-Persönlichkeitsentwicklung" }
      ]
    },
    {
      category: 'Premium Features',
      icon: <Crown size={20} />,
      requiredPackage: 'premium',
      pages: [
        { name: "Premium Dashboard", path: "/premium-dashboard", description: "Premium-Benutzer-Dashboard", requiredPackage: 'premium' },
        { name: "Dashboard VIP", path: "/dashboard-vip", description: "VIP-Dashboard mit erweiterten Features", requiredPackage: 'vip' },
        { name: "Advanced Chart Editor", path: "/chart-editor", description: "Erweiterter Chart-Editor", requiredPackage: 'premium' },
        { name: "Custom Readings", path: "/custom-readings", description: "Individuelle Readings", requiredPackage: 'premium' },
        { name: "Personal Coach", path: "/personal-coach", description: "Persönlicher Coach", requiredPackage: 'vip' },
        { name: "VIP Community", path: "/vip-community", description: "VIP-Community Zugang", requiredPackage: 'vip' },
        { name: "API Access", path: "/api-access", description: "Entwickler-API-Zugang", requiredPackage: 'vip' },
        { name: "Exclusive Events", path: "/exclusive-events", description: "Exklusive Events", requiredPackage: 'vip' },
        { name: "Priority Support", path: "/priority-support", description: "Prioritäts-Support", requiredPackage: 'vip' },
        { name: "Advanced Analytics", path: "/advanced-analytics", description: "Erweiterte Analytics", requiredPackage: 'vip' }
      ]
    },
    {
      category: 'Mobile & Apps',
      icon: <Smartphone size={20} />,
      requiredPackage: 'vip',
      pages: [
        { name: "Mobile App", path: "/mobile-app", description: "Mobile App Download" },
        { name: "PWA Install", path: "/pwa-install", description: "Progressive Web App" },
        { name: "Mobile Dashboard", path: "/mobile-dashboard", description: "Mobile-optimiertes Dashboard" },
        { name: "Offline Mode", path: "/offline-mode", description: "Offline-Modus" },
        { name: "Push Notifications", path: "/push-notifications", description: "Push-Benachrichtigungen" },
        { name: "Mobile Sync", path: "/mobile-sync", description: "Mobile Synchronisation" }
      ]
    },
    {
      category: 'Integration & APIs',
      icon: <Cloud size={20} />,
      requiredPackage: 'vip',
      pages: [
        { name: "API Documentation", path: "/api-docs", description: "API-Dokumentation", requiredPackage: 'vip' },
        { name: "Webhook Settings", path: "/webhook-settings", description: "Webhook-Konfiguration", requiredPackage: 'vip' },
        { name: "Third Party Apps", path: "/third-party-apps", description: "Drittanbieter-Apps", requiredPackage: 'vip' },
        { name: "Calendar Integration", path: "/calendar-integration", description: "Kalender-Integration", requiredPackage: 'vip' },
        { name: "Social Media Sync", path: "/social-media-sync", description: "Social Media Sync", requiredPackage: 'vip' },
        { name: "Data Export", path: "/data-export", description: "Daten-Export", requiredPackage: 'vip' },
        { name: "Backup & Restore", path: "/backup-restore", description: "Backup & Wiederherstellung", requiredPackage: 'vip' }
      ]
    },
    {
      category: 'Wellness & Lifestyle',
      icon: <Heart size={20} />,
      requiredPackage: 'basic',
      pages: [
        { name: "Wellness Tracker", path: "/wellness-tracker", description: "Wellness-Tracking" },
        { name: "Meditation Guide", path: "/meditation-guide", description: "Meditations-Anleitung" },
        { name: "Sleep Tracker", path: "/sleep-tracker", description: "Schlaf-Tracking" },
        { name: "Energy Tracker", path: "/energy-tracker", description: "Energie-Tracking" },
        { name: "Mood Journal", path: "/mood-journal", description: "Stimmungs-Tagebuch" },
        { name: "Habit Tracker", path: "/habit-tracker", description: "Gewohnheits-Tracker" },
        { name: "Goal Setting", path: "/goal-setting", description: "Zielsetzung" },
        { name: "Life Balance", path: "/life-balance", description: "Lebens-Balance" }
      ]
    },
    {
      category: 'Education & Learning',
      icon: <BookOpen size={20} />,
      requiredPackage: 'premium',
      pages: [
        { name: "HD Academy", path: "/hd-academy", description: "Human Design Akademie" },
        { name: "Video Courses", path: "/video-courses", description: "Video-Kurse" },
        { name: "Interactive Lessons", path: "/interactive-lessons", description: "Interaktive Lektionen" },
        { name: "Certification", path: "/certification", description: "Zertifizierung" },
        { name: "Study Groups", path: "/study-groups", description: "Lerngruppen" },
        { name: "Quiz & Tests", path: "/quiz-tests", description: "Quiz & Tests" },
        { name: "Progress Tracking", path: "/progress-tracking", description: "Fortschritts-Tracking" },
        { name: "Learning Path", path: "/learning-path", description: "Lernpfad" }
      ]
    },
    {
      category: 'HD Academy - Planeten',
      icon: <Globe size={20} />,
      requiredPackage: 'premium',
      pages: [
        { name: "Planeten Übersicht", path: "/planets", description: "Alle Planeten im Human Design" },
        { name: "Sonne", path: "/planets/sun", description: "Die Sonne im Human Design" },
        { name: "Mond", path: "/planets/moon", description: "Der Mond im Human Design" },
        { name: "Merkur", path: "/planets/mercury", description: "Merkur im Human Design" },
        { name: "Venus", path: "/planets/venus", description: "Venus im Human Design" },
        { name: "Mars", path: "/planets/mars", description: "Mars im Human Design" },
        { name: "Jupiter", path: "/planets/jupiter", description: "Jupiter im Human Design" },
        { name: "Saturn", path: "/planets/saturn", description: "Saturn im Human Design" },
        { name: "Uranus", path: "/planets/uranus", description: "Uranus im Human Design" },
        { name: "Neptun", path: "/planets/neptune", description: "Neptun im Human Design" },
        { name: "Pluto", path: "/planets/pluto", description: "Pluto im Human Design" },
        { name: "Chiron", path: "/chiron", description: "Chiron - Der verwundete Heiler" },
        { name: "Lilith", path: "/lilith", description: "Lilith - Die Wilde Frau" }
      ]
    }
  ];

  // Filtere nur öffentliche Seiten
  const getPublicPages = () => {
    const publicCategory = frontendPages.find(cat => cat.category === "Öffentliche Seiten");
    return publicCategory?.pages || [];
  };

  const backendRoutes = [
    {
      category: "Backend APIs",
      icon: <BarChart3 size={20} />,
      routes: [
        { name: "Charts", path: "/api/charts", description: "Chart-Daten" },
        { name: "Chart Calculation", path: "/api/chart-calculation", description: "Chart-Berechnung" },
        { name: "User Profile", path: "/api/user-profile", description: "Benutzerprofile" },
        { name: "Data Integration", path: "/api/data-integration", description: "Datenintegration" },
        { name: "Knowledge", path: "/api/knowledge", description: "Wissensdatenbank" },
        { name: "Reading Templates", path: "/reading/templates", description: "Reading-Templates" },
        { name: "Reading Modules", path: "/reading/modules", description: "Reading-Module" },
        { name: "Reading Generate", path: "/reading/generate", description: "Reading-Generierung" },
        { name: "Chat", path: "/api/chat", description: "Chat-API" },
        { name: "Community Posts", path: "/community/posts", description: "Community-Posts" },
        { name: "Community Groups", path: "/community/groups", description: "Community-Gruppen" },
        { name: "Community Events", path: "/community/events", description: "Community-Events" },
        { name: "Community Friends", path: "/community/friends", description: "Freunde-System" },
        { name: "Dating", path: "/api/dating", description: "Dating-System" },
        { name: "Matching", path: "/api/matching", description: "Matching-System" },
        { name: "Swipe", path: "/api/swipe", description: "Swipe-Funktion" },
        { name: "Admin", path: "/api/admin", description: "Admin-Funktionen" },
        { name: "Admin Coaching", path: "/api/admin/coaching", description: "Coaching-Verwaltung" },
        { name: "Admin Knowledge", path: "/api/admin/knowledge", description: "Wissensverwaltung" },
        { name: "Admin Upload", path: "/api/admin/upload", description: "Upload-Verwaltung" },
        { name: "Admin Readings", path: "/api/admin/readings", description: "Reading-Management für Admin" },
        { name: "Health", path: "/api/health", description: "System-Gesundheit" },
        { name: "Status", path: "/api/status", description: "System-Status" },
        { name: "Metrics", path: "/api/metrics", description: "System-Metriken" },
        { name: "Astronomy", path: "/api/astronomy", description: "Astronomie-Daten" },
        { name: "Moon Calendar", path: "/api/moon-calendar", description: "Mondkalender" },
        { name: "Notifications", path: "/api/notifications", description: "Benachrichtigungen" },
        { name: "AI Chart Analysis", path: "/api/ai/chart-analysis", description: "KI-Chart-Analyse" },
        { name: "AI Compatibility", path: "/api/ai/compatibility", description: "KI-Kompatibilität" },
        { name: "AI Reading Generator", path: "/api/ai/reading-generator", description: "KI-Reading-Generator" },
        { name: "AI Coaching", path: "/api/ai/coaching", description: "KI-Coaching" },
        { name: "AI Insights", path: "/api/ai/insights", description: "KI-Erkenntnisse" },
        { name: "AI Predictions", path: "/api/ai/predictions", description: "KI-Vorhersagen" },
        { name: "Realtime Analysis", path: "/api/realtime-analysis", description: "Echtzeit-Analyse" },
        { name: "Advanced Matching", path: "/api/advanced-matching", description: "Erweiterte Matching" },
        { name: "Gamification", path: "/api/gamification", description: "Gamification-System" },
        { name: "Analytics", path: "/api/analytics", description: "Erweiterte Analytics" },
        { name: "Webhooks", path: "/api/webhooks", description: "Webhook-System" },
        { name: "Data Export", path: "/api/data-export", description: "Daten-Export" },
        { name: "Wellness Tracker", path: "/api/wellness", description: "Wellness-Tracking" },
        { name: "Energy Tracker", path: "/api/energy", description: "Energie-Tracking" },
        { name: "Mood Tracker", path: "/api/mood", description: "Stimmungs-Tracking" },
        { name: "Habit Tracker", path: "/api/habits", description: "Gewohnheits-Tracking" },
        { name: "Sleep Tracker", path: "/api/sleep", description: "Schlaf-Tracking" },
        { name: "Meditation", path: "/api/meditation", description: "Meditations-Tracking" },
        { name: "HD Academy", path: "/api/academy", description: "HD-Akademie" },
        { name: "Courses", path: "/api/courses", description: "Kurs-System" },
        { name: "Lessons", path: "/api/lessons", description: "Lektionen" },
        { name: "Quiz", path: "/api/quiz", description: "Quiz-System" },
        { name: "Progress", path: "/api/progress", description: "Fortschritts-Tracking" },
        { name: "Certification", path: "/api/certification", description: "Zertifizierung" },
        { name: "Mobile Sync", path: "/api/mobile/sync", description: "Mobile Synchronisation" },
        { name: "Push Notifications", path: "/api/push", description: "Push-Benachrichtigungen" },
        { name: "Offline Data", path: "/api/offline", description: "Offline-Daten" },
        { name: "Device Management", path: "/api/devices", description: "Geräte-Verwaltung" },
        { name: "App Settings", path: "/api/app-settings", description: "App-Einstellungen" },
      ]
    }
  ];

  const backendDirectories = [
    {
      category: "Backend Struktur",
      icon: <Code size={20} />,
      directories: [
        { name: "src/", description: "TypeScript Source Code" },
        { name: "src/controllers/", description: "API Controller" },
        { name: "src/routes/", description: "API Routes (reading.ts, community.ts)" },
        { name: "src/models/", description: "Datenmodelle" },
        { name: "src/services/", description: "Business Logic (readingService.ts, communityService.ts)" },
        { name: "src/middleware/", description: "Middleware Functions" },
        { name: "src/utils/", description: "Utility Functions" },
        { name: "data/", description: "Lokale Datenbank & JSON Files" },
        { name: "data/knowledge/", description: "Wissensdatenbank Markdown Files" },
        { name: "data/charts/", description: "Chart-Daten" },
        { name: "data/profiles/", description: "Benutzerprofile" },
        { name: "uploads/", description: "Upload-Verzeichnis" },
        { name: "__tests__/", description: "Unit Tests" },
        { name: "scripts/", description: "Utility Scripts" },
        { name: "docs/", description: "Dokumentation" },
        { name: "views/", description: "EJS Templates" },
        { name: "src/ai/", description: "KI-Services und Algorithmen" },
        { name: "src/ai/models/", description: "KI-Modelle und ML-Algorithmen" },
        { name: "src/ai/analysis/", description: "KI-Analyse-Services" },
        { name: "src/ai/predictions/", description: "Vorhersage-Services" },
        { name: "src/ai/coaching/", description: "KI-Coaching-Assistent" },
        { name: "src/ai/insights/", description: "KI-Erkenntnisse und Empfehlungen" },
        { name: "src/realtime/", description: "Echtzeit-Features und WebSockets" },
        { name: "src/analytics/", description: "Erweiterte Analytics und Metriken" },
        { name: "src/gamification/", description: "Gamification-System" },
        { name: "src/wellness/", description: "Wellness und Lifestyle-Tracking" },
        { name: "src/education/", description: "Bildungs- und Lernsysteme" },
        { name: "src/mobile/", description: "Mobile App Services" },
        { name: "src/integrations/", description: "Drittanbieter-Integrationen" },
        { name: "src/webhooks/", description: "Webhook-System" },
        { name: "src/export/", description: "Daten-Export-Services" },
        { name: "src/sync/", description: "Synchronisations-Services" },
        { name: "src/notifications/", description: "Benachrichtigungs-System" },
        { name: "src/backup/", description: "Backup und Wiederherstellung" },
        { name: "monitoring/", description: "Monitoring und Observability" },
        { name: "grafana/", description: "Grafana Dashboards und Konfiguration" },
        { name: "prometheus/", description: "Prometheus Metriken und Alerts" },
        { name: "k8s/", description: "Kubernetes Deployment-Konfigurationen" },
        { name: "docker/", description: "Docker-Konfigurationen" },
        { name: "ci-cd/", description: "CI/CD Pipeline-Konfigurationen" }
      ]
    }
  ];

  // Filtere Kategorien basierend auf Benutzerrechten
  const filteredFrontendPages = frontendPages.filter(category => 
    hasAccess(category.requiredPackage || 'free')
  ).map(category => ({
    ...category,
    pages: category.pages.filter(page => 
      hasAccess(page.requiredPackage || category.requiredPackage || 'free')
    )
  }));

  const handlePackageChange = (newPackage: string) => {
    setUserPackage(newPackage);
    localStorage.setItem('userPackage', newPackage);
  };

  if (!mounted) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#1a1a2e',
        color: 'white'
      }}>
        <Typography variant="h6">Lade Menü-System...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='80' cy='80' r='1'/%3E%3Ccircle cx='40' cy='60' r='0.5'/%3E%3Ccircle cx='60' cy='40' r='0.5'/%3E%3Ccircle cx='90' cy='10' r='0.8'/%3E%3Ccircle cx='10' cy='90' r='0.8'/%3E%3C/g%3E%3C/svg%3E")
      `,
      position: 'relative',
      overflow: 'hidden',
      py: 4
    }}>
      {/* Floating Stars Animation - SSR-sicher */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`,
              '@keyframes twinkle': {
                '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                '50%': { opacity: 1, transform: 'scale(1.2)' }
              }
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>

        {/* Benutzerrechte-Kontrollpanel */}
        <Box sx={{ mb: 4 }}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(20px)',
            borderRadius: 4, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Crown size={24} style={{ color: '#FFD700' }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  Benutzerrechte-Konfiguration
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel sx={{ color: 'white' }}>Paket wählen</InputLabel>
                  <Select
                    value={userPackage}
                    onChange={(e) => handlePackageChange(e.target.value)}
                    sx={{ 
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                    }}
                  >
                    <MenuItem value="free">🆓 Free</MenuItem>
                    <MenuItem value="basic">⭐ Basic</MenuItem>
                    <MenuItem value="premium">👑 Premium</MenuItem>
                    <MenuItem value="vip">💎 VIP</MenuItem>
                    <MenuItem value="admin">🔧 Admin</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={showAllPages}
                      onChange={(e) => setShowAllPages(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#FFD700' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FFD700' }
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: 'white', fontWeight: 600 }}>
                      Alle Seiten anzeigen
                    </Typography>
                  }
                />
              </Box>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`Aktuelles Paket: ${userPackage.toUpperCase()}`} 
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                  color: 'white', 
                  fontWeight: 700 
                }} 
              />
              <Chip 
                label={`Sichtbare Kategorien: ${filteredFrontendPages.length}`} 
                sx={{ 
                  background: 'rgba(255, 215, 0, 0.2)', 
                  color: '#FFD700', 
                  fontWeight: 600,
                  border: '1px solid rgba(255, 215, 0, 0.3)'
                }} 
              />
              <Chip 
                label={`Gesamt Seiten: ${filteredFrontendPages.reduce((acc, cat) => acc + cat.pages.length, 0)}`} 
                sx={{ 
                  background: 'rgba(255, 119, 198, 0.2)', 
                  color: '#FF77C6', 
                  fontWeight: 600,
                  border: '1px solid rgba(255, 119, 198, 0.3)'
                }} 
              />
              <Chip 
                label={`Öffentliche Seiten: ${getPublicPages().length}`} 
                sx={{ 
                  background: 'rgba(34, 197, 94, 0.2)', 
                  color: '#22c55e', 
                  fontWeight: 600,
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }} 
              />
            </Box>
          </Card>
        </Box>

        {/* Öffentliche Seiten - Prominent angezeigt */}
        <Box sx={{ mb: 4 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
            backdropFilter: 'blur(20px)',
            borderRadius: 4, 
            border: '2px solid rgba(34, 197, 94, 0.3)',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Globe size={28} style={{ color: '#22c55e' }} />
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                  🌐 Öffentliche Seiten
                </Typography>
                <Chip 
                  label="Für alle zugänglich" 
                  sx={{ 
                    background: 'rgba(34, 197, 94, 0.2)', 
                    color: '#22c55e', 
                    fontWeight: 600,
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }} 
                />
              </Box>
              
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                Diese Seiten sind für alle Benutzer ohne Anmeldung oder Premium-Account zugänglich:
              </Typography>
              
              <Grid container spacing={2}>
                {getPublicPages().map((page, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
                          border: '1px solid rgba(34, 197, 94, 0.5)'
                        }
                      }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Globe size={16} style={{ color: '#22c55e' }} />
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                              {page.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.85rem' }}>
                            {page.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={page.path} 
                              size="small"
                              sx={{ 
                                background: 'rgba(34, 197, 94, 0.1)', 
                                color: '#22c55e', 
                                fontSize: '0.7rem',
                                fontFamily: 'monospace'
                              }} 
                            />
                            <Link href={page.path} style={{ textDecoration: 'none' }}>
                              <Chip 
                                label="Besuchen" 
                                size="small"
                                sx={{ 
                                  background: 'rgba(34, 197, 94, 0.2)', 
                                  color: '#22c55e', 
                                  fontSize: '0.7rem',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    background: 'rgba(34, 197, 94, 0.3)'
                                  }
                                }} 
                              />
                            </Link>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs für verschiedene Ansichten */}
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(20px)',
            borderRadius: 4, 
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Tabs
              value={selectedTab}
              onChange={(e, newValue) => {
                setSelectedTab(newValue);
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
                '& .Mui-selected': { color: '#FFD700 !important' },
                '& .MuiTabs-indicator': { backgroundColor: '#FFD700' }
              }}
            >
              <Tab label="🌐 Öffentliche Seiten" />
              <Tab label="📱 Frontend Seiten" />
              <Tab label="🔧 Backend APIs" />
              <Tab label="📁 Verzeichnisse" />
              <Tab label="📊 Statistiken" />
            </Tabs>
          </Paper>
        </Box>

        {/* Tab Content */}
        {selectedTab === 0 && (
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 4, textAlign: 'center' }}>
              🌐 Öffentliche Seiten
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
              Diese Seiten sind für alle Benutzer ohne Anmeldung oder Premium-Account zugänglich. 
              Sie bieten grundlegende Funktionen und Informationen über Human Design.
            </Typography>
            
            <Grid container spacing={3}>
              {getPublicPages().length > 0 ? getPublicPages().map((page, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4, 
                    border: '2px solid rgba(34, 197, 94, 0.3)',
                    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 40px rgba(34, 197, 94, 0.4)',
                      border: '2px solid rgba(34, 197, 94, 0.6)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Globe size={24} style={{ color: '#22c55e' }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                          {page.name}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                        {page.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Chip 
                          label={page.path} 
                          size="small"
                          sx={{ 
                            background: 'rgba(34, 197, 94, 0.2)', 
                            color: '#22c55e', 
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                            fontWeight: 600
                          }} 
                        />
                        <Chip 
                          label="Kostenlos" 
                          size="small"
                          sx={{ 
                            background: 'rgba(34, 197, 94, 0.3)', 
                            color: '#22c55e', 
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }} 
                        />
                      </Box>
                      
                      <Link href={page.path} style={{ textDecoration: 'none' }}>
                        <Box sx={{
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: 'white',
                          p: 1.5,
                          borderRadius: 2,
                          textAlign: 'center',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #16a34a, #15803d)',
                            transform: 'scale(1.02)'
                          }
                        }}>
                          Seite besuchen →
                        </Box>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              )) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Keine öffentlichen Seiten gefunden
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
        
        {selectedTab === 1 && (
          <Box sx={{ py: 6 }}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: 'white', 
                    mb: 3, 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3rem' },
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                  }}
                >
                  <Monitor size={40} />
                  Frontend Seiten
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                  Basierend auf Ihrem {userPackage.toUpperCase()}-Paket
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {filteredFrontendPages.map((category, categoryIndex) => (
                <Grid item xs={12} md={6} lg={4} key={categoryIndex}>
                  <Box>
                    <Card sx={{ 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.1)', 
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4, 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                        borderColor: 'rgba(255,255,255,0.4)',
                        background: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '12px', 
                            background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: 'white', 
                            mr: 2,
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                          }}>
                            {category.icon}
                          </Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                            {category.category}
                          </Typography>
                        </Box>
                        
                        <List dense>
                          {category.pages.map((page, pageIndex) => (
                            <ListItem key={pageIndex} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <ExternalLink size={16} style={{ color: '#FFD700' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Link href={page.path} style={{ textDecoration: 'none' }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: 'white', 
                                        fontWeight: 600,
                                        '&:hover': { color: '#FFD700' }
                                      }}
                                    >
                                      {page.name}
                                    </Typography>
                                  </Link>
                                }
                                secondary={
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {page.description}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
              </Grid>
            </Box>
          </Box>
        )}

        {/* Backend Routes Section */}
        {selectedTab === 1 && (
          <Box sx={{ py: 6 }}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: 'white', 
                    mb: 3, 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3rem' },
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                  }}
                >
                  <Server size={40} />
                  Backend API Routes
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {backendRoutes.map((category, categoryIndex) => (
                <Grid item xs={12} md={6} lg={4} key={categoryIndex}>
                  <Box>
                    <Card sx={{ 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.1)', 
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4, 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                        borderColor: 'rgba(255,255,255,0.4)',
                        background: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '12px', 
                            background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: 'white', 
                            mr: 2,
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                          }}>
                            {category.icon}
                          </Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                            {category.category}
                          </Typography>
                        </Box>
                        
                        <List dense>
                          {category.routes.map((route, routeIndex) => (
                            <ListItem key={routeIndex} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <Code size={16} style={{ color: '#FFD700' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: 'white', 
                                      fontWeight: 600,
                                      fontFamily: 'monospace'
                                    }}
                                  >
                                    {route.path}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {route.description}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
              </Grid>
            </Box>
          </Box>
        )}

        {/* Backend Directories Section */}
        {selectedTab === 2 && (
          <Box sx={{ py: 6 }}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: 'white', 
                    mb: 3, 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3rem' },
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                  }}
                >
                  <Folder size={40} />
                  Backend Verzeichnisse
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {backendDirectories.map((category, categoryIndex) => (
                <Grid item xs={12} md={6} lg={4} key={categoryIndex}>
                  <Box>
                    <Card sx={{ 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.1)', 
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4, 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                        borderColor: 'rgba(255,255,255,0.4)',
                        background: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '12px', 
                            background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: 'white', 
                            mr: 2,
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                          }}>
                            {category.icon}
                          </Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                            {category.category}
                          </Typography>
                        </Box>
                        
                        <List dense>
                          {category.directories.map((directory, dirIndex) => (
                            <ListItem key={dirIndex} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <Folder size={16} style={{ color: '#FFD700' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: 'white', 
                                      fontWeight: 600,
                                      fontFamily: 'monospace'
                                    }}
                                  >
                                    {directory.name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {directory.description}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
              </Grid>
            </Box>
          </Box>
        )}

        {/* Statistics Section */}
        {selectedTab === 3 && (
          <Box sx={{ py: 6 }}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: 'white', 
                    mb: 3, 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3rem' },
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                  }}
                >
                  <BarChart3 size={40} />
                  Projekt-Statistiken
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4, 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    p: 3
                  }}>
                    <Typography variant="h2" sx={{ color: '#FFD700', fontWeight: 800, mb: 1 }}>
                      {filteredFrontendPages.reduce((acc, cat) => acc + cat.pages.length, 0)}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      Sichtbare Frontend Seiten
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      von {frontendPages.reduce((acc, cat) => acc + cat.pages.length, 0)} gesamt
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4, 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    p: 3
                  }}>
                    <Typography variant="h2" sx={{ color: '#FFD700', fontWeight: 800, mb: 1 }}>
                      {backendRoutes.reduce((acc, cat) => acc + cat.routes.length, 0)}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      Backend API Routes
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Alle verfügbar
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4, 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    p: 3
                  }}>
                    <Typography variant="h2" sx={{ color: '#FFD700', fontWeight: 800, mb: 1 }}>
                      {backendDirectories.reduce((acc, cat) => acc + cat.directories.length, 0)}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      Backend Verzeichnisse
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Projekt-Struktur
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4, 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    p: 3
                  }}>
                    <Typography variant="h2" sx={{ color: '#FFD700', fontWeight: 800, mb: 1 }}>
                      {filteredFrontendPages.length}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      Sichtbare Kategorien
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      von {frontendPages.length} gesamt
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4 }}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4, 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  p: 4
                }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                    📋 Paket-Übersicht
                  </Typography>
                  <Grid container spacing={2}>
                    {['free', 'basic', 'premium', 'vip', 'admin'].map((pkg) => {
                      const isCurrent = pkg === userPackage;
                      const packageCount = frontendPages.filter(cat => 
                        packageHierarchy[cat.requiredPackage || 'free'] <= packageHierarchy[pkg]
                      ).reduce((acc, cat) => acc + cat.pages.filter(page => 
                        packageHierarchy[page.requiredPackage || cat.requiredPackage || 'free'] <= packageHierarchy[pkg]
                      ).length, 0);
                      
                      return (
                        <Grid item xs={12} sm={6} md={2.4} key={pkg}>
                          <Box sx={{ 
                            textAlign: 'center', 
                            p: 2, 
                            borderRadius: 2,
                            background: isCurrent ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: isCurrent ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)'
                          }}>
                            <Typography variant="h6" sx={{ 
                              color: isCurrent ? '#FFD700' : 'white', 
                              fontWeight: 700,
                              mb: 1
                            }}>
                              {pkg.toUpperCase()}
                            </Typography>
                            <Typography variant="h4" sx={{ 
                              color: isCurrent ? '#FFD700' : 'rgba(255,255,255,0.7)', 
                              fontWeight: 800,
                              mb: 1
                            }}>
                              {packageCount}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Seiten verfügbar
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Card>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

// SSR-sicherer Export
export default function SSRSeitenanzeigePage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#1a1a2e',
        color: 'white'
      }}>
        <Typography variant="h6">Lade Seitenanzeige...</Typography>
      </Box>
    );
  }

  return <SeitenanzeigePage />;
}
