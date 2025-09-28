/**
 * WebSocket Chat Service für Real-time Kommunikation
 */

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  metadata?: Record<string, any>;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

class ChatService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private typingHandlers: ((indicator: TypingIndicator) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4001/ws';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.connectionHandlers.forEach(handler => handler(true));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.connectionHandlers.forEach(handler => handler(false));
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        this.connectionHandlers.forEach(handler => handler(false));
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'message':
        this.messageHandlers.forEach(handler => handler(data.payload));
        break;
      case 'typing':
        this.typingHandlers.forEach(handler => handler(data.payload));
        break;
      case 'user_status':
        // Handle user online/offline status
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  // Public Methods
  public sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    if (!this.isConnected || !this.ws) {
      console.error('WebSocket not connected');
      return false;
    }

    const fullMessage: ChatMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    };

    this.ws.send(JSON.stringify({
      type: 'message',
      payload: fullMessage
    }));

    return true;
  }

  public sendTypingIndicator(receiverId: string, isTyping: boolean) {
    if (!this.isConnected || !this.ws) {
      return false;
    }

    const indicator: TypingIndicator = {
      userId: receiverId,
      isTyping,
      timestamp: new Date().toISOString()
    };

    this.ws.send(JSON.stringify({
      type: 'typing',
      payload: indicator
    }));

    return true;
  }

  public joinChat(chatId: string) {
    if (!this.isConnected || !this.ws) {
      return false;
    }

    this.ws.send(JSON.stringify({
      type: 'join_chat',
      payload: { chatId }
    }));

    return true;
  }

  public leaveChat(chatId: string) {
    if (!this.isConnected || !this.ws) {
      return false;
    }

    this.ws.send(JSON.stringify({
      type: 'leave_chat',
      payload: { chatId }
    }));

    return true;
  }

  // Event Handlers
  public onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  public onTyping(handler: (indicator: TypingIndicator) => void) {
    this.typingHandlers.push(handler);
    return () => {
      const index = this.typingHandlers.indexOf(handler);
      if (index > -1) {
        this.typingHandlers.splice(index, 1);
      }
    };
  }

  public onConnection(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler);
    return () => {
      const index = this.connectionHandlers.indexOf(handler);
      if (index > -1) {
        this.connectionHandlers.splice(index, 1);
      }
    };
  }

  // Utility Methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

// Singleton instance
export const chatService = new ChatService();
