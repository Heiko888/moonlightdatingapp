/**
 * Gemeinsame TypeScript-Interfaces für die gesamte App
 * Zentrale Typisierung für bessere Entwicklererfahrung
 */

// Basis-Interfaces
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  subscription: SubscriptionLevel;
  subscriptionExpires?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
}

// Subscription-Types
export type SubscriptionLevel = 'free' | 'basic' | 'premium' | 'vip' | 'admin';
export type UserRole = 'user' | 'moderator' | 'admin' | 'superadmin';

export interface Subscription extends BaseEntity {
  userId: string;
  level: SubscriptionLevel;
  status: 'active' | 'inactive' | 'expired' | 'cancelled';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  features: string[];
  metadata?: Record<string, unknown>;
}

// Dashboard-Types
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

export interface Activity extends BaseEntity {
  title: string;
  description?: string;
  type: 'moon' | 'reading' | 'match' | 'community' | 'system';
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface Notification extends BaseEntity {
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  actionUrl?: string;
  userId: string;
}

// Moon Calendar Types
export interface MoonEntry extends BaseEntity {
  userId: string;
  date: string;
  phase: MoonPhase;
  mood: string;
  energy: number;
  notes?: string;
  tags: string[];
  weather?: string;
  activities: string[];
  emotions: string[];
  gratitude?: string;
}

export interface MoonPhase {
  name: string;
  emoji: string;
  description: string;
  energy: 'low' | 'medium' | 'high';
  humanDesignConnection: string;
  zodiacSign: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
}

export interface MoonTracking extends BaseEntity {
  user_id: string;
  date: string;
  mood: number;
  energy_level: number;
  sleep_quality: number;
  notes: string;
  moon_phase: string;
  created_at: string;
  // Optionale erweiterte Felder
  tags?: string[];
  weather?: string;
  activities?: string[];
  emotions?: string[];
  gratitude?: string;
}

export interface MoonNotification extends BaseEntity {
  userId: string;
  type: 'phase_change' | 'full_moon' | 'new_moon' | 'eclipse';
  message: string;
  date: string;
  isRead: boolean;
  actionUrl?: string;
}

// Dating Types
export interface Match extends BaseEntity {
  userId1: string;
  userId2: string;
  compatibility: number;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  lastMessage?: string;
  lastMessageAt?: string;
  matchDate: string;
  mutualFriends?: number;
  sharedInterests?: string[];
}

export interface MatchMessage extends BaseEntity {
  matchId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'emoji' | 'gif';
  read: boolean;
  replyTo?: string;
}

export interface DatingProfile extends BaseEntity {
  userId: string;
  bio: string;
  age: number;
  location: string;
  photos: string[];
  interests: string[];
  hdType: string;
  lookingFor: string[];
  maxDistance: number;
  ageRange: {
    min: number;
    max: number;
  };
  isActive: boolean;
  lastActive: string;
}

export interface SwipeAction extends BaseEntity {
  userId: string;
  targetUserId: string;
  action: 'like' | 'pass' | 'super_like';
  timestamp: string;
}

// Community Types
export interface CommunityPost extends BaseEntity {
  authorId: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  isLiked: boolean;
}

export interface CommunityEvent extends BaseEntity {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  isAttending: boolean;
  organizerId: string;
}

// Coaching Types
export interface Coach extends BaseEntity {
  name: string;
  bio: string;
  specialties: string[];
  rating: number;
  totalSessions: number;
  price: number;
  currency: string;
  availability: CoachAvailability[];
  isOnline: boolean;
  lastSeen?: string;
  avatar?: string;
  experience: number;
  languages: string[];
  certifications: string[];
}

export interface CoachAvailability {
  day: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface CoachingSession extends BaseEntity {
  coachId: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  sessionType: '1:1 Coaching' | 'Group Session' | 'Workshop';
  meetingLink?: string;
}

export interface CoachMessage extends BaseEntity {
  sessionId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
}

// Reading Types
export interface Reading extends BaseEntity {
  userId: string;
  type: 'human_design' | 'astrology' | 'tarot' | 'numerology';
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  views: number;
  likes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  author: string;
  imageUrl?: string;
}

export interface ReadingCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  readingCount: number;
}

export interface ReadingHistory extends BaseEntity {
  userId: string;
  readingId: string;
  completedAt: string;
  progress: number;
  notes?: string;
  rating?: number;
}

// Meditation Types
export interface MeditationTechnique {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'Anfänger' | 'Fortgeschritten' | 'Experte';
  category: 'Achtsamkeit' | 'Atmung' | 'Visualisierung' | 'Mantra' | 'Körper';
  benefits: string[];
  icon: React.ReactNode;
  color: string;
  audioUrl?: string;
}

export interface GuidedMeditation {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  audioUrl: string;
  imageUrl?: string;
  instructor: string;
  difficulty: 'Anfänger' | 'Fortgeschritten' | 'Experte';
  tags: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode?: number;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Event Types
export interface AppEvent {
  type: string;
  payload?: unknown;
  timestamp: string;
  userId?: string;
}

export interface NavigationEvent extends AppEvent {
  type: 'navigation';
  payload: {
    from: string;
    to: string;
    method: 'click' | 'back' | 'forward' | 'direct';
  };
}

export interface UserActionEvent extends AppEvent {
  type: 'user_action';
  payload: {
    action: string;
    target: string;
    metadata?: Record<string, unknown>;
  };
}

// Theme Types
export interface Theme {
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

// Configuration Types
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    [key: string]: boolean;
  };
  limits: {
    [key: string]: number;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
  userId?: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Hook Return Types
export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseFormReturn<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
  setData: (data: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  clearErrors: () => void;
  submit: () => Promise<void>;
  reset: () => void;
}

// Component State Types
export interface ComponentState {
  loading: boolean;
  error: string | null;
  data: unknown;
}

export interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

export interface DrawerState {
  isOpen: boolean;
  anchor: 'left' | 'right' | 'top' | 'bottom';
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface UserAnalytics {
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

// Admin Types
export interface AdminUser extends User {
  registrationDate: string;
  lastLogin: string;
  totalSessions: number;
  subscriptionHistory: Subscription[];
  isBlocked: boolean;
  blockReason?: string;
  notes?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalRevenue: number;
  monthlyRevenue: number;
  subscriptionBreakdown: {
    free: number;
    basic: number;
    premium: number;
    vip: number;
  };
  topFeatures: Array<{
    name: string;
    usage: number;
  }>;
}

export interface AdminAuditLog extends BaseEntity {
  adminId: string;
  action: string;
  targetType: 'user' | 'subscription' | 'content' | 'system';
  targetId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
}

export interface AdminReport extends BaseEntity {
  title: string;
  description: string;
  type: 'user_activity' | 'revenue' | 'subscriptions' | 'content';
  data: Record<string, unknown>;
  generatedBy: string;
  dateRange: {
    start: string;
    end: string;
  };
}
