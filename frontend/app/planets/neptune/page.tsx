'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Star, 
  Zap, 
  Heart, 
  Brain, 
  Shield, 
  Target, 
  Crown,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NeptunePage() {
  const router = useRouter();
  const [expandedGate, setExpandedGate] = useState<number | false>(false);

  const neptuneInfo = {
    name: "Neptun",
    symbol: "♆",
    orbitalPeriod: "164.8 Jahre",
    discovery: "1846",
    mythology: "Der Mystiker",
    color: "#4169E1",
    description: "Neptun repräsentiert Spiritualität, Illusion und Verbindung. Er zeigt, wo wir spirituell wachsen, uns verbinden und mystische Erfahrungen machen."
  };

  const neptuneInGates = [
    {
      gate: 1,
      name: "Kreativität",
      spirituality: "Kreative Spiritualität",
      connection: "Schöpferische Verbindung",
      description: "Neptun hier zeigt, wie wir kreative Spiritualität und schöpferische Verbindung entwickeln.",
      deepMeaning: "Die Spiritualität der Kreativität - wie du kreative Spiritualität entwickelst und schöpferische Verbindung erlebst.",
      shadowAspects: ["Kreative Blockaden", "Spirituelle Illusionen", "Perfektionismus", "Trennung"],
      gifts: ["Kreative Spiritualität", "Schöpferische Verbindung", "Künstlerische Begabung", "Inspiration"],
      spiritualityAffirmation: "Ich entwickle kreative Spiritualität und erlebe schöpferische Verbindung. Meine Kreativität ist spirituell."
    },
    {
      gate: 2,
      name: "Empfänglichkeit",
      spirituality: "Empfangende Spiritualität",
      connection: "Empfangende Verbindung",
      description: "Neptun hier zeigt, wie wir empfängliche Spiritualität und empfängliche Verbindung entwickeln.",
      deepMeaning: "Die Spiritualität der Empfänglichkeit - wie du empfängliche Spiritualität entwickelst und empfängliche Verbindung erlebst.",
      shadowAspects: ["Bindungsangst", "Spirituelle Illusionen", "Emotionale Distanz", "Trennung"],
      gifts: ["Empfangende Spiritualität", "Empathische Verbindung", "Tiefe Verbindung", "Heilende Präsenz"],
      spiritualityAffirmation: "Ich entwickle empfängliche Spiritualität und erlebe empathische Verbindung. Meine Verbindungsfähigkeit ist spirituell."
    },
    {
      gate: 3,
      name: "Beginn",
      spirituality: "Anfängliche Spiritualität",
      connection: "Anfängliche Verbindung",
      description: "Neptun hier zeigt, wie wir anfängliche Spiritualität und anfängliche Verbindung entwickeln.",
      deepMeaning: "Die Spiritualität des Anfangs - wie du anfängliche Spiritualität entwickelst und anfängliche Verbindung erlebst.",
      shadowAspects: ["Angst vor Spiritualität", "Perfektionismus", "Angst vor dem Scheitern", "Trennung"],
      gifts: ["Anfängliche Spiritualität", "Pioniergeist", "Innovation", "Mut zum Neuanfang"],
      spiritualityAffirmation: "Ich entwickle anfängliche Spiritualität und erlebe pionierhafte Verbindung. Mein Pioniergeist ist spirituell."
    },
    {
      gate: 4,
      name: "Jugendliche Torheit",
      spirituality: "Wissende Spiritualität",
      connection: "Wissende Verbindung",
      description: "Neptun hier zeigt, wie wir wissende Spiritualität und wissende Verbindung entwickeln.",
      deepMeaning: "Die Spiritualität des Wissens - wie du wissende Spiritualität entwickelst und wissende Verbindung erlebst.",
      shadowAspects: ["Wissensangst", "Spirituelle Illusionen", "Intellektuelle Arroganz", "Trennung"],
      gifts: ["Wissende Spiritualität", "Weisheit", "Lehrfähigkeit", "Mentoring"],
      spiritualityAffirmation: "Ich entwickle wissende Spiritualität und erlebe weise Verbindung. Mein Wissen ist spirituell."
    },
    {
      gate: 5,
      name: "Warten",
      spirituality: "Wartende Spiritualität",
      connection: "Wartende Verbindung",
      description: "Neptun hier zeigt, wie wir wartende Spiritualität und wartende Verbindung entwickeln.",
      deepMeaning: "Die Spiritualität des Wartens - wie du wartende Spiritualität entwickelst und wartende Verbindung erlebst.",
      shadowAspects: ["Ungeduld", "Spirituelle Illusionen", "Zeitdruck", "Trennung"],
      gifts: ["Wartende Spiritualität", "Geduld", "Timing", "Vertrauen"],
      spiritualityAffirmation: "Ich entwickle wartende Spiritualität und erlebe zeitliche Verbindung. Meine Geduld ist spirituell."
    },
    {
      gate: 6,
      name: "Konflikt",
      spirituality: "Konfliktlösende Spiritualität",
      connection: "Konfliktlösende Verbindung",
      description: "Neptun hier zeigt, wie wir konfliktlösende Spiritualität und konfliktlösende Verbindung entwickeln.",
      deepMeaning: "Die Spiritualität der Konfliktlösung - wie du konfliktlösende Spiritualität entwickelst und konfliktlösende Verbindung erlebst.",
      shadowAspects: ["Konfliktvermeidung", "Spirituelle Illusionen", "Harmoniezwang", "Trennung"],
      gifts: ["Konfliktlösende Spiritualität", "Mediation", "Wachstum", "Stärke"],
      spiritualityAffirmation: "Ich entwickle konfliktlösende Spiritualität und erlebe mediative Verbindung. Meine Konfliktlösung ist spirituell."
    },
    {
      gate: 7,
      name: "Die Rolle des Selbst",
      spirituality: "Rollenbewusste Spiritualität",
      connection: "Rollenbewusste Verbindung",
      description: "Neptun hier zeigt, wie wir rollenbewusste Spiritualität und rollenbewusste Verbindung entwickeln.",
      deepMeaning: "Die Spiritualität der Rolle - wie du rollenbewusste Spiritualität entwickelst und rollenbewusste Verbindung erlebst.",
      shadowAspects: ["Identitätskrise", "Spirituelle Illusionen", "Rollenverwirrung", "Trennung"],
      gifts: ["Rollenbewusste Spiritualität", "Führung", "Authentizität", "Inspiration"],
      spiritualityAffirmation: "Ich entwickle rollenbewusste Spiritualität und erlebe führungsverbindung. Meine Rolle ist spirituell."
    },
    {
      gate: 8,
      name: "Haltung",
      spirituality: "Wertbewusste Spiritualität",
      connection: "Wertbewusste Verbindung",
      description: "Neptun hier zeigt, wie wir wertbewusste Spiritualität und wertbewusste Verbindung entwickeln.",
      deepMeaning: "Die Spiritualität des Wertes - wie du wertbewusste Spiritualität entwickelst und wertbewusste Verbindung erlebst.",
      shadowAspects: ["Wertlosigkeitsgefühl", "Spirituelle Illusionen", "Selbstkritik", "Trennung"],
      gifts: ["Wertbewusste Spiritualität", "Selbstwert", "Würde", "Stolz"],
      spiritualityAffirmation: "Ich entwickle wertbewusste Spiritualität und erlebe würdevolle Verbindung. Mein Selbstwert ist spirituell."
    }
  ];

  const neptuneInCenters = [
    {
      center: "Head Center",
      spirituality: "Inspirationsspiritualität",
      connection: "Inspirationsverbindung",
      description: "Neptun hier zeigt, wie wir Inspirationsspiritualität und Inspirationsverbindung entwickeln.",
      deepMeaning: "Die Spiritualität der Inspiration - wie du Inspirationsspiritualität entwickelst und Inspirationsverbindung erlebst.",
      shadowAspects: ["Inspirationsblockaden", "Spirituelle Illusionen", "Perfektionismus", "Trennung"],
      gifts: ["Inspirationsspiritualität", "Kreative Ideen", "Neue Konzepte", "Führung"],
      spiritualityAffirmation: "Ich entwickle Inspirationsspiritualität und erlebe kreative Verbindung. Meine Inspiration ist spirituell."
    },
    {
      center: "Ajna Center",
      spirituality: "Verstandesspiritualität",
      connection: "Verstandesverbindung",
      description: "Neptun hier zeigt, wie wir Verstandesspiritualität und Verstandesverbindung entwickeln.",
      deepMeaning: "Die Spiritualität des Verstandes - wie du Verstandesspiritualität entwickelst und Verstandesverbindung erlebst.",
      shadowAspects: ["Verstandesblockaden", "Spirituelle Illusionen", "Perfektionismus", "Trennung"],
      gifts: ["Verstandesspiritualität", "Konzeptualisierung", "Analyse", "Verstehen"],
      spiritualityAffirmation: "Ich entwickle Verstandesspiritualität und erlebe analytische Verbindung. Mein Verstand ist spirituell."
    },
    {
      center: "Throat Center",
      spirituality: "Ausdrucksspiritualität",
      connection: "Ausdrucksverbindung",
      description: "Neptun hier zeigt, wie wir Ausdrucksspiritualität und Ausdrucksverbindung entwickeln.",
      deepMeaning: "Die Spiritualität des Ausdrucks - wie du Ausdrucksspiritualität entwickelst und Ausdrucksverbindung erlebst.",
      shadowAspects: ["Ausdrucksblockaden", "Spirituelle Illusionen", "Perfektionismus", "Trennung"],
      gifts: ["Ausdrucksspiritualität", "Manifestation", "Kommunikation", "Kreativität"],
      spiritualityAffirmation: "Ich entwickle Ausdrucksspiritualität und erlebe kommunikative Verbindung. Mein Ausdruck ist spirituell."
    },
    {
      center: "G Center",
      spirituality: "Identitätsspiritualität",
      connection: "Identitätsverbindung",
      description: "Neptun hier zeigt, wie wir Identitätsspiritualität und Identitätsverbindung entwickeln.",
      deepMeaning: "Die Spiritualität der Identität - wie du Identitätsspiritualität entwickelst und Identitätsverbindung erlebst.",
      shadowAspects: ["Identitätskrise", "Spirituelle Illusionen", "Orientierungslosigkeit", "Trennung"],
      gifts: ["Identitätsspiritualität", "Orientierung", "Führung", "Authentizität"],
      spiritualityAffirmation: "Ich entwickle Identitätsspiritualität und erlebe orientierungsverbindung. Meine Identität ist spirituell."
    },
    {
      center: "Heart Center",
      spirituality: "Wertspiritualität",
      connection: "Wertverbindung",
      description: "Neptun hier zeigt, wie wir Wertspiritualität und Wertverbindung entwickeln.",
      deepMeaning: "Die Spiritualität des Wertes - wie du Wertspiritualität entwickelst und Wertverbindung erlebst.",
      shadowAspects: ["Wertlosigkeitsgefühl", "Spirituelle Illusionen", "Selbstkritik", "Trennung"],
      gifts: ["Wertspiritualität", "Selbstbehauptung", "Führung", "Würde"],
      spiritualityAffirmation: "Ich entwickle Wertspiritualität und erlebe würdevolle Verbindung. Mein Wert ist spirituell."
    },
    {
      center: "Solar Plexus Center",
      spirituality: "Emotionsspiritualität",
      connection: "Emotionsverbindung",
      description: "Neptun hier zeigt, wie wir Emotionsspiritualität und Emotionsverbindung entwickeln.",
      deepMeaning: "Die Spiritualität der Emotionen - wie du Emotionsspiritualität entwickelst und Emotionsverbindung erlebst.",
      shadowAspects: ["Emotionsblockaden", "Spirituelle Illusionen", "Perfektionismus", "Trennung"],
      gifts: ["Emotionsspiritualität", "Empathie", "Verstehen", "Heilung"],
      spiritualityAffirmation: "Ich entwickle Emotionsspiritualität und erlebe empathische Verbindung. Meine Emotionalität ist spirituell."
    },
    {
      center: "Sacral Center",
      spirituality: "Lebenskraftspiritualität",
      connection: "Lebenskraftverbindung",
      description: "Neptun hier zeigt, wie wir Lebenskraftspiritualität und Lebenskraftverbindung entwickeln.",
      deepMeaning: "Die Spiritualität der Lebenskraft - wie du Lebenskraftspiritualität entwickelst und Lebenskraftverbindung erlebst.",
      shadowAspects: ["Lebenskraftblockaden", "Spirituelle Illusionen", "Perfektionismus", "Trennung"],
      gifts: ["Lebenskraftspiritualität", "Arbeit", "Produktivität", "Kreativität"],
      spiritualityAffirmation: "Ich entwickle Lebenskraftspiritualität und erlebe produktive Verbindung. Meine Lebenskraft ist spirituell."
    },
    {
      center: "Spleen Center",
      spirituality: "Instinktspiritualität",
      connection: "Instinktverbindung",
      description: "Neptun hier zeigt, wie wir Instinktspiritualität und Instinktverbindung entwickeln.",
      deepMeaning: "Die Spiritualität der Instinkte - wie du Instinktspiritualität entwickelst und Instinktverbindung erlebst.",
      shadowAspects: ["Instinktblockaden", "Spirituelle Illusionen", "Perfektionismus", "Trennung"],
      gifts: ["Instinktspiritualität", "Intuition", "Gesundheit", "Schutz"],
      spiritualityAffirmation: "Ich entwickle Instinktspiritualität und erlebe intuitive Verbindung. Meine Instinkte sind spirituell."
    },
    {
      center: "Root Center",
      spirituality: "Druckspiritualität",
      connection: "Druckverbindung",
      description: "Neptun hier zeigt, wie wir Druckspiritualität und Druckverbindung entwickeln.",
      deepMeaning: "Die Spiritualität des Drucks - wie du Druckspiritualität entwickelst und Druckverbindung erlebst.",
      shadowAspects: ["Druckblockaden", "Spirituelle Illusionen", "Perfektionismus", "Trennung"],
      gifts: ["Druckspiritualität", "Stressbewältigung", "Antrieb", "Transformation"],
      spiritualityAffirmation: "Ich entwickle Druckspiritualität und erlebe transformative Verbindung. Mein Druck ist spirituell."
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B0D12 0%, #1A1F2B 50%, #2D3748 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Stars */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, #4169E1, transparent),
          radial-gradient(2px 2px at 40px 70px, #4169E1, transparent),
          radial-gradient(1px 1px at 90px 40px, #4169E1, transparent),
          radial-gradient(1px 1px at 130px 80px, #4169E1, transparent),
          radial-gradient(2px 2px at 160px 30px, #4169E1, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        animation: 'twinkle 4s ease-in-out infinite alternate'
      }} />

      {/* Animated Neptune */}
      <motion.div
        
        animate={{ 
          opacity: 0.4, 
          scale: [1, 1.08, 1],
          rotate: 360
        }}
        transition={{ 
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 25, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          top: '5%',
          right: '8%',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 30% 30%, #4169E1, #1E90FF, #0000CD),
            radial-gradient(circle at 70% 70%, #1E90FF, #0000CD, #000080),
            radial-gradient(circle at 50% 50%, #87CEEB, #4169E1)
          `,
          boxShadow: `
            0 0 40px rgba(65, 105, 225, 0.5),
            0 0 80px rgba(30, 144, 255, 0.4),
            0 0 120px rgba(0, 0, 205, 0.3),
            inset -15px -15px 30px rgba(0, 0, 128, 0.3)
          `,
          zIndex: 0
        }}
      >
        {/* Neptune Surface Details - Storm Systems */}
        <Box sx={{
          position: 'absolute',
          top: '25%',
          left: '20%',
          width: '25px',
          height: '15px',
          borderRadius: '50%',
          background: 'rgba(30, 144, 255, 0.6)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          left: '65%',
          width: '20px',
          height: '12px',
          borderRadius: '50%',
          background: 'rgba(65, 105, 225, 0.7)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '45%',
          left: '10%',
          width: '30px',
          height: '18px',
          borderRadius: '50%',
          background: 'rgba(0, 0, 205, 0.5)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '70%',
          left: '30%',
          width: '18px',
          height: '10px',
          borderRadius: '50%',
          background: 'rgba(30, 144, 255, 0.8)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '35%',
          left: '75%',
          width: '22px',
          height: '14px',
          borderRadius: '50%',
          background: 'rgba(65, 105, 225, 0.6)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
      </motion.div>

      {/* Neptune's Rings */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '2%',
          right: '5%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          border: '2px solid rgba(65, 105, 225, 0.3)',
          zIndex: -1
        }}
      />
      <motion.div
        animate={{ 
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          top: '0%',
          right: '3%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '1px solid rgba(30, 144, 255, 0.2)',
          zIndex: -2
        }}
      />

      {/* Mystical Energy Waves */}
      <motion.div
        animate={{ 
          scale: [0, 1.5, 0],
          opacity: [0, 0.4, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeOut"
        }}
        style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: '#4169E1',
          boxShadow: '0 0 12px rgba(65, 105, 225, 0.6)',
          zIndex: 0
        }}
      />
      <motion.div
        animate={{ 
          scale: [0, 1.2, 0],
          opacity: [0, 0.5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1.5
        }}
        style={{
          position: 'absolute',
          top: '30%',
          right: '25%',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: '#1E90FF',
          boxShadow: '0 0 10px rgba(30, 144, 255, 0.5)',
          zIndex: 0
        }}
      />
      <motion.div
        animate={{ 
          scale: [0, 1.8, 0],
          opacity: [0, 0.3, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeOut",
          delay: 3
        }}
        style={{
          position: 'absolute',
          top: '40%',
          right: '10%',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#87CEEB',
          boxShadow: '0 0 15px rgba(135, 206, 235, 0.4)',
          zIndex: 0
        }}
      />

      {/* Neptune's Moon Triton */}
      <motion.div
        
        animate={{ 
          opacity: 0.5,
          scale: 1,
          x: [0, 40, 0],
          y: [0, -25, 0]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '12%',
          right: '18%',
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 40% 40%, #B0C4DE, #87CEEB, #4169E1),
            radial-gradient(circle at 60% 60%, #87CEEB, #4169E1, #0000CD)
          `,
          boxShadow: `
            0 0 15px rgba(176, 196, 222, 0.4),
            inset -3px -3px 8px rgba(0, 0, 0, 0.3)
          `,
          zIndex: 1
        }}
      >
        {/* Triton Surface Details */}
        <Box sx={{
          position: 'absolute',
          top: '30%',
          left: '25%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(65, 105, 225, 0.6)',
          boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          left: '60%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(30, 144, 255, 0.7)',
          boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
        }} />
      </motion.div>

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/planets')}
            sx={{
              color: '#4169E1',
              borderColor: '#4169E1',
              '&:hover': {
                borderColor: '#4169E1',
                backgroundColor: 'rgba(65, 105, 225, 0.1)',
                boxShadow: '0 0 20px rgba(65, 105, 225, 0.3)'
              },
              mr: 2
            }}
          >
            <ArrowLeft size={20} style={{ marginRight: 8 }} />
            Zurück zu den Planeten
          </Button>
        </Box>

        {/* Title */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Globe size={48} color="#4169E1" />
              <Typography variant="h2" sx={{ ml: 2, fontWeight: 700, color: '#4169E1' }}>
                {neptuneInfo.symbol} {neptuneInfo.name}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
              {neptuneInfo.mythology}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, maxWidth: '600px', mx: 'auto' }}>
              {neptuneInfo.description}
            </Typography>
          </Box>
        </motion.div>

        {/* Neptune Overview */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #4169E1',
            boxShadow: '0 8px 32px rgba(65, 105, 225, 0.2)',
            p: 4,
            mb: 4
          }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h1" sx={{ color: neptuneInfo.color, mb: 2 }}>
                    {neptuneInfo.symbol}
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                    {neptuneInfo.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: neptuneInfo.color, mb: 3 }}>
                    {neptuneInfo.mythology}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, lineHeight: 1.6 }}>
                    {neptuneInfo.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Orbitalperiode
                        </Typography>
                        <Typography variant="h6" sx={{ color: neptuneInfo.color }}>
                          {neptuneInfo.orbitalPeriod}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Entdeckung
                        </Typography>
                        <Typography variant="h6" sx={{ color: neptuneInfo.color }}>
                          {neptuneInfo.discovery}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </motion.div>

        {/* Neptune in Gates */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #4169E1',
            boxShadow: '0 8px 32px rgba(65, 105, 225, 0.2)',
            p: 3,
            mb: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Target size={24} color="#4169E1" />
                <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                  Neptun in den Gates
                </Typography>
              </Box>
              <Chip 
                label="Gates 1-8 von 64" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(65,105,225,0.2)',
                  color: '#4169E1',
                  fontSize: '10px'
                }} 
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
              Hier sind die ersten 8 Gates mit Neptun-Informationen. Neptun zeigt unsere Spiritualität und Verbindung in jedem Gate.
            </Typography>
            <List>
              {neptuneInGates.map((gate, index) => (
                <Accordion key={index} sx={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  mb: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown sx={{ color: '#4169E1' }} />}
                    sx={{ 
                      '& .MuiAccordionSummary-content': { 
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #4169E1, #1E90FF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000' }}>
                          {gate.gate}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {gate.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {gate.spirituality}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={gate.connection} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(65,105,225,0.2)',
                        color: '#4169E1',
                        fontSize: '10px'
                      }} 
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ pl: 6 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        {gate.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, fontWeight: 500 }}>
                        {gate.deepMeaning}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#FF6B6B', mb: 1, fontWeight: 600 }}>
                          Schatten-Aspekte:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {gate.shadowAspects.map((aspect, idx) => (
                            <Chip 
                              key={idx} 
                              label={aspect} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(255,107,107,0.2)',
                                color: '#FF6B6B',
                                fontSize: '10px'
                              }} 
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#4CAF50', mb: 1, fontWeight: 600 }}>
                          Geschenke:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {gate.gifts.map((gift, idx) => (
                            <Chip 
                              key={idx} 
                              label={gift} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(76,175,80,0.2)',
                                color: '#4CAF50',
                                fontSize: '10px'
                              }} 
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ 
                        p: 2, 
                        background: 'rgba(65,105,225,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(65,105,225,0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#4169E1', fontWeight: 600, mb: 1 }}>
                          Spiritualitäts-Affirmation:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {gate.spiritualityAffirmation}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Card>
        </motion.div>

        {/* Neptune in Centers */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #4169E1',
            boxShadow: '0 8px 32px rgba(65, 105, 225, 0.2)',
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Crown size={24} color="#4169E1" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                Neptun in den Centers
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
              Neptun in den 9 Centers zeigt, wo unsere Spiritualität und Verbindung am stärksten wirken.
            </Typography>
            <List>
              {neptuneInCenters.map((center, index) => (
                <Accordion key={index} sx={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  mb: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown sx={{ color: '#4169E1' }} />}
                    sx={{ 
                      '& .MuiAccordionSummary-content': { 
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #4169E1, #1E90FF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        <Crown size={20} color="#000" />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {center.center}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {center.spirituality}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={center.connection} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(65,105,225,0.2)',
                        color: '#4169E1',
                        fontSize: '10px'
                      }} 
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ pl: 6 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        {center.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, fontWeight: 500 }}>
                        {center.deepMeaning}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#FF6B6B', mb: 1, fontWeight: 600 }}>
                          Schatten-Aspekte:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {center.shadowAspects.map((aspect, idx) => (
                            <Chip 
                              key={idx} 
                              label={aspect} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(255,107,107,0.2)',
                                color: '#FF6B6B',
                                fontSize: '10px'
                              }} 
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#4CAF50', mb: 1, fontWeight: 600 }}>
                          Geschenke:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {center.gifts.map((gift, idx) => (
                            <Chip 
                              key={idx} 
                              label={gift} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(76,175,80,0.2)',
                                color: '#4CAF50',
                                fontSize: '10px'
                              }} 
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ 
                        p: 2, 
                        background: 'rgba(65,105,225,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(65,105,225,0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#4169E1', fontWeight: 600, mb: 1 }}>
                          Spiritualitäts-Affirmation:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {center.spiritualityAffirmation}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
