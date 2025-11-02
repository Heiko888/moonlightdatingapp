'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Person,
  Favorite,
  Info,
  CalendarToday,
  AccessTime,
  LocationOn,
  Mail,
  Phone,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ConnectionKeyFormData {
  name1: string;
  birthDate1: string;
  birthTime1: string;
  birthplace1: string;
  email1: string;
  phone1: string;
  name2: string;
  birthDate2: string;
  birthTime2: string;
  birthplace2: string;
  email2: string;
  question: string;
  notes: string;
}

const steps = [
  'Willkommen',
  'Person 1 - Deine Daten',
  'Person 2 - Die andere Person',
  'Deine Frage',
  'Übersicht & Bestätigung',
];

export default function ConnectionKeyCreatePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ConnectionKeyFormData>({
    name1: '',
    birthDate1: '',
    birthTime1: '',
    birthplace1: '',
    email1: '',
    phone1: '',
    name2: '',
    birthDate2: '',
    birthTime2: '',
    birthplace2: '',
    email2: '',
    question: '',
    notes: '',
  });

  const handleChange = (field: keyof ConnectionKeyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Person 1
        if (!formData.name1 || !formData.birthDate1 || !formData.birthplace1) {
          setError('Bitte fülle alle Pflichtfelder aus (Name, Geburtsdatum, Geburtsort)');
          return false;
        }
        return true;
      
      case 2: // Person 2
        if (!formData.name2 || !formData.birthDate2 || !formData.birthplace2) {
          setError('Bitte fülle alle Pflichtfelder für Person 2 aus');
          return false;
        }
        return true;
      
      case 3: // Frage (optional, aber empfohlen)
        // Frage ist optional, keine Validierung nötig
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError(null);
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || 'anonymous' : 'anonymous';

      const readingData = {
        userId,
        type: 'connectionKey',
        category: 'connection-key',
        title: `Connection Key: ${formData.name1} & ${formData.name2}`,
        question: formData.question || 'Wie ist unsere Resonanz?',
        name1: formData.name1,
        birthdate: formData.birthDate1,
        birthtime: formData.birthTime1,
        birthplace: formData.birthplace1,
        email: formData.email1,
        phone: formData.phone1,
        name2: formData.name2,
        person2: {
          name: formData.name2,
          birthdate: formData.birthDate2,
          birthtime: formData.birthTime2,
          birthplace: formData.birthplace2,
          email: formData.email2,
        },
        notes: formData.notes,
      };

      const response = await fetch('/api/readings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(readingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen des Connection Key Readings');
      }

      // Erfolgreich erstellt - Weiterleitung
      if (typeof window !== 'undefined') {
        // Speichere auch lokal für Offline-Zugriff (wie in resonanzanalyse/page.tsx)
        const existingReadings = JSON.parse(localStorage.getItem('userReadings') || '[]');
        existingReadings.push(data.reading);
        localStorage.setItem('userReadings', JSON.stringify(existingReadings));
        localStorage.setItem('currentReadingId', data.reading.id);
      }

      router.push(`/connection-key/results`);
    } catch (err: any) {
      console.error('Fehler beim Erstellen:', err);
      setError(err.message || 'Fehler beim Erstellen des Connection Key Readings');
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Willkommen
        return (
          <Box>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                💫 The Connection Key
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                Finde heraus, was zwischen euch lebt
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4, maxWidth: 600, mx: 'auto' }}>
                Erstelle eine Resonanzanalyse zwischen dir und einer anderen Person. 
                Entdecke Goldadern, komplementäre Tore und die energetische Verbindung, 
                die euch unsichtbar verbindet.
              </Typography>

              <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(242, 159, 5, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Favorite sx={{ fontSize: 40, color: '#F29F05', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Resonanz
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Entdecke die energetische Verbindung zwischen zwei Menschen
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(242, 159, 5, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Info sx={{ fontSize: 40, color: '#F29F05', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Goldadern
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Sieh die unsichtbaren Linien der Verbindung
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(242, 159, 5, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Person sx={{ fontSize: 40, color: '#F29F05', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Bewusstsein
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Verstehe, was zwischen euch wirklich passiert
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      case 1: // Person 1
        return (
          <Box>
            <Box sx={{ py: 4 }}>
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 700,
                  mb: 4, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                Person 1 - Deine Daten
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dein Name *"
                    value={formData.name1}
                    onChange={(e) => handleChange('name1', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Geburtsdatum *"
                    type="date"
                    value={formData.birthDate1}
                    onChange={(e) => handleChange('birthDate1', e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                      InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Geburtszeit"
                    type="time"
                    value={formData.birthTime1}
                    onChange={(e) => handleChange('birthTime1', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                      InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Geburtsort *"
                    value={formData.birthplace1}
                    onChange={(e) => handleChange('birthplace1', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="E-Mail"
                    type="email"
                    value={formData.email1}
                    onChange={(e) => handleChange('email1', e.target.value)}
                      InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    value={formData.phone1}
                    onChange={(e) => handleChange('phone1', e.target.value)}
                      InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      case 2: // Person 2
        return (
          <Box>
            <Box sx={{ py: 4 }}>
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 700,
                  mb: 4, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                Person 2 - Die andere Person
              </Typography>

              <Alert severity="info" sx={{ mb: 4, background: 'rgba(242, 159, 5, 0.1)', border: '1px solid rgba(242, 159, 5, 0.3)' }}>
                Gib die Daten der Person ein, mit der du die Resonanzanalyse durchführen möchtest. 
                Dies kann ein Partner, Freund, Familienmitglied oder Kollege sein.
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name der Person *"
                    value={formData.name2}
                    onChange={(e) => handleChange('name2', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Geburtsdatum *"
                    type="date"
                    value={formData.birthDate2}
                    onChange={(e) => handleChange('birthDate2', e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                      InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Geburtszeit"
                    type="time"
                    value={formData.birthTime2}
                    onChange={(e) => handleChange('birthTime2', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                      InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Geburtsort *"
                    value={formData.birthplace2}
                    onChange={(e) => handleChange('birthplace2', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-Mail (optional)"
                    type="email"
                    value={formData.email2}
                    onChange={(e) => handleChange('email2', e.target.value)}
                      InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail sx={{ color: '#F29F05' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#F29F05' },
                        '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      case 3: // Frage
        return (
          <Box>
            <Box sx={{ py: 4 }}>
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 700,
                  mb: 4, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                Deine Frage (optional)
              </Typography>

              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, textAlign: 'center' }}>
                Hast du eine spezifische Frage zur Resonanz zwischen euch beiden? 
                Dies hilft uns, die Analyse zu fokussieren.
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={6}
                label="Deine Frage zur Resonanz"
                placeholder="z.B. Warum fühle ich mich so besonders, wenn wir zusammen sind?"
                value={formData.question}
                onChange={(e) => handleChange('question', e.target.value)}
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: '#F29F05' },
                    '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                  },
                }}
              />

              <Box sx={{ mt: 4 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notizen (optional)"
                  placeholder="Weitere Informationen oder Anmerkungen..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  sx={{
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: '#F29F05' },
                      '&.Mui-focused fieldset': { borderColor: '#F29F05' },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        );

      case 4: // Übersicht
        return (
          <Box>
            <Box sx={{ py: 4 }}>
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 700,
                  mb: 4, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                Übersicht & Bestätigung
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(242, 159, 5, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2,
                          background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 700,
                        }}
                      >
                        Person 1 (Du)
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                        <strong>Name:</strong> {formData.name1}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                        <strong>Geburtsdatum:</strong> {formData.birthDate1}
                      </Typography>
                      {formData.birthTime1 && (
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                          <strong>Geburtszeit:</strong> {formData.birthTime1}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                        <strong>Geburtsort:</strong> {formData.birthplace1}
                      </Typography>
                      {formData.email1 && (
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          <strong>E-Mail:</strong> {formData.email1}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(242, 159, 5, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2,
                          background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 700,
                        }}
                      >
                        Person 2
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                        <strong>Name:</strong> {formData.name2}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                        <strong>Geburtsdatum:</strong> {formData.birthDate2}
                      </Typography>
                      {formData.birthTime2 && (
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                          <strong>Geburtszeit:</strong> {formData.birthTime2}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                        <strong>Geburtsort:</strong> {formData.birthplace2}
                      </Typography>
                      {formData.email2 && (
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          <strong>E-Mail:</strong> {formData.email2}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {formData.question && (
                  <Grid item xs={12}>
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                          Deine Frage
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {formData.question}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  // Sparkle-Positionen für animierte Hintergrund-Funken
  const sparklePositions = [
    { left: 15, top: 20 }, { left: 75, top: 35 }, { left: 45, top: 60 },
    { left: 85, top: 15 }, { left: 25, top: 80 }, { left: 65, top: 45 },
    { left: 10, top: 55 }, { left: 90, top: 70 }, { left: 35, top: 25 },
    { left: 55, top: 85 }, { left: 70, top: 10 }, { left: 30, top: 90 },
    { left: 50, top: 40 }, { left: 20, top: 65 }, { left: 80, top: 50 }
  ];

  const sparkleAnimations = [
    { duration: 2.5, delay: 0.3 }, { duration: 3.2, delay: 1.1 }, { duration: 2.8, delay: 0.7 },
    { duration: 3.5, delay: 1.5 }, { duration: 2.3, delay: 0.5 }, { duration: 3.8, delay: 1.8 },
    { duration: 2.6, delay: 0.9 }, { duration: 3.0, delay: 1.2 }, { duration: 2.9, delay: 0.4 },
    { duration: 3.3, delay: 1.6 }, { duration: 2.7, delay: 0.8 }, { duration: 3.6, delay: 1.4 },
    { duration: 2.4, delay: 0.6 }, { duration: 3.1, delay: 1.3 }, { duration: 2.5, delay: 0.9 }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(242, 159, 5, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(140, 29, 4, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(242, 159, 5, 0.08) 0%, transparent 50%),
          linear-gradient(180deg, #0b0a0f 0%, #0b0a0f 60%)
        `,
        backgroundAttachment: 'fixed',
        position: 'relative',
        pt: 4,
        pb: 8,
        overflow: 'hidden',
      }}
    >
      {/* Animated Gradient Circles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${600 + i * 200}px`,
            height: `${600 + i * 200}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(242, 159, 5, ${0.08 - i * 0.02}), transparent)`,
            left: `${20 + i * 30}%`,
            top: `${10 + i * 20}%`,
            pointerEvents: 'none',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, Math.sin(i) * 50, 0],
            y: [0, Math.cos(i) * 50, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Sparkles */}
      {sparklePositions.map((pos, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${pos.left}%`,
            top: `${pos.top}%`,
            width: '4px',
            height: '4px',
            background: '#F29F05',
            borderRadius: '50%',
            boxShadow: '0 0 6px rgba(242, 159, 5, 0.8)',
            pointerEvents: 'none',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: sparkleAnimations[i].duration,
            delay: sparkleAnimations[i].delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, height: 200, mx: 'auto' }}>
            <Image
              src="/images/connection-key-logo.png"
              alt="The Connection Key"
              fill
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </Box>
        </Box>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 4,
            '& .MuiStepLabel-root .Mui-completed': {
              color: '#F29F05',
            },
            '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: '#F29F05',
            },
            '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
              color: '#F29F05',
              fontWeight: 700,
            },
            '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
              fill: '#000',
            },
            '& .MuiStepIcon-root': {
              color: 'rgba(255, 255, 255, 0.3)',
              '&.Mui-active': {
                color: '#F29F05',
              },
              '&.Mui-completed': {
                color: '#F29F05',
              },
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Step Content */}
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minHeight: 400,
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            startIcon={<ArrowBack />}
            sx={{
              color: '#F29F05',
              '&:hover': {
                background: 'rgba(242, 159, 5, 0.1)',
              },
              '&:disabled': {
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Zurück
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} /> : activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
            sx={{
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              color: '#fff',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(242, 159, 5, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(242, 159, 5, 0.5)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading
              ? 'Wird erstellt...'
              : activeStep === steps.length - 1
              ? 'Connection Key erstellen'
              : 'Weiter'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

