'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Plus,
  Sparkles,
  Type,
  FileText,
} from 'lucide-react';
import { Reading } from '../page';

// Mock-Daten für verfügbare Texte
const mockAvailableTexts = [
  {
    id: 'text1',
    title: 'Generator Energie verstehen',
    content: 'Als Generator besitzt du eine kraftvolle, nachhaltige Energie, die darauf wartet, richtig eingesetzt zu werden. Deine Strategie ist es, auf das Leben zu antworten, anstatt zu initiieren.',
    category: 'Typ',
    element: 'Generator',
    style: 'informativ',
    length: 'mittel'
  },
  {
    id: 'text2',
    title: 'Beziehungsdynamiken',
    content: 'In Beziehungen bringst du als Generator eine natürliche Fähigkeit mit, andere zu unterstützen und zu nähren. Deine Energie kann andere inspirieren und motivieren.',
    category: 'Beziehung',
    element: 'Generator',
    style: 'romantisch',
    length: 'kurz'
  },
  {
    id: 'text3',
    title: 'Karriere-Empfehlungen',
    content: 'Für Generatoren sind Berufe ideal, in denen sie ihre Energie kontinuierlich einsetzen können und direkte Rückmeldung über ihre Arbeit erhalten.',
    category: 'Karriere',
    element: 'Generator',
    style: 'professionell',
    length: 'lang'
  }
];

// Mock-Daten für Layouts
const mockLayouts = [
  {
    id: 'layout1',
    name: 'Klassisch',
    description: 'Traditionelles Layout mit klarer Struktur'
  },
  {
    id: 'layout2',
    name: 'Modern',
    description: 'Zeitgemäßes Design mit visuellen Elementen'
  },
  {
    id: 'layout3',
    name: 'Minimalistisch',
    description: 'Sauberes, fokussiertes Layout'
  }
];

// Mock-Daten für Reading-Komponenten
const mockReadingComponents = [
  {
    id: 'comp1',
    name: 'Header',
    type: 'header',
    description: 'Titel und Untertitel',
    icon: <Type size={16} />
  },
  {
    id: 'comp2',
    name: 'Text-Block',
    type: 'text',
    description: 'Fließtext mit Formatierung',
    icon: <FileText size={16} />
  },
  {
    id: 'comp3',
    name: 'Zitat',
    type: 'quote',
    description: 'Hervorgehobenes Zitat',
    icon: <Type size={16} />
  }
];

interface TextSelectorDialogProps {
  open: boolean;
  onClose: () => void;
  selectedReading: Reading | null;
}

export default function TextSelectorDialog({ open, onClose, selectedReading }: TextSelectorDialogProps) {
  const [availableTexts, setAvailableTexts] = useState(mockAvailableTexts);
  const [selectedTexts, setSelectedTexts] = useState<any[]>([]);
  const [textFilter, setTextFilter] = useState<string>('all');
  const [textSelectorTab, setTextSelectorTab] = useState<'texts' | 'design'>('texts');
  const [readingLayout, setReadingLayout] = useState(mockLayouts[0]);
  const [addTextDialogOpen, setAddTextDialogOpen] = useState(false);
  const [newText, setNewText] = useState({
    id: '',
    title: '',
    content: '',
    category: 'Beziehung',
    element: '',
    style: 'romantisch',
    length: 'mittel'
  });

  const handleSelectText = (text: any) => {
    const isSelected = selectedTexts.find(t => t.id === text.id);
    if (isSelected) {
      setSelectedTexts(selectedTexts.filter(t => t.id !== text.id));
    } else {
      setSelectedTexts([...selectedTexts, text]);
    }
  };

  const handleSaveTextSelection = () => {
    console.log('Text-Auswahl gespeichert:', selectedTexts);
    onClose();
  };

  const handleAddNewText = () => {
    setAddTextDialogOpen(true);
  };

  const handleSaveNewText = () => {
    if (newText.title && newText.content) {
      const textToAdd = {
        ...newText,
        id: `text_${Date.now()}`
      };
      setAvailableTexts([...availableTexts, textToAdd]);
      setNewText({
        id: '',
        title: '',
        content: '',
        category: 'Beziehung',
        element: '',
        style: 'romantisch',
        length: 'mittel'
      });
      setAddTextDialogOpen(false);
    }
  };

  const handleCancelNewText = () => {
    setNewText({
      id: '',
      title: '',
      content: '',
      category: 'Beziehung',
      element: '',
      style: 'romantisch',
      length: 'mittel'
    });
    setAddTextDialogOpen(false);
  };

  const handleApplyRecommended = () => {
    const recommendedTexts = availableTexts.filter(text => 
      text.category === 'Beziehung' || text.category === 'Typ'
    );
    setSelectedTexts(recommendedTexts);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '95vh',
            width: '95vw',
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(11,13,18,0.95) 0%, rgba(26,31,43,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#FFD700', 
          fontWeight: 700, 
          fontSize: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          pb: 2
        }}>
          {selectedReading ? `Text-Auswahl für: ${selectedReading.title}` : 'Text-Auswahl'}
        </DialogTitle>
        
        <DialogContent sx={{ p: 4, height: '80vh', overflow: 'auto' }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 3 }}>
            <Tabs 
              value={textSelectorTab} 
              onChange={(e, newValue) => setTextSelectorTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    color: '#FFD700'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FFD700'
                }
              }}
            >
              <Tab label="Text-Auswahl" value="texts" />
              <Tab label="Design Studio" value="design" />
            </Tabs>
          </Box>

          {textSelectorTab === 'texts' && (
            <>
              {/* Filter und Empfehlungen */}
              <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  select
                  label="Kategorie filtern"
                  value={textFilter}
                  onChange={(e) => setTextFilter(e.target.value)}
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">Alle</MenuItem>
                  <MenuItem value="Typ">Typ</MenuItem>
                  <MenuItem value="Beziehung">Beziehung</MenuItem>
                  <MenuItem value="Karriere">Karriere</MenuItem>
                </TextField>
                
                {selectedReading && (
                  <Button
                    variant="outlined"
                    onClick={handleApplyRecommended}
                    sx={{
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                      color: '#FFD700',
                      '&:hover': {
                        borderColor: '#FFD700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)'
                      }
                    }}
                  >
                    <Sparkles size={16} style={{ marginRight: 8 }} />
                    Empfohlene Texte
                  </Button>
                )}
                
                <Button
                  variant="contained"
                  onClick={handleAddNewText}
                  sx={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(34, 197, 94, 0.3)'
                    }
                  }}
                >
                  <Plus size={16} style={{ marginRight: 8 }} />
                  Neuer Text
                </Button>
              </Box>

              {/* Text Cards */}
              <Grid container spacing={2}>
                {availableTexts
                  .filter(text => textFilter === 'all' || text.category === textFilter)
                  .map((text) => {
                    const isSelected = selectedTexts.find(t => t.id === text.id);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={text.id}>
                        <Card
                          onClick={() => handleSelectText(text)}
                          sx={{
                            cursor: 'pointer',
                            height: '100%',
                            background: isSelected 
                              ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)'
                              : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                            border: isSelected 
                              ? '2px solid rgba(255, 215, 0, 0.5)' 
                              : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                              border: '1px solid rgba(255, 215, 0, 0.3)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" sx={{ 
                              color: '#FFD700', 
                              fontWeight: 600, 
                              mb: 1,
                              fontSize: '1rem'
                            }}>
                              {text.title}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ 
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: '0.9rem',
                              lineHeight: 1.6,
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              flex: 1
                            }}>
                              {text.content}
                            </Typography>
                            
                            <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip 
                                label={text.length} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                  color: '#22c55e',
                                  border: '1px solid rgba(34, 197, 94, 0.3)',
                                  fontSize: '0.75rem'
                                }} 
                              />
                              <Chip 
                                label={text.category} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                  color: '#8b5cf6',
                                  border: '1px solid rgba(139, 92, 246, 0.3)',
                                  fontSize: '0.75rem'
                                }} 
                              />
                              <Chip 
                                label={text.element} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                  color: '#3b82f6',
                                  border: '1px solid rgba(59, 130, 246, 0.3)',
                                  fontSize: '0.75rem'
                                }} 
                              />
                              <Chip 
                                label={text.style} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                                  color: '#f59e0b',
                                  border: '1px solid rgba(245, 158, 11, 0.3)',
                                  fontSize: '0.75rem'
                                }} 
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
              </Grid>
            </>
          )}

          {textSelectorTab === 'design' && (
            <Box>
              <Typography variant="h6" sx={{ color: '#FFD700', mb: 3 }}>
                Reading Design Studio
              </Typography>
              
              {/* Layout Auswahl */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                  Layout wählen
                </Typography>
                <Grid container spacing={2}>
                  {mockLayouts.map((layout) => (
                    <Grid item xs={12} sm={4} key={layout.id}>
                      <Card
                        onClick={() => setReadingLayout(layout)}
                        sx={{
                          cursor: 'pointer',
                          border: readingLayout.id === layout.id ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                          background: readingLayout.id === layout.id 
                            ? 'rgba(255, 215, 0, 0.1)' 
                            : 'rgba(255,255,255,0.05)'
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#FFD700' }}>
                            {layout.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {layout.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Komponenten */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                  Komponenten hinzufügen
                </Typography>
                <Grid container spacing={2}>
                  {mockReadingComponents.map((component) => (
                    <Grid item xs={12} sm={4} key={component.id}>
                      <Card sx={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Box sx={{ color: '#FFD700', mb: 1 }}>
                            {component.icon}
                          </Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFD700' }}>
                            {component.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {component.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button
            onClick={onClose}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={textSelectorTab === 'texts' ? handleSaveTextSelection : () => console.log('Design gespeichert')}
            variant="contained"
            sx={{
              backgroundColor: 'rgba(255, 215, 0, 0.2)',
              color: '#FFD700',
              border: '1px solid rgba(255, 215, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.3)'
              }
            }}
          >
            {textSelectorTab === 'texts' ? 'Auswahl speichern' : 'Design speichern'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Neuer Text Dialog */}
      <Dialog
        open={addTextDialogOpen}
        onClose={handleCancelNewText}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#FFD700', fontWeight: 700 }}>
          Neuen Text hinzufügen
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titel"
                value={newText.title}
                onChange={(e) => setNewText({...newText, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Inhalt"
                value={newText.content}
                onChange={(e) => setNewText({...newText, content: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Kategorie"
                value={newText.category}
                onChange={(e) => setNewText({...newText, category: e.target.value})}
              >
                <MenuItem value="Typ">Typ</MenuItem>
                <MenuItem value="Beziehung">Beziehung</MenuItem>
                <MenuItem value="Karriere">Karriere</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Element"
                value={newText.element}
                onChange={(e) => setNewText({...newText, element: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCancelNewText}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSaveNewText}
            variant="contained"
            sx={{
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              color: '#22c55e',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(34, 197, 94, 0.3)'
              }
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
