'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  Grid, 
  Chip, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Target, 
  Crown,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlanetData } from '../../../hooks/usePlanetData';

export default function UranusPage() {
  const router = useRouter();
  
  // Lade Uranus-Daten aus der Datenbank
  const { planetInfo, planetGates, planetCenters, loading, error } = usePlanetData('Uranus');

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
        <Typography variant="h4">Lade Uranus-Daten...</Typography>
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


  // Fallback-Daten falls Datenbank nicht verfügbar
  const fallbackUranusInfo = {
    planet_name: "Uranus",
    symbol: "♅",
    orbital_period: "84.0 Jahre",
    discovery: "1781",
    mythology: "Der Revolutionär",
    color: "#00CED1",
    description: "Uranus repräsentiert Revolution, Innovation und Veränderung. Er zeigt, wo wir rebellieren, Neues erschaffen und revolutionäre Ideen entwickeln."
  };


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
          radial-gradient(2px 2px at 20px 30px, #00CED1, transparent),
          radial-gradient(2px 2px at 40px 70px, #00CED1, transparent),
          radial-gradient(1px 1px at 90px 40px, #00CED1, transparent),
          radial-gradient(1px 1px at 130px 80px, #00CED1, transparent),
          radial-gradient(2px 2px at 160px 30px, #00CED1, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        animation: 'twinkle 4s ease-in-out infinite alternate'
      }} />

      {/* Animated Uranus */}
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
            radial-gradient(circle at 30% 30%, #00CED1, #20B2AA, #008B8B),
            radial-gradient(circle at 70% 70%, #20B2AA, #008B8B, #2F4F4F),
            radial-gradient(circle at 50% 50%, #AFEEEE, #00CED1)
          `,
          boxShadow: `
            0 0 40px rgba(0, 206, 209, 0.5),
            0 0 80px rgba(32, 178, 170, 0.4),
            0 0 120px rgba(0, 139, 139, 0.3),
            inset -15px -15px 30px rgba(47, 79, 79, 0.3)
          `,
          zIndex: 0
        }}
      >
        {/* Uranus Surface Details - Storm Systems */}
        <Box sx={{
          position: 'absolute',
          top: '25%',
          left: '20%',
          width: '25px',
          height: '15px',
          borderRadius: '50%',
          background: 'rgba(32, 178, 170, 0.6)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          left: '65%',
          width: '20px',
          height: '12px',
          borderRadius: '50%',
          background: 'rgba(0, 206, 209, 0.7)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '45%',
          left: '10%',
          width: '30px',
          height: '18px',
          borderRadius: '50%',
          background: 'rgba(0, 139, 139, 0.5)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '70%',
          left: '30%',
          width: '18px',
          height: '10px',
          borderRadius: '50%',
          background: 'rgba(32, 178, 170, 0.8)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '35%',
          left: '75%',
          width: '22px',
          height: '14px',
          borderRadius: '50%',
          background: 'rgba(0, 206, 209, 0.6)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
        }} />
      </motion.div>

      {/* Uranus's Rings */}
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
          border: '2px solid rgba(0, 206, 209, 0.3)',
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
          border: '1px solid rgba(32, 178, 170, 0.2)',
          zIndex: -2
        }}
      />

      {/* Revolutionary Energy Waves */}
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
          background: '#00CED1',
          boxShadow: '0 0 12px rgba(0, 206, 209, 0.6)',
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
          background: '#20B2AA',
          boxShadow: '0 0 10px rgba(32, 178, 170, 0.5)',
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
          background: '#AFEEEE',
          boxShadow: '0 0 15px rgba(175, 238, 238, 0.4)',
          zIndex: 0
        }}
      />

      {/* Uranus's Moon Miranda */}
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
            radial-gradient(circle at 40% 40%, #E0FFFF, #AFEEEE, #00CED1),
            radial-gradient(circle at 60% 60%, #AFEEEE, #00CED1, #008B8B)
          `,
          boxShadow: `
            0 0 15px rgba(224, 255, 255, 0.4),
            inset -3px -3px 8px rgba(0, 0, 0, 0.3)
          `,
          zIndex: 1
        }}
      >
        {/* Miranda Surface Details */}
        <Box sx={{
          position: 'absolute',
          top: '30%',
          left: '25%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(0, 206, 209, 0.6)',
          boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          left: '60%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(32, 178, 170, 0.7)',
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
              color: '#00CED1',
              borderColor: '#00CED1',
              '&:hover': {
                borderColor: '#00CED1',
                backgroundColor: 'rgba(0, 206, 209, 0.1)',
                boxShadow: '0 0 20px rgba(0, 206, 209, 0.3)'
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
              <Typography variant="h1" sx={{ color: '#00CED1', mr: 2, fontSize: '3rem' }}>
                {planetInfo?.symbol || fallbackUranusInfo.symbol}
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 700, color: '#00CED1' }}>
                {planetInfo?.planet_name || fallbackUranusInfo.planet_name}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
              {planetInfo?.mythology || fallbackUranusInfo.mythology}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, maxWidth: '600px', mx: 'auto' }}>
              {planetInfo?.description || fallbackUranusInfo.description}
            </Typography>
          </Box>
        </motion.div>

        {/* Uranus Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #00CED1',
            boxShadow: '0 8px 32px rgba(0, 206, 209, 0.2)',
            p: 4,
            mb: 4
          }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h1" sx={{ color: planetInfo?.color || fallbackUranusInfo.color, mb: 2 }}>
                    {planetInfo?.symbol || fallbackUranusInfo.symbol}
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                    {planetInfo?.planet_name || fallbackUranusInfo.planet_name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: planetInfo?.color || fallbackUranusInfo.color, mb: 3 }}>
                    {planetInfo?.mythology || fallbackUranusInfo.mythology}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, lineHeight: 1.6 }}>
                    {planetInfo?.description || fallbackUranusInfo.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Orbitalperiode
                        </Typography>
                        <Typography variant="h6" sx={{ color: planetInfo?.color || fallbackUranusInfo.color }}>
                          {planetInfo?.orbital_period || fallbackUranusInfo.orbital_period}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Entdeckung
                        </Typography>
                        <Typography variant="h6" sx={{ color: planetInfo?.color || fallbackUranusInfo.color }}>
                          {planetInfo?.discovery || fallbackUranusInfo.discovery}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </motion.div>

        {/* Uranus in Gates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #00CED1',
            boxShadow: '0 8px 32px rgba(0, 206, 209, 0.2)',
            p: 3,
            mb: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Target size={24} color="#00CED1" />
                <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                  Uranus in den Gates
                </Typography>
              </Box>
              <Chip 
                label="Gates 1-8 von 64" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(0,206,209,0.2)',
                  color: '#00CED1',
                  fontSize: '10px'
                }} 
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
              Hier sind alle 64 Gates mit Uranus-Informationen. Uranus zeigt unsere Revolution und Innovation in jedem Gate.
            </Typography>
            <List>
              {planetGates?.map((gate, index) => (
                <Accordion key={index} sx={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  mb: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown color="#00CED1" />}
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
                        background: 'linear-gradient(45deg, #00CED1, #20B2AA)',
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
                          {gate.name || `Gate ${gate.gate_number}`}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {gate.description || 'Uranus Revolution'}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label="Revolution" 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(0,206,209,0.2)',
                        color: '#00CED1',
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
                        {gate.description || 'Uranus Revolution und Innovation'}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#FF6B6B', mb: 1, fontWeight: 600 }}>
                          Schatten-Aspekte:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {gate.shadow_aspects ? (typeof gate.shadow_aspects === 'string' ? JSON.parse(gate.shadow_aspects) : gate.shadow_aspects).map((aspect: string, idx: number) => (
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
                              label="Revolutionäre Blockaden" 
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
                          {gate.gifts ? (typeof gate.gifts === 'string' ? JSON.parse(gate.gifts) : gate.gifts).map((gift: string, idx: number) => (
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
                              label="Revolutionäre Innovation" 
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
                        background: 'rgba(0,206,209,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(0,206,209,0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#00CED1', fontWeight: 600, mb: 1 }}>
                          Revolutions-Affirmation:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {gate.affirmation || 'Ich revolutioniere bewusst und entwickle innovative Lösungen. Meine Revolution ist transformativ.'}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Card>
        </motion.div>

        {/* Uranus in Centers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #00CED1',
            boxShadow: '0 8px 32px rgba(0, 206, 209, 0.2)',
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Crown size={24} color="#00CED1" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                Uranus in den Centers
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontStyle: 'italic' }}>
              Uranus in den 9 Centers zeigt, wo unsere Revolution und Innovation am stärksten wirken.
            </Typography>
            <List>
              {planetCenters?.map((center, index) => (
                <Accordion key={index} sx={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  mb: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown color="#00CED1" />}
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
                        background: 'linear-gradient(45deg, #00CED1, #20B2AA)',
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
                          {center.description || 'Uranus Revolution'}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label="Innovation" 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(0,206,209,0.2)',
                        color: '#00CED1',
                        fontSize: '10px'
                      }} 
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ pl: 6 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        {center.description || 'Uranus Revolution in diesem Center'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, fontWeight: 500 }}>
                        {center.description || 'Uranus Revolution und Innovation in diesem Center'}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#FF6B6B', mb: 1, fontWeight: 600 }}>
                          Schatten-Aspekte:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {center.shadow_aspects ? (typeof center.shadow_aspects === 'string' ? JSON.parse(center.shadow_aspects) : center.shadow_aspects).map((aspect: string, idx: number) => (
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
                              label="Revolutionäre Blockaden" 
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
                          {center.gifts ? (typeof center.gifts === 'string' ? JSON.parse(center.gifts) : center.gifts).map((gift: string, idx: number) => (
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
                              label="Revolutionäre Innovation" 
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
                        background: 'rgba(0,206,209,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(0,206,209,0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#00CED1', fontWeight: 600, mb: 1 }}>
                          Revolutions-Affirmation:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {center.affirmation || 'Ich revolutioniere bewusst in diesem Center und entwickle innovative Lösungen. Meine Revolution ist transformativ.'}
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
