"use client";
import React, { useState } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Switch, FormControlLabel, TextField, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import { Star, User, Heart, Brain, Crown, Target, Eye, Save, Download } from 'lucide-react';

interface CenterData {
  defined: boolean;
  color: string;
  gates: string[];
}

interface ChartData {
  hdType: string;
  profile: string;
  authority: string;
  strategy: string;
  centers: {
    [key: string]: CenterData;
  };
  channels: {
    [key: string]: {
      active: boolean;
      from: string;
      to: string;
      description: string;
      color: string;
    };
  };
  gates: {
    [key: string]: {
      active: boolean;
      center: string;
      description: string;
      color: string;
    };
  };
  planets: {
    [key: string]: {
      name: string;
      symbol: string;
      position: number;
      gate: string;
      line: number;
      color: string;
      description: string;
    };
  };
}

export default function ChartEditorPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [chartData, setChartData] = useState<ChartData>({
    hdType: 'Manifesting Generator',
    profile: '5/1',
    authority: 'Sacral',
    strategy: 'Wait to Respond',
    centers: {
      head: { defined: true, color: '#fbbf24', gates: ['1', '2', '3'] },
      ajna: { defined: true, color: '#8b5cf6', gates: ['4', '5', '6'] },
      throat: { defined: false, color: '#06b6d4', gates: [] },
      g: { defined: true, color: '#10b981', gates: ['7', '8', '9'] },
      heart: { defined: false, color: '#ef4444', gates: [] },
      spleen: { defined: true, color: '#f59e0b', gates: ['10', '11', '12'] },
      sacral: { defined: true, color: '#ec4899', gates: ['13', '14', '15'] },
      solar: { defined: false, color: '#f97316', gates: [] },
      root: { defined: true, color: '#84cc16', gates: ['16', '17', '18'] }
    },
    channels: {
      // Kopf-Zentrum Kanäle
      '1-8': { active: true, from: 'head', to: 'throat', description: 'Inspiration & Expression', color: '#fbbf24' },
      '2-14': { active: true, from: 'ajna', to: 'g', description: 'The Higher Mind & Direction', color: '#8b5cf6' },
      '4-63': { active: false, from: 'ajna', to: 'head', description: 'Mental Pressure & Doubt', color: '#8b5cf6' },
      '11-56': { active: false, from: 'ajna', to: 'throat', description: 'Curiosity & Discovery', color: '#8b5cf6' },
      '17-62': { active: false, from: 'ajna', to: 'throat', description: 'Acceptance & Organization', color: '#8b5cf6' },
      '24-61': { active: false, from: 'ajna', to: 'head', description: 'Awareness & Mystery', color: '#8b5cf6' },
      '47-64': { active: false, from: 'ajna', to: 'head', description: 'Abstraction & Confusion', color: '#8b5cf6' },
      
      // Ajna-Zentrum Kanäle
      '3-60': { active: false, from: 'sacral', to: 'root', description: 'Mutation & Innovation', color: '#ec4899' },
      '5-15': { active: false, from: 'g', to: 'throat', description: 'Rhythm & Timing', color: '#10b981' },
      '9-52': { active: false, from: 'sacral', to: 'root', description: 'Focus & Concentration', color: '#ec4899' },
      '16-48': { active: false, from: 'throat', to: 'spleen', description: 'The Wave Length & Depth', color: '#06b6d4' },
      '20-34': { active: true, from: 'throat', to: 'sacral', description: 'Charisma & Exploration', color: '#06b6d4' },
      '23-43': { active: false, from: 'throat', to: 'ajna', description: 'Structuring & Individuality', color: '#06b6d4' },
      '35-36': { active: false, from: 'throat', to: 'spleen', description: 'Transitoriness & Crisis', color: '#06b6d4' },
      
      // Kehlkopf-Zentrum Kanäle
      '6-59': { active: false, from: 'sacral', to: 'heart', description: 'Intimacy & Reproduction', color: '#ec4899' },
      '7-31': { active: false, from: 'throat', to: 'g', description: 'Leadership & Recognition', color: '#06b6d4' },
      '10-20': { active: true, from: 'g', to: 'throat', description: 'Self-Expression & Awakening', color: '#10b981' },
      '12-22': { active: false, from: 'throat', to: 'heart', description: 'Openness & Social Being', color: '#06b6d4' },
      '13-33': { active: false, from: 'throat', to: 'g', description: 'The Prodigal', color: '#06b6d4' },
      '14-2': { active: false, from: 'throat', to: 'g', description: 'The Beat', color: '#06b6d4' },
      '18-58': { active: false, from: 'throat', to: 'root', description: 'Judgment & Criticism', color: '#06b6d4' },
      '21-45': { active: false, from: 'throat', to: 'heart', description: 'The Money Line', color: '#06b6d4' },
      '25-51': { active: false, from: 'throat', to: 'heart', description: 'Initiation & Competition', color: '#06b6d4' },
      '26-44': { active: false, from: 'throat', to: 'spleen', description: 'Surrender & Acceptance', color: '#06b6d4' },
      '27-50': { active: false, from: 'throat', to: 'spleen', description: 'Custodianship & Preservation', color: '#06b6d4' },
      '28-38': { active: false, from: 'throat', to: 'root', description: 'Struggle & Purpose', color: '#06b6d4' },
      '29-46': { active: false, from: 'throat', to: 'g', description: 'Discovery & Success', color: '#06b6d4' },
      '30-41': { active: false, from: 'throat', to: 'root', description: 'Recognition & Fantasy', color: '#06b6d4' },
      '32-54': { active: false, from: 'throat', to: 'root', description: 'Transformation & Ambition', color: '#06b6d4' },
      '37-40': { active: false, from: 'throat', to: 'heart', description: 'Community & Aloneness', color: '#06b6d4' },
      '39-55': { active: false, from: 'throat', to: 'root', description: 'Emotion & Spirit', color: '#06b6d4' },
      '42-53': { active: false, from: 'throat', to: 'root', description: 'Maturation & Beginnings', color: '#06b6d4' },
      '48-16': { active: false, from: 'throat', to: 'spleen', description: 'The Wave Length & Depth', color: '#06b6d4' },
      '49-19': { active: false, from: 'throat', to: 'root', description: 'Synthesis & Sensitivity', color: '#06b6d4' },
      '57-20': { active: false, from: 'throat', to: 'spleen', description: 'Intuitive Insight & The Now', color: '#06b6d4' },
      '61-24': { active: false, from: 'head', to: 'ajna', description: 'Awareness & Mystery', color: '#fbbf24' },
      '62-17': { active: false, from: 'throat', to: 'ajna', description: 'Acceptance & Organization', color: '#06b6d4' },
      '63-4': { active: false, from: 'head', to: 'ajna', description: 'Mental Pressure & Doubt', color: '#fbbf24' },
      '64-47': { active: false, from: 'head', to: 'ajna', description: 'Abstraction & Confusion', color: '#fbbf24' }
    },
    gates: {
      // Kopf-Zentrum Tore
      '1': { active: true, center: 'head', description: 'The Creative', color: '#fbbf24' },
      '2': { active: true, center: 'head', description: 'The Receptive', color: '#fbbf24' },
      '3': { active: true, center: 'head', description: 'Ordering', color: '#fbbf24' },
      '4': { active: true, center: 'ajna', description: 'Formulization', color: '#8b5cf6' },
      '5': { active: true, center: 'ajna', description: 'Fixed Rhythms', color: '#8b5cf6' },
      '6': { active: true, center: 'ajna', description: 'Friction', color: '#8b5cf6' },
      '7': { active: true, center: 'g', description: 'The Role of the Self', color: '#10b981' },
      '8': { active: true, center: 'g', description: 'Contribution', color: '#10b981' },
      '9': { active: true, center: 'g', description: 'Focus', color: '#10b981' },
      '10': { active: true, center: 'spleen', description: 'Self-Love', color: '#f59e0b' },
      '11': { active: true, center: 'spleen', description: 'Ideas', color: '#f59e0b' },
      '12': { active: true, center: 'spleen', description: 'Caution', color: '#f59e0b' },
      '13': { active: true, center: 'sacral', description: 'The Listener', color: '#ec4899' },
      '14': { active: true, center: 'sacral', description: 'Power Skills', color: '#ec4899' },
      '15': { active: true, center: 'sacral', description: 'Modesty', color: '#ec4899' },
      '16': { active: true, center: 'root', description: 'Enthusiasm', color: '#84cc16' },
      '17': { active: true, center: 'root', description: 'Opinions', color: '#84cc16' },
      '18': { active: true, center: 'root', description: 'Correction', color: '#84cc16' },
      '19': { active: false, center: 'root', description: 'Approach', color: '#84cc16' },
      '20': { active: true, center: 'throat', description: 'The Now', color: '#06b6d4' },
      '21': { active: false, center: 'throat', description: 'The Hunter/Huntress', color: '#06b6d4' },
      '22': { active: false, center: 'throat', description: 'Grace', color: '#06b6d4' },
      '23': { active: false, center: 'throat', description: 'Assimilation', color: '#06b6d4' },
      '24': { active: false, center: 'ajna', description: 'Rationalization', color: '#8b5cf6' },
      '25': { active: false, center: 'throat', description: 'Innocence', color: '#06b6d4' },
      '26': { active: false, center: 'throat', description: 'The Egoist', color: '#06b6d4' },
      '27': { active: false, center: 'throat', description: 'Caring', color: '#06b6d4' },
      '28': { active: false, center: 'throat', description: 'The Game Player', color: '#06b6d4' },
      '29': { active: false, center: 'throat', description: 'Saying Yes', color: '#06b6d4' },
      '30': { active: false, center: 'throat', description: 'Recognition', color: '#06b6d4' },
      '31': { active: false, center: 'throat', description: 'Influence', color: '#06b6d4' },
      '32': { active: false, center: 'throat', description: 'Continuity', color: '#06b6d4' },
      '33': { active: false, center: 'throat', description: 'Privacy', color: '#06b6d4' },
      '34': { active: true, center: 'sacral', description: 'Power', color: '#ec4899' },
      '35': { active: false, center: 'throat', description: 'Change', color: '#06b6d4' },
      '36': { active: false, center: 'throat', description: 'Crisis', color: '#06b6d4' },
      '37': { active: false, center: 'throat', description: 'Friendship', color: '#06b6d4' },
      '38': { active: false, center: 'root', description: 'The Fighter', color: '#84cc16' },
      '39': { active: false, center: 'throat', description: 'The Provocateur', color: '#06b6d4' },
      '40': { active: false, center: 'heart', description: 'Deliverance', color: '#ef4444' },
      '41': { active: false, center: 'root', description: 'Contraction', color: '#84cc16' },
      '42': { active: false, center: 'throat', description: 'Growth', color: '#06b6d4' },
      '43': { active: false, center: 'ajna', description: 'Insight', color: '#8b5cf6' },
      '44': { active: false, center: 'spleen', description: 'Alertness', color: '#f59e0b' },
      '45': { active: false, center: 'heart', description: 'Gathering Together', color: '#ef4444' },
      '46': { active: false, center: 'g', description: 'Determination of the Self', color: '#10b981' },
      '47': { active: false, center: 'ajna', description: 'Realizing', color: '#8b5cf6' },
      '48': { active: false, center: 'spleen', description: 'The Well', color: '#f59e0b' },
      '49': { active: false, center: 'throat', description: 'Revolution', color: '#06b6d4' },
      '50': { active: false, center: 'spleen', description: 'Values', color: '#f59e0b' },
      '51': { active: false, center: 'heart', description: 'Shock', color: '#ef4444' },
      '52': { active: false, center: 'root', description: 'Stillness', color: '#84cc16' },
      '53': { active: false, center: 'root', description: 'Beginnings', color: '#84cc16' },
      '54': { active: false, center: 'root', description: 'Ambition', color: '#84cc16' },
      '55': { active: false, center: 'root', description: 'Spirit', color: '#84cc16' },
      '56': { active: false, center: 'throat', description: 'The Wanderer', color: '#06b6d4' },
      '57': { active: false, center: 'spleen', description: 'Intuitive Insight', color: '#f59e0b' },
      '58': { active: false, center: 'root', description: 'Joy', color: '#84cc16' },
      '59': { active: false, center: 'heart', description: 'Intimacy', color: '#ef4444' },
      '60': { active: false, center: 'root', description: 'Limitation', color: '#84cc16' },
      '61': { active: false, center: 'head', description: 'Mystery', color: '#fbbf24' },
      '62': { active: false, center: 'throat', description: 'Detail', color: '#06b6d4' },
      '63': { active: false, center: 'head', description: 'Doubt', color: '#fbbf24' },
      '64': { active: false, center: 'head', description: 'Confusion', color: '#fbbf24' }
    },
    planets: {
      sun: { name: 'Sun', symbol: '☉', position: 1, gate: '1', line: 1, color: '#FFD700', description: 'Consciousness' },
      earth: { name: 'Earth', symbol: '⊕', position: 2, gate: '2', line: 1, color: '#8B4513', description: 'Unconsciousness' },
      moon: { name: 'Moon', symbol: '☽', position: 3, gate: '3', line: 1, color: '#C0C0C0', description: 'Personality' },
      northNode: { name: 'North Node', symbol: '☊', position: 4, gate: '4', line: 1, color: '#FF6B6B', description: 'Direction' },
      southNode: { name: 'South Node', symbol: '☋', position: 5, gate: '5', line: 1, color: '#4ECDC4', description: 'Past' },
      mercury: { name: 'Mercury', symbol: '☿', position: 6, gate: '6', line: 1, color: '#45B7D1', description: 'Communication' },
      venus: { name: 'Venus', symbol: '♀', position: 7, gate: '7', line: 1, color: '#96CEB4', description: 'Values' },
      mars: { name: 'Mars', symbol: '♂', position: 8, gate: '8', line: 1, color: '#FFEAA7', description: 'Action' },
      jupiter: { name: 'Jupiter', symbol: '♃', position: 9, gate: '9', line: 1, color: '#DDA0DD', description: 'Expansion' },
      saturn: { name: 'Saturn', symbol: '♄', position: 10, gate: '10', line: 1, color: '#98D8C8', description: 'Structure' },
      uranus: { name: 'Uranus', symbol: '♅', position: 11, gate: '11', line: 1, color: '#F7DC6F', description: 'Revolution' },
      neptune: { name: 'Neptune', symbol: '♆', position: 12, gate: '12', line: 1, color: '#BB8FCE', description: 'Illusion' },
      pluto: { name: 'Pluto', symbol: '♇', position: 13, gate: '13', line: 1, color: '#85C1E9', description: 'Transformation' }
    }
  });

  const handleCenterToggle = (centerId: string) => {
    setChartData(prev => ({
      ...prev,
      centers: {
        ...prev.centers,
        [centerId]: {
          ...prev.centers[centerId],
          defined: !prev.centers[centerId].defined
        }
      }
    }));
  };

  const handleColorChange = (centerId: string, color: string) => {
    setChartData(prev => ({
      ...prev,
      centers: {
        ...prev.centers,
        [centerId]: {
          ...prev.centers[centerId],
          color
        }
      }
    }));
  };

  const handleChannelToggle = (channelId: string) => {
    setChartData(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channelId]: {
          ...prev.channels[channelId],
          active: !prev.channels[channelId].active
        }
      }
    }));
  };

  const handleGateToggle = (gateId: string) => {
    setChartData(prev => ({
      ...prev,
      gates: {
        ...prev.gates,
        [gateId]: {
          ...prev.gates[gateId],
          active: !prev.gates[gateId].active
        }
      }
    }));
  };

  const centerIcons: { [key: string]: React.ReactElement } = {
    head: <Brain size={24} />,
    ajna: <Eye size={24} />,
    throat: <Target size={24} />,
    g: <Heart size={24} />,
    heart: <Heart size={24} />,
    spleen: <Star size={24} />,
    sacral: <User size={24} />,
    solar: <Crown size={24} />,
    root: <Target size={24} />
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      py: 4
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 900,
                mb: 4,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
              }}
            >
              Chart Editor
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 6,
                maxWidth: 800,
                mx: 'auto'
              }}
            >
              Erstelle und bearbeite deine Human Design Charts
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {/* Editor Panel */}
          <Grid item xs={12} lg={3}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  Chart-Einstellungen
                </Typography>

                {/* Basic Info */}
                <TextField
                  fullWidth
                  label="HD Type"
                  value={chartData.hdType}
                  onChange={(e) => setChartData(prev => ({ ...prev, hdType: e.target.value }))}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Profile"
                  value={chartData.profile}
                  onChange={(e) => setChartData(prev => ({ ...prev, profile: e.target.value }))}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Authority"
                  value={chartData.authority}
                  onChange={(e) => setChartData(prev => ({ ...prev, authority: e.target.value }))}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Strategy"
                  value={chartData.strategy}
                  onChange={(e) => setChartData(prev => ({ ...prev, strategy: e.target.value }))}
                  sx={{ mb: 3 }}
                />

                {/* Tabs für verschiedene Chart-Elemente */}
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{ mb: 3 }}
                >
                  <Tab label="Zentren" sx={{ color: 'white' }} />
                  <Tab label="Kanäle" sx={{ color: 'white' }} />
                  <Tab label="Tore" sx={{ color: 'white' }} />
                </Tabs>

                {/* Tab Content */}
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      Zentren
                    </Typography>
                    {Object.entries(chartData.centers).map(([centerId, center]) => (
                      <Box key={centerId} sx={{ mb: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          {centerIcons[centerId]}
                          <Typography sx={{ color: 'white', textTransform: 'capitalize' }}>
                            {centerId}
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={center.defined}
                                onChange={() => handleCenterToggle(centerId)}
                                sx={{ '& .MuiSwitch-thumb': { bgcolor: center.defined ? center.color : '#666' } }}
                              />
                            }
                            label=""
                          />
                        </Box>
                        <TextField
                          size="small"
                          type="color"
                          value={center.color}
                          onChange={(e) => handleColorChange(centerId, e.target.value)}
                          sx={{ width: '100%' }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Kanäle ({Object.values(chartData.channels).filter(c => c.active).length}/36)
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            const newChannels = { ...chartData.channels };
                            Object.keys(newChannels).forEach(key => {
                              newChannels[key].active = true;
                            });
                            setChartData(prev => ({ ...prev, channels: newChannels }));
                          }}
                          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}
                        >
                          Alle an
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            const newChannels = { ...chartData.channels };
                            Object.keys(newChannels).forEach(key => {
                              newChannels[key].active = false;
                            });
                            setChartData(prev => ({ ...prev, channels: newChannels }));
                          }}
                          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}
                        >
                          Alle aus
                        </Button>
                      </Box>
                    </Box>
                    <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                      {Object.entries(chartData.channels).map(([channelId, channel]) => (
                        <Box key={channelId} sx={{ mb: 1, p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                              {channelId}
                            </Typography>
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={channel.active}
                                  onChange={() => handleChannelToggle(channelId)}
                                  sx={{ '& .MuiSwitch-thumb': { bgcolor: channel.active ? channel.color : '#666' } }}
                                />
                              }
                              label=""
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                            {channel.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Tore ({Object.values(chartData.gates).filter(g => g.active).length}/64)
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            const newGates = { ...chartData.gates };
                            Object.keys(newGates).forEach(key => {
                              newGates[key].active = true;
                            });
                            setChartData(prev => ({ ...prev, gates: newGates }));
                          }}
                          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}
                        >
                          Alle an
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            const newGates = { ...chartData.gates };
                            Object.keys(newGates).forEach(key => {
                              newGates[key].active = false;
                            });
                            setChartData(prev => ({ ...prev, gates: newGates }));
                          }}
                          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}
                        >
                          Alle aus
                        </Button>
                      </Box>
                    </Box>
                    <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                      {Object.entries(chartData.gates).map(([gateId, gate]) => (
                        <Box key={gateId} sx={{ mb: 1, p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                              Tor {gateId}
                            </Typography>
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={gate.active}
                                  onChange={() => handleGateToggle(gateId)}
                                  sx={{ '& .MuiSwitch-thumb': { bgcolor: gate.active ? gate.color : '#666' } }}
                                />
                              }
                              label=""
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                            {gate.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Actions */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save size={20} />}
                    sx={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: '#1f2937',
                      fontWeight: 700,
                      flex: 1
                    }}
                  >
                    Speichern
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download size={20} />}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      flex: 1
                    }}
                  >
                    Export
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Chart Preview */}
          <Grid item xs={12} lg={9}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              height: '100vh',
              minHeight: 1200
            }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  Chart Vorschau
                </Typography>
                
                {/* Human Design Chart */}
                <Box sx={{
                  width: '100%',
                  height: 'calc(100vh - 200px)',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  overflow: 'visible',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'scale(1.5)',
                    transformOrigin: 'center'
                  }}>
                    {/* SVG Bodchart.svg verwenden */}
                    <img 
                      src="/SVG Bodchart.svg" 
                      alt="Human Design Bodygraph Editor"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
