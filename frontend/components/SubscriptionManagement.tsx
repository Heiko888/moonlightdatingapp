"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  Crown,
  Diamond,
  Star,
  Check,
  X,
  Calendar,
  CreditCard,
  Settings,
  ArrowRight,
  Info
} from 'lucide-react';
import { UserSubscription } from '../lib/subscription/types';
import { subscriptionPackages } from '../lib/subscription/packages';
import { SubscriptionService } from '../lib/subscription/subscriptionService';

interface SubscriptionManagementProps {
  userSubscription: UserSubscription | null;
  onSubscriptionUpdate?: (subscription: UserSubscription) => void;
}

export default function SubscriptionManagement({
  userSubscription,
  onSubscriptionUpdate
}: SubscriptionManagementProps) {
  const [loading, setLoading] = useState(false);
  const [upgradeDialog, setUpgradeDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const getPackageInfo = (packageId: string) => {
    return subscriptionPackages.find(pkg => pkg.id === packageId);
  };

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'basic': return <Star size={24} />;
      case 'premium': return <Diamond size={24} />;
      case 'vip': return <Crown size={24} />;
      default: return <Star size={24} />;
    }
  };

  const handleUpgrade = async (packageId: string) => {
    if (!userSubscription) return;

    setLoading(true);
    setError('');

    try {
      const updatedSubscription = await SubscriptionService.updateSubscription(
        userSubscription.userId,
        packageId,
        'monthly'
      );

      if (updatedSubscription && onSubscriptionUpdate) {
        onSubscriptionUpdate(updatedSubscription);
        setUpgradeDialog(false);
      }
    } catch (error) {
      setError('Upgrade fehlgeschlagen. Bitte versuchen Sie es erneut.');
      console.error('Upgrade error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = async (packageId: string) => {
    if (!userSubscription) return;

    setLoading(true);
    setError('');

    try {
      const updatedSubscription = await SubscriptionService.updateSubscription(
        userSubscription.userId,
        packageId,
        'monthly'
      );

      if (updatedSubscription && onSubscriptionUpdate) {
        onSubscriptionUpdate(updatedSubscription);
      }
    } catch (error) {
      setError('Downgrade fehlgeschlagen. Bitte versuchen Sie es erneut.');
      console.error('Downgrade error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canUpgrade = (packageId: string): boolean => {
    if (!userSubscription) return false;
    
    const hierarchy = ['free', 'basic', 'premium', 'vip', 'admin'];
    const currentIndex = hierarchy.indexOf(userSubscription.packageId);
    const targetIndex = hierarchy.indexOf(packageId);
    
    return targetIndex > currentIndex;
  };

  const canDowngrade = (packageId: string): boolean => {
    if (!userSubscription) return false;
    
    const hierarchy = ['free', 'basic', 'premium', 'vip', 'admin'];
    const currentIndex = hierarchy.indexOf(userSubscription.packageId);
    const targetIndex = hierarchy.indexOf(packageId);
    
    return targetIndex < currentIndex;
  };

  if (!userSubscription) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Kein Abonnement gefunden
        </Typography>
      </Card>
    );
  }

  const currentPackage = getPackageInfo(userSubscription.packageId);

  return (
    <Box>
      {/* Current Subscription */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              color: currentPackage?.color,
              display: 'flex',
              alignItems: 'center',
              mr: 2
            }}>
              {getPackageIcon(userSubscription.packageId)}
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {currentPackage?.name || 'Unbekanntes Paket'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktuelles Abonnement
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Chip 
                label={userSubscription.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                color={userSubscription.status === 'active' ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Abonnement startet
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {new Date(userSubscription.startDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Abonnement endet
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {new Date(userSubscription.endDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Zahlungsmethode
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {userSubscription.paymentMethod === 'none' ? 'Kostenlos' : 
                 userSubscription.paymentMethod === 'card' ? 'Kreditkarte' : 
                 userSubscription.paymentMethod}
              </Typography>
            </Box>
          </Box>

          {userSubscription.status === 'active' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Abonnement-Fortschritt
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    background: currentPackage?.color
                  }
                }} 
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Available Packages */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Verfügbare Pakete
      </Typography>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        {subscriptionPackages
          .filter(pkg => pkg.id !== 'admin') // Admin-Paket nicht anzeigen
          .map((pkg) => {
            const isCurrentPackage = pkg.id === userSubscription.packageId;
            const canUpgradeTo = canUpgrade(pkg.id);
            const canDowngradeTo = canDowngrade(pkg.id);

            return (
              <Card 
                key={pkg.id}
                sx={{ 
                  border: isCurrentPackage ? `2px solid ${pkg.color}` : '1px solid #e2e8f0',
                  background: isCurrentPackage ? `${pkg.color}10` : 'white',
                  position: 'relative'
                }}
              >
                {isCurrentPackage && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8,
                    background: pkg.color,
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    AKTUELL
                  </Box>
                )}

                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: pkg.color, mr: 2 }}>
                      {getPackageIcon(pkg.id)}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {pkg.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {pkg.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: pkg.color }}>
                    {pkg.price}
                  </Typography>

                  <List dense sx={{ mb: 3 }}>
                    {pkg.features.slice(0, 4).map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Check size={16} color={pkg.color} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant={isCurrentPackage ? "outlined" : "contained"}
                    fullWidth
                    disabled={isCurrentPackage || loading}
                    onClick={() => {
                      if (canUpgradeTo || canDowngradeTo) {
                        setSelectedPackage(pkg.id);
                        setUpgradeDialog(true);
                      }
                    }}
                    sx={{
                      background: isCurrentPackage ? 'transparent' : pkg.color,
                      color: isCurrentPackage ? pkg.color : 'white',
                      borderColor: pkg.color,
                      fontWeight: 'bold',
                      '&:hover': {
                        background: isCurrentPackage ? `${pkg.color}10` : pkg.color,
                      }
                    }}
                  >
                    {isCurrentPackage ? 'Aktuelles Paket' : 
                     canUpgradeTo ? 'Upgrade' : 
                     canDowngradeTo ? 'Downgrade' : 'Nicht verfügbar'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
      </Box>

      {/* Upgrade/Downgrade Dialog */}
      <Dialog open={upgradeDialog} onClose={() => setUpgradeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {canUpgrade(selectedPackage) ? '🚀 Paket upgraden' : '📉 Paket downgraden'}
        </DialogTitle>
        <DialogContent>
          {selectedPackage && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {canUpgrade(selectedPackage) 
                  ? `Möchten Sie wirklich zu ${getPackageInfo(selectedPackage)?.name} upgraden?`
                  : `Möchten Sie wirklich zu ${getPackageInfo(selectedPackage)?.name} downgraden?`
                }
              </Typography>
              
              {canUpgrade(selectedPackage) && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Upgrade-Vorteile:</strong> Sie erhalten sofort Zugang zu allen Premium-Features.
                  </Typography>
                </Alert>
              )}

              {canDowngrade(selectedPackage) && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Downgrade-Hinweis:</strong> Sie verlieren Zugang zu Premium-Features. 
                    Ihre Daten bleiben erhalten.
                  </Typography>
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialog(false)} disabled={loading}>
            Abbrechen
          </Button>
          <Button 
            onClick={() => handleUpgrade(selectedPackage)}
            variant="contained"
            disabled={loading}
            sx={{ 
              background: canUpgrade(selectedPackage) ? '#10b981' : '#f59e0b',
              '&:hover': {
                background: canUpgrade(selectedPackage) ? '#059669' : '#d97706'
              }
            }}
          >
            {loading ? 'Wird verarbeitet...' : 
             canUpgrade(selectedPackage) ? 'Upgrade bestätigen' : 'Downgrade bestätigen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
