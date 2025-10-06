"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Chip, Button, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Crown, Diamond, Star, Lock, Globe, CheckCircle, XCircle } from 'lucide-react';
import UnifiedPageLayout from '@/components/UnifiedPageLayout';
import { useSubscription } from '../../hooks/useSubscription';

interface PageAccess {
  path: string;
  name: string;
  requiredPackage: string;
  description: string;
  category: string;
}

const pageAccessConfig: PageAccess[] = [
  // Free Pages
  { path: '/', name: 'Homepage', requiredPackage: 'free', description: 'Startseite', category: 'Öffentlich' },
  { path: '/chart', name: 'Chart Generator', requiredPackage: 'free', description: 'Human Design Chart erstellen', category: 'Öffentlich' },
  { path: '/chart-info', name: 'Chart Info', requiredPackage: 'free', description: 'Chart-Informationen', category: 'Öffentlich' },
  { path: '/human-design-info', name: 'Human Design Info', requiredPackage: 'free', description: 'Grundlagen Human Design', category: 'Öffentlich' },
  
  // Basic Pages
  { path: '/dashboard', name: 'Dashboard', requiredPackage: 'basic', description: 'Persönliches Dashboard', category: 'Basic' },
  { path: '/profile', name: 'Profil', requiredPackage: 'basic', description: 'Benutzerprofil', category: 'Basic' },
  { path: '/settings', name: 'Einstellungen', requiredPackage: 'basic', description: 'App-Einstellungen', category: 'Basic' },
  { path: '/mondkalender', name: 'Mondkalender', requiredPackage: 'basic', description: 'Mondphasen-Tracking', category: 'Basic' },
  { path: '/community', name: 'Community', requiredPackage: 'basic', description: 'Community-Features', category: 'Basic' },
  { path: '/reading', name: 'Reading', requiredPackage: 'basic', description: 'Human Design Reading', category: 'Basic' },
  
  // Premium Pages
  { path: '/bodygraph-advanced', name: 'Advanced Bodygraph', requiredPackage: 'premium', description: 'Erweiterte Bodygraph-Analyse', category: 'Premium' },
  { path: '/chart-comparison', name: 'Chart Comparison', requiredPackage: 'premium', description: 'Chart-Vergleich', category: 'Premium' },
  { path: '/dating', name: 'Dating', requiredPackage: 'premium', description: 'Dating-System', category: 'Premium' },
  { path: '/analytics', name: 'Analytics', requiredPackage: 'premium', description: 'Erweiterte Analytics', category: 'Premium' },
  { path: '/api-access', name: 'API Access', requiredPackage: 'premium', description: 'API-Zugang', category: 'Premium' },
  
  // VIP Pages
  { path: '/coaching', name: 'Coaching', requiredPackage: 'vip', description: '1:1 Coaching', category: 'VIP' },
  { path: '/vip-community', name: 'VIP Community', requiredPackage: 'vip', description: 'Exklusive VIP Community', category: 'VIP' },
  { path: '/personal-coach', name: 'Personal Coach', requiredPackage: 'vip', description: 'Persönlicher Coach', category: 'VIP' },
  { path: '/dashboard-vip', name: 'VIP Dashboard', requiredPackage: 'vip', description: 'VIP Dashboard', category: 'VIP' },
  
  // Admin Pages
  { path: '/admin', name: 'Admin Panel', requiredPackage: 'admin', description: 'Administrator-Panel', category: 'Admin' },
];

export default function AccessControlOverviewPage() {
  const { subscription, hasPackage, isVIP, isPremium, isBasic } = useSubscription();
  const [filter, setFilter] = useState<string>('all');

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'free': return <Globe size={20} />;
      case 'basic': return <Star size={20} />;
      case 'premium': return <Diamond size={20} />;
      case 'vip': return <Crown size={20} />;
      case 'admin': return <Lock size={20} />;
      default: return <Lock size={20} />;
    }
  };

  const getPackageColor = (packageId: string) => {
    switch (packageId) {
      case 'free': return '#6b7280';
      case 'basic': return '#3b82f6';
      case 'premium': return '#8b5cf6';
      case 'vip': return '#f59e0b';
      case 'admin': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredPages = pageAccessConfig.filter(page => {
    if (filter === 'all') return true;
    return page.category === filter;
  });

  const categories = ['all', 'Öffentlich', 'Basic', 'Premium', 'VIP', 'Admin'];

  return (
    <UnifiedPageLayout
      title="🔐 Access Control Übersicht"
      subtitle="Übersicht aller Seiten und deren Zugriffsberechtigungen"
    >
      <Container maxWidth="lg">
        {/* Current Subscription Status */}
        <Card sx={{ mb: 4, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              📊 Aktuelle Subscription
            </Typography>
            {subscription ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {getPackageIcon(subscription.packageId)}
                <Chip
                  label={subscription.packageId.toUpperCase()}
                  sx={{
                    backgroundColor: getPackageColor(subscription.packageId),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Status: {subscription.status} | Plan: {subscription.plan}
                </Typography>
              </Box>
            ) : (
              <Alert severity="warning">Keine Subscription gefunden</Alert>
            )}
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <Card sx={{ mb: 4, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              🔍 Filter
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={filter === category ? 'contained' : 'outlined'}
                  onClick={() => setFilter(category)}
                  sx={{
                    color: filter === category ? 'white' : 'white',
                    borderColor: 'white',
                    backgroundColor: filter === category ? 'rgba(255,255,255,0.2)' : 'transparent'
                  }}
                >
                  {category}
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Pages Table */}
        <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              📋 Seiten-Übersicht
            </Typography>
            <TableContainer component={Paper} sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Seite</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Pfad</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Erforderlich</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Zugang</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Kategorie</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPages.map((page, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getPackageIcon(page.requiredPackage)}
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {page.name}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {page.description}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontFamily: 'monospace' }}>
                        {page.path}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={page.requiredPackage.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getPackageColor(page.requiredPackage),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {hasPackage(page.requiredPackage) ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981' }}>
                            <CheckCircle size={16} />
                            <Typography variant="body2">Zugang gewährt</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ef4444' }}>
                            <XCircle size={16} />
                            <Typography variant="body2">Upgrade erforderlich</Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={page.category}
                          size="small"
                          variant="outlined"
                          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card sx={{ mt: 4, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              ⚡ Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                href="/access-control-debug"
                component="a"
                sx={{ background: '#3b82f6' }}
              >
                🔧 Debug Tool
              </Button>
              <Button
                variant="contained"
                href="/pricing"
                component="a"
                sx={{ background: '#8b5cf6' }}
              >
                💳 Upgrade
              </Button>
              <Button
                variant="outlined"
                href="/dashboard"
                component="a"
                sx={{ color: 'white', borderColor: 'white' }}
              >
                🏠 Dashboard
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </UnifiedPageLayout>
  );
}
