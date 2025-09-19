import { Request, Response, NextFunction } from 'express';
import { 
  databaseOperations, 
  authenticationAttempts, 
  errorRate,
  openaiApiCalls,
  fileUploads,
  chartsGenerated,
  readingsCompleted,
  chatMessages
} from '../monitoring/prometheus';

// Middleware für Datenbankoperationen tracken
export const trackDatabaseOperation = (operation: string, collection: string) => {
  databaseOperations.labels(operation, collection).inc();
};

// Middleware für Authentifizierungsversuche
export const trackAuthAttempt = (method: string, success: boolean) => {
  authenticationAttempts.labels(method, success.toString()).inc();
};

// Middleware für Fehler tracken
export const trackError = (type: string, route: string) => {
  errorRate.labels(type, route).inc();
};

// Middleware für OpenAI API-Aufrufe
export const trackOpenAICall = (endpoint: string, status: string) => {
  openaiApiCalls.labels(endpoint, status).inc();
};

// Middleware für Datei-Uploads
export const trackFileUpload = (fileType: string, size: number) => {
  const sizeCategory = size < 1024 * 1024 ? 'small' : 
                      size < 10 * 1024 * 1024 ? 'medium' : 'large';
  fileUploads.labels(fileType, sizeCategory).inc();
};

// Business-spezifische Tracking-Funktionen
export const trackChartGeneration = () => {
  chartsGenerated.inc();
};

export const trackReadingCompletion = () => {
  readingsCompleted.inc();
};

export const trackChatMessage = (chatType: string) => {
  chatMessages.labels(chatType).inc();
};

// Error Handler Middleware mit Prometheus Tracking
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const route = req.route?.path || req.path || 'unknown';
  const errorType = err.name || 'UnknownError';
  
  // Fehler in Prometheus tracken
  trackError(errorType, route);
  
  console.error(`[ERROR] ${req.method} ${route}:`, err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
};

// Performance Monitoring Middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // in Millisekunden
    
    // Log langsame Requests
    if (duration > 1000) { // über 1 Sekunde
      console.warn(`[SLOW] ${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
    }
  });
  
  next();
};

// Socket Connection Tracking
export const trackSocketConnection = (socket: any) => {
  const { socketConnections } = require('../monitoring/prometheus');
  
  socketConnections.inc();
  
  socket.on('disconnect', () => {
    socketConnections.dec();
  });
};
