"use client";
import React, { Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
// import ProtectedRoute from "@/components/ProtectedRoute"; // Removed - app is now public
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar
} from "@mui/material";
import BuildInfo from "@/components/BuildInfo";
import {
  Heart,
  Users,
  Moon,
  ArrowRight,
  Star,
  Check,
  Crown,
  Zap,
  Shield,
  Menu,
  Home,
  UserPlus,
  LogIn
} from "lucide-react";
import { motion } from "framer-motion";
// Temporarily removed problematic components
// import AppFunctionsSection from './components/AppFunctionsSection';
// import DailyImpulse from '@/components/DailyImpulse';

// Import der SSR-sicheren Sterne-Komponente
import SSRSafeStars from '@/components/SSRSafeStars';
import LoadingSpinner from '@/components/LoadingSpinner';

// Hauptfunktionen der App
const mainFeatures = [
  {
    title: "💕 Dating & Matching",
    description: "Finde die Liebe, die wirklich zu dir passt. Basierend auf deinem Human Design und energetischen Kompatibilität.",
    icon: <Heart size={32} />,
    path: "/dating-info",
    color: "linear-gradient(135deg, #ff6b9d, #c44569)",
    features: ["Energetische Kompatibilität", "Human Design Matching", "Authentische Verbindungen"]
  },
  {
    title: "👥 Friends Community",
    description: "Verbinde dich mit Gleichgesinnten, teile Erfahrungen und lerne von der Community.",
    icon: <Users size={32} />,
    path: "/community-info",
    color: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    features: ["Community Hub", "Freunde finden", "Erfahrungen teilen"]
  },
  {
    title: "🌙 Mondkalender",
    description: "Verfolge die Mondphasen und nutze die kosmische Energie für dein Wohlbefinden.",
    icon: <Moon size={32} />,
    path: "/mondkalender-info",
    color: "linear-gradient(135deg, #667eea, #764ba2)",
    features: ["Mondphasen-Tracking", "Energie-Monitoring", "Persönliche Insights"]
  }
];

// Pricing-Pläne
const pricingPlans = [
  {
    name: "Basic",
    price: "0",
    period: "monatlich",
    description: "Perfekt zum Einstieg",
    icon: <Star size={24} />,
    color: "linear-gradient(135deg, #667eea, #764ba2)",
    features: [
      "Human Design Chart",
      "Vollständiger Mondkalender",
      "Community Zugang",
      "Basis-Matching",
      "Bis zu 3 Profilbilder"
    ],
    limitations: [
      "Begrenzte Matches pro Tag",
      "Keine erweiterten Analysen"
    ],
    popular: false,
    cta: "Kostenlos starten",
    href: "/register"
  },
  {
    name: "Premium",
    price: "19",
    period: "monatlich",
    description: "Für ernsthafte Suchende",
    icon: <Crown size={24} />,
    color: "linear-gradient(135deg, #FFD700, #FFA500)",
    features: [
      "Alle Basic Features",
      "Unbegrenzte Matches",
      "Erweiterte Kompatibilitäts-Analyse",
      "Persönliche Readings",
      "Bis zu 10 Profilbilder",
      "Prioritäts-Support",
      "Chart-Vergleichs-Tool"
    ],
    limitations: [],
    popular: true,
    cta: "Premium werden",
    href: "/subscription"
  },
  {
    name: "VIP",
    price: "49",
    period: "monatlich",
    description: "Das komplette Erlebnis",
    icon: <Zap size={24} />,
    color: "linear-gradient(135deg, #ff6b9d, #c44569)",
    features: [
      "Alle Premium Features",
      "1:1 Coaching Sessions",
      "Reiki & Energiearbeit",
      "Unbegrenzte Profilbilder",
      "VIP Community Zugang",
      "Persönlicher Concierge",
      "Früher Zugang zu neuen Features",
      "Exklusive Retreats"
    ],
    limitations: [],
    popular: false,
    cta: "VIP werden",
    href: "/subscription"
  }
];

export default function HomePage() {
  // Entferne den isMounted State komplett für bessere Performance
  // Die Seite soll sofort laden ohne Hydration-Delay

  return (
    <>
      <Head>
        <title>Human Design App - Entdecke deine kosmische Konstitution</title>
        <meta name="description" content="Entdecke dein Human Design Profil, finde energetische Kompatibilität und verbinde dich mit Gleichgesinnten. Dating, Community und spirituelle Entwicklung basierend auf deiner kosmischen Konstitution." />
        <meta name="keywords" content="Human Design, kosmische Konstitution, Dating, Matching, Community, spirituelle Entwicklung, energetische Kompatibilität" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Human Design App - Entdecke deine kosmische Konstitution" />
        <meta property="og:description" content="Entdecke dein Human Design Profil, finde energetische Kompatibilität und verbinde dich mit Gleichgesinnten." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://human-design-app.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Human Design App - Entdecke deine kosmische Konstitution" />
        <meta name="twitter:description" content="Entdecke dein Human Design Profil, finde energetische Kompatibilität und verbinde dich mit Gleichgesinnten." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Navigation Header */}
      <AppBar position="static" sx={{ 
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFD700', fontWeight: 'bold' }}>
            🌙 Human Design App 🚀 LIVE-TEST
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              href="/"
              startIcon={<Home size={20} />}
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Startseite
            </Button>
            <Button
              component={Link}
              href="/dashboard"
              startIcon={<Menu size={20} />}
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Dashboard
            </Button>
            <Button
              component={Link}
              href="/register"
              startIcon={<UserPlus size={20} />}
              variant="outlined"
              sx={{ 
                color: '#FFD700',
                borderColor: '#FFD700',
                '&:hover': { 
                  borderColor: '#FFA500',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)'
                }
              }}
            >
              Registrieren
            </Button>
            <Button
              component={Link}
              href="/login"
              startIcon={<LogIn size={20} />}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                color: 'black',
                fontWeight: 'bold',
                '&:hover': { 
                  background: 'linear-gradient(45deg, #FFA500, #FFD700)'
                }
              }}
            >
              Anmelden
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{
      minHeight: '100%',
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='80' cy='80' r='1'/%3E%3Ccircle cx='40' cy='60' r='0.5'/%3E%3Ccircle cx='60' cy='40' r='0.5'/%3E%3Ccircle cx='90' cy='10' r='0.8'/%3E%3Ccircle cx='10' cy='90' r='0.8'/%3E%3C/g%3E%3C/svg%3E")
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SSRSafeStars 
        count={20} 
        minSize={1} 
        maxSize={4} 
        opacity={0.6}
        animation={true}
      />
      
      {/* Animated Moon */}
      <Box sx={{ position: 'absolute', top: '1%', left: '11%', zIndex: 1 }}>
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, rgba(240,240,240,0.4) 40%, rgba(224,224,224,0.3) 60%, rgba(208,208,208,0.2) 100%)',
              boxShadow: '0 0 40px rgba(255, 255, 255, 0.6), 0 0 80px rgba(255, 255, 255, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.3)',
              margin: '0 auto',
              opacity: 0.8
            }}
          />
        </motion.div>
      </Box>

      {/* Animated Neptune */}
      <Box sx={{ position: 'absolute', top: '15%', right: '8%', zIndex: 1 }}>
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 360],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(65,105,225,0.6) 0%, rgba(30,144,255,0.4) 40%, rgba(0,100,200,0.3) 60%, rgba(0,50,150,0.2) 100%)',
              boxShadow: '0 0 30px rgba(65, 105, 225, 0.8), 0 0 60px rgba(30, 144, 255, 0.4), inset 0 0 20px rgba(65, 105, 225, 0.3)',
              margin: '0 auto',
              opacity: 0.7
            }}
          />
        </motion.div>
      </Box>

      {/* Animated Saturn */}
      <Box sx={{ position: 'absolute', bottom: '20%', left: '5%', zIndex: 1 }}>
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, -180],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(192,192,192,0.5) 0%, rgba(169,169,169,0.4) 40%, rgba(128,128,128,0.3) 60%, rgba(105,105,105,0.2) 100%)',
              boxShadow: '0 0 35px rgba(192, 192, 192, 0.7), 0 0 70px rgba(169, 169, 169, 0.4), inset 0 0 25px rgba(192, 192, 192, 0.3)',
              margin: '0 auto',
              opacity: 0.6,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '8px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(192,192,192,0.3) 20%, rgba(192,192,192,0.5) 50%, rgba(192,192,192,0.3) 80%, transparent 100%)',
                borderRadius: '4px',
                boxShadow: '0 0 10px rgba(192, 192, 192, 0.4)'
              }
            }}
          />
        </motion.div>
      </Box>

      {/* Animated Jupiter */}
      <Box sx={{ position: 'absolute', top: '25%', left: '3%', zIndex: 1 }}>
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, 90],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,140,0,0.4) 0%, rgba(255,165,0,0.3) 40%, rgba(255,69,0,0.2) 60%, rgba(255,0,0,0.1) 100%)',
              boxShadow: '0 0 25px rgba(255, 140, 0, 0.6), 0 0 50px rgba(255, 165, 0, 0.3)',
              margin: '0 auto',
              opacity: 0.5
            }}
          />
        </motion.div>
      </Box>

      {/* Animated Mars */}
      <Box sx={{ position: 'absolute', bottom: '35%', right: '12%', zIndex: 1 }}>
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -90],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,69,0,0.5) 0%, rgba(255,99,71,0.4) 40%, rgba(220,20,60,0.3) 60%, rgba(139,0,0,0.2) 100%)',
              boxShadow: '0 0 20px rgba(255, 69, 0, 0.7), 0 0 40px rgba(255, 99, 71, 0.4)',
              margin: '0 auto',
              opacity: 0.6
            }}
          />
        </motion.div>
      </Box>

      {/* Animated Mercury */}
      <Box sx={{ position: 'absolute', top: '40%', left: '15%', zIndex: 1 }}>
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, 180],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(169,169,169,0.4) 0%, rgba(128,128,128,0.3) 40%, rgba(105,105,105,0.2) 60%, rgba(64,64,64,0.1) 100%)',
              boxShadow: '0 0 15px rgba(169, 169, 169, 0.5), 0 0 30px rgba(128, 128, 128, 0.3)',
              margin: '0 auto',
              opacity: 0.4
            }}
          />
        </motion.div>
      </Box>

      {/* Animated Venus */}
      <Box sx={{ position: 'absolute', bottom: '45%', right: '20%', zIndex: 1 }}>
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 270],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,228,196,0.5) 0%, rgba(255,218,185,0.4) 40%, rgba(255,192,203,0.3) 60%, rgba(255,182,193,0.2) 100%)',
              boxShadow: '0 0 18px rgba(255, 228, 196, 0.6), 0 0 36px rgba(255, 218, 185, 0.3)',
              margin: '0 auto',
              opacity: 0.5
            }}
          />
        </motion.div>
      </Box>

      {/* Animated Uranus */}
      <Box sx={{ position: 'absolute', top: '60%', right: '5%', zIndex: 1 }}>
        <motion.div
          animate={{
            y: [0, -14, 0],
            rotate: [0, 120],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(0,191,255,0.4) 0%, rgba(30,144,255,0.3) 40%, rgba(0,100,200,0.2) 60%, rgba(0,50,150,0.1) 100%)',
              boxShadow: '0 0 22px rgba(0, 191, 255, 0.6), 0 0 44px rgba(30, 144, 255, 0.3)',
              margin: '0 auto',
              opacity: 0.4
            }}
          />
        </motion.div>
      </Box>

      {/* Animated Pluto */}
      <Box sx={{ position: 'absolute', bottom: '10%', right: '25%', zIndex: 1 }}>
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [0, -270],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(75,0,130,0.4) 0%, rgba(138,43,226,0.3) 40%, rgba(72,61,139,0.2) 60%, rgba(25,25,112,0.1) 100%)',
              boxShadow: '0 0 12px rgba(75, 0, 130, 0.5), 0 0 24px rgba(138, 43, 226, 0.3)',
              margin: '0 auto',
              opacity: 0.3
            }}
          />
        </motion.div>
      </Box>

      {/* Animated Chiron */}
      <Box sx={{ position: 'absolute', top: '70%', left: '8%', zIndex: 1 }}>
        <motion.div
          animate={{
            y: [0, -7, 0],
            rotate: [0, 150],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,107,107,0.4) 0%, rgba(255,69,0,0.3) 40%, rgba(255,0,0,0.2) 60%, rgba(139,0,0,0.1) 100%)',
              boxShadow: '0 0 14px rgba(255, 107, 107, 0.5), 0 0 28px rgba(255, 69, 0, 0.3)',
              margin: '0 auto',
              opacity: 0.3
            }}
          />
        </motion.div>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
        {/* Header mit Login/Registrieren Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: { xs: 2, md: 3 },
          position: 'relative',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          {/* Logo/Title */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2.125rem' },
              background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f0f0f0 40%, #e0e0e0 60%, #d0d0d0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.6)',
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            KOSMISCHE VERBINDUNGEN
          </Typography>
          
          {/* App direkt nutzen - Kein Login erforderlich */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Button
              component={Link}
              href="/chart"
              variant="contained"
              size="medium"
              sx={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#000',
                fontWeight: 'bold',
                px: { xs: 2, sm: 3 },
                py: 1,
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFA500, #FFD700)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              🚀 Jetzt starten
            </Button>
            
            <Button
              component={Link}
              href="/dashboard"
              variant="outlined"
              size="medium"
              sx={{
                color: '#C0C0C0',
                borderColor: 'rgba(192, 192, 192, 0.5)',
                fontWeight: 'bold',
                px: { xs: 2, sm: 3 },
                py: 1,
                borderRadius: 2,
                background: 'rgba(192, 192, 192, 0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  background: 'rgba(255, 215, 0, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(255, 215, 0, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              📊 Dashboard
            </Button>
          </Box>
        </Box>

        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 6, md: 12 },
          pt: { xs: 8, md: 16 },
          position: 'relative'
        }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f0f0f0 40%, #e0e0e0 60%, #d0d0d0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 8,
              textShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4)',
              filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))'
            }}
          >
Kosmische Verbindungen
          </Typography>
          
          <Typography 
            variant="h4" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              mb: 3,
              fontWeight: 300,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.5,
              fontSize: '1.4rem'
            }}
          >
            Hast du dich jemals gefragt, warum manche Beziehungen wie Magie funktionieren, 
            während andere trotz aller Bemühungen einfach nicht gelingen?
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#FFD700', 
              mb: 4,
              fontWeight: 600,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.4,
              fontSize: '1.2rem'
            }}
          >
            <em>Die Antwort liegt in deiner energetischen DNA - deinem Human Design.</em>
          </Typography>


          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 2, md: 3 }, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center'
          }}>
            <Button
              component={Link}
              href="/dating-info"
              variant="contained"
              size="large"
              endIcon={<Heart />}
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                color: '#fff',
                fontWeight: 'bold',
                px: 5,
                py: 2,
                borderRadius: 4,
                fontSize: '1.1rem',
                boxShadow: '0 10px 40px rgba(255, 107, 157, 0.4), 0 0 20px rgba(255, 107, 157, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s ease'
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #c44569, #ff6b9d)',
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 15px 50px rgba(255, 107, 157, 0.5), 0 0 30px rgba(255, 107, 157, 0.3)',
                  '&::before': {
                    left: '100%'
                  }
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              💕 Dating starten
            </Button>
            
            <Button
              component={Link}
              href="/community-info"
              variant="contained"
              size="large"
              endIcon={<Users />}
              sx={{
                background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                color: '#fff',
                fontWeight: 'bold',
                px: 5,
                py: 2,
                borderRadius: 4,
                fontSize: '1.1rem',
                boxShadow: '0 10px 40px rgba(78, 205, 196, 0.4), 0 0 20px rgba(78, 205, 196, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s ease'
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #44a08d, #4ecdc4)',
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 15px 50px rgba(78, 205, 196, 0.5), 0 0 30px rgba(78, 205, 196, 0.3)',
                  '&::before': {
                    left: '100%'
                  }
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              👥 Community beitreten
            </Button>
            
            <Button
              component={Link}
              href="/mondkalender-info"
              variant="contained"
              size="large"
              endIcon={<Moon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#fff',
                fontWeight: 'bold',
                px: 5,
                py: 2,
                borderRadius: 4,
                fontSize: '1.1rem',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4), 0 0 20px rgba(102, 126, 234, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s ease'
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2, #667eea)',
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 15px 50px rgba(102, 126, 234, 0.5), 0 0 30px rgba(102, 126, 234, 0.3)',
                  '&::before': {
                    left: '100%'
                  }
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              🌙 Mondkalender
            </Button>
          </Box>
        </Box>

        {/* Friends Community Widget */}
        <Box sx={{ py: 8, mb: 4 }}>
          <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15) 0%, rgba(68, 160, 141, 0.08) 100%)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(78, 205, 196, 0.4)',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(78, 205, 196, 0.3) 0%, transparent 70%)',
                opacity: 0.6
              }
            }}>
              <CardContent sx={{ p: 6, position: 'relative', zIndex: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 3,
                    boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)'
                  }}>
                    <Users size={40} color="white" />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ 
                      color: '#4ecdc4', 
                      fontWeight: 'bold',
                      mb: 1
                    }}>
                      👥 Friends Community
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontWeight: 300
                    }}>
                      Verbinde dich mit Gleichgesinnten
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}>
                  Entdecke eine lebendige Community von Menschen, die Human Design leben und verstehen. 
                  Tausche dich aus, lerne voneinander und finde Menschen, die zu deinem energetischen Design passen.
                </Typography>

                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                        2,500+
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Aktive Mitglieder
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                        150+
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Tägliche Posts
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                        25+
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Events pro Monat
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                        500+
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Erfolgreiche Matches
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    href="/community-info"
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #44a08d, #4ecdc4)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(78, 205, 196, 0.6)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    endIcon={<ArrowRight size={20} />}
                  >
                    Community entdecken
                  </Button>
                  
                  <Button
                    component={Link}
                    href="/friends"
                    variant="outlined"
                    sx={{
                      borderColor: '#4ecdc4',
                      color: '#4ecdc4',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: '#44a08d',
                        color: '#44a08d',
                        background: 'rgba(78, 205, 196, 0.1)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Freunde finden
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Box>

        {/* Hauptfunktionen Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              color: '#FFD700', 
              mb: 6,
              fontWeight: 'bold'
            }}
          >
            🚀 Hauptfunktionen
          </Typography>
          
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {mainFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                  background: `linear-gradient(135deg, ${feature.color.replace('linear-gradient(135deg, ', '').replace(')', '')}15 0%, ${feature.color.replace('linear-gradient(135deg, ', '').replace(')', '')}08 100%)`,
                  backdropFilter: 'blur(15px)',
                  border: `1px solid ${feature.color.replace('linear-gradient(135deg, ', '').replace(')', '')}40`,
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at 50% 0%, ${feature.color.replace('linear-gradient(135deg, ', '').replace(')', '')}30 0%, transparent 70%)`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 20px 40px ${feature.color.replace('linear-gradient(135deg, ', '').replace(')', '')}40, 0 0 60px ${feature.color.replace('linear-gradient(135deg, ', '').replace(')', '')}30`,
                    border: `1px solid ${feature.color.replace('linear-gradient(135deg, ', '').replace(')', '')}60`,
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 3,
                      color: '#FFD700',
                      filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))'
                    }}>
                      {feature.icon}
                      <Typography variant="h5" sx={{ 
                        ml: 2, 
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                      }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 1.6,
                      mb: 3,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                    }}>
                      {feature.description}
                    </Typography>
                    
                    {/* Features List */}
                    <Box sx={{ mb: 3 }}>
                      {feature.features.map((feat, idx) => (
                        <Box key={idx} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 1,
                          color: 'rgba(255,255,255,0.8)'
                        }}>
                          <Star size={16} style={{ 
                            marginRight: 8, 
                            color: '#FFD700',
                            filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))'
                          }} />
                          <Typography component="span" sx={{
                            textShadow: '0 0 3px rgba(255, 255, 255, 0.2)',
                            fontSize: '0.875rem',
                            lineHeight: 1.4
                          }}>
                            {feat}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    {/* Action Button */}
                    <Button
                      component={Link}
                      href={feature.path}
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowRight size={16} />}
                      sx={{
                        color: '#FFD700',
                        borderColor: '#FFD700',
                        fontWeight: 'bold',
                        '&:hover': {
                          borderColor: '#FFA500',
                          color: '#FFA500',
                          background: 'rgba(255, 215, 0, 0.1)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Entdecken
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Zusätzliche Funktionen */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              color: '#FFD700', 
              mb: 6,
              fontWeight: 'bold'
            }}
          >
            ✨ Weitere Features
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              color: 'rgba(255,255,255,0.8)', 
              mb: 4
            }}
          >
            Entdecke alle Tools und Funktionen der Kosmische Verbindungen App
          </Typography>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 215, 0, 0.3)'
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#FFD700', mb: 2 }}>
                    📊 Dashboard
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Dein persönlicher Überblick über Dating, Community und Mondphasen
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 215, 0, 0.3)'
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#FFD700', mb: 2 }}>
                    🧬 Human Design Chart
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Dein einzigartiger energetischer Fingerabdruck für besseres Matching
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 215, 0, 0.3)'
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#FFD700', mb: 2 }}>
                    📚 Knowledge & Journal
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Lerne und dokumentiere deine Reise mit Human Design
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Daily Impulse - Temporarily disabled */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              color: '#FFD700', 
              mb: 6,
              fontWeight: 'bold'
            }}
          >
            ✨ Täglicher Impuls
          </Typography>
          <Card sx={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            maxWidth: 800,
            mx: 'auto'
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: '#FFD700', mb: 2 }}>
                🌟 Energie des Tages
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
                &ldquo;Ich vertraue meiner inneren Weisheit und folge meiner natürlichen Energie.&rdquo;
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Heute ist der perfekte Tag, um auf deine innere Stimme zu hören. Deine Human Design Energie führt dich zu den richtigen Entscheidungen.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Premium Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              color: '#FFD700', 
              mb: 6,
              fontWeight: 'bold'
            }}
          >
            ✨ Premium Features
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              color: 'rgba(255,255,255,0.8)', 
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Entdecke die erweiterten Funktionen für deine spirituelle Reise
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {/* Erweiterte Analysen */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  height: '100%'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#667eea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: 'white'
                        }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Erweiterte Analysen
                      </Typography>
                    </Box>
                    
                    <Typography sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      mb: 2
                    }}>
                      Tiefgreifende Human Design Analysen mit detaillierten Insights zu deiner Persönlichkeit, 
                      Beziehungsdynamiken und Lebensstrategien.
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontSize: '0.8rem' }}>
                        ✓ Detaillierte Typ-Analyse
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontSize: '0.8rem' }}>
                        ✓ Beziehungs-Kompatibilität
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontSize: '0.8rem' }}>
                        ✓ Lebensstrategie-Guide
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}>
                        ✓ Persönliche Empfehlungen
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Readings */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 215, 0, 0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#ff6b9d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: 'white'
                        }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Persönliche Readings
                      </Typography>
                    </Box>
                    
                    <Typography sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      mb: 2
                    }}>
                      Individuelle Human Design Readings von zertifizierten Beratern. 
                      Erhalte tiefe Einblicke in deine kosmische Konstitution und Lebensweg.
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography component="div" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontSize: '0.875rem' }}>
                        ✓ 1:1 Video-Sessions
                      </Typography>
                      <Typography component="div" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontSize: '0.875rem' }}>
                        ✓ Zertifizierte Berater
                      </Typography>
                      <Typography component="div" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontSize: '0.875rem' }}>
                        ✓ Persönlicher Report
                      </Typography>
                      <Typography component="div" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
                        ✓ Follow-up Support
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Events & Meetups */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  height: '100%'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#4ecdc4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: 'white'
                        }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Events & Meetups
                      </Typography>
                    </Box>
                    
                    <Typography sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      mb: 2
                    }}>
                      Vernetze dich mit Gleichgesinnten bei exklusiven Events, Workshops und 
                      spirituellen Meetups in deiner Nähe.
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontSize: '0.8rem' }}>
                        ✓ Lokale Meetups
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontSize: '0.8rem' }}>
                        ✓ Online Workshops
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontSize: '0.8rem' }}>
                        ✓ Retreats & Events
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}>
                        ✓ Networking-Community
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Call-to-Action Section */}
        <Box sx={{ py: 8 }}>
          <motion.div
            
            whileInView={{ opacity: 1, y: 0 }}
            
            
          >
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.1) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              borderRadius: 4,
              p: 6,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Dekorative Elemente */}
              <Box sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: -50,
                left: -50,
                width: 100,
                height: 100,
                background: 'radial-gradient(circle, rgba(255,165,0,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              
              <Typography 
                variant="h3" 
                sx={{ 
                  color: '#FFD700', 
                  mb: 3,
                  fontWeight: 700,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                🚀 Starte deine kosmische Reise
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                Entdecke dein Human Design, finde deine Seelenverwandte und lebe im Einklang 
                mit den kosmischen Rhythmen. Deine Transformation beginnt jetzt.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                position: 'relative',
                zIndex: 2
              }}>
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#FFD700',
                    color: '#FFD700',
                    fontWeight: 700,
                    px: 6,
                    py: 2,
                    mr: 2,
                    '&:hover': {
                      borderColor: '#FFA500',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)'
                    }
                  }}
                >
                  📊 Dashboard
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                    color: '#23233a',
                    fontWeight: 700,
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    borderRadius: 3,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #fbbf24, #FFD700)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 35px rgba(255, 215, 0, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Star size={24} style={{ marginRight: 8 }} />
                  🚀 Jetzt kostenlos starten
                </Button>
                
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontWeight: 700,
                    px: 6,
                    py: 2,
                    ml: 2,
                    '&:hover': {
                      borderColor: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      color: '#FFD700'
                    }
                  }}
                >
                  🔐 Anmelden
                </Button>
                
                <Button
                  component={Link}
                  href="/seitenanzeige"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    fontWeight: 600,
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-3px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ArrowRight size={24} style={{ marginRight: 8 }} />
                  Alle Features entdecken
                </Button>
              </Box>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  mt: 3,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                ✨ Keine Kreditkarte erforderlich • 14 Tage Geld-zurück-Garantie
              </Typography>
            </Card>
          </motion.div>
        </Box>

        {/* Unsere Geschichte Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              color: '#FFD700', 
              mb: 6,
              fontWeight: 'bold'
            }}
          >
            💫 Unsere Geschichte
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              color: 'rgba(255,255,255,0.8)', 
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
              fontStyle: 'italic'
            }}
          >
            Kosmische Verbindungen revolutioniert das Dating durch Human Design - für tiefere Verbindungen und erfüllendere Beziehungen.
          </Typography>

          <Grid container spacing={{ xs: 3, md: 6 }}>
            <Grid item xs={12} sm={6} md={6}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #FFD70015 0%, #FFD70008 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #FFD70040',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #FFD70030 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #FFD70040, 0 0 60px #FFD70030',
                    border: '1px solid #FFD70060',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 4,
                      position: 'relative',
                      zIndex: 2
                    }}>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        borderRadius: '50%',
                        p: 2,
                        mr: 3,
                        filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))',
                        boxShadow: '0 0 20px #FFD70040'
                      }}>
                        <Typography sx={{ fontSize: '2rem' }}>🎯</Typography>
                      </Box>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: '#FFD700', 
                          fontWeight: 700,
                          textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                        }}
                      >
                        Unsere Mission
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.9)', 
                        mb: 4,
                        lineHeight: 1.8,
                        fontSize: '1.2rem',
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                        zIndex: 2
                      }}
                    >
                      Wir haben Kosmische Verbindungen ins Leben gerufen, weil wir selbst erlebt haben, wie schwer es ist, 
                      echte Verbindungen zu finden. Traditionelle Dating-Apps berücksichtigen nur oberflächliche 
                      Aspekte - aber wahre Kompatibilität liegt tiefer.
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.9)', 
                        lineHeight: 1.8,
                        fontSize: '1.2rem',
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                        zIndex: 2
                      }}
                    >
                      Human Design zeigt uns, wer wir wirklich sind und wie wir am besten mit anderen 
                      harmonieren. Es ist die fehlende Verbindung zwischen spiritueller Weisheit und 
                      moderner Technologie.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={6}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #FF6B9D15 0%, #FF6B9D08 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #FF6B9D40',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #FF6B9D30 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #FF6B9D40, 0 0 60px #FF6B9D30',
                    border: '1px solid #FF6B9D60',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 4,
                      position: 'relative',
                      zIndex: 2
                    }}>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                        borderRadius: '50%',
                        p: 2,
                        mr: 3,
                        filter: 'drop-shadow(0 0 15px rgba(255, 107, 157, 0.5))',
                        boxShadow: '0 0 20px #FF6B9D40'
                      }}>
                        <Typography sx={{ fontSize: '2rem' }}>🌟</Typography>
                      </Box>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: '#FFD700', 
                          fontWeight: 700,
                          textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                        }}
                      >
                        Unsere Vision
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.9)', 
                        mb: 4,
                        lineHeight: 1.8,
                        fontSize: '1.2rem',
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                        zIndex: 2
                      }}
                    >
                      Eine Welt, in der jeder seine energetische DNA versteht und 
                      dadurch tiefere, erfüllendere Beziehungen führen kann.
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 3, 
                      flexWrap: 'wrap',
                      position: 'relative',
                      zIndex: 2
                    }}>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        color: '#000',
                        px: { xs: 2, sm: 3 },
                        py: 2,
                        borderRadius: 3,
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 0 10px #FFD70040',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 0 15px #FFD70060'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        ✨ Authentizität
                      </Box>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                        color: '#fff',
                        px: { xs: 2, sm: 3 },
                        py: 2,
                        borderRadius: 3,
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 0 10px #FF6B9D40',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 0 15px #FF6B9D60'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        💕 Tiefe Verbindungen
                      </Box>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
                        color: '#fff',
                        px: { xs: 2, sm: 3 },
                        py: 2,
                        borderRadius: 3,
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 0 10px #4ECDC440',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 0 15px #4ECDC460'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        🌙 Spirituelle Weisheit
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              color: '#FFD700', 
              mb: 6,
              fontWeight: 'bold'
            }}
          >
            💫 Was unsere Nutzer sagen
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {/* Testimonial 1 */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #FFD70015 0%, #FFD70008 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #FFD70040',
                  borderRadius: 3,
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #FFD70030 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #FFD70040, 0 0 60px #FFD70030',
                    border: '1px solid #FFD70060',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <Typography variant="h4" sx={{ 
                    mb: 2,
                    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
                  }}>⭐</Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)', 
                      fontStyle: 'italic',
                      mb: 3,
                      lineHeight: 1.6,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    &quot;Endlich verstehe ich mich selbst! Mein Human Design Chart hat mir gezeigt, 
                    warum ich als Manifestor so anders bin. Die App ist ein Game-Changer!&quot;
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#FFD700', 
                      fontWeight: 700,
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    Sarah M.
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      textShadow: '0 0 3px rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    Manifestor, 28
                  </Typography>
                </Card>
              </motion.div>
            </Grid>

            {/* Testimonial 2 */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #FF6B9D15 0%, #FF6B9D08 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #FF6B9D40',
                  borderRadius: 3,
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #FF6B9D30 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #FF6B9D40, 0 0 60px #FF6B9D30',
                    border: '1px solid #FF6B9D60',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <Typography variant="h4" sx={{ 
                    mb: 2,
                    filter: 'drop-shadow(0 0 10px rgba(255, 107, 157, 0.3))',
                    textShadow: '0 0 20px rgba(255, 107, 157, 0.2)'
                  }}>💕</Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)', 
                      fontStyle: 'italic',
                      mb: 3,
                      lineHeight: 1.6,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    &quot;Durch KOSMISCHE VERBINDUNGEN habe ich meine Seelenverwandte gefunden! Die Kompatibilität 
                    war 98% - beim ersten Date wussten wir beide: Das ist es!&quot;
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#FFD700', 
                      fontWeight: 700,
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    Marcus & Lisa
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      textShadow: '0 0 3px rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    Generator & Projector, verheiratet
                  </Typography>
                </Card>
              </motion.div>
            </Grid>

            {/* Testimonial 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #667eea15 0%, #667eea08 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #667eea40',
                  borderRadius: 3,
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #667eea30 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #667eea40, 0 0 60px #667eea30',
                    border: '1px solid #667eea60',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <Typography variant="h4" sx={{ 
                    mb: 2,
                    filter: 'drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))',
                    textShadow: '0 0 20px rgba(102, 126, 234, 0.2)'
                  }}>🌙</Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)', 
                      fontStyle: 'italic',
                      mb: 3,
                      lineHeight: 1.6,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    &quot;Der Mondkalender hilft mir bei allen wichtigen Entscheidungen. 
                    Ich plane meine Termine nach den Mondphasen - es funktioniert!&quot;
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#FFD700', 
                      fontWeight: 700,
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    Anna K.
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      textShadow: '0 0 3px rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    Reflector, 35
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Pricing Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              color: '#FFD700', 
              mb: 2,
              fontWeight: 'bold'
            }}
          >
            💎 Wähle deinen Plan
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              color: 'rgba(255,255,255,0.8)', 
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Entdecke dein Human Design und finde die Liebe, die wirklich zu dir passt
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                  background: plan.popular 
                    ? 'linear-gradient(135deg, #FFD70015 0%, #FFD70008 100%)' 
                    : 'linear-gradient(135deg, #667eea15 0%, #667eea08 100%)',
                  backdropFilter: 'blur(15px)',
                  border: plan.popular 
                    ? '2px solid #FFD700' 
                    : '1px solid #667eea40',
                  borderRadius: 4,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: plan.popular 
                      ? 'radial-gradient(circle at 50% 0%, #FFD70030 0%, transparent 70%)'
                      : 'radial-gradient(circle at 50% 0%, #667eea30 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: plan.popular 
                      ? '0 20px 40px #FFD70040, 0 0 60px #FFD70030' 
                      : '0 20px 40px #667eea40, 0 0 60px #667eea30',
                    border: plan.popular 
                      ? '2px solid #FFD700' 
                      : '1px solid #667eea60',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  {/* Popular Badge */}
                  {plan.popular && (
                    <Box sx={{
                      position: 'absolute',
                      top: -1,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      color: '#000',
                      px: { xs: 2, sm: 3 },
                      py: 1,
                      borderRadius: '0 0 12px 12px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      zIndex: 2
                    }}>
                      <Shield size={16} style={{ marginRight: 8, display: 'inline' }} />
                      Beliebt
                    </Box>
                  )}
                  
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                    {/* Plan Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: plan.color,
                        mb: 2,
                        boxShadow: plan.popular 
                          ? '0 8px 20px #FFD70040, 0 0 30px #FFD70030'
                          : '0 8px 20px #667eea40, 0 0 30px #667eea30',
                        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
                      }}>
                        {plan.icon}
                      </Box>
                      
                      <Typography variant="h4" sx={{ 
                        color: plan.popular ? '#FFD700' : 'white', 
                        fontWeight: 'bold',
                        mb: 1,
                        textShadow: plan.popular 
                          ? '0 0 10px rgba(255, 215, 0, 0.3)'
                          : '0 0 10px rgba(255, 255, 255, 0.3)'
                      }}>
                        {plan.name}
                      </Typography>
                      
                      <Typography component="div" sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        mb: 2,
                        textShadow: '0 0 3px rgba(255, 255, 255, 0.2)',
                        fontSize: '0.875rem'
                      }}>
                        {plan.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                        <Typography variant="h2" sx={{ 
                          color: plan.popular ? '#FFD700' : 'white',
                          fontWeight: 'bold',
                          mr: 1,
                          textShadow: plan.popular 
                            ? '0 0 15px rgba(255, 215, 0, 0.4)'
                            : '0 0 15px rgba(255, 255, 255, 0.4)'
                        }}>
                          €{plan.price}
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(255,255,255,0.7)',
                          textShadow: '0 0 3px rgba(255, 255, 255, 0.2)'
                        }}>
                          /{plan.period}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Features */}
                    <Box sx={{ flexGrow: 1, mb: 4 }}>
                      <Box sx={{ mb: 2 }}>
                        {plan.features.map((feature, featureIndex) => (
                          <Box key={featureIndex} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 1.5,
                            py: 0.5
                          }}>
                            <Check size={16} style={{ 
                              color: '#10b981', 
                              marginRight: 12,
                              flexShrink: 0,
                              filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.5))'
                            }} />
                            <Typography component="span" sx={{ 
                              color: 'rgba(255,255,255,0.9)',
                              lineHeight: 1.4,
                              textShadow: '0 0 3px rgba(255, 255, 255, 0.2)',
                              fontSize: '0.875rem'
                            }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      {plan.limitations.length > 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                          {plan.limitations.map((limitation, limitIndex) => (
                            <Box key={limitIndex} sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 1,
                              py: 0.5
                            }}>
                              <Box sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                border: '1px solid rgba(255,255,255,0.3)',
                                marginRight: 12,
                                flexShrink: 0
                              }} />
                              <Typography component="span" sx={{ 
                                color: 'rgba(255,255,255,0.5)',
                                lineHeight: 1.4,
                                fontSize: '0.875rem'
                              }}>
                                {limitation}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                    
                    {/* CTA Button */}
                    <Button
                      variant="contained"
                      onClick={() => {
                        console.log(`Plan ausgewählt: ${plan.name}`);
                        
                        // Optional: Plan in localStorage speichern für spätere Verwendung
                        if (plan.name !== 'Basic') {
                          localStorage.setItem('selectedPlan', plan.name.toLowerCase());
                        }
                        
                        // Navigation
                        window.location.href = plan.href;
                      }}
                      sx={{
                        background: plan.popular 
                          ? 'linear-gradient(45deg, #FFD700, #FFA500)' 
                          : 'linear-gradient(45deg, #667eea, #764ba2)',
                        color: plan.popular ? '#000' : 'white',
                        fontWeight: 'bold',
                        py: 2,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        boxShadow: plan.popular 
                          ? '0 8px 20px rgba(255, 215, 0, 0.3)' 
                          : '0 8px 20px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: plan.popular 
                            ? 'linear-gradient(45deg, #FFA500, #FFD700)' 
                            : 'linear-gradient(45deg, #764ba2, #667eea)',
                          transform: 'translateY(-2px)',
                          boxShadow: plan.popular 
                            ? '0 12px 25px rgba(255, 215, 0, 0.4)' 
                            : '0 12px 25px rgba(102, 126, 234, 0.4)'
                        },
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pricing Note */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography component="div" sx={{ 
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 600,
              mx: 'auto',
              fontSize: '0.875rem'
            }}>
              Alle Pläne beinhalten eine 14-tägige Geld-zurück-Garantie. 
              Keine versteckten Kosten, jederzeit kündbar.
            </Typography>
          </Box>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              color: '#FFD700', 
              mb: 6,
              fontWeight: 'bold'
            }}
          >
            ❓ Häufig gestellte Fragen
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              color: 'rgba(255,255,255,0.8)', 
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Alles was du über Human Design und Kosmische Verbindungen wissen musst
          </Typography>

          <Grid container spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
            {/* FAQ Item 1 */}
            <Grid item xs={12} sm={6} md={6}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #FFD70015 0%, #FFD70008 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #FFD70040',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #FFD70030 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #FFD70040, 0 0 60px #FFD70030',
                    border: '1px solid #FFD70060',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#FFD700', 
                      mb: 2,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                    }}>
                      <Box sx={{ 
                        mr: 2, 
                        fontSize: '1.5rem',
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
                      }}>🤔</Box>
                      Was ist Human Design?
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 1.6,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                    }}>
                      Human Design ist ein System, das Astrologie, I Ging, Chakren und Quantenphysik kombiniert. 
                      Es zeigt dir deine energetische DNA und hilft dir zu verstehen, wie du am besten funktionierst 
                      und mit anderen harmonierst.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* FAQ Item 2 */}
            <Grid item xs={12} sm={6} md={6}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #667eea15 0%, #667eea08 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #667eea40',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #667eea30 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #667eea40, 0 0 60px #667eea30',
                    border: '1px solid #667eea60',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#FFD700', 
                      mb: 2,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                    }}>
                      <Box sx={{ 
                        mr: 2, 
                        fontSize: '1.5rem',
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
                      }}>💕</Box>
                      Wie funktioniert das Matching?
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 1.6,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                    }}>
                      Unser Algorithmus analysiert eure Human Design Charts und berechnet die energetische 
                      Kompatibilität. Wir berücksichtigen Typ, Strategie, Autorität und definierte Centers 
                      für das perfekte Match.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* FAQ Item 3 */}
            <Grid item xs={12} sm={6} md={6}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #667eea15 0%, #667eea08 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #667eea40',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #667eea30 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #667eea40, 0 0 60px #667eea30',
                    border: '1px solid #667eea60',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#FFD700', 
                      mb: 2,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                    }}>
                      <Box sx={{ 
                        mr: 2, 
                        fontSize: '1.5rem',
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
                      }}>🌙</Box>
                      Was ist der Mondkalender?
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 1.6,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                    }}>
                      Der Mondkalender zeigt dir die aktuellen Mondphasen und deren Einfluss auf deine Energie. 
                      Du kannst wichtige Entscheidungen und Termine nach den kosmischen Rhythmen planen.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* FAQ Item 4 */}
            <Grid item xs={12} sm={6} md={6}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #667eea15 0%, #667eea08 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #667eea40',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #667eea30 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #667eea40, 0 0 60px #667eea30',
                    border: '1px solid #667eea60',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#FFD700', 
                      mb: 2,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                    }}>
                      <Box sx={{ 
                        mr: 2, 
                        fontSize: '1.5rem',
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
                      }}>💰</Box>
                      Ist die App kostenlos?
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 1.6,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                    }}>
                      Ja! Der Basic Plan ist komplett kostenlos und bietet Zugang zu deinem Human Design Chart, 
                      dem Mondkalender und der Community. Premium Features sind optional verfügbar.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* FAQ Item 5 */}
            <Grid item xs={12} sm={6} md={6}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #667eea15 0%, #667eea08 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #667eea40',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #667eea30 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #667eea40, 0 0 60px #667eea30',
                    border: '1px solid #667eea60',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#FFD700', 
                      mb: 2,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                    }}>
                      <Box sx={{ 
                        mr: 2, 
                        fontSize: '1.5rem',
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
                      }}>🔒</Box>
                      Sind meine Daten sicher?
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 1.6,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                    }}>
                      Absolut! Wir verwenden modernste Verschlüsselung und speichern deine Daten sicher. 
                      Deine Privatsphäre ist uns wichtig - wir teilen niemals persönliche Informationen.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* FAQ Item 6 */}
            <Grid item xs={12} sm={6} md={6}>
              <motion.div
                
                whileInView={{ opacity: 1, y: 0 }}
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #667eea15 0%, #667eea08 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid #667eea40',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, #667eea30 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px #667eea40, 0 0 60px #667eea30',
                    border: '1px solid #667eea60',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}>
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#FFD700', 
                      mb: 2,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                    }}>
                      <Box sx={{ 
                        mr: 2, 
                        fontSize: '1.5rem',
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
                      }}>📱</Box>
                      Gibt es eine Mobile App?
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 1.6,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                    }}>
                      Ja! Kosmische Verbindungen ist als Progressive Web App verfügbar und funktioniert perfekt auf allen 
                      Geräten. Du kannst sie wie eine native App installieren.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Contact Support */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              mb: 3
            }}>
              Weitere Fragen?
            </Typography>
            <Button
              component={Link}
              href="/support"
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
              Support kontaktieren
            </Button>
          </Box>
        </Box>

        {/* CTA Section */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          mb: 4
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#FFD700', 
              mb: 3,
              fontWeight: 'bold'
            }}
          >
            Bereit für deine Reise?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              mb: 4,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Starte jetzt und entdecke dein einzigartiges Human Design
          </Typography>
          
          <Button
            component={Link}
            href="/register"
            variant="contained"
            size="large"
            endIcon={<ArrowRight />}
            sx={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              color: '#000',
              fontWeight: 'bold',
              px: 6,
              py: 2,
              borderRadius: 3,
              fontSize: '1.2rem',
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFA500, #FFD700)',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 40px rgba(255, 215, 0, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Jetzt starten
          </Button>
        </Box>
      </Container>
    </Box>
    <BuildInfo />
    </>
  );
}
