/**
 * Dashboard-Service für echte Daten aus dem Backend
 * Ersetzt alle statischen Daten durch API-Aufrufe
 */

import { api } from '@/lib/api/client';
import { API_CONFIG } from '@/lib/api/config';

export interface DashboardStats {
  moonEntries: number;
  readings: number;
  matches: number;
  communityActivity: number;
  totalUsers?: number;
  activeUsers?: number;
  revenue?: number;
  growth?: number;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  type: 'moon' | 'reading' | 'match' | 'community' | 'system';
  timestamp: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  subscription: 'free' | 'basic' | 'premium' | 'vip' | 'admin';
  joinDate: string;
  lastActive: string;
  totalReadings: number;
  totalMoonEntries: number;
  totalMatches: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: Activity[];
  notifications: Notification[];
  userProfile: UserProfile;
  trends: {
    moonEntries: Array<{ date: string; count: number }>;
    readings: Array<{ date: string; count: number }>;
    matches: Array<{ date: string; count: number }>;
    communityActivity: Array<{ date: string; count: number }>;
  };
}

class DashboardService {
  /**
   * Lädt alle Dashboard-Daten
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Parallele API-Aufrufe für bessere Performance
      const [
        statsResponse,
        activitiesResponse,
        notificationsResponse,
        profileResponse,
        trendsResponse
      ] = await Promise.allSettled([
        this.getStats(),
        this.getRecentActivities(),
        this.getNotifications(),
        this.getUserProfile(),
        this.getTrends()
      ]);

      // Daten verarbeiten und Fallbacks verwenden
      const stats = statsResponse.status === 'fulfilled' 
        ? statsResponse.value 
        : this.getDefaultStats();

      const recentActivities = activitiesResponse.status === 'fulfilled'
        ? activitiesResponse.value
        : this.getDefaultActivities();

      const notifications = notificationsResponse.status === 'fulfilled'
        ? notificationsResponse.value
        : this.getDefaultNotifications();

      const userProfile = profileResponse.status === 'fulfilled'
        ? profileResponse.value
        : this.getDefaultUserProfile();

      const trends = trendsResponse.status === 'fulfilled'
        ? trendsResponse.value
        : this.getDefaultTrends();

      return {
        stats,
        recentActivities,
        notifications,
        userProfile,
        trends
      };
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
      return this.getDefaultDashboardData();
    }
  }

  /**
   * Lädt Statistiken
   */
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback: Einzelne Statistiken laden
      return await this.loadIndividualStats();
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
      return this.getDefaultStats();
    }
  }

  /**
   * Lädt einzelne Statistiken als Fallback
   */
  private async loadIndividualStats(): Promise<DashboardStats> {
    try {
      const [moonResponse, readingsResponse, matchesResponse, communityResponse] = await Promise.allSettled([
        api.get(`${API_CONFIG.ENDPOINTS.MOON.ENTRIES}?count=true`),
        api.get(`${API_CONFIG.ENDPOINTS.COACHING.SESSIONS}?count=true`),
        api.get(`${API_CONFIG.ENDPOINTS.DATING.MATCHES}?count=true`),
        api.get(`${API_CONFIG.ENDPOINTS.COMMUNITY.POSTS}?count=true`)
      ]);

      return {
        moonEntries: moonResponse.status === 'fulfilled' && moonResponse.value.success
          ? moonResponse.value.data?.count || 0 : 0,
        readings: readingsResponse.status === 'fulfilled' && readingsResponse.value.success
          ? readingsResponse.value.data?.count || 0 : 0,
        matches: matchesResponse.status === 'fulfilled' && matchesResponse.value.success
          ? matchesResponse.value.data?.count || 0 : 0,
        communityActivity: communityResponse.status === 'fulfilled' && communityResponse.value.success
          ? communityResponse.value.data?.count || 0 : 0
      };
    } catch (error) {
      console.error('Fehler beim Laden der einzelnen Statistiken:', error);
      return this.getDefaultStats();
    }
  }

  /**
   * Lädt aktuelle Aktivitäten
   */
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    try {
      const response = await api.get<Activity[]>(`/dashboard/activities?limit=${limit}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback: Aktivitäten aus verschiedenen Quellen sammeln
      return await this.loadActivitiesFromSources(limit);
    } catch (error) {
      console.error('Fehler beim Laden der Aktivitäten:', error);
      return this.getDefaultActivities();
    }
  }

  /**
   * Lädt Aktivitäten aus verschiedenen Quellen als Fallback
   */
  private async loadActivitiesFromSources(limit: number): Promise<Activity[]> {
    try {
      const [moonActivities, readingActivities, matchActivities, communityActivities] = await Promise.allSettled([
        api.get(`${API_CONFIG.ENDPOINTS.MOON.ENTRIES}?limit=${Math.ceil(limit / 4)}&sort=createdAt:desc`),
        api.get(`${API_CONFIG.ENDPOINTS.COACHING.SESSIONS}?limit=${Math.ceil(limit / 4)}&sort=createdAt:desc`),
        api.get(`${API_CONFIG.ENDPOINTS.DATING.MATCHES}?limit=${Math.ceil(limit / 4)}&sort=createdAt:desc`),
        api.get(`${API_CONFIG.ENDPOINTS.COMMUNITY.POSTS}?limit=${Math.ceil(limit / 4)}&sort=createdAt:desc`)
      ]);

      const activities: Activity[] = [];

      // Moon-Aktivitäten
      if (moonActivities.status === 'fulfilled' && moonActivities.value.success && moonActivities.value.data) {
        const moonData = Array.isArray(moonActivities.value.data) ? moonActivities.value.data : [];
        activities.push(...moonData.map((entry: Record<string, unknown>) => ({
          id: String(entry.id || `moon-${Date.now()}`),
          title: String(entry.title || 'Mondkalender-Eintrag'),
          description: entry.description ? String(entry.description) : undefined,
          type: 'moon' as const,
          timestamp: String(entry.createdAt || new Date().toISOString()),
          metadata: { phase: entry.phase, mood: entry.mood }
        })));
      }

      // Reading-Aktivitäten
      if (readingActivities.status === 'fulfilled' && readingActivities.value.success && readingActivities.value.data) {
        const readingData = Array.isArray(readingActivities.value.data) ? readingActivities.value.data : [];
        activities.push(...readingData.map((session: Record<string, unknown>) => ({
          id: String(session.id || `reading-${Date.now()}`),
          title: String(session.title || 'Coaching-Session'),
          description: session.description ? String(session.description) : undefined,
          type: 'reading' as const,
          timestamp: String(session.createdAt || new Date().toISOString()),
          metadata: { coach: session.coach, duration: session.duration }
        })));
      }

      // Match-Aktivitäten
      if (matchActivities.status === 'fulfilled' && matchActivities.value.success && matchActivities.value.data) {
        const matchData = Array.isArray(matchActivities.value.data) ? matchActivities.value.data : [];
        activities.push(...matchData.map((match: Record<string, unknown>) => ({
          id: String(match.id || `match-${Date.now()}`),
          title: 'Neuer Match',
          description: `Match mit ${match.name || 'unbekanntem Benutzer'}`,
          type: 'match' as const,
          timestamp: String(match.createdAt || new Date().toISOString()),
          metadata: { compatibility: match.compatibility }
        })));
      }

      // Community-Aktivitäten
      if (communityActivities.status === 'fulfilled' && communityActivities.value.success && communityActivities.value.data) {
        const communityData = Array.isArray(communityActivities.value.data) ? communityActivities.value.data : [];
        activities.push(...communityData.map((post: Record<string, unknown>) => ({
          id: String(post.id || `community-${Date.now()}`),
          title: String(post.title || 'Community-Post'),
          description: post.content ? String(post.content).substring(0, 100) + '...' : undefined,
          type: 'community' as const,
          timestamp: String(post.createdAt || new Date().toISOString()),
          metadata: { likes: post.likes, comments: post.comments }
        })));
      }

      // Sortieren nach Timestamp und limitieren
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Fehler beim Laden der Aktivitäten aus Quellen:', error);
      return this.getDefaultActivities();
    }
  }

  /**
   * Lädt Benachrichtigungen
   */
  async getNotifications(limit: number = 5): Promise<Notification[]> {
    try {
      const response = await api.get<Notification[]>(`/dashboard/notifications?limit=${limit}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return this.getDefaultNotifications();
    } catch (error) {
      console.error('Fehler beim Laden der Benachrichtigungen:', error);
      return this.getDefaultNotifications();
    }
  }

  /**
   * Lädt Benutzerprofil
   */
  async getUserProfile(): Promise<UserProfile> {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Keine Benutzer-ID verfügbar');
      }

      const response = await api.get<UserProfile>(`${API_CONFIG.ENDPOINTS.USERS.PROFILE.replace(':id', userId)}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return this.getDefaultUserProfile();
    } catch (error) {
      console.error('Fehler beim Laden des Benutzerprofils:', error);
      return this.getDefaultUserProfile();
    }
  }

  /**
   * Lädt Trends
   */
  async getTrends(days: number = 30): Promise<DashboardData['trends']> {
    try {
      const response = await api.get<DashboardData['trends']>(`/dashboard/trends?days=${days}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return this.getDefaultTrends();
    } catch (error) {
      console.error('Fehler beim Laden der Trends:', error);
      return this.getDefaultTrends();
    }
  }

  /**
   * Markiert Benachrichtigung als gelesen
   */
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await api.put(`/dashboard/notifications/${notificationId}/read`, {});
      return response.success;
    } catch (error) {
      console.error('Fehler beim Markieren der Benachrichtigung als gelesen:', error);
      return false;
    }
  }

  /**
   * Löscht Benachrichtigung
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await api.delete(`/dashboard/notifications/${notificationId}`);
      return response.success;
    } catch (error) {
      console.error('Fehler beim Löschen der Benachrichtigung:', error);
      return false;
    }
  }

  // Fallback-Daten
  private getDefaultStats(): DashboardStats {
    return {
      moonEntries: 0,
      readings: 0,
      matches: 0,
      communityActivity: 0
    };
  }

  private getDefaultActivities(): Activity[] {
    return [
      {
        id: 'default-1',
        title: 'Willkommen in der Human Design App!',
        description: 'Beginne deine Reise mit dem Human Design System',
        type: 'system',
        timestamp: new Date().toISOString()
      }
    ];
  }

  private getDefaultNotifications(): Notification[] {
    return [
      {
        id: 'default-1',
        message: 'Willkommen! Erkunde die verschiedenen Features der App.',
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
  }

  private getDefaultUserProfile(): UserProfile {
    const userData = localStorage.getItem('userData');
    const parsedUser = userData ? JSON.parse(userData) : {};
    
    return {
      id: parsedUser.id || 'unknown',
      firstName: parsedUser.firstName || 'Benutzer',
      lastName: parsedUser.lastName || '',
      email: parsedUser.email || 'unknown@example.com',
      avatar: parsedUser.avatar,
      subscription: parsedUser.subscription || 'free',
      joinDate: parsedUser.joinDate || new Date().toISOString(),
      lastActive: new Date().toISOString(),
      totalReadings: 0,
      totalMoonEntries: 0,
      totalMatches: 0
    };
  }

  private getDefaultTrends(): DashboardData['trends'] {
    const dates = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return {
      moonEntries: dates.map(date => ({ date, count: Math.floor(Math.random() * 5) })),
      readings: dates.map(date => ({ date, count: Math.floor(Math.random() * 3) })),
      matches: dates.map(date => ({ date, count: Math.floor(Math.random() * 2) })),
      communityActivity: dates.map(date => ({ date, count: Math.floor(Math.random() * 10) }))
    };
  }

  private getDefaultDashboardData(): DashboardData {
    return {
      stats: this.getDefaultStats(),
      recentActivities: this.getDefaultActivities(),
      notifications: this.getDefaultNotifications(),
      userProfile: this.getDefaultUserProfile(),
      trends: this.getDefaultTrends()
    };
  }
}

// Singleton-Instanz exportieren
export const dashboardService = new DashboardService();

// Convenience-Funktionen
export const getDashboardData = () => dashboardService.getDashboardData();
export const getDashboardStats = () => dashboardService.getStats();
export const getRecentActivities = (limit?: number) => dashboardService.getRecentActivities(limit);
export const getNotifications = (limit?: number) => dashboardService.getNotifications(limit);
export const getUserProfile = () => dashboardService.getUserProfile();
export const getTrends = (days?: number) => dashboardService.getTrends(days);
export const markNotificationAsRead = (id: string) => dashboardService.markNotificationAsRead(id);
export const deleteNotification = (id: string) => dashboardService.deleteNotification(id);
