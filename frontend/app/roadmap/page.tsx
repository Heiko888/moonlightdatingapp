"use client";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { BarChart3, Target, Sparkles, Brain, Crown } from 'lucide-react';
import PersonalRoadmap from '@/components/PersonalRoadmap';
import AccessControl from '../../components/AccessControl';
import Link from 'next/link';
import { UserSubscription } from '../../lib/subscription/types';

export default function RoadmapPage() {
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    loadUserSubscription();
  }, []);

  const loadUserSubscription = () => {
    if (typeof window !== 'undefined') {
      // Lade User-Daten aus localStorage
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log('🔍 Roadmap - User-Daten geladen:', user);
          
          // Erstelle UserSubscription-Objekt - korrigiere packageId für Premium
          const subscription = {
            userId: user.id || 'unknown',
            packageId: (user.subscriptionPlan === 'premium' ? 'premium' : user.subscriptionPlan) || 'basic',
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

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          {/* Header */}
          <motion.div
            
            
            
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Target size={48} color="#8B5CF6" />
                <Typography variant="h2" sx={{ ml: 2, fontWeight: 700, background: 'linear-gradient(45deg, #8B5CF6, #A78BFA)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  AI-Powered Roadmap
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
                Dein intelligenter Entwicklungsplan basierend auf Human Design & AI-Analyse
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Brain size={16} />} 
                  label="AI-Powered" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #8B5CF6, #A78BFA)',
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
                    background: 'linear-gradient(45deg, #10B981, #34D399)',
                    color: 'white',
                    fontWeight: 600,
                    px: 2,
                    py: 1
                  }} 
                />
                <Button
                  variant="outlined"
                  component={Link}
                  href="/premium-dashboard"
                  startIcon={<BarChart3 size={20} />}
                  sx={{
                    color: '#FFD700',
                    borderColor: '#FFD700',
                    '&:hover': {
                      borderColor: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                    }
                  }}
                >
                  ← Zurück zum Premium Dashboard
                </Button>
              </Box>
            </Box>
          </motion.div>

          {/* AI Features Overview */}
          <motion.div
            
            
            
          >
            <Paper elevation={0} sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              p: 4,
              mb: 4
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Brain size={24} color="#8B5CF6" />
                <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>AI-Engine Features</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Target size={32} color="#10B981" />
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, mb: 0.5 }}>Personalisierte Schritte</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Basierend auf deinem Human Design Profil</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Sparkles size={32} color="#F59E0B" />
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, mb: 0.5 }}>Journal-Analyse</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Erkenntnisse aus deinen Einträgen</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Crown size={32} color="#EF4444" />
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, mb: 0.5 }}>Dating-Tipps</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Orte & Aktivitäten basierend auf Hobbies</Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          {/* Personal Roadmap Component */}
          <motion.div
            
            
            
          >
            <PersonalRoadmap />
          </motion.div>
        </Container>
      </Box>
  );
}
