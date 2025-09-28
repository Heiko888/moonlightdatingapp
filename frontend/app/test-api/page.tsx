"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper
} from '@mui/material';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RotateCcw,
  Bug,
  Shield,
  Database,
  Users,
  Moon,
  Star,
  BarChart3,
  Settings,
} from 'lucide-react';
import { runAPITests, runSpecificAPITests, generateAPITestReport, TestSuite } from '@/lib/api/testSuite';

const testIcons: Record<string, React.ReactNode> = {
  'API-Verbindung': <Database size={20} />,
  'Authentifizierung': <Shield size={20} />,
  'Token-Validierung': <Shield size={20} />,
  'Token-Refresh': <RotateCcw size={20} />,
  'Benutzer-Endpunkte': <Users size={20} />,
  'Mondkalender-Endpunkte': <Moon size={20} />,
  'Coaching-Endpunkte': <Star size={20} />,
  'Community-Endpunkte': <Users size={20} />,
  'Chart-Berechnung': <BarChart3 size={20} />,
  'Admin-Endpunkte': <Settings size={20} />,
  'Error-Handling': <Bug size={20} />,
  'Timeout-Handling': <Clock size={20} />
};

export default function TestAPIPage() {
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const availableTests = [
    { id: 'api-connection', name: 'API-Verbindung', description: 'Testet die grundlegende API-Verbindung' },
    { id: 'authentication', name: 'Authentifizierung', description: 'Testet Login und Registrierung' },
    { id: 'token-validation', name: 'Token-Validierung', description: 'Testet die Token-Validierung' },
    { id: 'token-refresh', name: 'Token-Refresh', description: 'Testet das Token-Refresh' },
    { id: 'user-endpoints', name: 'Benutzer-Endpunkte', description: 'Testet Benutzer-API-Endpunkte' },
    { id: 'moon-endpoints', name: 'Mondkalender-Endpunkte', description: 'Testet Mondkalender-API' },
    { id: 'coaching-endpoints', name: 'Coaching-Endpunkte', description: 'Testet Coaching-API' },
    { id: 'community-endpoints', name: 'Community-Endpunkte', description: 'Testet Community-API' },
    { id: 'chart-calculation', name: 'Chart-Berechnung', description: 'Testet Human Design Chart-Berechnung' },
    { id: 'admin-endpoints', name: 'Admin-Endpunkte', description: 'Testet Admin-API' },
    { id: 'error-handling', name: 'Error-Handling', description: 'Testet Fehlerbehandlung' },
    { id: 'timeout-handling', name: 'Timeout-Handling', description: 'Testet Timeout-Verhalten' }
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    try {
      const results = await runAPITests();
      setTestSuite(results);
    } catch (error) {
      console.error('Fehler beim Ausführen der Tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runSelectedTests = async () => {
    if (selectedTests.length === 0) return;
    
    setIsRunning(true);
    try {
      const results = await runSpecificAPITests(selectedTests);
      setTestSuite(results);
    } catch (error) {
      console.error('Fehler beim Ausführen der Tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    if (!testSuite) return;
    
    const report = generateAPITestReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-test-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleTestSelection = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const getTestIcon = (testName: string) => {
    return testIcons[testName] || <Bug size={20} />;
  };

  const getTestColor = (success: boolean) => {
    return success ? '#22c55e' : '#ef4444';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          <Bug size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          API-Test-Suite
        </Typography>

        <Grid container spacing={3}>
          {/* Test-Auswahl */}
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Tests auswählen
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Play size={20} />}
                    onClick={runAllTests}
                    disabled={isRunning}
                    sx={{
                      background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #16a34a, #15803d)'
                      }
                    }}
                  >
                    Alle Tests ausführen
                  </Button>
                </Box>

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

                <List>
                  {availableTests.map((test) => (
                    <ListItem
                      key={test.id}
                      button
                      onClick={() => toggleTestSelection(test.id)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        backgroundColor: selectedTests.includes(test.id) 
                          ? 'rgba(34, 197, 94, 0.2)' 
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: 'white' }}>
                        {getTestIcon(test.name)}
                      </ListItemIcon>
                      <ListItemText
                        primary={test.name}
                        secondary={test.description}
                        primaryTypographyProps={{ color: 'white', fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Play size={20} />}
                  onClick={runSelectedTests}
                  disabled={isRunning || selectedTests.length === 0}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.6)',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Ausgewählte Tests ({selectedTests.length})
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Test-Ergebnisse */}
          <Grid item xs={12} md={8}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Test-Ergebnisse
                  </Typography>
                  
                  {testSuite && (
                    <Button
                      variant="outlined"
                      startIcon={<Download size={20} />}
                      onClick={downloadReport}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.6)'
                        }
                      }}
                    >
                      Report herunterladen
                    </Button>
                  )}
                </Box>

                {isRunning && (
                  <Box sx={{ mb: 3 }}>
                    <LinearProgress sx={{ mb: 1 }} />
                    <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                      Tests werden ausgeführt...
                    </Typography>
                  </Box>
                )}

                {testSuite && (
                  <>
                    {/* Zusammenfassung */}
                    <Paper sx={{ 
                      p: 2, 
                      mb: 3, 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#22c55e' }}>
                              {testSuite.successCount}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Erfolgreich
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#ef4444' }}>
                              {testSuite.failureCount}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Fehlgeschlagen
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#f59e0b' }}>
                              {testSuite.tests.length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Gesamt
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#8b5cf6' }}>
                              {testSuite.totalDuration}ms
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Dauer
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Einzelne Tests */}
                    {testSuite.tests.map((test, index) => (
                      <Accordion key={index} sx={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        mb: 1,
                        '&:before': { display: 'none' }
                      }}>
                        <AccordionSummary
                          sx={{
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            {test.success ? (
                              <CheckCircle size={24} color="#22c55e" />
                            ) : (
                              <XCircle size={24} color="#ef4444" />
                            )}
                            
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" sx={{ color: 'white' }}>
                                {test.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {test.duration}ms
                              </Typography>
                            </Box>
                            
                            <Chip
                              label={test.success ? 'Erfolgreich' : 'Fehlgeschlagen'}
                              size="small"
                              sx={{
                                backgroundColor: getTestColor(test.success),
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                        </AccordionSummary>
                        
                        <AccordionDetails>
                          {test.error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                              {test.error}
                            </Alert>
                          )}
                          
                          {test.details && (
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                                Details:
                              </Typography>
                              <Paper sx={{ 
                                p: 2, 
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}>
                                <pre style={{ 
                                  color: 'white', 
                                  fontSize: '0.8rem',
                                  margin: 0,
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word'
                                }}>
                                  {JSON.stringify(test.details, null, 2)}
                                </pre>
                              </Paper>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </>
                )}

                {!testSuite && !isRunning && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Bug size={64} color="rgba(255,255,255,0.3)" style={{ marginBottom: '16px' }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      Keine Tests ausgeführt
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Wähle Tests aus und führe sie aus, um Ergebnisse zu sehen.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
