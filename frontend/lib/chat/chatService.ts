import { io, Socket } from 'socket.io-client';

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

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  hdType: string;
  profile: string;
  authority: string;
  centers: string[];
  channels: string[];
  gates: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  compatibility: number;
}

class ChatService {
  private socket: Socket | null = null;
  private isConnected = false;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private notificationHandlers: ((notification: any) => void)[] = [];
  private typingHandlers: ((data: any) => void)[] = [];

  // WebSocket-Verbindung herstellen
  connect(userId: string): void {
    if (this.socket && this.isConnected) {
      return;
    }

    this.socket = io('http://localhost:4001', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('🔌 Chat-WebSocket verbunden');
      this.isConnected = true;
      
      // Benutzer-ID registrieren
      this.socket?.emit('register_user', { userId });
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Chat-WebSocket getrennt');
      this.isConnected = false;
    });

    this.socket.on('new_message', (message: ChatMessage) => {
      console.log('💬 Neue Nachricht erhalten:', message);
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.socket.on('message_notification', (notification: any) => {
      console.log('🔔 Nachrichten-Benachrichtigung:', notification);
      this.notificationHandlers.forEach(handler => handler(notification));
    });

    this.socket.on('user_typing', (data: any) => {
      console.log('⌨️ Benutzer tippt:', data);
      this.typingHandlers.forEach(handler => handler(data));
    });

    this.socket.on('error', (error: any) => {
      console.error('❌ Chat-WebSocket Fehler:', error);
    });
  }

  // WebSocket-Verbindung trennen
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Chat beitreten
  joinChat(chatId: string, userId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_chat', { chatId, userId });
    }
  }

  // Nachricht senden
  sendMessage(chatId: string, senderId: string, receiverId: string, text: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', {
        chatId,
        senderId,
        receiverId,
        text
      });
    }
  }

  // Nachricht als gelesen markieren
  markAsRead(messageId: string, userId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark_read', { messageId, userId });
    }
  }

  // Typing-Status senden
  setTyping(chatId: string, userId: string, isTyping: boolean): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { chatId, userId, isTyping });
    }
  }

  // Event-Handler registrieren
  onNewMessage(handler: (message: ChatMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  onNotification(handler: (notification: any) => void): void {
    this.notificationHandlers.push(handler);
  }

  onTyping(handler: (data: any) => void): void {
    this.typingHandlers.push(handler);
  }

  // Event-Handler entfernen
  removeMessageHandler(handler: (message: ChatMessage) => void): void {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  removeNotificationHandler(handler: (notification: any) => void): void {
    const index = this.notificationHandlers.indexOf(handler);
    if (index > -1) {
      this.notificationHandlers.splice(index, 1);
    }
  }

  removeTypingHandler(handler: (data: any) => void): void {
    const index = this.typingHandlers.indexOf(handler);
    if (index > -1) {
      this.typingHandlers.splice(index, 1);
    }
  }

  // REST-API-Methoden
  async getChats(userId: string): Promise<Chat[]> {
    try {
      const response = await fetch(`http://localhost:4001/chat/conversations/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.chats;
      } else {
        throw new Error(data.error || 'Fehler beim Laden der Chats');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Chats:', error);
      return this.getMockChats(userId);
    }
  }

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`http://localhost:4001/chat/messages/${chatId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.messages;
      } else {
        throw new Error(data.error || 'Fehler beim Laden der Nachrichten');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Nachrichten:', error);
      return this.getMockMessages(chatId);
    }
  }

  async createChat(user1Id: string, user2Id: string): Promise<Chat> {
    try {
      const response = await fetch('http://localhost:4001/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user1_id: user1Id,
          user2_id: user2Id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.chat;
      } else {
        throw new Error(data.error || 'Fehler beim Erstellen des Chats');
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Chats:', error);
      throw error;
    }
  }

  // Mock-Daten als Fallback
  private getMockChats(userId: string): Chat[] {
    return [
      {
        id: '1',
        user1_id: userId,
        user2_id: 'coach1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message: 'Hallo! Wie kann ich dir helfen?',
        last_message_at: new Date().toISOString()
      }
    ];
  }

  private getMockMessages(chatId: string): ChatMessage[] {
    return [
      {
        id: '1',
        chat_id: chatId,
        sender_id: 'coach1',
        receiver_id: 'user1',
        text: 'Hallo! Wie kann ich dir helfen?',
        created_at: new Date().toISOString(),
        is_read: false
      },
      {
        id: '2',
        chat_id: chatId,
        sender_id: 'user1',
        receiver_id: 'coach1',
        text: 'Ich hätte gerne eine Coaching-Session.',
        created_at: new Date().toISOString(),
        is_read: true
      }
    ];
  }

  // Mock-Chat-Benutzer
  getMockUsers(): ChatUser[] {
    return [
      {
        id: '1',
        name: 'Sophie',
        avatar: '/images/sophie.jpg',
        hdType: 'Generator',
        profile: '3/5',
        authority: 'Sakrale Autorität',
        centers: ['Sakral', 'Solar Plexus', 'Herz'],
        channels: ['10-20', '34-57'],
        gates: ['10', '20', '34', '57'],
        lastMessage: 'Hallo! Ich sehe, wir haben eine interessante Kompatibilität! 🌟',
        lastMessageTime: 'vor 30 Min',
        unreadCount: 2,
        isOnline: true,
        compatibility: 87
      },
      {
        id: '2',
        name: 'Max',
        avatar: '/images/max.jpg',
        hdType: 'Projector',
        profile: '2/4',
        authority: 'Splenische Autorität',
        centers: ['Splenisch', 'Solar Plexus', 'Herz'],
        channels: ['20-34', '57-10'],
        gates: ['20', '34', '57', '10'],
        lastMessage: 'Wie geht es dir heute?',
        lastMessageTime: 'vor 1 Std',
        unreadCount: 0,
        isOnline: false,
        compatibility: 92
      },
      {
        id: '3',
        name: 'Lisa',
        avatar: '/images/lisa.jpg',
        hdType: 'Manifestor',
        profile: '1/3',
        authority: 'Splenische Autorität',
        centers: ['Splenisch', 'Solar Plexus'],
        channels: ['10-20'],
        gates: ['10', '20'],
        lastMessage: 'Danke für deine Hilfe! 🙏',
        lastMessageTime: 'vor 2 Std',
        unreadCount: 1,
        isOnline: true,
        compatibility: 78
      }
    ];
  }
}

// Singleton-Instanz
export const chatService = new ChatService();
export default chatService;
