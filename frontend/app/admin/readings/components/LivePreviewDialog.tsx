'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { Reading } from '../page';

// Mock-Daten für ausgewählte Texte
const mockSelectedTexts = [
  {
    id: 'text1',
    title: 'Generator Energie verstehen',
    content: 'Als Generator besitzt du eine kraftvolle, nachhaltige Energie, die darauf wartet, richtig eingesetzt zu werden. Deine Strategie ist es, auf das Leben zu antworten, anstatt zu initiieren. Dies bedeutet, dass du darauf wartest, dass das Leben dir Fragen stellt oder dich zu etwas einlädt, bevor du handelst. Deine Energie ist wie ein Generator - sie produziert kontinuierlich Kraft, aber sie muss richtig "angeschlossen" werden, um effektiv zu funktionieren.',
    category: 'Typ',
    element: 'Generator',
    style: 'informativ',
    length: 'mittel'
  },
  {
    id: 'text2',
    title: 'Beziehungsdynamiken',
    content: 'In Beziehungen bringst du als Generator eine natürliche Fähigkeit mit, andere zu unterstützen und zu nähren. Deine Energie kann andere inspirieren und motivieren. Du bist derjenige, der die Beziehung am Laufen hält, indem du deine konstante Energie einbringst. Es ist wichtig, dass du in Beziehungen auf deine innere Autorität hörst - dein Sakral-Zentrum wird dir durch ein "Ah-ha" oder "Uh-uh" Gefühl zeigen, was richtig für dich ist.',
    category: 'Beziehung',
    element: 'Generator',
    style: 'romantisch',
    length: 'kurz'
  },
  {
    id: 'text3',
    title: 'Karriere-Empfehlungen',
    content: 'Für Generatoren sind Berufe ideal, in denen sie ihre Energie kontinuierlich einsetzen können und direkte Rückmeldung über ihre Arbeit erhalten. Du gedeihst in Umgebungen, wo deine Arbeit geschätzt wird und wo du sehen kannst, wie deine Energie einen Unterschied macht. Vermeide Jobs, die zu repetitiv sind oder wo du keine Befriedigung aus deiner Arbeit ziehen kannst. Deine Frustration ist ein Zeichen dafür, dass du nicht in deiner wahren Natur lebst.',
    category: 'Karriere',
    element: 'Generator',
    style: 'professionell',
    length: 'lang'
  }
];

interface LivePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  selectedReading: Reading | null;
}

export default function LivePreviewDialog({ open, onClose, selectedReading }: LivePreviewDialogProps) {
  const [selectedTexts] = useState(mockSelectedTexts);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: '90vh',
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
        Live-Preview: {selectedReading?.title}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, height: '70vh', overflow: 'auto' }}>
        {selectedTexts.length > 0 ? (
          <Box>
            {/* Reading Header */}
            <Card sx={{ 
              mb: 4, 
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ 
                  color: '#FFD700', 
                  fontWeight: 700, 
                  mb: 2,
                  textAlign: 'center'
                }}>
                  {selectedReading?.title}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  textAlign: 'center',
                  fontWeight: 400
                }}>
                  Für {selectedReading?.userName}
                </Typography>
                {selectedReading?.userProfile && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 2, 
                    mt: 2,
                    flexWrap: 'wrap'
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      backgroundColor: 'rgba(255, 215, 0, 0.2)',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      border: '1px solid rgba(255, 215, 0, 0.3)'
                    }}>
                      {selectedReading.userProfile.type} - Profile {selectedReading.userProfile.profile}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                      {selectedReading.userProfile.authority} Authority
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Selected Texts */}
            {selectedTexts.map((text, index) => (
              <Card key={text.id} sx={{ 
                mb: 3, 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 215, 0, 0.3)'
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ 
                    color: '#FFD700', 
                    fontWeight: 600, 
                    mb: 2,
                    borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                    pb: 1
                  }}>
                    {index + 1}. {text.title}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.8,
                    fontSize: '1.1rem'
                  }}>
                    {text.content}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mt: 2, 
                    flexWrap: 'wrap' 
                  }}>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(139, 92, 246, 0.8)',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      {text.category}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(59, 130, 246, 0.8)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      {text.element}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(245, 158, 11, 0.8)',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}>
                      {text.style}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* Reading Footer */}
            <Card sx={{ 
              mt: 4, 
              background: 'rgba(255, 215, 0, 0.05)',
              border: '1px solid rgba(255, 215, 0, 0.2)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h6" sx={{ 
                  color: '#FFD700', 
                  fontWeight: 600, 
                  mb: 1
                }}>
                  Zusammenfassung
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.6
                }}>
                  Dieses Reading wurde speziell für {selectedReading?.userName} erstellt und basiert auf 
                  den Human Design Prinzipien. Es enthält {selectedTexts.length} ausgewählte Texte, 
                  die auf deine individuellen Bedürfnisse und dein Profil zugeschnitten sind.
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'rgba(255,255,255,0.6)',
                  display: 'block',
                  mt: 2
                }}>
                  Erstellt am {new Date().toLocaleDateString('de-DE')} • 
                  Status: {selectedReading?.status} • 
                  Methode: {selectedReading?.method}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              Keine Texte ausgewählt
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Wähle zuerst Texte aus, um eine Vorschau zu sehen.
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Button
          onClick={onClose}
          sx={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Schließen
        </Button>
        <Button
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
          Als PDF exportieren
        </Button>
      </DialogActions>
    </Dialog>
  );
}
