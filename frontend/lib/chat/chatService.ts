// Chat Service mit Supabase Realtime
import { supabase } from '../supabase/client';

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
  is_read: boolean;
}

export interface Chat {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: string;
  profile: {
    type: string;
    authority: string;
    centers: string[];
    channels: string[];
    gates: string[];
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  compatibility: number;
}

class ChatService {
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private notificationHandlers: ((notification: any) => void)[] = [];
  private typingHandlers: ((data: any) => void)[] = [];

  // Supabase Realtime-Verbindung herstellen
  connect(userId: string): void {
    console.log('🔌 Chat-Supabase Realtime verbunden für User:', userId);
    
    // Supabase Realtime für neue Nachrichten
    supabase
      .channel('chat_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `receiver_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('💬 Neue Nachricht erhalten:', payload.new);
          const message = payload.new as ChatMessage;
          this.messageHandlers.forEach(handler => handler(message));
        }
      )
      .subscribe();
  }

  // Verbindung trennen
  disconnect(): void {
    console.log('🔌 Chat-Supabase Realtime getrennt');
    supabase.removeAllChannels();
  }

  // Nachricht senden
  async sendMessage(chatId: string, senderId: string, receiverId: string, text: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: senderId,
          receiver_id: receiverId,
          text: text,
          is_read: false
        });

      if (error) {
        console.error('❌ Fehler beim Senden der Nachricht:', error);
        return false;
      }

      console.log('✅ Nachricht gesendet:', data);
      return true;
    } catch (error) {
      console.error('❌ Fehler beim Senden der Nachricht:', error);
      return false;
    }
  }

  // REST-API-Methoden
  async getChats(userId: string): Promise<Chat[]> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ Fehler beim Laden der Chats:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Fehler beim Laden der Chats:', error);
      return [];
    }
  }

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Fehler beim Laden der Nachrichten:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Fehler beim Laden der Nachrichten:', error);
      return [];
    }
  }

  async createChat(user1Id: string, user2Id: string): Promise<Chat | null> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user1_id: user1Id,
          user2_id: user2Id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Fehler beim Erstellen des Chats:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Fehler beim Erstellen des Chats:', error);
      return null;
    }
  }

  // Event-Handler registrieren
  onMessage(handler: (message: ChatMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  onNotification(handler: (notification: any) => void): void {
    this.notificationHandlers.push(handler);
  }

  onTyping(handler: (data: any) => void): void {
    this.typingHandlers.push(handler);
  }

  // Event-Handler entfernen
  offMessage(handler: (message: ChatMessage) => void): void {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  offNotification(handler: (notification: any) => void): void {
    const index = this.notificationHandlers.indexOf(handler);
    if (index > -1) {
      this.notificationHandlers.splice(index, 1);
    }
  }

  offTyping(handler: (data: any) => void): void {
    const index = this.typingHandlers.indexOf(handler);
    if (index > -1) {
      this.typingHandlers.splice(index, 1);
    }
  }

  // Nachricht als gelesen markieren
  async markAsRead(messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) {
        console.error('❌ Fehler beim Markieren als gelesen:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Fehler beim Markieren als gelesen:', error);
      return false;
    }
  }

  // Alle Nachrichten eines Chats als gelesen markieren
  async markChatAsRead(chatId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('chat_id', chatId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Fehler beim Markieren des Chats als gelesen:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Fehler beim Markieren des Chats als gelesen:', error);
      return false;
    }
  }

  // Ungelesene Nachrichten zählen
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Fehler beim Zählen ungelesener Nachrichten:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('❌ Fehler beim Zählen ungelesener Nachrichten:', error);
      return 0;
    }
  }

  // Chat löschen
  async deleteChat(chatId: string): Promise<boolean> {
    try {
      // Zuerst alle Nachrichten löschen
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('chat_id', chatId);

      if (messagesError) {
        console.error('❌ Fehler beim Löschen der Nachrichten:', messagesError);
        return false;
      }

      // Dann den Chat löschen
      const { error: chatError } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (chatError) {
        console.error('❌ Fehler beim Löschen des Chats:', chatError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Fehler beim Löschen des Chats:', error);
      return false;
    }
  }
}

// Singleton-Instanz
export const chatService = new ChatService();
export default chatService;