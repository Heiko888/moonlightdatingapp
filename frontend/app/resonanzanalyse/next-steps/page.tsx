"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Paper
} from '@mui/material';
import {
  VideoCall,
  CheckCircle,
  Schedule,
  Download,
  ArrowBack,
  Email
} from '@mui/icons-material';
import { safeJsonParse } from '@/lib/supabase/client';

interface ReadingData {
  id: string;
  title: string;
  email: string;
  birthdate: string;
  birthtime: string;
  birthplace: string;
  status: string;
  category: string;
}

const NextStepsPage: React.FC = () => {
  const router = useRouter();
  const [readingData, setReadingData] = useState<ReadingData | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentReadingId = localStorage.getItem('currentReadingId');
      if (currentReadingId) {
        const readings = safeJsonParse(localStorage.getItem('userReadings') || '[]', []);
        const currentReading = readings.find((r: ReadingData) => r.id === currentReadingId);
        if (currentReading) {
          setReadingData(currentReading);
        }
      }
    }
  }, []);

  const steps = [
    {
      label: 'Anmeldung erfolgreich ✅',
      description: 'Deine Reading-Anfrage wurde erfolgreich gespeichert.',
      icon: <CheckCircle sx={{ color: '#10b981', fontSize: 48 }} />,
      status: 'completed'
    },
    {
      label: 'Bestätigungs-E-Mail',
      description: `Wir haben dir eine Bestätigung an ${readingData?.email || 'deine E-Mail'} gesendet. Bitte prüfe auch deinen Spam-Ordner.`,
      icon: <Email sx={{ color: '#3b82f6', fontSize: 48 }} />,
      status: 'current'
    },
    {
      label: 'Zoom-Termin vereinbaren',
      description: 'Unser Coach wird sich innerhalb von 24-48 Stunden bei dir melden, um einen Termin für dein persönliches Live-Reading via Zoom zu vereinbaren.',
      icon: <Schedule sx={{ color: '#eab308', fontSize: 48 }} />,
      status: 'pending'
    },
    {
      label: 'Live-Reading via Zoom',
      description: 'In einer 60-90 minütigen Zoom-Session analysiert unser zertifizierter Human Design Coach dein Chart und beantwortet alle deine Fragen persönlich.',
      icon: <VideoCall sx={{ color: '#8b5cf6', fontSize: 48 }} />,
      status: 'pending'
    },
    {
      label: 'Download deines Readings',
      description: 'Nach dem Live-Reading und der Coach-Freigabe erhältst du dein vollständiges Reading als PDF-Datei zum Download.',
      icon: <Download sx={{ color: '#ff6b9d', fontSize: 48 }} />,
      status: 'pending'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden',
      py: { xs: 4, md: 8 }
    }}>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <CheckCircle 
            sx={{ 
              fontSize: 80, 
              color: '#10b981', 
              mb: 2,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.7 }
              }
            }} 
          />
          <Typography
            variant="h2"
            sx={{
              background: 'linear-gradient(135deg, #10b981, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 2
            }}
          >
            Glückwunsch! 🎉
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              mb: 1,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
            Deine Reading-Anfrage wurde erfolgreich gespeichert
          </Typography>
          {readingData && (
            <Chip 
              label={`Reading: ${readingData.title}`}
              sx={{ 
                mt: 2, 
                background: 'rgba(255, 107, 157, 0.2)', 
                color: '#ff6b9d',
                fontWeight: 600,
                fontSize: '1rem',
                py: 2.5,
                px: 1
              }}
            />
          )}
        </Box>

        {/* Main Content Card */}
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 3,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            p: 4,
            mb: 4
          }}
        >
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
            🚀 So geht es weiter
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, lineHeight: 1.8 }}>
            Dein Human Design Reading ist mehr als nur ein Dokument – es ist eine <strong>persönliche Reise zu deinem authentischen Selbst</strong>. 
            Deshalb begleitet dich einer unserer zertifizierten Human Design Coaches durch den gesamten Prozess.
          </Typography>

          {/* Stepper */}
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label} expanded>
                <StepLabel
                  StepIconComponent={() => (
                    <Box sx={{ mr: 2 }}>
                      {step.icon}
                    </Box>
                  )}
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.2rem'
                    }
                  }}
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, lineHeight: 1.7 }}>
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Info Box */}
        <Card 
          sx={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 107, 157, 0.1))',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 3,
            mb: 4
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: '#8b5cf6', fontWeight: 700, mb: 2 }}>
              💡 Warum ein Live-Reading?
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
              Human Design ist komplex und individuell. In deinem persönlichen Live-Reading via Zoom kann unser Coach:
            </Typography>
            <Box component="ul" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, pl: 2 }}>
              <li>Dein Chart im Detail erklären und auf deine spezifischen Fragen eingehen</li>
              <li>Missverständnisse direkt klären und tiefere Zusammenhänge aufzeigen</li>
              <li>Praktische Tipps geben, wie du dein Design im Alltag umsetzen kannst</li>
              <li>Eine interaktive Lernerfahrung schaffen, die nachhaltig wirkt</li>
            </Box>
          </CardContent>
        </Card>

        {/* Important Info */}
        <Card 
          sx={{ 
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: 3,
            mb: 4
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: '#eab308', fontWeight: 700, mb: 2 }}>
              ⚠️ Wichtige Hinweise
            </Typography>
            <Box component="ul" sx={{ color: 'rgba(255,255,255,0.7)', pl: 2, '& li': { mb: 1 } }}>
              <li>Prüfe deine E-Mails (auch Spam-Ordner) für die Bestätigung</li>
              <li>Unser Coach meldet sich innerhalb von 24-48 Stunden für die Terminvereinbarung</li>
              <li>Das Live-Reading dauert ca. 60-90 Minuten – plane genügend Zeit ein</li>
              <li>Dein vollständiges Reading-PDF ist erst nach dem Live-Reading und Coach-Freigabe verfügbar</li>
              <li>Bereite deine Fragen vor, um das Maximum aus dem Reading herauszuholen</li>
            </Box>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/reading')}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                borderColor: '#ff6b9d',
                backgroundColor: 'rgba(255, 107, 157, 0.1)'
              }
            }}
          >
            Zurück zu Readings
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push('/dashboard')}
            sx={{
              background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(45deg, #ff5a8a, #b83a5a)',
              }
            }}
          >
            Zum Dashboard
          </Button>
        </Box>

        {/* Contact Info */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Fragen? Kontaktiere uns unter{' '}
            <Typography 
              component="span" 
              sx={{ 
                color: '#ff6b9d', 
                fontWeight: 600,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              support@humandesign.app
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NextStepsPage;

