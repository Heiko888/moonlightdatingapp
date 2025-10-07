import { supabase } from './client';

// Types
export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  hd_type?: string;
  profile?: string;
  authority?: string;
  strategy?: string;
  incarnation_cross?: string;
  centers?: any;
  channels?: any;
  gates?: any;
  planets?: any;
  subscription_package?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Chart {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  hd_type?: string;
  profile?: string;
  authority?: string;
  strategy?: string;
  incarnation_cross?: string;
  centers?: any;
  channels?: any;
  gates?: any;
  planets?: any;
  calculation_method?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchingProfile {
  id: string;
  user_id: string;
  name: string;
  age?: number;
  location?: string;
  bio?: string;
  hd_type?: string;
  profile?: string;
  authority?: string;
  strategy?: string;
  centers?: any;
  channels?: any;
  gates?: any;
  planets?: any;
  interests?: string[];
  images?: string[];
  avatar?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MoonTracking {
  id: string;
  user_id: string;
  date: string;
  moon_phase?: string;
  mood?: number;
  energy?: number;
  sleep_hours?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Profile Service
export class ProfileService {
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  static async createProfile(profileData: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  }
}

// Chart Service
export class ChartService {
  static async getCharts(userId: string): Promise<Chart[]> {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching charts:', error);
      return [];
    }

    return data || [];
  }

  static async createChart(chartData: Partial<Chart>): Promise<Chart | null> {
    const { data, error } = await supabase
      .from('charts')
      .insert(chartData)
      .select()
      .single();

    if (error) {
      console.error('Error creating chart:', error);
      return null;
    }

    return data;
  }

  static async updateChart(chartId: string, updates: Partial<Chart>): Promise<Chart | null> {
    const { data, error } = await supabase
      .from('charts')
      .update(updates)
      .eq('id', chartId)
      .select()
      .single();

    if (error) {
      console.error('Error updating chart:', error);
      return null;
    }

    return data;
  }

  static async deleteChart(chartId: string): Promise<boolean> {
    const { error } = await supabase
      .from('charts')
      .delete()
      .eq('id', chartId);

    if (error) {
      console.error('Error deleting chart:', error);
      return false;
    }

    return true;
  }
}

// Matching Service
export class MatchingService {
  static async getMatchingProfiles(userId: string, limit: number = 20, offset: number = 0): Promise<MatchingProfile[]> {
    const { data, error } = await supabase
      .from('matching_profiles')
      .select('*')
      .eq('is_active', true)
      .neq('user_id', userId) // Exclude own profile
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching matching profiles:', error);
      return [];
    }

    return data || [];
  }

  static async createMatchingProfile(profileData: Partial<MatchingProfile>): Promise<MatchingProfile | null> {
    const { data, error } = await supabase
      .from('matching_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating matching profile:', error);
      return null;
    }

    return data;
  }

  static async swipeUser(userId: string, targetId: string, liked: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('swipes')
      .upsert({
        user_id: userId,
        target_id: targetId,
        liked: liked
      });

    if (error) {
      console.error('Error processing swipe:', error);
      return false;
    }

    return true;
  }

  static async getMatches(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        user1:profiles!matches_user1_id_fkey(*),
        user2:profiles!matches_user2_id_fkey(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    return data || [];
  }
}

// Moon Tracking Service
export class MoonTrackingService {
  static async getMoonTracking(userId: string, startDate?: string, endDate?: string): Promise<MoonTracking[]> {
    let query = supabase
      .from('moon_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching moon tracking:', error);
      return [];
    }

    return data || [];
  }

  static async addMoonTracking(trackingData: Partial<MoonTracking>): Promise<MoonTracking | null> {
    const { data, error } = await supabase
      .from('moon_tracking')
      .insert(trackingData)
      .select()
      .single();

    if (error) {
      console.error('Error adding moon tracking:', error);
      return null;
    }

    return data;
  }

  static async updateMoonTracking(trackingId: string, updates: Partial<MoonTracking>): Promise<MoonTracking | null> {
    const { data, error } = await supabase
      .from('moon_tracking')
      .update(updates)
      .eq('id', trackingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating moon tracking:', error);
      return null;
    }

    return data;
  }

  static async deleteMoonTracking(trackingId: string): Promise<boolean> {
    const { error } = await supabase
      .from('moon_tracking')
      .delete()
      .eq('id', trackingId);

    if (error) {
      console.error('Error deleting moon tracking:', error);
      return false;
    }

    return true;
  }
}

// Chat Service
export class ChatService {
  static async getConversations(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles!chat_messages_sender_id_fkey(*),
        receiver:profiles!chat_messages_receiver_id_fkey(*)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    return data || [];
  }

  static async getMessages(conversationId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles!chat_messages_sender_id_fkey(*)
      `)
      .or(`sender_id.eq.${conversationId},receiver_id.eq.${conversationId}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  }

  static async sendMessage(messageData: {
    sender_id: string;
    receiver_id: string;
    content: string;
    message_type?: string;
  }): Promise<any | null> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    return data;
  }

  static async markAsRead(messageId: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
      return false;
    }

    return true;
  }
}

// Community Service
export class CommunityService {
  static async getPosts(limit: number = 20, offset: number = 0): Promise<any[]> {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        author:profiles!community_posts_user_id_fkey(*)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data || [];
  }

  static async createPost(postData: {
    user_id: string;
    title: string;
    content: string;
    category?: string;
    tags?: string[];
  }): Promise<any | null> {
    const { data, error } = await supabase
      .from('community_posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return null;
    }

    return data;
  }

  static async likePost(postId: string): Promise<boolean> {
    const { error } = await supabase
      .from('community_posts')
      .update({ likes_count: supabase.raw('likes_count + 1') })
      .eq('id', postId);

    if (error) {
      console.error('Error liking post:', error);
      return false;
    }

    return true;
  }
}
