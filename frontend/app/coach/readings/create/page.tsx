'use client';

import React, { useState, useEffect } from 'react';
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  IconButton,
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
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadingFormData {
  readingType: 'human-design' | 'connectionKey' | '';
  clientName1: string;
  birthDate1: string;
  birthTime1: string;
  birthplace1: string;
  email1: string;
  phone1: string;
  clientName2: string;
  birthDate2: string;
  birthTime2: string;
  birthplace2: string;
  email2: string;
  notes: string;
}

const steps = [
  'Willkommen',
  'Reading-Typ wählen',
  'Klient-Informationen',
  'Person 2 (Connection Key)',
  'Übersicht & Bestätigung',
];

export default function ReadingCreatorPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(false);
  
  const [formData, setFormData] = useState<ReadingFormData>({
    readingType: '',
    clientName1: '',
    birthDate1: '',
    birthTime1: '',
    birthplace1: '',
    email1: '',
    phone1: '',
    clientName2: '',
    birthDate2: '',
    birthTime2: '',
    birthplace2: '',
    email2: '',
    notes: '',
  });

  useEffect(() => {
    // Prüfe ob es das erste Reading ist
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const response = await fetch('/api/coach/readings');
      const data = await response.json();
      
      if (response.ok && data.readings && data.readings.length === 0) {
        setIsFirstTime(true);
      }
    } catch (err) {
      console.error('Fehler beim Prüfen der Readings:', err);
    }
  };

  const handleChange = (field: keyof ReadingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Reading-Typ wählen
        if (!formData.readingType) {
          setError('Bitte wähle einen Reading-Typ');
          return false;
        }
        return true;
      
      case 2: // Klient-Informationen
        if (!formData.clientName1 || !formData.birthDate1 || !formData.birthplace1) {
          setError('Bitte fülle alle Pflichtfelder aus (Name, Geburtsdatum, Geburtsort)');
          return false;
        }
        return true;
      
      case 3: // Person 2 (nur bei Connection Key)
        if (formData.readingType === 'connectionKey') {
          if (!formData.clientName2 || !formData.birthDate2 || !formData.birthplace2) {
            setError('Bitte fülle alle Pflichtfelder für Person 2 aus');
            return false;
          }
        }
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
        // Überspringe Schritt 3 wenn kein Connection Key
        if (activeStep === 2 && formData.readingType !== 'connectionKey') {
          setActiveStep(4);
        } else {
          setActiveStep((prev) => prev + 1);
        }
      }
    }
  };

  const handleBack = () => {
    setError(null);
    // Überspringe Schritt 3 wenn kein Connection Key
    if (activeStep === 4 && formData.readingType !== 'connectionKey') {
      setActiveStep(2);
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const readingData = {
        reading_type: formData.readingType,
        client_name: formData.clientName1,
        reading_data: {
          person1: {
            name: formData.clientName1,
            geburtsdatum: formData.birthDate1,
            geburtszeit: formData.birthTime1,
            geburtsort: formData.birthplace1,
            email: formData.email1,
            telefon: formData.phone1,
          },
          ...(formData.readingType === 'connectionKey' && {
            person2: {
              name: formData.clientName2,
              geburtsdatum: formData.birthDate2,
              geburtszeit: formData.birthTime2,
              geburtsort: formData.birthplace2,
              email: formData.email2,
            },
          }),
          notes: formData.notes,
        },
      };

      const response = await fetch('/api/coach/readings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(readingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen des Readings');
      }

      // Erfolgreich erstellt - Weiterleitung zur Reading-Detail-Seite
      router.push(`/coach/readings/${data.reading.id}`);
    } catch (err: any) {
      console.error('Fehler beim Erstellen:', err);
      setError(err.message || 'Fehler beim Erstellen des Readings');
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Willkommen
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  color: '#e8b86d',
                  fontWeight: 700,
                  mb: 3,
                  background: 'linear-gradient(135deg, #e8b86d 0%, #ffd89b 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {isFirstTime ? '🎉 Willkommen!' : '✨ Neues Reading erstellen'}
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                {isFirstTime
                  ? 'Erstelle dein erstes professionelles Human Design Reading'
                  : 'Erstelle ein neues Reading für einen Klienten'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
                {isFirstTime
                  ? 'Dieser Assistent führt dich Schritt für Schritt durch den Prozess.'
                  : 'Fülle die folgenden Schritte aus, um ein individuelles Reading zu erstellen.'}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(232, 184, 109, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Person sx={{ fontSize: 40, color: '#e8b86d', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Human Design
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Vollständige Analyse für eine einzelne Person
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(79, 195, 247, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Favorite sx={{ fontSize: 40, color: '#4fc3f7', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Connection Key
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Resonanzanalyse zwischen zwei Personen
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <CardContent>
                      <Info sx={{ fontSize: 40, color: '#fff', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Professionell
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Alle Readings werden sicher gespeichert und können exportiert werden
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        );

      case 1: // Reading-Typ wählen
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ py: 4 }}>
              <Typography
                variant="h5"
                sx={{ color: '#e8b86d', fontWeight: 600, mb: 4, textAlign: 'center' }}
              >
                Welchen Reading-Typ möchtest du erstellen?
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={formData.readingType}
                  onChange={(e) => handleChange('readingType', e.target.value)}
                  sx={{ gap: 2 }}
                >
                  <Card
                    sx={{
                      background:
                        formData.readingType === 'human-design'
                          ? 'rgba(232, 184, 109, 0.15)'
                          : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border:
                        formData.readingType === 'human-design'
                          ? '2px solid #e8b86d'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#e8b86d',
                        background: 'rgba(232, 184, 109, 0.1)',
                      },
                    }}
                    onClick={() => handleChange('readingType', 'human-design')}
                  >
                    <CardContent>
                      <FormControlLabel
                        value="human-design"
                        control={<Radio sx={{ color: '#e8b86d' }} />}
                        label={
                          <Box>
                            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                              👤 Human Design Reading
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Vollständige Human Design Analyse für eine einzelne Person. Enthält Typ,
                              Profil, Autorität, Centers, Channels und Gates.
                            </Typography>
                          </Box>
                        }
                        sx={{ margin: 0, width: '100%' }}
                      />
                    </CardContent>
                  </Card>

                  <Card
                    sx={{
                      background:
                        formData.readingType === 'connectionKey'
                          ? 'rgba(79, 195, 247, 0.15)'
                          : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border:
                        formData.readingType === 'connectionKey'
                          ? '2px solid #4fc3f7'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#4fc3f7',
                        background: 'rgba(79, 195, 247, 0.1)',
                      },
                    }}
                    onClick={() => handleChange('readingType', 'connectionKey')}
                  >
                    <CardContent>
                      <FormControlLabel
                        value="connectionKey"
                        control={<Radio sx={{ color: '#4fc3f7' }} />}
                        label={
                          <Box>
                            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                              💫 The Connection Key
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Resonanzanalyse zwischen zwei Personen. Zeigt Goldadern, komplementäre
                              Tore und die energetische Verbindung auf.
                            </Typography>
                          </Box>
                        }
                        sx={{ margin: 0, width: '100%' }}
                      />
                    </CardContent>
                  </Card>
                </RadioGroup>
              </FormControl>
            </Box>
          </motion.div>
        );

      case 2: // Klient-Informationen (Person 1)
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ py: 4 }}>
              <Typography
                variant="h5"
                sx={{ color: '#e8b86d', fontWeight: 600, mb: 4, textAlign: 'center' }}
              >
                Klient-Informationen {formData.readingType === 'connectionKey' ? '(Person 1)' : ''}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name *"
                    value={formData.clientName1}
                    onChange={(e) => handleChange('clientName1', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#e8b86d' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#e8b86d' },
                        '&.Mui-focused fieldset': { borderColor: '#e8b86d' },
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
                          <CalendarToday sx={{ color: '#e8b86d' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#e8b86d' },
                        '&.Mui-focused fieldset': { borderColor: '#e8b86d' },
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
                          <AccessTime sx={{ color: '#e8b86d' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#e8b86d' },
                        '&.Mui-focused fieldset': { borderColor: '#e8b86d' },
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
                          <LocationOn sx={{ color: '#e8b86d' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#e8b86d' },
                        '&.Mui-focused fieldset': { borderColor: '#e8b86d' },
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
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#e8b86d' },
                        '&.Mui-focused fieldset': { borderColor: '#e8b86d' },
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
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#e8b86d' },
                        '&.Mui-focused fieldset': { borderColor: '#e8b86d' },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        );

      case 3: // Person 2 (nur Connection Key)
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ py: 4 }}>
              <Typography
                variant="h5"
                sx={{ color: '#4fc3f7', fontWeight: 600, mb: 4, textAlign: 'center' }}
              >
                Person 2 - Informationen
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name *"
                    value={formData.clientName2}
                    onChange={(e) => handleChange('clientName2', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#4fc3f7' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#4fc3f7' },
                        '&.Mui-focused fieldset': { borderColor: '#4fc3f7' },
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
                          <CalendarToday sx={{ color: '#4fc3f7' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#4fc3f7' },
                        '&.Mui-focused fieldset': { borderColor: '#4fc3f7' },
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
                          <AccessTime sx={{ color: '#4fc3f7' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#4fc3f7' },
                        '&.Mui-focused fieldset': { borderColor: '#4fc3f7' },
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
                          <LocationOn sx={{ color: '#4fc3f7' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#4fc3f7' },
                        '&.Mui-focused fieldset': { borderColor: '#4fc3f7' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-Mail"
                    type="email"
                    value={formData.email2}
                    onChange={(e) => handleChange('email2', e.target.value)}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#4fc3f7' },
                        '&.Mui-focused fieldset': { borderColor: '#4fc3f7' },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        );

      case 4: // Übersicht & Bestätigung
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ py: 4 }}>
              <Typography
                variant="h5"
                sx={{ color: '#e8b86d', fontWeight: 600, mb: 4, textAlign: 'center' }}
              >
                Übersicht & Bestätigung
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(232, 184, 109, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#e8b86d', mb: 2 }}>
                        Reading-Typ
                      </Typography>
                      <Chip
                        label={
                          formData.readingType === 'human-design'
                            ? 'Human Design Reading'
                            : 'The Connection Key'
                        }
                        sx={{
                          background:
                            formData.readingType === 'human-design' ? '#e8b86d' : '#4fc3f7',
                          color: '#000',
                          fontWeight: 600,
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={formData.readingType === 'connectionKey' ? 6 : 12}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(232, 184, 109, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#e8b86d', mb: 2 }}>
                        Person 1
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                        <strong>Name:</strong> {formData.clientName1}
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

                {formData.readingType === 'connectionKey' && (
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(79, 195, 247, 0.3)',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 2 }}>
                          Person 2
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                          <strong>Name:</strong> {formData.clientName2}
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
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notizen (optional)"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#e8b86d' },
                        '&.Mui-focused fieldset': { borderColor: '#e8b86d' },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#000000',
        position: 'relative',
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="md">
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
        {(() => {
          // Filtere sichtbare Schritte basierend auf Reading-Typ
          const visibleSteps = steps.filter(
            (_, index) => !(index === 3 && formData.readingType !== 'connectionKey')
          );
          
          // Berechne aktiven Schritt für Anzeige
          const displayStep =
            activeStep === 4 && formData.readingType !== 'connectionKey'
              ? 3
              : activeStep > 3 && formData.readingType !== 'connectionKey'
              ? activeStep - 1
              : activeStep;

          return (
            <Stepper
              activeStep={Math.min(displayStep, visibleSteps.length - 1)}
              alternativeLabel
              sx={{
                mb: 4,
                '& .MuiStepLabel-root .Mui-completed': {
                  color: '#e8b86d',
                },
                '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiStepLabel-root .Mui-active': {
                  color: '#e8b86d',
                },
                '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                  color: '#e8b86d',
                  fontWeight: 600,
                },
                '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                  fill: '#000',
                },
                '& .MuiStepIcon-root': {
                  color: 'rgba(255, 255, 255, 0.3)',
                  '&.Mui-active': {
                    color: '#e8b86d',
                  },
                  '&.Mui-completed': {
                    color: '#e8b86d',
                  },
                },
              }}
            >
              {visibleSteps.map((label, index) => {
                const stepIndex = formData.readingType !== 'connectionKey' && index >= 3 ? index + 1 : index;
                const isCompleted = stepIndex < activeStep;
                const isActive = stepIndex === activeStep;

                return (
                  <Step key={label} completed={isCompleted}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          );
        })()}

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
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            startIcon={<ArrowBack />}
            sx={{
              color: '#e8b86d',
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
            endIcon={loading ? <CircularProgress size={20} /> : activeStep === steps.length - 1 || (activeStep === 2 && formData.readingType !== 'connectionKey') ? <CheckCircle /> : <ArrowForward />}
            sx={{
              background: 'linear-gradient(135deg, #e8b86d 0%, #ffd89b 100%)',
              color: '#000',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #ffd89b 0%, #e8b86d 100%)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            {loading
              ? 'Wird erstellt...'
              : activeStep === steps.length - 1 || (activeStep === 2 && formData.readingType !== 'connectionKey')
              ? 'Reading erstellen'
              : 'Weiter'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
