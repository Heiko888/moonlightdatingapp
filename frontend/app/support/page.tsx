"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import {
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  Send,
  Star,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// FAQ Daten
const faqData = [
  {
    id: 1,
    question: "Wie funktioniert das Human Design Matching?",
    answer: "Unser System analysiert dein Human Design Chart und vergleicht es mit anderen Nutzern. Basierend auf energetischer Kompatibilität, definierten Zentren und Profil-Aspekten werden passende Matches gefunden.",
    category: "Matching",
    priority: "high"
  },
  {
    id: 2,
    question: "Kann ich mein Abonnement jederzeit kündigen?",
    answer: "Ja, du kannst dein Abonnement jederzeit in den Einstellungen kündigen. Die Kündigung wird zum Ende des aktuellen Abrechnungszeitraums wirksam.",
    category: "Abonnement",
    priority: "high"
  },
  {
    id: 3,
    question: "Wie sicher sind meine Daten?",
    answer: "Wir verwenden modernste Verschlüsselung und Sicherheitsstandards. Deine Daten werden verschlüsselt gespeichert und niemals an Dritte weitergegeben.",
    category: "Sicherheit",
    priority: "high"
  },
  {
    id: 4,
    question: "Was ist der Unterschied zwischen Basic und Premium?",
    answer: "Basic bietet Zugang zu grundlegenden Matching-Funktionen. Premium erweitert um erweiterte Analysen, exklusive Features und Prioritäts-Support.",
    category: "Abonnement",
    priority: "medium"
  },
  {
    id: 5,
    question: "Wie kann ich mein Profil optimieren?",
    answer: "Lade mehrere hochwertige Fotos hoch, vervollständige dein Human Design Chart und beschreibe dich authentisch. Ein vollständiges Profil erhöht deine Match-Chancen erheblich.",
    category: "Profil",
    priority: "medium"
  },
  {
    id: 6,
    question: "Funktioniert die App auch offline?",
    answer: "Die App funktioniert hauptsächlich online, da Matching und Analysen Server-basiert sind. Einige Funktionen wie der Mondkalender sind auch offline verfügbar.",
    category: "Technik",
    priority: "low"
  }
];

// Support-Kategorien
const supportCategories = [
  {
    title: "Technischer Support",
    description: "Hilfe bei technischen Problemen",
    icon: <Zap size={24} />,
    color: "#3b82f6",
    responseTime: "24 Stunden"
  },
  {
    title: "Account & Abonnement",
    description: "Fragen zu Account und Billing",
    icon: <Users size={24} />,
    color: "#10b981",
    responseTime: "12 Stunden"
  },
  {
    title: "Sicherheit & Datenschutz",
    description: "Sicherheitsfragen und Datenschutz",
    icon: <Shield size={24} />,
    color: "#ef4444",
    responseTime: "6 Stunden"
  }
];

// Kontakt-Informationen
const contactInfo = [
  {
    type: "E-Mail",
    value: "support@hd-app.com",
    icon: <Mail size={20} />,
    description: "Für alle allgemeinen Anfragen"
  },
  {
    type: "Live Chat",
    value: "Verfügbar 24/7",
    icon: <MessageCircle size={20} />,
    description: "Sofortige Hilfe im Chat"
  },
  {
    type: "Telefon",
    value: "+49 30 12345678",
    icon: <Phone size={20} />,
    description: "Mo-Fr 9:00-18:00 Uhr"
  }
];

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | false>(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFaqChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setContactForm({
      ...contactForm,
      [field]: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      py: 8
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h1" sx={{
              color: '#FFD700',
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
              textShadow: '0 0 30px rgba(255, 215, 0, 0.8)'
            }}>
              🆘 Support Center
            </Typography>
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Wir helfen dir gerne weiter! Finde Antworten auf deine Fragen oder kontaktiere uns direkt.
            </Typography>
          </Box>
        </motion.div>

        {/* Support-Kategorien */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h4" sx={{ color: '#fff', mb: 4, textAlign: 'center' }}>
            📞 Kontakt-Optionen
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {supportCategories.map((category, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ 
                      color: category.color, 
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {category.icon}
                    </Box>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                      {category.description}
                    </Typography>
                    <Chip 
                      label={`Antwort in ${category.responseTime}`}
                      sx={{ 
                        background: category.color,
                        color: '#fff',
                        fontWeight: 600
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h4" sx={{ color: '#fff', mb: 4, textAlign: 'center' }}>
            ❓ Häufige Fragen
          </Typography>
          
          <Box sx={{ mb: 8 }}>
            {faqData.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expandedFaq === faq.id}
                onChange={handleFaqChange(faq.id)}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  mb: 2,
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown size={20} color="#8B5CF6" />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography variant="h6" sx={{ color: '#fff', flex: 1 }}>
                      {faq.question}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={faq.category}
                        size="small"
                        sx={{ background: '#8B5CF6', color: '#fff' }}
                      />
                      <Chip 
                        label={faq.priority}
                        size="small"
                        sx={{ 
                          background: getPriorityColor(faq.priority),
                          color: '#fff'
                        }}
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </motion.div>

        {/* Kontakt-Formular */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ color: '#fff', mb: 4 }}>
                📧 Kontakt-Formular
              </Typography>
              
              {submitSuccess && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  <CheckCircle size={20} style={{ marginRight: 8 }} />
                  Deine Nachricht wurde erfolgreich gesendet! Wir melden uns innerhalb von 24 Stunden.
                </Alert>
              )}
              
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 4 }}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={contactForm.name}
                          onChange={handleInputChange('name')}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: '#fff',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#8B5CF6' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="E-Mail"
                          type="email"
                          value={contactForm.email}
                          onChange={handleInputChange('email')}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: '#fff',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#8B5CF6' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Betreff"
                          value={contactForm.subject}
                          onChange={handleInputChange('subject')}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: '#fff',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#8B5CF6' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Nachricht"
                          value={contactForm.message}
                          onChange={handleInputChange('message')}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: '#fff',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#8B5CF6' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting}
                          startIcon={<Send size={20} />}
                          sx={{
                            background: 'linear-gradient(45deg, #8B5CF6, #A855F7)',
                            color: '#fff',
                            py: 1.5,
                            px: 4,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 3,
                            '&:hover': {
                              background: 'linear-gradient(45deg, #7C3AED, #9333EA)',
                              transform: 'translateY(-2px)'
                            },
                            '&:disabled': {
                              background: 'rgba(255,255,255,0.1)',
                              color: 'rgba(255,255,255,0.5)'
                            }
                          }}
                        >
                          {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ color: '#fff', mb: 4 }}>
                📞 Direkter Kontakt
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                {contactInfo.map((contact, index) => (
                  <Card key={index} sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    mb: 2
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ color: '#8B5CF6' }}>
                          {contact.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ color: '#fff', mb: 0.5 }}>
                            {contact.type}
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#8B5CF6', fontWeight: 600, mb: 0.5 }}>
                            {contact.value}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {contact.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Support-Status */}
              <Card sx={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 2
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CheckCircle size={20} color="#10b981" />
                    <Typography variant="h6" sx={{ color: '#10b981' }}>
                      Support-Status: Online
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Unser Support-Team ist aktuell verfügbar und antwortet schnell auf deine Anfragen.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>
              Noch nicht gefunden was du suchst?
            </Typography>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              sx={{
                color: '#FFD700',
                borderColor: '#FFD700',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#FFA500',
                  color: '#FFA500',
                  background: 'rgba(255, 215, 0, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Zurück zur Startseite
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
