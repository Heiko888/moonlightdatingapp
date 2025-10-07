"use client";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { BarChart3, Target, Sparkles, Brain, Crown } from 'lucide-react';
import PersonalRoadmap from '@/components/PersonalRoadmap';
import AccessControl from '../../components/AccessControl';
import Link from 'next/link';
// import { UserSubscription } from '../../lib/subscription/types'; // Entfernt - nicht mehr benötigt
import { safeJsonParse } from '@/lib/supabase/client';

export default function RoadmapPage() {
  const [userSubscription, setUserSubscription] = useState<any>(null);

  useEffect(() => {
    loadUserSubscription();
  }, []);

  const loadUserSubscription = () => {
    if (typeof window !== 'undefined') {
      // Lade User-Daten aus localStorage
      const userData = localStorage.getItem('userData');
      if (userData && userData.trim() !== '') {
        try {
          const user = safeJsonParse(userData, {});
          console.log('🔍 Roadmap - User-Daten geladen:', user);
          
          // Erstelle UserSubscription-Objekt - korrigiere packageId für Premium
          const subscription = {
            userId: user.id || 'unknown',
            packageId: (user.subscriptionPlan === 'premium' ? 'premium' : user.subscriptionPlan) || 'basic',
            plan: (user.subscriptionPlan === 'premium' ? 'premium' : user.subscriptionPlan) || 'basic',
            status: user.subscriptionStatus || 'active',
            startDate: user.subscriptionStartDate || new Date().toISOString(),
            endDate: user.subscriptionEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            autoRenew: user.autoRenew || false,
            paymentMethod: user.paymentMethod || 'none',
            billingCycle: user.billingCycle || 'monthly'
          };
          
          console.log('💎 Roadmap - Premium-Status:', subscription.packageId);
          console.log('🔍 Roadmap - Original subscriptionPlan:', user.subscriptionPlan);
          setUserSubscription(subscription);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else {
        console.log('⚠️ Roadmap - Keine User-Daten gefunden');
      }
    }
  };

  // Temporär: Roadmap für alle User zugänglich (bis Zugriffskontrolle behoben ist)
  console.log('🔍 Roadmap - UserSubscription:', userSubscription);
  console.log('🔍 Roadmap - PackageId:', userSubscription?.packageId);
  
  // Direkte Premium-Prüfung - temporär deaktiviert
  // const isPremium = userSubscription?.packageId === 'premium' || userSubscription?.packageId === 'vip';
  
  // if (!isPremium) {
  //   return (
  //     <Box sx={{
  //       minHeight: '100vh',
  //       background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       p: 3
  //     }}>
  //       <Box sx={{ textAlign: 'center', color: 'white' }}>
  //         <Typography variant="h4" sx={{ mb: 2 }}>
  //           🚀 Premium-Feature
  //         </Typography>
  //         <Typography variant="body1" sx={{ mb: 4 }}>
  //           Diese Roadmap ist nur für Premium-User verfügbar.
  //         </Typography>
  //         <Button
  //           variant="contained"
  //           href="/upgrade"
  //           sx={{
  //             background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
  //             fontWeight: 'bold',
  //             fontSize: '1.1rem',
  //             py: 1.5,
  //             px: 4,
  //             borderRadius: 3
  //           }}
  //         >
  //           🚀 Jetzt upgraden
  //         </Button>
  //       </Box>
  //     </Box>
  //   );
  // }

  return (
    <AccessControl
      path="/roadmap"
      userSubscription={userSubscription}
      onUpgrade={() => window.location.href = '/pricing'}
    >
      <Box sx={{ 
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Stars Background */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: 'rgba(255, 255, 255, 0.3)',
                fontSize: '12px'
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              ✨
            </motion.div>
          ))}
        </Box>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                🗺️ AI-Powered Roadmap
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontWeight: 300,
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Dein intelligenter Entwicklungsplan basierend auf Human Design & AI-Analyse
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 3 }}>
                <Chip 
                  icon={<Brain size={16} />} 
                  label="AI-Powered" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                    color: 'white',
                    fontWeight: 600,
                    px: 2,
                    py: 1
                  }} 
                />
                <Chip 
                  icon={<Sparkles size={16} />} 
                  label="Personalisiert" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                    color: 'white',
                    fontWeight: 600,
                    px: 2,
                    py: 1
                  }} 
                />
                <Button
                  variant="outlined"
                  component={Link}
                  href="/dashboard"
                  startIcon={<BarChart3 size={20} />}
                  sx={{
                    color: '#ff6b9d',
                    borderColor: 'rgba(255, 107, 157, 0.3)',
                    fontWeight: 600,
                    px: 3,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: '#ff6b9d',
                      backgroundColor: 'rgba(255, 107, 157, 0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  ← Zurück zum Dashboard
                </Button>
              </Box>
            </Box>
          </motion.div>

          {/* AI Features Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper elevation={0} sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              p: 4,
              mb: 4,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Brain size={24} color="#ff6b9d" />
                <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: '#ff6b9d' }}>AI-Engine Features</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                <Box sx={{ textAlign: 'center', p: 3, background: 'rgba(255, 107, 157, 0.1)', borderRadius: 3 }}>
                  <Target size={32} color="#ff6b9d" />
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, mb: 0.5, color: 'white' }}>Personalisierte Schritte</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Basierend auf deinem Human Design Profil</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 3, background: 'rgba(78, 205, 196, 0.1)', borderRadius: 3 }}>
                  <Sparkles size={32} color="#4ecdc4" />
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, mb: 0.5, color: 'white' }}>Journal-Analyse</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Erkenntnisse aus deinen Einträgen</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 3, background: 'rgba(102, 126, 234, 0.1)', borderRadius: 3 }}>
                  <Crown size={32} color="#667eea" />
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, mb: 0.5, color: 'white' }}>Dating-Tipps</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Orte & Aktivitäten basierend auf Hobbies</Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          {/* Personal Roadmap Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PersonalRoadmap />
          </motion.div>
        </Container>
      </Box>
    </AccessControl>
  );
}
