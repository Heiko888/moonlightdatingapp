"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Container,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Crown,
  Star,
  Zap,
  Check,
  Users,
  Settings
} from 'lucide-react';
import { UserPackage, UserSubscription, canUpgrade } from '@/lib/access-control/packageSystem';
import { createCheckoutSession, PACKAGE_TO_PRICE_ID, handleStripeError } from '@/lib/stripe/client';

const packageData = [
  {
    id: 'free',
    name: 'Kostenlos',
    price: 0,
    period: 'Dauerhaft',
    icon: <Users size={32} />,
    color: '#6b7280',
    features: [
      'App-Übersicht',
      'Grundlegende Informationen',
      'Registrierung'
    ],
    popular: false
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: 'Kostenlos nach Registrierung',
    icon: <Star size={32} />,
    color: '#3b82f6',
    features: [
      'Persönliches Dashboard',
      'Human Design Chart',
      'Community-Zugriff',
      'Dating-System',
      'Chat-Funktionen',
      'Freunde-System'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29,
    period: 'pro Monat',
    icon: <Crown size={32} />,
    color: '#8b5cf6',
    features: [
      'Alle Basic-Features',
      'Mondkalender',
      'Chart-Vergleich',
      'Erweiterte Bodygraph-Analyse',
      'Coaching-Sessions',
      'Wissensdatenbank',
      'Journal',
      'Professionelle Readings'
    ],
    popular: false
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 99,
    period: 'pro Monat',
    icon: <Zap size={32} />,
    color: '#f59e0b',
    features: [
      'Alle Premium-Features',
      'VIP Dashboard',
      'Exklusive Community',
      'Persönlicher Coach',
      'Analytics',
      'API-Zugriff'
    ],
    popular: false
  }
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<UserPackage>('basic');

  useEffect(() => {
    loadUserSubscription();
  }, []);

  const loadUserSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Mock-Daten für Demo
      const mockSubscription: UserSubscription = {
        id: 'sub-1',
        user_id: 'user-1',
        package: 'basic',
        status: 'active',
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      };

      setUserSubscription(mockSubscription);
      setSelectedPackage(mockSubscription.package);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (packageId: UserPackage) => {
    if (packageId === 'free') {
      // Downgrade nicht erlaubt
      return;
    }

    try {
      // Stripe Checkout Session erstellen
      const priceId = PACKAGE_TO_PRICE_ID[packageId];
      if (!priceId) {
        alert('Preis-ID für dieses Paket nicht gefunden');
        return;
      }

      const result = await createCheckoutSession({
        packageId,
        priceId
      });

      if (result.success && result.data) {
        // Zur Stripe Checkout-Seite weiterleiten
        window.location.href = result.data.url;
      } else {
        const errorMessage = result.error?.message || 'Fehler beim Erstellen der Checkout-Session';
        alert(errorMessage);
      }
      
    } catch (error) {
      console.error('Upgrade error:', error);
      const errorMessage = handleStripeError(error);
      alert(`Fehler beim Upgrade: ${errorMessage}`);
    }
  };

  const getCurrentPackageData = () => {
    return packageData.find(p => p.id === userSubscription?.package) || packageData[0];
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Abonnement wird geladen...
        </Typography>
      </Container>
    );
  }

  const currentPackage = getCurrentPackageData();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Abonnement verwalten
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          Verwalte dein Abonnement und entdecke erweiterte Features
        </Typography>

        {/* Aktuelles Abonnement */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, background: `linear-gradient(135deg, ${currentPackage.color}20, ${currentPackage.color}10)` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ color: currentPackage.color, mr: 2 }}>
              {currentPackage.icon}
            </Box>
            <Typography variant="h5" component="h2">
              Aktuelles Abonnement: {currentPackage.name}
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            {currentPackage.price === 0 ? 'Kostenlos' : `€${currentPackage.price}/${currentPackage.period}`}
          </Typography>

          <Chip 
            label={userSubscription?.status === 'active' ? 'Aktiv' : 'Inaktiv'} 
            color={userSubscription?.status === 'active' ? 'success' : 'default'}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Läuft ab: {new Date(userSubscription?.expires_at || '').toLocaleDateString('de-DE')}
          </Typography>
        </Paper>
      </Box>

      {/* Verfügbare Pakete */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Verfügbare Pakete
      </Typography>

      <Grid container spacing={3}>
        {packageData.map((pkg) => {
          const isCurrentPackage = pkg.id === userSubscription?.package;
          const canUpgradeTo = userSubscription ? canUpgrade(userSubscription.package, pkg.id as UserPackage) : true;
          const isSelected = selectedPackage === pkg.id;

          return (
            <Grid item xs={12} md={6} lg={3} key={pkg.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  border: isCurrentPackage ? `2px solid ${pkg.color}` : '1px solid #e0e0e0',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedPackage(pkg.id as UserPackage)}
              >
                {pkg.popular && (
                  <Chip
                    label="Beliebt"
                    color="primary"
                    sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}
                  />
                )}

                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box sx={{ color: pkg.color, mb: 2 }}>
                      {pkg.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {pkg.name}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ color: pkg.color, fontWeight: 'bold' }}>
                      {pkg.price === 0 ? 'Kostenlos' : `€${pkg.price}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {pkg.period}
                    </Typography>
                  </Box>

                  <List sx={{ flexGrow: 1 }}>
                    {pkg.features.map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check size={16} color={pkg.color} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    variant={isCurrentPackage ? 'outlined' : 'contained'}
                    fullWidth
                    size="large"
                    disabled={isCurrentPackage || (!canUpgradeTo && !isCurrentPackage)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpgrade(pkg.id as UserPackage);
                    }}
                    sx={{
                      backgroundColor: isCurrentPackage ? 'transparent' : pkg.color,
                      color: isCurrentPackage ? pkg.color : 'white',
                      borderColor: pkg.color,
                      '&:hover': {
                        backgroundColor: isCurrentPackage ? `${pkg.color}10` : pkg.color,
                      }
                    }}
                  >
                    {isCurrentPackage ? 'Aktuelles Paket' : 
                     !canUpgradeTo ? 'Nicht verfügbar' : 
                     'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Zusätzliche Informationen */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Häufig gestellte Fragen
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Kann ich jederzeit upgraden?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Ja, du kannst jederzeit auf ein höheres Paket upgraden. 
                Der Preis wird anteilig berechnet.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Kann ich mein Abonnement kündigen?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Ja, du kannst dein Abonnement jederzeit kündigen. 
                Du behältst Zugriff bis zum Ende der Laufzeit.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Support */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Benötigst du Hilfe? Kontaktiere unseren Support.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Settings size={16} />}
          sx={{ mt: 2 }}
          onClick={() => router.push('/settings')}
        >
          Zu den Einstellungen
        </Button>
      </Box>
    </Container>
  );
}
