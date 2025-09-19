"use client";
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Button, Chip, Snackbar, Alert } from '@mui/material';
import { Database, Cloud, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import HumanDesignChart from '../mondkalender/components/HumanDesignChart';
import { dataPersistenceUtils, chartService } from '../../lib/dataPersistenceService';

// Mock-Daten für Fallback
const mockChartData = {
  hdType: 'Manifestierender Generator',
  profile: '3/5',
  authority: 'Sakral',
  strategy: 'Auf Anfrage antworten',
  centers: {
    head: { defined: true, color: '#fbbf24', gates: ['1', '2', '3'], description: 'Inspiration & Druck' },
    ajna: { defined: true, color: '#8b5cf6', gates: ['4', '5', '6'], description: 'Konzeptualisierung' },
    throat: { defined: true, color: '#06b6d4', gates: ['7', '8', '9'], description: 'Manifestation & Kommunikation' },
    g: { defined: false, color: '#374151', gates: [], description: 'Identität & Liebe' },
    heart: { defined: true, color: '#ef4444', gates: ['10', '11', '12'], description: 'Willenskraft & Ego' },
    solar: { defined: false, color: '#374151', gates: [], description: 'Emotionen & Sensibilität' },
    sacral: { defined: true, color: '#f59e0b', gates: ['13', '14', '15'], description: 'Lebenskraft & Sexualität' },
    spleen: { defined: false, color: '#374151', gates: [], description: 'Intuition & Gesundheit' },
    root: { defined: true, color: '#10b981', gates: ['16', '17', '18'], description: 'Stress & Druck' }
  },
  channels: {
    '1-8': { active: true, from: 'head', to: 'throat', description: 'Inspiration', color: '#fbbf24' },
    '2-14': { active: true, from: 'ajna', to: 'sacral', description: 'Kick', color: '#8b5cf6' },
    '3-60': { active: true, from: 'throat', to: 'root', description: 'Mutation', color: '#06b6d4' }
  },
  gates: {
    '1': { active: true, center: 'head', description: 'Kreativität', color: '#fbbf24' },
    '8': { active: true, center: 'throat', description: 'Zusammenarbeit', color: '#06b6d4' },
    '2': { active: true, center: 'ajna', description: 'Höhere Macht', color: '#8b5cf6' },
    '14': { active: true, center: 'sacral', description: 'Macht', color: '#f59e0b' }
  },
  planets: {
    sun: { name: 'Sonne', symbol: '☉', position: 1, gate: '1', line: 1, color: '#fbbf24', description: 'Deine Essenz' },
    moon: { name: 'Mond', symbol: '☽', position: 2, gate: '2', line: 1, color: '#8b5cf6', description: 'Deine Persönlichkeit' },
    mercury: { name: 'Merkur', symbol: '☿', position: 3, gate: '3', line: 1, color: '#06b6d4', description: 'Deine Kommunikation' },
    venus: { name: 'Venus', symbol: '♀', position: 4, gate: '4', line: 1, color: '#ef4444', description: 'Deine Werte' },
    mars: { name: 'Mars', symbol: '♂', position: 5, gate: '5', line: 1, color: '#f59e0b', description: 'Deine Energie' },
    jupiter: { name: 'Jupiter', symbol: '♃', position: 6, gate: '6', line: 1, color: '#10b981', description: 'Dein Wachstum' },
    saturn: { name: 'Saturn', symbol: '♄', position: 7, gate: '7', line: 1, color: '#6b7280', description: 'Deine Struktur' },
    uranus: { name: 'Uranus', symbol: '♅', position: 8, gate: '8', line: 1, color: '#8b5cf6', description: 'Deine Revolution' },
    neptune: { name: 'Neptun', symbol: '♆', position: 9, gate: '9', line: 1, color: '#06b6d4', description: 'Deine Spiritualität' },
    pluto: { name: 'Pluto', symbol: '♇', position: 10, gate: '10', line: 1, color: '#ef4444', description: 'Deine Transformation' },
    northNode: { name: 'Nordknoten', symbol: '☊', position: 4, gate: '4', line: 1, color: '#06b6d4', description: 'Deine Zukunft' },
    southNode: { name: 'Südknoten', symbol: '☋', position: 5, gate: '5', line: 1, color: '#f59e0b', description: 'Deine Vergangenheit' }
  }
};

interface ChartData {
  centers: Record<string, {
    defined: boolean;
    color: string;
    gates: string[];
    description: string;
  }>;
  channels: Record<string, {
    active: boolean;
    from: string;
    to: string;
    description: string;
    color: string;
  }>;
  gates: Record<string, {
    active: boolean;
    center: string;
    description: string;
    color: string;
  }>;
  planets: Record<string, {
    name: string;
    symbol: string;
    position: number;
    gate: string;
    line: number;
    color: string;
    description: string;
  }>;
  metadata: {
    type: string;
    profile: string;
    authority: string;
    strategy: string;
  };
}

export default function ChartPageWithPersistence() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Datenpersistierung States
  const [isOnline, setIsOnline] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [showSyncSnackbar, setShowSyncSnackbar] = useState(false);

  // Online-Status überwachen
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Prüfe Authentifizierung
    setIsAuthenticated(dataPersistenceUtils.isAuthenticated());

    // Konvertiere Mock-Daten in das richtige Format für HDChart
    const convertToHDChartFormat = (data: typeof mockChartData): ChartData => {
      return {
        centers: {
          head: { 
            defined: data.centers.head.defined,
            color: data.centers.head.color,
            gates: data.centers.head.gates,
            description: data.centers.head.description
          },
          ajna: { 
            defined: data.centers.ajna.defined,
            color: data.centers.ajna.color,
            gates: data.centers.ajna.gates,
            description: data.centers.ajna.description
          },
          throat: { 
            defined: data.centers.throat.defined,
            color: data.centers.throat.color,
            gates: data.centers.throat.gates,
            description: data.centers.throat.description
          },
          g: { 
            defined: data.centers.g.defined,
            color: data.centers.g.color,
            gates: data.centers.g.gates,
            description: data.centers.g.description
          },
          heart: { 
            defined: data.centers.heart.defined,
            color: data.centers.heart.color,
            gates: data.centers.heart.gates,
            description: data.centers.heart.description
          },
          spleen: { 
            defined: data.centers.spleen.defined,
            color: data.centers.spleen.color,
            gates: data.centers.spleen.gates,
            description: data.centers.spleen.description
          },
          sacral: { 
            defined: data.centers.sacral.defined,
            color: data.centers.sacral.color,
            gates: data.centers.sacral.gates,
            description: data.centers.sacral.description
          },
          solar: { 
            defined: data.centers.solar?.defined || false,
            color: data.centers.solar?.color || '#FFEAA7',
            gates: data.centers.solar?.gates || [],
            description: data.centers.solar?.description || 'Emotionen & Sensibilität'
          },
          root: { 
            defined: data.centers.root.defined,
            color: data.centers.root.color,
            gates: data.centers.root.gates,
            description: data.centers.root.description
          }
        },
        channels: data.channels || {},
        gates: data.gates || {},
        planets: data.planets || {},
        metadata: {
          type: data.hdType,
          profile: data.profile,
          authority: data.authority,
          strategy: data.strategy
        }
      };
    };

    const loadChartData = async () => {
      try {
        // Versuche zuerst Daten aus der Datenbank zu laden
        if (isAuthenticated && isOnline) {
          setSyncStatus('syncing');
          setSyncMessage('Lade Chart-Daten aus der Datenbank...');
          setShowSyncSnackbar(true);
          
          const dashboardData = await dataPersistenceUtils.loadDataFromDatabase();
          
          if (dashboardData && dashboardData.charts.length > 0) {
            const dbChart = dashboardData.charts[0];
            const combinedData = {
              ...mockChartData,
              hdType: dbChart.chart_data?.hdType || mockChartData.hdType,
              profile: dbChart.chart_data?.profile || mockChartData.profile,
              authority: dbChart.chart_data?.authority || mockChartData.authority,
              strategy: dbChart.chart_data?.strategy || mockChartData.strategy,
              centers: dbChart.centers || mockChartData.centers,
              channels: dbChart.channels || mockChartData.channels,
              gates: dbChart.gates || mockChartData.gates,
              planets: dbChart.planets || mockChartData.planets
            };
            
            const hdChartData = convertToHDChartFormat(combinedData);
            setChartData(hdChartData);
            setChartInsights(calculateChartInsights(hdChartData));
            
            setSyncStatus('success');
            setSyncMessage('Chart-Daten erfolgreich aus der Datenbank geladen');
            return;
          }
        }
        
        // Fallback: Lade aus localStorage
        const profileData = localStorage.getItem('profileData');
        const chartDataFromStorage = localStorage.getItem('chartData');
        
        if (profileData && chartDataFromStorage) {
          const parsedProfileData = JSON.parse(profileData);
          const parsedChartData = JSON.parse(chartDataFromStorage);

          const combinedData = {
            ...mockChartData,
            hdType: parsedProfileData.hdType || mockChartData.hdType,
            profile: parsedProfileData.hdProfile || mockChartData.profile,
            authority: parsedProfileData.authority || mockChartData.authority,
            strategy: parsedProfileData.strategy || mockChartData.strategy,
            centers: parsedChartData.centers || mockChartData.centers,
            channels: parsedChartData.channels || mockChartData.channels,
            gates: parsedChartData.gates || mockChartData.gates,
            planets: parsedChartData.planets || mockChartData.planets
          };
          
          const hdChartData = convertToHDChartFormat(combinedData);
          setChartData(hdChartData);
          setChartInsights(calculateChartInsights(hdChartData));
          
          // Synchronisiere mit Datenbank falls möglich
          if (isAuthenticated && isOnline) {
            try {
              await chartService.syncFromLocalStorage();
              setSyncStatus('success');
              setSyncMessage('Chart-Daten mit Datenbank synchronisiert');
              setShowSyncSnackbar(true);
            } catch (error) {
              console.error('Sync-Fehler:', error);
              setSyncStatus('error');
              setSyncMessage('Sync-Fehler - Daten nur lokal verfügbar');
              setShowSyncSnackbar(true);
            }
          }
        } else {
          // Fallback zu Mock-Daten
          const hdChartData = convertToHDChartFormat(mockChartData);
          setChartData(hdChartData);
        }
        
      } catch (err) {
        console.error('Fehler beim Laden der Chart-Daten:', err);
        setSyncStatus('error');
        setSyncMessage('Fehler beim Laden der Daten');
        setShowSyncSnackbar(true);
        
        // Fallback zu Mock-Daten
        const hdChartData = convertToHDChartFormat(mockChartData);
        setChartData(hdChartData);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [isAuthenticated, isOnline]);

  // Chart-Insights berechnen

  const calculateChartInsights = (data: ChartData) => {
    if (!data) return null;
    
    const definedCenters = Object.values(data.centers).filter(center => center.defined).length;
    const activeChannels = Object.values(data.channels).filter(channel => channel.active).length;
    const activeGates = Object.values(data.gates).filter(gate => gate.active).length;
    
    return {
      definedCenters,
      activeChannels,
      activeGates,
      totalCenters: 9,
      totalChannels: 36,
      totalGates: 64
    };
  };

  // Manuelle Synchronisation
  const handleManualSync = async () => {
    if (!isAuthenticated || !isOnline) return;
    
    setSyncStatus('syncing');
    setSyncMessage('Synchronisiere Daten...');
    setShowSyncSnackbar(true);
    
    try {
      await dataPersistenceUtils.hybridSync();
      setSyncStatus('success');
      setSyncMessage('Daten erfolgreich synchronisiert');
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Synchronisation fehlgeschlagen');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#FFD700', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Lade Chart-Daten...
          </Typography>
          {syncStatus === 'syncing' && (
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {syncMessage}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Status-Bar für Datenpersistierung */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        p: 1
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Online-Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isOnline ? (
                  <Wifi size={16} color="#10b981" />
                ) : (
                  <WifiOff size={16} color="#ef4444" />
                )}
                <Typography variant="caption" sx={{ color: 'white' }}>
                  {isOnline ? 'Online' : 'Offline'}
                </Typography>
              </Box>

              {/* Authentifizierungs-Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isAuthenticated ? (
                  <Database size={16} color="#10b981" />
                ) : (
                  <Cloud size={16} color="#f59e0b" />
                )}
                <Typography variant="caption" sx={{ color: 'white' }}>
                  {isAuthenticated ? 'Datenbank' : 'Lokal'}
                </Typography>
              </Box>

              {/* Sync-Status */}
              {syncStatus !== 'idle' && (
                <Chip
                  size="small"
                  label={syncMessage}
                  color={syncStatus === 'success' ? 'success' : syncStatus === 'error' ? 'error' : 'info'}
                  icon={syncStatus === 'syncing' ? <RefreshCw size={12} className="animate-spin" /> : undefined}
                />
              )}
            </Box>

            {/* Sync-Button */}
            {isAuthenticated && isOnline && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<RefreshCw size={16} />}
                onClick={handleManualSync}
                disabled={syncStatus === 'syncing'}
                sx={{ 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { borderColor: 'white' }
                }}
              >
                Sync
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Hauptinhalt */}
      <Box sx={{ pt: 8 }}>
        <Container maxWidth="lg">
          {chartData && (
            <HumanDesignChart
              hdType={chartData.metadata.type}
              profile={chartData.metadata.profile}
              authority={chartData.metadata.authority}
              strategy={chartData.metadata.strategy}
              centers={chartData.centers}
              channels={chartData.channels}
              gates={chartData.gates}
              planets={chartData.planets}
            />
          )}
        </Container>
      </Box>

      {/* Sync-Status Snackbar */}
      <Snackbar
        open={showSyncSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSyncSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSyncSnackbar(false)} 
          severity={syncStatus === 'success' ? 'success' : syncStatus === 'error' ? 'error' : 'info'}
          sx={{ width: '100%' }}
        >
          {syncMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
