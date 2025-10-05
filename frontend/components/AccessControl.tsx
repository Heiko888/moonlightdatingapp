"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Chip
} from '@mui/material';
// import { motion } from 'framer-motion'; // Temporarily disabled
import { Lock, Crown, Diamond, Star, ArrowRight } from 'lucide-react';
import { UserSubscription } from '../lib/subscription/types';
import { checkPageAccess } from '../lib/subscription/accessControl';
import { subscriptionPackages } from '../lib/subscription/packages';

interface AccessControlProps {
  path: string;
  userSubscription?: UserSubscription | null;
  children: React.ReactNode;
  onUpgrade?: () => void;
}

export default function AccessControl({
  path,
  userSubscription,
  children,
  onUpgrade
}: AccessControlProps) {
  const access = checkPageAccess(path, userSubscription || null);

  if (access.canAccess) {
    return <>{children}</>;
  }

  const getPackageInfo = (packageId: string) => {
    return subscriptionPackages.find(pkg => pkg.id === packageId);
  };

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'basic': return <Star size={24} />;
      case 'premium': return <Diamond size={24} />;
      case 'vip': return <Crown size={24} />;
      case 'admin': return <Lock size={24} />;
      default: return <Lock size={24} />;
    }
  };

  const getPackageColor = (packageId: string) => {
    const pkg = getPackageInfo(packageId);
    return pkg?.color || '#6b7280';
  };

  const requiredPackageInfo = getPackageInfo(access.requiredPackage);
  const currentPackage = getPackageInfo(access.currentPackage);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}>
      <Box>
        <Card sx={{
          maxWidth: 600,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4
        }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            {/* Icon */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3
            }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${getPackageColor(access.requiredPackage)} 0%, ${getPackageColor(access.requiredPackage)}80 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {getPackageIcon(access.requiredPackage)}
              </Box>
            </Box>

            {/* Title */}
            <Typography variant="h4" sx={{ 
              color: '#FFD700', 
              mb: 2,
              fontWeight: 'bold',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {access.requiredPackage === 'free' ? '🔐 Anmeldung erforderlich' : 
               access.requiredPackage === 'admin' ? '🔐 Admin-Zugang erforderlich' : 
               '🚀 Upgrade erforderlich'}
            </Typography>

            {/* Message */}
            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              mb: 4,
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}>
              {access.requiredPackage === 'free' 
                ? 'Bitte melden Sie sich an, um auf diese Seite zuzugreifen.'
                : access.requiredPackage === 'admin'
                ? 'Diese Admin-Funktion ist nur für Administratoren verfügbar. Kontaktieren Sie den Systemadministrator für Zugang.'
                : `Diese Premium-Funktion ist nur für ${requiredPackageInfo?.name} Benutzer verfügbar. Entdecken Sie alle exklusiven Features!`
              }
            </Typography>

            {/* Current vs Required Package */}
            {access.requiredPackage !== 'free' && access.requiredPackage !== 'admin' && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                  {currentPackage && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        color: currentPackage.color,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {getPackageIcon(currentPackage.id)}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Aktuell: {currentPackage.name}
                      </Typography>
                    </Box>
                  )}
                  
                  <ArrowRight size={20} color="rgba(255,255,255,0.5)" />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                      color: requiredPackageInfo?.color,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {getPackageIcon(access.requiredPackage)}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      Erforderlich: {requiredPackageInfo?.name}
                    </Typography>
                  </Box>
                </Box>

                {/* Package Features */}
                {requiredPackageInfo && access.requiredPackage !== 'admin' && (
                  <Box sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    p: 3,
                    mb: 3
                  }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      {requiredPackageInfo?.name} Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {requiredPackageInfo?.features.slice(0, 4).map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          sx={{
                            background: `${requiredPackageInfo?.color}20`,
                            color: 'white',
                            border: `1px solid ${requiredPackageInfo?.color}40`
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {access.requiredPackage === 'free' ? (
                <Button
                  variant="contained"
                  size="large"
                  href="#"
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 25px rgba(139, 92, 246, 0.6)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔐 Anmelden
                </Button>
              ) : access.requiredPackage === 'admin' ? (
                <Button
                  variant="contained"
                  size="large"
                  href="/"
                  sx={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    boxShadow: '0 8px 20px rgba(220, 38, 38, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 25px rgba(220, 38, 38, 0.6)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🏠 Zur Startseite
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    size="large"
                    href="/subscription"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: '#FFD700',
                        background: 'rgba(255, 215, 0, 0.1)',
                        color: '#FFD700',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    💎 Preise ansehen
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onUpgrade}
                    sx={{
                      background: `linear-gradient(135deg, ${getPackageColor(access.requiredPackage)} 0%, ${getPackageColor(access.requiredPackage)}80 100%)`,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      boxShadow: `0 8px 20px ${getPackageColor(access.requiredPackage)}40`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${getPackageColor(access.requiredPackage)}80 0%, ${getPackageColor(access.requiredPackage)} 100%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 25px ${getPackageColor(access.requiredPackage)}60`
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🚀 Jetzt upgraden
                  </Button>
                </>
              )}
            </Box>

            {/* Additional Info */}
            <Alert severity="info" sx={{ 
              mt: 3, 
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: 2
            }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {access.requiredPackage === 'admin' ? (
                  <>
                    <strong>🔐 Admin-Zugang:</strong> Administrativer Zugang wird nur an autorisierte Personen vergeben. Kontaktieren Sie den Systemadministrator.
                  </>
                ) : (
                  <>
                    <strong>🛡️ Geld-zurück-Garantie:</strong> Sie können Ihr Abonnement jederzeit innerhalb der ersten 14 Tage kündigen.
                  </>
                )}
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
