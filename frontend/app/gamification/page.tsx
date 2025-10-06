"use client";
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import GamificationSystem from '@/components/GamificationSystem';
import UnifiedPageLayout from '@/components/UnifiedPageLayout';

export default function GamificationPage() {
  return (
    <UnifiedPageLayout
      title="🏆 Gamification"
      subtitle="Sammle Punkte, verdiene Badges und erreiche neue Level in deiner Human Design Reise"
    >
      {/* Gamification System Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GamificationSystem />
      </motion.div>
    </UnifiedPageLayout>
  );
}
