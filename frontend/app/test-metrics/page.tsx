"use client";
import React, { useState } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Grid, Alert, CircularProgress, Chip, List, ListItem, ListItemText, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Play, BarChart3, Activity, Zap, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';

interface TestResult {
  success: boolean;
  message: string;
  activity?: string;
  timestamp: string;
  grafanaCloud?: string;
}

export default function TestMetricsPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [status, setStatus] = useState<{
    grafanaCloud?: {
      prometheus?: { url?: string; username?: string };
      loki?: { url?: string; username?: string };
      tempo?: { url?: string; username?: string };
    };
    timestamp?: string;
    environment?: string;
    error?: string;
  } | null>(null);

  const generateSingleMetric = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4001/api/test-metrics/generate-test-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
    } catch (error) {
      console.error('Error generating metric:', error);
      setResults(prev => [{
        success: false,
        message: 'Failed to generate metric',
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const generateBulkMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4001/api/test-metrics/generate-bulk-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 20 })
      });

      const result = await response.json();
      setResults(prev => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Error generating bulk metrics:', error);
      setResults(prev => [{
        success: false,
        message: 'Failed to generate bulk metrics',
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const generateTestLog = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4001/api/test-metrics/generate-test-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setResults(prev => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Error generating test log:', error);
      setResults(prev => [{
        success: false,
        message: 'Failed to generate test log',
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4001/api/test-metrics/status');
      const result = await response.json();
      setStatus(result);
    } catch (error) {
      console.error('Error checking status:', error);
      setStatus({ error: 'Failed to check status' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 2 }}>
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
              📊 Test Metrics
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Teste deine Grafana Cloud Integration mit Live-Metriken
            </Typography>
          </Box>
        </motion.div>

        {/* Status Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.2)',
            p: 3,
            mb: 4
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                🔍 Grafana Cloud Status
              </Typography>
              <Button
                variant="outlined"
                onClick={checkStatus}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
              >
                Status prüfen
              </Button>
            </Box>

            {status && (
              <Box>
                {status.error ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {status.error}
                  </Alert>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          Prometheus
                        </Typography>
                        <Chip
                          label={status.grafanaCloud?.prometheus?.url || 'Unknown'}
                          color={status.grafanaCloud?.prometheus?.url === 'configured' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          Loki
                        </Typography>
                        <Chip
                          label={status.grafanaCloud?.loki?.url || 'Unknown'}
                          color={status.grafanaCloud?.loki?.url === 'configured' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          Tempo
                        </Typography>
                        <Chip
                          label={status.grafanaCloud?.tempo?.url || 'Unknown'}
                          color={status.grafanaCloud?.tempo?.url === 'configured' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}
          </Card>
        </motion.div>

        {/* Test Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #8B5CF6 15%, #A78BFA 5%)',
                border: '1px solid #8B5CF6 30',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px #8B5CF6 20',
                },
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Zap size={48} color="#8B5CF6" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 2, fontWeight: 600 }}>
                    Einzelne Metrik
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Generiere eine zufällige App-Metrik für Grafana Cloud
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={generateSingleMetric}
                    disabled={loading}
                    fullWidth
                    startIcon={loading ? <CircularProgress size={16} /> : <Play size={16} />}
                    sx={{
                      backgroundColor: '#8B5CF6',
                      '&:hover': { backgroundColor: '#8B5CF6', opacity: 0.9 }
                    }}
                  >
                    Metrik generieren
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #10B981 15%, #34D399 5%)',
                border: '1px solid #10B981 30',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px #10B981 20',
                },
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <BarChart3 size={48} color="#10B981" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 2, fontWeight: 600 }}>
                    Bulk Metriken
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Generiere 20 zufällige Metriken für umfangreiche Tests
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={generateBulkMetrics}
                    disabled={loading}
                    fullWidth
                    startIcon={loading ? <CircularProgress size={16} /> : <Activity size={16} />}
                    sx={{
                      backgroundColor: '#10B981',
                      '&:hover': { backgroundColor: '#10B981', opacity: 0.9 }
                    }}
                  >
                    Bulk generieren
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #F59E0B 15%, #FBBF24 5%)',
                border: '1px solid #F59E0B 30',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px #F59E0B 20',
                },
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Clock size={48} color="#F59E0B" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 2, fontWeight: 600 }}>
                    Test Logs
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Generiere Test-Logs für Loki Log-Aggregation
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={generateTestLog}
                    disabled={loading}
                    fullWidth
                    startIcon={loading ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
                    sx={{
                      backgroundColor: '#F59E0B',
                      '&:hover': { backgroundColor: '#F59E0B', opacity: 0.9 }
                    }}
                  >
                    Log generieren
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.2)',
            p: 3
          }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 3, fontWeight: 600 }}>
              📋 Test Ergebnisse
            </Typography>

            {results.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                Noch keine Tests durchgeführt. Starte einen Test um Ergebnisse zu sehen.
              </Typography>
            ) : (
              <List>
                {results.map((result, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {result.success ? (
                              <CheckCircle size={20} color="#22c55e" />
                            ) : (
                              <AlertCircle size={20} color="#ef4444" />
                            )}
                            <Typography variant="body2" sx={{ 
                              fontWeight: 600, 
                              color: 'text.primary',
                              flex: 1
                            }}>
                              {result.message}
                            </Typography>
                            {result.activity && (
                              <Chip
                                label={result.activity}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(255,255,255,0.1)',
                                  color: 'text.primary',
                                  fontSize: '0.7rem'
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {new Date(result.timestamp).toLocaleString('de-DE')}
                            </Typography>
                            {result.grafanaCloud && (
                              <Chip
                                label={result.grafanaCloud}
                                size="small"
                                sx={{
                                  backgroundColor: '#8B5CF6 20',
                                  color: '#8B5CF6',
                                  fontSize: '0.7rem',
                                  ml: 1
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < results.length - 1 && <Divider sx={{ my: 1 }} />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
