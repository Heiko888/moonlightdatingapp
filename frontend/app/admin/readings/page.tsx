'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  Avatar,
  IconButton,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Type,
  Eye,
  BarChart3,
  Grid as GridIcon,
} from 'lucide-react';
import Link from 'next/link';
import AnimatedStars from '../../../components/AnimatedStars';
import TextSelectorDialog from './components/TextSelectorDialog';
import LivePreviewDialog from './components/LivePreviewDialog';

// Human Design Profile Interface
interface HumanDesignProfile {
  type: 'Manifestor' | 'Generator' | 'Projector' | 'Reflektor';
  profile: string;
  authority: string;
  definition: string;
  strategy: string;
  notSelf: string;
  incarnationCross: string;
  gates: Array<{
    number: number;
    name: string;
    planet: string;
    line: number;
    color: number;
    tone: number;
    base: number;
  }>;
  channels: Array<{
    number: string;
    name: string;
    gates: [number, number];
    circuit: string;
  }>;
  centers: {
    defined: string[];
    undefined: string[];
    open: string[];
  };
  variables: {
    determination: string;
    cognition: string;
    environment: string;
    motivation: string;
  };
}

// Reading Interface
interface Reading {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  scope: string;
  content: string;
  reflectionQuestions?: string[];
  generationMethod: 'simple' | 'AI-powered' | 'PDF-enhanced';
  status: 'draft' | 'completed' | 'delivered';
  createdAt: string;
  updatedAt: string;
  chartData?: unknown;
  userProfile?: HumanDesignProfile;
  tags: string[];
  sources: string[];
  summary: string;
  method: string;
  type?: string;
  clientName?: string;
  date?: string;
  clientEmail?: string;
}

// Mock-Daten für Readings
const mockReadings: Reading[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Müller',
    userEmail: 'sarah.mueller@example.com',
    title: 'Beziehungs-Reading für Sarah - Kompatibilität',
    scope: 'relationship',
    method: 'AI-powered',
    type: 'Beziehungs-Reading',
    clientName: 'Sarah Müller',
    date: '2024-01-15',
    userProfile: {
      type: 'Generator',
      profile: '2/4',
      authority: 'Sacral',
      definition: 'Single Definition',
      strategy: 'To Respond',
      notSelf: 'Frustration',
      incarnationCross: 'Right Angle Cross of the Sphinx',
      gates: [
        { number: 1, name: 'The Creative', planet: 'Sun', line: 2, color: 4, tone: 6, base: 3 },
        { number: 8, name: 'Contribution', planet: 'Earth', line: 4, color: 2, tone: 1, base: 6 },
        { number: 14, name: 'Power', planet: 'Mercury', line: 1, color: 3, tone: 2, base: 4 },
        { number: 26, name: 'The Egoist', planet: 'Venus', line: 3, color: 1, tone: 5, base: 2 }
      ],
      channels: [
        { number: '1-8', name: 'Channel of Inspiration', gates: [1, 8], circuit: 'Individual' },
        { number: '14-2', name: 'Channel of the Beat', gates: [14, 2], circuit: 'Individual' }
      ],
      centers: {
        defined: ['G', 'Sacral', 'Spleen', 'Root'],
        undefined: ['Head', 'Ajna', 'Throat', 'Heart'],
        open: ['Solar Plexus']
      },
      variables: {
        determination: 'High',
        cognition: 'Smell',
        environment: 'Caves',
        motivation: 'Hope'
      }
    },
    content: 'Ein tiefgreifendes Reading über Beziehungsdynamiken und Kompatibilität...',
    reflectionQuestions: [
      'Wie fühlt sich deine aktuelle Beziehung an?',
      'Welche Muster erkennst du in deinen Beziehungen?'
    ],
    generationMethod: 'AI-powered',
    status: 'completed',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    tags: ['Beziehung', 'Kompatibilität', 'Generator'],
    sources: ['Human Design Chart', 'AI Analysis'],
    summary: 'Umfassende Analyse der Beziehungsdynamiken und Kompatibilitätsfaktoren'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Michael Weber',
    userEmail: 'michael.weber@example.com',
    title: 'Karriere-Reading für Michael - Berufung finden',
    scope: 'career',
    method: 'PDF-enhanced',
    type: 'Karriere-Reading',
    clientName: 'Michael Weber',
    date: '2024-01-14',
    userProfile: {
      type: 'Projector',
      profile: '5/1',
      authority: 'Splenic',
      definition: 'Split Definition',
      strategy: 'Wait for the Invitation',
      notSelf: 'Bitterness',
      incarnationCross: 'Left Angle Cross of the Vessel of Love',
      gates: [
        { number: 3, name: 'Ordering', planet: 'Sun', line: 1, color: 2, tone: 3, base: 4 },
        { number: 60, name: 'Limitation', planet: 'Mercury', line: 5, color: 1, tone: 6, base: 2 }
      ],
      channels: [
        { number: '3-60', name: 'Channel of Mutation', gates: [3, 60], circuit: 'Individual' }
      ],
      centers: {
        defined: ['Spleen', 'Root'],
        undefined: ['Head', 'Ajna', 'Throat', 'G', 'Heart', 'Solar Plexus', 'Sacral'],
        open: []
      },
      variables: {
        determination: 'Low',
        cognition: 'Taste',
        environment: 'Valleys',
        motivation: 'Guilt'
      }
    },
    content: 'Eine detaillierte Analyse der beruflichen Bestimmung und Karrierewege...',
    reflectionQuestions: [
      'Was ist deine wahre Berufung?',
      'Welche Talente bleiben ungenutzt?'
    ],
    generationMethod: 'PDF-enhanced',
    status: 'draft',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
    tags: ['Karriere', 'Berufung', 'Projector'],
    sources: ['PDF Upload', 'Chart Analysis'],
    summary: 'Tiefgreifende Karriereberatung basierend auf Human Design Prinzipien'
  }
];

// Hauptkomponente
export default function AdminReadingsPage() {
  // State-Variablen
  const [readings] = useState<Reading[]>(mockReadings);
  const [filteredReadings, setFilteredReadings] = useState<Reading[]>(mockReadings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  
  // State für Dialoge
  const [textSelectorOpen, setTextSelectorOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [realtimePreview, setRealtimePreview] = useState(false);
  const [selectedReadingForPreview, setSelectedReadingForPreview] = useState<Reading | null>(null);

  // Filter-Funktionen
  useEffect(() => {
    let filtered = readings;
    
    if (searchTerm) {
      filtered = filtered.filter(reading =>
        reading.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(reading => reading.status === filterStatus);
    }
    
    setFilteredReadings(filtered);
  }, [readings, searchTerm, filterStatus]);

  // Handler-Funktionen
  const handleOpenTextSelector = (reading: Reading) => {
    setSelectedReading(reading);
    setTextSelectorOpen(true);
  };

  const handleCloseTextSelector = () => {
    setTextSelectorOpen(false);
    setSelectedReading(null);
  };

  const handleOpenRealtimePreview = (reading: Reading) => {
    setSelectedReadingForPreview(reading);
    setRealtimePreview(true);
  };

  const handleCloseRealtimePreview = () => {
    setRealtimePreview(false);
    setSelectedReadingForPreview(null);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 8, px: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ 
              fontWeight: 800, 
              color: '#fff', 
              mb: 2,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              Reading Management
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              mb: 4,
              fontWeight: 400
            }}>
              Verwalte und erstelle professionelle Human Design Readings
            </Typography>
            
            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Link href="/admin" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  ← Zurück zum Admin
                </Button>
              </Link>
            </Box>
          </Box>
        </motion.div>

        {/* Filter und Suche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)',
            borderRadius: 4, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Readings durchsuchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.8)'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.8)'
                      }
                    }}
                  >
                    <MenuItem value="all">Alle</MenuItem>
                    <MenuItem value="draft">Entwurf</MenuItem>
                    <MenuItem value="completed">Abgeschlossen</MenuItem>
                    <MenuItem value="delivered">Geliefert</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={viewMode === 'cards' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setViewMode('cards')}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        ...(viewMode === 'cards' && {
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          borderColor: 'rgba(102, 126, 234, 0.5)'
                        })
                      }}
                    >
                      <GridIcon size={16} style={{ marginRight: 8 }} />
                      Cards
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setViewMode('table')}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        ...(viewMode === 'table' && {
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          borderColor: 'rgba(102, 126, 234, 0.5)'
                        })
                      }}
                    >
                      <BarChart3 size={16} style={{ marginRight: 8 }} />
                      Tabelle
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reading Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Grid container spacing={3}>
            {filteredReadings.map((reading, index) => (
              <Grid item xs={12} sm={6} md={4} key={reading.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
                      opacity: 0.8
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      '&::before': {
                        opacity: 1
                      }
                    }
                  }}>
                    <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: 'linear-gradient(135deg, #667eea, #764ba2)',
                          width: 40,
                          height: 40,
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          mr: 2
                        }}>
                          {reading.userName.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ 
                            color: '#FFD700', 
                            fontWeight: 700,
                            mb: 0.5,
                            lineHeight: 1.2
                          }}>
                            {reading.title}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.8rem'
                          }}>
                            {reading.userName}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Content */}
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        mb: 2,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {reading.summary}
                      </Typography>
                      
                      {/* Human Design Profile */}
                      {reading.userProfile && (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={reading.userProfile.type} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                color: '#FFD700',
                                border: '1px solid rgba(255, 215, 0, 0.3)',
                                fontSize: '0.7rem',
                                fontWeight: 600
                              }} 
                            />
                            <Chip 
                              label={`Profile ${reading.userProfile.profile}`} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                color: '#22c55e',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                fontSize: '0.7rem'
                              }} 
                            />
                            <Chip 
                              label={reading.userProfile.authority} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                color: '#8b5cf6',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                fontSize: '0.7rem'
                              }} 
                            />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={`${reading.userProfile.gates.length} Gates`} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                color: '#3b82f6',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                fontSize: '0.6rem'
                              }} 
                            />
                            <Chip 
                              label={`${reading.userProfile.channels.length} Channels`} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                                color: '#a855f7',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                fontSize: '0.6rem'
                              }} 
                            />
                            <Chip 
                              label={reading.userProfile.incarnationCross.split(' ')[0]} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                                color: '#f59e0b',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                fontSize: '0.6rem'
                              }} 
                            />
                          </Box>
                        </Box>
                      )}
                      
                      {/* Tags */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          label={reading.scope} 
                          size="small" 
                          sx={{ 
                            backgroundColor: 'rgba(102, 126, 234, 0.2)',
                            color: '#667eea',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            fontSize: '0.7rem'
                          }} 
                        />
                        <Chip 
                          label={reading.method} 
                          size="small" 
                          sx={{ 
                            backgroundColor: 'rgba(236, 72, 153, 0.2)',
                            color: '#ec4899',
                            border: '1px solid rgba(236, 72, 153, 0.3)',
                            fontSize: '0.7rem'
                          }} 
                        />
                      </Box>
                      
                      {/* Status & Date */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={reading.status} 
                          size="small" 
                          sx={{ 
                            backgroundColor: reading.status === 'completed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: reading.status === 'completed' ? '#22c55e' : '#f59e0b',
                            border: reading.status === 'completed' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                            fontSize: '0.7rem'
                          }} 
                        />
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.7rem'
                        }}>
                          {new Date(reading.createdAt).toLocaleDateString('de-DE')}
                        </Typography>
                      </Box>
                      
                      {/* Actions */}
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenTextSelector(reading)}
                          sx={{ 
                            color: '#667eea',
                            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
                          }}
                          title="Text-Auswahl"
                        >
                          <Type size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenRealtimePreview(reading)}
                          sx={{ 
                            color: '#4caf50',
                            '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' }
                          }}
                          title="Live-Preview"
                        >
                          <Eye size={16} />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Dialoge */}
      <TextSelectorDialog
        open={textSelectorOpen}
        onClose={handleCloseTextSelector}
        selectedReading={selectedReading}
      />
      
      <LivePreviewDialog
        open={realtimePreview}
        onClose={handleCloseRealtimePreview}
        selectedReading={selectedReadingForPreview}
      />
    </Box>
  );
}
