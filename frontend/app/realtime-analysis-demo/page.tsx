'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  Heart,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Info,
  Star,
  Users,
  Target
} from 'lucide-react';
import { ChartData, ChartService } from '../../lib/hd-bodygraph/chartService';
import { RealtimeAnalysisService, RealtimeAnalysisResult } from '../../lib/realtimeAnalysisService';

export default function RealtimeAnalysisDemoPage() {
  const [demoCharts, setDemoCharts] = useState<ChartData[]>([]);
  const [selectedChart1, setSelectedChart1] = useState<ChartData | null>(null);
  const [selectedChart2, setSelectedChart2] = useState<ChartData | null>(null);
  const [analysis, setAnalysis] = useState<RealtimeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Demo-Charts erstellen
  useEffect(() => {
    createDemoCharts();
  }, []);

  const createDemoCharts = async () => {
    try {
      const chart1: ChartData = {
        id: 'demo-1',
        name: 'Sarah (Generator)',
        type: 'Generator',
        profile: '1/3',
        authority: 'Sacral',
        strategy: 'Wait to Respond',
        centers: {
          'Head': true,
          'Ajna': false,
          'Throat': true,
          'G': true,
          'Heart': false,
          'Sacral': true,
          'Spleen': false,
          'Solar': true,
          'Root': false
        },
        channels: {
          '34-20': true,
          '10-57': false,
          '1-8': true,
          '2-14': false
        },
        gates: {
          '1': true,
          '8': true,
          '20': true,
          '34': true,
          '57': false,
          '10': false
        },
        planets: {},
        defined: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const chart2: ChartData = {
        id: 'demo-2',
        name: 'Michael (Projector)',
        type: 'Projector',
        profile: '2/4',
        authority: 'Splenic',
        strategy: 'Wait for Invitation',
        centers: {
          'Head': false,
          'Ajna': true,
          'Throat': true,
          'G': false,
          'Heart': true,
          'Sacral': false,
          'Spleen': true,
          'Solar': false,
          'Root': true
        },
        channels: {
          '34-20': false,
          '10-57': true,
          '1-8': false,
          '2-14': true
        },
        gates: {
          '1': false,
          '8': false,
          '20': false,
          '34': false,
          '57': true,
          '10': true
        },
        planets: {},
        defined: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const chart3: ChartData = {
        id: 'demo-3',
        name: 'Emma (Manifestor)',
        type: 'Manifestor',
        profile: '3/5',
        authority: 'Emotional',
        strategy: 'Inform',
        centers: {
          'Head': true,
          'Ajna': true,
          'Throat': true,
          'G': true,
          'Heart': true,
          'Sacral': false,
          'Spleen': true,
          'Solar': true,
          'Root': true
        },
        channels: {
          '34-20': true,
          '10-57': true,
          '1-8': true,
          '2-14': true
        },
        gates: {
          '1': true,
          '8': true,
          '20': true,
          '34': true,
          '57': true,
          '10': true
        },
        planets: {},
        defined: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setDemoCharts([chart1, chart2, chart3]);
      setSelectedChart1(chart1);
      setSelectedChart2(chart2);
    } catch (err) {
      setError('Fehler beim Erstellen der Demo-Charts');
      console.error('Error creating demo charts:', err);
    }
  };

  const performAnalysis = async () => {
    if (!selectedChart1 || !selectedChart2) {
      setError('Bitte wähle zwei Charts aus');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await RealtimeAnalysisService.analyzeCharts(selectedChart1, selectedChart2);
      setAnalysis(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Fehler bei der Analyse');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startLiveAnalysis = async () => {
    if (!selectedChart1 || !selectedChart2 || isLive) return;

    try {
      const ws = await RealtimeAnalysisService.startLiveAnalysis(
        selectedChart1,
        selectedChart2,
        (result) => {
          setAnalysis(result);
          setLastUpdate(new Date());
        }
      );

      setWsConnection(ws);
      setIsLive(true);
    } catch (err) {
      setError('Fehler beim Starten der Live-Analyse');
      console.error('Live analysis error:', err);
    }
  };

  const stopLiveAnalysis = () => {
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
    }
    setIsLive(false);
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#ef4444';
    return '#6b7280';
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return 'Sehr hoch';
    if (score >= 60) return 'Hoch';
    if (score >= 40) return 'Mittel';
    return 'Niedrig';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}
            >
              <Activity size={48} />
              Echtzeit-Analyse Demo
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(254,243,199,0.8)', maxWidth: 600, mx: 'auto' }}>
              Teste die Echtzeit-Analyse mit vordefinierten Demo-Charts
            </Typography>
          </Box>
        </motion.div>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Chart-Auswahl */}
          <Grid item xs={12} md={4}>
            <motion.div
              
              
              
            >
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                height: '100%'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={24} />
                    Demo-Charts
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {demoCharts.map((chart) => (
                      <Paper
                        key={chart.id}
                        sx={{
                          p: 2,
                          bgcolor: selectedChart1?.id === chart.id || selectedChart2?.id === chart.id 
                            ? 'rgba(255, 215, 0, 0.1)' 
                            : 'rgba(255,255,255,0.05)',
                          border: selectedChart1?.id === chart.id || selectedChart2?.id === chart.id 
                            ? '1px solid #FFD700' 
                            : '1px solid rgba(255,255,255,0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => {
                          if (selectedChart1?.id === chart.id) {
                            setSelectedChart1(null);
                          } else if (selectedChart2?.id === chart.id) {
                            setSelectedChart2(null);
                          } else if (!selectedChart1) {
                            setSelectedChart1(chart);
                          } else if (!selectedChart2) {
                            setSelectedChart2(chart);
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={chart.type} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgba(255, 215, 0, 0.2)',
                              color: '#FFD700'
                            }} 
                          />
                          <Typography sx={{ color: 'white', fontWeight: 600 }}>
                            {chart.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(254,243,199,0.7)', mt: 1 }}>
                          {chart.profile} • {chart.authority}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={performAnalysis}
                      disabled={loading || !selectedChart1 || !selectedChart2}
                      startIcon={loading ? <CircularProgress size={20} /> : <Zap size={20} />}
                      sx={{
                        bgcolor: '#FFD700',
                        color: '#1a1a2e',
                        '&:hover': {
                          bgcolor: '#fbbf24'
                        },
                        '&:disabled': {
                          bgcolor: 'rgba(255, 215, 0, 0.3)',
                          color: 'rgba(26, 26, 46, 0.5)'
                        }
                      }}
                    >
                      {loading ? 'Analysiere...' : 'Analyse starten'}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={isLive ? stopLiveAnalysis : startLiveAnalysis}
                      disabled={!selectedChart1 || !selectedChart2}
                      startIcon={isLive ? <Pause size={20} /> : <Play size={20} />}
                      sx={{
                        color: isLive ? '#ef4444' : '#8b5cf6',
                        borderColor: isLive ? '#ef4444' : '#8b5cf6',
                        '&:hover': {
                          borderColor: isLive ? '#dc2626' : '#7c3aed',
                          bgcolor: isLive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)'
                        }
                      }}
                    >
                      {isLive ? 'Live stoppen' : 'Live starten'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Analyse-Ergebnis */}
          <Grid item xs={12} md={8}>
            <motion.div
              
              
              
            >
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                height: '100%'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: '#FFD700', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp size={24} />
                      Analyse-Ergebnis
                    </Typography>
                    
                    {isLive && (
                      <Chip
                        icon={<Activity size={16} />}
                        label="Live"
                        color="success"
                        variant="outlined"
                        sx={{ 
                          color: '#22c55e',
                          borderColor: '#22c55e',
                          animation: 'pulse 2s infinite'
                        }}
                      />
                    )}
                  </Box>

                  {analysis ? (
                    <Box>
                      {/* Kompatibilitäts-Score */}
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h2" sx={{ 
                          color: getCompatibilityColor(analysis.analysis.compatibilityScore),
                          fontWeight: 700,
                          mb: 1
                        }}>
                          {analysis.analysis.compatibilityScore}%
                        </Typography>
                        <Chip
                          label={getCompatibilityLabel(analysis.analysis.compatibilityScore)}
                          sx={{
                            bgcolor: getCompatibilityColor(analysis.analysis.compatibilityScore),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '1rem',
                            height: 32
                          }}
                        />
                        {lastUpdate && (
                          <Typography variant="body2" sx={{ color: 'rgba(254,243,199,0.7)', mt: 1 }}>
                            Letztes Update: {lastUpdate.toLocaleTimeString()}
                          </Typography>
                        )}
                      </Box>

                      {/* Energetische Dynamiken */}
                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#ef4444', mb: 1 }}>
                              {analysis.analysis.energeticDynamics.attraction}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(254,243,199,0.8)' }}>
                              Anziehung
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#22c55e', mb: 1 }}>
                              {analysis.analysis.energeticDynamics.harmony}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(254,243,199,0.8)' }}>
                              Harmonie
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#f59e0b', mb: 1 }}>
                              {analysis.analysis.energeticDynamics.challenge}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(254,243,199,0.8)' }}>
                              Herausforderung
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#8b5cf6', mb: 1 }}>
                              {analysis.analysis.energeticDynamics.growth}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(254,243,199,0.8)' }}>
                              Wachstum
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Beziehungs-Wahrscheinlichkeit */}
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h6" sx={{ color: '#fef3c7', mb: 1 }}>
                          Beziehungs-Wahrscheinlichkeit
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 700 }}>
                          {analysis.analysis.relationshipProbability}%
                        </Typography>
                      </Box>

                      {/* Insights */}
                      {analysis.insights.length > 0 && (
                        <Box>
                          <Typography variant="h6" sx={{ color: '#fef3c7', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star size={20} />
                            Insights
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {analysis.insights.map((insight, index) => (
                              <Paper
                                key={index}
                                sx={{
                                  p: 2,
                                  bgcolor: 'rgba(255,255,255,0.05)',
                                  border: '1px solid rgba(255,255,255,0.1)'
                                }}
                              >
                                <Typography variant="body2" sx={{ color: 'rgba(254,243,199,0.8)' }}>
                                  {insight}
                                </Typography>
                              </Paper>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '100%',
                      minHeight: 300,
                      textAlign: 'center'
                    }}>
                      <Info size={48} color="#6b7280" />
                      <Typography variant="h6" sx={{ color: 'rgba(254,243,199,0.6)', mt: 2 }}>
                        Wähle zwei Charts aus und starte eine Analyse
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(254,243,199,0.4)', mt: 1 }}>
                        Erhalte detaillierte Einblicke in die energetische Kompatibilität
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Info-Box */}
        <motion.div
          
          
          
        >
          <Card sx={{
            mt: 4,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info size={24} />
                Über die Echtzeit-Analyse
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(254,243,199,0.8)', lineHeight: 1.6 }}>
                Diese Demo zeigt die Echtzeit-Analyse zwischen verschiedenen Human Design Charts. 
                Die Analyse berücksichtigt HD-Typ, Profil, Autorität, Zentren, Kanäle und Tore, 
                um eine umfassende Bewertung der energetischen Kompatibilität zu erstellen. 
                Mit der Live-Funktion erhältst du kontinuierliche Updates der Analyse.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
