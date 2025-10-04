/**
 * Audit-Logging-System für Admin-Aktionen
 * Protokolliert wichtige Benutzer-Aktionen für Compliance und Debugging
 */

import React from 'react';
import { api } from '@/lib/api/client';
import { API_CONFIG } from '@/lib/api/config';
import { getUserId, getUserData } from '@/lib/session/sessionManager';

export interface AuditEvent {
  id?: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'auth' | 'admin' | 'user' | 'system' | 'security';
}

export interface AuditFilter {
  userId?: string;
  action?: string;
  resource?: string;
  category?: string;
  severity?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

class AuditLogger {
  private static instance: AuditLogger;
  private eventQueue: AuditEvent[] = [];
  private isProcessing = false;
  private config = {
    batchSize: 10,
    flushInterval: 30000, // 30 Sekunden
    maxRetries: 3,
    retryDelay: 1000
  };

  private constructor() {
    this.startFlushTimer();
  }

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Startet den Timer für periodisches Flushen
   */
  private startFlushTimer(): void {
    setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Protokolliert ein Audit-Event
   */
  public async log(event: Omit<AuditEvent, 'id' | 'userId' | 'userEmail' | 'timestamp'>): Promise<void> {
    const userId = getUserId();
    const userData = getUserData();

    if (!userId || !userData) {
      console.warn('Audit-Log: Keine Benutzerdaten verfügbar');
      return;
    }

    const auditEvent: AuditEvent = {
      ...event,
      id: this.generateEventId(),
      userId,
      userEmail: userData.email || 'unknown',
      timestamp: Date.now(),
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.eventQueue.push(auditEvent);

    // Sofortiges Flushen bei kritischen Events
    if (event.severity === 'critical') {
      await this.flush();
    }

    // Flushen wenn Queue voll ist
    if (this.eventQueue.length >= this.config.batchSize) {
      await this.flush();
    }
  }

  /**
   * Generiert eine eindeutige Event-ID
   */
  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Holt die Client-IP-Adresse
   */
  private async getClientIP(): Promise<string> {
    try {
      // In einer echten Anwendung würde man die IP vom Server holen
      // Hier simulieren wir es mit einer lokalen IP
      return '127.0.0.1';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Sendet alle Events im Queue an den Server
   */
  private async flush(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await api.post<{ success: boolean }>(
        '/audit/logs',
        { events: eventsToSend }
      );

      if (!response.success) {
        console.error('Audit-Log-Fehler:', response.error);
        // Events zurück in Queue bei Fehler
        this.eventQueue.unshift(...eventsToSend);
      }
    } catch (error) {
      console.error('Audit-Log-Netzwerkfehler:', error);
      // Events zurück in Queue bei Fehler
      this.eventQueue.unshift(...eventsToSend);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Holt Audit-Logs mit Filter
   */
  public async getLogs(filter: AuditFilter = {}): Promise<AuditEvent[]> {
    try {
      // URL mit Query-Parametern bauen
      const queryParams = new URLSearchParams();
      if (filter.userId) queryParams.append('userId', filter.userId);
      if (filter.action) queryParams.append('action', filter.action);
      if (filter.startDate) queryParams.append('startDate', filter.startDate.toISOString());
      if (filter.endDate) queryParams.append('endDate', filter.endDate.toISOString());
      
      const url = `/audit/logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get<AuditEvent[]>(url);

      return response.success ? response.data || [] : [];
    } catch (error) {
      console.error('Fehler beim Abrufen der Audit-Logs:', error);
      return [];
    }
  }

  /**
   * Holt Audit-Statistiken
   */
  public async getStats(timeframe: 'day' | 'week' | 'month' = 'day'): Promise<{
    totalEvents: number;
    eventsByCategory: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topActions: Array<{ action: string; count: number }>;
  }> {
    try {
      const response = await api.get<{
        totalEvents: number;
        eventsByCategory: Record<string, number>;
        eventsBySeverity: Record<string, number>;
        topActions: Array<{ action: string; count: number }>;
      }>(`/audit/stats?timeframe=${timeframe}`);

      return response.success ? response.data || {
        totalEvents: 0,
        eventsByCategory: {},
        eventsBySeverity: {},
        topActions: []
      } : {
        totalEvents: 0,
        eventsByCategory: {},
        eventsBySeverity: {},
        topActions: []
      };
    } catch (error) {
      console.error('Fehler beim Abrufen der Audit-Statistiken:', error);
      return {
        totalEvents: 0,
        eventsByCategory: {},
        eventsBySeverity: {},
        topActions: []
      };
    }
  }
}

// Singleton-Instanz exportieren
export const auditLogger = AuditLogger.getInstance();

// Convenience-Funktionen für häufige Audit-Events
export const logAuthEvent = (action: string, details?: Record<string, any>) => {
  auditLogger.log({
    action,
    resource: 'auth',
    category: 'auth',
    severity: action.includes('login') ? 'medium' : 'low',
    details
  });
};

export const logAdminEvent = (action: string, resource: string, resourceId?: string, details?: Record<string, any>) => {
  auditLogger.log({
    action,
    resource,
    resourceId,
    category: 'admin',
    severity: action.includes('delete') || action.includes('modify') ? 'high' : 'medium',
    details
  });
};

export const logUserEvent = (action: string, resource: string, resourceId?: string, details?: Record<string, any>) => {
  auditLogger.log({
    action,
    resource,
    resourceId,
    category: 'user',
    severity: 'low',
    details
  });
};

export const logSecurityEvent = (action: string, resource: string, details?: Record<string, any>) => {
  auditLogger.log({
    action,
    resource,
    category: 'security',
    severity: 'critical',
    details
  });
};

export const logSystemEvent = (action: string, resource: string, details?: Record<string, any>) => {
  auditLogger.log({
    action,
    resource,
    category: 'system',
    severity: 'medium',
    details
  });
};

// Spezifische Admin-Aktionen
export const logUserManagement = (action: 'create' | 'update' | 'delete' | 'suspend' | 'activate', userId: string, details?: Record<string, any>) => {
  logAdminEvent(`user_${action}`, 'user', userId, details);
};

export const logContentManagement = (action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish', contentType: string, contentId: string, details?: Record<string, any>) => {
  logAdminEvent(`content_${action}`, contentType, contentId, details);
};

export const logSystemConfiguration = (action: 'update' | 'reset', configType: string, details?: Record<string, any>) => {
  logAdminEvent(`config_${action}`, configType, undefined, details);
};

export const logDataExport = (dataType: string, recordCount: number, details?: Record<string, any>) => {
  logAdminEvent('data_export', dataType, undefined, { recordCount, ...details });
};

export const logDataImport = (dataType: string, recordCount: number, details?: Record<string, any>) => {
  logAdminEvent('data_import', dataType, undefined, { recordCount, ...details });
};

// React Hook für Audit-Logs
export const useAuditLogs = (filter: AuditFilter = {}) => {
  const [logs, setLogs] = React.useState<AuditEvent[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchLogs = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const auditLogs = await auditLogger.getLogs(filter);
      setLogs(auditLogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Logs');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
};

// React Hook für Audit-Statistiken
export const useAuditStats = (timeframe: 'day' | 'week' | 'month' = 'day') => {
  const [stats, setStats] = React.useState({
    totalEvents: 0,
    eventsByCategory: {} as Record<string, number>,
    eventsBySeverity: {} as Record<string, number>,
    topActions: [] as Array<{ action: string; count: number }>
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchStats = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const auditStats = await auditLogger.getStats(timeframe);
      setStats(auditStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Statistiken');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};
