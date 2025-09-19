import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { performComprehensiveAnalysis, calculateConfidence, generateInsights } from '../routes/realtime-analysis';

interface AnalysisConnection {
  ws: WebSocket;
  connectionId: string;
  isAnalyzing: boolean;
  interval?: NodeJS.Timeout;
}

class RealtimeAnalysisWebSocketServer {
  private wss: WebSocketServer;
  private connections: Map<string, AnalysisConnection> = new Map();

  constructor(server: any) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/realtime-analysis/live'
    });

    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      const connectionId = this.generateConnectionId();
      
      console.log(`[WS] Neue Echtzeit-Analyse Verbindung: ${connectionId}`);
      
      const connection: AnalysisConnection = {
        ws,
        connectionId,
        isAnalyzing: false
      };
      
      this.connections.set(connectionId, connection);

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          await this.handleMessage(connectionId, data);
        } catch (error) {
          console.error('[WS] Fehler beim Verarbeiten der Nachricht:', error);
          this.sendError(connectionId, 'Ungültige Nachricht');
        }
      });

      ws.on('close', () => {
        console.log(`[WS] Verbindung geschlossen: ${connectionId}`);
        this.cleanupConnection(connectionId);
      });

      ws.on('error', (error) => {
        console.error(`[WS] WebSocket-Fehler für ${connectionId}:`, error);
        this.cleanupConnection(connectionId);
      });

      // Sende Bestätigung der Verbindung
      this.sendMessage(connectionId, {
        type: 'connection_established',
        connectionId,
        timestamp: Date.now()
      });
    });
  }

  private async handleMessage(connectionId: string, data: any) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    switch (data.type) {
      case 'start_analysis':
        await this.startAnalysis(connectionId, data.chart1, data.chart2);
        break;
      case 'stop_analysis':
        this.stopAnalysis(connectionId);
        break;
      case 'ping':
        this.sendMessage(connectionId, { type: 'pong', timestamp: Date.now() });
        break;
      default:
        this.sendError(connectionId, `Unbekannter Nachrichtentyp: ${data.type}`);
    }
  }

  private async startAnalysis(connectionId: string, chart1: any, chart2: any) {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.isAnalyzing) return;

    connection.isAnalyzing = true;

    try {
      // Sende initiale Analyse
      const initialAnalysis = await performComprehensiveAnalysis(chart1, chart2);
      const result = {
        timestamp: Date.now(),
        analysis: initialAnalysis,
        confidence: calculateConfidence(initialAnalysis),
        insights: generateInsights(initialAnalysis)
      };

      this.sendMessage(connectionId, {
        type: 'analysis_update',
        result
      });

      // Starte Live-Updates (alle 5 Sekunden)
      connection.interval = setInterval(async () => {
        if (!connection.isAnalyzing) return;

        try {
          // Simuliere kleine Änderungen in der Analyse
          const updatedAnalysis = await performComprehensiveAnalysis(chart1, chart2);
          const result = {
            timestamp: Date.now(),
            analysis: updatedAnalysis,
            confidence: calculateConfidence(updatedAnalysis),
            insights: generateInsights(updatedAnalysis)
          };

          this.sendMessage(connectionId, {
            type: 'analysis_update',
            result
          });
        } catch (error) {
          console.error('[WS] Fehler bei Live-Analyse:', error);
          this.sendError(connectionId, 'Fehler bei der Live-Analyse');
        }
      }, 5000);

    } catch (error) {
      console.error('[WS] Fehler beim Starten der Analyse:', error);
      this.sendError(connectionId, 'Fehler beim Starten der Analyse');
      connection.isAnalyzing = false;
    }
  }

  private stopAnalysis(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    connection.isAnalyzing = false;
    
    if (connection.interval) {
      clearInterval(connection.interval);
      connection.interval = undefined;
    }

    this.sendMessage(connectionId, {
      type: 'analysis_stopped',
      timestamp: Date.now()
    });
  }

  private sendMessage(connectionId: string, message: any) {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.ws.readyState !== WebSocket.OPEN) return;

    try {
      connection.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error(`[WS] Fehler beim Senden der Nachricht an ${connectionId}:`, error);
    }
  }

  private sendError(connectionId: string, error: string) {
    this.sendMessage(connectionId, {
      type: 'error',
      message: error,
      timestamp: Date.now()
    });
  }

  private cleanupConnection(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (connection) {
      if (connection.interval) {
        clearInterval(connection.interval);
      }
      this.connections.delete(connectionId);
    }
  }

  private generateConnectionId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Öffentliche Methoden für externe Nutzung
  public getConnectionCount(): number {
    return this.connections.size;
  }

  public getActiveAnalyses(): number {
    return Array.from(this.connections.values()).filter(c => c.isAnalyzing).length;
  }

  public broadcast(message: any) {
    this.connections.forEach((connection, connectionId) => {
      this.sendMessage(connectionId, message);
    });
  }
}

export default RealtimeAnalysisWebSocketServer;
