"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress, 
  Avatar, 
  Chip,
  Grid,
  LinearProgress,
  IconButton,
  Container,
  Paper
} from "@mui/material";
import {
  Heart, 
  X, 
  Users, 
  MessageCircle, 
  Eye, 
  Zap, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Target,
  Activity,
  TrendingUp
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import ProfileImageCarousel from '../../components/ProfileImageCarousel';
import UnifiedPageLayout from '@/components/UnifiedPageLayout';

interface ProfileImage {
  id: string;
  url: string;
  is_primary: boolean;
  uploaded_at: string;
  order: number;
  alt_text?: string;
}

interface Profile {
  _id: string;
  name: string;
  bio?: string;
  age?: number;
  location?: string;
  hdType?: string;
  hdProfile?: string;
  hdStrategy?: string;
  hdAuthority?: string;
  interests?: string[];
  image?: string; // Legacy - wird durch profile_images ersetzt
  profile_images?: ProfileImage[]; // Neue Multi-Image Struktur
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
}

interface EnergeticCompatibility {
  overallScore: number;
  energyFlow: number;
  communication: number;
  emotional: number;
  spiritual: number;
  challenges: string[];
  synergies: string[];
  recommendations: string[];
}

interface Match {
  _id: string;
  id?: string; // Für Kompatibilität mit verschiedenen Datenquellen
  userA: { _id: string; name: string; image?: string };
  userB: { _id: string; name: string; image?: string };
  createdAt: string;
}


export default function SwipePage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null); // Temporarily disabled
  const [matches, setMatches] = useState<Match[]>([]);
  const [showMatches, setShowMatches] = useState(false);
  const [swipeAnim, setSwipeAnim] = useState<'none' | 'left' | 'right'>('none');
  const [showMatchAnim, setShowMatchAnim] = useState(false);
  const [matchName, setMatchName] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [compatibility, setCompatibility] = useState<EnergeticCompatibility | null>(null);
  const [dataSource, setDataSource] = useState<'real' | 'mock' | 'unknown'>('unknown');

  // Mock-Daten für den Fall, dass der Backend-Server nicht läuft
  const mockProfiles: Profile[] = React.useMemo(() => [
    {
      _id: '1',
      name: 'Sarah',
      age: 28,
      location: 'Berlin',
      hdType: 'Generator',
      hdProfile: '2/4',
      hdStrategy: 'Auf andere reagieren',
      hdAuthority: 'Sakral',
      bio: 'Energiegeladene Generator, die gerne neue Menschen kennenlernt und tiefgründige Gespräche führt. Liebt es, anderen zu helfen und ihre Energie zu teilen.',
      interests: ['Yoga', 'Musik', 'Reisen', 'Human Design', 'Meditation', 'Kochen'],
      birthDate: '1995-06-15',
      birthTime: '14:30',
      birthPlace: 'Berlin',
      image: '/api/placeholder/400/400', // Legacy
      profile_images: [
        {
          id: '1-1',
          url: '/api/placeholder/400/400',
          is_primary: true,
          uploaded_at: '2024-01-15T10:00:00Z',
          order: 0,
          alt_text: 'Sarah Hauptbild'
        },
        {
          id: '1-2',
          url: '/api/placeholder/400/400',
          is_primary: false,
          uploaded_at: '2024-01-16T10:00:00Z',
          order: 1,
          alt_text: 'Sarah beim Yoga'
        },
        {
          id: '1-3',
          url: '/api/placeholder/400/400',
          is_primary: false,
          uploaded_at: '2024-01-17T10:00:00Z',
          order: 2,
          alt_text: 'Sarah beim Kochen'
        }
      ]
    },
    {
      _id: '2',
      name: 'Michael',
      age: 32,
      location: 'Hamburg',
      hdType: 'Projector',
      hdProfile: '3/5',
      hdStrategy: 'Warten auf Einladung',
      hdAuthority: 'Splenic',
      bio: 'Empathischer Projector, der gerne anderen hilft, ihre Energie zu verstehen. Experte für energetische Führung und tiefe Verbindungen.',
      interests: ['Coaching', 'Natur', 'Kunst', 'Spiritualität', 'Astrologie', 'Heilung'],
      birthDate: '1991-03-22',
      birthTime: '09:15',
      birthPlace: 'Hamburg',
      image: '/api/placeholder/400/400', // Legacy
      profile_images: [
        {
          id: '2-1',
          url: '/api/placeholder/400/400',
          is_primary: true,
          uploaded_at: '2024-01-15T10:00:00Z',
          order: 0,
          alt_text: 'Michael Hauptbild'
        },
        {
          id: '2-2',
          url: '/api/placeholder/400/400',
          is_primary: false,
          uploaded_at: '2024-01-16T10:00:00Z',
          order: 1,
          alt_text: 'Michael in der Natur'
        }
      ]
    },
    {
      _id: '3',
      name: 'Lisa',
      age: 26,
      location: 'München',
      hdType: 'Manifestor',
      hdProfile: '1/3',
      hdStrategy: 'Informieren',
      hdAuthority: 'Ego',
      bio: 'Direkte Manifestor, die weiß, was sie will und es auch bekommt. Pionierin mit starkem Willen und klaren Zielen.',
      interests: ['Sport', 'Kochen', 'Lesen', 'Selbstentwicklung', 'Business', 'Fitness'],
      birthDate: '1997-11-08',
      birthTime: '16:45',
      birthPlace: 'München',
      image: '/api/placeholder/400/400'
    },
    {
      _id: '4',
      name: 'Anna',
      age: 29,
      location: 'Köln',
      hdType: 'Reflector',
      hdProfile: '6/2',
      hdStrategy: 'Warten auf Mondzyklus',
      hdAuthority: 'Lunar',
      bio: 'Sensible Reflector, die die Energie ihrer Umgebung widerspiegelt. Braucht Zeit für Entscheidungen und liebt tiefe Gespräche.',
      interests: ['Astrologie', 'Mondzyklen', 'Heilung', 'Kunst', 'Musik', 'Natur'],
      birthDate: '1994-08-12',
      birthTime: '22:15',
      birthPlace: 'Köln',
      image: '/api/placeholder/400/400'
    },
    {
      _id: '5',
      name: 'David',
      age: 35,
      location: 'Frankfurt',
      hdType: 'Generator',
      hdProfile: '4/6',
      hdStrategy: 'Auf andere reagieren',
      hdAuthority: 'Sakral',
      bio: 'Erfahrener Generator mit tiefem Verständnis für energetische Verbindungen. Mentor und spiritueller Führer.',
      interests: ['Human Design', 'Spiritualität', 'Mentoring', 'Reisen', 'Philosophie', 'Heilung'],
      birthDate: '1988-12-03',
      birthTime: '07:45',
      birthPlace: 'Frankfurt',
      image: '/api/placeholder/400/400'
    }
  ], []); // useMemo dependency array

  // Mock-Benutzer-Daten (würde normalerweise aus der API kommen)
  const currentUserProfile: Profile = {
    _id: 'current-user',
    name: 'Max',
    age: 30,
    location: 'Hamburg',
    hdType: 'Generator',
    hdProfile: '2/4',
    hdStrategy: 'Auf andere reagieren',
    hdAuthority: 'Sakral',
    birthDate: '1993-05-10',
    birthTime: '12:00',
    birthPlace: 'Hamburg'
  };

  useEffect(() => {
    setMounted(true);
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId || "demo-user");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Lade Profile von Supabase
    const loadProfiles = async () => {
      try {
        setLoading(true);
        
        // Verwende Supabase matching_profiles Tabelle
        const { data, error } = await supabase
          .from('matching_profiles')
          .select('*')
          .neq('user_id', userId) // Alle Profile außer dem aktuellen Benutzer
          .eq('is_active', true); // Nur aktive Profile
        
        if (error) {
          console.error('Fehler beim Laden der Profile:', error);
          // Fallback zu Mock-Daten
          setProfiles(mockProfiles);
          setDataSource('mock');
          console.log('⚠️ Supabase-Fehler, verwende Mock-Daten');
        } else {
          if (data && data.length > 0) {
            // Transformiere die Daten für die Komponente
            const transformedProfiles = data.map(profile => ({
              _id: profile.id,
              name: profile.name,
              bio: profile.bio,
              age: profile.age,
              location: profile.location,
              hdType: profile.hd_type,
              hdProfile: profile.profile,
              hdStrategy: profile.strategy,
              hdAuthority: profile.authority,
              interests: profile.interests || [],
              birthDate: profile.created_at?.split('T')[0],
              birthTime: '12:00', // Fallback
              birthPlace: profile.location,
              image: profile.avatar,
              profile_images: profile.images ? profile.images.map((img: any, index: number) => ({
                id: `img-${index}`,
                url: img,
                is_primary: index === 0,
                uploaded_at: new Date().toISOString(),
                order: index
              })) : []
            }));
            
            setProfiles(transformedProfiles);
            setDataSource('real');
            console.log(`✅ ${data.length} echte Profile von Supabase geladen`);
          } else {
            // Fallback zu Mock-Daten wenn keine echten Profile vorhanden
            setProfiles(mockProfiles);
            setDataSource('mock');
            console.log('⚠️ Keine Profile in Supabase, verwende Mock-Daten');
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Profile:', error);
        // Fallback zu Mock-Daten bei Verbindungsfehler
        setProfiles(mockProfiles);
        setDataSource('mock');
        console.log('⚠️ Verbindungsfehler, verwende Mock-Daten');
      } finally {
        setLoading(false);
      }
    };

    // Lade auch Matches
    const loadMatches = async () => {
      try {
        if (!userId) {
          console.log('Keine User-ID verfügbar, verwende Mock-Matches');
          setMatches([
            {
              _id: '1',
              id: '1',
              userA: { _id: 'current-user', name: 'Du', image: '/api/placeholder/60/60' },
              userB: { _id: '1', name: 'Sarah', image: '/api/placeholder/60/60' },
              createdAt: new Date().toISOString()
            },
            {
              _id: '2',
              id: '2',
              userA: { _id: 'current-user', name: 'Du', image: '/api/placeholder/60/60' },
              userB: { _id: '2', name: 'Michael', image: '/api/placeholder/60/60' },
              createdAt: new Date().toISOString()
            }
          ]);
          return;
        }

        // Verwende Supabase statt Backend-Server
        const { data, error } = await supabase
          .from('dating_matches')
          .select('*')
          .eq('user_id', userId);
        
        if (error) {
          console.error('Fehler beim Laden der Matches:', error);
          // Fallback zu Mock-Matches
          setMatches([
            {
              _id: '1',
              id: '1',
              userA: { _id: userId || 'current-user', name: 'Du', image: '/api/placeholder/60/60' },
              userB: { _id: '1', name: 'Sarah', image: '/api/placeholder/60/60' },
              createdAt: new Date().toISOString()
            },
            {
              _id: '2',
              id: '2',
              userA: { _id: userId || 'current-user', name: 'Du', image: '/api/placeholder/60/60' },
              userB: { _id: '2', name: 'Michael', image: '/api/placeholder/60/60' },
              createdAt: new Date().toISOString()
            }
          ]);
        } else {
          setMatches(data || []);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Matches:', error);
        // Fallback zu Mock-Matches
        setMatches([
          {
            _id: '1',
            id: '1',
            userA: { _id: userId || 'current-user', name: 'Du', image: '/api/placeholder/60/60' },
            userB: { _id: '1', name: 'Sarah', image: '/api/placeholder/60/60' },
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            id: '2',
            userA: { _id: userId || 'current-user', name: 'Du', image: '/api/placeholder/60/60' },
            userB: { _id: '2', name: 'Michael', image: '/api/placeholder/60/60' },
            createdAt: new Date().toISOString()
          }
        ]);
      }
    };

    loadProfiles();
    
    // Lade Matches - die Funktion behandelt bereits alle Fehler
    loadMatches().catch((error) => {
      console.error('Unerwarteter Fehler beim Laden der Matches:', error);
      // Fallback zu leeren Matches
      setMatches([]);
    });
  }, [mounted, userId, mockProfiles]);

  // Energetische Kompatibilität berechnen
  const calculateCompatibility = (user1: Profile, user2: Profile): EnergeticCompatibility => {
    let energyFlow = 0;
    let communication = 0;
    let emotional = 0;
    let spiritual = 0;
    const challenges: string[] = [];
    const synergies: string[] = [];
    const recommendations: string[] = [];

    // HD-Typ Kompatibilität (erweitert)
    if (user1.hdType === 'Generator' && user2.hdType === 'Projector') {
      energyFlow += 30;
      synergies.push('🌟 Perfekte Energie-Synergie: Generator liefert, Projector leitet');
      synergies.push('💫 Projector kann Generator optimal führen und unterstützen');
      recommendations.push('Projector sollte auf Einladung warten, Generator sollte auf Reaktionen hören');
      recommendations.push('Gemeinsame Projekte fördern die natürliche Dynamik');
    } else if (user1.hdType === 'Projector' && user2.hdType === 'Generator') {
      energyFlow += 30;
      synergies.push('🌟 Perfekte Energie-Synergie: Projector leitet, Generator liefert');
      synergies.push('💫 Projector kann Generator optimal führen und unterstützen');
      recommendations.push('Projector sollte auf Einladung warten, Generator sollte auf Reaktionen hören');
      recommendations.push('Gemeinsame Projekte fördern die natürliche Dynamik');
    } else if (user1.hdType === 'Manifestor' && user2.hdType === 'Generator') {
      energyFlow += 25;
      synergies.push('⚡ Manifestor initiiert, Generator reagiert - starke Dynamik');
      synergies.push('🎯 Gemeinsame Ziele werden effizient erreicht');
      recommendations.push('Manifestor sollte immer informieren, Generator sollte warten');
      recommendations.push('Respekt für unterschiedliche Energien ist wichtig');
    } else if (user1.hdType === 'Generator' && user2.hdType === 'Manifestor') {
      energyFlow += 25;
      synergies.push('⚡ Generator reagiert, Manifestor initiiert - starke Dynamik');
      synergies.push('🎯 Gemeinsame Ziele werden effizient erreicht');
      recommendations.push('Generator sollte warten, Manifestor sollte informieren');
      recommendations.push('Respekt für unterschiedliche Energien ist wichtig');
    } else if (user1.hdType === 'Reflector' && user2.hdType !== 'Reflector') {
      energyFlow += 20;
      synergies.push('🌙 Reflector spiegelt die Energie des anderen');
      synergies.push('🔮 Tiefe Einsichten durch Spiegelung möglich');
      recommendations.push('Reflector braucht Zeit für Entscheidungen (Mondzyklus)');
      recommendations.push('Geduld und Verständnis für die Spiegelung');
    } else if (user1.hdType === 'Generator' && user2.hdType === 'Generator') {
      energyFlow += 15;
      synergies.push('⚡ Zwei Generatoren können sich gegenseitig energetisieren');
      challenges.push('Beide müssen lernen, auf Reaktionen zu warten');
      recommendations.push('Geduld üben und nicht gleichzeitig initiieren');
    } else if (user1.hdType === 'Projector' && user2.hdType === 'Projector') {
      energyFlow += 10;
      challenges.push('Zwei Projectoren brauchen einen Generator für Energie');
      challenges.push('Beide warten auf Einladungen');
      recommendations.push('Gemeinsame Aktivitäten mit Generatoren suchen');
      recommendations.push('Sich gegenseitig einladen und wertschätzen');
    } else if (user1.hdType === 'Manifestor' && user2.hdType === 'Manifestor') {
      energyFlow += 5;
      challenges.push('Zwei Manifestoren können sich gegenseitig blockieren');
      challenges.push('Beide wollen initiieren und kontrollieren');
      recommendations.push('Beide sollten informieren und Kompromisse finden');
      recommendations.push('Respekt für die Willenskraft des anderen');
    }

    // Profil-Kompatibilität (erweitert)
    if (user1.hdProfile && user2.hdProfile) {
      const profile1 = parseInt(user1.hdProfile.split('/')[0]);
      const profile2 = parseInt(user2.hdProfile.split('/')[0]);
      
      if (profile1 === 1 && profile2 === 3) {
        communication += 25;
        synergies.push('🔬 Profil 1/3 + 3/5: Forschungsorientierte Kommunikation');
        synergies.push('📚 Beide lieben tiefe Gespräche und Erkenntnisse');
      } else if (profile1 === 2 && profile2 === 4) {
        communication += 30;
        synergies.push('🏠 Profil 2/4: Hermit Opportunist - Tiefe Verbindung');
        synergies.push('💎 Perfekte Balance zwischen Introversion und Extroversion');
      } else if (profile1 === 4 && profile2 === 2) {
        communication += 30;
        synergies.push('🏠 Profil 4/2: Opportunist Hermit - Tiefe Verbindung');
        synergies.push('💎 Perfekte Balance zwischen Introversion und Extroversion');
      } else if (profile1 === 3 && profile2 === 5) {
        communication += 20;
        synergies.push('🔍 Profil 3/5: Experimentelle Kommunikation');
        synergies.push('⚡ Beide lernen durch Versuch und Irrtum');
      } else if (profile1 === 6 && profile2 === 2) {
        communication += 25;
        synergies.push('🌟 Profil 6/2: Mentor-Rolle mit tiefen Einsichten');
        synergies.push('🎓 Weisheit und Erfahrung teilen');
      }
    }

    // Autoritäts-Kompatibilität (erweitert)
    if (user1.hdAuthority === 'Sakral' && user2.hdAuthority === 'Splenic') {
      emotional += 25;
      synergies.push('💚 Sakral + Splenic: Intuitive Entscheidungen');
      synergies.push('🎯 Bauchgefühl und Instinkt arbeiten zusammen');
    } else if (user1.hdAuthority === 'Splenic' && user2.hdAuthority === 'Sakral') {
      emotional += 25;
      synergies.push('💚 Splenic + Sakral: Intuitive Entscheidungen');
      synergies.push('🎯 Bauchgefühl und Instinkt arbeiten zusammen');
    } else if (user1.hdAuthority === 'Ego' && user2.hdAuthority === 'Sakral') {
      emotional += 20;
      synergies.push('💪 Ego + Sakral: Willensstarke Verbindung');
      synergies.push('🔥 Starke emotionale Intensität möglich');
    } else if (user1.hdAuthority === 'Sakral' && user2.hdAuthority === 'Ego') {
      emotional += 20;
      synergies.push('💪 Sakral + Ego: Willensstarke Verbindung');
      synergies.push('🔥 Starke emotionale Intensität möglich');
    } else if (user1.hdAuthority === 'Lunar' && user2.hdAuthority !== 'Lunar') {
      emotional += 15;
      synergies.push('🌙 Lunar Authority: Mondzyklus-basierte Entscheidungen');
      recommendations.push('Reflector braucht Zeit für Entscheidungen');
    }

    // Spirituelle Verbindung (erweitert)
    if (user1.interests && user2.interests) {
      const commonInterests = user1.interests.filter(interest => 
        user2.interests!.includes(interest)
      );
      if (commonInterests.length > 0) {
        spiritual += commonInterests.length * 8;
        synergies.push(`🌟 Gemeinsame Interessen: ${commonInterests.join(', ')}`);
        synergies.push('💫 Spirituelle Verbindung durch geteilte Leidenschaften');
      }
      
      // Spezielle Interessen-Kombinationen
      if (commonInterests.includes('Human Design')) {
        spiritual += 15;
        synergies.push('🔮 Beide verstehen Human Design - tiefe Verbindung');
      }
      if (commonInterests.includes('Spiritualität')) {
        spiritual += 12;
        synergies.push('✨ Spirituelle Reise gemeinsam erleben');
      }
      if (commonInterests.includes('Heilung')) {
        spiritual += 10;
        synergies.push('💚 Gemeinsame Heilungsreise möglich');
      }
    }

    // Alters-Kompatibilität
    if (user1.age && user2.age) {
      const ageDiff = Math.abs(user1.age - user2.age);
      if (ageDiff <= 3) {
        emotional += 10;
        synergies.push('👥 Ähnliches Lebensalter - gemeinsame Erfahrungen');
      } else if (ageDiff <= 7) {
        emotional += 5;
        synergies.push('👥 Altersunterschied bringt verschiedene Perspektiven');
      } else {
        challenges.push('Altersunterschied könnte zu unterschiedlichen Lebensphasen führen');
        recommendations.push('Offene Kommunikation über Lebensziele wichtig');
      }
    }

    // Gesamtbewertung
    const overallScore = Math.min(100, (energyFlow + communication + emotional + spiritual) / 4);

    return {
      overallScore,
      energyFlow,
      communication,
      emotional,
      spiritual,
      challenges,
      synergies,
      recommendations
    };
  };

  const handleShowProfile = () => {
    if (profiles[current]) {
      const compatibilityData = calculateCompatibility(currentUserProfile, profiles[current]);
      setCompatibility(compatibilityData);
      setShowProfile(true);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    setSwipeAnim(direction);
    
    const liked = direction === 'right';
    const currentProfile = profiles[current];
    
    try {
      // Sende Swipe an Backend
      const response = await fetch('http://localhost:4001/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          targetId: currentProfile._id,
          liked: liked
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Swipe-Ergebnis:', result);
        
        if (result.match) {
          // Match gefunden!
          setMatchName(currentProfile.name);
          setShowMatchAnim(true);
          setTimeout(() => setShowMatchAnim(false), 3000);
          
          // Aktualisiere Matches
          const newMatch = {
            _id: result.id || Date.now().toString(),
            userA: { _id: userId, name: 'Du', image: '/api/placeholder/100/100' },
            userB: { _id: currentProfile._id, name: currentProfile.name, image: currentProfile.image },
            createdAt: new Date().toISOString()
          };
          setMatches(prev => [...prev, newMatch]);
        }
      }
    } catch (error) {
      console.error('Fehler beim Senden des Swipes:', error);
      // Fallback: Lokale Match-Simulation
      if (liked && Math.random() > 0.5) {
        setMatchName(currentProfile.name);
        setShowMatchAnim(true);
        setTimeout(() => setShowMatchAnim(false), 3000);
      }
    }
    
    setTimeout(() => {
      // Zum nächsten Profil
      setCurrent(prev => prev + 1);
      setSwipeAnim('none');
      setShowProfile(false);
      setCompatibility(null);
    }, 300);
  };

  const getCompatibilityColor = (score: number): string => {
    if (score >= 80) return '#10b981'; // Grün
    if (score >= 60) return '#f59e0b'; // Gelb
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Rot
  };

  const getCompatibilityEmoji = (score: number): string => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '✨';
    if (score >= 40) return '💫';
    return '⚡';
  };

  if (loading) {
    return (
      <UnifiedPageLayout
        title="💕 Swipe & Match"
        subtitle="Finde deine energetischen Matches"
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} sx={{ color: '#FFD700' }} />
        </Box>
      </UnifiedPageLayout>
    );
  }

  if (current >= profiles.length) {
    return (
      <UnifiedPageLayout
        title="🎉 Alle Profile durchgesehen!"
        subtitle="Du hast alle verfügbaren Profile bewertet. Schau später wieder vorbei!"
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Button
            variant="contained"
            onClick={() => {
              setCurrent(0);
              setShowProfile(false);
              setCompatibility(null);
            }}
            sx={{
              bgcolor: '#FFD700',
              color: '#23233a',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': { bgcolor: '#fbbf24' }
            }}
          >
            Von vorne beginnen
          </Button>
        </Box>
      </UnifiedPageLayout>
    );
  }

  const currentProfile = profiles[current];

  return (
    <UnifiedPageLayout
      title="💕 Swipe & Match"
      subtitle="Finde deine energetischen Matches"
    >
      {/* Header Actions */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Users size={20} />}
          onClick={() => setShowMatches(!showMatches)}
          sx={{
            background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
            color: 'white',
            px: 3,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(255, 107, 157, 0.4)'
            }
          }}
        >
          Matches ({matches.length})
        </Button>
        <Button
          variant="outlined"
          startIcon={<Heart size={20} />}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            px: 3,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.6)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Swipe weiter
        </Button>
      </Box>

      {/* Datenquelle Info */}
      {dataSource !== 'unknown' && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="caption" sx={{ 
            color: dataSource === 'real' ? '#10b981' : '#f59e0b',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'block'
          }}>
            {dataSource === 'real' ? '✅ Echte Profile' : '⚠️ Demo-Daten'}
          </Typography>
        </Box>
      )}

      {/* Hauptinhalt */}
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '80vh'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: swipeAnim === 'left' ? -300 : swipeAnim === 'right' ? 300 : 0
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              
              style={{ width: '100%', maxWidth: 500 }}
            >
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                overflow: 'visible'
              }}>
                <CardContent sx={{ p: 0 }}>
                  {/* Energetische Kompatibilität */}
                  {!showProfile ? (
                    <Box sx={{ p: 4 }}>
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ color: '#FFD700', mb: 2, fontWeight: 700 }}>
                          ⚡ Energetische Analyse
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                          {currentProfile.name}, {currentProfile.age}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {currentProfile.location}
                        </Typography>
                      </Box>

                      {/* HD-Informationen erweitert */}
                      <Box sx={{ mb: 4 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                HD-Typ
                              </Typography>
                              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                                {currentProfile.hdType}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Profil
                              </Typography>
                              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                                {currentProfile.hdProfile}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Strategie
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600, fontSize: '0.9rem' }}>
                                {currentProfile.hdStrategy}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Autorität
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600, fontSize: '0.9rem' }}>
                                {currentProfile.hdAuthority}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Bio */}
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="body1" sx={{ color: '#ffffff', lineHeight: 1.6, textAlign: 'center' }}>
                          {currentProfile.bio}
                        </Typography>
                      </Box>

                      {/* Interessen */}
                      {currentProfile.interests && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, textAlign: 'center' }}>
                            Interessen & Leidenschaften
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                            {currentProfile.interests.map((interest, index) => (
                              <Chip
                                key={index}
                                label={interest}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(255,215,0,0.2)',
                                  color: '#FFD700',
                                  border: '1px solid rgba(255,215,0,0.3)',
                                  '&:hover': {
                                    bgcolor: 'rgba(255,215,0,0.3)',
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* Geburtsdaten */}
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, textAlign: 'center' }}>
                          Geburtsdaten
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                Geburtstag
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                                {currentProfile.birthDate}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                Zeit
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                                {currentProfile.birthTime}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                Ort
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                                {currentProfile.birthPlace}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Schnelle Kompatibilitäts-Vorschau */}
                      <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, textAlign: 'center', fontWeight: 600 }}>
                          🔮 Kompatibilitäts-Vorschau
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Energetische Harmonie
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                            {(() => {
                              const compatibilityData = calculateCompatibility(currentUserProfile, currentProfile);
                              return `${compatibilityData.overallScore}%`;
                            })()}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(() => {
                            const compatibilityData = calculateCompatibility(currentUserProfile, currentProfile);
                            return compatibilityData.overallScore;
                          })()}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#10b981'
                            }
                          }}
                        />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, textAlign: 'center' }}>
                          {(() => {
                            const compatibilityData = calculateCompatibility(currentUserProfile, currentProfile);
                            if (compatibilityData.overallScore >= 80) return '🌟 Perfekte Harmonie!';
                            if (compatibilityData.overallScore >= 60) return '✨ Sehr gute Verbindung';
                            if (compatibilityData.overallScore >= 40) return '💫 Interessante Dynamik';
                            return '⚡ Herausfordernde Verbindung';
                          })()}
                        </Typography>
                      </Box>

                      {/* Profil anzeigen Button */}
                      <Box sx={{ textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          onClick={handleShowProfile}
                          startIcon={<Eye size={20} />}
                          sx={{
                            bgcolor: '#FFD700',
                            color: '#23233a',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            '&:hover': { bgcolor: '#fbbf24' }
                          }}
                        >
                          Detaillierte Analyse anzeigen
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    /* Profilbild und Kompatibilität */
                    <Box>
                      {/* Profilbild Carousel */}
                      <Box sx={{ position: 'relative' }}>
                        <ProfileImageCarousel
                          images={currentProfile.profile_images || [
                            {
                              id: 'fallback',
                              url: currentProfile.image || '/api/placeholder/400/400',
                              is_primary: true,
                              uploaded_at: new Date().toISOString(),
                              order: 0,
                              alt_text: `${currentProfile.name} Profilbild`
                            }
                          ]}
                          name={currentProfile.name}
                          height={400}
                          autoPlay={true}
                          autoPlayInterval={4000}
                          showControls={true}
                          showThumbnails={true}
                          showIndicators={true}
                          showLikeButton={true}
                          showFullscreen={true}
                          onLike={(image) => {
                            console.log('Liked image:', image);
                            // Hier könnte eine Like-Funktionalität implementiert werden
                          }}
                        />
                        
                        {/* Kompatibilitäts-Badge */}
                        <Box sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: 'rgba(0,0,0,0.8)',
                          borderRadius: 2,
                          p: 1.5,
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,215,0,0.3)'
                        }}>
                          <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                            {getCompatibilityEmoji(compatibility?.overallScore || 0)} {compatibility?.overallScore || 0}%
                          </Typography>
                        </Box>
                      </Box>

                      {/* Kompatibilitäts-Details */}
                      <Box sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, fontWeight: 700, textAlign: 'center' }}>
                          Energetische Kompatibilität
                        </Typography>

                        {/* Gesamtbewertung */}
                        <Box sx={{ mb: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body1" sx={{ color: '#ffffff' }}>
                              Gesamtbewertung
                            </Typography>
                            <Typography variant="h6" sx={{ 
                              color: getCompatibilityColor(compatibility?.overallScore || 0),
                              fontWeight: 700
                            }}>
                              {compatibility?.overallScore || 0}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={compatibility?.overallScore || 0}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getCompatibilityColor(compatibility?.overallScore || 0)
                              }
                            }}
                          />
                        </Box>

                        {/* Detaillierte Bewertungen */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                              <Zap size={20} style={{ color: '#FFD700', marginBottom: 8 }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Energie-Flow
                              </Typography>
                              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                                {compatibility?.energyFlow || 0}%
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                              <MessageCircle size={20} style={{ color: '#FFD700', marginBottom: 8 }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Kommunikation
                              </Typography>
                              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                                {compatibility?.communication || 0}%
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                              <Heart size={20} style={{ color: '#FFD700', marginBottom: 8 }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Emotional
                              </Typography>
                              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                                {compatibility?.emotional || 0}%
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                              <Sparkles size={20} style={{ color: '#FFD700', marginBottom: 8 }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Spiritual
                              </Typography>
                              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                                {compatibility?.spiritual || 0}%
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Synergien */}
                        {compatibility?.synergies && compatibility.synergies.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ color: '#10b981', mb: 2, fontWeight: 600 }}>
                              ✨ Synergien
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {compatibility.synergies.map((synergy, index) => (
                                <Typography key={index} variant="body2" sx={{ color: '#ffffff' }}>
                                  • {synergy}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* Herausforderungen */}
                        {compatibility?.challenges && compatibility.challenges.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ color: '#f59e0b', mb: 2, fontWeight: 600 }}>
                              ⚠️ Herausforderungen
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {compatibility.challenges.map((challenge, index) => (
                                <Typography key={index} variant="body2" sx={{ color: '#ffffff' }}>
                                  • {challenge}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* Empfehlungen */}
                        {compatibility?.recommendations && compatibility.recommendations.length > 0 && (
                          <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ color: '#3b82f6', mb: 2, fontWeight: 600 }}>
                              💡 Empfehlungen
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {compatibility.recommendations.map((recommendation, index) => (
                                <Typography key={index} variant="body2" sx={{ color: '#ffffff' }}>
                                  • {recommendation}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* Zusätzliche Profil-Informationen */}
                        <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
                          <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, fontWeight: 600 }}>
                            📋 Vollständiges Profil
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  Geburtsdaten
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                                  {currentProfile.birthDate} um {currentProfile.birthTime}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#FFD700' }}>
                                  {currentProfile.birthPlace}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  Human Design
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                                  {currentProfile.hdType} - {currentProfile.hdProfile}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#FFD700' }}>
                                  {currentProfile.hdAuthority}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Swipe-Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                          <Button
                            variant="outlined"
                            onClick={() => handleSwipe('left')}
                            sx={{
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              px: 4,
                              py: 1.5,
                              fontSize: '1.1rem',
                              '&:hover': { 
                                borderColor: '#dc2626',
                                bgcolor: 'rgba(239, 68, 68, 0.1)'
                              }
                            }}
                          >
                            <X size={24} />
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => handleSwipe('right')}
                            sx={{
                              bgcolor: '#10b981',
                              px: 4,
                              py: 1.5,
                              fontSize: '1.1rem',
                              '&:hover': { bgcolor: '#059669' }
                            }}
                          >
                            <Heart size={24} />
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>

      {/* Matches-Overlay */}
      <AnimatePresence>
        {showMatches && (
          <motion.div
            
            
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <motion.div
              
              
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ width: '90%', maxWidth: 600 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 700 }}>
                      💕 Deine Matches
                    </Typography>
                    <IconButton
                      onClick={() => setShowMatches(false)}
                      sx={{ color: 'white' }}
                    >
                      <X size={24} />
                    </IconButton>
                  </Box>
                  
                  {matches.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        Noch keine Matches
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Swipe weiter, um energetisch kompatible Menschen zu finden!
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {matches.map((match) => (
                        <Box key={match._id} sx={{
                          p: 3,
                          bgcolor: 'rgba(255,255,255,0.05)',
                          borderRadius: 2,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={match.userB.image}
                              sx={{ width: 50, height: 50 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                                {match.userB.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Match seit {new Date(match.createdAt).toLocaleDateString('de-DE')}
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                bgcolor: '#10b981',
                                '&:hover': { bgcolor: '#059669' }
                              }}
                            >
                              <MessageCircle size={16} style={{ marginRight: 8 }} />
                              Chat
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match-Animation */}
      <AnimatePresence>
        {showMatchAnim && (
          <motion.div
            
            
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1001
            }}
          >
            <Box sx={{
              bgcolor: 'rgba(16, 185, 129, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              p: 4,
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
              <Typography variant="h3" sx={{ color: '#ffffff', mb: 2 }}>
                🎉 Match!
              </Typography>
              <Typography variant="h5" sx={{ color: '#ffffff' }}>
                Du und {matchName} seid energetisch kompatibel!
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </UnifiedPageLayout>
  );
}
