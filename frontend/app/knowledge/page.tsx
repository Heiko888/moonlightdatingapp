"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from 'next/navigation';
import AnimatedStars from "../../components/AnimatedStars";
import AccessControl from "../../components/AccessControl";
import { UserSubscription } from "../../lib/subscription/types";
import { SubscriptionService } from "../../lib/subscription/subscriptionService";

import { KnowledgeService, KnowledgeEntry } from "../../lib/knowledge/knowledgeService";
import { 
  TextField, 
  Alert, 
  IconButton, 
  Box, 
  Typography, 
  InputAdornment, 
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Snackbar
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { 
  BookOpen, 
  Search, 
  Heart, 
  Sparkles, 
} from "lucide-react";



export default function KnowledgePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Authentifizierung und Subscription prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setIsAuthenticated(false);
        router.push('/login?redirect=/knowledge');
        return;
      }
      
      setIsAuthenticated(true);
      
      // Daten laden
      loadUserSubscription();
      const loadKnowledgeEntries = async () => {
        try {
          setLoading(true);
          setError(null);
          const entries = await KnowledgeService.getKnowledgeEntries();
          setKnowledgeEntries(entries);
        } catch (err) {
          console.error('Fehler beim Laden der Knowledge-Entries:', err);
          setError('Fehler beim Laden der Daten');
        } finally {
          setLoading(false);
        }
      };

      loadKnowledgeEntries();
    };

    checkAuth();
  }, [router]);

  const loadUserSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const subscription = await SubscriptionService.getUserSubscription(user.id);
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Abonnements:', error);
    }
  };

  const filteredEntries = knowledgeEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = async (id: string) => {
    try {
      const updatedEntry = await KnowledgeService.toggleFavorite(id);
      if (updatedEntry) {
        setKnowledgeEntries(prev => 
          prev.map(entry => 
            entry.id === id ? updatedEntry : entry
          )
        );
        setSnackbarMessage(updatedEntry.isFavorite ? 'Zu Favoriten hinzugefügt' : 'Aus Favoriten entfernt');
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Fehler beim Umschalten des Favoriten-Status:', err);
      setSnackbarMessage('Fehler beim Aktualisieren der Favoriten');
      setSnackbarOpen(true);
    }
  };

  const categories = ["all", ...Array.from(new Set(knowledgeEntries.map(entry => entry.category)))];

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <AccessControl 
      path={pathname} 
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/pricing')}
    >
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 2 }}>
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 800, 
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                  }}
                >
                  <Sparkles size={48} style={{ marginRight: 16, display: 'inline-block' }} />
                  Wissensdatenbank
                  <Sparkles size={48} style={{ marginLeft: 16, display: 'inline-block' }} />
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    mb: 4,
                    fontWeight: 400,
                    maxWidth: 800,
                    mx: 'auto',
                    lineHeight: 1.4
                  }}
                >
                  Entdecke tiefes Wissen über Human Design, Mondphasen und energetische Prinzipien
                </Typography>
              </Box>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                p: 4,
                mb: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      placeholder="Suche nach Wissen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search style={{ color: 'white' }} />
                          </InputAdornment>
                        ),
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '& fieldset': {
                              borderColor: 'rgba(255, 215, 0, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 215, 0, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#FFD700',
                            },
                          },
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {categories.map((category) => (
                        <Chip
                          key={category}
                          label={category === "all" ? "Alle" : category}
                          onClick={() => setSelectedCategory(category)}
                          sx={{
                            backgroundColor: selectedCategory === category 
                              ? '#FFD700' 
                              : 'rgba(255, 255, 255, 0.1)',
                            color: selectedCategory === category ? '#23233a' : '#ffffff',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            '&:hover': {
                              backgroundColor: selectedCategory === category 
                                ? '#fbbf24' 
                                : 'rgba(255, 255, 255, 0.2)',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </motion.div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'white',
                    '& .MuiAlert-icon': {
                      color: '#EF4444'
                    }
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* Knowledge Entries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Grid container spacing={3}>
                {filteredEntries.map((entry, index) => (
                  <Grid item xs={12} md={6} key={entry.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    >
                      <Card sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        height: '100%'
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" sx={{ 
                              color: 'white', 
                              fontWeight: 700,
                              mb: 1
                            }}>
                              {entry.title}
                            </Typography>
                            <IconButton
                              onClick={() => toggleFavorite(entry.id)}
                              sx={{ color: entry.isFavorite ? '#FFD700' : 'rgba(255,255,255,0.6)' }}
                            >
                              <Heart style={{ 
                                fill: entry.isFavorite ? '#FFD700' : 'none',
                                stroke: entry.isFavorite ? '#FFD700' : 'rgba(255,255,255,0.6)'
                              }} />
                            </IconButton>
                          </Box>
                          
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            mb: 2,
                            lineHeight: 1.6
                          }}>
                            {entry.content}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            {entry.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                  color: 'white',
                                  border: '1px solid rgba(255, 215, 0, 0.3)',
                                  fontSize: '0.75rem'
                                }}
                              />
                            ))}
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip
                                label={entry.category}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                  color: 'white',
                                  border: '1px solid rgba(255, 215, 0, 0.3)',
                                  fontSize: '0.7rem'
                                }}
                              />
                              <Chip
                                label={entry.difficulty}
                                size="small"
                                sx={{
                                  backgroundColor: entry.difficulty === 'Anfänger' ? 'rgba(16, 185, 129, 0.2)' : 
                                                  entry.difficulty === 'Mittel' ? 'rgba(245, 158, 11, 0.2)' : 
                                                  'rgba(239, 68, 68, 0.2)',
                                  color: entry.difficulty === 'Anfänger' ? '#10B981' : 
                                         entry.difficulty === 'Mittel' ? '#F59E0B' : '#EF4444',
                                  border: `1px solid ${entry.difficulty === 'Anfänger' ? 'rgba(16, 185, 129, 0.3)' : 
                                                      entry.difficulty === 'Mittel' ? 'rgba(245, 158, 11, 0.3)' : 
                                                      'rgba(239, 68, 68, 0.3)'}`,
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ 
                              color: 'rgba(255,255,255,0.6)',
                              fontSize: '0.8rem'
                            }}>
                              {entry.readTime}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ 
                              color: 'rgba(255,255,255,0.6)',
                              fontSize: '0.8rem'
                            }}>
                              {entry.author}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: 'rgba(255,255,255,0.6)',
                              fontSize: '0.8rem'
                            }}>
                              {new Date(entry.createdAt).toLocaleDateString('de-DE')}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              
              {filteredEntries.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <BookOpen size={64} style={{ color: 'white', marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                    Keine Ergebnisse gefunden
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Versuche andere Suchbegriffe oder Kategorien
                  </Typography>
                </Box>
              )}
            </motion.div>
          </Container>
        </motion.div>
        
        {/* Snackbar für Benachrichtigungen */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }
          }}
        />
      </Box>
    </AccessControl>
    );
  }