"use client";
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import GamificationSystem from '@/components/GamificationSystem';
import AnimatedStars from '@/components/AnimatedStars';

export default function GamificationPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                mb: 3,
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}
            >
              🏆 Gamification
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Sammle Punkte, verdiene Badges und erreiche neue Level in deiner Human Design Reise
            </Typography>
          </Box>
        </motion.div>

        {/* Gamification System Component */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <GamificationSystem />
        </motion.div>
      </Container>
    </Box>
  );
}
