"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Heart, 
  X, 
  MessageCircle, 
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import UnifiedPageLayout from '@/components/UnifiedPageLayout';

interface Profile {
  _id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  hd_type: string;
  profile: string;
  authority: string;
  strategy: string;
  image: string;
  interests: string[];
  compatibility_score: number;
  // Erweiterte Informationen
  occupation?: string;
  education?: string;
  lifestyle?: string;
  values?: string[];
  goals?: string;
  personality_traits?: string[];
  relationship_style?: string;
  deal_breakers?: string[];
  favorite_activities?: string[];
  music_taste?: string[];
  travel_preferences?: string;
}

interface Match {
  _id: string;
  userA: { _id: string; name: string; image: string };
  userB: { _id: string; name: string; image: string };
  createdAt: string;
}

export default function SwipePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showMatchAnim, setShowMatchAnim] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [revealedProfiles, setRevealedProfiles] = useState<Set<string>>(new Set());

  // Mock-Daten für Demo
  const mockProfiles: Profile[] = [
    {
      _id: '1',
      name: 'Luna',
      age: 28,
      location: 'Berlin',
      bio: 'Generator mit emotionaler Autorität. Liebe es, authentische Verbindungen zu schaffen. Ich bin eine leidenschaftliche Yogalehrerin und verbringe meine Zeit gerne in der Natur. Meine Freunde beschreiben mich als einfühlsam und spirituell.',
      hd_type: 'Generator',
      profile: '2/4',
      authority: 'Emotional',
      strategy: 'Wait to Respond',
      image: '/api/placeholder/300/400',
      interests: ['Yoga', 'Astrologie', 'Natur', 'Meditation', 'Kochen', 'Reisen'],
      compatibility_score: 85,
      // Erweiterte Informationen
      occupation: 'Yogalehrerin & Astrologin',
      education: 'Studium der Psychologie',
      lifestyle: 'Vegetarisch, meditiert täglich',
      values: ['Authentizität', 'Spiritualität', 'Nachhaltigkeit'],
      goals: 'Tiefe spirituelle Verbindungen finden',
      personality_traits: ['Einfühlsam', 'Intuitiv', 'Kreativ', 'Geduldig'],
      relationship_style: 'Sucht nach tiefer emotionaler Verbindung',
      deal_breakers: ['Oberflächlichkeit', 'Mangel an Spiritualität'],
      favorite_activities: ['Sonnenaufgang-Yoga', 'Astrologie-Studium', 'Waldspaziergänge'],
      music_taste: ['Ambient', 'Meditation', 'Indie Folk'],
      travel_preferences: 'Spirituelle Retreats, Natur-Reisen'
    },
    {
      _id: '2',
      name: 'Phoenix',
      age: 32,
      location: 'München',
      bio: 'Projector mit splenischer Autorität. Hier um zu führen und zu inspirieren.',
      hd_type: 'Projector',
      profile: '3/5',
      authority: 'Splenic',
      strategy: 'Wait for the Invitation',
      image: '/api/placeholder/300/400',
      interests: ['Coaching', 'Spiritualität', 'Reisen'],
      compatibility_score: 92
    },
    {
      _id: '3',
      name: 'Sage',
      age: 26,
      location: 'Hamburg',
      bio: 'Manifestor mit emotionaler Autorität. Erschaffe gerne neue Wege.',
      hd_type: 'Manifestor',
      profile: '1/3',
      authority: 'Emotional',
      strategy: 'Inform Before Acting',
      image: '/api/placeholder/300/400',
      interests: ['Kunst', 'Musik', 'Innovation'],
      compatibility_score: 78
    }
  ];

  useEffect(() => {
    // Simuliere Ladezeit
    setTimeout(() => {
      setProfiles(mockProfiles);
      setIsLoading(false);
    }, 1000);
  }, []);

  const revealProfile = () => {
    if (currentProfile) {
      setRevealedProfiles(prev => new Set([...prev, currentProfile._id]));
    }
  };

  const handleSwipe = async (liked: boolean) => {
    if (currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];
    setSwipeDirection(liked ? 'right' : 'left');

    // Simuliere API-Call
    setTimeout(async () => {
      console.log('💕 Swipe verarbeitet:', {
        userId: 'current-user-id',
          targetId: currentProfile._id,
        liked
      });

      if (liked && Math.random() > 0.7) {
        // Match!
          setShowMatchAnim(true);
          setTimeout(() => setShowMatchAnim(false), 3000);
          
          const newMatch = {
          _id: Date.now().toString(),
          userA: { _id: 'current-user-id', name: 'Du', image: '/api/placeholder/100/100' },
            userB: { _id: currentProfile._id, name: currentProfile.name, image: currentProfile.image },
            createdAt: new Date().toISOString()
          };
          setMatches(prev => [...prev, newMatch]);
      }

      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 500);
  };

  const currentProfile = profiles[currentIndex];

  if (isLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            py: { xs: 4, md: 6 }
          }}>
            <Typography
              variant="h2"
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
              }}
            >
              💕 Kosmische Verbindungen
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Finde deine energetische Entsprechung
            </Typography>
        </Box>
          
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <CircularProgress size={60} sx={{ color: '#ff6b9d', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Lade passende Profile...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            py: { xs: 4, md: 6 }
          }}>
            <Typography
              variant="h2"
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
              }}
            >
              💕 Kosmische Verbindungen
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Du hast alle Profile durchgesehen!
            </Typography>
          </Box>
          
          <Box textAlign="center" py={8}>
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              🎉 Alle Profile durchgesehen!
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
              Schau später wieder vorbei für neue kosmische Verbindungen.
            </Typography>
          <Button
            variant="contained"
              size="large"
              onClick={() => setCurrentIndex(0)}
            sx={{
                mt: 2,
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)'
                }
              }}
            >
              Neu starten
          </Button>
        </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            py: { xs: 4, md: 6 }
          }}>
          <Typography
              variant="h2"
            sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
              }}
            >
              💕 Kosmische Verbindungen
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Finde deine energetische Entsprechung
          </Typography>
        </Box>
        </motion.div>
      {/* Match Animation */}
      <AnimatePresence>
        {showMatchAnim && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            <Typography variant="h3" sx={{ mb: 2 }}>
              🎉 Match!
            </Typography>
            <Typography variant="h6">
              Du und {currentProfile?.name} haben sich gefunden!
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Swipe Card */}
        <Box
          sx={{
            position: 'relative',
            height: '700px',
            mb: 4,
            maxWidth: '450px',
            mx: 'auto'
          }}
        >
        <motion.div
          key={currentProfile._id}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
            rotate: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8, 
            y: -50,
            x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
            rotate: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        >
          <Card
            sx={{
              height: '100%',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              color: 'white'
            }}
          >
            {/* Profile Image */}
            <Box
              sx={{
                height: '300px',
                background: `url(${currentProfile.image}) center/cover`,
                position: 'relative',
                filter: revealedProfiles.has(currentProfile._id) ? 'none' : 'blur(20px)',
                transition: 'filter 0.5s ease-in-out'
              }}
            >
              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '200px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                }}
              />
              
              {/* Compatibility Score */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  p: 1,
                  color: 'white'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {currentProfile.compatibility_score}%
                </Typography>
                <Typography variant="caption">
                  Kompatibilität
                </Typography>
              </Box>

              {/* Reveal Button */}
              {!revealedProfiles.has(currentProfile._id) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    zIndex: 10
                  }}
                >
        <Button
          variant="contained"
                    onClick={revealProfile}
          sx={{
            background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
            color: 'white',
                      px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none',
                      fontSize: '1.1rem',
            boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(255, 107, 157, 0.4)'
            }
          }}
        >
                    🔍 Bild anzeigen
        </Button>
                  <Typography 
                    variant="body2" 
          sx={{
            color: 'white',
                      mt: 1, 
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      fontSize: '0.9rem'
                    }}
                  >
                    Lerne die Person erst kennen
          </Typography>
        </Box>
      )}
            </Box>

            <CardContent sx={{ 
              p: 2, 
              height: '300px', 
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255,107,157,0.5)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(255,107,157,0.7)',
              }
            }}>
              <Stack spacing={1.5}>
                {/* Name and Age */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {currentProfile.name}, {currentProfile.age}
                        </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {currentProfile.location}
                        </Typography>
                      </Box>

                {/* Bio */}
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  {currentProfile.bio}
                              </Typography>

                {/* Erweiterte Informationen */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                    💼 Beruf & Bildung
                              </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem', mb: 0.5 }}>
                    {currentProfile.occupation} • {currentProfile.education}
                              </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                    {currentProfile.lifestyle}
                              </Typography>
                      </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                    🎯 Werte & Ziele
                        </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 0.5 }}>
                    {currentProfile.values?.map((value, index) => (
                              <Chip
                                key={index}
                        label={value} 
                                size="small"
                                sx={{
                          background: 'rgba(255, 107, 157, 0.2)', 
                          color: 'white',
                          fontSize: '0.7rem',
                          height: '20px'
                                }}
                              />
                            ))}
                  </Stack>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                    {currentProfile.goals}
                              </Typography>
                      </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                    🎭 Persönlichkeit
                        </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 0.5 }}>
                    {currentProfile.personality_traits?.map((trait, index) => (
                      <Chip 
                        key={index}
                        label={trait} 
                        size="small" 
                          sx={{
                          background: 'rgba(78, 205, 196, 0.2)', 
                          color: 'white',
                          fontSize: '0.7rem',
                          height: '20px'
                        }}
                      />
                    ))}
                  </Stack>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                    {currentProfile.relationship_style}
                        </Typography>
                      </Box>

                    <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                    🎵 Musik & Aktivitäten
                          </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem', mb: 0.5 }}>
                    Musik: {currentProfile.music_taste?.join(', ')}
                        </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem', mb: 0.5 }}>
                    Aktivitäten: {currentProfile.favorite_activities?.join(', ')}
                            </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                    Reisen: {currentProfile.travel_preferences}
                            </Typography>
                        </Box>

                {/* Human Design Info */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                    Human Design
                              </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip 
                      label={currentProfile.hd_type} 
                      size="small" 
                      sx={{ background: 'linear-gradient(135deg, #ff6b9d, #c44569)', color: 'white' }}
                    />
                    <Chip 
                      label={currentProfile.profile} 
                      size="small" 
                      sx={{ background: 'linear-gradient(135deg, #ff6b9d, #c44569)', color: 'white' }}
                    />
                    <Chip 
                      label={currentProfile.authority} 
                      size="small" 
                      sx={{ background: 'linear-gradient(135deg, #ff6b9d, #c44569)', color: 'white' }}
                    />
                  </Stack>
                            </Box>

                {/* Interests */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                    Interessen
                            </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {currentProfile.interests.map((interest, index) => (
                      <Chip 
                        key={index}
                        label={interest} 
                        size="small" 
                        sx={{ background: 'rgba(255, 107, 157, 0.2)', color: 'white' }}
                      />
                    ))}
                  </Stack>
                            </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>
                          </Box>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" gap={3} mb={4}>
          <IconButton
            onClick={() => handleSwipe(false)}
            disabled={!revealedProfiles.has(currentProfile._id)}
                            sx={{
              width: 60,
              height: 60,
              background: revealedProfiles.has(currentProfile._id) 
                ? 'linear-gradient(135deg, #ff6b6b, #ff8e8e)' 
                : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              opacity: revealedProfiles.has(currentProfile._id) ? 1 : 0.5,
                              '&:hover': { 
                background: revealedProfiles.has(currentProfile._id)
                  ? 'linear-gradient(135deg, #ff5252, #ff7979)'
                  : 'rgba(255, 255, 255, 0.2)',
                transform: revealedProfiles.has(currentProfile._id) ? 'scale(1.1)' : 'none'
              }
            }}
          >
            <X size={30} />
          </IconButton>

          <IconButton
            onClick={() => handleSwipe(true)}
            disabled={!revealedProfiles.has(currentProfile._id)}
                            sx={{
              width: 60,
              height: 60,
              background: revealedProfiles.has(currentProfile._id)
                ? 'linear-gradient(135deg, #ff6b9d, #c44569)'
                : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              opacity: revealedProfiles.has(currentProfile._id) ? 1 : 0.5,
              '&:hover': {
                background: revealedProfiles.has(currentProfile._id)
                  ? 'linear-gradient(135deg, #ff5a8a, #b83a5a)'
                  : 'rgba(255, 255, 255, 0.2)',
                transform: revealedProfiles.has(currentProfile._id) ? 'scale(1.1)' : 'none'
              }
            }}
          >
            <Heart size={30} />
          </IconButton>
                        </Box>

        {/* Hinweis für Swipe-Buttons */}
        {!revealedProfiles.has(currentProfile._id) && (
          <Box textAlign="center" mb={2}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              💡 Schau dir das Bild an, um zu swipen
                    </Typography>
                  </Box>
        )}

        {/* Matches Counter */}
        {matches.length > 0 && (
          <Box textAlign="center">
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              🎉 {matches.length} Match{matches.length > 1 ? 'es' : ''} gefunden!
                      </Typography>
                            <Button
                              variant="contained"
              startIcon={<MessageCircle />}
              onClick={() => router.push('/matches')}
                              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)'
                }
              }}
            >
              Matches anzeigen
                            </Button>
                    </Box>
                  )}
      </Container>
            </Box>
  );
}
