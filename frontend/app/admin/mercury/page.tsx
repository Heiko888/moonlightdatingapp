'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Edit3, 
  Save, 
  RefreshCw, 
  ChevronDown,
  Plus,
  Trash2,
  Eye
} from 'lucide-react';

interface MercuryGate {
  gate_number: number;
  name: string;
  essence: string;
  consciousness: string;
  description: string;
  deep_meaning: string;
  shadow_aspects: string[];
  gifts: string[];
  affirmation: string;
  personal_affirmation?: string;
  business_affirmation?: string;
  business_description?: string;
  center_name: string;
}

export default function MercuryAdminPage() {
  const [selectedGate, setSelectedGate] = useState<number>(1);
  const [gateData, setGateData] = useState<MercuryGate | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [gatesList, setGatesList] = useState<any[]>([]);
  const [newShadowAspect, setNewShadowAspect] = useState('');
  const [newGift, setNewGift] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Gate-Daten laden
  const loadGateData = async (gateNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4001/api/mercury-admin/gate/${gateNumber}`);
      const result = await response.json();
      
      if (result.success) {
        setGateData(result.data);
      } else {
        setMessage({ type: 'error', text: result.error || 'Fehler beim Laden der Gate-Daten' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Laden der Gate-Daten' });
    } finally {
      setLoading(false);
    }
  };

  // Alle Gates laden (für Übersicht)
  const loadGatesList = async () => {
    try {
      const response = await fetch('http://localhost:4001/api/mercury-admin/gates');
      const result = await response.json();
      
      if (result.success) {
        setGatesList(result.data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Gates-Liste:', error);
    }
  };

  // Gate-Daten speichern
  const saveGateData = async () => {
    if (!gateData) return;
    
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:4001/api/mercury-admin/gate/${gateData.gate_number}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gateData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: `Gate ${gateData.gate_number} erfolgreich gespeichert!` });
        setGateData(result.data); // Aktualisierte Daten setzen
      } else {
        setMessage({ type: 'error', text: result.error || 'Fehler beim Speichern' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Speichern der Gate-Daten' });
    } finally {
      setSaving(false);
    }
  };

  // Shadow Aspect hinzufügen
  const addShadowAspect = () => {
    if (newShadowAspect.trim() && gateData) {
      setGateData({
        ...gateData,
        shadow_aspects: [...gateData.shadow_aspects, newShadowAspect.trim()]
      });
      setNewShadowAspect('');
    }
  };

  // Shadow Aspect entfernen
  const removeShadowAspect = (index: number) => {
    if (gateData) {
      setGateData({
        ...gateData,
        shadow_aspects: gateData.shadow_aspects.filter((_, i) => i !== index)
      });
    }
  };

  // Gift hinzufügen
  const addGift = () => {
    if (newGift.trim() && gateData) {
      setGateData({
        ...gateData,
        gifts: [...gateData.gifts, newGift.trim()]
      });
      setNewGift('');
    }
  };

  // Gift entfernen
  const removeGift = (index: number) => {
    if (gateData) {
      setGateData({
        ...gateData,
        gifts: gateData.gifts.filter((_, i) => i !== index)
      });
    }
  };

  // Gate wechseln
  const handleGateChange = (gateNumber: number) => {
    setSelectedGate(gateNumber);
    loadGateData(gateNumber);
  };

  useEffect(() => {
    loadGateData(selectedGate);
    loadGatesList();
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0B0D12 0%, #1A1F2B 50%, #2D3748 100%)',
      color: 'white',
      py: 4
    }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" sx={{ 
            color: 'white', 
            fontWeight: 700, 
            mb: 2,
            textAlign: 'center'
          }}>
            🔧 Mercury Gate Admin
          </Typography>
          
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.7)', 
            mb: 4,
            textAlign: 'center'
          }}>
            Bearbeite die Mercury Gate-Texte direkt in der Datenbank
          </Typography>

          {message && (
            <Alert 
              severity={message.type} 
              sx={{ mb: 3 }}
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Gate-Auswahl */}
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: '1px solid #87CEEB',
                boxShadow: '0 8px 32px rgba(135, 206, 235, 0.2)',
                p: 3
              }}>
                <Typography variant="h6" sx={{ color: '#87CEEB', fontWeight: 600, mb: 2 }}>
                  Gate auswählen
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Gate Nummer</InputLabel>
                  <Select
                    value={selectedGate}
                    onChange={(e) => handleGateChange(Number(e.target.value))}
                    sx={{ 
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#87CEEB',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#87CEEB',
                      },
                    }}
                  >
                    {Array.from({ length: 64 }, (_, i) => i + 1).map((num) => (
                      <MenuItem key={num} value={num}>
                        Gate {num}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<RefreshCw size={20} />}
                  onClick={() => loadGateData(selectedGate)}
                  disabled={loading}
                  sx={{
                    borderColor: '#87CEEB',
                    color: '#87CEEB',
                    '&:hover': {
                      borderColor: '#87CEEB',
                      backgroundColor: 'rgba(135, 206, 235, 0.1)',
                    },
                    width: '100%'
                  }}
                >
                  Neu laden
                </Button>
              </Card>
            </Grid>

            {/* Gate-Bearbeitung */}
            <Grid item xs={12} md={9}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: '#87CEEB' }} />
                </Box>
              ) : gateData ? (
                <Card sx={{ 
                  background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid #87CEEB',
                  boxShadow: '0 8px 32px rgba(135, 206, 235, 0.2)',
                  p: 3
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: '#87CEEB', fontWeight: 600 }}>
                      Gate {gateData.gate_number}: {gateData.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Eye size={20} />}
                        onClick={() => setPreviewMode(!previewMode)}
                        sx={{
                          borderColor: '#87CEEB',
                          color: '#87CEEB',
                          '&:hover': {
                            borderColor: '#87CEEB',
                            backgroundColor: 'rgba(135, 206, 235, 0.1)',
                          },
                        }}
                      >
                        {previewMode ? 'Bearbeiten' : 'Vorschau'}
                      </Button>
                      
                      <Button
                        variant="contained"
                        startIcon={<Save size={20} />}
                        onClick={saveGateData}
                        disabled={saving}
                        sx={{
                          backgroundColor: '#87CEEB',
                          color: '#000',
                          '&:hover': {
                            backgroundColor: '#4682B4',
                          },
                        }}
                      >
                        {saving ? 'Speichern...' : 'Speichern'}
                      </Button>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    {/* Grunddaten */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={gateData.name}
                        onChange={(e) => setGateData({ ...gateData, name: e.target.value })}
                        disabled={previewMode}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#87CEEB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#87CEEB',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                            '&.Mui-focused': {
                              color: '#87CEEB',
                            },
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Essence (Unbewusst)"
                        value={gateData.essence}
                        onChange={(e) => setGateData({ ...gateData, essence: e.target.value })}
                        disabled={previewMode}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#87CEEB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#87CEEB',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                            '&.Mui-focused': {
                              color: '#87CEEB',
                            },
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Consciousness (Bewusst)"
                        value={gateData.consciousness}
                        onChange={(e) => setGateData({ ...gateData, consciousness: e.target.value })}
                        disabled={previewMode}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#87CEEB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#87CEEB',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                            '&.Mui-focused': {
                              color: '#87CEEB',
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={gateData.description}
                        onChange={(e) => setGateData({ ...gateData, description: e.target.value })}
                        disabled={previewMode}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#87CEEB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#87CEEB',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                            '&.Mui-focused': {
                              color: '#87CEEB',
                            },
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Deep Meaning"
                        value={gateData.deep_meaning}
                        onChange={(e) => setGateData({ ...gateData, deep_meaning: e.target.value })}
                        disabled={previewMode}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#87CEEB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#87CEEB',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                            '&.Mui-focused': {
                              color: '#87CEEB',
                            },
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Affirmation"
                        value={gateData.affirmation}
                        onChange={(e) => setGateData({ ...gateData, affirmation: e.target.value })}
                        disabled={previewMode}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#87CEEB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#87CEEB',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                            '&.Mui-focused': {
                              color: '#87CEEB',
                            },
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Persönliche Affirmation"
                        value={gateData.personal_affirmation || ''}
                        onChange={(e) => setGateData({ ...gateData, personal_affirmation: e.target.value })}
                        disabled={previewMode}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#87CEEB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#87CEEB',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                            '&.Mui-focused': {
                              color: '#87CEEB',
                            },
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Business Affirmation"
                        value={gateData.business_affirmation || ''}
                        onChange={(e) => setGateData({ ...gateData, business_affirmation: e.target.value })}
                        disabled={previewMode}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#87CEEB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#87CEEB',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                            '&.Mui-focused': {
                              color: '#87CEEB',
                            },
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Business Beschreibung"
                        value={gateData.business_description || ''}
                        onChange={(e) => setGateData({ ...gateData, business_description: e.target.value })}
                        disabled={previewMode}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#87CEEB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#87CEEB',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                            '&.Mui-focused': {
                              color: '#87CEEB',
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Shadow Aspects */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ color: '#87CEEB', fontWeight: 600, mb: 2 }}>
                        Shadow Aspects
                      </Typography>
                      
                      {!previewMode && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Neuer Shadow Aspect..."
                            value={newShadowAspect}
                            onChange={(e) => setNewShadowAspect(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addShadowAspect()}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255,255,255,0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#87CEEB',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#87CEEB',
                                },
                              },
                            }}
                          />
                          <Button
                            variant="outlined"
                            onClick={addShadowAspect}
                            sx={{
                              borderColor: '#87CEEB',
                              color: '#87CEEB',
                              minWidth: 'auto',
                              px: 2,
                            }}
                          >
                            <Plus size={20} />
                          </Button>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {gateData.shadow_aspects.map((aspect, index) => (
                          <Chip
                            key={index}
                            label={aspect}
                            onDelete={!previewMode ? () => removeShadowAspect(index) : undefined}
                            sx={{
                              backgroundColor: 'rgba(255, 0, 0, 0.1)',
                              color: '#ff6b6b',
                              border: '1px solid rgba(255, 0, 0, 0.3)',
                              '& .MuiChip-deleteIcon': {
                                color: '#ff6b6b',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>

                    {/* Gifts */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ color: '#87CEEB', fontWeight: 600, mb: 2 }}>
                        Gifts
                      </Typography>
                      
                      {!previewMode && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Neues Gift..."
                            value={newGift}
                            onChange={(e) => setNewGift(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addGift()}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255,255,255,0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#87CEEB',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#87CEEB',
                                },
                              },
                            }}
                          />
                          <Button
                            variant="outlined"
                            onClick={addGift}
                            sx={{
                              borderColor: '#87CEEB',
                              color: '#87CEEB',
                              minWidth: 'auto',
                              px: 2,
                            }}
                          >
                            <Plus size={20} />
                          </Button>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {gateData.gifts.map((gift, index) => (
                          <Chip
                            key={index}
                            label={gift}
                            onDelete={!previewMode ? () => removeGift(index) : undefined}
                            sx={{
                              backgroundColor: 'rgba(0, 255, 0, 0.1)',
                              color: '#51cf66',
                              border: '1px solid rgba(0, 255, 0, 0.3)',
                              '& .MuiChip-deleteIcon': {
                                color: '#51cf66',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                <Card sx={{ 
                  background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid #87CEEB',
                  boxShadow: '0 8px 32px rgba(135, 206, 235, 0.2)',
                  p: 3,
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Keine Gate-Daten gefunden
                  </Typography>
                </Card>
              )}
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
