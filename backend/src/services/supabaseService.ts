import { supabase, HDUser, HDChart, HDReading, HDKnowledgeItem, HDChat, HDMessage } from '../lib/supabase';
import { trackDatabaseOperation } from '../middleware/monitoring';

export class SupabaseService {
  // User Operations
  static async createUser(userData: Partial<HDUser>): Promise<HDUser | null> {
    trackDatabaseOperation('insert', 'users');
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) {
      console.error('[SUPABASE] User create error:', error);
      return null;
    }
    return data;
  }

  static async getUserById(id: string): Promise<HDUser | null> {
    trackDatabaseOperation('select', 'users');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('[SUPABASE] User get error:', error);
      return null;
    }
    return data;
  }

  static async getUserByEmail(email: string): Promise<HDUser | null> {
    trackDatabaseOperation('select', 'users');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('[SUPABASE] User get by email error:', error);
      return null;
    }
    return data;
  }

  static async updateUser(id: string, updates: Partial<HDUser>): Promise<HDUser | null> {
    trackDatabaseOperation('update', 'users');
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('[SUPABASE] User update error:', error);
      return null;
    }
    return data;
  }

  static async getAllUsers(): Promise<HDUser[]> {
    trackDatabaseOperation('select', 'users');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[SUPABASE] Users get all error:', error);
      return [];
    }
    return data || [];
  }

  static async countUsers(): Promise<number> {
    trackDatabaseOperation('select', 'users');
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('[SUPABASE] Users count error:', error);
      return 0;
    }
    return count || 0;
  }

  // Chart Operations
  static async createChart(chartData: Partial<HDChart>): Promise<HDChart | null> {
    trackDatabaseOperation('insert', 'charts');
    const { data, error } = await supabase
      .from('charts')
      .insert(chartData)
      .select()
      .single();
    
    if (error) {
      console.error('[SUPABASE] Chart create error:', error);
      return null;
    }
    return data;
  }

  static async getChartsByUserId(userId: string): Promise<HDChart[]> {
    trackDatabaseOperation('select', 'charts');
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[SUPABASE] Charts get by user error:', error);
      return [];
    }
    return data || [];
  }

  static async getChartById(id: string): Promise<HDChart | null> {
    trackDatabaseOperation('select', 'charts');
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('[SUPABASE] Chart get error:', error);
      return null;
    }
    return data;
  }

  static async countCharts(): Promise<number> {
    trackDatabaseOperation('select', 'charts');
    const { count, error } = await supabase
      .from('charts')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('[SUPABASE] Charts count error:', error);
      return 0;
    }
    return count || 0;
  }

  // Reading Operations
  static async createReading(readingData: Partial<HDReading>): Promise<HDReading | null> {
    trackDatabaseOperation('insert', 'readings');
    const { data, error } = await supabase
      .from('readings')
      .insert(readingData)
      .select()
      .single();
    
    if (error) {
      console.error('[SUPABASE] Reading create error:', error);
      return null;
    }
    return data;
  }

  static async getReadingsByUserId(userId: string): Promise<HDReading[]> {
    trackDatabaseOperation('select', 'readings');
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[SUPABASE] Readings get by user error:', error);
      return [];
    }
    return data || [];
  }

  static async getReadingById(id: string): Promise<HDReading | null> {
    trackDatabaseOperation('select', 'readings');
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('[SUPABASE] Reading get by id error:', error);
      return null;
    }
    return data;
  }

  static async updateReading(id: string, updates: Partial<HDReading>): Promise<HDReading | null> {
    trackDatabaseOperation('update', 'readings');
    const { data, error } = await supabase
      .from('readings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('[SUPABASE] Reading update error:', error);
      return null;
    }
    return data;
  }

  static async deleteReading(id: string): Promise<boolean> {
    trackDatabaseOperation('delete', 'readings');
    const { error } = await supabase
      .from('readings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('[SUPABASE] Reading delete error:', error);
      return false;
    }
    return true;
  }

  static async searchReadings(userId: string, query: string): Promise<HDReading[]> {
    trackDatabaseOperation('select', 'readings');
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[SUPABASE] Readings search error:', error);
      return [];
    }
    return data || [];
  }

  static async countReadings(): Promise<number> {
    trackDatabaseOperation('select', 'readings');
    const { count, error } = await supabase
      .from('readings')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('[SUPABASE] Readings count error:', error);
      return 0;
    }
    return count || 0;
  }

  // Knowledge Operations
  static async createKnowledgeItem(itemData: Partial<HDKnowledgeItem>): Promise<HDKnowledgeItem | null> {
    trackDatabaseOperation('insert', 'knowledge_items');
    const { data, error } = await supabase
      .from('knowledge_items')
      .insert(itemData)
      .select()
      .single();
    
    if (error) {
      console.error('[SUPABASE] Knowledge item create error:', error);
      return null;
    }
    return data;
  }

  static async getKnowledgeItemsByScope(scope: string): Promise<HDKnowledgeItem[]> {
    trackDatabaseOperation('select', 'knowledge_items');
    const { data, error } = await supabase
      .from('knowledge_items')
      .select('*')
      .or(`scope.eq.${scope},scope.eq.all`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[SUPABASE] Knowledge items get by scope error:', error);
      return [];
    }
    return data || [];
  }

  // Chat Operations
  static async createChat(chatData: Partial<HDChat>): Promise<HDChat | null> {
    trackDatabaseOperation('insert', 'chats');
    const { data, error } = await supabase
      .from('chats')
      .insert(chatData)
      .select()
      .single();
    
    if (error) {
      console.error('[SUPABASE] Chat create error:', error);
      return null;
    }
    return data;
  }

  static async getChatsByUserId(userId: string): Promise<HDChat[]> {
    trackDatabaseOperation('select', 'chats');
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('[SUPABASE] Chats get by user error:', error);
      return [];
    }
    return data || [];
  }

  // Message Operations
  static async createMessage(messageData: Partial<HDMessage>): Promise<HDMessage | null> {
    trackDatabaseOperation('insert', 'messages');
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) {
      console.error('[SUPABASE] Message create error:', error);
      return null;
    }
    return data;
  }

  static async getMessagesByChatId(chatId: string): Promise<HDMessage[]> {
    trackDatabaseOperation('select', 'messages');
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('[SUPABASE] Messages get by chat error:', error);
      return [];
    }
    return data || [];
  }

  // Analytics
  static async getHDTypeDistribution(): Promise<{ hd_type: string; count: number }[]> {
    trackDatabaseOperation('select', 'users');
    const { data, error } = await supabase
      .from('users')
      .select('hd_type')
      .not('hd_type', 'is', null);
    
    if (error) {
      console.error('[SUPABASE] HD type distribution error:', error);
      return [];
    }

    // Manuell gruppieren (Supabase hat keine GROUP BY in der Client API)
    const distribution = data?.reduce((acc, user) => {
      const type = user.hd_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return Object.entries(distribution).map(([hd_type, count]) => ({ hd_type, count }));
  }

  static async getProfileDistribution(): Promise<{ profile: string; count: number }[]> {
    trackDatabaseOperation('select', 'users');
    const { data, error } = await supabase
      .from('users')
      .select('profile')
      .not('profile', 'is', null);
    
    if (error) {
      console.error('[SUPABASE] Profile distribution error:', error);
      return [];
    }

    const distribution = data?.reduce((acc, user) => {
      const profile = user.profile;
      acc[profile] = (acc[profile] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return Object.entries(distribution).map(([profile, count]) => ({ profile, count }));
  }
}
