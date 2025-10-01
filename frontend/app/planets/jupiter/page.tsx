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
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Star, 
  Zap, 
  Heart, 
  Brain, 
  Shield, 
  Target, 
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JupiterPage() {
  const router = useRouter();
  const [expandedGate, setExpandedGate] = useState<number | false>(false);

  const jupiterInfo = {
    name: "Jupiter",
    mythology: "Der König der Götter",
    color: "#DAA520",
    description: "Jupiter repräsentiert Expansion, Weisheit und Wachstum. Er zeigt, wo wir wachsen, uns ausdehnen und Weisheit erlangen."
  };

  const jupiterInGates = [
    {
      gate: 1,
      name: "Kreativität",
      expansion: "Kreative Expansion",
      wisdom: "Schöpferische Weisheit",
      description: "Jupiter hier zeigt, wie wir kreativ expandieren und schöpferische Weisheit erlangen.",
      deepMeaning: "Die Expansion der Kreativität - wie du deine kreativen Fähigkeiten erweiterst und schöpferische Weisheit entwickelst.",
      shadowAspects: ["Kreative Blockaden", "Angst vor Expansion", "Perfektionismus", "Begrenzung"],
      gifts: ["Kreative Expansion", "Schöpferische Weisheit", "Künstlerische Begabung", "Inspiration"],
      expansionAffirmation: "Ich expandiere kreativ und entwickle schöpferische Weisheit. Meine Kreativität wächst unendlich."
    },
    {
      gate: 2,
      name: "Empfänglichkeit",
      expansion: "Empfangende Expansion",
      wisdom: "Empfangende Weisheit",
      description: "Jupiter hier zeigt, wie wir empfänglich expandieren und empfängliche Weisheit erlangen.",
      deepMeaning: "Die Expansion der Empfänglichkeit - wie du deine Empfänglichkeit erweiterst und empfängliche Weisheit entwickelst.",
      shadowAspects: ["Bindungsangst", "Angst vor Expansion", "Emotionale Distanz", "Begrenzung"],
      gifts: ["Empfangende Expansion", "Empathische Weisheit", "Tiefe Verbindung", "Heilende Präsenz"],
      expansionAffirmation: "Ich expandiere empfänglich und entwickle empathische Weisheit. Meine Verbindungsfähigkeit wächst unendlich."
    },
    {
      gate: 3,
      name: "Beginn",
      expansion: "Anfängliche Expansion",
      wisdom: "Anfängliche Weisheit",
      description: "Jupiter hier zeigt, wie wir neue Anfänge expandieren und anfängliche Weisheit erlangen.",
      deepMeaning: "Die Expansion des Anfangs - wie du neue Anfänge erweiterst und anfängliche Weisheit entwickelst.",
      shadowAspects: ["Angst vor Expansion", "Perfektionismus", "Angst vor dem Scheitern", "Begrenzung"],
      gifts: ["Anfängliche Expansion", "Pioniergeist", "Innovation", "Mut zum Neuanfang"],
      expansionAffirmation: "Ich expandiere mutig und entwickle pionierhafte Weisheit. Mein Pioniergeist wächst unendlich."
    },
    {
      gate: 4,
      name: "Jugendliche Torheit",
      expansion: "Wissende Expansion",
      wisdom: "Wissende Weisheit",
      description: "Jupiter hier zeigt, wie wir Wissen expandieren und wissende Weisheit erlangen.",
      deepMeaning: "Die Expansion des Wissens - wie du dein Wissen erweiterst und wissende Weisheit entwickelst.",
      shadowAspects: ["Wissensangst", "Angst vor Expansion", "Intellektuelle Arroganz", "Begrenzung"],
      gifts: ["Wissende Expansion", "Weisheit", "Lehrfähigkeit", "Mentoring"],
      expansionAffirmation: "Ich expandiere wissend und entwickle tiefe Weisheit. Mein Wissen wächst unendlich."
    },
    {
      gate: 5,
      name: "Warten",
      expansion: "Wartende Expansion",
      wisdom: "Wartende Weisheit",
      description: "Jupiter hier zeigt, wie wir Geduld expandieren und wartende Weisheit erlangen.",
      deepMeaning: "Die Expansion des Wartens - wie du deine Geduld erweiterst und wartende Weisheit entwickelst.",
      shadowAspects: ["Ungeduld", "Angst vor Expansion", "Zeitdruck", "Begrenzung"],
      gifts: ["Wartende Expansion", "Geduld", "Timing", "Vertrauen"],
      expansionAffirmation: "Ich expandiere geduldig und entwickle zeitliche Weisheit. Meine Geduld wächst unendlich."
    },
    {
      gate: 6,
      name: "Konflikt",
      expansion: "Konfliktlösende Expansion",
      wisdom: "Konfliktlösende Weisheit",
      description: "Jupiter hier zeigt, wie wir Konfliktlösung expandieren und konfliktlösende Weisheit erlangen.",
      deepMeaning: "Die Expansion der Konfliktlösung - wie du deine Konfliktlösungsfähigkeit erweiterst und konfliktlösende Weisheit entwickelst.",
      shadowAspects: ["Konfliktvermeidung", "Angst vor Expansion", "Harmoniezwang", "Begrenzung"],
      gifts: ["Konfliktlösende Expansion", "Mediation", "Wachstum", "Stärke"],
      expansionAffirmation: "Ich expandiere konfliktlösend und entwickle mediative Weisheit. Meine Konfliktlösung wächst unendlich."
    },
    {
      gate: 7,
      name: "Die Rolle des Selbst",
      expansion: "Rollenbewusste Expansion",
      wisdom: "Rollenbewusste Weisheit",
      description: "Jupiter hier zeigt, wie wir unsere Rolle expandieren und rollenbewusste Weisheit erlangen.",
      deepMeaning: "Die Expansion der Rolle - wie du deine Rolle erweiterst und rollenbewusste Weisheit entwickelst.",
      shadowAspects: ["Identitätskrise", "Angst vor Expansion", "Rollenverwirrung", "Begrenzung"],
      gifts: ["Rollenbewusste Expansion", "Führung", "Authentizität", "Inspiration"],
      expansionAffirmation: "Ich expandiere rollenbewusst und entwickle führungsweisheit. Meine Rolle wächst unendlich."
    },
    {
      gate: 8,
      name: "Haltung",
      expansion: "Wertbewusste Expansion",
      wisdom: "Wertbewusste Weisheit",
      description: "Jupiter hier zeigt, wie wir unseren Wert expandieren und wertbewusste Weisheit erlangen.",
      deepMeaning: "Die Expansion des Wertes - wie du deinen Selbstwert erweiterst und wertbewusste Weisheit entwickelst.",
      shadowAspects: ["Wertlosigkeitsgefühl", "Angst vor Expansion", "Selbstkritik", "Begrenzung"],
      gifts: ["Wertbewusste Expansion", "Selbstwert", "Würde", "Stolz"],
      expansionAffirmation: "Ich expandiere wertbewusst und entwickle würdeweisheit. Mein Selbstwert wächst unendlich."
    }
  ];

  const jupiterInCenters = [
    {
      center: "Head Center",
      expansion: "Inspirationsexpansion",
      wisdom: "Inspirationsweisheit",
      description: "Jupiter hier zeigt, wie wir Inspiration expandieren und inspirationsweisheit erlangen.",
      deepMeaning: "Die Expansion der Inspiration - wie du deine Inspirationsfähigkeit erweiterst und inspirationsweisheit entwickelst.",
      shadowAspects: ["Inspirationsblockaden", "Angst vor Expansion", "Perfektionismus", "Begrenzung"],
      gifts: ["Inspirationsexpansion", "Kreative Ideen", "Neue Konzepte", "Führung"],
      expansionAffirmation: "Ich expandiere inspirierend und entwickle kreative Weisheit. Meine Inspiration wächst unendlich."
    },
    {
      center: "Ajna Center",
      expansion: "Verstandesexpansion",
      wisdom: "Verstandesweisheit",
      description: "Jupiter hier zeigt, wie wir Denken expandieren und verstandesweisheit erlangen.",
      deepMeaning: "Die Expansion des Verstandes - wie du dein Denken erweiterst und verstandesweisheit entwickelst.",
      shadowAspects: ["Verstandesblockaden", "Angst vor Expansion", "Perfektionismus", "Begrenzung"],
      gifts: ["Verstandesexpansion", "Konzeptualisierung", "Analyse", "Verstehen"],
      expansionAffirmation: "Ich expandiere verstandesmäßig und entwickle analytische Weisheit. Mein Verstand wächst unendlich."
    },
    {
      center: "Throat Center",
      expansion: "Ausdruckserweiterung",
      wisdom: "Ausdrucksweisheit",
      description: "Jupiter hier zeigt, wie wir Ausdruck expandieren und ausdrucksweisheit erlangen.",
      deepMeaning: "Die Expansion des Ausdrucks - wie du deinen Ausdruck erweiterst und ausdrucksweisheit entwickelst.",
      shadowAspects: ["Ausdrucksblockaden", "Angst vor Expansion", "Perfektionismus", "Begrenzung"],
      gifts: ["Ausdruckserweiterung", "Manifestation", "Kommunikation", "Kreativität"],
      expansionAffirmation: "Ich expandiere ausdrucksvoll und entwickle kommunikative Weisheit. Mein Ausdruck wächst unendlich."
    },
    {
      center: "G Center",
      expansion: "Identitätsexpansion",
      wisdom: "Identitätsweisheit",
      description: "Jupiter hier zeigt, wie wir Identität expandieren und identitätsweisheit erlangen.",
      deepMeaning: "Die Expansion der Identität - wie du deine Identität erweiterst und identitätsweisheit entwickelst.",
      shadowAspects: ["Identitätskrise", "Angst vor Expansion", "Orientierungslosigkeit", "Begrenzung"],
      gifts: ["Identitätsexpansion", "Orientierung", "Führung", "Authentizität"],
      expansionAffirmation: "Ich expandiere identitätsbewusst und entwickle orientierungsweisheit. Meine Identität wächst unendlich."
    },
    {
      center: "Heart Center",
      expansion: "Wertweiterung",
      wisdom: "Wertweisheit",
      description: "Jupiter hier zeigt, wie wir Wert expandieren und wertweisheit erlangen.",
      deepMeaning: "Die Expansion des Wertes - wie du deinen Wert erweiterst und wertweisheit entwickelst.",
      shadowAspects: ["Wertlosigkeitsgefühl", "Angst vor Expansion", "Selbstkritik", "Begrenzung"],
      gifts: ["Wertweiterung", "Selbstbehauptung", "Führung", "Würde"],
      expansionAffirmation: "Ich expandiere wertbewusst und entwickle würdeweisheit. Mein Wert wächst unendlich."
    },
    {
      center: "Solar Plexus Center",
      expansion: "Emotionserweiterung",
      wisdom: "Emotionsweisheit",
      description: "Jupiter hier zeigt, wie wir Emotionen expandieren und emotionsweisheit erlangen.",
      deepMeaning: "Die Expansion der Emotionen - wie du deine Emotionalität erweiterst und emotionsweisheit entwickelst.",
      shadowAspects: ["Emotionsblockaden", "Angst vor Expansion", "Perfektionismus", "Begrenzung"],
      gifts: ["Emotionserweiterung", "Empathie", "Verstehen", "Heilung"],
      expansionAffirmation: "Ich expandiere emotional und entwickle empathische Weisheit. Meine Emotionalität wächst unendlich."
    },
    {
      center: "Sacral Center",
      expansion: "Lebenskrafterweiterung",
      wisdom: "Lebenskraftweisheit",
      description: "Jupiter hier zeigt, wie wir Lebenskraft expandieren und lebenskraftweisheit erlangen.",
      deepMeaning: "Die Expansion der Lebenskraft - wie du deine Lebenskraft erweiterst und lebenskraftweisheit entwickelst.",
      shadowAspects: ["Lebenskraftblockaden", "Angst vor Expansion", "Perfektionismus", "Begrenzung"],
      gifts: ["Lebenskrafterweiterung", "Arbeit", "Produktivität", "Kreativität"],
      expansionAffirmation: "Ich expandiere lebenskräftig und entwickle produktive Weisheit. Meine Lebenskraft wächst unendlich."
    },
    {
      center: "Spleen Center",
      expansion: "Instinkterweiterung",
      wisdom: "Instinktweisheit",
      description: "Jupiter hier zeigt, wie wir Instinkte expandieren und instinktweisheit erlangen.",
      deepMeaning: "Die Expansion der Instinkte - wie du deine Instinkte erweiterst und instinktweisheit entwickelst.",
      shadowAspects: ["Instinktblockaden", "Angst vor Expansion", "Perfektionismus", "Begrenzung"],
      gifts: ["Instinkterweiterung", "Intuition", "Gesundheit", "Schutz"],
      expansionAffirmation: "Ich expandiere instinktiv und entwickle intuitive Weisheit. Meine Instinkte wachsen unendlich."
    },
    {
      center: "Root Center",
      expansion: "Druckerweiterung",
      wisdom: "Druckweisheit",
      description: "Jupiter hier zeigt, wie wir Druck expandieren und druckweisheit erlangen.",
      deepMeaning: "Die Expansion des Drucks - wie du deinen Druck erweiterst und druckweisheit entwickelst.",
      shadowAspects: ["Druckblockaden", "Angst vor Expansion", "Perfektionismus", "Begrenzung"],
      gifts: ["Druckerweiterung", "Stressbewältigung", "Antrieb", "Transformation"],
      expansionAffirmation: "Ich expandiere druckvoll und entwickle transformative Weisheit. Mein Druck wächst unendlich."
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
          radial-gradient(2px 2px at 20px 30px, #DAA520, transparent),
          radial-gradient(2px 2px at 40px 70px, #DAA520, transparent),
          radial-gradient(1px 1px at 90px 40px, #DAA520, transparent),
          radial-gradient(1px 1px at 130px 80px, #DAA520, transparent),
          radial-gradient(2px 2px at 160px 30px, #DAA520, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        animation: 'twinkle 4s ease-in-out infinite alternate'
      }} />

      {/* Animated Jupiter */}
      <motion.div
        
        animate={{ 
          opacity: 0.5, 
          scale: [1, 1.09, 1],
          rotate: 360
        }}
        transition={{ 
          scale: { duration: 14, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 28, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          top: '5%',
          right: '8%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 30% 30%, #DAA520, #B8860B, #8B4513),
            radial-gradient(circle at 70% 70%, #B8860B, #8B4513, #654321),
            radial-gradient(circle at 50% 50%, #FFD700, #DAA520),
            radial-gradient(circle at 20% 80%, #CD853F, #A0522D),
            radial-gradient(circle at 80% 20%, #DEB887, #D2B48C)
          `,
          boxShadow: `
            0 0 50px rgba(218, 165, 32, 0.6),
            0 0 100px rgba(184, 134, 11, 0.5),
            0 0 150px rgba(139, 69, 19, 0.4),
            inset -20px -20px 40px rgba(101, 67, 33, 0.3)
          `,
          zIndex: 0
        }}
      >
        {/* Jupiter Surface Details - Storm Bands */}
        <Box sx={{
          position: 'absolute',
          top: '20%',
          left: '0%',
          right: '0%',
          height: '8px',
          background: 'rgba(139, 69, 19, 0.7)',
          borderRadius: '4px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '35%',
          left: '0%',
          right: '0%',
          height: '6px',
          background: 'rgba(160, 82, 45, 0.8)',
          borderRadius: '3px',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '0%',
          right: '0%',
          height: '10px',
          background: 'rgba(184, 134, 11, 0.6)',
          borderRadius: '5px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '65%',
          left: '0%',
          right: '0%',
          height: '7px',
          background: 'rgba(210, 180, 140, 0.7)',
          borderRadius: '3.5px',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '80%',
          left: '0%',
          right: '0%',
          height: '5px',
          background: 'rgba(139, 69, 19, 0.8)',
          borderRadius: '2.5px',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
      </motion.div>

      {/* Jupiter's Great Red Spot */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '45%',
          right: '15%',
          width: '25px',
          height: '15px',
          borderRadius: '50%',
          background: 'rgba(139, 0, 0, 0.8)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}
      />

      {/* Jupiter's Rings */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '0%',
          right: '3%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '1px solid rgba(218, 165, 32, 0.2)',
          zIndex: -1
        }}
      />
      <motion.div
        animate={{ 
          scale: [1, 1.08, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        style={{
          position: 'absolute',
          top: '-2%',
          right: '1%',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          border: '1px solid rgba(184, 134, 11, 0.15)',
          zIndex: -2
        }}
      />

      {/* Jupiter Energy Waves */}
      <motion.div
        animate={{ 
          scale: [0, 1.6, 0],
          opacity: [0, 0.5, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeOut"
        }}
        style={{
          position: 'absolute',
          top: '25%',
          right: '20%',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#DAA520',
          boxShadow: '0 0 15px rgba(218, 165, 32, 0.7)',
          zIndex: 0
        }}
      />
      <motion.div
        animate={{ 
          scale: [0, 1.3, 0],
          opacity: [0, 0.6, 0]
        }}
        transition={{ 
          duration: 9,
          repeat: Infinity,
          ease: "easeOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          top: '35%',
          right: '30%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: '#B8860B',
          boxShadow: '0 0 12px rgba(184, 134, 11, 0.6)',
          zIndex: 0
        }}
      />
      <motion.div
        animate={{ 
          scale: [0, 1.8, 0],
          opacity: [0, 0.4, 0]
        }}
        transition={{ 
          duration: 11,
          repeat: Infinity,
          ease: "easeOut",
          delay: 4
        }}
        style={{
          position: 'absolute',
          top: '45%',
          right: '10%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#FFD700',
          boxShadow: '0 0 18px rgba(255, 215, 0, 0.5)',
          zIndex: 0
        }}
      />

      {/* Jupiter's Moons - Io, Europa, Ganymede, Callisto */}
      <motion.div
        
        animate={{ 
          opacity: 0.7,
          scale: 1,
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '20%',
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 40% 40%, #FFD700, #DAA520, #B8860B),
            radial-gradient(circle at 60% 60%, #DAA520, #B8860B, #8B4513)
          `,
          boxShadow: `
            0 0 10px rgba(255, 215, 0, 0.5),
            inset -3px -3px 8px rgba(0, 0, 0, 0.3)
          `,
          zIndex: 1
        }}
      >
        {/* Io Surface Details */}
        <Box sx={{
          position: 'absolute',
          top: '30%',
          left: '25%',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'rgba(184, 134, 11, 0.7)',
          boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          left: '60%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(139, 69, 19, 0.8)',
          boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
        }} />
      </motion.div>

      <motion.div
        
        animate={{ 
          opacity: 0.6,
          scale: 1,
          x: [0, -40, 0],
          y: [0, -35, 0]
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        style={{
          position: 'absolute',
          top: '15%',
          right: '35%',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 40% 40%, #87CEEB, #4682B4, #2F4F4F),
            radial-gradient(circle at 60% 60%, #4682B4, #2F4F4F, #1C1C1C)
          `,
          boxShadow: `
            0 0 8px rgba(135, 206, 235, 0.4),
            inset -2px -2px 6px rgba(0, 0, 0, 0.3)
          `,
          zIndex: 1
        }}
      >
        {/* Europa Surface Details */}
        <Box sx={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(70, 130, 180, 0.8)',
          boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
        }} />
      </motion.div>

      <motion.div
        
        animate={{ 
          opacity: 0.5,
          scale: 1,
          x: [0, 45, 0],
          y: [0, -40, 0]
        }}
        transition={{ 
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10
        }}
        style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 40% 40%, #C0C0C0, #A0A0A0, #808080),
            radial-gradient(circle at 60% 60%, #A0A0A0, #808080, #606060)
          `,
          boxShadow: `
            0 0 12px rgba(192, 192, 192, 0.4),
            inset -3px -3px 8px rgba(0, 0, 0, 0.3)
          `,
          zIndex: 1
        }}
      >
        {/* Ganymede Surface Details */}
        <Box sx={{
          position: 'absolute',
          top: '25%',
          left: '20%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(128, 128, 128, 0.7)',
          boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '55%',
          left: '65%',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'rgba(96, 96, 96, 0.8)',
          boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
        }} />
      </motion.div>

      <motion.div
        
        animate={{ 
          opacity: 0.4,
          scale: 1,
          x: [0, -35, 0],
          y: [0, -45, 0]
        }}
        transition={{ 
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 15
        }}
        style={{
          position: 'absolute',
          top: '25%',
          right: '40%',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 40% 40%, #8B4513, #654321, #3E2723),
            radial-gradient(circle at 60% 60%, #654321, #3E2723, #1B1B1B)
          `,
          boxShadow: `
            0 0 6px rgba(139, 69, 19, 0.3),
            inset -2px -2px 6px rgba(0, 0, 0, 0.3)
          `,
          zIndex: 1
        }}
      >
        {/* Callisto Surface Details */}
        <Box sx={{
          position: 'absolute',
          top: '35%',
          left: '25%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(101, 67, 33, 0.8)',
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
              color: '#DAA520',
              borderColor: '#DAA520',
              '&:hover': {
                borderColor: '#DAA520',
                backgroundColor: 'rgba(218, 165, 32, 0.1)',
                boxShadow: '0 0 20px rgba(218, 165, 32, 0.3)'
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
              <Crown size={48} color="#DAA520" />
              <Typography variant="h2" sx={{ ml: 2, fontWeight: 700, color: '#DAA520' }}>
                {jupiterInfo.name}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
              {jupiterInfo.mythology}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, maxWidth: '600px', mx: 'auto' }}>
              {jupiterInfo.description}
            </Typography>
          </Box>
        </motion.div>

        {/* Jupiter in Gates */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #DAA520',
            boxShadow: '0 8px 32px rgba(218, 165, 32, 0.2)',
            p: 3,
            mb: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Target size={24} color="#DAA520" />
                <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                  Jupiter in den Gates
                </Typography>
              </Box>
              <Chip 
                label="Gates 1-8 von 64" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(218,165,32,0.2)',
                  color: '#DAA520',
                  fontSize: '10px'
                }} 
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
              Hier sind die ersten 8 Gates mit Jupiter-Informationen. Jupiter zeigt unsere Expansion und Weisheit in jedem Gate.
            </Typography>
            <List>
              {jupiterInGates.map((gate, index) => (
                <Accordion key={index} sx={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  mb: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown sx={{ color: '#DAA520' }} />}
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
                        background: 'linear-gradient(45deg, #DAA520, #B8860B)',
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
                          {gate.expansion}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={gate.wisdom} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(218,165,32,0.2)',
                        color: '#DAA520',
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
                        background: 'rgba(218,165,32,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(218,165,32,0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#DAA520', fontWeight: 600, mb: 1 }}>
                          Expansions-Affirmation:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {gate.expansionAffirmation}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Card>
        </motion.div>

        {/* Jupiter in Centers */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #DAA520',
            boxShadow: '0 8px 32px rgba(218, 165, 32, 0.2)',
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Crown size={24} color="#DAA520" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                Jupiter in den Centers
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
              Jupiter in den 9 Centers zeigt, wo unsere Expansion und Weisheit am stärksten wirken.
            </Typography>
            <List>
              {jupiterInCenters.map((center, index) => (
                <Accordion key={index} sx={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  mb: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown sx={{ color: '#DAA520' }} />}
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
                        background: 'linear-gradient(45deg, #DAA520, #B8860B)',
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
                          {center.expansion}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={center.wisdom} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(218,165,32,0.2)',
                        color: '#DAA520',
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
                        background: 'rgba(218,165,32,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(218,165,32,0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#DAA520', fontWeight: 600, mb: 1 }}>
                          Expansions-Affirmation:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {center.expansionAffirmation}
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
