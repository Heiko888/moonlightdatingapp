"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Grid, TextField, Alert, Chip, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Sparkles, TestTube, CheckCircle, XCircle, Loader, ArrowRight, Code, Database, Zap } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';

export default function ReikiApiTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });

  const apiEndpoints = [
    {
      name: "Reiki Symbole",
      endpoint: "/api/reiki/symbols",
      method: "GET",
      description: "Alle verfügbaren Reiki-Symbole abrufen",
      testFunction: () => testReikiSymbols()
    },
    {
      name: "Reiki Analyse",
      endpoint: "/api/reiki/analysis",
      method: "POST",
      description: "Reiki-Analyse basierend auf Human Design",
      testFunction: () => testReikiAnalysis()
    },
    {
      name: "Session Plan",
      endpoint: "/api/reiki/session-plan",
      method: "POST",
      description: "Individuellen Reiki-Session-Plan erstellen",
      testFunction: () => testSessionPlan()
    },
    {
      name: "Reiki Vorteile",
      endpoint: "/api/reiki/benefits",
      method: "GET",
      description: "Reiki-Vorteile und Wirkungen abrufen",
      testFunction: () => testReikiBenefits()
    },
    {
      name: "Selbstbehandlung",
      endpoint: "/api/reiki/self-treatment",
      method: "POST",
      description: "Reiki-Selbstbehandlungs-Anleitung",
      testFunction: () => testSelfTreatment()
    },
    {
      name: "Meditation Guides",
      endpoint: "/api/reiki/meditation-guides",
      method: "GET",
      description: "Reiki-Meditations-Anleitungen",
      testFunction: () => testMeditationGuides()
    }
  ];

  const testReikiSymbols = async () => {
    try {
      const response = await fetch('/api/reiki/symbols');
      const data = await response.json();
      return { success: true, data, endpoint: '/api/reiki/symbols' };
    } catch (error) {
      return { success: false, error: error.message, endpoint: '/api/reiki/symbols' };
    }
  };

  const testReikiAnalysis = async () => {
    try {
      const response = await fetch('/api/reiki/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: testData.birthDate || '1990-01-01',
          birthTime: testData.birthTime || '12:00',
          birthPlace: testData.birthPlace || 'Berlin, Deutschland'
        })
      });
      const data = await response.json();
      return { success: true, data, endpoint: '/api/reiki/analysis' };
    } catch (error) {
      return { success: false, error: error.message, endpoint: '/api/reiki/analysis' };
    }
  };

  const testSessionPlan = async () => {
    try {
      const response = await fetch('/api/reiki/session-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: testData.birthDate || '1990-01-01',
          birthTime: testData.birthTime || '12:00',
          birthPlace: testData.birthPlace || 'Berlin, Deutschland',
          sessionType: 'general'
        })
      });
      const data = await response.json();
      return { success: true, data, endpoint: '/api/reiki/session-plan' };
    } catch (error) {
      return { success: false, error: error.message, endpoint: '/api/reiki/session-plan' };
    }
  };

  const testReikiBenefits = async () => {
    try {
      const response = await fetch('/api/reiki/benefits');
      const data = await response.json();
      return { success: true, data, endpoint: '/api/reiki/benefits' };
    } catch (error) {
      return { success: false, error: error.message, endpoint: '/api/reiki/benefits' };
    }
  };

  const testSelfTreatment = async () => {
    try {
      const response = await fetch('/api/reiki/self-treatment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: testData.birthDate || '1990-01-01',
          birthTime: testData.birthTime || '12:00',
          birthPlace: testData.birthPlace || 'Berlin, Deutschland'
        })
      });
      const data = await response.json();
      return { success: true, data, endpoint: '/api/reiki/self-treatment' };
    } catch (error) {
      return { success: false, error: error.message, endpoint: '/api/reiki/self-treatment' };
    }
  };

  const testMeditationGuides = async () => {
    try {
      const response = await fetch('/api/reiki/meditation-guides');
      const data = await response.json();
      return { success: true, data, endpoint: '/api/reiki/meditation-guides' };
    } catch (error) {
      return { success: false, error: error.message, endpoint: '/api/reiki/meditation-guides' };
    }
  };

  const runTest = async (endpoint: any) => {
    setIsLoading(true);
    const result = await endpoint.testFunction();
    setTestResults(prev => [result, ...prev]);
    setIsLoading(false);
  };

  const runAllTests = async () => {
    setIsLoading(true);
    const results = [];
    for (const endpoint of apiEndpoints) {
      const result = await endpoint.testFunction();
      results.push(result);
    }
    setTestResults(results);
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

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
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <TestTube size={48} color="#FFD700" />
              <Typography variant="h1" sx={{
                color: '#FFD700',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Reiki API Test Center
              </Typography>
              <TestTube size={48} color="#FFD700" />
            </Box>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Typography variant="h5" sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Teste alle Reiki-API Endpoints und ihre Funktionalität
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Test Data Input */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.2)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Typography variant="h4" sx={{ 
                color: '#FFD700', 
                textAlign: 'center', 
                fontWeight: 700, 
                mb: 4 
              }}>
                Test-Daten
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Geburtsdatum"
                    type="date"
                    value={testData.birthDate}
                    onChange={(e) => setTestData(prev => ({ ...prev, birthDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Geburtszeit"
                    type="time"
                    value={testData.birthTime}
                    onChange={(e) => setTestData(prev => ({ ...prev, birthTime: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Geburtsort"
                    value={testData.birthPlace}
                    onChange={(e) => setTestData(prev => ({ ...prev, birthPlace: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' }
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ 
              color: '#FFD700', 
              fontWeight: 700 
            }}>
              API Endpoints
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={runAllTests}
                disabled={isLoading}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#1a1a2e',
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)'
                  }
                }}
              >
                {isLoading ? <Loader className="animate-spin" size={20} /> : <Zap size={20} />}
                Alle Tests
              </Button>
              <Button
                onClick={clearResults}
                variant="outlined"
                sx={{
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  '&:hover': {
                    borderColor: '#FFA500',
                    color: '#FFA500'
                  }
                }}
              >
                Ergebnisse löschen
              </Button>
            </Box>
          </Box>
          
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {apiEndpoints.map((endpoint, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                      borderColor: 'rgba(255, 215, 0, 0.5)'
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Code size={24} color="#FFD700" />
                        <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 600 }}>
                          {endpoint.name}
                        </Typography>
                        <Chip 
                          label={endpoint.method} 
                          size="small"
                          sx={{ 
                            backgroundColor: endpoint.method === 'GET' ? '#10b981' : '#f59e0b',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      <Typography sx={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        mb: 2,
                        fontFamily: 'monospace',
                        fontSize: '0.9rem'
                      }}>
                        {endpoint.endpoint}
                      </Typography>
                      <Typography sx={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        mb: 3,
                        fontSize: '0.9rem'
                      }}>
                        {endpoint.description}
                      </Typography>
                      <Button
                        onClick={() => runTest(endpoint)}
                        disabled={isLoading}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#FFD700',
                          color: '#FFD700',
                          '&:hover': {
                            borderColor: '#FFA500',
                            color: '#FFA500',
                            backgroundColor: 'rgba(255, 215, 0, 0.1)'
                          }
                        }}
                      >
                        Test ausführen <ArrowRight size={16} style={{ marginLeft: 8 }} />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <Typography variant="h3" sx={{ 
              color: '#FFD700', 
              fontWeight: 700, 
              mb: 4 
            }}>
              Test Ergebnisse
            </Typography>
            
            <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
              {testResults.map((result, index) => (
                <Card key={index} sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  mb: 2
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {result.success ? (
                        <CheckCircle size={24} color="#10b981" />
                      ) : (
                        <XCircle size={24} color="#ef4444" />
                      )}
                      <Typography variant="h6" sx={{ 
                        color: result.success ? '#10b981' : '#ef4444',
                        fontWeight: 600
                      }}>
                        {result.endpoint}
                      </Typography>
                      <Chip 
                        label={result.success ? 'Erfolgreich' : 'Fehler'} 
                        size="small"
                        sx={{ 
                          backgroundColor: result.success ? '#10b981' : '#ef4444',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box sx={{ 
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: 2,
                      p: 2,
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      color: 'rgba(255,255,255,0.8)',
                      maxHeight: 200,
                      overflow: 'auto'
                    }}>
                      <pre>{JSON.stringify(result.data || result.error, null, 2)}</pre>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}