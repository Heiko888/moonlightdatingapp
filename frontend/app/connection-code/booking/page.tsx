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
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  Heart,
  Sparkles,
  Users,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  sessions: number;
  price: number;
  pricePerSession: number;
  savings: number;
  popular: boolean;
  description: string;
}

const packages: Package[] = [
  {
    id: 'single',
    name: 'Einzelsession',
    sessions: 1,
    price: 149,
    pricePerSession: 149,
    savings: 0,
    popular: false,
    description: 'Perfekt zum Kennenlernen'
  },
  {
    id: 'triple',
    name: '3er-Paket',
    sessions: 3,
    price: 399,
    pricePerSession: 133,
    savings: 48,
    popular: true,
    description: 'Am beliebtesten für mehrere Beziehungen'
  },
  {
    id: 'five',
    name: '5er-Paket',
    sessions: 5,
    price: 599,
    pricePerSession: 120,
    savings: 146,
    popular: false,
    description: 'Bester Preis für intensive Analysen'
  }
];

// Verfügbare Termine (Demo - später aus Backend)
const availableSlots = [
  { date: '2025-10-20', time: '10:00', available: true },
  { date: '2025-10-20', time: '14:00', available: true },
  { date: '2025-10-20', time: '16:00', available: false },
  { date: '2025-10-21', time: '10:00', available: true },
  { date: '2025-10-21', time: '14:00', available: true },
  { date: '2025-10-21', time: '18:00', available: true },
  { date: '2025-10-22', time: '10:00', available: true },
  { date: '2025-10-22', time: '14:00', available: true },
];

export default function ConnectionCodeBookingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    partner1Name: '',
    partner1BirthDate: '',
    partner1BirthTime: '',
    partner1BirthPlace: '',
    partner2Name: '',
    partner2BirthDate: '',
    partner2BirthTime: '',
    partner2BirthPlace: '',
    notes: ''
  });

  const steps = ['Paket wählen', 'Termin wählen', 'Deine Daten', 'Bezahlung'];

  // Lade User-Daten
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          name: `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim(),
          email: parsed.email || userEmail || '',
          phone: parsed.phone || ''
        }));
      } catch (e) {}
    } else if (userEmail) {
      setFormData(prev => ({ ...prev, email: userEmail }));
    }
  }, []);

  const handleNext = () => {
    // Validierung
    if (activeStep === 0 && !selectedPackage) {
      setError('Bitte wähle ein Paket aus');
      return;
    }
    if (activeStep === 1 && (!selectedDate || !selectedTime)) {
      setError('Bitte wähle einen Termin aus');
      return;
    }
    if (activeStep === 2) {
      // Validiere Kontaktdaten
      if (!formData.name || !formData.email) {
        setError('Bitte fülle alle Pflichtfelder aus');
        return;
      }
      if (!formData.partner1Name || !formData.partner1BirthDate) {
        setError('Bitte gib die Daten von Partner 1 ein');
        return;
      }
      if (!formData.partner2Name || !formData.partner2BirthDate) {
        setError('Bitte gib die Daten von Partner 2 ein');
        return;
      }
    }
    
    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prev) => prev - 1);
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      // Speichere Buchungsdaten
      const bookingData = {
        package: selectedPackage,
        date: selectedDate,
        time: selectedTime,
        ...formData,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

      // Erstelle Stripe Checkout Session
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage?.id,
          amount: selectedPackage?.price,
          productName: `Connection Code - ${selectedPackage?.name}`,
          successUrl: `${window.location.origin}/connection-code/success`,
          cancelUrl: `${window.location.origin}/connection-code/booking`,
          metadata: {
            bookingType: 'connection-code',
            sessions: selectedPackage?.sessions,
            date: selectedDate,
            time: selectedTime,
            customerEmail: formData.email
          }
        })
      });

      const data = await response.json();

      if (data.url) {
        // Redirect zu Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Fehler beim Erstellen der Buchung');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center', fontWeight: 600 }}>
              Wähle dein Paket
            </Typography>
            <Grid container spacing={3}>
              {packages.map((pkg) => (
                <Grid item xs={12} md={4} key={pkg.id}>
                  <Card
                    onClick={() => setSelectedPackage(pkg)}
                    sx={{
                      cursor: 'pointer',
                      background: selectedPackage?.id === pkg.id
                        ? 'linear-gradient(135deg, rgba(255,107,157,0.3), rgba(78,205,196,0.3))'
                        : 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      border: selectedPackage?.id === pkg.id
                        ? '2px solid #ff6b9d'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 3,
                      transition: 'all 0.3s',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 40px rgba(255,107,157,0.3)'
                      }
                    }}
                  >
                    {pkg.popular && (
                      <Chip
                        label="Beliebteste Wahl"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          color: 'white',
                          fontWeight: 700
                        }}
                      />
                    )}
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                        {pkg.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                        {pkg.description}
                      </Typography>
                      <Typography variant="h3" sx={{ color: '#ff6b9d', fontWeight: 800, mb: 1 }}>
                        €{pkg.price}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                        €{pkg.pricePerSession} pro Session
                      </Typography>
                      {pkg.savings > 0 && (
                        <Chip
                          label={`Spare €${pkg.savings}`}
                          size="small"
                          sx={{
                            background: 'rgba(16,185,129,0.2)',
                            color: '#10b981',
                            fontWeight: 600
                          }}
                        />
                      )}
                      <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        ✓ {pkg.sessions} Zoom-Session{pkg.sessions > 1 ? 's' : ''}<br />
                        ✓ 60-90 Minuten pro Session<br />
                        ✓ Detaillierte Analyse<br />
                        ✓ PDF-Zusammenfassung
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center', fontWeight: 600 }}>
              Wähle deinen Wunschtermin
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, textAlign: 'center' }}>
              Wähle Datum und Uhrzeit für deine erste Session
            </Typography>
            
            <Grid container spacing={2}>
              {/* Gruppiere nach Datum */}
              {Array.from(new Set(availableSlots.map(slot => slot.date))).map(date => (
                <Grid item xs={12} key={date}>
                  <Paper sx={{ p: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      {new Date(date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </Typography>
                    <Grid container spacing={2}>
                      {availableSlots
                        .filter(slot => slot.date === date && slot.available)
                        .map((slot, idx) => (
                          <Grid item xs={6} sm={4} md={3} key={idx}>
                            <Button
                              fullWidth
                              variant={selectedDate === slot.date && selectedTime === slot.time ? 'contained' : 'outlined'}
                              onClick={() => {
                                setSelectedDate(slot.date);
                                setSelectedTime(slot.time);
                              }}
                              sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: selectedDate === slot.date && selectedTime === slot.time ? 'white' : 'rgba(255,255,255,0.8)',
                                background: selectedDate === slot.date && selectedTime === slot.time 
                                  ? 'linear-gradient(135deg, #ff6b9d, #4ecdc4)'
                                  : 'transparent',
                                '&:hover': {
                                  borderColor: '#ff6b9d',
                                  background: selectedDate === slot.date && selectedTime === slot.time
                                    ? 'linear-gradient(135deg, #ff5a8a, #3dbdb3)'
                                    : 'rgba(255,107,157,0.1)'
                                }
                              }}
                            >
                              <Clock size={16} style={{ marginRight: 8 }} />
                              {slot.time}
                            </Button>
                          </Grid>
                        ))}
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center', fontWeight: 600 }}>
              Deine Kontaktdaten
            </Typography>
            
            <Grid container spacing={3}>
              {/* Kontaktdaten */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#ff6b9d', mb: 2 }}>
                  📞 Deine Daten
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dein Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#ff6b9d' },
                      '&.Mui-focused fieldset': { borderColor: '#ff6b9d' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="E-Mail *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#ff6b9d' },
                      '&.Mui-focused fieldset': { borderColor: '#ff6b9d' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefon (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#ff6b9d' },
                      '&.Mui-focused fieldset': { borderColor: '#ff6b9d' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>

              {/* Partner 1 */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#4ecdc4', mb: 2, mt: 2 }}>
                  💕 Partner 1 Daten
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name Partner 1 *"
                  value={formData.partner1Name}
                  onChange={(e) => setFormData({ ...formData, partner1Name: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' },
                      '&.Mui-focused fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Geburtsdatum *"
                  type="date"
                  value={formData.partner1BirthDate}
                  onChange={(e) => setFormData({ ...formData, partner1BirthDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' },
                      '&.Mui-focused fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Geburtszeit (optional)"
                  type="time"
                  value={formData.partner1BirthTime}
                  onChange={(e) => setFormData({ ...formData, partner1BirthTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' },
                      '&.Mui-focused fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Geburtsort (optional)"
                  value={formData.partner1BirthPlace}
                  onChange={(e) => setFormData({ ...formData, partner1BirthPlace: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' },
                      '&.Mui-focused fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>

              {/* Partner 2 */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#4ecdc4', mb: 2, mt: 2 }}>
                  💕 Partner 2 Daten
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name Partner 2 *"
                  value={formData.partner2Name}
                  onChange={(e) => setFormData({ ...formData, partner2Name: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' },
                      '&.Mui-focused fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Geburtsdatum *"
                  type="date"
                  value={formData.partner2BirthDate}
                  onChange={(e) => setFormData({ ...formData, partner2BirthDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' },
                      '&.Mui-focused fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Geburtszeit (optional)"
                  type="time"
                  value={formData.partner2BirthTime}
                  onChange={(e) => setFormData({ ...formData, partner2BirthTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' },
                      '&.Mui-focused fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Geburtsort (optional)"
                  value={formData.partner2BirthPlace}
                  onChange={(e) => setFormData({ ...formData, partner2BirthPlace: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' },
                      '&.Mui-focused fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>

              {/* Notizen */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Besondere Wünsche oder Fragen (optional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#ff6b9d' },
                      '&.Mui-focused fieldset': { borderColor: '#ff6b9d' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center', fontWeight: 600 }}>
              Buchungszusammenfassung
            </Typography>
            
            <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#ff6b9d', mb: 2 }}>
                  📦 Gewähltes Paket
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                  {selectedPackage?.name} - {selectedPackage?.sessions} Session(s)
                </Typography>
                <Typography variant="h4" sx={{ color: '#ff6b9d', fontWeight: 800 }}>
                  €{selectedPackage?.price}
                </Typography>
                {selectedPackage && selectedPackage.savings > 0 && (
                  <Chip
                    label={`Du sparst €${selectedPackage.savings}`}
                    size="small"
                    sx={{ mt: 1, background: 'rgba(16,185,129,0.2)', color: '#10b981' }}
                  />
                )}
              </CardContent>
            </Card>

            <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#4ecdc4', mb: 2 }}>
                  📅 Dein Termin
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                  {selectedDate && new Date(selectedDate).toLocaleDateString('de-DE', { 
                    weekday: 'long', 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Uhrzeit: {selectedTime} Uhr
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                  👤 Kontaktdaten
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                  Name: {formData.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                  E-Mail: {formData.email}
                </Typography>
                {formData.phone && (
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Telefon: {formData.phone}
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mb: 3 }}>
              Nach der Bezahlung erhältst du eine Bestätigungs-E-Mail mit dem Zoom-Link für deine Session.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      py: { xs: 4, md: 8 }
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 2
            }}
          >
            💕 Connection Code Buchen
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', mx: 'auto' }}>
            Entdecke die energetische Resonanz zwischen zwei Menschen
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{
                '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiStepLabel-label.Mui-active': { color: '#ff6b9d' },
                '& .MuiStepLabel-label.Mui-completed': { color: '#4ecdc4' },
                '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.3)' },
                '& .MuiStepIcon-root.Mui-active': { color: '#ff6b9d' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#4ecdc4' }
              }}>
                {label}
              </StepLabel>
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
        <Paper sx={{ 
          p: 4, 
          background: 'rgba(255,255,255,0.03)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
          mb: 4
        }}>
          {renderStepContent()}
        </Paper>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowLeft size={20} />}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255,255,255,0.1)'
              }
            }}
            variant="outlined"
          >
            Zurück
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleBooking}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} /> : <CreditCard size={20} />}
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
                color: 'white',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff5a8a, #3dbdb3)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              {loading ? 'Verarbeite...' : `Jetzt für €${selectedPackage?.price} buchen`}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowRight size={20} />}
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
                color: 'white',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff5a8a, #3dbdb3)'
                }
              }}
            >
              Weiter
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
}

