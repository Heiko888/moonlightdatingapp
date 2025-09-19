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
import { usePlanetData } from '../../../hooks/usePlanetData';

export default function VenusPage() {
  const router = useRouter();
  const [expandedGate, setExpandedGate] = useState<number | false>(false);
  
  // Lade Venus-Daten aus der Datenbank
  const { planetInfo, planetGates, planetCenters, loading, error } = usePlanetData('Venus');

  // Fallback-Daten falls Datenbank nicht verfügbar
  const fallbackVenusInfo = {
    planet_name: "Venus",
    symbol: "♀",
    orbital_period: "225 Tage",
    discovery: "Seit Anbeginn der Zeit",
    mythology: "Die Göttin der Liebe",
    color: "#FFB6C1",
    description: "Venus repräsentiert Liebe, Schönheit und Werte. Sie zeigt, was wir schätzen und wie wir Beziehungen gestalten."
  };

  // Verwende Datenbank-Daten oder Fallback
  const currentVenusInfo = planetInfo || fallbackVenusInfo;

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0B0D12 0%, #1A1F2B 50%, #2D3748 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h4">Lade Venus-Daten...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0B0D12 0%, #1A1F2B 50%, #2D3748 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h4" color="error">Fehler: {error}</Typography>
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
          radial-gradient(2px 2px at 20px 30px, #FFB6C1, transparent),
          radial-gradient(2px 2px at 40px 70px, #FFB6C1, transparent),
          radial-gradient(1px 1px at 90px 40px, #FFB6C1, transparent),
          radial-gradient(1px 1px at 130px 80px, #FFB6C1, transparent),
          radial-gradient(2px 2px at 160px 30px, #FFB6C1, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        animation: 'twinkle 4s ease-in-out infinite alternate'
      }} />

      {/* Animated Venus */}
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
            radial-gradient(circle at 30% 30%, #FFB6C1, #FFC0CB, #FF69B4),
            radial-gradient(circle at 70% 70%, #FFC0CB, #FF69B4, #FF1493),
            radial-gradient(circle at 50% 50%, #DA70D6, #FFB6C1)
          `,
          boxShadow: `
            0 0 40px rgba(255, 182, 193, 0.5),
            0 0 80px rgba(255, 192, 203, 0.4),
            0 0 120px rgba(75, 0, 130, 0.3),
            inset -15px -15px 30px rgba(46, 8, 84, 0.3)
          `,
          zIndex: 0
        }}
      >
        {/* Venus Surface Details */}
        <Box sx={{
          position: 'absolute',
          top: '25%',
          left: '20%',
          width: '25px',
          height: '15px',
          borderRadius: '50%',
          background: 'rgba(255, 192, 203, 0.6)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          left: '65%',
          width: '20px',
          height: '12px',
          borderRadius: '50%',
          background: 'rgba(255, 182, 193, 0.7)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '45%',
          left: '10%',
          width: '30px',
          height: '18px',
          borderRadius: '50%',
          background: 'rgba(75, 0, 130, 0.5)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '70%',
          left: '30%',
          width: '18px',
          height: '10px',
          borderRadius: '50%',
          background: 'rgba(255, 192, 203, 0.8)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '35%',
          left: '75%',
          width: '22px',
          height: '14px',
          borderRadius: '50%',
          background: 'rgba(255, 182, 193, 0.6)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
      </motion.div>

      {/* Animierte Venus */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 30% 30%, #FFB6C1, #FFC0CB, #FF69B4),
            radial-gradient(circle at 70% 70%, #FFC0CB, #FF1493, #FFB6C1),
            radial-gradient(circle at 50% 50%, #FFB6C1, #FFC0CB)
          `,
          boxShadow: `
            0 0 30px rgba(255, 182, 193, 0.8),
            0 0 60px rgba(255, 192, 203, 0.6),
            0 0 90px rgba(255, 105, 180, 0.4),
            inset -5px -5px 15px rgba(255, 20, 147, 0.3)
          `,
          zIndex: 1
        }}
      >
        {/* Venus-Atmosphäre */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 182, 193, 0.3), transparent)',
            zIndex: -1
          }}
        />
        
        {/* Venus-Oberfläche Details */}
        <motion.div
          animate={{ 
            rotate: [0, -360],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ 
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            bottom: '10px',
            borderRadius: '50%',
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(255, 20, 147, 0.4), transparent),
              radial-gradient(ellipse at 80% 70%, rgba(255, 105, 180, 0.3), transparent),
              radial-gradient(ellipse at 50% 50%, rgba(255, 192, 203, 0.2), transparent)
            `,
            zIndex: 1
          }}
        />
      </motion.div>
      {/* Venus-Orbit Partikel */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          top: '40%',
          right: '10%',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#FFC0CB',
          boxShadow: '0 0 20px rgba(255, 192, 203, 0.6)',
          zIndex: 0
        }}
      />

      {/* Venus-Atmosphärenschicht */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 30, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          top: '8%',
          right: '12%',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 30% 30%, rgba(255, 182, 193, 0.4), rgba(255, 192, 203, 0.2)),
            radial-gradient(circle at 70% 70%, rgba(255, 105, 180, 0.3), rgba(255, 20, 147, 0.1))
          `,
          boxShadow: `
            0 0 25px rgba(255, 182, 193, 0.5),
            0 0 50px rgba(255, 192, 203, 0.3),
            inset -5px -5px 10px rgba(255, 20, 147, 0.2)
          `,
          zIndex: 0
        }}
      >
        {/* Venus-Atmosphären-Details */}
        <Box sx={{
          position: 'absolute',
          top: '30%',
          left: '25%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(255, 182, 193, 0.6)',
          boxShadow: 'inset 1px 1px 2px rgba(255, 20, 147, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          left: '60%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(255, 192, 203, 0.7)',
          boxShadow: 'inset 1px 1px 2px rgba(255, 20, 147, 0.3)'
        }} />
      </motion.div>

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/planets')}
            sx={{
              color: '#FFB6C1',
              borderColor: '#FFB6C1',
              '&:hover': {
                borderColor: '#FFB6C1',
                backgroundColor: 'rgba(255, 182, 193, 0.1)',
                boxShadow: '0 0 20px rgba(255, 182, 193, 0.3)'
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
              <Typography variant="h2" sx={{ mr: 2, fontWeight: 700, color: '#FFB6C1' }}>
                {currentVenusInfo.symbol}
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 700, color: '#FFB6C1' }}>
                {currentVenusInfo.planet_name}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
              {currentVenusInfo.mythology}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, maxWidth: '600px', mx: 'auto' }}>
              {currentVenusInfo.description}
            </Typography>
          </Box>
        </motion.div>

        {/* Overview Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #FFB6C1',
            boxShadow: '0 8px 32px rgba(255, 182, 193, 0.2)',
            p: 3,
            mb: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #FFB6C1, #FFC0CB)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Typography variant="h4" sx={{ color: '#000', fontWeight: 'bold' }}>
                  {currentVenusInfo.symbol}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                  {currentVenusInfo.planet_name} - Übersicht
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Grundlegende Informationen über {currentVenusInfo.planet_name}
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFB6C1', fontWeight: 600, mb: 1 }}>
                    Umlaufzeit
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {currentVenusInfo.orbital_period}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFB6C1', fontWeight: 600, mb: 1 }}>
                    Entdeckung
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {currentVenusInfo.discovery}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFB6C1', fontWeight: 600, mb: 1 }}>
                    Mythologie
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {currentVenusInfo.mythology}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFB6C1', fontWeight: 600, mb: 1 }}>
                    Farbe
                  </Typography>
                  <Box sx={{ 
                    width: 30, 
                    height: 30, 
                    borderRadius: '50%', 
                    backgroundColor: currentVenusInfo.color,
                    mx: 'auto',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }} />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </motion.div>

        {/* Venus in Gates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #FFB6C1',
            boxShadow: '0 8px 32px rgba(255, 182, 193, 0.2)',
            p: 3,
            mb: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Target size={24} color="#FFB6C1" />
                <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                  Venus in den Gates
                </Typography>
              </Box>
              <Chip 
                label={`${planetGates.length} Gates`} 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(139,0,139,0.2)',
                  color: '#FFB6C1',
                  fontSize: '10px'
                }} 
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
              Alle {planetGates.length} Gates mit Venus-Informationen. Venus zeigt unsere Liebe und Werte in jedem Gate.
            </Typography>
            <List>
              {planetGates.map((gate, index) => (
                <Accordion key={index} sx={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  mb: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown color="#FFB6C1" />}
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
                        background: 'linear-gradient(45deg, #FFB6C1, #FFC0CB)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000' }}>
                          {gate.gate_number}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {gate.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {gate.essence}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={gate.consciousness} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(139,0,139,0.2)',
                        color: '#FFB6C1',
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
                        {gate.deep_meaning}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#FF6B6B', mb: 1, fontWeight: 600 }}>
                          Schatten-Aspekte:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {JSON.parse(gate.shadow_aspects || '[]').map((aspect: string, idx: number) => (
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
                          {JSON.parse(gate.gifts || '[]').map((gift: string, idx: number) => (
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
                        background: 'rgba(139,0,139,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(139,0,139,0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#FFB6C1', fontWeight: 600, mb: 1 }}>
                          Affirmation:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {gate.affirmation}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Card>
        </motion.div>

        {/* Venus in Centers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #FFB6C1',
            boxShadow: '0 8px 32px rgba(255, 182, 193, 0.2)',
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Crown size={24} color="#FFB6C1" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                Venus in den Centers
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
              Venus in den {planetCenters.length} Centers zeigt, wo unsere Liebe und Werte am stärksten wirken.
            </Typography>
            <List>
              {planetCenters.map((center, index) => (
                <Accordion key={index} sx={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  mb: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown color="#FFB6C1" />}
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
                        background: 'linear-gradient(45deg, #FFB6C1, #FFC0CB)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        <Crown size={20} color="#000" />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {center.center_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {center.essence}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={center.consciousness} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(139,0,139,0.2)',
                        color: '#FFB6C1',
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
                        {center.deep_meaning}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#FF6B6B', mb: 1, fontWeight: 600 }}>
                          Schatten-Aspekte:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {JSON.parse(center.shadow_aspects || '[]').map((aspect: string, idx: number) => (
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
                          {JSON.parse(center.gifts || '[]').map((gift: string, idx: number) => (
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
                        background: 'rgba(139,0,139,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(139,0,139,0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#FFB6C1', fontWeight: 600, mb: 1 }}>
                          Affirmation:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {center.affirmation}
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
