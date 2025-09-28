"use client";

import React from 'react';
import { EventEmitter } from 'events';

export interface LiveDataEvent {
  id: string;
  type: 'activity' | 'notification' | 'match' | 'moon' | 'community' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: {
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    tags: string[];
    [key: string]: any;
  };
}

export interface LiveStats {
  onlineUsers: number;
  activeChats: number;
  newMatches: number;
  moonPhases: number;
  communityPosts: number;
  systemHealth: 'excellent' | 'good' | 'poor' | 'critical';
  lastUpdate: Date;
}

export interface ConnectionStatus {
  isConnected: boolean;
  quality: 'excellent' | 'good' | 'poor' | 'offline';
  latency: number;
  lastPing: Date;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

class LiveDataService extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private connectionStatus: ConnectionStatus;
  private liveStats: LiveStats;
  private eventBuffer: LiveDataEvent[] = [];
  private maxBufferSize = 100;

  constructor() {
    super();
    this.connectionStatus = {
      isConnected: false,
      quality: 'offline',
      latency: 0,
      lastPing: new Date(),
      reconnectAttempts: 0,
      maxReconnectAttempts: 5
    };
    
    this.liveStats = {
      onlineUsers: 0,
      activeChats: 0,
      newMatches: 0,
      moonPhases: 0,
      communityPosts: 0,
      systemHealth: 'excellent',
      lastUpdate: new Date()
    };
  }

  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4001/ws';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);

      this.startPingTimer();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.emit('error', error);
    }
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.connectionStatus.isConnected = false;
    this.connectionStatus.quality = 'offline';
    this.emit('disconnected');
  }

  public sendMessage(type: string, data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = {
        type,
        data,
        timestamp: new Date().toISOString(),
        id: this.generateId()
      };
      
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message queued');
      this.eventBuffer.push({
        id: this.generateId(),
        type: 'system',
        title: 'Message Queued',
        message: 'Message will be sent when connection is restored',
        timestamp: new Date(),
        metadata: { priority: 'low', category: 'system', tags: ['queued'] }
      });
    }
  }

  public getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  public getLiveStats(): LiveStats {
    return { ...this.liveStats };
  }

  public getEventBuffer(): LiveDataEvent[] {
    return [...this.eventBuffer];
  }

  public clearEventBuffer(): void {
    this.eventBuffer = [];
    this.emit('bufferCleared');
  }

  private handleOpen(): void {
    console.log('WebSocket connected');
    this.connectionStatus.isConnected = true;
    this.connectionStatus.quality = 'excellent';
    this.connectionStatus.reconnectAttempts = 0;
    
    this.emit('connected');
    
    // Send queued messages
    this.flushEventBuffer();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'live_data':
          this.handleLiveData(message.data);
          break;
        case 'stats_update':
          this.handleStatsUpdate(message.data);
          break;
        case 'system_status':
          this.handleSystemStatus(message.data);
          break;
        case 'pong':
          this.handlePong(message.data);
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket disconnected:', event.code, event.reason);
    this.connectionStatus.isConnected = false;
    this.connectionStatus.quality = 'offline';
    
    this.emit('disconnected', { code: event.code, reason: event.reason });
    
    if (this.connectionStatus.reconnectAttempts < this.connectionStatus.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.connectionStatus.quality = 'poor';
    this.emit('error', error);
  }

  private handleLiveData(data: any): void {
    const event: LiveDataEvent = {
      id: data.id || this.generateId(),
      type: data.type || 'activity',
      title: data.title || 'Live Update',
      message: data.message || '',
      timestamp: new Date(data.timestamp || Date.now()),
      user: data.user,
      metadata: data.metadata
    };

    this.addToEventBuffer(event);
    this.emit('liveData', event);
  }

  private handleStatsUpdate(data: any): void {
    this.liveStats = {
      ...this.liveStats,
      ...data,
      lastUpdate: new Date()
    };

    this.emit('statsUpdate', this.liveStats);
  }

  private handleSystemStatus(data: any): void {
    this.connectionStatus.quality = data.quality || 'good';
    this.liveStats.systemHealth = data.health || 'good';
    
    this.emit('systemStatus', data);
  }

  private handlePong(data: any): void {
    this.connectionStatus.latency = Date.now() - data.timestamp;
    this.connectionStatus.lastPing = new Date();
    
    // Update quality based on latency
    if (this.connectionStatus.latency < 100) {
      this.connectionStatus.quality = 'excellent';
    } else if (this.connectionStatus.latency < 300) {
      this.connectionStatus.quality = 'good';
    } else if (this.connectionStatus.latency < 1000) {
      this.connectionStatus.quality = 'poor';
    } else {
      this.connectionStatus.quality = 'offline';
    }
  }

  private scheduleReconnect(): void {
    const delay = Math.min(1000 * Math.pow(2, this.connectionStatus.reconnectAttempts), 30000);
    
    this.reconnectTimer = setTimeout(() => {
      this.connectionStatus.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.connectionStatus.reconnectAttempts}/${this.connectionStatus.maxReconnectAttempts})`);
      this.connect();
    }, delay);
  }

  private startPingTimer(): void {
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.sendMessage('ping', { timestamp: Date.now() });
      }
    }, 30000); // Ping every 30 seconds
  }

  private addToEventBuffer(event: LiveDataEvent): void {
    this.eventBuffer.unshift(event);
    
    if (this.eventBuffer.length > this.maxBufferSize) {
      this.eventBuffer = this.eventBuffer.slice(0, this.maxBufferSize);
    }
  }

  private flushEventBuffer(): void {
    // Send any queued messages when connection is restored
    // This would be implemented based on your specific requirements
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Singleton instance
export const liveDataService = new LiveDataService();

// React Hook for easy integration
export const useLiveData = () => {
  const [connectionStatus, setConnectionStatus] = React.useState<ConnectionStatus>(
    liveDataService.getConnectionStatus()
  );
  const [liveStats, setLiveStats] = React.useState<LiveStats>(
    liveDataService.getLiveStats()
  );
  const [eventBuffer, setEventBuffer] = React.useState<LiveDataEvent[]>(
    liveDataService.getEventBuffer()
  );

  React.useEffect(() => {
    const handleConnected = () => {
      setConnectionStatus(liveDataService.getConnectionStatus());
    };

    const handleDisconnected = () => {
      setConnectionStatus(liveDataService.getConnectionStatus());
    };

    const handleLiveData = (event: LiveDataEvent) => {
      setEventBuffer(liveDataService.getEventBuffer());
    };

    const handleStatsUpdate = (stats: LiveStats) => {
      setLiveStats(stats);
    };

    liveDataService.on('connected', handleConnected);
    liveDataService.on('disconnected', handleDisconnected);
    liveDataService.on('liveData', handleLiveData);
    liveDataService.on('statsUpdate', handleStatsUpdate);

    return () => {
      liveDataService.off('connected', handleConnected);
      liveDataService.off('disconnected', handleDisconnected);
      liveDataService.off('liveData', handleLiveData);
      liveDataService.off('statsUpdate', handleStatsUpdate);
    };
  }, []);

  return {
    connectionStatus,
    liveStats,
    eventBuffer,
    connect: () => liveDataService.connect(),
    disconnect: () => liveDataService.disconnect(),
    sendMessage: (type: string, data: any) => liveDataService.sendMessage(type, data),
    clearBuffer: () => liveDataService.clearEventBuffer()
  };
};

export default LiveDataService;
