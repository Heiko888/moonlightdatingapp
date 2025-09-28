"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

function SubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      verifyPayment();
    } else {
      setError('Keine Session-ID gefunden');
      setIsLoading(false);
    }
  }, [searchParams]);

  const verifyPayment = async () => {
    try {
      // Hier würde die Session mit Stripe verifiziert werden
      // Für Demo-Zwecke simulieren wir einen erfolgreichen Payment
      
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Fehler bei der Zahlungsverifizierung');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Zahlung wird verifiziert...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => router.push('/subscription')}
            startIcon={<ArrowRight size={16} />}
          >
            Zurück zur Abonnement-Seite
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <CheckCircle size={64} color="#10b981" />
        </Box>

        <Typography variant="h3" component="h1" gutterBottom>
          Zahlung erfolgreich! 🎉
        </Typography>

        <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
          Dein Abonnement wurde erfolgreich aktiviert
        </Typography>

        <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
          <Typography variant="body1" gutterBottom>
            <strong>Was passiert als nächstes?</strong>
          </Typography>
          <ul>
            <li>Dein Abonnement ist sofort aktiv</li>
            <li>Du erhältst eine Bestätigungs-E-Mail</li>
            <li>Alle Premium-Features sind jetzt verfügbar</li>
            <li>Dein Abonnement wird automatisch verlängert</li>
          </ul>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/dashboard')}
            startIcon={<Home size={16} />}
            sx={{ minWidth: 200 }}
          >
            Zum Dashboard
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/subscription')}
            sx={{ minWidth: 200 }}
          >
            Abonnement verwalten
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Session-ID: {sessionId}
        </Typography>
      </Paper>
    </Container>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
