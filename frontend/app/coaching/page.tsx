"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Paper, Chip, Grid, Avatar, Rating, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, IconButton, Divider, Alert, CircularProgress, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { Users, Calendar, ArrowRight, Clock, MapPin, Phone, Mail, BookOpen, User, Send, X, MessageSquare } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import AccessControl from '../../components/AccessControl';
import { UserSubscription } from '../../lib/subscription/types';
import { SubscriptionService } from '../../lib/subscription/subscriptionService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiService } from '@/lib/services/apiService';
import { useLoadingState } from '@/lib/services/loadingService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}

interface CoachExtended {
  id: number;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviews: number;
  experience: string;
  specializations: string[];
  description: string;
  sessions: Array<{ type: string; price: string; duration: string }>;
  availability: string[];
  languages: string[];
  profileUrl: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface BookingData {
  name: string;
  email: string;
  phone: string;
  message: string;
  sessionType: string;
  date: string;
  time: string;
}

export default function CoachingPage() {
  const router = useRouter();
  const [selectedCoach, setSelectedCoach] = useState<CoachExtended | null>(null);
  const [bookingDialog, setBookingDialog] = useState<boolean>(false);
  const [chatDialog, setChatDialog] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ [coachId: number]: Message[] }>({});
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    sessionType: '1:1 Coaching',
    date: '',
    time: ''
  });

  // Buchungsformular State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    sessionType: "", 
    date: "", 
    time: "", 
    message: "" 
  });
  
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading] = useState(false);

  // Authentifizierung prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setIsAuthenticated(false);
        // Keine Authentifizierung erforderlich - App ist öffentlich
        return;
      }

      setIsAuthenticated(true);
      await loadUserSubscription();
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
      console.error('Fehler beim Laden der Subscription:', error);
    }
  };

  const sessionTypes = [
    "1:1 Coaching",
    "Human Design Reading", 
    "Persönlichkeitsentwicklung",
    "Yoga",
    "Energiearbeit",
    "Chart-Analyse",
    "Beziehungs-Coaching",
    "Karriere-Coaching",
    "Business-Strategie",
    "Energie-Coaching",
    "Manifestation",
    "Spiritual Coaching",
    "Paar-Coaching",
    "Meditation & Achtsamkeit"
  ];

  const timeSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { setLoading: setSubmitting } = useLoadingState('coaching-booking');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);
    
    try {
      const response = await apiService.bookCoachingSession({
        ...form,
        coachId: "general-coach",
        sessionType: form.sessionType as "Workshop" | "1:1 Coaching" | "Group Session"
      });
      
      if (response.success) {
        setSuccess("Session-Anfrage erfolgreich versendet! Wir melden uns bald bei dir. ✨");
        setForm({ name: "", email: "", phone: "", sessionType: "", date: "", time: "", message: "" });
        setTimeout(() => {
          setShowBookingForm(false);
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.error?.message || "Fehler beim Senden der Anfrage. Bitte versuche es erneut.");
      }
    } catch {
      setError("Verbindungsfehler. Bitte überprüfe deine Internetverbindung.");
    } finally {
      setSubmitting(false);
    }
  };

  const coaches: CoachExtended[] = [
    {
      id: 1,
      name: "Louisa",
      title: "Human Design Expert & Life Coach",
      avatar: "/api/placeholder/150/150",
      rating: 4.9,
      reviews: 127,
      experience: "8+ Jahre",
      specializations: ["Manifesting Generator", "Emotional Authority", "Beziehungen"],
      description: "Louisa ist eine erfahrene Human Design Expertin, die sich auf Manifesting Generators und emotionale Autorität spezialisiert hat. Sie hilft Menschen dabei, ihre authentische Natur zu leben.",
      sessions: [
        { type: "1:1 Coaching", price: "€120", duration: "60 Min" },
        { type: "Chart-Analyse", price: "€180", duration: "90 Min" },
        { type: "Beziehungs-Coaching", price: "€150", duration: "75 Min" }
      ],
      availability: ["Montag", "Mittwoch", "Freitag"],
      languages: ["Deutsch", "Englisch"],
      profileUrl: "/coaching/louisa",
      isOnline: true
    },
    {
      id: 2,
      name: "Heiko",
      title: "Human Design Coach & Business Mentor",
      avatar: "/api/placeholder/150/150",
      rating: 4.8,
      reviews: 89,
      experience: "6+ Jahre",
      specializations: ["Projector", "Splenic Authority", "Karriere"],
      description: "Heiko ist ein erfahrener Coach, der sich auf Projectors und Karriereentwicklung spezialisiert hat. Er hilft Menschen dabei, ihre natürlichen Talente zu erkennen und zu nutzen.",
      sessions: [
        { type: "1:1 Coaching", price: "€100", duration: "60 Min" },
        { type: "Karriere-Coaching", price: "€140", duration: "75 Min" },
        { type: "Business-Strategie", price: "€160", duration: "90 Min" }
      ],
      availability: ["Dienstag", "Donnerstag", "Samstag"],
      languages: ["Deutsch", "Englisch"],
      profileUrl: "/coaching/heiko",
      isOnline: true
    },
    {
      id: 3,
      name: "Elisabeth",
      title: "Human Design & Beziehungs-Coach",
      avatar: "/api/placeholder/150/150",
      rating: 4.9,
      reviews: 156,
      experience: "10+ Jahre",
      specializations: ["Reflector", "Sacral Authority", "Beziehungen"],
      description: "Elisabeth ist eine empathische Coachin, die sich auf Reflectors und Beziehungsarbeit spezialisiert hat. Sie hilft Menschen dabei, authentische Verbindungen aufzubauen.",
      sessions: [
        { type: "1:1 Coaching", price: "€110", duration: "60 Min" },
        { type: "Beziehungs-Coaching", price: "€140", duration: "75 Min" },
        { type: "Paar-Coaching", price: "€180", duration: "90 Min" }
      ],
      availability: ["Montag", "Dienstag", "Freitag"],
      languages: ["Deutsch", "Englisch"],
      profileUrl: "/coaching/elisabeth",
      isOnline: false,
      lastSeen: "vor 5 Minuten"
    },
    {
      id: 4,
      name: "Janine",
      title: "Human Design & Energie-Coach",
      avatar: "/api/placeholder/150/150",
      rating: 4.7,
      reviews: 73,
      experience: "5+ Jahre",
      specializations: ["Manifestor", "Ego Authority", "Energie-Management"],
      description: "Janine ist eine dynamische Coachin, die sich auf Manifestors und Energie-Management spezialisiert hat. Sie hilft Menschen dabei, ihre Kraft effektiv zu nutzen.",
      sessions: [
        { type: "1:1 Coaching", price: "€95", duration: "60 Min" },
        { type: "Energie-Coaching", price: "€130", duration: "75 Min" },
        { type: "Manifestation", price: "€150", duration: "90 Min" }
      ],
      availability: ["Mittwoch", "Donnerstag", "Samstag"],
      languages: ["Deutsch", "Englisch"],
      profileUrl: "/coaching/janine",
      isOnline: true
    }
  ];

  const communityEvents = [
    {
      title: "Human Design Stammtisch",
      date: "Jeden 1. Dienstag im Monat",
      time: "19:00 - 21:00",
      location: "Online & Berlin",
      participants: 24,
      description: "Regelmäßiger Austausch für Human Design Enthusiasten"
    },
    {
      title: "Chart-Analyse Workshop",
      date: "15. Dezember 2024",
      time: "14:00 - 17:00",
      location: "Online",
      participants: 12,
      description: "Lerne, wie du Human Design Charts liest und interpretierst"
    },
    {
      title: "Beziehungs-Coaching Gruppe",
      date: "Jeden 2. Samstag im Monat",
      time: "10:00 - 12:00",
      location: "Online",
      participants: 8,
      description: "Gruppen-Coaching für Beziehungsfragen"
    }
  ];

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedCoach]);

  // Initialize chat with welcome message
  const initializeChat = (coach: CoachExtended) => {
    if (!messages[coach.id]) {
      const welcomeMessages: Message[] = [
        {
          id: '1',
          text: `Hallo! Ich bin ${coach.name}. Wie kann ich dir heute helfen? 😊`,
          sender: 'coach',
          timestamp: new Date()
        }
      ];
      setMessages(prev => ({
        ...prev,
        [coach.id]: welcomeMessages
      }));
    }
  };

  const handleChat = (coach: CoachExtended) => {
    setSelectedCoach(coach);
    initializeChat(coach);
    setChatDialog(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCoach) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [selectedCoach.id]: [...(prev[selectedCoach.id] || []), userMessage]
    }));

    setNewMessage('');
    setIsTyping(true);

    // Simulate coach response
    setTimeout(() => {
      const responses = [
        "Das ist eine sehr interessante Frage! Lass mich dir das genauer erklären...",
        "Ich verstehe deine Situation. Basierend auf Human Design würde ich dir empfehlen...",
        "Das ist ein wichtiger Punkt. In deinem Chart sehe ich...",
        "Vielen Dank für deine Nachricht! Ich kann dir dabei helfen...",
        "Das ist eine häufige Herausforderung. Lass uns das gemeinsam angehen...",
        "Ich sehe, dass du dich in einer wichtigen Phase befindest. Hier ist mein Rat...",
        "Das klingt nach einer spannenden Entwicklung! Basierend auf deiner Energie...",
        "Ich kann dir dabei helfen, das zu verstehen. Lass mich dir das erklären..."
      ];

      const randomResponse = responses[messages[selectedCoach.id]?.length % responses.length];
      
      const baseTime = new Date('2024-12-10T10:00:00Z').getTime();
      const coachMessage: Message = {
        id: (1000 + (messages[selectedCoach.id]?.length || 0) * 1000).toString(),
        text: randomResponse,
        sender: 'coach',
        timestamp: new Date(baseTime + (messages[selectedCoach.id]?.length || 0) * 1000)
      };

      setMessages(prev => ({
        ...prev,
        [selectedCoach.id]: [...(prev[selectedCoach.id] || []), coachMessage]
      }));

      setIsTyping(false);
    }, 2000 + ((messages[selectedCoach.id]?.length || 0) * 100) % 3000); // Delay between 2-5 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  const handleBookingSubmit = () => {
    console.log('Buchung:', { coach: selectedCoach, data: bookingData });
    setBookingDialog(false);
    setBookingData({
      name: '',
      email: '',
      phone: '',
      message: '',
      sessionType: '1:1 Coaching',
      date: '',
      time: ''
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress size={60} sx={{ color: '#8B5CF6' }} />
      </Box>
    );
  }

  return (
    <AccessControl
      path="/coaching"
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
      
             <Container maxWidth="lg" sx={{ py: 12, pt: 16, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Users size={48} style={{ color: '#FFD700' }} />
              <Typography variant="h1" sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(0,0,0,0.6)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Coaching & Community
              </Typography>
              <Users size={48} style={{ color: '#FFD700' }} />
            </Box>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Typography variant="h5" sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Buche deine persönliche Human Design Session, chatte mit unseren Coaches oder trete unserer Community bei
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Paper sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            mb: 6
          }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&.Mui-selected': {
                    color: '#FFD700'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FFD700',
                  height: 3
                }
              }}
            >
              <Tab label="Coaches buchen" icon={<User size={20} />} />
              <Tab label="Community Events" icon={<Users size={20} />} />
            </Tabs>
          </Paper>
        </motion.div>

        {/* Coaches Tab */}
        {activeTab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Typography variant="h3" sx={{ 
              color: '#ffffff', 
              textAlign: 'center', 
              fontWeight: 700, 
              mb: 6 
            }}>
              Unsere erfahrenen Coaches
            </Typography>
            
                                      <Box sx={{ 
               display: 'grid', 
               gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
               gap: 4, 
               mb: 8 
             }}>
               {coaches.map((coach, index) => (
                 <motion.div
                   key={coach.id}
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                   whileHover={{ y: -8 }}
                 >
                   <Card sx={{
                     background: 'rgba(255, 255, 255, 0.1)',
                     backdropFilter: 'blur(20px)',
                     borderRadius: 8,
                     border: '1px solid rgba(255,255,255,0.2)',
                     boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                     transition: 'all 0.3s ease',
                     height: '100%',
                     '&:hover': {
                       boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                       transform: 'translateY(-5px)'
                     }
                   }}>
                     <CardContent sx={{ p: 4 }}>
                       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                         <Box sx={{ position: 'relative' }}>
                           <Avatar
                             src={coach.avatar}
                             sx={{ 
                               width: 80, 
                               height: 80, 
                               mr: 3,
                               border: '3px solid rgba(255, 215, 0, 0.3)'
                             }}
                           />
                           <Box sx={{
                             position: 'absolute',
                             bottom: 5,
                             right: 5,
                             width: 20,
                             height: 20,
                             borderRadius: '50%',
                             backgroundColor: coach.isOnline ? '#FFD700' : '#6b7280',
                             border: '2px solid #1f2937'
                           }} />
                         </Box>
                         <Box sx={{ flex: 1 }}>
                           <Typography variant="h5" sx={{
                             color: '#ffffff',
                             fontWeight: 700,
                             mb: 1
                           }}>
                             {coach.name}
                           </Typography>
                           <Typography variant="body1" sx={{
                             color: 'rgba(255,255,255,0.8)',
                             mb: 1
                           }}>
                             {coach.title}
                           </Typography>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Rating value={coach.rating} readOnly size="small" />
                             <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                               {coach.rating} ({coach.reviews} Bewertungen)
                             </Typography>
                           </Box>
                           <Typography variant="body2" sx={{ 
                             color: coach.isOnline ? '#FFD700' : '#6b7280',
                             fontSize: '0.8rem',
                             mt: 0.5
                           }}>
                             {coach.isOnline ? 'Online' : `Zuletzt gesehen ${coach.lastSeen}`}
                           </Typography>
                         </Box>
                       </Box>

                       <Typography sx={{
                         color: 'rgba(255,255,255,0.9)',
                         mb: 3,
                         lineHeight: 1.6
                       }}>
                         {coach.description}
                       </Typography>

                       <Box sx={{ mb: 3 }}>
                         <Typography variant="h6" sx={{
                           color: '#ffffff',
                           fontWeight: 600,
                           mb: 2
                         }}>
                           Spezialisierungen:
                         </Typography>
                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                           {coach.specializations.map((spec, idx) => (
                             <Chip
                               key={idx}
                               label={spec}
                               size="small"
                               sx={{
                                 background: 'rgba(255, 215, 0, 0.2)',
                                 color: '#FFD700',
                                 border: '1px solid rgba(255, 215, 0, 0.3)'
                               }}
                             />
                           ))}
                         </Box>
                       </Box>

                       <Box sx={{ mb: 3 }}>
                         <Typography variant="h6" sx={{
                           color: '#ffffff',
                           fontWeight: 600,
                           mb: 2
                         }}>
                           Sessions:
                         </Typography>
                         {coach.sessions.map((session, idx) => (
                           <Box key={idx} sx={{ 
                             display: 'flex', 
                             justifyContent: 'space-between', 
                             alignItems: 'center',
                             mb: 1,
                             p: 1,
                             background: 'rgba(255, 215, 0, 0.1)',
                             borderRadius: 1
                           }}>
                             <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                               {session.type} ({session.duration})
                             </Typography>
                             <Typography sx={{ 
                               color: '#FFD700', 
                               fontWeight: 600 
                             }}>
                               {session.price}
                             </Typography>
                           </Box>
                         ))}
                       </Box>

                       <Box sx={{ display: 'flex', gap: 2 }}>
                         <Button
                           component={Link}
                           href={coach.profileUrl}
                           variant="outlined"
                           sx={{
                             flex: 1,
                             borderColor: 'rgba(255, 215, 0, 0.3)',
                             color: '#FFD700',
                             fontWeight: 600,
                             py: 2,
                             borderRadius: 3,
                             '&:hover': {
                               borderColor: '#FFD700',
                               backgroundColor: 'rgba(255, 215, 0, 0.1)'
                             }
                           }}
                         >
                           Profil ansehen <BookOpen size={16} style={{ marginLeft: 4 }} />
                         </Button>
                         <Button
                           variant="outlined"
                           onClick={() => handleChat(coach)}
                           disabled={!coach.isOnline}
                           sx={{
                             flex: 1,
                             borderColor: coach.isOnline ? 'rgba(255, 215, 0, 0.3)' : '#6b7280',
                             color: coach.isOnline ? '#FFD700' : '#6b7280',
                             fontWeight: 600,
                             py: 2,
                             borderRadius: 3,
                             '&:hover': {
                               borderColor: coach.isOnline ? '#FFD700' : '#6b7280',
                               backgroundColor: coach.isOnline ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                             }
                           }}
                         >
                           Chat <MessageSquare size={16} style={{ marginLeft: 4 }} />
                         </Button>
                         <Button
                           onClick={() => setShowBookingForm(true)}
                           variant="contained"
                           sx={{
                             flex: 1,
                             background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                             color: '#23233a',
                             fontWeight: 700,
                             py: 2,
                             borderRadius: 3,
                             fontSize: '1.1rem',
                             boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                             '&:hover': {
                               background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                               transform: 'translateY(-2px)',
                               boxShadow: '0 12px 35px rgba(255, 215, 0, 0.4)'
                             }
                           }}
                         >
                           Session buchen <ArrowRight size={20} style={{ marginLeft: 8 }} />
                         </Button>
                       </Box>
                     </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </Box>
          </motion.div>
        )}

        {/* Community Events Tab */}
        {activeTab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Typography variant="h3" sx={{ 
              color: '#fef3c7', 
              textAlign: 'center', 
              fontWeight: 700, 
              mb: 6 
            }}>
              Community Events
            </Typography>
            
                                      <Box sx={{ 
               display: 'grid', 
               gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
               gap: 4 
             }}>
               {communityEvents.map((event, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                   whileHover={{ y: -8 }}
                 >
                    <Card sx={{
                      background: 'linear-gradient(135deg, rgba(254,243,199,0.1) 0%, rgba(254,243,199,0.05) 100%)',
                      borderRadius: 4,
                      border: '1px solid rgba(254,243,199,0.2)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{
                          color: '#fef3c7',
                          fontWeight: 700,
                          mb: 2
                        }}>
                          {event.title}
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Calendar size={16} color="#fef3c7" />
                            <Typography sx={{ color: 'rgba(254,243,199,0.8)' }}>
                              {event.date}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Clock size={16} color="#fef3c7" />
                            <Typography sx={{ color: 'rgba(254,243,199,0.8)' }}>
                              {event.time}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <MapPin size={16} color="#fef3c7" />
                            <Typography sx={{ color: 'rgba(254,243,199,0.8)' }}>
                              {event.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Users size={16} color="#fef3c7" />
                            <Typography sx={{ color: 'rgba(254,243,199,0.8)' }}>
                              {event.participants} Teilnehmer
                            </Typography>
                          </Box>
                        </Box>

                        <Typography sx={{
                          color: 'rgba(254,243,199,0.9)',
                          mb: 3,
                          lineHeight: 1.6
                        }}>
                          {event.description}
                        </Typography>

                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            borderColor: '#fef3c7',
                            color: '#fef3c7',
                            fontWeight: 600,
                            py: 2,
                            borderRadius: 3,
                            '&:hover': {
                              borderColor: '#fde68a',
                              backgroundColor: 'rgba(254,243,199,0.1)'
                            }
                          }}
                        >
                          Event beitreten
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
          </motion.div>
        )}

        {/* Chat Dialog */}
        <Dialog 
          open={chatDialog} 
          onClose={() => setChatDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, rgba(254,243,199,0.95) 0%, rgba(254,243,199,0.9) 100%)',
              borderRadius: 4,
              border: '1px solid rgba(254,243,199,0.3)',
              height: '80vh'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#1f2937', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={selectedCoach?.avatar} sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography variant="h6">{selectedCoach?.name}</Typography>
                <Typography variant="body2" sx={{ 
                  color: selectedCoach?.isOnline ? '#10b981' : '#6b7280',
                  fontSize: '0.8rem'
                }}>
                  {selectedCoach?.isOnline ? 'Online' : `Zuletzt gesehen ${selectedCoach?.lastSeen}`}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setChatDialog(false)}>
              <X size={20} />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {selectedCoach && messages[selectedCoach.id]?.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Box sx={{
                    maxWidth: '70%',
                    background: message.sender === 'user' 
                      ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                      : 'rgba(31, 41, 55, 0.1)',
                    color: message.sender === 'user' ? '#fff' : '#1f2937',
                    p: 2,
                    borderRadius: 3,
                    position: 'relative'
                  }}>
                    <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {message.text}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.7rem', 
                      opacity: 0.7, 
                      mt: 0.5,
                      textAlign: 'right'
                    }}>
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              {isTyping && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                  <Box sx={{
                    background: 'rgba(31, 41, 55, 0.1)',
                    p: 2,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Box sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#6b7280',
                        animation: 'typing 1.4s infinite ease-in-out'
                      }} />
                      <Box sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#6b7280',
                        animation: 'typing 1.4s infinite ease-in-out 0.2s'
                      }} />
                      <Box sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#6b7280',
                        animation: 'typing 1.4s infinite ease-in-out 0.4s'
                      }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {selectedCoach?.name} schreibt...
                    </Typography>
                  </Box>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Schreibe eine Nachricht..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.8)'
                  }
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)'
                  },
                  '&:disabled': {
                    background: '#e5e7eb',
                    color: '#9ca3af'
                  }
                }}
              >
                <Send size={20} />
              </IconButton>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Booking Dialog */}
        <Dialog 
          open={bookingDialog} 
          onClose={() => setBookingDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, rgba(254,243,199,0.95) 0%, rgba(254,243,199,0.9) 100%)',
              borderRadius: 4,
              border: '1px solid rgba(254,243,199,0.3)'
            }
          }}
        >
          <DialogTitle sx={{ color: '#1f2937', fontWeight: 700 }}>
            Session buchen bei {selectedCoach?.name}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-Mail"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefon"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Session-Typ"
                  select
                  value={bookingData.sessionType}
                  onChange={(e) => setBookingData({...bookingData, sessionType: e.target.value})}
                  sx={{ mb: 2 }}
                >
                                     {selectedCoach?.sessions.map((session, idx) => (
                    <option key={idx} value={session.type}>
                      {session.type} - {session.price}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Datum"
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Uhrzeit"
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nachricht (optional)"
                  multiline
                  rows={3}
                  value={bookingData.message}
                  onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setBookingDialog(false)}
              sx={{ color: '#64748b' }}
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handleBookingSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: '#fff',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)'
                }
              }}
            >
              Buchung bestätigen
            </Button>
          </DialogActions>
        </Dialog>

        {/* Buchungsformular Modal */}
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: 600, width: '100%' }}
            >
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.98)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 4, 
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                maxHeight: '90vh',
                overflow: 'auto'
              }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ 
                      color: '#4b2e83', 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <BookOpen size={28} style={{ color: '#667eea' }} />
                      Session buchen
                    </Typography>
                    <Button
                      onClick={() => setShowBookingForm(false)}
                      sx={{ 
                        color: '#667eea',
                        minWidth: 'auto',
                        p: 1,
                        '&:hover': { background: 'rgba(102, 126, 234, 0.1)' }
                      }}
                    >
                      ✕
                    </Button>
                  </Box>

                  {/* Erfolgs- und Fehlermeldungen */}
                  {success && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                      {success}
                    </Alert>
                  )}
                  
                  {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {/* Formular */}
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <User size={20} style={{ color: '#667eea' }} />
                      <TextField 
                        label="Name" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        required 
                        fullWidth 
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            },
                            '&.Mui-focused': {
                              borderColor: '#667eea'
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Email */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Mail size={20} style={{ color: '#667eea' }} />
                      <TextField 
                        label="E-Mail" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} 
                        required 
                        fullWidth 
                        type="email"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Telefon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Phone size={20} style={{ color: '#667eea' }} />
                      <TextField 
                        label="Telefon" 
                        name="phone" 
                        value={form.phone} 
                        onChange={handleChange} 
                        required 
                        fullWidth 
                        type="tel"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Session-Typ */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <BookOpen size={20} style={{ color: '#667eea' }} />
                      <TextField
                        select
                        name="sessionType"
                        value={form.sessionType}
                        onChange={handleChange}
                        required
                        fullWidth
                        label="Session-Typ"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            fontWeight: 500
                          }
                        }}
                      >
                        {sessionTypes.map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    
                    {/* Datum und Uhrzeit in einer Reihe */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Calendar size={20} style={{ color: '#667eea' }} />
                        <TextField 
                          label="Datum" 
                          name="date" 
                          value={form.date} 
                          onChange={handleChange} 
                          required 
                          fullWidth 
                          type="date"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.9)',
                              '&:hover': {
                                background: 'rgba(255,255,255,1)',
                              }
                            },
                            '& .MuiInputBase-input': {
                              color: '#4b2e83',
                            },
                            '& .MuiInputLabel-root': {
                              color: '#667eea',
                              fontWeight: 500
                            }
                          }} 
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Clock size={20} style={{ color: '#667eea' }} />
                        <TextField
                          select
                          name="time"
                          value={form.time}
                          onChange={handleChange}
                          required
                          fullWidth
                          label="Uhrzeit"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.9)',
                              '&:hover': {
                                background: 'rgba(255,255,255,1)',
                              }
                            },
                            '& .MuiInputBase-input': {
                              color: '#4b2e83',
                            },
                            '& .MuiInputLabel-root': {
                              color: '#667eea',
                              fontWeight: 500
                            }
                          }}
                        >
                          {timeSlots.map(time => (
                            <MenuItem key={time} value={time}>{time}</MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    </Box>
                    
                    {/* Nachricht */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <MessageSquare size={20} style={{ color: '#667eea', marginTop: '8px' }} />
                      <TextField 
                        label="Nachricht (optional)" 
                        name="message" 
                        value={form.message} 
                        onChange={handleChange} 
                        fullWidth 
                        multiline 
                        minRows={3}
                        placeholder="Erzähle mir von deinem Anliegen oder deinen Fragen..."
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        mt: 2, 
                        borderRadius: 2, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        color: '#fff', 
                        fontWeight: 700, 
                        fontSize: 16, 
                        py: 1.5,
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                          boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                        },
                        '&:disabled': { 
                          opacity: 0.7,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        } 
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={20} sx={{ color: '#fff' }} />
                          Wird gesendet...
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Send size={18} />
                          Anfrage absenden
                        </Box>
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </Container>

      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
      </Box>
    </AccessControl>
  );
}
