"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Divider,
  Badge,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Search,
  Filter,
  Star,
  Diamond,
  Crown,
  Lock,
  Globe,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import SSRSafeStars from '@/components/SSRSafeStars';

// Vollständige Seiten-Datenbank (116 Seiten)
const allPages = [
  // Öffentliche Seiten
  { id: 'home', title: 'Startseite', path: '/', description: 'Willkommen auf der Human Design App', category: 'Öffentlich', package: 'free', icon: '🏠', features: ['Landing Page', 'Überblick', 'Navigation'] },
  { id: 'login', title: 'Anmelden', path: '/login', description: 'Benutzeranmeldung', category: 'Öffentlich', package: 'free', icon: '🔐', features: ['Login', 'Authentifizierung'] },
  { id: 'register', title: 'Registrieren', path: '/register', description: 'Neue Benutzer registrieren', category: 'Öffentlich', package: 'free', icon: '📝', features: ['Registrierung', 'Account erstellen'] },
  { id: 'pricing', title: 'Preise', path: '/pricing', description: 'Preisübersicht und Pakete', category: 'Öffentlich', package: 'free', icon: '💰', features: ['Preise', 'Pakete', 'Upgrade'] },
  { id: 'preise', title: 'Preise (Alt)', path: '/preise', description: 'Alternative Preisseite', category: 'Öffentlich', package: 'free', icon: '💳', features: ['Preise', 'Pakete'] },
  { id: 'sitemap', title: 'Sitemap', path: '/sitemap', description: 'Übersicht aller Seiten', category: 'Öffentlich', package: 'free', icon: '🗺️', features: ['Navigation', 'Übersicht'] },
  { id: 'roadmap', title: 'Roadmap', path: '/roadmap', description: 'Entwicklungsplan', category: 'Öffentlich', package: 'free', icon: '🛣️', features: ['Planung', 'Entwicklung'] },
  { id: 'package-overview', title: 'Package Overview', path: '/package-overview', description: 'Paket-Übersicht', category: 'Öffentlich', package: 'free', icon: '📦', features: ['Pakete', 'Übersicht'] },

  // Benutzer-Seiten
  { id: 'dashboard', title: 'Dashboard', path: '/dashboard', description: 'Persönliches Dashboard', category: 'Benutzer', package: 'basic', icon: '📊', features: ['Übersicht', 'Statistiken', 'Schnellzugriff'] },
  { id: 'profile', title: 'Profil', path: '/profil', description: 'Benutzerprofil verwalten', category: 'Benutzer', package: 'basic', icon: '👤', features: ['Profil bearbeiten', 'Einstellungen'] },
  { id: 'profile-edit', title: 'Profil bearbeiten', path: '/profil/edit', description: 'Profil bearbeiten', category: 'Benutzer', package: 'basic', icon: '✏️', features: ['Bearbeiten', 'Anpassen'] },
  { id: 'profile-setup', title: 'Profil einrichten', path: '/profile-setup', description: 'Profil erstmalig einrichten', category: 'Benutzer', package: 'basic', icon: '⚙️', features: ['Setup', 'Erstmalig'] },
  { id: 'profil-einrichten', title: 'Profil einrichten (Alt)', path: '/profil-einrichten', description: 'Alternative Profil-Einrichtung', category: 'Benutzer', package: 'basic', icon: '🔧', features: ['Setup', 'Einrichtung'] },
  { id: 'settings', title: 'Einstellungen', path: '/settings', description: 'App-Einstellungen', category: 'Benutzer', package: 'basic', icon: '⚙️', features: ['Einstellungen', 'Konfiguration'] },
  { id: 'logout', title: 'Abmelden', path: '/logout', description: 'Benutzer abmelden', category: 'Benutzer', package: 'basic', icon: '🚪', features: ['Abmelden', 'Logout'] },

  // Human Design - Grundlagen
  { id: 'chart', title: 'Human Design Chart', path: '/chart', description: 'Persönliches Human Design Chart', category: 'Human Design', package: 'basic', icon: '🧬', features: ['Chart', 'Analyse', 'Typ'] },
  { id: 'chart-test', title: 'Chart Test', path: '/chart/test', description: 'Chart-Test-Funktion', category: 'Human Design', package: 'basic', icon: '🧪', features: ['Test', 'Validierung'] },
  { id: 'chart-editor', title: 'Chart Editor', path: '/chart-editor', description: 'Chart bearbeiten', category: 'Human Design', package: 'premium', icon: '✏️', features: ['Editor', 'Bearbeiten'] },
  { id: 'chart-info', title: 'Chart Informationen', path: '/chart-info', description: 'Detaillierte Chart-Informationen', category: 'Human Design', package: 'basic', icon: '📋', features: ['Details', 'Erklärungen', 'Bedeutung'] },
  { id: 'human-design-chart', title: 'Human Design Chart (Alt)', path: '/human-design-chart', description: 'Alternative Chart-Seite', category: 'Human Design', package: 'basic', icon: '📊', features: ['Chart', 'Analyse'] },
  { id: 'human-design-info', title: 'Human Design Info', path: '/human-design-info', description: 'HD-Grundlagen', category: 'Human Design', package: 'free', icon: '📚', features: ['Grundlagen', 'Informationen'] },
  { id: 'grundlagen-hd', title: 'Grundlagen HD', path: '/grundlagen-hd', description: 'Human Design Grundlagen', category: 'Human Design', package: 'free', icon: '🎓', features: ['Grundlagen', 'Lernen'] },

  // Human Design - Erweiterte Features
  { id: 'bodygraph-advanced', title: 'Erweiterte Bodygraph', path: '/bodygraph-advanced', description: 'Detaillierte Bodygraph-Analyse', category: 'Human Design', package: 'premium', icon: '🔬', features: ['Erweiterte Analyse', 'Details', 'Tiefe'] },
  { id: 'bodygraph-demo', title: 'Bodygraph Demo', path: '/bodygraph-demo', description: 'Bodygraph-Demonstration', category: 'Human Design', package: 'basic', icon: '🎭', features: ['Demo', 'Beispiel'] },
  { id: 'css-bodygraph', title: 'CSS Bodygraph', path: '/css-bodygraph', description: 'CSS-basierte Bodygraph', category: 'Human Design', package: 'basic', icon: '🎨', features: ['CSS', 'Styling'] },
  { id: 'centers', title: 'Zentren', path: '/centers', description: 'Human Design Zentren', category: 'Human Design', package: 'basic', icon: '⚪', features: ['Zentren', 'Energie'] },
  { id: 'gates', title: 'Tore', path: '/gates', description: 'Human Design Tore', category: 'Human Design', package: 'basic', icon: '🚪', features: ['Tore', 'Gene'] },
  { id: 'channels', title: 'Kanäle', path: '/channels', description: 'Human Design Kanäle', category: 'Human Design', package: 'basic', icon: '🌉', features: ['Kanäle', 'Verbindungen'] },
  { id: 'lines', title: 'Linien', path: '/lines', description: 'Human Design Linien', category: 'Human Design', package: 'basic', icon: '📏', features: ['Linien', 'Profile'] },
  { id: 'authority', title: 'Autorität', path: '/authority', description: 'Entscheidungsautorität', category: 'Human Design', package: 'basic', icon: '⚖️', features: ['Autorität', 'Entscheidungen'] },
  { id: 'profiles', title: 'Profile', path: '/profiles', description: 'Human Design Profile', category: 'Human Design', package: 'basic', icon: '👤', features: ['Profile', 'Persönlichkeit'] },

  // Kosmos - Mond & Planeten
  { id: 'mondkalender', title: 'Mondkalender', path: '/mondkalender', description: 'Mondphasen und kosmische Zyklen', category: 'Kosmos', package: 'basic', icon: '🌙', features: ['Mondphasen', 'Kalender', 'Rituale'] },
  { id: 'mondkalender-info', title: 'Mondkalender Info', path: '/mondkalender-info', description: 'Mondkalender-Erklärung', category: 'Kosmos', package: 'free', icon: '📖', features: ['Info', 'Erklärung'] },
  { id: 'mondphasen-info', title: 'Mondphasen Info', path: '/mondphasen-info', description: 'Mondphasen-Informationen', category: 'Kosmos', package: 'free', icon: '🌕', features: ['Mondphasen', 'Info'] },
  { id: 'blackmoonlilith', title: 'Black Moon Lilith', path: '/blackmoonlilith', description: 'Black Moon Lilith im Human Design', category: 'Kosmos', package: 'premium', icon: '🌑', features: ['Lilith', 'Schatten'] },
  { id: 'lilith', title: 'Lilith', path: '/lilith', description: 'Lilith-Energie', category: 'Kosmos', package: 'premium', icon: '🌚', features: ['Lilith', 'Feminin'] },
  { id: 'moon-dating', title: 'Moon Dating', path: '/moon-dating', description: 'Mond-basiertes Dating', category: 'Kosmos', package: 'premium', icon: '🌙💕', features: ['Mond', 'Dating'] },
  { id: 'ai-moon-insights', title: 'AI Moon Insights', path: '/ai-moon-insights', description: 'KI-Mond-Insights', category: 'Kosmos', package: 'premium', icon: '🤖🌙', features: ['KI', 'Mond', 'Insights'] },

  // Planeten
  { id: 'planets', title: 'Planeten', path: '/planets', description: 'Übersicht aller Planeten', category: 'Kosmos', package: 'basic', icon: '🪐', features: ['Planeten', 'Übersicht', 'Informationen'] },
  { id: 'sun', title: 'Sonne', path: '/planets/sun', description: 'Die Sonne im Human Design', category: 'Kosmos', package: 'basic', icon: '☀️', features: ['Sonne', 'Persönlichkeit', 'Kern'] },
  { id: 'moon', title: 'Mond', path: '/planets/moon', description: 'Der Mond im Human Design', category: 'Kosmos', package: 'basic', icon: '🌙', features: ['Mond', 'Emotionen', 'Unterbewusstsein'] },
  { id: 'mercury', title: 'Merkur', path: '/planets/mercury', description: 'Merkur im Human Design', category: 'Kosmos', package: 'basic', icon: '☿️', features: ['Merkur', 'Kommunikation', 'Denken'] },
  { id: 'venus', title: 'Venus', path: '/planets/venus', description: 'Venus im Human Design', category: 'Kosmos', package: 'basic', icon: '♀️', features: ['Venus', 'Liebe', 'Werte'] },
  { id: 'mars', title: 'Mars', path: '/planets/mars', description: 'Mars im Human Design', category: 'Kosmos', package: 'basic', icon: '♂️', features: ['Mars', 'Aktion', 'Energie'] },
  { id: 'jupiter', title: 'Jupiter', path: '/planets/jupiter', description: 'Jupiter im Human Design', category: 'Kosmos', package: 'basic', icon: '♃', features: ['Jupiter', 'Expansion', 'Wachstum'] },
  { id: 'saturn', title: 'Saturn', path: '/planets/saturn', description: 'Saturn im Human Design', category: 'Kosmos', package: 'basic', icon: '♄', features: ['Saturn', 'Struktur', 'Disziplin'] },
  { id: 'uranus', title: 'Uranus', path: '/planets/uranus', description: 'Uranus im Human Design', category: 'Kosmos', package: 'basic', icon: '♅', features: ['Uranus', 'Innovation', 'Revolution'] },
  { id: 'neptune', title: 'Neptun', path: '/planets/neptune', description: 'Neptun im Human Design', category: 'Kosmos', package: 'basic', icon: '♆', features: ['Neptun', 'Intuition', 'Spiritualität'] },
  { id: 'pluto', title: 'Pluto', path: '/planets/pluto', description: 'Pluto im Human Design', category: 'Kosmos', package: 'basic', icon: '♇', features: ['Pluto', 'Transformation', 'Macht'] },
  { id: 'chiron', title: 'Chiron', path: '/planets/chiron', description: 'Chiron im Human Design', category: 'Kosmos', package: 'premium', icon: '⚕️', features: ['Chiron', 'Heilung', 'Wunde'] },
  { id: 'incarnation-cross', title: 'Inkarnationskreuz', path: '/planets/incarnation-cross', description: 'Inkarnationskreuz', category: 'Kosmos', package: 'premium', icon: '✝️', features: ['Inkarnationskreuz', 'Lebensaufgabe'] },

  // Community
  { id: 'community', title: 'Community', path: '/community', description: 'Benutzer-Community', category: 'Community', package: 'basic', icon: '👥', features: ['Chat', 'Forum', 'Networking'] },
  { id: 'community-info', title: 'Community Info', path: '/community-info', description: 'Über unsere Community', category: 'Community', package: 'free', icon: 'ℹ️', features: ['Info', 'Über uns'] },
  { id: 'vip-community', title: 'VIP Community', path: '/vip-community', description: 'Exklusive VIP-Community', category: 'Community', package: 'vip', icon: '👑', features: ['Exklusiv', 'VIP', 'Premium'] },

  // Dating
  { id: 'dating', title: 'Dating', path: '/dating', description: 'Human Design Dating', category: 'Dating', package: 'premium', icon: '💕', features: ['Matching', 'Kompatibilität', 'Dating'] },
  { id: 'dating-new', title: 'Dating (Neu)', path: '/dating-new', description: 'Neue Dating-Features', category: 'Dating', package: 'premium', icon: '💕✨', features: ['Neu', 'Features'] },
  { id: 'dating-info', title: 'Dating Info', path: '/dating-info', description: 'Dating-Erklärung', category: 'Dating', package: 'free', icon: '💡', features: ['Info', 'Erklärung'] },
  { id: 'dating-impulse', title: 'Dating Impulse', path: '/dating-impulse', description: 'Dating-Impulse', category: 'Dating', package: 'premium', icon: '⚡', features: ['Impulse', 'Inspiration'] },
  { id: 'swipe', title: 'Swipe', path: '/swipe', description: 'Dating-Swipe-Funktion', category: 'Dating', package: 'premium', icon: '💫', features: ['Swipe', 'Matching', 'Dating'] },
  { id: 'match', title: 'Match', path: '/match', description: 'Match-Übersicht', category: 'Dating', package: 'premium', icon: '💘', features: ['Match', 'Übersicht'] },
  { id: 'match-tips', title: 'Match-Tipps', path: '/dating/match-tips', description: 'Tipps für bessere Matches', category: 'Dating', package: 'premium', icon: '💡', features: ['Tipps', 'Matching', 'Optimierung'] },
  { id: 'friends', title: 'Freunde', path: '/dating/friends', description: 'Freundschaften finden', category: 'Dating', package: 'premium', icon: '👫', features: ['Freunde', 'Networking', 'Community'] },

  // Dating nach Typen
  { id: 'dating-generator', title: 'Dating Generator', path: '/dating/generator', description: 'Dating für Generatoren', category: 'Dating', package: 'premium', icon: '⚡', features: ['Generator', 'Dating'] },
  { id: 'dating-manifesting-generator', title: 'Dating Manifesting Generator', path: '/dating/manifesting-generator', description: 'Dating für Manifesting Generatoren', category: 'Dating', package: 'premium', icon: '⚡✨', features: ['Manifesting Generator', 'Dating'] },
  { id: 'dating-manifestor', title: 'Dating Manifestor', path: '/dating/manifestor', description: 'Dating für Manifestoren', category: 'Dating', package: 'premium', icon: '🚀', features: ['Manifestor', 'Dating'] },
  { id: 'dating-projector', title: 'Dating Projector', path: '/dating/projector', description: 'Dating für Projektoren', category: 'Dating', package: 'premium', icon: '🎯', features: ['Projector', 'Dating'] },
  { id: 'dating-reflector', title: 'Dating Reflector', path: '/dating/reflector', description: 'Dating für Reflektoren', category: 'Dating', package: 'premium', icon: '🪞', features: ['Reflector', 'Dating'] },

  // Coaching
  { id: 'coaching', title: 'Coaching', path: '/coaching', description: 'Persönliches 1:1 Coaching', category: 'Coaching', package: 'vip', icon: '🎯', features: ['1:1 Coaching', 'Persönlich', 'Exklusiv'] },
  { id: 'coaching-info', title: 'Coaching Info', path: '/coaching-info', description: 'Coaching-Informationen', category: 'Coaching', package: 'free', icon: 'ℹ️', features: ['Info', 'Coaching'] },
  { id: 'coaching-heiko', title: 'Coaching Heiko', path: '/coaching/heiko', description: 'Coaching mit Heiko', category: 'Coaching', package: 'vip', icon: '👨‍🏫', features: ['Heiko', 'Coaching'] },
  { id: 'coaching-elisabeth', title: 'Coaching Elisabeth', path: '/coaching/elisabeth', description: 'Coaching mit Elisabeth', category: 'Coaching', package: 'vip', icon: '👩‍🏫', features: ['Elisabeth', 'Coaching'] },
  { id: 'coaching-janine', title: 'Coaching Janine', path: '/coaching/janine', description: 'Coaching mit Janine', category: 'Coaching', package: 'vip', icon: '👩‍💼', features: ['Janine', 'Coaching'] },
  { id: 'personal-coach', title: 'Persönlicher Coach', path: '/personal-coach', description: 'Dedizierter persönlicher Coach', category: 'Coaching', package: 'vip', icon: '🧘', features: ['Persönlich', 'Dediziert', 'Exklusiv'] },

  // VIP Features
  { id: 'priority-support', title: 'Priority Support', path: '/priority-support', description: 'Prioritäts-Support', category: 'VIP', package: 'vip', icon: '🚨', features: ['Support', 'Priorität'] },
  { id: 'exclusive-events', title: 'Exclusive Events', path: '/exclusive-events', description: 'Exklusive Events', category: 'VIP', package: 'vip', icon: '🎉', features: ['Events', 'Exklusiv'] },
  { id: 'live-events', title: 'Live Events', path: '/live-events', description: 'Live-Veranstaltungen', category: 'VIP', package: 'vip', icon: '📺', features: ['Live', 'Events'] },

  // Tools & Features
  { id: 'reading', title: 'Readings', path: '/reading', description: 'Persönliche Human Design Readings', category: 'Tools', package: 'premium', icon: '📖', features: ['Readings', 'Analysen', 'Insights'] },
  { id: 'reading-info', title: 'Reading Info', path: '/reading-info', description: 'Reading-Informationen', category: 'Tools', package: 'free', icon: 'ℹ️', features: ['Info', 'Reading'] },
  { id: 'custom-readings', title: 'Custom Readings', path: '/custom-readings', description: 'Individuelle Readings', category: 'Tools', package: 'vip', icon: '🎨', features: ['Custom', 'Individuell'] },
  { id: 'journal', title: 'Journal', path: '/journal', description: 'Persönliches Journal', category: 'Tools', package: 'basic', icon: '📔', features: ['Journal', 'Tagebuch'] },
  { id: 'journal-info', title: 'Journal Info', path: '/journal-info', description: 'Journal-Informationen', category: 'Tools', package: 'free', icon: 'ℹ️', features: ['Info', 'Journal'] },
  { id: 'meditation-guide', title: 'Meditation Guide', path: '/meditation-guide', description: 'Meditations-Anleitung', category: 'Tools', package: 'premium', icon: '🧘‍♀️', features: ['Meditation', 'Guide'] },
  { id: 'consciousness-exercises', title: 'Consciousness Exercises', path: '/consciousness-exercises', description: 'Bewusstseins-Übungen', category: 'Tools', package: 'premium', icon: '🧠', features: ['Bewusstsein', 'Übungen'] },

  // AI & Knowledge
  { id: 'ai-chat', title: 'AI Chat', path: '/ai-chat', description: 'KI-Chat-System', category: 'AI', package: 'premium', icon: '🤖', features: ['KI', 'Chat', 'Support'] },
  { id: 'knowledge', title: 'Knowledge', path: '/knowledge', description: 'Wissensdatenbank', category: 'AI', package: 'basic', icon: '📚', features: ['Wissen', 'Datenbank'] },
  { id: 'knowledge-ai', title: 'Knowledge AI', path: '/knowledge-ai', description: 'KI-Wissenssystem', category: 'AI', package: 'premium', icon: '🤖📚', features: ['KI', 'Wissen'] },
  { id: 'info-hub', title: 'Info Hub', path: '/info-hub', description: 'Informations-Hub', category: 'AI', package: 'basic', icon: 'ℹ️', features: ['Info', 'Hub'] },
  { id: 'hd-academy', title: 'HD Academy', path: '/hd-academy', description: 'Human Design Akademie', category: 'AI', package: 'premium', icon: '🎓', features: ['Akademie', 'Lernen'] },

  // Analytics & Realtime
  { id: 'analytics', title: 'Analytics', path: '/analytics', description: 'Persönliche Analytics und Insights', category: 'Analytics', package: 'premium', icon: '📈', features: ['Statistiken', 'Trends', 'Insights'] },
  { id: 'realtime-analysis', title: 'Realtime Analysis', path: '/realtime-analysis', description: 'Echtzeit-Analyse', category: 'Analytics', package: 'premium', icon: '⚡', features: ['Echtzeit', 'Analyse'] },
  { id: 'realtime-analysis-demo', title: 'Realtime Analysis Demo', path: '/realtime-analysis-demo', description: 'Echtzeit-Analyse Demo', category: 'Analytics', package: 'premium', icon: '🎭', features: ['Demo', 'Echtzeit'] },

  // Sales & Marketing
  { id: 'sales', title: 'Sales', path: '/sales', description: 'Verkaufsseiten', category: 'Sales', package: 'free', icon: '💰', features: ['Sales', 'Verkauf'] },
  { id: 'sales-generator', title: 'Sales Generator', path: '/sales/generator', description: 'Sales für Generatoren', category: 'Sales', package: 'free', icon: '⚡💰', features: ['Generator', 'Sales'] },
  { id: 'sales-manifesting-generator', title: 'Sales Manifesting Generator', path: '/sales/manifesting-generator', description: 'Sales für Manifesting Generatoren', category: 'Sales', package: 'free', icon: '⚡✨💰', features: ['Manifesting Generator', 'Sales'] },
  { id: 'sales-manifestor', title: 'Sales Manifestor', path: '/sales/manifestor', description: 'Sales für Manifestoren', category: 'Sales', package: 'free', icon: '🚀💰', features: ['Manifestor', 'Sales'] },
  { id: 'sales-projector', title: 'Sales Projector', path: '/sales/projector', description: 'Sales für Projektoren', category: 'Sales', package: 'free', icon: '🎯💰', features: ['Projector', 'Sales'] },
  { id: 'sales-reflector', title: 'Sales Reflector', path: '/sales/reflector', description: 'Sales für Reflektoren', category: 'Sales', package: 'free', icon: '🪞💰', features: ['Reflector', 'Sales'] },
  { id: 'sales-dating', title: 'Sales Dating', path: '/sales/dating', description: 'Sales für Dating', category: 'Sales', package: 'free', icon: '💕💰', features: ['Dating', 'Sales'] },

  // Subscription & Support
  { id: 'subscription', title: 'Subscription', path: '/subscription', description: 'Abonnement-Verwaltung', category: 'Subscription', package: 'basic', icon: '💳', features: ['Abonnement', 'Verwaltung'] },
  { id: 'subscription-success', title: 'Subscription Success', path: '/subscription/success', description: 'Abonnement erfolgreich', category: 'Subscription', package: 'basic', icon: '✅', features: ['Erfolg', 'Abonnement'] },
  { id: 'upgrade', title: 'Upgrade', path: '/upgrade', description: 'Paket-Upgrade', category: 'Subscription', package: 'basic', icon: '⬆️', features: ['Upgrade', 'Paket'] },
  { id: 'support', title: 'Support', path: '/support', description: 'Kundensupport', category: 'Subscription', package: 'free', icon: '🆘', features: ['Support', 'Hilfe'] },

  // Development & Debug
  { id: 'api-access', title: 'API Zugang', path: '/api-access', description: 'API-Zugang für Entwickler', category: 'Development', package: 'premium', icon: '🔧', features: ['API', 'Entwicklung', 'Integration'] },
  { id: 'debug', title: 'Debug', path: '/debug', description: 'Debug-Funktionen', category: 'Development', package: 'admin', icon: '🐛', features: ['Debug', 'Entwicklung'] },
  { id: 'debug-simple', title: 'Debug Simple', path: '/debug-simple', description: 'Einfache Debug-Funktionen', category: 'Development', package: 'admin', icon: '🔍', features: ['Debug', 'Einfach'] },
  { id: 'test', title: 'Test', path: '/test', description: 'Test-Seite', category: 'Development', package: 'admin', icon: '🧪', features: ['Test', 'Entwicklung'] },
  { id: 'demo', title: 'Demo', path: '/demo', description: 'Demo-Seite', category: 'Development', package: 'free', icon: '🎭', features: ['Demo', 'Beispiel'] },
  { id: 'mobile-demo', title: 'Mobile Demo', path: '/mobile-demo', description: 'Mobile Demo', category: 'Development', package: 'free', icon: '📱', features: ['Mobile', 'Demo'] },
  { id: 'mobile-app', title: 'Mobile App', path: '/mobile-app', description: 'Mobile App', category: 'Development', package: 'free', icon: '📱', features: ['Mobile', 'App'] },
  { id: 'chat-new', title: 'Chat New', path: '/chat-new', description: 'Neues Chat-System', category: 'Development', package: 'basic', icon: '💬', features: ['Chat', 'Neu'] },

  // Admin
  { id: 'admin', title: 'Admin Panel', path: '/admin', description: 'Administratives Panel', category: 'Admin', package: 'admin', icon: '⚙️', features: ['Admin', 'Verwaltung', 'System'] },
  { id: 'admin-public', title: 'Admin Public', path: '/admin-public', description: 'Öffentliche Admin-Seite', category: 'Admin', package: 'admin', icon: '🌐', features: ['Admin', 'Öffentlich'] }
];

// Paket-Informationen
const packageInfo = {
  free: { name: 'Kostenlos', color: '#4CAF50', icon: <Globe size={16} /> },
  basic: { name: 'Basic', color: '#2196F3', icon: <Star size={16} /> },
  premium: { name: 'Premium', color: '#9C27B0', icon: <Diamond size={16} /> },
  vip: { name: 'VIP', color: '#FF9800', icon: <Crown size={16} /> },
  admin: { name: 'Admin', color: '#F44336', icon: <Lock size={16} /> }
};

export default function SeitenuebersichtPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedPackage, setSelectedPackage] = useState('Alle');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Kategorien extrahieren
  const categories = ['Alle', ...new Set(allPages.map(page => page.category))];

  // Gefilterte Seiten
  const filteredPages = useMemo(() => {
    return allPages.filter(page => {
      const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          page.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Alle' || page.category === selectedCategory;
      const matchesPackage = selectedPackage === 'Alle' || page.package === selectedPackage;
      
      return matchesSearch && matchesCategory && matchesPackage;
    });
  }, [searchTerm, selectedCategory, selectedPackage]);

  // Nach Kategorien gruppieren
  const groupedPages = useMemo(() => {
    const groups: { [key: string]: typeof allPages } = {};
    filteredPages.forEach(page => {
      if (!groups[page.category]) {
        groups[page.category] = [];
      }
      groups[page.category].push(page);
    });
    return groups;
  }, [filteredPages]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getPackageIcon = (packageId: string) => {
    return packageInfo[packageId as keyof typeof packageInfo]?.icon || <Globe size={16} />;
  };

  const getPackageColor = (packageId: string) => {
    return packageInfo[packageId as keyof typeof packageInfo]?.color || '#4CAF50';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
    }}>
      <SSRSafeStars />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 } }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
              }}
            >
              📋 Seitenübersicht
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Entdecke alle verfügbaren Seiten der Human Design App - sortiert nach Kategorien und Paketen
            </Typography>
          </Box>
        </motion.div>

        {/* Filter und Suche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            p: 4,
            mb: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Seiten durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color="rgba(255,255,255,0.7)" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4ecdc4',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Kategorie</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4ecdc4',
                      },
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Paket</InputLabel>
                  <Select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4ecdc4',
                      },
                    }}
                  >
                    <MenuItem value="Alle">Alle Pakete</MenuItem>
                    <MenuItem value="free">Kostenlos</MenuItem>
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="premium">Premium</MenuItem>
                    <MenuItem value="vip">VIP</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card>
        </motion.div>

        {/* Statistiken */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {Object.entries(packageInfo).map(([packageId, info]) => {
              const count = allPages.filter(page => page.package === packageId).length;
              return (
                <Grid item xs={6} sm={4} md={2.4} key={packageId}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    p: 2,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 45px rgba(0,0,0,0.4)'
                    }
                  }}>
                    <Box sx={{ color: info.color, mb: 1 }}>
                      {info.icon}
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                      {count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                      {info.name}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>

        {/* Seiten nach Kategorien */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {Object.entries(groupedPages).map(([category, pages]) => (
            <Card key={category} sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              mb: 3,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}>
              <Box
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)'
                  }
                }}
                onClick={() => toggleCategory(category)}
              >
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                  {category} ({pages.length})
                </Typography>
                <IconButton sx={{ color: 'white' }}>
                  {expandedCategories.includes(category) ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </IconButton>
              </Box>
              
              {expandedCategories.includes(category) && (
                <Box sx={{ px: 3, pb: 3 }}>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
                  <Grid container spacing={2}>
                    {pages.map((page) => (
                      <Grid item xs={12} sm={6} md={4} key={page.id}>
                        <Card sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          p: 2,
                          height: '100%',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 12px 35px rgba(0,0,0,0.4)',
                            borderColor: getPackageColor(page.package)
                          }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h4" sx={{ mr: 1 }}>
                              {page.icon}
                            </Typography>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                                {page.title}
                              </Typography>
                              <Chip
                                label={packageInfo[page.package as keyof typeof packageInfo]?.name}
                                size="small"
                                sx={{
                                  background: getPackageColor(page.package),
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, minHeight: '40px' }}>
                            {page.description}
                          </Typography>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
                              Features:
                            </Typography>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                              {page.features.map((feature, index) => (
                                <Chip
                                  key={index}
                                  label={feature}
                                  size="small"
                                  sx={{
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '0.6rem',
                                    height: '20px'
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              {page.path}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Seite ansehen">
                                <IconButton
                                  size="small"
                                  component={Link}
                                  href={page.path}
                                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                                >
                                  <Eye size={16} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="In neuem Tab öffnen">
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(page.path, '_blank')}
                                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                                >
                                  <ExternalLink size={16} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Card>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{
            background: 'rgba(0,0,0,0.2)',
            py: 4,
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            mt: 4
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              📊 Gesamt: {allPages.length} Seiten | 🔍 Gefiltert: {filteredPages.length} Seiten
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
