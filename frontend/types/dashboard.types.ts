/**
 * TypeScript-Interfaces für Dashboard-Komponenten
 * Zentrale Typisierung für bessere Entwicklererfahrung
 */

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
  category?: string; // Kategorie für Icon-Auswahl
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

export interface TrendData {
  date: string;
  count: number;
}

export interface DashboardTrends {
  moonEntries: TrendData[];
  readings: TrendData[];
  matches: TrendData[];
  communityActivity: TrendData[];
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: Activity[];
  notifications: Notification[];
  userProfile: UserProfile;
  trends: DashboardTrends;
}

// Props-Interfaces für Komponenten
export interface DashboardContentProps {
  className?: string;
}

export interface StatCardProps {
  value: number;
  label: string;
  type: 'moonEntries' | 'readings' | 'matches' | 'communityActivity';
  className?: string;
}

export interface ActivityItemProps {
  activity: Activity;
  className?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export interface RefreshButtonProps {
  isLoading: boolean;
  onRefresh: () => void;
  lastRefresh?: Date;
  className?: string;
}

// API-Response-Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode?: number;
    details?: unknown;
  };
}

export interface DashboardApiResponse extends ApiResponse<DashboardData> {
  data?: DashboardData;
}

export interface StatsApiResponse extends ApiResponse<DashboardStats> {
  data?: DashboardStats;
}

export interface ActivitiesApiResponse extends ApiResponse<Activity[]> {
  data?: Activity[];
}

export interface NotificationsApiResponse extends ApiResponse<Notification[]> {
  data?: Notification[];
}

export interface UserProfileApiResponse extends ApiResponse<UserProfile> {
  data?: UserProfile;
}

export interface TrendsApiResponse extends ApiResponse<DashboardTrends> {
  data?: DashboardTrends;
}

// Error-Interfaces
export interface DashboardError {
  message: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

// Filter-Interfaces
export interface ActivityFilter {
  type?: Activity['type'];
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export interface NotificationFilter {
  type?: Notification['type'];
  read?: boolean;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

// Event-Interfaces
export interface DashboardEvent {
  type: 'refresh' | 'error' | 'success' | 'loading';
  payload?: unknown;
  timestamp: string;
}

export interface RefreshEvent extends DashboardEvent {
  type: 'refresh';
  payload: {
    source: 'manual' | 'automatic';
    success: boolean;
  };
}

export interface ErrorEvent extends DashboardEvent {
  type: 'error';
  payload: {
    error: DashboardError;
    context: string;
  };
}

// Hook-Interfaces
export interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: LoadingState;
  refresh: () => Promise<void>;
  error: DashboardError | null;
}

export interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseActivitiesReturn {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  unreadCount: number;
}

// Utility-Types
export type DashboardComponent = React.FC<DashboardContentProps>;
export type StatCardComponent = React.FC<StatCardProps>;
export type ActivityItemComponent = React.FC<ActivityItemProps>;
export type NotificationItemComponent = React.FC<NotificationItemProps>;
export type RefreshButtonComponent = React.FC<RefreshButtonProps>;

// Theme-Interfaces
export interface DashboardTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Configuration-Interfaces
export interface DashboardConfig {
  refreshInterval: number;
  maxActivities: number;
  maxNotifications: number;
  enableRealTime: boolean;
  enableOfflineMode: boolean;
  cacheTimeout: number;
}

// Analytics-Interfaces
export interface DashboardAnalytics {
  pageViews: number;
  uniqueUsers: number;
  averageSessionTime: number;
  bounceRate: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  userEngagement: {
    activitiesCreated: number;
    notificationsRead: number;
    featuresUsed: string[];
  };
}
