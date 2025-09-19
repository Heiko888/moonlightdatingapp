import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Datei-Pfade für lokale Speicherung
const usersFile = path.join(__dirname, '../../data/users.json');
const profilesFile = path.join(__dirname, '../../data/dating-profiles.json');
const matchesFile = path.join(__dirname, '../../data/matches.json');
const likesFile = path.join(__dirname, '../../data/likes.json');
const messagesFile = path.join(__dirname, '../../data/dating-messages.json');

// Verzeichnis erstellen falls nicht vorhanden
const dataDir = path.dirname(usersFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Interfaces
interface DatingProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  photos: string[];
  hdType: string;
  hdProfile: string;
  hdAuthority: string;
  hdStrategy: string;
  hdCenters: string[];
  hdChannels: string[];
  hdGates: string[];
  incarnationCross: string;
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    hdTypes: string[];
    interests: string[];
  };
  isActive: boolean;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  compatibility: number;
  hdCompatibility: {
    typeCompatibility: number;
    profileCompatibility: number;
    authorityCompatibility: number;
    centersCompatibility: number;
    channelsCompatibility: number;
    gatesCompatibility: number;
    incarnationCrossCompatibility: number;
  };
  matchDate: string;
  isActive: boolean;
  conversationStarted: boolean;
}

interface Like {
  id: string;
  likerId: string;
  likedId: string;
  timestamp: string;
  isSuperLike: boolean;
}

interface DatingMessage {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'sticker';
}

// Hilfsfunktionen
const readDatingProfiles = (): DatingProfile[] => {
  try {
    if (fs.existsSync(profilesFile)) {
      const data = fs.readFileSync(profilesFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Fehler beim Lesen der Dating-Profile:', error);
  }
  return getMockDatingProfiles();
};

const writeDatingProfiles = (profiles: DatingProfile[]): void => {
  try {
    fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));
  } catch (error) {
    console.error('Fehler beim Schreiben der Dating-Profile:', error);
    throw error;
  }
};

const readMatches = (): Match[] => {
  try {
    if (fs.existsSync(matchesFile)) {
      const data = fs.readFileSync(matchesFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Fehler beim Lesen der Matches:', error);
  }
  return [];
};

const writeMatches = (matches: Match[]): void => {
  try {
    fs.writeFileSync(matchesFile, JSON.stringify(matches, null, 2));
  } catch (error) {
    console.error('Fehler beim Schreiben der Matches:', error);
    throw error;
  }
};

const readLikes = (): Like[] => {
  try {
    if (fs.existsSync(likesFile)) {
      const data = fs.readFileSync(likesFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Fehler beim Lesen der Likes:', error);
  }
  return [];
};

const writeLikes = (likes: Like[]): void => {
  try {
    fs.writeFileSync(likesFile, JSON.stringify(likes, null, 2));
  } catch (error) {
    console.error('Fehler beim Schreiben der Likes:', error);
    throw error;
  }
};

const readDatingMessages = (): DatingMessage[] => {
  try {
    if (fs.existsSync(messagesFile)) {
      const data = fs.readFileSync(messagesFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Fehler beim Lesen der Dating-Nachrichten:', error);
  }
  return [];
};

const writeDatingMessages = (messages: DatingMessage[]): void => {
  try {
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Fehler beim Schreiben der Dating-Nachrichten:', error);
    throw error;
  }
};

// Human Design Matching Algorithmus
class HumanDesignMatcher {
  // Typ-Kompatibilität
  static getTypeCompatibility(type1: string, type2: string): number {
    const compatibilityMatrix: { [key: string]: { [key: string]: number } } = {
      'Generator': {
        'Generator': 85,
        'Manifesting Generator': 90,
        'Projector': 75,
        'Manifestor': 60,
        'Reflector': 70
      },
      'Manifesting Generator': {
        'Generator': 90,
        'Manifesting Generator': 80,
        'Projector': 70,
        'Manifestor': 75,
        'Reflector': 65
      },
      'Projector': {
        'Generator': 75,
        'Manifesting Generator': 70,
        'Projector': 60,
        'Manifestor': 85,
        'Reflector': 80
      },
      'Manifestor': {
        'Generator': 60,
        'Manifesting Generator': 75,
        'Projector': 85,
        'Manifestor': 70,
        'Reflector': 75
      },
      'Reflector': {
        'Generator': 70,
        'Manifesting Generator': 65,
        'Projector': 80,
        'Manifestor': 75,
        'Reflector': 90
      }
    };
    
    return compatibilityMatrix[type1]?.[type2] || 50;
  }

  // Profil-Kompatibilität
  static getProfileCompatibility(profile1: string, profile2: string): number {
    const [line1, line2] = profile1.split('/').map(Number);
    const [line3, line4] = profile2.split('/').map(Number);
    
    // Harmonische Linien-Kombinationen
    const harmonicCombinations = [
      [1, 3], [2, 4], [3, 5], [4, 6], [5, 1], [6, 2]
    ];
    
    let compatibility = 50;
    
    // Prüfe harmonische Kombinationen
    for (const [a, b] of harmonicCombinations) {
      if ((line1 === a && line3 === b) || (line1 === b && line3 === a)) {
        compatibility += 20;
      }
      if ((line2 === a && line4 === b) || (line2 === b && line4 === a)) {
        compatibility += 20;
      }
    }
    
    // Prüfe gleiche Linien (können harmonisch sein)
    if (line1 === line3 || line2 === line4) {
      compatibility += 10;
    }
    
    return Math.min(compatibility, 100);
  }

  // Authority-Kompatibilität
  static getAuthorityCompatibility(authority1: string, authority2: string): number {
    const authorityMatrix: { [key: string]: { [key: string]: number } } = {
      'Sakral': {
        'Sakral': 80,
        'Splenisch': 70,
        'Solar Plexus': 60,
        'G': 75,
        'Ego': 65,
        'Keine': 50
      },
      'Splenisch': {
        'Sakral': 70,
        'Splenisch': 75,
        'Solar Plexus': 80,
        'G': 70,
        'Ego': 75,
        'Keine': 60
      },
      'Solar Plexus': {
        'Sakral': 60,
        'Splenisch': 80,
        'Solar Plexus': 70,
        'G': 65,
        'Ego': 85,
        'Keine': 55
      },
      'G': {
        'Sakral': 75,
        'Splenisch': 70,
        'Solar Plexus': 65,
        'G': 90,
        'Ego': 70,
        'Keine': 60
      },
      'Ego': {
        'Sakral': 65,
        'Splenisch': 75,
        'Solar Plexus': 85,
        'G': 70,
        'Ego': 80,
        'Keine': 55
      },
      'Keine': {
        'Sakral': 50,
        'Splenisch': 60,
        'Solar Plexus': 55,
        'G': 60,
        'Ego': 55,
        'Keine': 70
      }
    };
    
    return authorityMatrix[authority1]?.[authority2] || 50;
  }

  // Center-Kompatibilität
  static getCentersCompatibility(centers1: string[], centers2: string[]): number {
    const definedCenters1 = new Set(centers1);
    const definedCenters2 = new Set(centers2);
    
    // Berechne Schnittmenge und Vereinigung
    const intersection = new Set([...definedCenters1].filter(x => definedCenters2.has(x)));
    const union = new Set([...definedCenters1, ...definedCenters2]);
    
    // Jaccard-Ähnlichkeit
    const similarity = intersection.size / union.size;
    
    // Bonus für komplementäre Centers
    const complementaryCenters = [
      ['Head', 'Ajna'],
      ['Throat', 'G'],
      ['Heart', 'Ego'],
      ['Solar Plexus', 'Splenic'],
      ['Sacral', 'Root']
    ];
    
    let complementaryBonus = 0;
    for (const [center1, center2] of complementaryCenters) {
      if ((definedCenters1.has(center1) && definedCenters2.has(center2)) ||
          (definedCenters1.has(center2) && definedCenters2.has(center1))) {
        complementaryBonus += 0.1;
      }
    }
    
    return Math.min((similarity + complementaryBonus) * 100, 100);
  }

  // Channel-Kompatibilität
  static getChannelsCompatibility(channels1: string[], channels2: string[]): number {
    const definedChannels1 = new Set(channels1);
    const definedChannels2 = new Set(channels2);
    
    // Berechne Schnittmenge
    const intersection = new Set([...definedChannels1].filter(x => definedChannels2.has(x)));
    
    // Bonus für gleiche Channels
    const sameChannelsBonus = intersection.size * 5;
    
    // Bonus für komplementäre Channels
    const complementaryChannels = [
      ['1-8', '2-14'],
      ['3-60', '4-63'],
      ['5-15', '6-59'],
      ['7-31', '8-1'],
      ['9-52', '10-20'],
      ['11-56', '12-22'],
      ['13-33', '14-2'],
      ['15-5', '16-48'],
      ['17-62', '18-58'],
      ['19-49', '20-10'],
      ['21-45', '22-12'],
      ['23-43', '24-61'],
      ['25-51', '26-44'],
      ['27-50', '28-38'],
      ['29-46', '30-41'],
      ['32-54', '33-13'],
      ['34-57', '35-36'],
      ['36-35', '37-40'],
      ['38-28', '39-55'],
      ['40-37', '41-30'],
      ['42-53', '43-23'],
      ['44-26', '45-21'],
      ['46-29', '47-64'],
      ['48-16', '49-19'],
      ['50-27', '51-25'],
      ['52-9', '53-42'],
      ['54-32', '55-39'],
      ['56-11', '57-34'],
      ['58-18', '59-6'],
      ['60-3', '61-24'],
      ['62-17', '63-4'],
      ['64-47']
    ];
    
    let complementaryBonus = 0;
    for (const [channel1, channel2] of complementaryChannels) {
      if ((definedChannels1.has(channel1) && definedChannels2.has(channel2)) ||
          (definedChannels1.has(channel2) && definedChannels2.has(channel1))) {
        complementaryBonus += 10;
      }
    }
    
    return Math.min(50 + sameChannelsBonus + complementaryBonus, 100);
  }

  // Gate-Kompatibilität
  static getGatesCompatibility(gates1: string[], gates2: string[]): number {
    const definedGates1 = new Set(gates1);
    const definedGates2 = new Set(gates2);
    
    // Berechne Schnittmenge
    const intersection = new Set([...definedGates1].filter(x => definedGates2.has(x)));
    
    // Bonus für gleiche Gates
    const sameGatesBonus = intersection.size * 3;
    
    // Bonus für komplementäre Gates (Hexagramm-Paare)
    const complementaryGates = [
      ['1', '2'], ['3', '4'], ['5', '6'], ['7', '8'], ['9', '10'],
      ['11', '12'], ['13', '14'], ['15', '16'], ['17', '18'], ['19', '20'],
      ['21', '22'], ['23', '24'], ['25', '26'], ['27', '28'], ['29', '30'],
      ['31', '32'], ['33', '34'], ['35', '36'], ['37', '38'], ['39', '40'],
      ['41', '42'], ['43', '44'], ['45', '46'], ['47', '48'], ['49', '50'],
      ['51', '52'], ['53', '54'], ['55', '56'], ['57', '58'], ['59', '60'],
      ['61', '62'], ['63', '64']
    ];
    
    let complementaryBonus = 0;
    for (const [gate1, gate2] of complementaryGates) {
      if ((definedGates1.has(gate1) && definedGates2.has(gate2)) ||
          (definedGates1.has(gate2) && definedGates2.has(gate1))) {
        complementaryBonus += 5;
      }
    }
    
    return Math.min(40 + sameGatesBonus + complementaryBonus, 100);
  }

  // Incarnation Cross Kompatibilität
  static getIncarnationCrossCompatibility(cross1: string, cross2: string): number {
    // Vereinfachte Logik für Incarnation Cross
    if (cross1 === cross2) {
      return 90; // Gleiche Cross = hohe Kompatibilität
    }
    
    // Extrahiere die ersten beiden Zahlen für Vergleich
    const cross1Numbers = cross1.match(/\d+/g) || [];
    const cross2Numbers = cross2.match(/\d+/g) || [];
    
    if (cross1Numbers.length >= 2 && cross2Numbers.length >= 2) {
      const [a1, b1] = cross1Numbers.slice(0, 2).map(Number);
      const [a2, b2] = cross2Numbers.slice(0, 2).map(Number);
      
      // Prüfe auf harmonische Kombinationen
      if (a1 === a2 || b1 === b2) {
        return 75;
      }
      if (a1 === b2 || b1 === a2) {
        return 70;
      }
    }
    
    return 60; // Standard-Kompatibilität
  }

  // Gesamt-Kompatibilität berechnen
  static calculateCompatibility(profile1: DatingProfile, profile2: DatingProfile): number {
    const typeCompat = this.getTypeCompatibility(profile1.hdType, profile2.hdType);
    const profileCompat = this.getProfileCompatibility(profile1.hdProfile, profile2.hdProfile);
    const authorityCompat = this.getAuthorityCompatibility(profile1.hdAuthority, profile2.hdAuthority);
    const centersCompat = this.getCentersCompatibility(profile1.hdCenters, profile2.hdCenters);
    const channelsCompat = this.getChannelsCompatibility(profile1.hdChannels, profile2.hdChannels);
    const gatesCompat = this.getGatesCompatibility(profile1.hdGates, profile2.hdGates);
    const crossCompat = this.getIncarnationCrossCompatibility(profile1.incarnationCross, profile2.incarnationCross);

    // Gewichtete Berechnung
    const weights = {
      type: 0.25,
      profile: 0.20,
      authority: 0.15,
      centers: 0.15,
      channels: 0.10,
      gates: 0.10,
      cross: 0.05
    };

    const totalCompatibility = 
      typeCompat * weights.type +
      profileCompat * weights.profile +
      authorityCompat * weights.authority +
      centersCompat * weights.centers +
      channelsCompat * weights.channels +
      gatesCompat * weights.gates +
      crossCompat * weights.cross;

    return Math.round(totalCompatibility);
  }
}

// Mock-Daten
const getMockDatingProfiles = (): DatingProfile[] => [
  {
    id: 'profile1',
    userId: 'user1',
    name: 'Max',
    age: 28,
    location: 'Berlin',
    bio: 'Generator mit 2/4 Profil. Liebe es, auf andere zu reagieren und Energie zu geben. Suche nach authentischen Verbindungen.',
    photos: ['/images/max1.jpg', '/images/max2.jpg'],
    hdType: 'Generator',
    hdProfile: '2/4',
    hdAuthority: 'Sakral',
    hdStrategy: 'Auf andere reagieren',
    hdCenters: ['Sacral', 'Root', 'Splenic', 'G'],
    hdChannels: ['1-8', '2-14', '3-60'],
    hdGates: ['1', '2', '3', '8', '14', '60'],
    incarnationCross: 'Right Angle Cross of Rulership (1/2 | 7/13)',
    preferences: {
      ageRange: [25, 35],
      maxDistance: 50,
      hdTypes: ['Generator', 'Manifesting Generator', 'Projector'],
      interests: ['Yoga', 'Meditation', 'Human Design', 'Reisen']
    },
    isActive: true,
    lastActive: new Date().toISOString(),
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile2',
    userId: 'user2',
    name: 'Sarah',
    age: 26,
    location: 'München',
    bio: 'Projector mit 3/5 Profil. Bin hier, um andere zu führen und zu beraten. Suche nach jemandem, der meine Führung schätzt.',
    photos: ['/images/sarah1.jpg', '/images/sarah2.jpg'],
    hdType: 'Projector',
    hdProfile: '3/5',
    hdAuthority: 'Splenisch',
    hdStrategy: 'Warten auf Einladung',
    hdCenters: ['Splenic', 'G', 'Throat'],
    hdChannels: ['2-14', '4-63'],
    hdGates: ['2', '14', '4', '63'],
    incarnationCross: 'Right Angle Cross of the Sphinx (2/1 | 4/6)',
    preferences: {
      ageRange: [24, 32],
      maxDistance: 30,
      hdTypes: ['Generator', 'Manifesting Generator', 'Manifestor'],
      interests: ['Coaching', 'Psychologie', 'Bücher', 'Kunst']
    },
    isActive: true,
    lastActive: new Date().toISOString(),
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile3',
    userId: 'user3',
    name: 'Tom',
    age: 30,
    location: 'Hamburg',
    bio: 'Manifestor mit 1/3 Profil. Ich initiiere und führe. Suche nach jemandem, der meine Energie versteht.',
    photos: ['/images/tom1.jpg', '/images/tom2.jpg'],
    hdType: 'Manifestor',
    hdProfile: '1/3',
    hdAuthority: 'Splenisch',
    hdStrategy: 'Informieren',
    hdCenters: ['Splenic', 'Throat', 'Ego'],
    hdChannels: ['3-60', '5-15'],
    hdGates: ['3', '60', '5', '15'],
    incarnationCross: 'Right Angle Cross of the Vessel of Love (3/60 | 5/15)',
    preferences: {
      ageRange: [26, 36],
      maxDistance: 40,
      hdTypes: ['Projector', 'Reflector', 'Generator'],
      interests: ['Sport', 'Business', 'Technologie', 'Musik']
    },
    isActive: true,
    lastActive: new Date().toISOString(),
    createdAt: '2024-06-10T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile4',
    userId: 'user4',
    name: 'Lisa',
    age: 24,
    location: 'Köln',
    bio: 'Reflector mit 6/2 Profil. Ich reflektiere die Energie anderer. Suche nach authentischen Menschen.',
    photos: ['/images/lisa1.jpg', '/images/lisa2.jpg'],
    hdType: 'Reflector',
    hdProfile: '6/2',
    hdAuthority: 'Keine',
    hdStrategy: 'Warten auf Mondzyklus',
    hdCenters: [],
    hdChannels: [],
    hdGates: [],
    incarnationCross: 'Right Angle Cross of the Sleeping Phoenix (6/2 | 7/13)',
    preferences: {
      ageRange: [22, 30],
      maxDistance: 25,
      hdTypes: ['Generator', 'Manifesting Generator', 'Projector'],
      interests: ['Spiritualität', 'Natur', 'Kreativität', 'Heilung']
    },
    isActive: true,
    lastActive: new Date().toISOString(),
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
];

// Initialisiere Daten
const initializeData = () => {
  if (!fs.existsSync(profilesFile)) {
    writeDatingProfiles(getMockDatingProfiles());
  }
};

// Initialisiere beim Start
initializeData();

// API-Endpunkte

// GET /dating/profiles - Alle aktiven Profile abrufen
router.get('/profiles', (req: Request, res: Response) => {
  try {
    const { userId, limit = 20, offset = 0 } = req.query;
    const profiles = readDatingProfiles();
    
    // Filtere das eigene Profil heraus
    const filteredProfiles = profiles.filter(p => p.userId !== userId && p.isActive);
    
    // Sortiere nach letzter Aktivität
    const sortedProfiles = filteredProfiles.sort((a, b) => 
      new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );
    
    const paginatedProfiles = sortedProfiles.slice(Number(offset), Number(offset) + Number(limit));
    
    res.json({
      success: true,
      profiles: paginatedProfiles,
      total: filteredProfiles.length
    });
  } catch (error) {
    console.error('Fehler beim Laden der Profile:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Profile'
    });
  }
});

// GET /dating/profiles/:userId - Einzelnes Profil abrufen
router.get('/profiles/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const profiles = readDatingProfiles();
    const profile = profiles.find(p => p.userId === userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profil nicht gefunden'
      });
    }
    
    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Fehler beim Laden des Profils:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden des Profils'
    });
  }
});

// POST /dating/profiles - Neues Profil erstellen
router.post('/profiles', (req: Request, res: Response) => {
  try {
    const profileData = req.body;
    
    // Validiere Pflichtfelder
    const requiredFields = ['userId', 'name', 'age', 'location', 'bio', 'hdType', 'hdProfile', 'hdAuthority'];
    for (const field of requiredFields) {
      if (!profileData[field]) {
        return res.status(400).json({
          success: false,
          error: `Pflichtfeld fehlt: ${field}`
        });
      }
    }
    
    const newProfile: DatingProfile = {
      id: uuidv4(),
      userId: profileData.userId,
      name: profileData.name,
      age: profileData.age,
      location: profileData.location,
      bio: profileData.bio,
      photos: profileData.photos || [],
      hdType: profileData.hdType,
      hdProfile: profileData.hdProfile,
      hdAuthority: profileData.hdAuthority,
      hdStrategy: profileData.hdStrategy || '',
      hdCenters: profileData.hdCenters || [],
      hdChannels: profileData.hdChannels || [],
      hdGates: profileData.hdGates || [],
      incarnationCross: profileData.incarnationCross || '',
      preferences: profileData.preferences || {
        ageRange: [18, 99],
        maxDistance: 50,
        hdTypes: [],
        interests: []
      },
      isActive: true,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const profiles = readDatingProfiles();
    profiles.push(newProfile);
    writeDatingProfiles(profiles);
    
    res.json({
      success: true,
      profile: newProfile
    });
  } catch (error) {
    console.error('Fehler beim Erstellen des Profils:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen des Profils'
    });
  }
});

// PUT /dating/profiles/:userId - Profil aktualisieren
router.put('/profiles/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    const profiles = readDatingProfiles();
    const profileIndex = profiles.findIndex(p => p.userId === userId);
    
    if (profileIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Profil nicht gefunden'
      });
    }
    
    profiles[profileIndex] = {
      ...profiles[profileIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    writeDatingProfiles(profiles);
    
    res.json({
      success: true,
      profile: profiles[profileIndex]
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Profils:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Aktualisieren des Profils'
    });
  }
});

// GET /dating/matches/:userId - Matches für einen Benutzer abrufen
router.get('/matches/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const matches = readMatches();
    const userMatches = matches.filter(m => 
      (m.user1Id === userId || m.user2Id === userId) && m.isActive
    );
    
    // Lade Profile für die Matches
    const profiles = readDatingProfiles();
    const matchesWithProfiles = userMatches.map(match => {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      const otherProfile = profiles.find(p => p.userId === otherUserId);
      
      return {
        ...match,
        otherProfile
      };
    });
    
    res.json({
      success: true,
      matches: matchesWithProfiles
    });
  } catch (error) {
    console.error('Fehler beim Laden der Matches:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Matches'
    });
  }
});

// POST /dating/like - Like hinzufügen
router.post('/like', (req: Request, res: Response) => {
  try {
    const { likerId, likedId, isSuperLike = false } = req.body;
    
    if (!likerId || !likedId) {
      return res.status(400).json({
        success: false,
        error: 'LikerId und LikedId sind erforderlich'
      });
    }
    
    if (likerId === likedId) {
      return res.status(400).json({
        success: false,
        error: 'Du kannst dich nicht selbst liken'
      });
    }
    
    const likes = readLikes();
    const matches = readMatches();
    
    // Prüfe ob bereits geliked
    const existingLike = likes.find(l => l.likerId === likerId && l.likedId === likedId);
    if (existingLike) {
      return res.status(400).json({
        success: false,
        error: 'Bereits geliked'
      });
    }
    
    // Füge Like hinzu
    const newLike: Like = {
      id: uuidv4(),
      likerId,
      likedId,
      timestamp: new Date().toISOString(),
      isSuperLike
    };
    
    likes.push(newLike);
    writeLikes(likes);
    
    // Prüfe auf Match (gegenseitiges Like)
    const mutualLike = likes.find(l => l.likerId === likedId && l.likedId === likerId);
    
    if (mutualLike) {
      // Erstelle Match
      const profiles = readDatingProfiles();
      const profile1 = profiles.find(p => p.userId === likerId);
      const profile2 = profiles.find(p => p.userId === likedId);
      
      if (profile1 && profile2) {
        const compatibility = HumanDesignMatcher.calculateCompatibility(profile1, profile2);
        
        const newMatch: Match = {
          id: uuidv4(),
          user1Id: likerId,
          user2Id: likedId,
          compatibility,
          hdCompatibility: {
            typeCompatibility: HumanDesignMatcher.getTypeCompatibility(profile1.hdType, profile2.hdType),
            profileCompatibility: HumanDesignMatcher.getProfileCompatibility(profile1.hdProfile, profile2.hdProfile),
            authorityCompatibility: HumanDesignMatcher.getAuthorityCompatibility(profile1.hdAuthority, profile2.hdAuthority),
            centersCompatibility: HumanDesignMatcher.getCentersCompatibility(profile1.hdCenters, profile2.hdCenters),
            channelsCompatibility: HumanDesignMatcher.getChannelsCompatibility(profile1.hdChannels, profile2.hdChannels),
            gatesCompatibility: HumanDesignMatcher.getGatesCompatibility(profile1.hdGates, profile2.hdGates),
            incarnationCrossCompatibility: HumanDesignMatcher.getIncarnationCrossCompatibility(profile1.incarnationCross, profile2.incarnationCross)
          },
          matchDate: new Date().toISOString(),
          isActive: true,
          conversationStarted: false
        };
        
        matches.push(newMatch);
        writeMatches(matches);
        
        res.json({
          success: true,
          like: newLike,
          match: newMatch,
          isMatch: true
        });
      } else {
        res.json({
          success: true,
          like: newLike,
          isMatch: false
        });
      }
    } else {
      res.json({
        success: true,
        like: newLike,
        isMatch: false
      });
    }
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Likes:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Hinzufügen des Likes'
    });
  }
});

// GET /dating/recommendations/:userId - Empfehlungen für einen Benutzer
router.get('/recommendations/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;
    
    const profiles = readDatingProfiles();
    const likes = readLikes();
    const userProfile = profiles.find(p => p.userId === userId);
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        error: 'Benutzer-Profil nicht gefunden'
      });
    }
    
    // Filtere bereits gelikte Profile heraus
    const likedIds = likes.filter(l => l.likerId === userId).map(l => l.likedId);
    const availableProfiles = profiles.filter(p => 
      p.userId !== userId && 
      p.isActive && 
      !likedIds.includes(p.userId)
    );
    
    // Berechne Kompatibilität für alle verfügbaren Profile
    const recommendations = availableProfiles.map(profile => {
      const compatibility = HumanDesignMatcher.calculateCompatibility(userProfile, profile);
      
      return {
        ...profile,
        compatibility,
        hdCompatibility: {
          typeCompatibility: HumanDesignMatcher.getTypeCompatibility(userProfile.hdType, profile.hdType),
          profileCompatibility: HumanDesignMatcher.getProfileCompatibility(userProfile.hdProfile, profile.hdProfile),
          authorityCompatibility: HumanDesignMatcher.getAuthorityCompatibility(userProfile.hdAuthority, profile.hdAuthority),
          centersCompatibility: HumanDesignMatcher.getCentersCompatibility(userProfile.hdCenters, profile.hdCenters),
          channelsCompatibility: HumanDesignMatcher.getChannelsCompatibility(userProfile.hdChannels, profile.hdChannels),
          gatesCompatibility: HumanDesignMatcher.getGatesCompatibility(userProfile.hdGates, profile.hdGates),
          incarnationCrossCompatibility: HumanDesignMatcher.getIncarnationCrossCompatibility(userProfile.incarnationCross, profile.incarnationCross)
        }
      };
    });
    
    // Sortiere nach Kompatibilität
    const sortedRecommendations = recommendations.sort((a, b) => b.compatibility - a.compatibility);
    
    // Limitiere Ergebnisse
    const limitedRecommendations = sortedRecommendations.slice(0, Number(limit));
    
    res.json({
      success: true,
      recommendations: limitedRecommendations
    });
  } catch (error) {
    console.error('Fehler beim Laden der Empfehlungen:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Empfehlungen'
    });
  }
});

// GET /dating/messages/:matchId - Nachrichten für einen Match abrufen
router.get('/messages/:matchId', (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const messages = readDatingMessages();
    const matchMessages = messages
      .filter(m => m.matchId === matchId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    res.json({
      success: true,
      messages: matchMessages
    });
  } catch (error) {
    console.error('Fehler beim Laden der Nachrichten:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Nachrichten'
    });
  }
});

// POST /dating/messages - Neue Nachricht senden
router.post('/messages', (req: Request, res: Response) => {
  try {
    const { matchId, senderId, receiverId, content, messageType = 'text' } = req.body;
    
    if (!matchId || !senderId || !receiverId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Alle Pflichtfelder müssen ausgefüllt werden'
      });
    }
    
    const newMessage: DatingMessage = {
      id: uuidv4(),
      matchId,
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      messageType
    };
    
    const messages = readDatingMessages();
    messages.push(newMessage);
    writeDatingMessages(messages);
    
    res.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Fehler beim Senden der Nachricht:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Senden der Nachricht'
    });
  }
});

export default router;
