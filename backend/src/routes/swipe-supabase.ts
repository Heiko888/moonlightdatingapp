import express, { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
// localDb entfernt - verwende nur Supabase

const router = express.Router();

// Mock-Daten für den Fall, dass keine echten Benutzer vorhanden sind
const getMockSwipeProfiles = () => [
  {
    _id: 'mock1',
    name: 'Sarah',
    age: 28,
    location: 'Berlin',
    hdType: 'Generator',
    hdProfile: '2/4',
    hdStrategy: 'Auf andere reagieren',
    hdAuthority: 'Sakral',
    bio: 'Energiegeladene Generator, die gerne neue Menschen kennenlernt und tiefgründige Gespräche führt.',
    interests: ['Yoga', 'Musik', 'Reisen', 'Human Design', 'Meditation'],
    birthDate: '1995-06-15',
    birthTime: '14:30',
    birthPlace: 'Berlin',
    image: '/api/placeholder/400/400',
    profile_images: [
      {
        id: 'mock1-1',
        url: '/api/placeholder/400/400',
        is_primary: true,
        uploaded_at: '2024-01-15T10:00:00Z',
        order: 0,
        alt_text: 'Sarah Hauptbild'
      }
    ]
  },
  {
    _id: 'mock2',
    name: 'Michael',
    age: 32,
    location: 'Hamburg',
    hdType: 'Projector',
    hdProfile: '3/5',
    hdStrategy: 'Warten auf Einladung',
    hdAuthority: 'Splenisch',
    bio: 'Erfahrener Projector, der andere gerne führt und berät. Suche nach authentischen Verbindungen.',
    interests: ['Coaching', 'Psychologie', 'Bücher', 'Kunst', 'Mentoring'],
    birthDate: '1991-03-22',
    birthTime: '09:15',
    birthPlace: 'Hamburg',
    image: '/api/placeholder/400/400',
    profile_images: [
      {
        id: 'mock2-1',
        url: '/api/placeholder/400/400',
        is_primary: true,
        uploaded_at: '2024-01-16T10:00:00Z',
        order: 0,
        alt_text: 'Michael Hauptbild'
      }
    ]
  }
];

// Hilfsfunktionen für echte Benutzer-Daten
const generateBioFromUser = (user: any): string => {
  const parts = [];
  
  if (user.hd_type) {
    parts.push(`${user.hd_type}`);
  }
  
  if (user.profile) {
    parts.push(`mit Profil ${user.profile}`);
  }
  
  if (user.subscriptionPlan && user.subscriptionPlan !== 'free') {
    parts.push(`${user.subscriptionPlan} Member`);
  }
  
  if (parts.length > 0) {
    return `${parts.join(' ')}. Suche nach authentischen Verbindungen und tiefgründigen Gesprächen.`;
  }
  
  return 'Suche nach authentischen Verbindungen und tiefgründigen Gesprächen.';
};

const getStrategyByType = (hdType: string): string => {
  const strategies: { [key: string]: string } = {
    'Generator': 'Auf andere reagieren',
    'Manifesting Generator': 'Auf andere reagieren und informieren',
    'Projector': 'Warten auf Einladung',
    'Manifestor': 'Informieren',
    'Reflector': 'Warten auf Mondzyklus'
  };
  return strategies[hdType] || 'Unbekannt';
};

const getAuthorityByType = (hdType: string): string => {
  const authorities: { [key: string]: string } = {
    'Generator': 'Sakral',
    'Manifesting Generator': 'Sakral',
    'Projector': 'Splenisch',
    'Manifestor': 'Solar Plexus',
    'Reflector': 'Lunar'
  };
  return authorities[hdType] || 'Unbekannt';
};

// GET /swipe/profiles/:userId - Alle Profile außer sich selbst abrufen
router.get('/profiles/:userId', async (req: Request, res: Response) => {
  try {
    const { hdType, city, interests } = req.query;
    const userId = req.params.userId;
    
    // Versuche zuerst echte Benutzer aus der JSON-Datenbank zu laden
    const fs = require('fs');
    const path = require('path');
    const userDbPath = path.join(__dirname, '../../data/users.json');
    
    let allUsers: any[] = [];
    
    // Lade echte Benutzer aus JSON-Datei
    if (fs.existsSync(userDbPath)) {
      try {
        const userData = fs.readFileSync(userDbPath, 'utf8');
        allUsers = JSON.parse(userData);
        console.log(`✅ ${allUsers.length} echte Benutzer aus JSON-Datenbank geladen`);
      } catch (error) {
        console.error('Fehler beim Laden der JSON-Benutzer:', error);
      }
    }
    
    // Fallback: Lokale SQLite-Datenbank
    if (allUsers.length === 0 && localDb.db) {
      allUsers = localDb.db.prepare('SELECT * FROM users').all() as any[];
      console.log(`✅ ${allUsers.length} Benutzer aus SQLite-Datenbank geladen`);
    }
    
    // Wenn immer noch keine Daten, verwende Mock-Daten
    if (allUsers.length === 0) {
      console.log('⚠️ Keine echten Benutzer gefunden, verwende Mock-Daten');
      return res.json(getMockSwipeProfiles());
    }
    
    // Filtere Profile (außer sich selbst)
    let filteredProfiles = allUsers.filter((user: any) => user.id !== userId);
    
    // Konvertiere zu Swipe-Format
    const swipeProfiles = filteredProfiles.map((user: any) => {
      // Parse JSON-Felder (falls vorhanden)
      let centers = {};
      let channels = {};
      let gates = {};
      let chartData = {};
      
      try {
        if (user.centers && typeof user.centers === 'string') {
          centers = JSON.parse(user.centers);
        } else if (user.centers && typeof user.centers === 'object') {
          centers = user.centers;
        }
        
        if (user.channels && typeof user.channels === 'string') {
          channels = JSON.parse(user.channels);
        } else if (user.channels && typeof user.channels === 'object') {
          channels = user.channels;
        }
        
        if (user.gates && typeof user.gates === 'string') {
          gates = JSON.parse(user.gates);
        } else if (user.gates && typeof user.gates === 'object') {
          gates = user.gates;
        }
        
        if (user.chart_data && typeof user.chart_data === 'string') {
          chartData = JSON.parse(user.chart_data);
        } else if (user.chart_data && typeof user.chart_data === 'object') {
          chartData = user.chart_data;
        }
      } catch (error) {
        console.log('Fehler beim Parsen der JSON-Felder für User:', user.id);
      }
      
      // Berechne Alter aus Geburtsdatum
      let age = null;
      if (user.birthdate) {
        const birthDate = new Date(user.birthdate);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }
      
      // Extrahiere Stadt aus birthplace oder verwende location
      let city = 'Unbekannt';
      if (user.birthplace) {
        city = user.birthplace.split(',')[0].trim();
      } else if (user.location) {
        city = user.location;
      }
      
      // Erstelle Interessen-Array basierend auf verfügbaren Daten
      const interests = [];
      if (user.hd_type) interests.push(user.hd_type);
      if (user.profile) interests.push(`Profil ${user.profile}`);
      if (user.subscriptionPlan) interests.push(`${user.subscriptionPlan} Member`);
      if (centers && Object.keys(centers).length > 0) {
        interests.push(`${Object.keys(centers).length} Zentren aktiv`);
      }
      if (channels && Object.keys(channels).length > 0) {
        interests.push(`${Object.keys(channels).length} Kanäle aktiv`);
      }
      
      // Generiere Bio basierend auf verfügbaren Daten
      let bio = user.bio || '';
      if (!bio) {
        bio = generateBioFromUser(user);
      }
      
      return {
        _id: user.id,
        name: user.name || user.username || 'Unbekannt',
        age: age,
        location: city,
        image: user.avatar || '/api/placeholder/400/400',
        hdType: user.hd_type || 'Unbekannt',
        hdProfile: user.profile || 'Unbekannt',
        hdStrategy: getStrategyByType(user.hd_type),
        hdAuthority: getAuthorityByType(user.hd_type),
        bio: bio,
        interests: interests,
        birthDate: user.birthdate,
        birthTime: chartData.birth_time || 'Unbekannt',
        birthPlace: user.birthplace || 'Unbekannt',
        city: city,
        description: `${user.hd_type || 'Unbekannt'} mit Profil ${user.profile || 'Unbekannt'}`,
        // Zusätzliche HD-Daten für erweiterte Kompatibilität
        centers: centers,
        channels: channels,
        gates: gates,
        chartData: chartData,
        // Echte Benutzer-Daten
        email: user.email,
        subscriptionPlan: user.subscriptionPlan || 'free',
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        // Profilbilder (falls vorhanden)
        profile_images: user.profile_images || [
          {
            id: `${user.id}-1`,
            url: user.avatar || '/api/placeholder/400/400',
            is_primary: true,
            uploaded_at: user.created_at || new Date().toISOString(),
            order: 0,
            alt_text: `${user.name || user.username} Hauptbild`
          }
        ]
      };
    });
    
    // Filtere nach HD Type
    if (hdType && hdType !== '') {
      filteredProfiles = swipeProfiles.filter((profile: any) => profile.hdType === hdType);
    } else {
      filteredProfiles = swipeProfiles;
    }
    
    // Filtere nach Stadt
    if (city && city !== '') {
      filteredProfiles = filteredProfiles.filter((profile: any) => 
        profile.city.toLowerCase().includes(city.toString().toLowerCase())
      );
    }
    
    // Filtere nach Interessen
    if (interests && interests !== '') {
      const interestArray = interests.toString().split(',').map(i => i.trim());
      filteredProfiles = filteredProfiles.filter((profile: any) =>
        profile.interests.some((interest: string) => 
          interestArray.some(searchInterest => 
            interest.toLowerCase().includes(searchInterest.toLowerCase())
          )
        )
      );
    }
    
    // Logge die Ergebnisse
    console.log(`✅ ${filteredProfiles.length} Profile für Swipe geladen (${allUsers.length} echte Benutzer total)`);
    
    res.json({
      success: true,
      profiles: filteredProfiles,
      total: filteredProfiles.length,
      source: allUsers.length > 0 ? 'real_users' : 'mock_data',
      message: allUsers.length > 0 
        ? `${filteredProfiles.length} echte Profile geladen` 
        : 'Mock-Daten verwendet - keine echten Benutzer gefunden'
    });
  } catch (error) {
    console.error('Fehler beim Laden der Profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Fehler beim Laden der Profile',
      profiles: getMockSwipeProfiles(),
      source: 'mock_data_fallback'
    });
  }
});

// POST /swipe - Swipe speichern
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, targetId, liked } = req.body;
    
    if (!userId || !targetId || typeof liked !== 'boolean') {
      return res.status(400).json({ error: 'Ungültige Daten.' });
    }
    
    // Speichere Swipe in der Datenbank
    if (!localDb.db) {
      return res.status(500).json({ error: 'Datenbank nicht verfügbar' });
    }
    const swipeStmt = localDb.db.prepare(`
      INSERT INTO swipes (id, user_id, target_id, liked, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    const swipeId = Math.random().toString(36).substr(2, 9);
    swipeStmt.run(swipeId, userId, targetId, liked);
    
    console.log(`Swipe gespeichert: User ${userId} ${liked ? 'liked' : 'disliked'} ${targetId}`);
    
    // Erweiterte Match-Logik basierend auf Human Design Kompatibilität
    let match = false;
    let compatibilityScore = 0;
    
    if (liked) {
      // Finde die Profile für Kompatibilitätsberechnung
      const userProfile = getUserById(userId);
      const targetProfile = getUserById(targetId);
      
      if (userProfile && targetProfile) {
        // Parse JSON-Felder
        const userCenters = userProfile.centers ? JSON.parse(userProfile.centers as string) : {};
        const userChannels = userProfile.channels ? JSON.parse(userProfile.channels as string) : {};
        const targetCenters = targetProfile.centers ? JSON.parse(targetProfile.centers as string) : {};
        const targetChannels = targetProfile.channels ? JSON.parse(targetProfile.channels as string) : {};
        
        // Berechne Kompatibilität
        compatibilityScore = calculateCompatibilityScore(
          { ...userProfile, centers: userCenters, channels: userChannels },
          { ...targetProfile, centers: targetCenters, channels: targetChannels }
        );
        
        // Match basierend auf Kompatibilität (höhere Chance bei besserer Kompatibilität)
        const matchChance = Math.min(0.8, compatibilityScore / 100);
        match = Math.random() < matchChance;
        
        if (match) {
          // Prüfe ob bereits ein Match existiert
          if (!localDb.db) {
            console.error('Datenbank nicht verfügbar für Match-Check');
            return;
          }
          const existingMatch = localDb.db.prepare(`
            SELECT * FROM matches 
            WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)
          `).get(userId, targetId, targetId, userId);
          
          if (!existingMatch) {
            // Füge Match zur Datenbank hinzu
            if (!localDb.db) {
              console.error('Datenbank nicht verfügbar für Match-Insert');
              return;
            }
            const matchStmt = localDb.db.prepare(`
              INSERT INTO matches (id, user_a, user_b, compatibility_score, created_at)
              VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `);
            
            const matchId = Math.random().toString(36).substr(2, 9);
            matchStmt.run(matchId, userId, targetId, compatibilityScore);
            
            console.log(`Match erstellt zwischen ${userId} und ${targetId}! Kompatibilität: ${compatibilityScore}%`);
          }
        }
      }
    }
    
    res.json({ 
      match, 
      compatibilityScore,
      message: match ? 'Match gefunden!' : liked ? 'Kein Match, aber Interesse gespeichert!' : 'Swipe gespeichert'
    });
  } catch (error) {
    console.error('Fehler beim Speichern des Swipes:', error);
    res.status(500).json({ error: 'Fehler beim Speichern des Swipes.' });
  }
});

// Hilfsfunktion für Kompatibilitätsberechnung
function calculateCompatibilityScore(user1: any, user2: any): number {
  let score = 0;
  
  // HD-Typ Kompatibilität
  if (user1.hd_type === 'Generator' && user2.hd_type === 'Projector') {
    score += 30;
  } else if (user1.hd_type === 'Projector' && user2.hd_type === 'Generator') {
    score += 30;
  } else if (user1.hd_type === 'Manifestor' && user2.hd_type === 'Generator') {
    score += 25;
  } else if (user1.hd_type === 'Generator' && user2.hd_type === 'Manifestor') {
    score += 25;
  } else if (user1.hd_type === 'Reflector' && user2.hd_type !== 'Reflector') {
    score += 20;
  } else if (user1.hd_type === user2.hd_type) {
    score += 15;
  }
  
  // Profil-Kompatibilität
  if (user1.profile && user2.profile) {
    const profile1 = parseInt(user1.profile.split('/')[0]);
    const profile2 = parseInt(user2.profile.split('/')[0]);
    
    if (profile1 === 1 && profile2 === 3) score += 20;
    else if (profile1 === 2 && profile2 === 4) score += 25;
    else if (profile1 === 4 && profile2 === 2) score += 25;
    else if (profile1 === 3 && profile2 === 5) score += 20;
    else if (profile1 === 6 && profile2 === 2) score += 25;
  }
  
  // Zentren-Kompatibilität
  if (user1.centers && user2.centers) {
    const user1Centers = Object.keys(user1.centers).filter(key => user1.centers[key]);
    const user2Centers = Object.keys(user2.centers).filter(key => user2.centers[key]);
    
    // Komplementäre Zentren (einer definiert, einer offen)
    const complementaryCenters = user1Centers.filter(center => !user2Centers.includes(center));
    score += complementaryCenters.length * 3;
  }
  
  // Kanäle-Kompatibilität
  if (user1.channels && user2.channels) {
    const user1Channels = Object.keys(user1.channels).filter(key => user1.channels[key]);
    const user2Channels = Object.keys(user2.channels).filter(key => user2.channels[key]);
    
    // Gemeinsame Kanäle
    const commonChannels = user1Channels.filter(channel => user2Channels.includes(channel));
    score += commonChannels.length * 5;
  }
  
  // Alters-Kompatibilität
  if (user1.birthdate && user2.birthdate) {
    const age1 = new Date().getFullYear() - new Date(user1.birthdate).getFullYear();
    const age2 = new Date().getFullYear() - new Date(user2.birthdate).getFullYear();
    const ageDiff = Math.abs(age1 - age2);
    if (ageDiff <= 3) score += 10;
    else if (ageDiff <= 7) score += 5;
  }
  
  return Math.min(100, score);
}

// GET /swipe/matches/:userId - Matches abrufen
router.get('/matches/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    // Hole Matches aus der Datenbank
    if (!localDb.db) {
      return res.status(500).json({ error: 'Datenbank nicht verfügbar' });
    }
    const matches = localDb.db.prepare(`
      SELECT m.*, 
             u1.name as user_a_name, u1.avatar as user_a_avatar,
             u2.name as user_b_name, u2.avatar as user_b_avatar
      FROM matches m
      LEFT JOIN users u1 ON m.user_a = u1.id
      LEFT JOIN users u2 ON m.user_b = u2.id
      WHERE m.user_a = ? OR m.user_b = ?
      ORDER BY m.created_at DESC
    `).all(userId, userId) as any[];
    
    // Konvertiere zu Swipe-Format
    const swipeMatches = matches.map((match: any) => ({
      id: match.id,
      userA: { 
        _id: match.user_a, 
        name: match.user_a_name, 
        image: match.user_a_avatar || '/api/placeholder/400/400' 
      },
      userB: { 
        _id: match.user_b, 
        name: match.user_b_name, 
        image: match.user_b_avatar || '/api/placeholder/400/400' 
      },
      createdAt: match.created_at,
      compatibilityScore: match.compatibility_score
    }));
    
    res.json(swipeMatches);
  } catch (error) {
    console.error('Fehler beim Laden der Matches:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Matches.' });
  }
});

// GET /swipe/history/:userId - Eigene Swipes (History) abrufen
router.get('/history/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    // Hole Swipe-History aus der Datenbank
    if (!localDb.db) {
      return res.status(500).json({ error: 'Datenbank nicht verfügbar' });
    }
    const swipes = localDb.db.prepare(`
      SELECT s.*, u.name as target_name, u.avatar as target_avatar
      FROM swipes s
      LEFT JOIN users u ON s.target_id = u.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `).all(userId) as any[];
    
    // Konvertiere zu Swipe-Format
    const swipeHistory = swipes.map((swipe: any) => ({
      id: swipe.id,
      userId: swipe.user_id,
      targetId: swipe.target_id,
      liked: Boolean(swipe.liked),
      createdAt: swipe.created_at,
      target: {
        _id: swipe.target_id,
        name: swipe.target_name,
        image: swipe.target_avatar || '/api/placeholder/400/400'
      }
    }));
    
    res.json(swipeHistory);
  } catch (error) {
    console.error('Fehler beim Laden der Swipe-History:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Swipe-History.' });
  }
});

// GET /swipe/new-matches/:userId/:since - Neue Matches seit Timestamp abrufen
router.get('/new-matches/:userId/:since', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const since = new Date(Number(req.params.since));
    
    // Hole neue Matches seit dem Timestamp
    if (!localDb.db) {
      return res.status(500).json({ error: 'Datenbank nicht verfügbar' });
    }
    const newMatches = localDb.db.prepare(`
      SELECT m.*, 
             u1.name as user_a_name, u1.avatar as user_a_avatar,
             u2.name as user_b_name, u2.avatar as user_b_avatar
      FROM matches m
      LEFT JOIN users u1 ON m.user_a = u1.id
      LEFT JOIN users u2 ON m.user_b = u2.id
      WHERE (m.user_a = ? OR m.user_b = ?) AND m.created_at > ?
      ORDER BY m.created_at DESC
    `).all(userId, userId, since.toISOString()) as any[];
    
    // Konvertiere zu Swipe-Format
    const swipeNewMatches = newMatches.map((match: any) => ({
      id: match.id,
      userA: { 
        _id: match.user_a, 
        name: match.user_a_name, 
        image: match.user_a_avatar || '/api/placeholder/400/400' 
      },
      userB: { 
        _id: match.user_b, 
        name: match.user_b_name, 
        image: match.user_b_avatar || '/api/placeholder/400/400' 
      },
      createdAt: match.created_at,
      compatibilityScore: match.compatibility_score
    }));
    
    res.json(swipeNewMatches);
  } catch (error) {
    console.error('Fehler beim Laden der neuen Matches:', error);
    res.status(500).json({ error: 'Fehler beim Laden der neuen Matches.' });
  }
});

// Hilfsfunktion für User-Lookup
function getUserById(userId: string): any | null {
  try {
    if (!localDb.db) {
      return null;
    }
    const user = localDb.db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    return user || null;
  } catch (error) {
    console.error('Fehler beim Laden des Users:', error);
    return null;
  }
}

// Hilfsfunktionen für HD-Daten

function generateBio(hdType: string, profile: string, centers: any, channels: any): string {
  const centerCount = Object.keys(centers).filter(key => centers[key]).length;
  const channelCount = Object.keys(channels).filter(key => channels[key]).length;
  
  return `${hdType} mit Profil ${profile}. ${centerCount} Zentren und ${channelCount} Kanäle aktiv. Suche nach authentischen Verbindungen und tiefen Gesprächen über Human Design.`;
}

export default router;
