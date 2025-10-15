// Common Types für die Anwendung

export interface Reading {
  id: string;
  title: string;
  category: string;
  status: string;
  email: string;
  birthdate: string;
  birthtime: string;
  birthplace: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReadingExtended extends Reading {
  userId?: string;
  notes?: string;
  chartData?: any;
  analysisData?: any;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  hdType?: string;
  hdProfile?: string;
  hdAuthority?: string;
  hdStrategy?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  avatar?: string;
  bio?: string;
  interests?: string[];
}

export interface Friend {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  avatar?: string;
  location?: string;
  age?: number;
  hdType?: string;
  hd_type?: string;
  hdProfile?: string;
  hd_profile?: string;
  hdAuthority?: string;
  hd_authority?: string;
  hdStrategy?: string;
  hd_strategy?: string;
  bio?: string;
  interests?: string[];
  isOnline?: boolean;
  is_online?: boolean;
  lastSeen?: string;
  last_seen?: string;
  status?: string;
  compatibility?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  compatibility?: number;
  mutual_friends?: number;
  connection_type?: 'friend' | 'match' | 'favorite' | 'like' | 'pass';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Match {
  _id: string;
  userA: { _id: string; name: string; image: string };
  userB: { _id: string; name: string; image: string };
  createdAt: string;
}

export interface ChartData {
  type: string;
  profile: string;
  authority: string;
  strategy: string;
  gates: any[];
  channels: any[];
  centers: any[];
  definition?: string;
  incarnationCross?: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
  description?: string;
}

export interface Subscription {
  packageId: string;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate?: string;
  autoRenew?: boolean;
  paymentMethod?: string;
  billingCycle?: 'monthly' | 'yearly';
}
