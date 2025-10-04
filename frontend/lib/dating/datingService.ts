export interface DatingProfile {
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

export interface Match {
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
  otherProfile?: DatingProfile;
}

export interface Like {
  id: string;
  likerId: string;
  likedId: string;
  timestamp: string;
  isSuperLike: boolean;
}

export interface DatingMessage {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'sticker';
}

export interface Recommendation extends DatingProfile {
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
}

class DatingService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL + '/api/dating' || 'http://localhost:4001/api/dating';

  // Profile abrufen
  async getProfiles(userId: string, limit: number = 20, offset: number = 0): Promise<{ profiles: DatingProfile[], total: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/profiles?userId=${userId}&limit=${limit}&offset=${offset}`);
      const data = await response.json();
      
      if (data.success) {
        return {
          profiles: data.profiles,
          total: data.total
        };
      } else {
        throw new Error(data.error || 'Fehler beim Laden der Profile');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Profile:', error);
      const mockProfiles = this.getMockProfiles();
      return {
        profiles: mockProfiles.slice(offset, offset + limit),
        total: mockProfiles.length
      };
    }
  }

  // Einzelnes Profil abrufen
  async getProfile(userId: string): Promise<DatingProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/profiles/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.profile;
      } else {
        throw new Error(data.error || 'Profil nicht gefunden');
      }
    } catch (error) {
      console.error('Fehler beim Laden des Profils:', error);
      return this.getMockProfile(userId);
    }
  }

  // Profil erstellen
  async createProfile(profileData: Partial<DatingProfile>): Promise<DatingProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      
      if (data.success) {
        return data.profile;
      } else {
        throw new Error(data.error || 'Fehler beim Erstellen des Profils');
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Profils:', error);
      throw error;
    }
  }

  // Profil aktualisieren
  async updateProfile(userId: string, updateData: Partial<DatingProfile>): Promise<DatingProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/profiles/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (data.success) {
        return data.profile;
      } else {
        throw new Error(data.error || 'Fehler beim Aktualisieren des Profils');
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profils:', error);
      throw error;
    }
  }

  // Matches abrufen
  async getMatches(userId: string): Promise<Match[]> {
    try {
      const response = await fetch(`${this.baseUrl}/matches/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.matches;
      } else {
        throw new Error(data.error || 'Fehler beim Laden der Matches');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Matches:', error);
      return this.getMockMatches(userId);
    }
  }

  // Like hinzufügen
  async addLike(likerId: string, likedId: string, isSuperLike: boolean = false): Promise<{ like: Like, match?: Match, isMatch: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likerId, likedId, isSuperLike })
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          like: data.like,
          match: data.match,
          isMatch: data.isMatch
        };
      } else {
        throw new Error(data.error || 'Fehler beim Hinzufügen des Likes');
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Likes:', error);
      throw error;
    }
  }

  // Empfehlungen abrufen
  async getRecommendations(userId: string, limit: number = 10, filters?: {
    ageRange: [number, number];
    maxDistance: number;
    hdTypes: string[];
    minCompatibility: number;
    interests: string[];
    isActive: boolean;
  }): Promise<Recommendation[]> {
    try {
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        ...(filters && {
          ageMin: filters.ageRange[0].toString(),
          ageMax: filters.ageRange[1].toString(),
          maxDistance: filters.maxDistance.toString(),
          minCompatibility: filters.minCompatibility.toString(),
          hdTypes: filters.hdTypes.join(','),
          interests: filters.interests.join(','),
          isActive: filters.isActive.toString()
        })
      });
      
      const response = await fetch(`${this.baseUrl}/recommendations/${userId}?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        return data.recommendations;
      } else {
        throw new Error(data.error || 'Fehler beim Laden der Empfehlungen');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Empfehlungen:', error);
      return this.getMockRecommendations(userId, filters);
    }
  }

  // Nachrichten abrufen
  async getMessages(matchId: string): Promise<DatingMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/${matchId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.messages;
      } else {
        throw new Error(data.error || 'Fehler beim Laden der Nachrichten');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Nachrichten:', error);
      return this.getMockMessages(matchId);
    }
  }

  // Nachricht senden
  async sendMessage(messageData: {
    matchId: string;
    senderId: string;
    receiverId: string;
    content: string;
    messageType?: 'text' | 'image' | 'sticker';
  }): Promise<DatingMessage> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      const data = await response.json();
      
      if (data.success) {
        return data.message;
      } else {
        throw new Error(data.error || 'Fehler beim Senden der Nachricht');
      }
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      throw error;
    }
  }

  // Hilfsfunktionen
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCompatibilityColor(compatibility: number): string {
    if (compatibility >= 80) return '#10b981'; // Grün
    if (compatibility >= 60) return '#f59e0b'; // Orange
    if (compatibility >= 40) return '#ef4444'; // Rot
    return '#6b7280'; // Grau
  }

  getCompatibilityText(compatibility: number): string {
    if (compatibility >= 80) return 'Sehr hoch';
    if (compatibility >= 60) return 'Hoch';
    if (compatibility >= 40) return 'Mittel';
    return 'Niedrig';
  }

  // Mock-Daten als Fallback
  private getMockProfiles(): DatingProfile[] {
    return [
      {
        id: 'profile1',
        userId: 'user1',
        name: 'Max',
        age: 28,
        location: 'Berlin',
        bio: 'Generator mit 2/4 Profil. Liebe es, auf andere zu reagieren und Energie zu geben. Suche nach authentischen Verbindungen.',
        photos: ['/images/max1.jpg', '/images/max2.jpg', '/images/max3.jpg', '/images/max4.jpg'],
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
        photos: ['/images/sarah1.jpg', '/images/sarah2.jpg', '/images/sarah3.jpg'],
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
        photos: ['/images/tom1.jpg', '/images/tom2.jpg', '/images/tom3.jpg', '/images/tom4.jpg', '/images/tom5.jpg'],
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
        photos: ['/images/lisa1.jpg', '/images/lisa2.jpg', '/images/lisa3.jpg'],
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
  }

  private getMockProfile(userId: string): DatingProfile {
    const profiles = this.getMockProfiles();
    return profiles.find(p => p.userId === userId) || profiles[0];
  }

  private getMockMatches(userId: string): Match[] {
    return [
      {
        id: 'match1',
        user1Id: userId,
        user2Id: 'user2',
        compatibility: 85,
        hdCompatibility: {
          typeCompatibility: 75,
          profileCompatibility: 80,
          authorityCompatibility: 70,
          centersCompatibility: 85,
          channelsCompatibility: 90,
          gatesCompatibility: 75,
          incarnationCrossCompatibility: 80
        },
        matchDate: '2024-12-08T14:30:00Z',
        isActive: true,
        conversationStarted: true,
        otherProfile: this.getMockProfile('user2')
      },
      {
        id: 'match2',
        user1Id: userId,
        user2Id: 'user3',
        compatibility: 72,
        hdCompatibility: {
          typeCompatibility: 60,
          profileCompatibility: 70,
          authorityCompatibility: 75,
          centersCompatibility: 80,
          channelsCompatibility: 65,
          gatesCompatibility: 70,
          incarnationCrossCompatibility: 75
        },
        matchDate: '2024-12-07T10:15:00Z',
        isActive: true,
        conversationStarted: false,
        otherProfile: this.getMockProfile('user3')
      }
    ];
  }

  private getMockRecommendations(userId: string, filters?: {
    ageRange: [number, number];
    maxDistance: number;
    hdTypes: string[];
    minCompatibility: number;
    interests: string[];
    isActive: boolean;
  }): Recommendation[] {
    let profiles = this.getMockProfiles().filter(p => p.userId !== userId);
    
    // Filter anwenden
    if (filters) {
      profiles = profiles.filter(profile => {
        // Altersfilter
        if (profile.age < filters.ageRange[0] || profile.age > filters.ageRange[1]) {
          return false;
        }
        
        // HD-Typ Filter
        if (filters.hdTypes.length > 0 && !filters.hdTypes.includes(profile.hdType)) {
          return false;
        }
        
        // Aktivitätsfilter
        if (filters.isActive && !profile.isActive) {
          return false;
        }
        
        // Interessen-Filter (vereinfacht - prüft ob mindestens ein Interesse übereinstimmt)
        if (filters.interests.length > 0) {
          const hasMatchingInterest = profile.preferences.interests.some(interest => 
            filters.interests.includes(interest)
          );
          if (!hasMatchingInterest) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    return profiles.map(profile => {
      // Echte HD-Kompatibilitäts-Berechnung
      const hdCompatibility = this.calculateHDCompatibility(userId, profile);
      const compatibility = Math.round(hdCompatibility.overall);
      
      // Filter nach Mindest-Kompatibilität
      if (filters && compatibility < filters.minCompatibility) {
        return null;
      }
      
      return {
        ...profile,
        compatibility,
        hdCompatibility
      };
    }).filter(Boolean) as Recommendation[];
  }

  // Echte HD-Kompatibilitäts-Berechnung
  private calculateHDCompatibility(userId: string, profile: DatingProfile): {
    typeCompatibility: number;
    profileCompatibility: number;
    authorityCompatibility: number;
    centersCompatibility: number;
    channelsCompatibility: number;
    gatesCompatibility: number;
    incarnationCrossCompatibility: number;
    overall: number;
  } {
    // Hole User-Daten (vereinfacht - in echter App aus localStorage oder API)
    const userProfile = this.getMockProfile(userId);
    
    // Typ-Kompatibilität basierend auf HD-Typen
    const typeCompatibility = this.calculateTypeCompatibility(userProfile.hdType, profile.hdType);
    
    // Profil-Kompatibilität basierend auf Profilen
    const profileCompatibility = this.calculateProfileCompatibility(userProfile.hdProfile, profile.hdProfile);
    
    // Authority-Kompatibilität
    const authorityCompatibility = this.calculateAuthorityCompatibility(userProfile.hdAuthority, profile.hdAuthority);
    
    // Centers-Kompatibilität (gemeinsame definierte Centers)
    const centersCompatibility = this.calculateCentersCompatibility(userProfile.hdCenters, profile.hdCenters);
    
    // Channels-Kompatibilität (gemeinsame Channels)
    const channelsCompatibility = this.calculateChannelsCompatibility(userProfile.hdChannels, profile.hdChannels);
    
    // Gates-Kompatibilität (gemeinsame Gates)
    const gatesCompatibility = this.calculateGatesCompatibility(userProfile.hdGates, profile.hdGates);
    
    // Incarnation Cross-Kompatibilität
    const incarnationCrossCompatibility = this.calculateIncarnationCrossCompatibility(userProfile.incarnationCross, profile.incarnationCross);
    
    // Gesamt-Kompatibilität (gewichteter Durchschnitt)
    const overall = Math.round(
      (typeCompatibility * 0.25) +
      (profileCompatibility * 0.20) +
      (authorityCompatibility * 0.15) +
      (centersCompatibility * 0.15) +
      (channelsCompatibility * 0.15) +
      (gatesCompatibility * 0.05) +
      (incarnationCrossCompatibility * 0.05)
    );
    
    return {
      typeCompatibility,
      profileCompatibility,
      authorityCompatibility,
      centersCompatibility,
      channelsCompatibility,
      gatesCompatibility,
      incarnationCrossCompatibility,
      overall
    };
  }

  private calculateTypeCompatibility(userType: string, otherType: string): number {
    const compatibilityMatrix: Record<string, Record<string, number>> = {
      'Generator': {
        'Generator': 85,
        'Manifesting Generator': 90,
        'Projector': 75,
        'Manifestor': 60,
        'Reflector': 70
      },
      'Manifesting Generator': {
        'Generator': 90,
        'Manifesting Generator': 85,
        'Projector': 80,
        'Manifestor': 70,
        'Reflector': 75
      },
      'Projector': {
        'Generator': 75,
        'Manifesting Generator': 80,
        'Projector': 70,
        'Manifestor': 65,
        'Reflector': 80
      },
      'Manifestor': {
        'Generator': 60,
        'Manifesting Generator': 70,
        'Projector': 65,
        'Manifestor': 50,
        'Reflector': 70
      },
      'Reflector': {
        'Generator': 70,
        'Manifesting Generator': 75,
        'Projector': 80,
        'Manifestor': 70,
        'Reflector': 60
      }
    };
    
    return compatibilityMatrix[userType]?.[otherType] || 50;
  }

  private calculateProfileCompatibility(userProfile: string, otherProfile: string): number {
    // Vereinfachte Profil-Kompatibilität basierend auf Linien
    const userLines = userProfile.split('/').map(Number);
    const otherLines = otherProfile.split('/').map(Number);
    
    let compatibility = 50;
    
    // Gleiche Linien = höhere Kompatibilität
    if (userLines[0] === otherLines[0]) compatibility += 20;
    if (userLines[1] === otherLines[1]) compatibility += 20;
    
    // Komplementäre Linien = mittlere Kompatibilität
    const complementaryPairs = [[1, 2], [3, 4], [5, 6]];
    for (const [line1, line2] of complementaryPairs) {
      if ((userLines[0] === line1 && otherLines[0] === line2) || 
          (userLines[0] === line2 && otherLines[0] === line1)) {
        compatibility += 15;
      }
      if ((userLines[1] === line1 && otherLines[1] === line2) || 
          (userLines[1] === line2 && otherLines[1] === line1)) {
        compatibility += 15;
      }
    }
    
    return Math.min(compatibility, 100);
  }

  private calculateAuthorityCompatibility(userAuthority: string, otherAuthority: string): number {
    // Authority-Kompatibilität
    if (userAuthority === otherAuthority) return 90;
    
    const compatibleAuthorities: Record<string, string[]> = {
      'Sakral': ['Splenisch', 'Emotional'],
      'Splenisch': ['Sakral', 'Emotional'],
      'Emotional': ['Sakral', 'Splenisch'],
      'Keine': ['Sakral', 'Splenisch', 'Emotional']
    };
    
    if (compatibleAuthorities[userAuthority]?.includes(otherAuthority)) {
      return 75;
    }
    
    return 60;
  }

  private calculateCentersCompatibility(userCenters: string[], otherCenters: string[]): number {
    const sharedCenters = userCenters.filter(center => otherCenters.includes(center));
    const totalDefinedCenters = Math.max(userCenters.length, otherCenters.length);
    
    if (totalDefinedCenters === 0) return 50;
    
    return Math.round((sharedCenters.length / totalDefinedCenters) * 100);
  }

  private calculateChannelsCompatibility(userChannels: string[], otherChannels: string[]): number {
    const sharedChannels = userChannels.filter(channel => otherChannels.includes(channel));
    const totalChannels = Math.max(userChannels.length, otherChannels.length);
    
    if (totalChannels === 0) return 50;
    
    return Math.round((sharedChannels.length / totalChannels) * 100);
  }

  private calculateGatesCompatibility(userGates: string[], otherGates: string[]): number {
    const sharedGates = userGates.filter(gate => otherGates.includes(gate));
    const totalGates = Math.max(userGates.length, otherGates.length);
    
    if (totalGates === 0) return 50;
    
    return Math.round((sharedGates.length / totalGates) * 100);
  }

  private calculateIncarnationCrossCompatibility(userCross: string, otherCross: string): number {
    // Vereinfachte Incarnation Cross-Kompatibilität
    if (userCross === otherCross) return 95;
    
    // Extrahiere die Profile aus dem Cross
    const userCrossProfiles: string[] = userCross.match(/\d+\/\d+/g) || [];
    const otherCrossProfiles: string[] = otherCross.match(/\d+\/\d+/g) || [];
    
    let compatibility = 50;
    
    // Gleiche Profile im Cross = höhere Kompatibilität
    for (const userProfile of userCrossProfiles) {
      if (otherCrossProfiles.includes(userProfile)) {
        compatibility += 20;
      }
    }
    
    return Math.min(compatibility, 100);
  }

  private getMockMessages(matchId: string): DatingMessage[] {
    return [
      {
        id: 'msg1',
        matchId,
        senderId: 'user2',
        receiverId: 'user1',
        content: 'Hallo! Ich habe gesehen, dass du auch Human Design interessiert bist. Wie gefällt dir die App?',
        timestamp: '2024-12-08T14:35:00Z',
        isRead: true,
        messageType: 'text'
      },
      {
        id: 'msg2',
        matchId,
        senderId: 'user1',
        receiverId: 'user2',
        content: 'Hi! Ja, die App ist wirklich toll. Ich finde es faszinierend, wie genau die Chart-Analysen sind.',
        timestamp: '2024-12-08T14:40:00Z',
        isRead: true,
        messageType: 'text'
      },
      {
        id: 'msg3',
        matchId,
        senderId: 'user2',
        receiverId: 'user1',
        content: 'Absolut! Als Projector bin ich besonders von der Führungsenergie fasziniert. Wie erlebst du deine Generator-Energie?',
        timestamp: '2024-12-08T14:45:00Z',
        isRead: false,
        messageType: 'text'
      }
    ];
  }
}

// Singleton-Instanz
export const datingService = new DatingService();
export default datingService;
