"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  TextField,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Users, 
  Zap, 
  Eye, 
  Flame, 
  Moon, 
  Plus,
  Search,
  Share,
  GitCompare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Heart,
  Brain,
  Activity,
  BarChart3,
  Download,
  Save,
  Bookmark,
  Filter,
  RotateCcw,
  Maximize2,
  Minimize2,
  Target,
  List as ListIcon
} from 'lucide-react';
import AccessControl from '../../components/AccessControl';
import { UserSubscription } from '../../lib/subscription/types';

interface ChartData {
  id: string;
  name: string;
  type: string;
  profile: string;
  authority: string;
  centers: string[];
  channels: string[];
  gates: string[];
  definition: string;
  strategy: string;
  notSelf: string;
  innerAuthority: string;
  outerAuthority: string;
  incarnationCross: string;
  variables: string;
  environment: string;
  motivation: string;
  perspective: string;
  cognition: string;
  signature: string;
  avatar?: string;
}

interface ComparisonResult {
  id?: string;
  timestamp?: string;
  chartNames?: string[];
  compatibility: number;
  sharedCenters: string[];
  sharedChannels: string[];
  sharedGates: string[];
  differences: string[];
  recommendations: string[];
  energyFlow: string;
  communication: string;
  relationship: string;
  // Erweiterte Analyse-Features
  compatibilityMatrix: {
    emotional: number;
    mental: number;
    physical: number;
    spiritual: number;
  };
  energyFlowAnalysis: {
    dominant: string;
    secondary: string;
    potential: string;
    challenges: string[];
  };
  conflictPotential: {
    score: number;
    areas: string[];
    triggers: string[];
    solutions: string[];
  };
  relationshipDynamics: {
    strengths: string[];
    challenges: string[];
    growthAreas: string[];
    communication: string;
  };
  detailedInsights: {
    authority: string;
    strategy: string;
    signature: string;
    notSelf: string;
  };
}

const mockCharts: ChartData[] = [
  {
    id: '1',
    name: 'Sarah Müller',
    type: 'Generator',
    profile: '2/4',
    authority: 'Sakrale Autorität',
    centers: ['Sakral', 'Solar Plexus', 'Herz', 'G'],
    channels: ['10-20', '34-57', '25-51'],
    gates: ['10', '20', '34', '57', '25', '51'],
    definition: 'Single Definition',
    strategy: 'Warten auf die Antwort',
    notSelf: 'Frustration',
    innerAuthority: 'Sakral',
    outerAuthority: 'Sakral',
    incarnationCross: 'Right Angle Cross of Rulership',
    variables: 'PRL DLR',
    environment: 'Caves',
    motivation: 'Guilt',
    perspective: 'Individual',
    cognition: 'Smell',
    signature: 'Satisfaction',
    avatar: '/images/sarah.jpg'
  },
  {
    id: '2',
    name: 'Michael Schmidt',
    type: 'Projector',
    profile: '3/5',
    authority: 'Splenische Autorität',
    centers: ['Splenisch', 'Solar Plexus', 'Herz', 'G'],
    channels: ['10-20', '34-57', '25-51'],
    gates: ['10', '20', '34', '57', '25', '51'],
    definition: 'Single Definition',
    strategy: 'Warten auf die Einladung',
    notSelf: 'Bitterkeit',
    innerAuthority: 'Splenisch',
    outerAuthority: 'Splenisch',
    incarnationCross: 'Right Angle Cross of Planning',
    variables: 'PRL DLR',
    environment: 'Markets',
    motivation: 'Hope',
    perspective: 'Individual',
    cognition: 'Taste',
    signature: 'Success',
    avatar: '/images/michael.jpg'
  },
  {
    id: '3',
    name: 'Lisa Weber',
    type: 'Manifestor',
    profile: '1/3',
    authority: 'Splenische Autorität',
    centers: ['Splenisch', 'Solar Plexus', 'Herz', 'G'],
    channels: ['10-20', '34-57', '25-51'],
    gates: ['10', '20', '34', '57', '25', '51'],
    definition: 'Single Definition',
    strategy: 'Informieren',
    notSelf: 'Wut',
    innerAuthority: 'Splenisch',
    outerAuthority: 'Splenisch',
    incarnationCross: 'Right Angle Cross of Service',
    variables: 'PRL DLR',
    environment: 'Valleys',
    motivation: 'Fear',
    perspective: 'Individual',
    cognition: 'Sound',
    signature: 'Peace',
    avatar: '/images/lisa.jpg'
  },
  {
    id: '4',
    name: 'Tom Klein',
    type: 'Reflector',
    profile: '4/6',
    authority: 'Lunare Autorität',
    centers: ['Splenisch', 'Solar Plexus', 'Herz', 'G'],
    channels: ['10-20', '34-57', '25-51'],
    gates: ['10', '20', '34', '57', '25', '51'],
    definition: 'Single Definition',
    strategy: 'Warten auf den Mondzyklus',
    notSelf: 'Enttäuschung',
    innerAuthority: 'Lunar',
    outerAuthority: 'Lunar',
    incarnationCross: 'Right Angle Cross of Service',
    variables: 'PRL DLR',
    environment: 'Valleys',
    motivation: 'Fear',
    perspective: 'Individual',
    cognition: 'Sound',
    signature: 'Surprise',
    avatar: '/images/tom.jpg'
  }
];

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'generator':
      return <Zap size={20} />;
    case 'projector':
      return <Eye size={20} />;
    case 'manifestor':
      return <Flame size={20} />;
    case 'reflector':
      return <Moon size={20} />;
    default:
      return <Users size={20} />;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'generator':
      return '#10B981';
    case 'projector':
      return '#8B5CF6';
    case 'manifestor':
      return '#F59E0B';
    case 'reflector':
      return '#06B6D4';
    default:
      return '#6B7280';
  }
};

const getCompatibilityColor = (score: number) => {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

// const getCompatibilityIcon = (score: number) => {
//   if (score >= 80) return <CheckCircle size={20} />;
//   if (score >= 60) return <AlertCircle size={20} />;
//   return <XCircle size={20} />;
// };

export default function ChartComparisonPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCharts, setSelectedCharts] = useState<ChartData[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  // const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  
  // Erweiterte Features
  const [savedComparisons, setSavedComparisons] = useState<ComparisonResult[]>([]);
  const [showSavedComparisons, setShowSavedComparisons] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'compatibility'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'generator' | 'manifestor' | 'projector' | 'reflector'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [comparisonHistory, setComparisonHistory] = useState<ComparisonResult[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Geführter Prozess - Wizard States
  const [wizardStep, setWizardStep] = useState(0);
  const [showWizard, setShowWizard] = useState(true);
  const [wizardCompleted, setWizardCompleted] = useState(false);
  const [analysisType, setAnalysisType] = useState<'basic' | 'detailed' | 'comprehensive'>('basic');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [relationshipContext, setRelationshipContext] = useState<'romantic' | 'friendship' | 'business' | 'family' | 'general'>('general');

  useEffect(() => {
    loadUserSubscription();
  }, []);

  const loadUserSubscription = async () => {
    try {
      // Lade aus localStorage (wie in anderen Seiten)
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userSubscription = JSON.parse(localStorage.getItem('userSubscription') || '{}');
      
      const currentPlan = userData.subscriptionPlan || userSubscription.packageId || 'basic';
      
      setUserSubscription({
        userId: userData.id || 'unknown',
        packageId: currentPlan,
        status: userSubscription.status || 'active',
        startDate: userSubscription.startDate || new Date().toISOString(),
        endDate: userSubscription.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: userSubscription.autoRenew || false,
        paymentMethod: userSubscription.paymentMethod || 'none',
        billingCycle: userSubscription.billingCycle || 'monthly'
      });
      
      // Subscription erfolgreich geladen
    } catch (error) {
      console.error('Fehler beim Laden des Abonnements:', error);
      // Fallback: Basic-Plan
      setUserSubscription({
        userId: 'unknown',
        packageId: 'basic',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: false,
        paymentMethod: 'none',
        billingCycle: 'monthly'
      });
    }
  };

  const filteredCharts = mockCharts
    .filter(chart => {
      // Suchfilter
      const matchesSearch = chart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           chart.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           chart.profile.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Typfilter
      const matchesType = filterBy === 'all' || chart.type.toLowerCase() === filterBy.toLowerCase();
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'compatibility':
          // Simuliere Kompatibilität basierend auf Typ
          const aCompat = a.type === 'Generator' ? 90 : a.type === 'Manifestor' ? 80 : 70;
          const bCompat = b.type === 'Generator' ? 90 : b.type === 'Manifestor' ? 80 : 70;
          return bCompat - aCompat;
        default:
          return 0;
      }
    });

  const handleChartSelect = (chart: ChartData) => {
    if (selectedCharts.length < 2) {
      setSelectedCharts([...selectedCharts, chart]);
    }
  };

  const handleChartRemove = (chartId: string) => {
    setSelectedCharts(selectedCharts.filter(chart => chart.id !== chartId));
    setComparisonResult(null);
  };

  // Erweiterte Funktionen
  const saveComparison = (result: ComparisonResult) => {
    const savedComparison = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      chartNames: selectedCharts.map(c => c.name)
    };
    setSavedComparisons([...savedComparisons, savedComparison]);
    setComparisonHistory([...comparisonHistory, savedComparison]);
  };

  const exportComparison = (result: ComparisonResult) => {
    const exportData = {
      comparison: result,
      charts: selectedCharts,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart-comparison-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSavedComparison = (comparison: ComparisonResult) => {
    setComparisonResult(comparison);
    setShowComparison(true);
  };

  const clearHistory = () => {
    setComparisonHistory([]);
    setSavedComparisons([]);
  };

  const compareCharts = () => {
    if (selectedCharts.length === 2) {
      const [chart1, chart2] = selectedCharts;
      
      // Berechne Kompatibilität basierend auf gemeinsamen Elementen
      const sharedCenters = chart1.centers.filter(center => chart2.centers.includes(center));
      const sharedChannels = chart1.channels.filter(channel => chart2.channels.includes(channel));
      const sharedGates = chart1.gates.filter(gate => chart2.gates.includes(gate));
      
      // Basis-Kompatibilität
      let compatibility = Math.min(100, 
        (sharedCenters.length * 15) + 
        (sharedChannels.length * 20) + 
        (sharedGates.length * 5) + 
        (chart1.type === chart2.type ? 10 : 0)
      );

      // Wizard-basierte Anpassungen
      if (analysisType === 'detailed') {
        compatibility += 5; // Detaillierte Analyse gibt bessere Ergebnisse
      } else if (analysisType === 'comprehensive') {
        compatibility += 10; // Komplette Analyse gibt die besten Ergebnisse
      }

      // Beziehungskontext-Anpassungen
      if (relationshipContext === 'romantic') {
        // Romantische Beziehungen haben andere Gewichtungen
        compatibility = Math.min(100, compatibility + (sharedCenters.length * 5));
      } else if (relationshipContext === 'business') {
        // Geschäftliche Beziehungen fokussieren auf Authority und Strategie
        compatibility = Math.min(100, compatibility + (chart1.authority === chart2.authority ? 15 : 0));
      }

      const differences = [
        `${chart1.type} vs ${chart2.type}`,
        `${chart1.profile} vs ${chart2.profile}`,
        `${chart1.authority} vs ${chart2.authority}`
      ];

      // Personalisierte Empfehlungen basierend auf Wizard-Einstellungen
      const baseRecommendations = [
        `Beide sind ${sharedCenters.length > 0 ? 'sehr' : 'mäßig'} kompatibel`,
        `Gemeinsame Kanäle: ${sharedChannels.join(', ') || 'Keine'}`,
        `Gemeinsame Tore: ${sharedGates.join(', ') || 'Keine'}`,
        `Empfehlung: ${compatibility >= 80 ? 'Sehr harmonische Verbindung' : compatibility >= 60 ? 'Gute Verbindung mit Potenzial' : 'Interessante Herausforderung'}`
      ];

      // Kontext-spezifische Empfehlungen
      const contextRecommendations = [];
      if (relationshipContext === 'romantic') {
        contextRecommendations.push('💕 Romantische Tipps: Respektiert eure unterschiedlichen Authority-Typen');
        contextRecommendations.push('💕 Kommunikation: Nutzt eure gemeinsamen Zentren für tiefere Verbindung');
      } else if (relationshipContext === 'business') {
        contextRecommendations.push('💼 Geschäftlich: Fokussiert auf gemeinsame Strategien und Authority');
        contextRecommendations.push('💼 Teamwork: Nutzt komplementäre Energien für Projekte');
      } else if (relationshipContext === 'family') {
        contextRecommendations.push('👨‍👩‍👧‍👦 Familie: Versteht die unterschiedlichen Bedürfnisse');
        contextRecommendations.push('👨‍👩‍👧‍👦 Harmonie: Respektiert individuelle Authority-Typen');
      }

      // Fokus-Bereiche Empfehlungen
      const focusRecommendations = [];
      if (focusAreas.includes('communication')) {
        focusRecommendations.push('💬 Kommunikation: Nutzt eure gemeinsamen Kanäle für besseres Verständnis');
      }
      if (focusAreas.includes('energy')) {
        focusRecommendations.push('⚡ Energie: Achtet auf eure unterschiedlichen Energie-Rhythmen');
      }
      if (focusAreas.includes('challenges')) {
        focusRecommendations.push('⚠️ Herausforderungen: Arbeitet gemeinsam an Konfliktlösungen');
      }
      if (focusAreas.includes('growth')) {
        focusRecommendations.push('🌱 Wachstum: Nutzt eure Unterschiede für gegenseitige Entwicklung');
      }

      const recommendations = [...baseRecommendations, ...contextRecommendations, ...focusRecommendations];

      // Erweiterte Analyse-Features
      const compatibilityMatrix = {
        emotional: Math.min(100, compatibility + Math.floor(Math.random() * 20) - 10),
        mental: Math.min(100, compatibility + Math.floor(Math.random() * 20) - 10),
        physical: Math.min(100, compatibility + Math.floor(Math.random() * 20) - 10),
        spiritual: Math.min(100, compatibility + Math.floor(Math.random() * 20) - 10)
      };

      const energyFlowAnalysis = {
        dominant: `${chart1.type} → ${chart2.type}`,
        secondary: `${chart2.type} → ${chart1.type}`,
        potential: compatibility >= 80 ? 'Harmonische Energie-Synchronisation' : 
                  compatibility >= 60 ? 'Ausgewogene Energie-Dynamik' : 'Herausfordernde Energie-Interaktion',
        challenges: [
          'Unterschiedliche Energie-Rhythmen',
          'Verschiedene Reaktionszeiten',
          'Divergente Prioritäten'
        ]
      };

      const conflictPotential = {
        score: Math.max(10, 100 - compatibility + Math.floor(Math.random() * 20) - 10),
        areas: [
          'Kommunikationsstil',
          'Entscheidungsfindung',
          'Energie-Management'
        ],
        triggers: [
          'Unklare Erwartungen',
          'Unterschiedliche Authority-Typen',
          'Verschiedene Strategien'
        ],
        solutions: [
          'Klare Kommunikation etablieren',
          'Gegenseitige Authority respektieren',
          'Gemeinsame Strategien entwickeln'
        ]
      };

      const relationshipDynamics = {
        strengths: [
          'Komplementäre Energien',
          'Gemeinsame Zentren',
          'Harmonische Kanäle'
        ],
        challenges: [
          'Unterschiedliche Authority-Typen',
          'Verschiedene Strategien',
          'Divergente Profile'
        ],
        growthAreas: [
          'Kommunikation verbessern',
          'Gegenseitiges Verständnis',
          'Gemeinsame Ziele entwickeln'
        ],
        communication: `${chart1.authority} und ${chart2.authority} Kommunikationsstil`
      };

      const detailedInsights = {
        authority: `${chart1.authority} + ${chart2.authority} = Harmonische Entscheidungsfindung`,
        strategy: `${chart1.strategy} + ${chart2.strategy} = Ausgewogene Herangehensweise`,
        signature: `${chart1.signature} + ${chart2.signature} = Erfüllte Beziehung`,
        notSelf: 'Vermeide Frustration durch unterschiedliche Authority-Typen'
      };

      const result: ComparisonResult = {
        compatibility,
        sharedCenters,
        sharedChannels,
        sharedGates,
        differences,
        recommendations,
        energyFlow: `${chart1.type} und ${chart2.type} Energie-Flow`,
        communication: `${chart1.authority} und ${chart2.authority} Kommunikation`,
        relationship: `${chart1.profile} und ${chart2.profile} Beziehung`,
        compatibilityMatrix,
        energyFlowAnalysis,
        conflictPotential,
        relationshipDynamics,
        detailedInsights
      };

      setComparisonResult(result);
      setShowComparison(true);
    }
  };

  // Wizard Steps
  const wizardSteps = [
    {
      title: "Willkommen zum Chart-Vergleich",
      description: "Lass uns gemeinsam eine tiefgreifende Analyse deiner Human Design Charts erstellen",
      icon: <Users size={32} />,
      content: (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
            🎯 Geführter Chart-Vergleich
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: 600, mx: 'auto' }}>
            Dieser Wizard führt dich durch einen strukturierten Prozess, um die perfekte Chart-Analyse zu erstellen. 
            Wir werden gemeinsam die wichtigsten Aspekte deiner Beziehung oder Verbindung analysieren.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip 
              label="🎯 Zielgerichtete Analyse" 
              sx={{ bgcolor: 'rgba(255, 215, 0, 0.2)', color: '#FFD700', border: '1px solid rgba(255, 215, 0, 0.3)' }}
            />
            <Chip 
              label="📊 Detaillierte Insights" 
              sx={{ bgcolor: 'rgba(78, 205, 196, 0.2)', color: '#4ECDC4', border: '1px solid rgba(78, 205, 196, 0.3)' }}
            />
            <Chip 
              label="💡 Praktische Empfehlungen" 
              sx={{ bgcolor: 'rgba(155, 89, 182, 0.2)', color: '#9B59B6', border: '1px solid rgba(155, 89, 182, 0.3)' }}
            />
          </Box>
        </Box>
      )
    },
    {
      title: "Analyse-Typ wählen",
      description: "Welche Art von Analyse möchtest du durchführen?",
      icon: <BarChart3 size={32} />,
      content: (
        <Box sx={{ py: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  background: analysisType === 'basic' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: analysisType === 'basic' ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { background: 'rgba(255, 215, 0, 0.1)' }
                }}
                onClick={() => setAnalysisType('basic')}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    🚀 Basis-Analyse
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    Schnelle Übersicht über Kompatibilität und gemeinsame Elemente
                  </Typography>
                  <Chip label="5-10 Min" size="small" sx={{ bgcolor: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  background: analysisType === 'detailed' ? 'rgba(78, 205, 196, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: analysisType === 'detailed' ? '2px solid #4ECDC4' : '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { background: 'rgba(78, 205, 196, 0.1)' }
                }}
                onClick={() => setAnalysisType('detailed')}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    🔍 Detaillierte Analyse
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    Umfassende Betrachtung aller Aspekte mit praktischen Empfehlungen
                  </Typography>
                  <Chip label="15-20 Min" size="small" sx={{ bgcolor: 'rgba(78, 205, 196, 0.2)', color: '#4ECDC4' }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  background: analysisType === 'comprehensive' ? 'rgba(155, 89, 182, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: analysisType === 'comprehensive' ? '2px solid #9B59B6' : '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { background: 'rgba(155, 89, 182, 0.1)' }
                }}
                onClick={() => setAnalysisType('comprehensive')}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    🌟 Komplette Analyse
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    Vollständige Analyse mit allen erweiterten Features und Insights
                  </Typography>
                  <Chip label="25-30 Min" size="small" sx={{ bgcolor: 'rgba(155, 89, 182, 0.2)', color: '#9B59B6' }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      title: "Beziehungskontext",
      description: "In welchem Kontext möchtest du die Charts vergleichen?",
      icon: <Heart size={32} />,
      content: (
        <Box sx={{ py: 2 }}>
          <Grid container spacing={2}>
            {[
              { value: 'romantic', label: '💕 Romantische Beziehung', description: 'Liebe, Partnerschaft, Dating' },
              { value: 'friendship', label: '👥 Freundschaft', description: 'Freunde, Bekannte, soziale Verbindungen' },
              { value: 'business', label: '💼 Geschäftlich', description: 'Arbeitskollegen, Geschäftspartner' },
              { value: 'family', label: '👨‍👩‍👧‍👦 Familie', description: 'Familienmitglieder, Verwandte' },
              { value: 'general', label: '🌐 Allgemein', description: 'Allgemeine Kompatibilität' }
            ].map((context) => (
              <Grid item xs={12} sm={6} key={context.value}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    background: relationshipContext === context.value ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: relationshipContext === context.value ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': { background: 'rgba(255, 215, 0, 0.1)' }
                  }}
                  onClick={() => setRelationshipContext(context.value as 'romantic' | 'friendship' | 'business' | 'family' | 'general')}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      {context.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {context.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )
    },
    {
      title: "Fokus-Bereiche",
      description: "Welche Aspekte sind für dich am wichtigsten? (Mehrfachauswahl möglich)",
      icon: <Target size={32} />,
      content: (
        <Box sx={{ py: 2 }}>
          <Grid container spacing={2}>
            {[
              { id: 'communication', label: '💬 Kommunikation', description: 'Wie gut versteht ihr euch?' },
              { id: 'energy', label: '⚡ Energie-Flow', description: 'Harmonische oder herausfordernde Energien' },
              { id: 'authority', label: '🎯 Authority & Strategie', description: 'Entscheidungsfindung und Herangehensweise' },
              { id: 'centers', label: '🔮 Zentren & Kanäle', description: 'Gemeinsame und unterschiedliche Zentren' },
              { id: 'gates', label: '🚪 Gates & Profile', description: 'Persönlichkeitsprofile und Tore' },
              { id: 'challenges', label: '⚠️ Herausforderungen', description: 'Potenzielle Konfliktbereiche' },
              { id: 'growth', label: '🌱 Wachstum', description: 'Entwicklungsmöglichkeiten' },
              { id: 'compatibility', label: '💫 Kompatibilität', description: 'Gesamte Harmonie der Verbindung' }
            ].map((area) => (
              <Grid item xs={12} sm={6} md={4} key={area.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    background: focusAreas.includes(area.id) ? 'rgba(78, 205, 196, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: focusAreas.includes(area.id) ? '2px solid #4ECDC4' : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': { background: 'rgba(78, 205, 196, 0.1)' }
                  }}
                  onClick={() => {
                    if (focusAreas.includes(area.id)) {
                      setFocusAreas(focusAreas.filter(f => f !== area.id));
                    } else {
                      setFocusAreas([...focusAreas, area.id]);
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1, fontSize: '1rem' }}>
                      {area.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                      {area.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )
    },
    {
      title: "Chart-Auswahl",
      description: "Wähle die beiden Charts aus, die du vergleichen möchtest",
      icon: <GitCompare size={32} />,
      content: (
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
            Verfügbare Charts ({filteredCharts.length})
          </Typography>
          <Grid container spacing={2}>
            {filteredCharts.map((chart) => (
              <Grid item xs={12} sm={6} md={4} key={chart.id}>
                <Card 
                  sx={{ 
                    cursor: selectedCharts.length < 2 ? 'pointer' : 'default',
                    background: selectedCharts.some(c => c.id === chart.id) ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedCharts.some(c => c.id === chart.id) ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    opacity: selectedCharts.some(c => c.id === chart.id) ? 1 : selectedCharts.length >= 2 ? 0.5 : 1,
                    '&:hover': selectedCharts.length < 2 ? { background: 'rgba(255, 215, 0, 0.1)' } : {}
                  }}
                  onClick={() => handleChartSelect(chart)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        width: 40, 
                        height: 40, 
                        mr: 2,
                        bgcolor: getTypeColor(chart.type)
                      }}>
                        {getTypeIcon(chart.type)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontSize: '1rem' }}>
                          {chart.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {chart.type} • {chart.profile}
                        </Typography>
                      </Box>
                      {selectedCharts.some(c => c.id === chart.id) && (
                        <CheckCircle size={20} color="#FFD700" />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={chart.authority} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255, 215, 0, 0.2)', 
                          color: '#FFD700',
                          fontSize: '0.7rem'
                        }} 
                      />
                      <Chip 
                        label={chart.definition} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(78, 205, 196, 0.2)', 
                          color: '#4ECDC4',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {selectedCharts.length > 0 && (
            <Box sx={{ mt: 4, p: 3, background: 'rgba(255, 215, 0, 0.1)', borderRadius: 2, border: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
                Ausgewählte Charts ({selectedCharts.length}/2)
              </Typography>
              <Grid container spacing={2}>
                {selectedCharts.map((chart) => (
                  <Grid item xs={12} sm={6} key={chart.id}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 2,
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          width: 40, 
                          height: 40, 
                          mr: 2,
                          bgcolor: getTypeColor(chart.type)
                        }}>
                          {getTypeIcon(chart.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                            {chart.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {chart.type} • {chart.profile}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton 
                        onClick={() => handleChartRemove(chart.id)}
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        <XCircle size={20} />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )
    }
  ];

  return (
    <AccessControl 
      path={pathname} 
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/pricing')}
    >
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                mb: 3,
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}
            >
              📊 Chart-Vergleich
        </Typography>
        
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 600,
                mx: 'auto',
                mb: 4
              }}
            >
              Vergleiche Human Design Charts und entdecke Kompatibilität, 
              gemeinsame Elemente und Beziehungsdynamiken
            </Typography>
          </Box>
        </motion.div>

        {/* Geführter Wizard */}
        {showWizard && !wizardCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                {/* Wizard Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    mb: 2
                  }}>
                    {wizardSteps[wizardStep].icon}
                  </Box>
                  <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                    {wizardSteps[wizardStep].title}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                    {wizardSteps[wizardStep].description}
                  </Typography>
                  
                  {/* Progress Bar */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      gap: 1,
                      mb: 2
                    }}>
                      {wizardSteps.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: index <= wizardStep ? '#FFD700' : 'rgba(255, 255, 255, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Schritt {wizardStep + 1} von {wizardSteps.length}
                    </Typography>
                  </Box>
                </Box>

                {/* Wizard Content */}
                {wizardSteps[wizardStep].content}

                {/* Wizard Navigation */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 4,
                  pt: 3,
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowWizard(false)}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
                    }}
                  >
                    Wizard überspringen
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {wizardStep > 0 && (
                      <Button
                        variant="outlined"
                        onClick={() => setWizardStep(wizardStep - 1)}
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          borderColor: 'rgba(255,255,255,0.3)',
                          '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
                        }}
                      >
                        Zurück
                      </Button>
                    )}
                    
                    {wizardStep < wizardSteps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={() => setWizardStep(wizardStep + 1)}
                        sx={{
                          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                          color: '#1a1a2e',
                          fontWeight: 'bold',
                          px: 4
                        }}
                      >
                        Weiter
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => {
                          setWizardCompleted(true);
                          setShowWizard(false);
                          if (selectedCharts.length === 2) {
                            compareCharts();
                          }
                        }}
                        disabled={selectedCharts.length < 2}
                        sx={{
                          background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
                          color: 'white',
                          fontWeight: 'bold',
                          px: 4
                        }}
                      >
                        Analyse starten
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Wizard Summary & Restart */}
        {wizardCompleted && !showWizard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ 
              background: 'rgba(78, 205, 196, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              borderRadius: 4,
              mb: 4
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      🎯 Analyse-Konfiguration
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {analysisType === 'basic' ? '🚀 Basis-Analyse' : 
                       analysisType === 'detailed' ? '🔍 Detaillierte Analyse' : 
                       '🌟 Komplette Analyse'} • {relationshipContext === 'romantic' ? '💕 Romantisch' :
                       relationshipContext === 'friendship' ? '👥 Freundschaft' :
                       relationshipContext === 'business' ? '💼 Geschäftlich' :
                       relationshipContext === 'family' ? '👨‍👩‍👧‍👦 Familie' : '🌐 Allgemein'} • 
                      {focusAreas.length} Fokus-Bereiche
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowWizard(true);
                      setWizardCompleted(false);
                      setWizardStep(0);
                    }}
                    startIcon={<RotateCcw size={16} />}
                    sx={{
                      borderColor: 'rgba(78, 205, 196, 0.5)',
                      color: '#4ECDC4',
                      '&:hover': { borderColor: '#4ECDC4', backgroundColor: 'rgba(78, 205, 196, 0.1)' }
                    }}
                  >
                    Wizard neu starten
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Erweiterte Toolbar */}
        {!showWizard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          <Card sx={{ 
            mb: 4,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 3 }}>
              {/* Suchleiste */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Suche nach Namen, Typ oder Profil..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: 8, color: '#666' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '& .MuiInputBase-input': {
                        color: '#1a1a2e'
                      }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#666',
                      opacity: 1
                    }
                  }}
                />
              </Box>

              {/* Filter und Sortierung */}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Typ filtern"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as 'all' | 'generator' | 'manifestor' | 'projector' | 'reflector')}
                    size="small"
                    fullWidth
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 2,
                        '& .MuiInputBase-input': {
                          color: '#1a1a2e'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666',
                        '&.Mui-focused': {
                          color: '#1a1a2e'
                        },
                        '&.MuiInputLabel-shrink': {
                          color: '#1a1a2e'
                        }
                      }
                    }}
                  >
                    <MenuItem value="all">Alle Typen</MenuItem>
                    <MenuItem value="generator">Generator</MenuItem>
                    <MenuItem value="manifestor">Manifestor</MenuItem>
                    <MenuItem value="projector">Projector</MenuItem>
                    <MenuItem value="reflector">Reflector</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Sortieren nach"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'type' | 'compatibility')}
                    size="small"
                    fullWidth
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 2,
                        '& .MuiInputBase-input': {
                          color: '#1a1a2e'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666',
                        '&.Mui-focused': {
                          color: '#1a1a2e'
                        },
                        '&.MuiInputLabel-shrink': {
                          color: '#1a1a2e'
                        }
                      }
                    }}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="type">Typ</MenuItem>
                    <MenuItem value="compatibility">Kompatibilität</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('grid')}
                      size="small"
                      sx={{ 
                        minWidth: 'auto',
                        px: 2,
                        bgcolor: viewMode === 'grid' ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white'
                      }}
                    >
                      <BarChart3 size={16} />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('list')}
                      size="small"
                      sx={{ 
                        minWidth: 'auto',
                        px: 2,
                        bgcolor: viewMode === 'list' ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white'
                      }}
                    >
                      <ListIcon size={16} />
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowSavedComparisons(true)}
                      size="small"
                      startIcon={<Bookmark size={16} />}
                      sx={{ 
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        '&:hover': { borderColor: '#FFD700' }
                      }}
                    >
                      Gespeichert ({savedComparisons.length})
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      size="small"
                      startIcon={<Filter size={16} />}
                      sx={{ 
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        '&:hover': { borderColor: '#FFD700' }
                      }}
                    >
                      Filter
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Erweiterte Filter */}
              {showAdvancedFilters && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Erweiterte Filter
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Min. Kompatibilität"
                        type="number"
                        size="small"
                        fullWidth
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 2,
                            '& .MuiInputBase-input': {
                              color: '#1a1a2e'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#1a1a2e'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Authority"
                        select
                        size="small"
                        fullWidth
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 2,
                            '& .MuiInputBase-input': {
                              color: '#1a1a2e'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#1a1a2e'
                          }
                        }}
                      >
                        <MenuItem value="all">Alle</MenuItem>
                        <MenuItem value="sacral">Sacral</MenuItem>
                        <MenuItem value="solar">Solar Plexus</MenuItem>
                        <MenuItem value="spleen">Spleen</MenuItem>
                        <MenuItem value="heart">Heart</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Definition"
                        select
                        size="small"
                        fullWidth
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 2,
                            '& .MuiInputBase-input': {
                              color: '#1a1a2e'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#1a1a2e'
                          }
                        }}
                      >
                        <MenuItem value="all">Alle</MenuItem>
                        <MenuItem value="single">Single Definition</MenuItem>
                        <MenuItem value="split">Split Definition</MenuItem>
                        <MenuItem value="triple">Triple Split</MenuItem>
                        <MenuItem value="quad">Quad Split</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<RotateCcw size={16} />}
                          sx={{ 
                            bgcolor: 'rgba(255, 215, 0, 0.2)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.3)' }
                          }}
                        >
                          Filter anwenden
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
        )}

        {/* Selected Charts */}
        {selectedCharts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              mb: 4
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Ausgewählte Charts ({selectedCharts.length}/2)
                </Typography>
                <Grid container spacing={2}>
                  {selectedCharts.map((chart) => (
                    <Grid item xs={12} sm={6} key={chart.id}>
                      <Card sx={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ 
                                width: 40, 
                                height: 40, 
                                mr: 2,
                                bgcolor: getTypeColor(chart.type)
                              }}>
                                {getTypeIcon(chart.type)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                                  {chart.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  {chart.type} • {chart.profile}
        </Typography>
                              </Box>
                            </Box>
                            <IconButton 
                              onClick={() => handleChartRemove(chart.id)}
                              sx={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              <XCircle size={20} />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {selectedCharts.length === 2 && (
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button 
          variant="contained"
                      onClick={compareCharts}
                      startIcon={<GitCompare />}
          sx={{ 
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        color: '#1a1a2e',
                        fontWeight: 'bold',
            px: 4,
                        py: 2
                      }}
                    >
                      Charts vergleichen
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Available Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
            Verfügbare Charts
          </Typography>
          
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredCharts.map((chart, index) => (
                <Grid item xs={12} sm={6} md={4} key={chart.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                      cursor: selectedCharts.length < 2 ? 'pointer' : 'default',
                      transition: 'all 0.3s ease',
                      opacity: selectedCharts.some(c => c.id === chart.id) ? 0.5 : 1,
                      '&:hover': selectedCharts.length < 2 ? {
                        background: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                      } : {}
                    }}
                    onClick={() => handleChartSelect(chart)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ 
                          width: 50, 
                          height: 50, 
                          mr: 2,
                          bgcolor: getTypeColor(chart.type)
                        }}>
                          {getTypeIcon(chart.type)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            {chart.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {chart.type} • {chart.profile}
                          </Typography>
                        </Box>
                        {selectedCharts.length < 2 && (
                          <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            <Plus size={20} />
                          </IconButton>
                        )}
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={chart.authority}
                          size="small"
                          sx={{
                            bgcolor: `${getTypeColor(chart.type)}20`,
                            color: getTypeColor(chart.type),
                            border: `1px solid ${getTypeColor(chart.type)}40`,
                            mr: 1,
                            mb: 1
                          }}
                        />
                        <Chip
                          label={chart.definition}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            mb: 1
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <strong>Strategie:</strong> {chart.strategy}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <strong>Signature:</strong> {chart.signature}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          ) : (
            // Listen-Ansicht
            <Box>
              {filteredCharts.map((chart, index) => (
                <motion.div
                  key={chart.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    sx={{ 
                      mb: 2,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateX(5px)'
                      }
                    }}
                    onClick={() => handleChartSelect(chart)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}>
                          {chart.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ color: 'white', mb: 0.5 }}>
                            {chart.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={chart.type} 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(255, 215, 0, 0.2)', 
                                color: '#FFD700',
                                fontSize: '0.75rem'
                              }} 
                            />
                            <Chip 
                              label={chart.profile} 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(78, 205, 196, 0.2)', 
                                color: '#4ecdc4',
                                fontSize: '0.75rem'
                              }} 
                            />
                            <Chip 
                              label={chart.authority} 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(69, 183, 209, 0.2)', 
                                color: '#45b7d1',
                                fontSize: '0.75rem'
                              }} 
                            />
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                            {chart.centers.length} Centers
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {chart.channels.length} Channels
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          )}
        </motion.div>

        {/* Comparison Dialog */}
        <Dialog
          open={showComparison}
          onClose={() => setShowComparison(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3,
              maxHeight: '90vh'
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            📊 Chart-Vergleichsergebnis
          </DialogTitle>
          <DialogContent sx={{ color: 'white' }}>
            {comparisonResult && (
              <Box>
                {/* Compatibility Score */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${getCompatibilityColor(comparisonResult.compatibility)}, ${getCompatibilityColor(comparisonResult.compatibility)}80)`,
                    mb: 2
                  }}>
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {comparisonResult.compatibility}%
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Kompatibilität
                  </Typography>
                </Box>

                {/* Shared Elements */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                          {comparisonResult.sharedCenters.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          Gemeinsame Zentren
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                          {comparisonResult.sharedChannels.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          Gemeinsame Kanäle
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                          {comparisonResult.sharedGates.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          Gemeinsame Tore
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Erweiterte Analyse-Features */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  {/* Kompatibilitäts-Matrix */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mb: 2
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BarChart3 size={20} />
                          Kompatibilitäts-Matrix
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                {comparisonResult.compatibilityMatrix.emotional}%
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Emotional
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                                {comparisonResult.compatibilityMatrix.mental}%
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Mental
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" sx={{ color: '#45b7d1', fontWeight: 'bold' }}>
                                {comparisonResult.compatibilityMatrix.physical}%
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Physical
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" sx={{ color: '#f9ca24', fontWeight: 'bold' }}>
                                {comparisonResult.compatibilityMatrix.spiritual}%
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Spiritual
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Energie-Flow-Analyse */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mb: 2
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Activity size={20} />
                          Energie-Flow-Analyse
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                            <strong>Dominant:</strong> {comparisonResult.energyFlowAnalysis.dominant}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                            <strong>Sekundär:</strong> {comparisonResult.energyFlowAnalysis.secondary}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            <strong>Potenzial:</strong> {comparisonResult.energyFlowAnalysis.potential}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          <strong>Herausforderungen:</strong>
                        </Typography>
                        <List dense>
                          {comparisonResult.energyFlowAnalysis.challenges.map((challenge, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 20 }}>
                                <AlertTriangle size={16} color="#f39c12" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {challenge}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Konflikt-Potential */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mb: 2
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AlertTriangle size={20} />
                          Konflikt-Potential
                        </Typography>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <Typography variant="h3" sx={{ 
                            color: comparisonResult.conflictPotential.score > 70 ? '#e74c3c' : 
                                   comparisonResult.conflictPotential.score > 40 ? '#f39c12' : '#27ae60',
                            fontWeight: 'bold'
                          }}>
                            {comparisonResult.conflictPotential.score}%
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                          <strong>Bereiche:</strong> {comparisonResult.conflictPotential.areas.join(', ')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          <strong>Lösungen:</strong> {comparisonResult.conflictPotential.solutions.join(', ')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Beziehungsdynamik */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mb: 2
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Heart size={20} />
                          Beziehungsdynamik
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                            <strong>Stärken:</strong> {comparisonResult.relationshipDynamics.strengths.join(', ')}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                            <strong>Herausforderungen:</strong> {comparisonResult.relationshipDynamics.challenges.join(', ')}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            <strong>Wachstumsbereiche:</strong> {comparisonResult.relationshipDynamics.growthAreas.join(', ')}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Detaillierte Insights */}
                  <Grid item xs={12}>
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mb: 2
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Brain size={20} />
                          Detaillierte Insights
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                              <strong>Authority:</strong> {comparisonResult.detailedInsights.authority}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                              <strong>Strategie:</strong> {comparisonResult.detailedInsights.strategy}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                              <strong>Signature:</strong> {comparisonResult.detailedInsights.signature}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              <strong>Not-Self:</strong> {comparisonResult.detailedInsights.notSelf}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Recommendations */}
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600, mt: 3 }}>
                  💡 Empfehlungen
                </Typography>
                <List>
                  {comparisonResult.recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#22c55e" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {rec}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                onClick={() => setShowComparison(false)}
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
                variant="outlined"
              >
                Schließen
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Save />}
                onClick={() => comparisonResult && saveComparison(comparisonResult)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': { borderColor: '#4ecdc4' }
                }}
              >
                Speichern
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => comparisonResult && exportComparison(comparisonResult)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': { borderColor: '#45b7d1' }
                }}
              >
                Export
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Share />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': { borderColor: '#f9ca24' }
                }}
              >
                Teilen
              </Button>
              
              <Button
                variant="outlined"
                startIcon={isFullscreen ? <Minimize2 /> : <Maximize2 />}
                onClick={() => setIsFullscreen(!isFullscreen)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': { borderColor: '#FFD700' }
                }}
              >
                {isFullscreen ? 'Verkleinern' : 'Vollbild'}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* Gespeicherte Vergleiche Dialog */}
        <Dialog
          open={showSavedComparisons}
          onClose={() => setShowSavedComparisons(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            📚 Gespeicherte Vergleiche
          </DialogTitle>
          <DialogContent sx={{ color: 'white' }}>
            {savedComparisons.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Bookmark size={64} color="rgba(255,255,255,0.3)" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                  Noch keine Vergleiche gespeichert
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  Speichere deine ersten Chart-Vergleiche, um sie hier wiederzufinden
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {savedComparisons.map((comparison, index) => (
                  <Grid item xs={12} key={comparison.id || index}>
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mb: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                              {comparison.chartNames?.join(' vs ') || 'Chart-Vergleich'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                              Kompatibilität: {comparison.compatibility}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              {comparison.timestamp ? new Date(comparison.timestamp).toLocaleDateString('de-DE') : 'Unbekannt'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => loadSavedComparison(comparison)}
                              sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'white',
                                '&:hover': { borderColor: '#FFD700' }
                              }}
                            >
                              Öffnen
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => exportComparison(comparison)}
                              sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'white',
                                '&:hover': { borderColor: '#45b7d1' }
                              }}
                            >
                              <Download size={16} />
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setShowSavedComparisons(false)}
              sx={{
                color: 'rgba(255,255,255,0.7)',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
              variant="outlined"
            >
              Schließen
            </Button>
            {savedComparisons.length > 0 && (
              <Button
                variant="outlined"
                onClick={clearHistory}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#e74c3c',
                  '&:hover': { borderColor: '#e74c3c' }
                }}
              >
                Alle löschen
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
    </AccessControl>
  );
}
