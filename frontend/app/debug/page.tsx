"use client";
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Alert, List, ListItem, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import { smartRedirect, getAccessiblePages, hasAccess } from '../../lib/utils/navigation';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [accessiblePages, setAccessiblePages] = useState<string[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const userSubscription = localStorage.getItem('userSubscription');
    const authToken = localStorage.getItem('authToken');
    const token = localStorage.getItem('token');

    setDebugInfo({
      userData: userData ? JSON.parse(userData) : null,
      userSubscription: userSubscription ? JSON.parse(userSubscription) : null,
      authToken: authToken ? 'Vorhanden' : 'Nicht vorhanden',
      token: token ? 'Vorhanden' : 'Nicht vorhanden'
    });

    // Lade zugängliche Seiten
    setAccessiblePages(getAccessiblePages());
  }, []);

  const fixSubscription = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      
      // Setze auf basic-Plan
      user.subscriptionPlan = 'basic';
      localStorage.setItem('userData', JSON.stringify(user));
      
      // Erstelle userSubscription
      localStorage.setItem('userSubscription', JSON.stringify({
        plan: 'basic',
        status: 'active',
        startDate: new Date().toISOString(),
        features: [
          'Human Design Chart',
          'Vollständiger Mondkalender',
          'Community Zugang',
          'Basis-Matching',
          'Bis zu 3 Profilbilder'
        ]
      }));
      
      // Lade Seite neu
      window.location.reload();
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      py: 4
    }}>
      <Container maxWidth="md">
        <motion.div
          
          
          
        >
          <Typography variant="h3" sx={{ 
            color: '#FFD700', 
            textAlign: 'center', 
            mb: 4,
            fontWeight: 'bold'
          }}>
            🔍 Debug-Informationen
          </Typography>

          {debugInfo && (
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              mb: 3
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
                  📊 LocalStorage-Daten
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                    🔐 Authentifizierung
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    AuthToken: {debugInfo.authToken}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Token: {debugInfo.token}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                    👤 Benutzer-Daten
                  </Typography>
                  <pre style={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    fontSize: '0.8rem',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '1rem',
                    borderRadius: '8px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(debugInfo.userData, null, 2)}
                  </pre>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                    📦 Subscription-Daten
                  </Typography>
                  <pre style={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    fontSize: '0.8rem',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '1rem',
                    borderRadius: '8px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(debugInfo.userSubscription, null, 2)}
                  </pre>
                </Box>

                {debugInfo.userData?.subscriptionPlan === 'free' && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      ⚠️ Dein Account hat noch den alten "free" Plan. 
                      Klicke auf "Fix Subscription", um automatisch auf "basic" zu upgraden.
                    </Typography>
                  </Alert>
                )}

                <Button
                  variant="contained"
                  onClick={fixSubscription}
                  sx={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FFA500, #FFD700)'
                    }
                  }}
                >
                  🔧 Fix Subscription (free → basic)
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Navigation Debug */}
          {debugInfo && (
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              mb: 3
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
                  🧭 Navigation-Debug
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                    🎯 Intelligente Weiterleitung
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Standard-Weiterleitung: {smartRedirect()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Mondkalender-Zugriff: {hasAccess('/mondkalender') ? '✅ Ja' : '❌ Nein'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                    📋 Zugängliche Seiten
                  </Typography>
                  <List dense>
                    {accessiblePages.map((page, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText 
                          primary={page}
                          sx={{ 
                            '& .MuiListItemText-primary': { 
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: '0.9rem'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </Container>
    </Box>
  );
}
