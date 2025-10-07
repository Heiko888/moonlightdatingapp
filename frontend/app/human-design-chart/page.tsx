'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Chip, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Tabs, 
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Star, 
  User, 
  Brain, 
  Crown, 
  Target, 
  Zap, 
  Shield, 
  Share2, 
  Download, 
  Moon,
  Activity,
  TrendingUp,
  BookOpen,
  Users,
  Calendar,
  Heart,
} from 'lucide-react';
import AccessControl from '../../components/AccessControl';
// import { UserSubscription } from '../../lib/subscription/types'; // Entfernt - nicht mehr benötigt
// import { SubscriptionService } from '../../lib/subscription/subscriptionService'; // Entfernt - nicht mehr benötigt
import { safeJsonParse } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import UnifiedPageLayout from '../../components/UnifiedPageLayout';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chart-tabpanel-${index}`}
      aria-labelledby={`chart-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function HumanDesignChartPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [userSubscription, setUserSubscription] = useState<any>(null); // Temporär any-Typ
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chartData, setChartData] = useState<{
    hdChart?: {
      type: string;
      profile: string;
      authority: string;
      strategy: string;
      incarnationCross: string | {
        name: string;
        sunGate: number;
        earthGate: number;
        sunLine: number;
        earthLine: number;
        description?: string;
        lifeTheme?: string;
        purpose?: string;
        challenges?: string;
        gifts?: string;
        affirmation?: string;
      };
    };
    user?: {
      hdType?: string;
      profile?: string;
      authority?: string;
    };
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      
      if (!token || !userId) {
        setIsAuthenticated(false);
        // Lade trotzdem Chart-Daten für Demo-Zwecke
        await loadDemoChartData();
        return;
      }
      
      setIsAuthenticated(true);
      await loadUserSubscription();
      await loadChartData();
    };

    checkAuth();
  }, []);

  const loadDemoChartData = async () => {
    try {
      console.log('🎯 Lade Demo-Chart-Daten...');
      
      // Supabase Chart-Berechnung
      const { ChartService } = await import('../../lib/supabase/services');
      
      // Lade existierende Charts für Demo-User
      const existingCharts = await ChartService.getCharts('demo-user-id');
      let response;
      
      if (existingCharts.length > 0) {
        // Verwende existierenden Chart
        const chart = existingCharts[0];
        response = { 
          ok: true, 
          json: () => Promise.resolve({ 
            success: true, 
            chart: {
              name: chart.name,
              birth_date: chart.birth_date,
              birth_time: chart.birth_time,
              birth_place: chart.birth_place,
              hd_type: chart.hd_type,
              authority: chart.authority,
              strategy: chart.strategy,
              profile: chart.profile,
              incarnation_cross: chart.incarnation_cross,
              centers: chart.centers,
              channels: chart.channels,
              gates: chart.gates,
              planets: chart.planets
            }
          }) 
        };
      } else {
        // Erstelle neuen Demo-Chart
        const demoChart = await ChartService.createChart({
          user_id: 'demo-user-id',
          name: 'Demo User',
          birth_date: '1980-12-08',
          birth_time: '22:10',
          birth_place: 'Miltenberg, Deutschland',
          hd_type: 'Projector',
          authority: 'Splenic',
          strategy: 'Wait for the Invitation',
          profile: '3/5',
          incarnation_cross: 'Right Angle Cross of the Sleeping Phoenix',
          centers: {
            head: { defined: true, color: '#FF6B6B' },
            ajna: { defined: true, color: '#4ECDC4' },
            throat: { defined: false, color: '#45B7D1' },
            g_center: { defined: true, color: '#96CEB4' },
            heart: { defined: false, color: '#FFEAA7' },
            solar_plexus: { defined: true, color: '#DDA0DD' },
            sacral: { defined: false, color: '#98D8C8' },
            root: { defined: true, color: '#F7DC6F' }
          },
          channels: [
            { number: 1, name: 'Channel of Inspiration', gates: [1, 8] },
            { number: 2, name: 'Channel of Abstraction', gates: [2, 14] }
          ],
          gates: [
            { number: 1, name: 'Gate of Self-Expression', line: 1 },
            { number: 8, name: 'Gate of Contribution', line: 3 }
          ],
          planets: {
            sun: { sign: 'Sagittarius', degree: 16 },
            moon: { sign: 'Cancer', degree: 8 },
            mercury: { sign: 'Sagittarius', degree: 2 },
            venus: { sign: 'Scorpio', degree: 28 },
            mars: { sign: 'Capricorn', degree: 12 }
          }
        });
        
        response = { 
          ok: true, 
          json: () => Promise.resolve({ 
            success: true, 
            chart: demoChart 
          }) 
        };
      }

      if (response.ok) {
        const chartResult = await response.json();
        console.log('✅ Demo-Chart-Berechnung erfolgreich:', chartResult);
        
        // Extrahiere die Metadaten aus der korrekten Struktur
        const metadata = chartResult.chart;
        console.log('📊 Demo-Metadaten:', metadata);
        
        // Speichere die berechneten Daten
        setChartData({
          hdChart: {
            type: metadata?.hd_type || 'Generator',
            profile: metadata?.profile || '6/3',
            authority: metadata?.authority || 'Emotional',
            strategy: metadata?.strategy || 'Warten auf eine Frage',
            incarnationCross: metadata?.incarnation_cross || {
              name: 'Right Angle Cross of the Vessel of Love',
              sunGate: 6,
              earthGate: 36,
              sunLine: 6,
              earthLine: 3,
              description: 'Das Inkarnationskreuz des Gefäßes der Liebe - du bist hier, um Liebe zu empfangen und zu geben',
              lifeTheme: 'Liebe durch Transformation und Wachstum',
              purpose: 'Andere durch deine Fähigkeit zu lieben und zu transformieren zu inspirieren',
              challenges: 'Liebe ohne Bedingungen zu geben und zu empfangen',
              gifts: 'Transformative Liebe, emotionale Tiefe, Heilung',
              affirmation: 'Ich bin ein Gefäß der Liebe und Transformation'
            }
          },
          user: {
            hdType: metadata?.hd_type,
            profile: metadata?.profile,
            authority: metadata?.authority
          }
        });
      } else {
        console.error('❌ Demo-Chart-Berechnung fehlgeschlagen:', response);
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Demo-Chart-Daten:', error);
    }
  };

  const loadUserSubscription = async () => {
    try {
      const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
      if (userData && userData.trim() !== '') {
        try {
          const user = safeJsonParse(userData, {});
          // const subscription = await SubscriptionService.getUserSubscription(user.id); // Temporär deaktiviert
          // setUserSubscription(subscription); // Temporär deaktiviert
        } catch (parseError) {
          console.error('JSON.parse Fehler in loadUserSubscription:', parseError);
          localStorage.removeItem('userData');
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden der Subscription:', error);
      // Lösche ungültige Daten aus localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
      }
    }
  };

  const loadChartData = async () => {
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (!userId) {
        console.log('⚠️ Keine userId gefunden, lade Demo-Daten');
        await loadDemoChartData();
        return;
      }

      // Lade Benutzerdaten aus localStorage
      const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
      if (!userData || userData.trim() === '') {
        console.log('⚠️ Keine userData gefunden, lade Demo-Daten');
        await loadDemoChartData();
        return;
      }

      try {
        const user = safeJsonParse(userData, {});
        console.log('👤 Benutzerdaten:', user);

        // Prüfe ob Geburtsdaten vorhanden sind
      if (user.birthDate && user.birthTime && user.birthPlace) {
        console.log('📊 Berechne Chart mit echten Geburtsdaten:', {
          birthDate: user.birthDate,
          birthTime: user.birthTime,
          birthPlace: user.birthPlace
        });

        try {
          // Mock Chart-Berechnung mit echten Daten (temporär)
          const mockUserChartData = {
            success: true,
            chart: {
              name: user.name || user.username,
              email: user.email,
              birth_date: user.birthDate,
              birth_time: user.birthTime,
              birth_place: user.birthPlace,
              hd_type: 'Generator',
              authority: 'Sacral',
              strategy: 'To Respond',
              profile: '2/4',
              centers: {
                head: { defined: false, color: '#FF6B6B' },
                ajna: { defined: true, color: '#4ECDC4' },
                throat: { defined: true, color: '#45B7D1' },
                g_center: { defined: false, color: '#96CEB4' },
                heart: { defined: true, color: '#FFEAA7' },
                solar_plexus: { defined: false, color: '#DDA0DD' },
                sacral: { defined: true, color: '#98D8C8' },
                root: { defined: false, color: '#F7DC6F' }
              },
              channels: [
                { number: 1, name: 'Channel of Inspiration', gates: [1, 8] },
                { number: 2, name: 'Channel of Abstraction', gates: [2, 14] }
              ],
              gates: [
                { number: 1, name: 'Gate of Self-Expression', line: 2 },
                { number: 8, name: 'Gate of Contribution', line: 4 }
              ]
            }
          };
          
          const response = { ok: true, json: () => Promise.resolve(mockUserChartData) };

          if (response.ok) {
            const chartResult = await response.json();
            console.log('✅ Chart-Berechnung erfolgreich:', chartResult);
            
            // Extrahiere die Metadaten aus der korrekten Struktur
            const metadata = chartResult.chart;
            console.log('📊 Metadaten:', metadata);
            
            // Speichere die berechneten Daten
            setChartData({
              hdChart: {
                type: metadata?.hd_type || 'Generator',
                profile: metadata?.profile || '1/3',
                authority: metadata?.authority || 'Sacral',
                strategy: metadata?.strategy || 'Wait to Respond',
                incarnation_cross: metadata?.incarnation_cross || 'Right Angle Cross of the Sleeping Phoenix'
              },
              user: {
                hdType: metadata?.hd_type,
                profile: metadata?.profile,
                authority: metadata?.authority
              }
            });

            // Speichere auch in localStorage für zukünftige Verwendung (nur im Browser)
            if (typeof window !== 'undefined') {
              localStorage.setItem('userChart', JSON.stringify({
                hdType: metadata?.hd_type,
                profile: metadata?.profile,
                authority: metadata?.authority,
                strategy: metadata?.strategy,
                incarnation_cross: metadata?.incarnation_cross,
                centers: chartResult.chart?.centers,
                channels: chartResult.chart?.channels,
                gates: chartResult.chart?.gates
              }));
            }

            return;
          } else {
            console.error('❌ Chart-Berechnung fehlgeschlagen:', response);
            // Fallback zu Demo-Daten
            await loadDemoChartData();
          }
        } catch (chartError) {
          console.error('❌ Fehler bei Chart-Berechnung:', chartError);
          // Fallback zu Demo-Daten
          await loadDemoChartData();
        }
      }

      // Fallback: Mock Dashboard-Daten (temporär)
      const mockDashboardData = {
        hdChart: {
          type: 'Generator',
          profile: '2/4',
          authority: 'Sacral',
          strategy: 'To Respond',
          incarnationCross: 'Right Angle Cross of the Sleeping Phoenix'
        },
        user: {
          hdType: 'Generator',
          profile: '2/4',
          authority: 'Sacral'
        }
      };
      console.log('📊 Mock Dashboard-Daten geladen:', mockDashboardData);
      setChartData(mockDashboardData);

      // Fallback: Lade gespeicherte Chart-Daten aus localStorage (nur im Browser)
      if (typeof window !== 'undefined') {
        const userChart = localStorage.getItem('userChart');
        if (userChart) {
          const chartInfo = safeJsonParse(userChart, {});
          console.log('📋 Chart-Info aus localStorage:', chartInfo);
          
          setChartData(prevData => ({
            ...prevData,
            hdChart: {
              type: chartInfo.hdType || prevData?.hdChart?.type,
              profile: chartInfo.profile || prevData?.hdChart?.profile,
              authority: chartInfo.authority || prevData?.hdChart?.authority,
              strategy: chartInfo.strategy || prevData?.hdChart?.strategy,
              incarnationCross: chartInfo.incarnationCross || prevData?.hdChart?.incarnationCross
            }
          }));
        }
      }
      } catch (parseError) {
        console.error('JSON.parse Fehler in loadChartData:', parseError);
        localStorage.removeItem('userData');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Chart-Daten:', error);
      // Fallback zu Demo-Daten
      await loadDemoChartData();
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const recalculateChart = async () => {
    console.log('🔄 Chart wird neu berechnet...');
    await loadChartData();
  };

  // Debug: Zeige geladene Daten
  console.log('🔍 Chart-Daten Debug:', {
    chartData,
    hdChart: chartData?.hdChart,
    user: chartData?.user,
    incarnationCross: chartData?.hdChart?.incarnationCross,
    incarnationCrossType: typeof chartData?.hdChart?.incarnationCross,
    localStorage: typeof window !== 'undefined' ? localStorage.getItem('userChart') : 'N/A (SSR)'
  });

  // Echte Chart-Daten mit Fallback zu Mock-Daten
  const chartInfo = {
    hdType: chartData?.hdChart?.type || chartData?.user?.hdType || 'Manifesting Generator',
    profile: chartData?.hdChart?.profile || chartData?.user?.profile || '5/1',
    authority: chartData?.hdChart?.authority || chartData?.user?.authority || 'Sacral',
    strategy: chartData?.hdChart?.strategy || 'Wait to Respond',
    incarnationCross: chartData?.hdChart?.incarnationCross || {
      name: 'Right Angle Cross of the Sleeping Phoenix',
      sunGate: 1,
      earthGate: 2,
      sunLine: 1,
      earthLine: 1,
      description: 'Dein Inkarnationskreuz zeigt deine Lebensaufgabe und deinen höheren Zweck.',
      lifeTheme: 'Individuelle Lebensaufgabe',
      purpose: 'Deine einzigartige Lebensaufgabe zu erfüllen',
      challenges: 'Deine wahre Natur zu leben',
      gifts: 'Einzigartige Gaben und Talente',
      affirmation: 'Ich lebe meine einzigartige Lebensaufgabe'
    },
    centers: {
      head: {
        defined: true,
        color: '#fbbf24',
        gates: ['1', '2', '3'],
        description: 'Das Kopf-Zentrum ist das Zentrum der Inspiration und des mentalen Drucks. Es ist verantwortlich für Fragen und Zweifel.'
      },
      ajna: {
        defined: true,
        color: '#8b5cf6',
        gates: ['4', '5', '6'],
        description: 'Das Ajna-Zentrum ist das Zentrum der Konzeptualisierung und des Bewusstseins. Es verarbeitet Informationen und schafft Konzepte.'
      },
      throat: {
        defined: false,
        color: '#06b6d4',
        gates: [],
        description: 'Das Kehlkopf-Zentrum ist das Zentrum der Manifestation und Kommunikation. Es ist verantwortlich für Sprechen und Handeln.'
      },
      g: {
        defined: true,
        color: '#10b981',
        gates: ['7', '8', '9'],
        description: 'Das G-Zentrum ist das Zentrum der Identität und Richtung. Es ist verantwortlich für Liebe, Richtung und Identität.'
      },
      heart: {
        defined: false,
        color: '#ef4444',
        gates: [],
        description: 'Das Herz-Zentrum ist das Zentrum des Willens und der Kraft. Es ist verantwortlich für Ego und Willenskraft.'
      },
      spleen: {
        defined: true,
        color: '#f59e0b',
        gates: ['10', '11', '12'],
        description: 'Das Milz-Zentrum ist das Zentrum der Intuition und des Überlebens. Es ist verantwortlich für Angst und Intuition.'
      },
      sacral: {
        defined: true,
        color: '#ec4899',
        gates: ['13', '14', '15'],
        description: 'Das Sakral-Zentrum ist das Zentrum der Lebenskraft und Sexualität. Es ist verantwortlich für Energie und Vitalität.'
      },
      root: {
        defined: false,
        color: '#dc2626',
        gates: [],
        description: 'Das Wurzel-Zentrum ist das Zentrum des Drucks und der Adrenalinproduktion. Es ist verantwortlich für Stress und Druck.'
      },
      solar: {
        defined: true,
        color: '#f97316',
        gates: ['16', '17', '18'],
        description: 'Das Solarplexus-Zentrum ist das Zentrum der Emotionen und des Bewusstseins. Es ist verantwortlich für Emotionen und Bewusstsein.'
      }
    },
    channels: [
      { from: 1, to: 8, active: true, name: 'Channel of Inspiration' },
      { from: 2, to: 14, active: true, name: 'Channel of the Keeper' },
      { from: 3, to: 60, active: false, name: 'Channel of Mutation' },
      { from: 4, to: 63, active: true, name: 'Channel of Logic' }
    ],
    gates: [
      { id: 1, active: true, name: 'The Creative', description: 'Kreative Energie und Inspiration' },
      { id: 2, active: true, name: 'The Keeper', description: 'Bewahrung und Führung' },
      { id: 3, active: false, name: 'The Ordering', description: 'Ordnung und Struktur' },
      { id: 4, active: true, name: 'The Formulater', description: 'Formulierung und Konzeptualisierung' }
    ]
  };

  const typeInfo = {
    'Manifesting Generator': {
      description: 'Manifesting Generators sind die dynamischen Macher des Human Design Systems. Sie haben die Fähigkeit, sowohl zu initiieren als auch zu reagieren.',
      strategy: 'Warten auf die Antwort, dann informieren',
      authority: 'Sakral-Autorität',
      color: '#f59e0b',
      icon: <Zap size={24} />
    },
    'Generator': {
      description: 'Generators sind die Lebenskraft des Planeten. Sie sind hier, um zu arbeiten und zu erschaffen.',
      strategy: 'Warten auf die Antwort',
      authority: 'Sakral-Autorität',
      color: '#10b981',
      icon: <Activity size={24} />
    },
    'Projector': {
      description: 'Projectors sind die natürlichen Führer und Berater. Sie sind hier, um andere zu führen und zu beraten.',
      strategy: 'Warten auf die Einladung',
      authority: 'Emotionale oder andere Autorität',
      color: '#8b5cf6',
      icon: <Target size={24} />
    },
    'Manifestor': {
      description: 'Manifestors sind die Initiatoren. Sie sind hier, um Dinge in Bewegung zu setzen.',
      strategy: 'Informieren',
      authority: 'Emotionale oder andere Autorität',
      color: '#ef4444',
      icon: <Crown size={24} />
    },
    'Reflector': {
      description: 'Reflectors sind die Spiegel der Gemeinschaft. Sie reflektieren die Gesundheit der Gemeinschaft.',
      strategy: 'Warten auf den Mondzyklus',
      authority: 'Mond-Autorität',
      color: '#06b6d4',
      icon: <Moon size={24} />
    }
  };

  const currentTypeInfo = typeInfo[chartInfo.hdType as keyof typeof typeInfo] || typeInfo['Manifesting Generator'];

  if (!isAuthenticated) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Bitte melde dich an, um dein Human Design Chart zu sehen.
        </Typography>
      </Box>
    );
  }

  return (
    <AccessControl
      path="/human-design-chart"
      userSubscription={userSubscription}
      onUpgrade={() => window.location.href = '/subscription'}
    >
      <Box sx={{ 
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              🌟 Human Design Chart
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontWeight: 300,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Dein persönliches Human Design Profil mit vollständiger Bodygraph-Visualisierung
            </Typography>
          </Box>

          {/* Debug Button für Chart-Berechnung */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Button
              onClick={recalculateChart}
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'rgba(255, 215, 0, 0.5)',
                color: '#FFD700',
                '&:hover': {
                  borderColor: '#FFD700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)'
                }
              }}
            >
              🔄 Chart neu berechnen
            </Button>
          </Box>

          {/* Type Overview Card */}
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.2)',
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      display: 'inline-flex',
                      p: 3,
                      borderRadius: 3,
                      background: `${currentTypeInfo.color}20`,
                      color: currentTypeInfo.color,
                      mb: 2
                    }}>
                      {currentTypeInfo.icon}
                    </Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      {chartInfo.hdType}
                    </Typography>
                    <Chip 
                      label={`Profil ${chartInfo.profile}`}
                      sx={{
                        background: 'rgba(255, 215, 0, 0.2)',
                        color: '#FFD700',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                    Über deinen Typ
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                    {currentTypeInfo.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Target size={16} style={{ color: '#FFD700', marginRight: 8 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          <strong>Strategie:</strong> {currentTypeInfo.strategy}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Shield size={16} style={{ color: '#FFD700', marginRight: 8 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          <strong>Autorität:</strong> {currentTypeInfo.authority}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Paper sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.2)',
            mb: 3
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    color: '#FFD700'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FFD700'
                }
              }}
            >
              <Tab label="Bodygraph" icon={<User size={20} />} />
              <Tab label="Zentren" icon={<Brain size={20} />} />
              <Tab label="Kanäle" icon={<Activity size={20} />} />
              <Tab label="Tore" icon={<Star size={20} />} />
              <Tab label="Profil" icon={<Target size={20} />} />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <TabPanel value={activeTab} index={0}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              minHeight: 600
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                  Dein Bodygraph
                </Typography>
                <Box sx={{
                  width: '100%',
                  height: 600,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed rgba(255,255,255,0.2)',
                  overflow: 'hidden'
                }}>
         {/* SVG Bodchart.svg verwenden */}
         <Image
           src="/SVG Bodchart.svg"
           alt="Dein Human Design Bodygraph"
           width={600}
           height={600}
           style={{
             maxWidth: '100%',
             maxHeight: '100%',
             objectFit: 'contain'
           }}
         />
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {Object.entries(chartInfo.centers).map(([centerName, center]: [string, any]) => (
                <Grid item xs={12} sm={6} md={4} key={centerName}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: center.defined ? center.color : 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}>
                          <Box sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: center.defined ? 'white' : 'rgba(255,255,255,0.3)'
                          }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, textTransform: 'capitalize' }}>
                          {centerName} Zentrum
                        </Typography>
                      </Box>
                      <Chip 
                        label={center.defined ? 'Definiert' : 'Undefiniert'}
                        size="small"
                        sx={{
                          background: center.defined ? `${center.color}20` : 'rgba(255,255,255,0.1)',
                          color: center.defined ? center.color : 'rgba(255,255,255,0.7)',
                          mb: 2
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                        {center.description}
                      </Typography>
                      {center.gates.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            Tore: {center.gates.join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              {chartInfo.channels.map((channel: any, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          backgroundColor: channel.active ? '#10b981' : 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}>
                          <Activity size={20} style={{ color: channel.active ? 'white' : 'rgba(255,255,255,0.3)' }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {channel.from}-{channel.to}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        {channel.name}
                      </Typography>
                      <Chip 
                        label={channel.active ? 'Aktiv' : 'Inaktiv'}
                        size="small"
                        sx={{
                          background: channel.active ? '#10b98120' : 'rgba(255,255,255,0.1)',
                          color: channel.active ? '#10b981' : 'rgba(255,255,255,0.7)'
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              {chartInfo.gates.map((gate: any) => (
                <Grid item xs={12} sm={6} md={4} key={gate.id}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: gate.active ? '#FFD700' : 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}>
                          <Star size={20} style={{ color: gate.active ? '#1f2937' : 'rgba(255,255,255,0.3)' }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          Tor {gate.id}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        {gate.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, mb: 2 }}>
                        {gate.description}
                      </Typography>
                      <Chip 
                        label={gate.active ? 'Aktiv' : 'Inaktiv'}
                        size="small"
                        sx={{
                          background: gate.active ? '#FFD70020' : 'rgba(255,255,255,0.1)',
                          color: gate.active ? '#FFD700' : 'rgba(255,255,255,0.7)'
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                  Dein Profil: {chartInfo.profile}
                </Typography>
                <Grid container spacing={3}>
                  {/* Grundlegende Profil-Informationen */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                        🎭 Profil-Details
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                          Profil: {chartInfo.profile}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                          Das Profil zeigt deine Lebensrolle und wie du dich in der Welt bewegst.
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                          Typ: {chartInfo.hdType}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                          Dein energetischer Typ bestimmt deine Strategie und Autorität.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                        🎯 Strategie & Autorität
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                          Strategie: {chartInfo.strategy}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                          Deine Strategie zeigt, wie du am besten Entscheidungen triffst.
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                          Autorität: {chartInfo.authority}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                          Deine innere Autorität hilft dir, die richtigen Entscheidungen zu treffen.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Inkarnationskreuz */}
                  <Grid item xs={12}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                        ✨ Inkarnationskreuz
                      </Typography>
                      
                      {typeof chartInfo.incarnationCross === 'object' && chartInfo.incarnationCross && chartInfo.incarnationCross.name ? (
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                            {chartInfo.incarnationCross.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            Sonne: Tor {chartInfo.incarnationCross.sunGate}.{chartInfo.incarnationCross.sunLine} • 
                            Erde: Tor {chartInfo.incarnationCross.earthGate}.{chartInfo.incarnationCross.earthLine}
                          </Typography>
                          
                          {chartInfo.incarnationCross.description && (
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, mb: 2 }}>
                              {chartInfo.incarnationCross.description}
                            </Typography>
                          )}
                          
                          <Grid container spacing={2}>
                            {chartInfo.incarnationCross.lifeTheme && (
                              <Grid item xs={12} sm={6}>
                                <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                  <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                                    🎯 Lebensaufgabe
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {chartInfo.incarnationCross.lifeTheme}
                                  </Typography>
                                </Paper>
                              </Grid>
                            )}
                            
                            {chartInfo.incarnationCross.purpose && (
                              <Grid item xs={12} sm={6}>
                                <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                  <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                                    🌟 Zweck
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {chartInfo.incarnationCross.purpose}
                                  </Typography>
                                </Paper>
                              </Grid>
                            )}
                            
                            {chartInfo.incarnationCross.challenges && (
                              <Grid item xs={12} sm={6}>
                                <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                  <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                                    ⚡ Herausforderungen
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {chartInfo.incarnationCross.challenges}
                                  </Typography>
                                </Paper>
                              </Grid>
                            )}
                            
                            {chartInfo.incarnationCross.gifts && (
                              <Grid item xs={12} sm={6}>
                                <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                  <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                                    🎁 Gaben
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {chartInfo.incarnationCross.gifts}
                                  </Typography>
                                </Paper>
                              </Grid>
                            )}
                            
                            {chartInfo.incarnationCross.affirmation && (
                              <Grid item xs={12}>
                                <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                  <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                                    💫 Affirmation
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
                                    "{chartInfo.incarnationCross.affirmation}"
                                  </Typography>
                                </Paper>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                            {typeof chartInfo.incarnationCross === 'string' ? chartInfo.incarnationCross : chartInfo.incarnationCross.name}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                            Dein Inkarnationskreuz zeigt deine Lebensaufgabe und deinen höheren Zweck. 
                            Es ist das Kreuz, das du in dieser Inkarnation trägst und das deine 
                            wichtigsten Lebenslektionen und Potenziale definiert.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Detaillierte Profil-Beschreibung */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                        🌟 Profil-Bedeutung
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                        Als Profil {chartInfo.profile} hast du eine einzigartige Lebensrolle. 
                        Dein Profil zeigt, wie du dich in der Welt bewegst und welche Erfahrungen 
                        du sammeln wirst. Es ist dein Fahrplan für persönliches Wachstum und 
                        spirituelle Entwicklung.
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                        🎪 Lebensaufgabe
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                        Deine Lebensaufgabe ist es, deine einzigartige Energie und dein Potenzial zu entfalten, 
                        indem du deiner Strategie und Autorität folgst. Vertraue auf deine innere Weisheit 
                        und lass dich von deinem höheren Zweck leiten.
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Praktische Anwendung */}
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(139, 92, 246, 0.1)', 
                      borderRadius: 2, 
                      border: '1px solid rgba(139, 92, 246, 0.3)' 
                    }}>
                      <Typography variant="h6" sx={{ color: '#8b5cf6', fontWeight: 600, mb: 2 }}>
                        💡 Praktische Anwendung
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                              Täglich
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Folge deiner Strategie bei allen wichtigen Entscheidungen
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                              Wöchentlich
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Reflektiere über deine Profil-Eigenschaften und deren Ausdruck
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                              Monatlich
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Überprüfe deinen Fortschritt auf deinem Inkarnationskreuz-Pfad
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* Spezifische Profil-Interpretation */}
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(255, 215, 0, 0.1)', 
                      borderRadius: 2, 
                      border: '1px solid rgba(255, 215, 0, 0.3)' 
                    }}>
                      <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 600, mb: 2 }}>
                        🔮 Profil-Interpretation für {chartInfo.profile}
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                              Stärken & Talente
                            </Typography>
                            <List dense>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Star size={16} color="#FFD700" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Natürliche Autorität" 
                                  primaryTypographyProps={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Star size={16} color="#FFD700" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Tiefe Einsichten" 
                                  primaryTypographyProps={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Star size={16} color="#FFD700" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Transformative Kraft" 
                                  primaryTypographyProps={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
                                />
                              </ListItem>
                            </List>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                              Wachstumsbereiche
                            </Typography>
                            <List dense>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <TrendingUp size={16} color="#8b5cf6" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Geduld entwickeln" 
                                  primaryTypographyProps={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <TrendingUp size={16} color="#8b5cf6" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Vertrauen in den Prozess" 
                                  primaryTypographyProps={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <TrendingUp size={16} color="#8b5cf6" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Selbstakzeptanz" 
                                  primaryTypographyProps={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
                                />
                              </ListItem>
                            </List>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* Zusätzliche Ressourcen */}
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 4, 
                      bgcolor: 'rgba(255,255,255,0.05)', 
                      borderRadius: 3, 
                      border: '1px solid rgba(255,255,255,0.1)' 
                    }}>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BookOpen size={24} color="#FFD700" />
                        📚 Weiterführende Ressourcen
                      </Typography>
                      
                      <Grid container spacing={3}>
                        {/* Human Design Grundlagen */}
                        <Grid item xs={12} sm={6} md={4}>
                          <Link href="/grundlagen-hd" passHref>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<BookOpen size={20} />}
                              sx={{
                                borderColor: 'rgba(255, 215, 0, 0.3)',
                                color: '#FFD700',
                                py: 2,
                                '&:hover': {
                                  borderColor: '#FFD700',
                                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              Human Design Grundlagen
                            </Button>
                          </Link>
                        </Grid>

                        {/* Chart-Vergleich */}
                        <Grid item xs={12} sm={6} md={4}>
                          <Link href="/chart-comparison" passHref>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<Users size={20} />}
                              sx={{
                                borderColor: 'rgba(139, 92, 246, 0.3)',
                                color: '#8b5cf6',
                                py: 2,
                                '&:hover': {
                                  borderColor: '#8b5cf6',
                                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              Chart-Vergleich
                            </Button>
                          </Link>
                        </Grid>

                        {/* Community */}
                        <Grid item xs={12} sm={6} md={4}>
                          <Link href="/community" passHref>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<Heart size={20} />}
                              sx={{
                                borderColor: 'rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                py: 2,
                                '&:hover': {
                                  borderColor: '#ef4444',
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              Community
                            </Button>
                          </Link>
                        </Grid>

                        {/* Mondkalender */}
                        <Grid item xs={12} sm={6} md={4}>
                          <Link href="/mondkalender" passHref>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<Calendar size={20} />}
                              sx={{
                                borderColor: 'rgba(16, 185, 129, 0.3)',
                                color: '#10b981',
                                py: 2,
                                '&:hover': {
                                  borderColor: '#10b981',
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              Mondkalender
                            </Button>
                          </Link>
                        </Grid>

                        {/* Info Hub */}
                        <Grid item xs={12} sm={6} md={4}>
                          <Link href="/info-hub" passHref>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<Brain size={20} />}
                              sx={{
                                borderColor: 'rgba(245, 158, 11, 0.3)',
                                color: '#f59e0b',
                                py: 2,
                                '&:hover': {
                                  borderColor: '#f59e0b',
                                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              Info Hub
                            </Button>
                          </Link>
                        </Grid>

                        {/* Dashboard */}
                        <Grid item xs={12} sm={6} md={4}>
                          <Link href="/dashboard" passHref>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<TrendingUp size={20} />}
                              sx={{
                                borderColor: 'rgba(6, 182, 212, 0.3)',
                                color: '#06b6d4',
                                py: 2,
                                '&:hover': {
                                  borderColor: '#06b6d4',
                                  backgroundColor: 'rgba(6, 182, 212, 0.1)',
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              Dashboard
                            </Button>
                          </Link>
                        </Grid>
                      </Grid>

                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<Share2 size={20} />}
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                color: 'white',
                fontWeight: 600,
                px: 3,
                borderRadius: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)'
                }
              }}
            >
              Chart teilen
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download size={20} />}
              sx={{
                borderColor: 'rgba(255, 107, 157, 0.3)',
                color: '#ff6b9d',
                fontWeight: 600,
                px: 3,
                borderRadius: 3,
                '&:hover': {
                  borderColor: '#ff6b9d',
                  backgroundColor: 'rgba(255, 107, 157, 0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              PDF herunterladen
            </Button>
          </Box>
        </Container>
      </Box>
    </AccessControl>
  );
}
