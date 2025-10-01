"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { Check, X, Star, Diamond, Crown, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AnimatedStars from '../../components/AnimatedStars';
import AnimatedMoon from '../../components/AnimatedMoon';
import { pageAccessConfig } from '../../lib/subscription/accessControl';
import { subscriptionPackages } from '../../lib/subscription/packages';
import { SubscriptionService } from '../../lib/subscription/subscriptionService';
import { UserSubscription } from '../../lib/subscription/types';

export default function PackageOverviewPage() {
  const router = useRouter();
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserSubscription();
  }, []);

  const loadUserSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const subscription = await SubscriptionService.getUserSubscription(user.id);
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Abonnements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'basic': return <Star size={20} />;
      case 'premium': return <Diamond size={20} />;
      case 'vip': return <Crown size={20} />;
      default: return <Lock size={20} />;
    }
  };

  const getPackageColor = (packageId: string) => {
    const pkg = subscriptionPackages.find(p => p.id === packageId);
    return pkg?.color || '#6b7280';
  };

  const getAccessiblePages = (packageId: string) => {
    return pageAccessConfig.filter(page => {
      const packageHierarchy = ['basic', 'premium', 'vip'];
      const currentLevel = packageHierarchy.indexOf(packageId);
      const requiredLevel = packageHierarchy.indexOf(page.requiredPackage);
      return currentLevel >= requiredLevel;
    });
  };

  const groupedPages = pageAccessConfig.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, typeof pageAccessConfig>);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      <AnimatedMoon size={120} position="top-right" />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Paket-Übersicht & Zugriffskontrolle
            </Typography>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.7)',
              mb: 4,
              maxWidth: 800,
              mx: 'auto'
            }}>
              Übersicht über alle verfügbaren Pakete und deren Zugriffsebenen
            </Typography>

            {userSubscription && (
              <Alert severity="info" sx={{ 
                maxWidth: 600, 
                mx: 'auto', 
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <Typography variant="body1">
                  <strong>Ihr aktuelles Paket:</strong> {userSubscription.packageId.toUpperCase()} 
                  {userSubscription.status === 'active' ? ' (Aktiv)' : ` (${userSubscription.status})`}
                </Typography>
              </Alert>
            )}
          </Box>
        </motion.div>

        {/* Package Comparison */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            mb: 6
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
                Paket-Vergleich
              </Typography>
              
              <TableContainer component={Paper} sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Feature</TableCell>
                      {subscriptionPackages.map((pkg) => (
                        <TableCell key={pkg.id} sx={{ 
                          color: 'white', 
                          fontWeight: 'bold',
                          textAlign: 'center',
                          background: `${pkg.color}20`
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            {getPackageIcon(pkg.id)}
                            {pkg.name}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Preis</TableCell>
                      {subscriptionPackages.map((pkg) => (
                        <TableCell key={pkg.id} sx={{ color: 'white', textAlign: 'center' }}>
                          {pkg.id === 'basic' ? 'Kostenlos' : `${pkg.priceMonthly}€/Monat`}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Chart-Berechnung</TableCell>
                      {subscriptionPackages.map((pkg) => (
                        <TableCell key={pkg.id} sx={{ textAlign: 'center' }}>
                          <Check color="#10b981" size={20} />
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Erweiterte Analytics</TableCell>
                      {subscriptionPackages.map((pkg) => (
                        <TableCell key={pkg.id} sx={{ textAlign: 'center' }}>
                          {pkg.hasAdvancedAnalytics ? <Check color="#10b981" size={20} /> : <X color="#ef4444" size={20} />}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Coaching-Zugang</TableCell>
                      {subscriptionPackages.map((pkg) => (
                        <TableCell key={pkg.id} sx={{ textAlign: 'center' }}>
                          {pkg.maxCoachingSessions > 0 ? <Check color="#10b981" size={20} /> : <X color="#ef4444" size={20} />}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>VIP-Community</TableCell>
                      {subscriptionPackages.map((pkg) => (
                        <TableCell key={pkg.id} sx={{ textAlign: 'center' }}>
                          {pkg.hasVIPCommunity ? <Check color="#10b981" size={20} /> : <X color="#ef4444" size={20} />}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Persönlicher Coach</TableCell>
                      {subscriptionPackages.map((pkg) => (
                        <TableCell key={pkg.id} sx={{ textAlign: 'center' }}>
                          {pkg.hasPersonalCoach ? <Check color="#10b981" size={20} /> : <X color="#ef4444" size={20} />}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Page Access by Category */}
        <motion.div
          
          
          
        >
          <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
            Seiten-Zugriff nach Kategorien
          </Typography>
          
          <Grid container spacing={4}>
            {Object.entries(groupedPages).map(([category, pages], categoryIndex) => (
              <Grid item xs={12} md={6} lg={4} key={category}>
                <motion.div
                  
                  
                  
                >
                  <Card sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ 
                        color: 'white', 
                        mb: 3,
                        fontWeight: 'bold'
                      }}>
                        {category}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {pages.map((page, pageIndex) => (
                          <Box key={pageIndex} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 2,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Box>
                              <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                {page.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                {page.description}
                              </Typography>
                            </Box>
                            <Chip
                              label={page.requiredPackage}
                              size="small"
                              sx={{
                                background: `${getPackageColor(page.requiredPackage)}20`,
                                color: getPackageColor(page.requiredPackage),
                                border: `1px solid ${getPackageColor(page.requiredPackage)}40`
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          
          
          
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              href="/pricing"
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)'
                }
              }}
            >
              Pakete vergleichen
              <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              href="/dashboard"
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Zum Dashboard
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

