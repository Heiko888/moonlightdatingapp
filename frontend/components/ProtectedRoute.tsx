"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Typography, Button, Alert, CircularProgress, Container, Paper } from '@mui/material';
import { Lock, Crown, Star, Zap, Shield } from 'lucide-react';
import { UserPackage, UserSubscription, checkPageAccess, pageAccessConfig, getPackageFeatures, getNextPackage } from '@/lib/access-control/packageSystem';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPackage?: UserPackage;
  fallbackPath?: string;
}

const packageIcons: Record<UserPackage, React.ReactNode> = {
  'free': <Lock size={24} />,
  'basic': <Star size={24} />,
  'premium': <Crown size={24} />,
  'vip': <Zap size={24} />,
  'admin': <Shield size={24} />
};

const packageColors: Record<UserPackage, string> = {
  'free': '#6b7280',
  'basic': '#3b82f6',
  'premium': '#8b5cf6',
  'vip': '#f59e0b',
  'admin': '#ef4444'
};

const packageNames: Record<UserPackage, string> = {
  'free': 'Kostenlos',
  'basic': 'Basic',
  'premium': 'Premium',
  'vip': 'VIP',
  'admin': 'Admin'
};

export default function ProtectedRoute({ 
  children, 
  requiredPackage = 'basic',
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [pathname]);

  const checkAccess = async () => {
    try {
      setIsLoading(true);

      // Token aus localStorage abrufen
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        // Kein Token - zur Login-Seite weiterleiten
        router.push(fallbackPath);
        return;
      }

      // Token validieren
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Token ungültig - zur Login-Seite weiterleiten
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userData');
        router.push(fallbackPath);
        return;
      }

      const result = await response.json();
      if (!result.success) {
        router.push(fallbackPath);
        return;
      }

      // Benutzer-Abonnement abrufen (vereinfacht - in echter App aus Datenbank)
      const mockSubscription: UserSubscription = {
        id: 'sub-1',
        user_id: userId,
        package: 'basic', // Standard-Paket nach Registrierung
        status: 'active',
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 Jahr
        created_at: new Date().toISOString()
      };

      setUserSubscription(mockSubscription);

      // Zugriff prüfen
      const pageConfig = pageAccessConfig[pathname];
      const requiredPkg = pageConfig?.requiredPackage || requiredPackage;
      
      const hasPageAccess = checkPageAccess(pathname, mockSubscription);
      setHasAccess(hasPageAccess);

      if (!hasPageAccess) {
        // Kein Zugriff - Zugriff verweigert anzeigen
        return;
      }

    } catch (error) {
      console.error('Access check error:', error);
      router.push(fallbackPath);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Zugriff wird geprüft...
        </Typography>
      </Container>
    );
  }

  if (!hasAccess && userSubscription) {
    const pageConfig = pageAccessConfig[pathname];
    const requiredPkg = pageConfig?.requiredPackage || requiredPackage;
    const nextPackage = getNextPackage(userSubscription.package);
    const currentFeatures = getPackageFeatures(userSubscription.package);
    const requiredFeatures = getPackageFeatures(requiredPkg);

    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            {packageIcons[requiredPkg]}
          </Box>
          
          <Typography variant="h4" component="h1" gutterBottom>
            {packageNames[requiredPkg]} Paket erforderlich
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Diese Seite erfordert ein {packageNames[requiredPkg]} Abonnement.
            <br />
            Du hast derzeit ein {packageNames[userSubscription.package]} Abonnement.
          </Typography>

          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              Verfügbare Features in deinem {packageNames[userSubscription.package]} Paket:
            </Typography>
            <ul>
              {currentFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </Alert>

          {nextPackage && (
            <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom>
                Upgrade auf {packageNames[nextPackage]} für zusätzliche Features:
              </Typography>
              <ul>
                {requiredFeatures.filter(feature => !currentFeatures.includes(feature)).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => router.push('/pricing')}
              sx={{ minWidth: 200 }}
            >
              Paket upgraden
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/dashboard')}
              sx={{ minWidth: 200 }}
            >
              Zum Dashboard
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
            Benötigst du Hilfe? Kontaktiere unseren Support.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return <>{children}</>;
}
