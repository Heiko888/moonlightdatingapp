"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Sparkles, 
  Star, 
  Heart, 
  Users, 
  BookOpen, 
  Moon, 
  BarChart3, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Eye,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  Calendar,
  Award
} from 'lucide-react';
import Link from 'next/link';
import HDChart from '../../components/HDChart';

// Animierte Sterne Komponente
const AnimatedStars = () => (
  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {[...Array(25)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: '3px',
          height: '3px',
          background: '#FFD700',
          borderRadius: '50%',
          boxShadow: '0 0 8px #FFD700, 0 0 16px #FFD700, 0 0 24px #FFD700',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0.2, 1, 0.2],
          scale: [0.6, 1.4, 0.6],
        }}
        transition={{
          duration: 2.5 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 3,
        }}
      />
    ))}
  </Box>
);

// Demo Steps Data
const demoSteps = [
  {
    label: 'Chart-Berechnung',
    description: 'Erhalte dein vollständiges Human Design Chart',
    content: {
      type: 'chart',
      data: {
        type: 'Manifestor',
        profile: '1/3',
        strategy: 'Informieren',
        authority: 'Splenic',
        centers: {
          defined: ['Head', 'Ajna', 'Throat', 'G', 'Heart', 'Sacral', 'Root'],
          undefined: ['Spleen', 'Solar Plexus']
        },
        channels: ['1-8', '2-14', '3-60', '7-31', '9-52', '10-20', '11-56', '13-33', '16-48', '18-58', '20-34', '26-44', '27-50', '29-46', '32-54', '35-36', '37-40', '41-30', '42-53', '43-23', '45-21', '47-64', '49-19', '51-25', '55-39', '57-20', '59-6', '61-24', '62-17', '63-4', '64-47']
      }
    }
  },
  {
    label: 'KI-gestützte Readings',
    description: 'Personalisiere Analysen und Insights',
    content: {
      type: 'reading',
      data: {
        title: 'Manifestor Reading',
        content: `Als Manifestor besitzt du die einzigartige Fähigkeit, Energie zu initiieren und andere zu beeinflussen. Deine Strategie ist es, andere zu informieren, bevor du handelst. Dies schafft Harmonie und reduziert Widerstand in deinem Umfeld.

Deine 1/3 Profil zeigt einen Forscher mit einem tiefen Bedürfnis nach Verständnis. Du lernst durch Versuch und Irrtum und teilst deine Erkenntnisse mit anderen.

Deine definierten Zentren geben dir Stabilität in diesen Bereichen, während deine offenen Zentren dich empfänglich für die Energie anderer machen.`
      }
    }
  },
  {
    label: 'Mondkalender Integration',
    description: 'Synchronisiere dich mit den Mondphasen',
    content: {
      type: 'calendar',
      data: {
        currentPhase: 'Vollmond',
        recommendations: [
          'Zeit für Manifestation und Vollendung',
          'Energie für wichtige Entscheidungen',
          'Intensive emotionale Verbindungen',
          'Kreative Projekte abschließen'
        ]
      }
    }
  },
  {
    label: 'Community & Coaching',
    description: 'Verbinde dich mit Gleichgesinnten',
    content: {
      type: 'community',
      data: {
        coaches: [
          { name: 'Louisa Ebisch', specialty: 'Beziehungen', rating: 5 },
          { name: 'Heiko Schwaninger', specialty: 'Karriere', rating: 5 },
          { name: 'Janine Christ', specialty: 'Persönlichkeit', rating: 5 }
        ],
        features: ['Live-Sessions', 'Gruppen-Coaching', 'Persönliche Beratung', 'Workshops']
      }
    }
  }
];

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (activeStep < demoSteps.length - 1) {
          setActiveStep(activeStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, activeStep]);

  const renderStepContent = (step: any) => {
    switch (step.content.type) {
      case 'chart':
        return (
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)',
            borderRadius: 4, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            p: 3
          }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <HDChart 
                  data={step.content.data}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ color: '#4a5568', fontWeight: 700, mb: 2 }}>
                  {step.content.data.type} - {step.content.data.profile}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label={`Strategie: ${step.content.data.strategy}`} sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }} />
                  <Chip label={`Autorität: ${step.content.data.authority}`} sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }} />
                  <Chip label={`Definierte Zentren: ${step.content.data.centers.defined.length}`} sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }} />
                </Box>
              </Box>
            </Box>
          </Card>
        );

      case 'reading':
        return (
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)',
            borderRadius: 4, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            p: 4
          }}>
            <Typography variant="h5" sx={{ color: '#4a5568', fontWeight: 700, mb: 3 }}>
              {step.content.data.title}
            </Typography>
            <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {step.content.data.content}
            </Typography>
          </Card>
        );

      case 'calendar':
        return (
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)',
            borderRadius: 4, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            p: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Moon size={32} style={{ color: '#667eea' }} />
              <Typography variant="h5" sx={{ color: '#4a5568', fontWeight: 700 }}>
                {step.content.data.currentPhase}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: '#4a5568', mb: 2 }}>
              Empfehlungen für heute:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {step.content.data.recommendations.map((rec: string, index: number) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle size={20} style={{ color: '#667eea' }} />
                  <Typography variant="body1" sx={{ color: '#4a5568' }}>
                    {rec}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        );

      case 'community':
        return (
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)',
            borderRadius: 4, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            p: 4
          }}>
            <Typography variant="h5" sx={{ color: '#4a5568', fontWeight: 700, mb: 3 }}>
              Unsere Coaches
            </Typography>
            <Grid container spacing={2}>
              {step.content.data.coaches.map((coach: any, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Avatar sx={{ 
                      bgcolor: 'linear-gradient(135deg, #667eea, #764ba2)',
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2,
                      fontWeight: 700
                    }}>
                      {coach.name.split(' ').map((n: string) => n[0]).join('')}
                    </Avatar>
                    <Typography variant="h6" sx={{ color: '#4a5568', fontWeight: 700 }}>
                      {coach.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096', mb: 1 }}>
                      {coach.specialty}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {[...Array(coach.rating)].map((_, i) => (
                        <Star key={i} size={16} style={{ color: '#FFD700', fill: '#FFD700' }} />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 4 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#fff', 
                mb: 3, 
                fontWeight: 800, 
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}
            >
              <Eye size={48} style={{ color: '#FFD700' }} />
              App Demo
              <Eye size={48} style={{ color: '#FFD700' }} />
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Entdecke die wichtigsten Features unserer Human Design App in einer interaktiven Tour
            </Typography>

            {/* Demo Controls */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
              <Button
                variant="outlined"
                onClick={togglePlay}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontWeight: 700,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? ' Pause' : ' Auto-Play'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontWeight: 700,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <SkipBack size={20} />
                Reset
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Demo Content */}
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
            {demoSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '1.1rem'
                    },
                    '& .MuiStepLabel-iconContainer': {
                      color: activeStep >= index ? '#FFD700' : 'rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    {step.description}
                  </Typography>
                  
                  <motion.div
                    
                    
                    
                  >
                    {renderStepContent(step)}
                  </motion.div>
                  
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={activeStep === demoSteps.length - 1}
                        sx={{
                          mr: 1,
                          bgcolor: '#FFD700',
                          color: '#23233a',
                          fontWeight: 700,
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          '&:hover': {
                            bgcolor: '#fbbf24',
                          },
                          '&:disabled': {
                            bgcolor: 'rgba(255,255,255,0.3)',
                            color: 'rgba(255,255,255,0.5)'
                          }
                        }}
                      >
                        {activeStep === demoSteps.length - 1 ? 'Fertig' : 'Weiter'}
                        <ArrowRight size={20} style={{ marginLeft: 8 }} />
                      </Button>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{
                          mr: 1,
                          color: '#fff',
                          borderColor: 'rgba(255,255,255,0.3)',
                          '&:hover': {
                            borderColor: '#fff',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          }
                        }}
                      >
                        <ArrowLeft size={20} style={{ marginRight: 8 }} />
                        Zurück
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* CTA Section */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: '#fff', 
                mb: 3, 
                fontWeight: 800,
                fontSize: { xs: '1.8rem', md: '2.5rem' }
              }}
            >
              Bereit für deine Reise?
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Starte jetzt kostenlos und entdecke dein Human Design
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="#"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#FFD700',
                  color: '#23233a',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                  '&:hover': {
                    bgcolor: '#fbbf24',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Jetzt kostenlos starten
                <ArrowRight size={24} style={{ marginLeft: 8 }} />
              </Button>
              
              <Button
                component={Link}
                href="/sales"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Mehr erfahren
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
