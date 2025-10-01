"use client";
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Star, 
  User, 
  Heart, 
  Brain, 
  Crown, 
  Target, 
  Eye, 
  Save, 
  Download, 
  Play,
  Info,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Settings
} from 'lucide-react';

interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  profile: string;
  authority: string;
  strategy: string;
  definedCenters: string[];
  activeChannels: string[];
      color: string;
}

const chartTemplates: ChartTemplate[] = [
  {
    id: 'manifestor',
    name: 'Manifestor',
    description: 'Der Initiator - bringt Dinge in Bewegung',
    type: 'Manifestor',
    profile: '4/1',
    authority: 'Splenic',
    strategy: 'Inform',
    definedCenters: ['head', 'ajna', 'throat', 'g', 'spleen', 'root'],
    activeChannels: ['1-8', '2-14', '10-20', '20-34'],
    color: '#ef4444'
  },
  {
    id: 'generator',
    name: 'Generator',
    description: 'Der Lebenskraft - antwortet und manifestiert',
    type: 'Generator',
    profile: '2/4',
    authority: 'Sacral',
    strategy: 'Wait to Respond',
    definedCenters: ['sacral', 'spleen', 'root'],
    activeChannels: ['2-14', '10-20', '20-34'],
    color: '#f59e0b'
  },
  {
    id: 'projector',
    name: 'Projector',
    description: 'Der Führer - erkennt und leitet andere',
    type: 'Projector',
    profile: '5/1',
    authority: 'Splenic',
    strategy: 'Wait for Invitation',
    definedCenters: ['head', 'ajna', 'throat', 'g', 'spleen'],
    activeChannels: ['1-8', '2-14', '10-20'],
    color: '#8b5cf6'
  },
  {
    id: 'reflector',
    name: 'Reflector',
    description: 'Der Spiegel - reflektiert die Umgebung',
    type: 'Reflector',
    profile: '6/2',
    authority: 'Lunar',
    strategy: 'Wait a Lunar Cycle',
    definedCenters: [],
    activeChannels: [],
    color: '#06b6d4'
  }
];

export default function ChartEditorPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<ChartTemplate | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [customChart, setCustomChart] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    type: '',
    profile: '',
    authority: '',
    strategy: ''
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const steps = [
    {
      label: 'Willkommen',
      description: 'Lerne den Chart-Editor kennen'
    },
    {
      label: 'Template wählen',
      description: 'Wähle einen vorgefertigten Chart-Typ'
    },
    {
      label: 'Anpassen',
      description: 'Personalisiere deinen Chart'
    },
    {
      label: 'Fertig',
      description: 'Speichere und teile deinen Chart'
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTemplateSelect = (template: ChartTemplate) => {
    setSelectedTemplate(template);
    setCustomChart(prev => ({
      ...prev,
      type: template.type,
      profile: template.profile,
      authority: template.authority,
      strategy: template.strategy
    }));
  };

  const handleGenerateChart = async () => {
    setIsCalculating(true);
    try {
      // Echte Chart-Berechnung mit Backend API
      const response = await fetch('http://localhost:4001/charts/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birth_date: customChart.birthDate,
          birth_time: customChart.birthTime,
          birth_place: customChart.birthPlace,
          name: customChart.name
        })
      });

      if (response.ok) {
        const calculatedChart = await response.json();
        console.log('✅ Echter Chart berechnet:', calculatedChart);
        
        // Aktualisiere die Chart-Daten mit den echten Berechnungen
        setCustomChart(prev => ({
      ...prev,
          type: calculatedChart.chartData?.metadata?.type || selectedTemplate?.type,
          profile: calculatedChart.chartData?.metadata?.profile || selectedTemplate?.profile,
          authority: calculatedChart.chartData?.metadata?.authority || selectedTemplate?.authority,
          strategy: calculatedChart.chartData?.metadata?.strategy || selectedTemplate?.strategy
        }));
        
        setActiveStep(3);
      } else {
        console.error('❌ Chart-Berechnung fehlgeschlagen:', response.statusText);
        // Fallback: Verwende Template-Daten
        setActiveStep(3);
      }
    } catch (error) {
      console.error('❌ Fehler bei Chart-Berechnung:', error);
      // Fallback: Verwende Template-Daten
      setActiveStep(3);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
              }}
            >
              <Sparkles size={48} style={{ marginRight: '16px', display: 'inline' }} />
              Chart Editor
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Erstelle deinen persönlichen Human Design Chart
            </Typography>
            
            {/* Quick Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<BookOpen size={20} />}
                onClick={() => setShowTutorial(true)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': { borderColor: 'white' }
                }}
              >
                Tutorial anzeigen
              </Button>
              <Button
                variant="contained"
                startIcon={<Play size={20} />}
                onClick={() => setActiveStep(1)}
                sx={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#1f2937',
                  fontWeight: 700
                }}
              >
                Jetzt starten
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Tutorial Dialog */}
        <Dialog 
          open={showTutorial} 
          onClose={() => setShowTutorial(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#1f2937',
            fontWeight: 700
          }}>
            <BookOpen size={24} style={{ marginRight: '12px', display: 'inline' }} />
            Chart Editor Tutorial
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              So funktioniert der Chart Editor:
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>1. Template wählen:</strong> Wähle einen vorgefertigten Human Design Typ
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>2. Anpassen:</strong> Personalisiere deinen Chart mit deinen Daten
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>3. Generieren:</strong> Erstelle deinen persönlichen Chart
              </Typography>
              <Typography variant="body1">
                <strong>4. Speichern:</strong> Exportiere oder teile deinen Chart
              </Typography>
            </Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>Tipp:</strong> Du kannst jederzeit zwischen den Schritten wechseln und deine Einstellungen anpassen.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowTutorial(false)}>
              Verstanden
            </Button>
            <Button 
              variant="contained" 
              onClick={() => {
                setShowTutorial(false);
                setActiveStep(1);
              }}
              sx={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#1f2937',
                fontWeight: 700
              }}
            >
              Jetzt starten
            </Button>
          </DialogActions>
        </Dialog>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Stepper */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'sticky',
              top: 20
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  <Settings size={24} style={{ marginRight: '12px', display: 'inline' }} />
                  Chart Erstellung
                </Typography>

                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        sx={{
                          '& .MuiStepLabel-label': {
                            color: 'white',
                            fontWeight: activeStep === index ? 600 : 400
                          },
                          '& .MuiStepIcon-root': {
                            color: activeStep === index ? '#FFD700' : 'rgba(255,255,255,0.3)'
                          }
                        }}
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                          {step.description}
                        </Typography>
                        {index < steps.length - 1 && (
                          <Button
                            size="small"
                            onClick={handleNext}
                            sx={{
                              color: '#FFD700',
                              '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' }
                            }}
                          >
                            Weiter
                            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                          </Button>
                        )}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Grid>

          {/* Content Area */}
          <Grid item xs={12} md={8}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              minHeight: 600
            }}>
              <CardContent sx={{ p: 4 }}>
                {/* Step 0: Welcome */}
                {activeStep === 0 && (
                  <motion.div
                    
                    
                    
                  >
                    <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
                      Willkommen im Chart Editor! 🎉
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, lineHeight: 1.6 }}>
                      Hier kannst du deinen persönlichen Human Design Chart erstellen und anpassen. 
                      Wir führen dich Schritt für Schritt durch den Prozess.
                          </Typography>
                    
                    <Alert severity="success" sx={{ mb: 3 }}>
                      <strong>Neu hier?</strong> Kein Problem! Klicke auf "Tutorial anzeigen" für eine detaillierte Anleitung.
                    </Alert>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<Star size={16} />} 
                        label="Einfach zu bedienen" 
                        sx={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}
                      />
                      <Chip 
                        icon={<Brain size={16} />} 
                        label="Vollständig anpassbar" 
                        sx={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}
                      />
                      <Chip 
                        icon={<Download size={16} />} 
                        label="Exportierbar" 
                        sx={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
                        />
                      </Box>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                        variant="contained"
                        size="large"
                        startIcon={<ArrowRight size={24} />}
                        onClick={handleNext}
                        sx={{
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          color: '#1f2937',
                          fontWeight: 700,
                          px: 4,
                          py: 1.5
                        }}
                      >
                        Los geht's!
                        </Button>
                    </Box>
                  </motion.div>
                )}

                {/* Step 1: Template Selection */}
                {activeStep === 1 && (
                  <motion.div
                    
                    
                    
                  >
                    <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
                      Wähle deinen Human Design Typ
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, lineHeight: 1.6 }}>
                      Wähle einen vorgefertigten Typ aus oder erstelle einen benutzerdefinierten Chart.
                            </Typography>

                    <Grid container spacing={3}>
                      {chartTemplates.map((template) => (
                        <Grid item xs={12} sm={6} key={template.id}>
                          <Card 
                            sx={{
                              background: selectedTemplate?.id === template.id 
                                ? `linear-gradient(135deg, ${template.color}20 0%, ${template.color}10 100%)`
                                : 'rgba(255, 255, 255, 0.05)',
                              border: selectedTemplate?.id === template.id 
                                ? `2px solid ${template.color}` 
                                : '1px solid rgba(255, 255, 255, 0.1)',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: `0 8px 25px ${template.color}40`
                              }
                            }}
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: template.color,
                                  mr: 2
                                }} />
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                  {template.name}
                          </Typography>
                        </Box>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                                {template.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip label={template.profile} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                                <Chip label={template.authority} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {selectedTemplate && (
                      <Alert severity="success" sx={{ mt: 3 }}>
                        <strong>{selectedTemplate.name} ausgewählt!</strong> Du kannst jetzt mit der Anpassung fortfahren.
                      </Alert>
                    )}

                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                      <Button onClick={handleBack} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Zurück
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!selectedTemplate}
                        sx={{
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          color: '#1f2937',
                          fontWeight: 700
                        }}
                      >
                        Weiter
                        <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                      </Button>
                    </Box>
                  </motion.div>
                )}

                {/* Step 2: Customization */}
                {activeStep === 2 && (
                  <motion.div
                    
                    
                    
                  >
                    <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
                      Personalisiere deinen Chart
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, lineHeight: 1.6 }}>
                      Gib deine persönlichen Daten ein, um einen maßgeschneiderten Chart zu erstellen.
                      </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={customChart.name}
                          onChange={(e) => setCustomChart(prev => ({ ...prev, name: e.target.value }))}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Geburtsdatum"
                          type="date"
                          value={customChart.birthDate}
                          onChange={(e) => setCustomChart(prev => ({ ...prev, birthDate: e.target.value }))}
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Geburtszeit"
                          type="time"
                          value={customChart.birthTime}
                          onChange={(e) => setCustomChart(prev => ({ ...prev, birthTime: e.target.value }))}
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Geburtsort"
                          value={customChart.birthPlace}
                          onChange={(e) => setCustomChart(prev => ({ ...prev, birthPlace: e.target.value }))}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                      </Grid>
                    </Grid>

                    {selectedTemplate && (
                      <Alert severity="info" sx={{ mt: 3 }}>
                        <strong>Ausgewählter Typ:</strong> {selectedTemplate.name} - {selectedTemplate.description}
                      </Alert>
                    )}

                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                      <Button onClick={handleBack} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Zurück
                      </Button>
                  <Button
                    variant="contained"
                        onClick={handleGenerateChart}
                        disabled={isCalculating}
                    sx={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: '#1f2937',
                          fontWeight: 700
                    }}
                  >
                        {isCalculating ? 'Berechne Chart...' : 'Chart generieren'}
                        <Sparkles size={20} style={{ marginLeft: '8px' }} />
                  </Button>
                    </Box>
                  </motion.div>
                )}

                {/* Step 3: Chart Display */}
                {activeStep === 3 && (
                  <motion.div
                    
                    
                    
                  >
                    <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
                      Dein Human Design Chart
                    </Typography>
                    
                    {/* Chart Info */}
                    <Alert severity="success" sx={{ mb: 3 }}>
                      <strong>Chart generiert für:</strong> {customChart.name || 'Unbekannt'} - {customChart.type || selectedTemplate?.name} ({customChart.profile || selectedTemplate?.profile})
                    </Alert>

                    {/* Chart Display */}
            <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mb: 4
                    }}>
                      <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                          📊 Chart Vorschau
                </Typography>
                
                        {/* Chart Container */}
                <Box sx={{
                  width: '100%',
                          height: 600,
                          background: 'rgba(255,255,255,0.02)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                          position: 'relative',
                          border: '2px dashed rgba(255,255,255,0.2)',
                          overflow: 'hidden'
                }}>
                          {/* Human Design Bodygraph */}
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                            position: 'relative'
                  }}>
                    <img 
                      src="/SVG Bodchart.svg" 
                              alt="Human Design Bodygraph"
                      style={{ 
                                maxWidth: '90%', 
                                maxHeight: '90%',
                                objectFit: 'contain',
                                filter: 'brightness(1.2) contrast(1.1)'
                              }}
                            />
                            
                            {/* Overlay mit Chart-Info */}
                            <Box sx={{
                              position: 'absolute',
                              top: 20,
                              left: 20,
                              background: 'rgba(0,0,0,0.8)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: 2,
                              p: 2,
                              border: `2px solid ${selectedTemplate?.color || '#FFD700'}`
                            }}>
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                                {customChart.type || selectedTemplate?.name || 'Chart'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                {customChart.type || selectedTemplate?.type} • {customChart.profile || selectedTemplate?.profile}
                              </Typography>
                            </Box>

                            {/* Template-spezifische Farben als Overlay */}
                            {selectedTemplate && (
                              <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `linear-gradient(135deg, ${selectedTemplate.color}10 0%, transparent 50%)`,
                                pointerEvents: 'none'
                              }} />
                            )}
                          </Box>
                        </Box>

                        {/* Chart Summary */}
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                            {customChart.type || selectedTemplate?.type || 'Human Design Chart'}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                            {selectedTemplate?.description || 'Dein persönlicher Chart'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Chip 
                              label={`Profil: ${customChart.profile || selectedTemplate?.profile || 'N/A'}`} 
                              sx={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}
                            />
                            <Chip 
                              label={`Autorität: ${customChart.authority || selectedTemplate?.authority || 'N/A'}`} 
                              sx={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}
                            />
                            <Chip 
                              label={`Strategie: ${customChart.strategy || selectedTemplate?.strategy || 'N/A'}`} 
                              sx={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
                            />
                  </Box>
                </Box>

                        {/* Chart Details */}
                        {selectedTemplate && (
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                              Chart Details
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  <strong>Definierte Zentren:</strong> {selectedTemplate.definedCenters.length}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  <strong>Aktive Kanäle:</strong> {selectedTemplate.activeChannels.length}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  <strong>Geburtsdaten:</strong> {customChart.birthDate} {customChart.birthTime} in {customChart.birthPlace}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
                      <Button
                        variant="contained"
                        startIcon={<Save size={20} />}
                        sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          fontWeight: 700
                        }}
                      >
                        Chart speichern
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Download size={20} />}
                        sx={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          color: 'white',
                          fontWeight: 700
                        }}
                      >
                        Als PDF exportieren
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Eye size={20} />}
                        sx={{
                          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                          color: 'white',
                          fontWeight: 700
                        }}
                      >
                        Vollbild anzeigen
                      </Button>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setActiveStep(0)}
                        sx={{
                          borderColor: 'rgba(255,255,255,0.3)',
                          color: 'white',
                          '&:hover': { borderColor: 'white' }
                        }}
                      >
                        Neuen Chart erstellen
                      </Button>
                    </Box>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
