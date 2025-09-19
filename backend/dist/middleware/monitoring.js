"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackSocketConnection = exports.performanceMonitor = exports.errorHandler = exports.trackChatMessage = exports.trackReadingCompletion = exports.trackChartGeneration = exports.trackFileUpload = exports.trackOpenAICall = exports.trackError = exports.trackAuthAttempt = exports.trackDatabaseOperation = void 0;
const prometheus_1 = require("../monitoring/prometheus");
// Middleware für Datenbankoperationen tracken
const trackDatabaseOperation = (operation, collection) => {
    prometheus_1.databaseOperations.labels(operation, collection).inc();
};
exports.trackDatabaseOperation = trackDatabaseOperation;
// Middleware für Authentifizierungsversuche
const trackAuthAttempt = (method, success) => {
    prometheus_1.authenticationAttempts.labels(method, success.toString()).inc();
};
exports.trackAuthAttempt = trackAuthAttempt;
// Middleware für Fehler tracken
const trackError = (type, route) => {
    prometheus_1.errorRate.labels(type, route).inc();
};
exports.trackError = trackError;
// Middleware für OpenAI API-Aufrufe
const trackOpenAICall = (endpoint, status) => {
    prometheus_1.openaiApiCalls.labels(endpoint, status).inc();
};
exports.trackOpenAICall = trackOpenAICall;
// Middleware für Datei-Uploads
const trackFileUpload = (fileType, size) => {
    const sizeCategory = size < 1024 * 1024 ? 'small' :
        size < 10 * 1024 * 1024 ? 'medium' : 'large';
    prometheus_1.fileUploads.labels(fileType, sizeCategory).inc();
};
exports.trackFileUpload = trackFileUpload;
// Business-spezifische Tracking-Funktionen
const trackChartGeneration = () => {
    prometheus_1.chartsGenerated.inc();
};
exports.trackChartGeneration = trackChartGeneration;
const trackReadingCompletion = () => {
    prometheus_1.readingsCompleted.inc();
};
exports.trackReadingCompletion = trackReadingCompletion;
const trackChatMessage = (chatType) => {
    prometheus_1.chatMessages.labels(chatType).inc();
};
exports.trackChatMessage = trackChatMessage;
// Error Handler Middleware mit Prometheus Tracking
const errorHandler = (err, req, res, next) => {
    const route = req.route?.path || req.path || 'unknown';
    const errorType = err.name || 'UnknownError';
    // Fehler in Prometheus tracken
    (0, exports.trackError)(errorType, route);
    console.error(`[ERROR] ${req.method} ${route}:`, err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
};
exports.errorHandler = errorHandler;
// Performance Monitoring Middleware
const performanceMonitor = (req, res, next) => {
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
exports.performanceMonitor = performanceMonitor;
// Socket Connection Tracking
const trackSocketConnection = (socket) => {
    const { socketConnections } = require('../monitoring/prometheus');
    socketConnections.inc();
    socket.on('disconnect', () => {
        socketConnections.dec();
    });
};
exports.trackSocketConnection = trackSocketConnection;
