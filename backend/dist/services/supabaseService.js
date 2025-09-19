"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const supabase_1 = require("../lib/supabase");
const monitoring_1 = require("../middleware/monitoring");
class SupabaseService {
    // User Operations
    static async createUser(userData) {
        (0, monitoring_1.trackDatabaseOperation)('insert', 'users');
        const { data, error } = await supabase_1.supabase
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
    static async getUserById(id) {
        (0, monitoring_1.trackDatabaseOperation)('select', 'users');
        const { data, error } = await supabase_1.supabase
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
    static async getUserByEmail(email) {
        (0, monitoring_1.trackDatabaseOperation)('select', 'users');
        const { data, error } = await supabase_1.supabase
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
    static async updateUser(id, updates) {
        (0, monitoring_1.trackDatabaseOperation)('update', 'users');
        const { data, error } = await supabase_1.supabase
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
    static async getAllUsers() {
        (0, monitoring_1.trackDatabaseOperation)('select', 'users');
        const { data, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('[SUPABASE] Users get all error:', error);
            return [];
        }
        return data || [];
    }
    static async countUsers() {
        (0, monitoring_1.trackDatabaseOperation)('select', 'users');
        const { count, error } = await supabase_1.supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
        if (error) {
            console.error('[SUPABASE] Users count error:', error);
            return 0;
        }
        return count || 0;
    }
    // Chart Operations
    static async createChart(chartData) {
        (0, monitoring_1.trackDatabaseOperation)('insert', 'charts');
        const { data, error } = await supabase_1.supabase
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
    static async getChartsByUserId(userId) {
        (0, monitoring_1.trackDatabaseOperation)('select', 'charts');
        const { data, error } = await supabase_1.supabase
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
    static async getChartById(id) {
        (0, monitoring_1.trackDatabaseOperation)('select', 'charts');
        const { data, error } = await supabase_1.supabase
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
    static async countCharts() {
        (0, monitoring_1.trackDatabaseOperation)('select', 'charts');
        const { count, error } = await supabase_1.supabase
            .from('charts')
            .select('*', { count: 'exact', head: true });
        if (error) {
            console.error('[SUPABASE] Charts count error:', error);
            return 0;
        }
        return count || 0;
    }
    // Reading Operations
    static async createReading(readingData) {
        (0, monitoring_1.trackDatabaseOperation)('insert', 'readings');
        const { data, error } = await supabase_1.supabase
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
    static async getReadingsByUserId(userId) {
        (0, monitoring_1.trackDatabaseOperation)('select', 'readings');
        const { data, error } = await supabase_1.supabase
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
    static async getReadingById(id) {
        (0, monitoring_1.trackDatabaseOperation)('select', 'readings');
        const { data, error } = await supabase_1.supabase
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
    static async updateReading(id, updates) {
        (0, monitoring_1.trackDatabaseOperation)('update', 'readings');
        const { data, error } = await supabase_1.supabase
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
    static async deleteReading(id) {
        (0, monitoring_1.trackDatabaseOperation)('delete', 'readings');
        const { error } = await supabase_1.supabase
            .from('readings')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('[SUPABASE] Reading delete error:', error);
            return false;
        }
        return true;
    }
    static async searchReadings(userId, query) {
        (0, monitoring_1.trackDatabaseOperation)('select', 'readings');
        const { data, error } = await supabase_1.supabase
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
    static async countReadings() {
        (0, monitoring_1.trackDatabaseOperation)('select', 'readings');
        const { count, error } = await supabase_1.supabase
            .from('readings')
            .select('*', { count: 'exact', head: true });
        if (error) {
            console.error('[SUPABASE] Readings count error:', error);
            return 0;
        }
        return count || 0;
    }
    // Knowledge Operations
    static async createKnowledgeItem(itemData) {
        (0, monitoring_1.trackDatabaseOperation)('insert', 'knowledge_items');
        const { data, error } = await supabase_1.supabase
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
    static async getKnowledgeItemsByScope(scope) {
        (0, monitoring_1.trackDatabaseOperation)('select', 'knowledge_items');
        const { data, error } = await supabase_1.supabase
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
    static async createChat(chatData) {
        (0, monitoring_1.trackDatabaseOperation)('insert', 'chats');
        const { data, error } = await supabase_1.supabase
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
    static async getChatsByUserId(userId) {
        (0, monitoring_1.trackDatabaseOperation)('select', 'chats');
        const { data, error } = await supabase_1.supabase
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
    static async createMessage(messageData) {
        (0, monitoring_1.trackDatabaseOperation)('insert', 'messages');
        const { data, error } = await supabase_1.supabase
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
    static async getMessagesByChatId(chatId) {
        (0, monitoring_1.trackDatabaseOperation)('select', 'messages');
        const { data, error } = await supabase_1.supabase
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
    static async getHDTypeDistribution() {
        (0, monitoring_1.trackDatabaseOperation)('select', 'users');
        const { data, error } = await supabase_1.supabase
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
        }, {}) || {};
        return Object.entries(distribution).map(([hd_type, count]) => ({ hd_type, count }));
    }
    static async getProfileDistribution() {
        (0, monitoring_1.trackDatabaseOperation)('select', 'users');
        const { data, error } = await supabase_1.supabase
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
        }, {}) || {};
        return Object.entries(distribution).map(([profile, count]) => ({ profile, count }));
    }
}
exports.SupabaseService = SupabaseService;
