"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  Tabs, 
  Tab, 
  Switch, 
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import { 
  Download, 
  Users, 
  Settings, 
  RotateCcw,
  Zap,
  Eye,
  ArrowLeft,
  Upload,
  Palette,
  Star,
  Sparkles,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Bodygraph from '@/components/Bodygraph';
import EnhancedBodygraph from '@/components/EnhancedBodygraph';
import AnimatedBodygraph from '@/components/AnimatedBodygraph';
import BodygraphComparison from '@/components/BodygraphComparison';
import ChartEditor from '@/components/ChartEditor';
import { DefinedState } from '@/lib/hd-bodygraph/types';
import { ChartData, ChartService } from '@/lib/hd-bodygraph/chartService';
import { ChartTheme, getDefaultTheme } from '@/lib/hd-bodygraph/themes';

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
      id={`bodygraph-tabpanel-${index}`}
      aria-labelledby={`bodygraph-tab-${index}`}
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

export default function AdvancedBodygraphDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [defined, setDefined] = useState<DefinedState>({
    centers: { 
      SACRAL: true, 
      THROAT: true,
      G: true 
    },
    channels: { 
      "34-20": true,
      "1-8": true,
      "10-20": true
    },
    gates: { 
      34: true, 
      20: true,
      1: true,
      8: true,
      10: true
    }
  });
  const [currentTheme, setCurrentTheme] = useState<ChartTheme>(getDefaultTheme());

  const [availableCharts, setAvailableCharts] = useState<ChartData[]>([]);
  const [selectedChart, setSelectedChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation settings
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [showGateNumbers, setShowGateNumbers] = useState(true);

  // Load available charts
  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    setLoading(true);
    try {
      // Verwende Demo-Charts direkt
      const charts = ChartService.getDemoCharts();
      setAvailableCharts(charts);
      if (charts.length > 0) {
        setSelectedChart(charts[0]);
        setDefined(charts[0].defined);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Charts:', error);
      setError('Fehler beim Laden der Charts');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (type: 'generator' | 'projector' | 'manifestor' | 'reflector') => {
    const demoData = ChartService.generateDemoChart(type);
    setSelectedChart(demoData);
    setDefined(demoData.defined);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const resetToDefaults = () => {
    setDefined({
      centers: { 
        SACRAL: true, 
        THROAT: true,
        G: true 
      },
      channels: { 
        "34-20": true,
        "1-8": true,
        "10-20": true
      },
      gates: { 
        34: true, 
        20: true,
        1: true,
        8: true,
        10: true
      }
    });
    setCurrentTheme(getDefaultTheme());
    setAnimationEnabled(true);
    setAnimationSpeed(1);
    setShowLabels(true);
    setShowGateNumbers(true);
  };

  const handleSaveChart = () => {
    console.log('Chart gespeichert:', { defined, theme: currentTheme });
    // Hier könnte die Speicherung implementiert werden
  };

  const handleThemeChange = (theme: ChartTheme) => {
    setCurrentTheme(theme);
  };

  const router = useRouter();

  // Animierte Sterne für den Hintergrund
  const AnimatedStars = () => (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '2px',
            height: '2px',
            background: 'white',
            borderRadius: '50%',
            opacity: Math.random() * 0.8 + 0.2
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton
              onClick={() => router.push('/premium-dashboard')}
              sx={{
                color: '#FFD700',
                mr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                }
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
              }}>
                <Target size={28} color="white" />
              </Box>
              
              <Box>
                <Typography variant="h3" sx={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  mb: 1
                }}>
                  Erweiterte Bodygraph Features
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  Alle neuen Funktionen: Export, Animationen, Vergleich, echte Daten
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<Sparkles size={16} />} 
                    label="AI-Powered" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                  <Chip 
                    icon={<Star size={16} />} 
                    label="Premium" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                  <Chip 
                    icon={<Upload size={16} />} 
                    label="SVG Integration" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Premium Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper sx={{ 
            mb: 3,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <Box sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom sx={{ color: '#FFD700', fontWeight: 600 }}>
                Beispiel-Typen
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => loadExample('generator')}
                  sx={{
                    color: '#8b5cf6',
                    borderColor: '#8b5cf6',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      borderColor: '#8b5cf6',
                      boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                    }
                  }}
                >
                  Generator
                </Button>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => loadExample('projector')}
                  sx={{
                    color: '#06b6d4',
                    borderColor: '#06b6d4',
                    '&:hover': {
                      backgroundColor: 'rgba(6, 182, 212, 0.1)',
                      borderColor: '#06b6d4',
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                    }
                  }}
                >
                  Projector
                </Button>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => loadExample('manifestor')}
                  sx={{
                    color: '#10b981',
                    borderColor: '#10b981',
                    '&:hover': {
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderColor: '#10b981',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                    }
                  }}
                >
                  Manifestor
                </Button>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => loadExample('reflector')}
                  sx={{
                    color: '#f59e0b',
                    borderColor: '#f59e0b',
                    '&:hover': {
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      borderColor: '#f59e0b',
                      boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
                    }
                  }}
                >
                  Reflector
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Echte Daten
              </Typography>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <FormControl fullWidth size="small">
                  <InputLabel>Chart auswählen</InputLabel>
                  <Select
                    value={selectedChart?.id || ''}
                    onChange={(e) => {
                      const chart = availableCharts.find(c => c.id === e.target.value);
                      if (chart) {
                        setSelectedChart(chart);
                        setDefined(chart.defined);
                      }
                    }}
                    label="Chart auswählen"
                  >
                    {availableCharts.map((chart) => (
                      <MenuItem key={chart.id} value={chart.id}>
                        {chart.name} ({chart.type})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Animation
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={animationEnabled}
                      onChange={(e) => setAnimationEnabled(e.target.checked)}
                    />
                  }
                  label="Animationen"
                />
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Geschwindigkeit: {animationSpeed}x
                  </Typography>
                  <Slider
                    value={animationSpeed}
                    onChange={(_, value) => setAnimationSpeed(value as number)}
                    min={0.5}
                    max={3}
                    step={0.5}
                    disabled={!animationEnabled}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Anzeige
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showLabels}
                      onChange={(e) => setShowLabels(e.target.checked)}
                    />
                  }
                  label="Labels"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={showGateNumbers}
                      onChange={(e) => setShowGateNumbers(e.target.checked)}
                    />
                  }
                  label="Gate-Nummern"
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RotateCcw size={16} />}
                  onClick={resetToDefaults}
                >
                  Zurücksetzen
                </Button>
              </Box>
            </Grid>
          </Grid>
            </Box>
          </Paper>
        </motion.div>

        {/* Premium Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Paper sx={{ 
            mb: 3,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="bodygraph tabs"
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-selected': {
                      color: '#FFD700'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#FFD700'
                  }
                }}
              >
          <Tab 
            label="Standard Bodygraph" 
            icon={<Eye size={16} />}
            iconPosition="start"
          />
          <Tab 
            label="Mit Export-Funktionen" 
            icon={<Download size={16} />}
            iconPosition="start"
          />
          <Tab 
            label="Animierte Version" 
            icon={<Zap size={16} />}
            iconPosition="start"
          />
          <Tab 
            label="Chart-Vergleich" 
            icon={<Users size={16} />}
            iconPosition="start"
          />
          <Tab 
            label="Chart-Bearbeitung" 
            icon={<Settings size={16} />}
            iconPosition="start"
          />
              </Tabs>
            </Box>
          </Paper>
        </motion.div>

        {/* Premium Tab Panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TabPanel value={activeTab} index={0}>
            <Paper sx={{ 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#FFD700', fontWeight: 600 }}>
                  Standard Bodygraph mit Hover-Effekten und Tooltips
                </Typography>
            <Bodygraph 
              defined={defined}
              width={600}
              height={800}
              showLabels={showLabels}
              showGateNumbers={showGateNumbers}
            />
              </Box>
            </Paper>
          </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Card sx={{ textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#1a1a2e' }}>
              Enhanced Bodygraph mit Export-Funktionen
            </Typography>
            <EnhancedBodygraph 
              defined={defined}
              chartData={selectedChart || undefined}
              width={600}
              height={800}
              showLabels={showLabels}
              showGateNumbers={showGateNumbers}
              showExportButtons={true}
              showSettings={true}
            />
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Card sx={{ textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#1a1a2e' }}>
              Animierte Bodygraph mit Staggered Loading
            </Typography>
            <AnimatedBodygraph 
              defined={defined}
              width={600}
              height={800}
              showLabels={showLabels}
              showGateNumbers={showGateNumbers}
              animationSpeed={animationSpeed}
            />
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Typography variant="h6" sx={{ mb: 3, color: '#1a1a2e' }}>
          Chart-Vergleich mit Statistiken
        </Typography>
        <BodygraphComparison />
      </TabPanel>

      {/* Info Cards */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'rgba(83, 52, 131, 0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#533483', mb: 2 }}>
                🎯 Neue Features
              </Typography>
              <ul style={{ color: '#6c757d', paddingLeft: 20 }}>
                <li>Echte Backend-Integration</li>
                <li>Hover-Effekte & Tooltips</li>
                <li>PDF/SVG/PNG Export</li>
                <li>Chart-Vergleich</li>
                <li>Animierte Versionen</li>
                <li>Erweiterte Styling-Optionen</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#10b981', mb: 2 }}>
                🚀 Performance
              </Typography>
              <ul style={{ color: '#6c757d', paddingLeft: 20 }}>
                <li>Pure SVG (keine schweren Libraries)</li>
                <li>Optimierte Animationen</li>
                <li>Lazy Loading</li>
                <li>Responsive Design</li>
                <li>SSR-sicher</li>
                <li>TypeScript-typisiert</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'rgba(255, 215, 0, 0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#f59e0b', mb: 2 }}>
                🎨 Styling
              </Typography>
              <ul style={{ color: '#6c757d', paddingLeft: 20 }}>
                <li>Konfigurierbare Farben</li>
                <li>Glow-Effekte</li>
                <li>Hover-Animationen</li>
                <li>Responsive Größen</li>
                <li>Theme-Integration</li>
                <li>Custom CSS-Animationen</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart-Bearbeitung Tab */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, color: '#1a1a2e' }}>
                  Live Chart-Vorschau mit Theme
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: currentTheme.colors.background,
                  border: `2px solid ${currentTheme.colors.accent}`
                }}>
                  <Bodygraph 
                    defined={defined}
                    width={600}
                    height={800}
                    showLabels={showLabels}
                    showGateNumbers={showGateNumbers}
                    theme={currentTheme}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <ChartEditor
              defined={defined}
              onDefinedChange={setDefined}
              theme={currentTheme}
              onThemeChange={handleThemeChange}
              onSave={handleSaveChart}
              onReset={resetToDefaults}
            />
          </Grid>
        </Grid>
      </TabPanel>
        </motion.div>

      {/* SVG Integration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Paper sx={{ 
          mt: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
              }}>
                <Upload size={24} color="white" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  mb: 1
                }}>
                  Eigene SVG Integration
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Lade deine eigenen SVG-Charts hoch und integriere sie in das System
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: 2,
                  p: 3,
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <Typography variant="h6" sx={{ color: '#10b981', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Upload size={20} />
                    SVG Upload
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      color: '#10b981',
                      borderColor: '#10b981',
                      py: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderColor: '#10b981',
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                      }
                    }}
                  >
                    SVG-Datei hochladen
                  </Button>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
                    Unterstützte Formate: SVG, PNG, JPG (max. 10MB)
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: 2,
                  p: 3,
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <Typography variant="h6" sx={{ color: '#8b5cf6', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Palette size={20} />
                    Custom Styling
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      color: '#8b5cf6',
                      borderColor: '#8b5cf6',
                      py: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderColor: '#8b5cf6',
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                      }
                    }}
                  >
                    Styling anpassen
                  </Button>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
                    Passe Farben, Größe und Animationen an
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 3, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                🎨 SVG Integration Features
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star size={16} color="#FFD700" />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Responsive Scaling
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star size={16} color="#FFD700" />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Interactive Elements
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star size={16} color="#FFD700" />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Animation Support
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star size={16} color="#FFD700" />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Export Options
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
    </Box>
  );
}
