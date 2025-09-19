"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const realtime_analysis_1 = require("../routes/realtime-analysis");
class RealtimeAnalysisWebSocketServer {
    constructor(server) {
        this.connections = new Map();
        this.wss = new ws_1.WebSocketServer({
            server,
            path: '/realtime-analysis/live'
        });
        this.setupWebSocketServer();
    }
    setupWebSocketServer() {
        this.wss.on('connection', (ws, request) => {
            const connectionId = this.generateConnectionId();
            console.log(`[WS] Neue Echtzeit-Analyse Verbindung: ${connectionId}`);
            const connection = {
                ws,
                connectionId,
                isAnalyzing: false
            };
            this.connections.set(connectionId, connection);
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    await this.handleMessage(connectionId, data);
                }
                catch (error) {
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
    async handleMessage(connectionId, data) {
        const connection = this.connections.get(connectionId);
        if (!connection)
            return;
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
    async startAnalysis(connectionId, chart1, chart2) {
        const connection = this.connections.get(connectionId);
        if (!connection || connection.isAnalyzing)
            return;
        connection.isAnalyzing = true;
        try {
            // Sende initiale Analyse
            const initialAnalysis = await (0, realtime_analysis_1.performComprehensiveAnalysis)(chart1, chart2);
            const result = {
                timestamp: Date.now(),
                analysis: initialAnalysis,
                confidence: (0, realtime_analysis_1.calculateConfidence)(initialAnalysis),
                insights: (0, realtime_analysis_1.generateInsights)(initialAnalysis)
            };
            this.sendMessage(connectionId, {
                type: 'analysis_update',
                result
            });
            // Starte Live-Updates (alle 5 Sekunden)
            connection.interval = setInterval(async () => {
                if (!connection.isAnalyzing)
                    return;
                try {
                    // Simuliere kleine Änderungen in der Analyse
                    const updatedAnalysis = await (0, realtime_analysis_1.performComprehensiveAnalysis)(chart1, chart2);
                    const result = {
                        timestamp: Date.now(),
                        analysis: updatedAnalysis,
                        confidence: (0, realtime_analysis_1.calculateConfidence)(updatedAnalysis),
                        insights: (0, realtime_analysis_1.generateInsights)(updatedAnalysis)
                    };
                    this.sendMessage(connectionId, {
                        type: 'analysis_update',
                        result
                    });
                }
                catch (error) {
                    console.error('[WS] Fehler bei Live-Analyse:', error);
                    this.sendError(connectionId, 'Fehler bei der Live-Analyse');
                }
            }, 5000);
        }
        catch (error) {
            console.error('[WS] Fehler beim Starten der Analyse:', error);
            this.sendError(connectionId, 'Fehler beim Starten der Analyse');
            connection.isAnalyzing = false;
        }
    }
    stopAnalysis(connectionId) {
        const connection = this.connections.get(connectionId);
        if (!connection)
            return;
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
    sendMessage(connectionId, message) {
        const connection = this.connections.get(connectionId);
        if (!connection || connection.ws.readyState !== ws_1.WebSocket.OPEN)
            return;
        try {
            connection.ws.send(JSON.stringify(message));
        }
        catch (error) {
            console.error(`[WS] Fehler beim Senden der Nachricht an ${connectionId}:`, error);
        }
    }
    sendError(connectionId, error) {
        this.sendMessage(connectionId, {
            type: 'error',
            message: error,
            timestamp: Date.now()
        });
    }
    cleanupConnection(connectionId) {
        const connection = this.connections.get(connectionId);
        if (connection) {
            if (connection.interval) {
                clearInterval(connection.interval);
            }
            this.connections.delete(connectionId);
        }
    }
    generateConnectionId() {
        return Math.random().toString(36).substr(2, 9);
    }
    // Öffentliche Methoden für externe Nutzung
    getConnectionCount() {
        return this.connections.size;
    }
    getActiveAnalyses() {
        return Array.from(this.connections.values()).filter(c => c.isAnalyzing).length;
    }
    broadcast(message) {
        this.connections.forEach((connection, connectionId) => {
            this.sendMessage(connectionId, message);
        });
    }
}
exports.default = RealtimeAnalysisWebSocketServer;
