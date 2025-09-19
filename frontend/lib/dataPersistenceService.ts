/**
 * Datenpersistierung Service
 * Verbindet das Frontend mit der Backend-Datenbank für echte Datenpersistierung
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

// ==================== TYPES ====================

export interface UserProfile {
  id?: string;
  name?: string;
  birthdate?: string;
  birthplace?: string;
  hd_type?: string;
  profile?: string;
  centers?: any;
  channels?: any;
  gates?: any;
  planets?: any;
  chart_data?: any;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChartData {
  id?: string;
  user_id?: string;
  name: string;
  birth_date: string;
  birth_time?: string;
  birth_place: string;
  chart_data: any;
  centers?: any;
  channels?: any;
  gates?: any;
  planets?: any;
  created_at?: string;
  updated_at?: string;
}

export interface MoonTrackingEntry {
  id?: string;
  user_id?: string;
  date: string;
  moon_phase: string;
  mood?: number;
  energy?: number;
  notes?: string;
  rituals_completed?: string[];
  journal_entry_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JournalEntry {
  id?: string;
  user_id?: string;
  title: string;
  content: string;
  mood?: string;
  energy_level?: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface DashboardData {
  user: UserProfile | null;
  charts: ChartData[];
  journalEntries: JournalEntry[];
  moonEntries: MoonTrackingEntry[];
  statistics: {
    totalCharts: number;
    totalJournalEntries: number;
    totalMoonEntries: number;
    lastActivity: string;
  };
}

// ==================== API HELPER ====================

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Token aus localStorage holen (nur im Browser)
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.error || 'API-Fehler');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Netzwerkfehler oder Server nicht erreichbar');
  }
}

// ==================== USER PROFILE SERVICE ====================

export const userProfileService = {
  // Benutzerprofil speichern/aktualisieren
  async saveProfile(profileData: Partial<UserProfile>): Promise<{ success: boolean; message: string; userId: string }> {
    return apiRequest('/data-persistence/user-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  // Benutzerprofil abrufen
  async getProfile(): Promise<UserProfile> {
    return apiRequest('/data-persistence/user-profile');
  },

  // Profil aus localStorage synchronisieren
  async syncFromLocalStorage(): Promise<void> {
    try {
      const profileData = typeof window !== 'undefined' ? localStorage.getItem('profileData') : null;
      const chartData = typeof window !== 'undefined' ? localStorage.getItem('chartData') : null;
      
      if (profileData && chartData) {
        const profile = JSON.parse(profileData);
        const chart = JSON.parse(chartData);
        
        await this.saveProfile({
          name: profile.name,
          birthdate: profile.birthdate,
          birthplace: profile.birthplace,
          hd_type: chart.hdType,
          profile: chart.profile,
          centers: chart.centers,
          channels: chart.channels,
          gates: chart.gates,
          planets: chart.planets,
          chart_data: chart
        });
        
        console.log('✅ Profil erfolgreich mit Datenbank synchronisiert');
      }
    } catch (error) {
      console.error('❌ Fehler bei der Profil-Synchronisation:', error);
    }
  }
};

// ==================== CHART SERVICE ====================

export const chartService = {
  // Chart speichern
  async saveChart(chartData: Omit<ChartData, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; chartId: string; message: string }> {
    return apiRequest('/data-persistence/chart', {
      method: 'POST',
      body: JSON.stringify(chartData),
    });
  },

  // Alle Charts des Benutzers abrufen
  async getCharts(): Promise<ChartData[]> {
    return apiRequest('/data-persistence/charts');
  },

  // Chart aus localStorage synchronisieren
  async syncFromLocalStorage(): Promise<void> {
    try {
      const chartData = typeof window !== 'undefined' ? localStorage.getItem('chartData') : null;
      const profileData = typeof window !== 'undefined' ? localStorage.getItem('profileData') : null;
      
      if (chartData && profileData) {
        const chart = JSON.parse(chartData);
        const profile = JSON.parse(profileData);
        
        await this.saveChart({
          name: profile.name || 'Mein Chart',
          birth_date: profile.birthdate,
          birth_time: profile.birthtime || '00:00',
          birth_place: profile.birthplace,
          chart_data: chart,
          centers: chart.centers,
          channels: chart.channels,
          gates: chart.gates,
          planets: chart.planets
        });
        
        console.log('✅ Chart erfolgreich mit Datenbank synchronisiert');
      }
    } catch (error) {
      console.error('❌ Fehler bei der Chart-Synchronisation:', error);
    }
  }
};

// ==================== MOON TRACKING SERVICE ====================

export const moonTrackingService = {
  // Mondkalender-Eintrag speichern
  async saveEntry(entryData: Omit<MoonTrackingEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; trackingId: string; message: string }> {
    return apiRequest('/data-persistence/moon-tracking', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  },

  // Mondkalender-Einträge abrufen
  async getEntries(startDate?: string, endDate?: string): Promise<MoonTrackingEntry[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/data-persistence/moon-tracking?${queryString}` : '/data-persistence/moon-tracking';
    
    return apiRequest(endpoint);
  },

  // Eintrag aus localStorage synchronisieren
  async syncFromLocalStorage(): Promise<void> {
    try {
      const moonEntries = typeof window !== 'undefined' ? localStorage.getItem('moonTrackingEntries') : null;
      
      if (moonEntries) {
        const entries = JSON.parse(moonEntries);
        
        for (const entry of entries) {
          await this.saveEntry({
            date: entry.date,
            moon_phase: entry.moon_phase,
            mood: entry.mood,
            energy: entry.energy,
            notes: entry.notes,
            rituals_completed: entry.rituals_completed
          });
        }
        
        console.log('✅ Mondkalender-Einträge erfolgreich mit Datenbank synchronisiert');
      }
    } catch (error) {
      console.error('❌ Fehler bei der Mondkalender-Synchronisation:', error);
    }
  }
};

// ==================== JOURNAL SERVICE ====================

export const journalService = {
  // Journal-Eintrag speichern
  async saveEntry(entryData: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; entryId: string; message: string }> {
    return apiRequest('/data-persistence/journal', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  },

  // Journal-Einträge abrufen
  async getEntries(limit: number = 50, offset: number = 0): Promise<JournalEntry[]> {
    return apiRequest(`/data-persistence/journal?limit=${limit}&offset=${offset}`);
  },

  // Einträge aus localStorage synchronisieren
  async syncFromLocalStorage(): Promise<void> {
    try {
      const journalEntries = typeof window !== 'undefined' ? localStorage.getItem('journalEntries') : null;
      
      if (journalEntries) {
        const entries = JSON.parse(journalEntries);
        
        for (const entry of entries) {
          await this.saveEntry({
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            energy_level: entry.energy_level,
            tags: entry.tags
          });
        }
        
        console.log('✅ Journal-Einträge erfolgreich mit Datenbank synchronisiert');
      }
    } catch (error) {
      console.error('❌ Fehler bei der Journal-Synchronisation:', error);
    }
  }
};

// ==================== DASHBOARD SERVICE ====================

export const dashboardService = {
  // Zentrale Dashboard-Daten abrufen
  async getDashboardData(): Promise<DashboardData> {
    return apiRequest('/data-persistence/dashboard');
  },

  // Alle Daten aus localStorage synchronisieren
  async syncAllFromLocalStorage(): Promise<void> {
    try {
      console.log('🔄 Starte vollständige Daten-Synchronisation...');
      
      await Promise.all([
        userProfileService.syncFromLocalStorage(),
        chartService.syncFromLocalStorage(),
        moonTrackingService.syncFromLocalStorage(),
        journalService.syncFromLocalStorage()
      ]);
      
      console.log('✅ Alle Daten erfolgreich mit Datenbank synchronisiert');
    } catch (error) {
      console.error('❌ Fehler bei der vollständigen Synchronisation:', error);
    }
  }
};

// ==================== UTILITY FUNCTIONS ====================

export const dataPersistenceUtils = {
  // Prüfen ob Benutzer authentifiziert ist
  isAuthenticated(): boolean {
    return typeof window !== 'undefined' ? !!localStorage.getItem('authToken') : false;
  },

  // Daten aus localStorage in Datenbank synchronisieren
  async syncLocalDataToDatabase(): Promise<void> {
    if (!this.isAuthenticated()) {
      console.log('⚠️ Benutzer nicht authentifiziert - Synchronisation übersprungen');
      return;
    }

    try {
      await dashboardService.syncAllFromLocalStorage();
    } catch (error) {
      console.error('❌ Synchronisation fehlgeschlagen:', error);
    }
  },

  // Daten aus Datenbank in localStorage laden
  async loadDataFromDatabase(): Promise<DashboardData | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const dashboardData = await dashboardService.getDashboardData();
      
      // Speichere die wichtigsten Daten in localStorage für Offline-Nutzung
      if (typeof window !== 'undefined') {
        if (dashboardData.user) {
          localStorage.setItem('profileData', JSON.stringify(dashboardData.user));
        }
        
        if (dashboardData.charts.length > 0) {
          localStorage.setItem('chartData', JSON.stringify(dashboardData.charts[0].chart_data));
        }
        
        if (dashboardData.moonEntries.length > 0) {
          localStorage.setItem('moonTrackingEntries', JSON.stringify(dashboardData.moonEntries));
        }
        
        if (dashboardData.journalEntries.length > 0) {
          localStorage.setItem('journalEntries', JSON.stringify(dashboardData.journalEntries));
        }
      }
      
      return dashboardData;
    } catch (error) {
      console.error('❌ Fehler beim Laden der Datenbank-Daten:', error);
      return null;
    }
  },

  // Hybrid-Modus: Lokale Daten mit Datenbank synchronisieren
  async hybridSync(): Promise<void> {
    try {
      // 1. Lokale Daten in Datenbank synchronisieren
      await this.syncLocalDataToDatabase();
      
      // 2. Datenbank-Daten in localStorage laden (für Offline-Nutzung)
      await this.loadDataFromDatabase();
      
      console.log('✅ Hybrid-Synchronisation erfolgreich abgeschlossen');
    } catch (error) {
      console.error('❌ Hybrid-Synchronisation fehlgeschlagen:', error);
    }
  }
};

// ==================== EXPORT ====================

export default {
  userProfileService,
  chartService,
  moonTrackingService,
  journalService,
  dashboardService,
  dataPersistenceUtils
};
