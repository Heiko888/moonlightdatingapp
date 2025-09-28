'use client';

import React, { useState, useEffect } from 'react';
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
// import { useChironData } from '../../../hooks/useChironData'; // Hook wurde entfernt

interface ChironGate {
  gate_number?: number;
  gate?: number;
  name?: string;
  description?: string;
  deepMeaning?: string;
  shadowAspects?: string[];
  gifts?: string[];
  healingAffirmation?: string;
}

interface ChironCenter {
  center_name?: string;
  description?: string;
  shadowAspects?: string[];
  gifts?: string[];
}

export default function ChironPage() {
  const router = useRouter();
  const [expandedGate, setExpandedGate] = useState<number | false>(false);
  
  // Verwende den usePlanetData Hook für alle 64 Gates
  // const { chironInfo, chironGates, chironCenters, loading, error } = useChironData(); // Hook wurde entfernt
  const chironInfo = null;
  const chironGates = [];
  const chironCenters = [];
  const loading = false;
  const error = null;

  // Loading und Error States
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0B0D12 0%, #1A1F2B 50%, #2D3748 100%)',
        color: 'white'
      }}>
        <Typography variant="h4">Lade Chiron-Daten...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0B0D12 0%, #1A1F2B 50%, #2D3748 100%)',
        color: 'white'
      }}>
        <Typography variant="h4">Fehler beim Laden der Daten: {error}</Typography>
      </Box>
    );
  }

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
          radial-gradient(2px 2px at 20px 30px, #FF6B6B, transparent),
          radial-gradient(2px 2px at 40px 70px, #FF6B6B, transparent),
          radial-gradient(1px 1px at 90px 40px, #FF6B6B, transparent),
          radial-gradient(1px 1px at 130px 80px, #FF6B6B, transparent),
          radial-gradient(2px 2px at 160px 30px, #FF6B6B, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        animation: 'twinkle 4s ease-in-out infinite alternate'
      }} />

      {/* Animated Neptune */}
          <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
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
            radial-gradient(circle at 30% 30%, #FF6B6B, #FF4444, #CC0000),
            radial-gradient(circle at 70% 70%, #FF4444, #CC0000, #990000),
            radial-gradient(circle at 50% 50%, #FFAAAA, #FF6B6B)
          `,
          boxShadow: `
            0 0 40px rgba(255, 107, 107, 0.5),
            0 0 80px rgba(255, 68, 68, 0.4),
            0 0 120px rgba(204, 0, 0, 0.3),
            inset -15px -15px 30px rgba(153, 0, 0, 0.3)
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
          background: 'rgba(255, 68, 68, 0.6)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          left: '65%',
          width: '20px',
          height: '12px',
          borderRadius: '50%',
          background: 'rgba(255, 107, 107, 0.7)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '45%',
          left: '10%',
          width: '30px',
          height: '18px',
          borderRadius: '50%',
          background: 'rgba(204, 0, 0, 0.5)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '70%',
          left: '30%',
          width: '18px',
          height: '10px',
          borderRadius: '50%',
          background: 'rgba(255, 68, 68, 0.8)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '35%',
          left: '75%',
          width: '22px',
          height: '14px',
          borderRadius: '50%',
          background: 'rgba(255, 107, 107, 0.6)',
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
          border: '2px solid rgba(255, 107, 107, 0.3)',
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
          border: '1px solid rgba(255, 68, 68, 0.2)',
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
          background: '#FF6B6B',
          boxShadow: '0 0 12px rgba(255, 107, 107, 0.6)',
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
          background: '#FF4444',
          boxShadow: '0 0 10px rgba(255, 68, 68, 0.5)',
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
          background: '#FFAAAA',
          boxShadow: '0 0 15px rgba(255, 170, 170, 0.4)',
          zIndex: 0
        }}
      />

      {/* Neptune's Moon Triton */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
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
            radial-gradient(circle at 40% 40%, #FFCCCC, #FFAAAA, #FF6B6B),
            radial-gradient(circle at 60% 60%, #FFAAAA, #FF6B6B, #CC0000)
          `,
          boxShadow: `
            0 0 15px rgba(255, 204, 204, 0.4),
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
          background: 'rgba(255, 107, 107, 0.6)',
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
              color: '#FF6B6B',
              borderColor: '#FF6B6B',
                '&:hover': {
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)'
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Heart size={48} color="#FF6B6B" />
              <Typography variant="h2" sx={{ ml: 2, fontWeight: 700, color: '#FF6B6B' }}>
                {chironInfo?.name || 'Chiron'}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
              {chironInfo?.description || 'Der verwundete Heiler'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, maxWidth: '600px', mx: 'auto' }}>
              {chironInfo?.description || 'Chiron repräsentiert unsere Wunden und unsere Fähigkeit zur Heilung.'}
            </Typography>
          </Box>
        </motion.div>

        {/* Neptune Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #FF6B6B',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.2)',
            p: 4,
            mb: 4
          }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h1" sx={{ color: '#FF6B6B', mb: 2 }}>
                    {chironInfo?.symbol || '⚷'}
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                    {chironInfo?.name || 'Chiron'}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#FF6B6B', mb: 3 }}>
                    {chironInfo?.description || 'Der verwundete Heiler'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, lineHeight: 1.6 }}>
                    {chironInfo?.description || 'Chiron repräsentiert unsere Wunden und unsere Fähigkeit zur Heilung.'}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Orbitalperiode
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#FF6B6B' }}>
                          50.7 Jahre
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Entdeckung
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#FF6B6B' }}>
                          1977
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card sx={{
                background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
            border: '1px solid #FF6B6B',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.2)',
                p: 3,
            mb: 4
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Target size={24} color="#FF6B6B" />
                    <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                      Chiron in den Gates
                    </Typography>
                  </Box>
                  <Chip 
                label="Gates 1-8 von 64" 
                    size="small" 
                    sx={{ 
                  backgroundColor: 'rgba(65,105,225,0.2)',
                  color: '#FF6B6B',
                      fontSize: '10px'
                    }} 
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
              Hier sind alle 64 Gates mit Chiron-Informationen. Chiron zeigt unsere Wunden und Heilung in jedem Gate.
                </Typography>
            <List>
              {chironGates.map((gate: any, index: number) => (
                    <Accordion key={index} sx={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      mb: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown color="#FF6B6B" />}
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
                        background: 'linear-gradient(45deg, #FF6B6B, #FF4444)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000' }}>
                            {gate?.gate_number || gate?.gate || 'Gate'}
                        </Typography>
                      </Box>
                          <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {gate?.name || `Gate ${gate?.gate_number || 'Unbekannt'}`}
                            </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {gate?.description || 'Chiron Heilung'}
                        </Typography>
                          </Box>
                        </Box>
                    <Chip 
                      label="Chiron Heilung" 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(255,107,107,0.2)',
                        color: '#FF6B6B',
                        fontSize: '10px'
                      }} 
                    />
                      </AccordionSummary>
                      <AccordionDetails>
                    <Box sx={{ pl: 6 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                          {gate?.description || 'Beschreibung wird geladen...'}
                        </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, fontWeight: 500 }}>
                          {gate?.deepMeaning || 'Tiefere Bedeutung wird geladen...'}
                        </Typography>
                        
                        {/* Chiron bewusst Text */}
                        <Box sx={{ 
                          p: 3, 
                          background: 'rgba(255,107,107,0.1)', 
                          borderRadius: 2, 
                          border: '1px solid rgba(255,107,107,0.3)',
                          mb: 2
                        }}>
                          <Typography variant="h6" sx={{ color: '#FF6B6B', mb: 2, fontWeight: 600 }}>
                            🌌 Chiron bewusst – Tor {gate?.gate_number || gate?.gate || 'Unbekannt'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, mb: 2, whiteSpace: 'pre-line' }}>
                            {gate?.deep_meaning || gate?.deepMeaning || 'Detaillierte Chiron-Informationen werden geladen...'}
                          </Typography>
                        </Box>
                        
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#FF6B6B', mb: 1, fontWeight: 600 }}>
                                Schatten-Aspekte:
                              </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {gate?.shadowAspects && Array.isArray(gate.shadowAspects) ? gate.shadowAspects.map((aspect: string, idx: number) => (
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
                              )) : (
                                <Chip 
                                  label="Chiron Wunde" 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: 'rgba(255,107,107,0.2)',
                                    color: '#FF6B6B',
                                    fontSize: '10px'
                                  }} 
                                />
                              )}
                            </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#4CAF50', mb: 1, fontWeight: 600 }}>
                                Geschenke:
                              </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {gate?.gifts && Array.isArray(gate.gifts) ? gate.gifts.map((gift: string, idx: number) => (
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
                              )) : (
                                <Chip 
                                  label="Chiron Heilung" 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: 'rgba(76,175,80,0.2)',
                                    color: '#4CAF50',
                                    fontSize: '10px'
                                  }} 
                                />
                              )}
                            </Box>
                      </Box>

                      <Box sx={{ 
                        p: 2, 
                        background: 'rgba(65,105,225,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(65,105,225,0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#FF6B6B', fontWeight: 600, mb: 1 }}>
                          Heilungs-Affirmation:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {gate?.healingAffirmation || "Ich heile meine Wunden und entwickle Chiron-Heilung. Meine Wunden sind meine größten Lehrer."}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card sx={{
                background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
            border: '1px solid #FF6B6B',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.2)',
            p: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Crown size={24} color="#FF6B6B" />
                  <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                Chiron in den Zentren
                  </Typography>
                </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
              Chiron in den 9 Zentren zeigt, wo unsere Wunden und Heilung am stärksten wirken.
            </Typography>
                <List>
              {chironCenters.map((center: any, index: number) => (
                    <Accordion key={index} sx={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      mb: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown color="#FF6B6B" />}
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
                        background: 'linear-gradient(45deg, #FF6B6B, #FF4444)',
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
                        color: '#FF6B6B',
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
                              {center?.shadowAspects && Array.isArray(center.shadowAspects) ? center.shadowAspects.map((aspect: string, idx: number) => (
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
                              )) : (
                                <Chip 
                                  label="Chiron Wunde" 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: 'rgba(255,107,107,0.2)',
                                    color: '#FF6B6B',
                                    fontSize: '10px'
                                  }} 
                                />
                              )}
            </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#4CAF50', mb: 1, fontWeight: 600 }}>
                          Geschenke:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {center?.gifts && Array.isArray(center.gifts) ? center.gifts.map((gift: string, idx: number) => (
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
                              )) : (
                                <Chip 
                                  label="Chiron Heilung" 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: 'rgba(76,175,80,0.2)',
                                    color: '#4CAF50',
                                    fontSize: '10px'
                                  }} 
                                />
                              )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ 
                        p: 2, 
                        background: 'rgba(65,105,225,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(65,105,225,0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#FF6B6B', fontWeight: 600, mb: 1 }}>
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
