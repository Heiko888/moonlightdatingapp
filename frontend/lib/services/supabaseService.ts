/**
 * Supabase-Only API Service
 * Alle API-Aufrufe direkt über Supabase
 */

import { supabase } from '@/lib/supabase/client';
import { 
  User
} from '@/types/common.types';
import { 
  Activity
} from '@/types/dashboard.types';

export class SupabaseService {
  
  // ==================== AUTHENTICATION ====================
  
  static async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return {
        success: true,
        data: {
          user: data.user,
          session: data.session
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }
  
  static async register(email: string, password: string, userData: Partial<User>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      return {
        success: true,
        data: {
          user: data.user,
          session: data.session
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }
  
  static async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  }
  
  // ==================== USER PROFILE ====================
  
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user profile'
      };
    }
  }
  
  static async updateUserProfile(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  }
  
  // ==================== MOON CALENDAR ====================
  
  static async getCurrentMoonPhase() {
    try {
      // Mock-Daten für Mondphase (kann später durch echte API ersetzt werden)
      const moonPhases = [
        {
          name: 'Vollmond',
          emoji: '🌕',
          energy: 'high',
          description: 'Zeit für Manifestation und Vollendung',
          humanDesignConnection: 'Solar Plexus Explosion: Der Vollmond aktiviert dein Solar Plexus-Zentrum'
        },
        {
          name: 'Neumond',
          emoji: '🌑',
          energy: 'low',
          description: 'Zeit für Neuanfänge und Intentionen',
          humanDesignConnection: 'G-Zentrum Aktivierung: Der Neumond aktiviert dein G-Zentrum'
        }
      ];
      
      // Wähle zufällige Mondphase für Demo
      const currentPhase = moonPhases[Math.floor(Math.random() * moonPhases.length)];
      
      return {
        success: true,
        data: currentPhase
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get moon phase'
      };
    }
  }
  
  static async getMoonTracking(userId: string) {
    try {
      const { data, error } = await supabase
        .from('moon_tracking')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get moon tracking'
      };
    }
  }
  
  static async getMoonTrackingCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('moon_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return {
        success: true,
        data: count || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get moon tracking count'
      };
    }
  }
  
  // ==================== DASHBOARD ====================
  
  static async getDashboardStats(userId: string) {
    try {
      // Parallele Abfrage aller Dashboard-Statistiken
      const [moonEntries, readings, matches, communityActivity] = await Promise.all([
        this.getMoonTrackingCount(userId),
        this.getUserReadingsCount(userId),
        this.getUserMatchesCount(userId),
        this.getCommunityActivityCount(userId)
      ]);
      
      return {
        success: true,
        data: {
          moonEntries: moonEntries.success ? moonEntries.data : 0,
          readings: readings.success ? readings.data : 0,
          matches: matches.success ? matches.data : 0,
          communityActivity: communityActivity.success ? communityActivity.data : 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get dashboard stats'
      };
    }
  }
  
  static async getUserReadingsCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('readings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return {
        success: true,
        data: count || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get readings count'
      };
    }
  }
  
  static async getUserMatchesCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return {
        success: true,
        data: count || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get matches count'
      };
    }
  }
  
  static async getCommunityActivityCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return {
        success: true,
        data: count || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get community activity count'
      };
    }
  }
  
  static async getDashboardActivities(userId: string) {
    try {
      // Hole alle Aktivitäten für Dashboard
      const [moonEntries, readings, matches] = await Promise.all([
        this.getMoonTracking(userId),
        this.getUserReadings(userId),
        this.getUserMatches(userId)
      ]);
      
      const activities: Activity[] = [];
      
      // Konvertiere Moon Entries zu Activities
      if (moonEntries.success && moonEntries.data) {
        moonEntries.data.slice(0, 5).forEach((entry: Record<string, unknown>) => {
          activities.push({
            id: `moon-${String(entry.id)}`,
            type: 'moon',
            category: 'moon',
            title: `Mondkalender-Eintrag`,
            description: `Mondphase: ${String(entry.moon_phase)}`,
            timestamp: String(entry.created_at),
            metadata: { moonPhase: entry.moon_phase, mood: entry.mood }
          });
        });
      }
      
      // Konvertiere Readings zu Activities
      if (readings.success && readings.data) {
        readings.data.slice(0, 5).forEach((reading: Record<string, unknown>) => {
          activities.push({
            id: `reading-${String(reading.id)}`,
            type: 'reading',
            category: 'reading',
            title: `Reading durchgeführt`,
            description: `Reading-Typ: ${String(reading.type)}`,
            timestamp: String(reading.created_at),
            metadata: { readingType: reading.type }
          });
        });
      }
      
      // Konvertiere Matches zu Activities
      if (matches.success && matches.data) {
        matches.data.slice(0, 5).forEach((match: Record<string, unknown>) => {
          activities.push({
            id: `match-${String(match.id)}`,
            type: 'match',
            category: 'match',
            title: `Neues Match`,
            description: `Kompatibilität: ${String(match.compatibility)}%`,
            timestamp: String(match.created_at),
            metadata: { compatibility: match.compatibility }
          });
        });
      }
      
      // Füge Community-Aktivitäten hinzu (Beispiel)
      activities.push({
        id: 'community-1',
        type: 'community',
        category: 'community',
        title: 'Community-Beitrag erstellt',
        description: 'Neuer Beitrag in der Community veröffentlicht',
        timestamp: new Date().toISOString(),
        metadata: { postType: 'discussion' }
      });
      
      // Sortiere nach Timestamp (neueste zuerst)
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return {
        success: true,
        data: activities.slice(0, 10) // Maximal 10 Aktivitäten
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get dashboard activities'
      };
    }
  }
  
  static async getDashboardNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get notifications'
      };
    }
  }
  
  static async getDashboardData(userId: string) {
    try {
      // Hole alle Dashboard-Daten parallel
      const [stats, activities, notifications] = await Promise.all([
        this.getDashboardStats(userId),
        this.getDashboardActivities(userId),
        this.getDashboardNotifications(userId)
      ]);
      
      return {
        success: true,
        data: {
          stats: stats.success ? stats.data : {
            moonEntries: 0,
            readings: 0,
            matches: 0,
            communityActivity: 0
          },
          activities: activities.success ? activities.data : [],
          notifications: notifications.success ? notifications.data : []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get dashboard data'
      };
    }
  }
  
  // ==================== HELPER METHODS ====================
  
  static async getUserReadings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('readings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get readings'
      };
    }
  }
  
  static async getUserMatches(userId: string) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get matches'
      };
    }
  }
}

// Export als Singleton
export const supabaseService = new SupabaseService();
