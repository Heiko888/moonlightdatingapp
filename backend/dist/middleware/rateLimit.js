"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictRateLimit = exports.uploadRateLimit = exports.apiRateLimit = exports.authRateLimit = void 0;
exports.createRateLimit = createRateLimit;
exports.resetRateLimit = resetRateLimit;
exports.getRateLimitInfo = getRateLimitInfo;
// In-Memory Store für Rate Limiting (in Produktion sollte Redis verwendet werden)
const rateLimitStore = {};
// Standard-Rate-Limit-Konfiguration
const defaultConfig = {
    windowMs: 15 * 60 * 1000, // 15 Minuten
    maxRequests: 100, // 100 Requests pro 15 Minuten
    message: 'Zu viele Requests. Bitte versuche es später erneut.',
    statusCode: 429
};
// Rate Limiting Middleware erstellen
function createRateLimit(config = {}) {
    const finalConfig = { ...defaultConfig, ...config };
    return (req, res, next) => {
        // Client-IP als Schlüssel verwenden (oder API-Key falls vorhanden)
        const key = req.headers['x-api-key'] || req.ip || 'unknown';
        const now = Date.now();
        // Prüfe, ob der Client bereits im Store existiert
        if (!rateLimitStore[key]) {
            rateLimitStore[key] = {
                count: 0,
                resetTime: now + finalConfig.windowMs
            };
        }
        const clientData = rateLimitStore[key];
        // Prüfe, ob das Zeitfenster abgelaufen ist
        if (now > clientData.resetTime) {
            clientData.count = 0;
            clientData.resetTime = now + finalConfig.windowMs;
        }
        // Erhöhe den Request-Counter
        clientData.count++;
        // Prüfe, ob das Limit überschritten wurde
        if (clientData.count > finalConfig.maxRequests) {
            // Setze Rate-Limit-Header
            res.set({
                'X-RateLimit-Limit': finalConfig.maxRequests.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString(),
                'Retry-After': Math.ceil(finalConfig.windowMs / 1000).toString()
            });
            return res.status(finalConfig.statusCode).json({
                error: 'Rate Limit Exceeded',
                message: finalConfig.message,
                retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
            });
        }
        // Setze Rate-Limit-Header für erfolgreiche Requests
        res.set({
            'X-RateLimit-Limit': finalConfig.maxRequests.toString(),
            'X-RateLimit-Remaining': (finalConfig.maxRequests - clientData.count).toString(),
            'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
        });
        next();
    };
}
// Spezielle Rate-Limits für verschiedene Endpunkte
exports.authRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    maxRequests: 5, // 5 Login-Versuche pro 15 Minuten
    message: 'Zu viele Login-Versuche. Bitte warte 15 Minuten.'
});
exports.apiRateLimit = createRateLimit({
    windowMs: 60 * 1000, // 1 Minute
    maxRequests: 60, // 60 Requests pro Minute
    message: 'API-Rate-Limit überschritten. Bitte reduziere deine Request-Frequenz.'
});
exports.uploadRateLimit = createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 Stunde
    maxRequests: 10, // 10 Uploads pro Stunde
    message: 'Upload-Limit überschritten. Bitte warte eine Stunde.'
});
// Strict Rate Limit für sensible Endpunkte
exports.strictRateLimit = createRateLimit({
    windowMs: 5 * 60 * 1000, // 5 Minuten
    maxRequests: 10, // 10 Requests pro 5 Minuten
    message: 'Zu viele Anfragen. Bitte warte 5 Minuten.'
});
// Cleanup-Funktion für den Store (alle 24 Stunden)
setInterval(() => {
    const now = Date.now();
    Object.keys(rateLimitStore).forEach(key => {
        if (rateLimitStore[key].resetTime < now) {
            delete rateLimitStore[key];
        }
    });
}, 24 * 60 * 60 * 1000); // 24 Stunden
// Hilfsfunktion zum Zurücksetzen des Rate-Limits für einen Client
function resetRateLimit(clientKey) {
    delete rateLimitStore[clientKey];
}
// Hilfsfunktion zum Abrufen der Rate-Limit-Informationen für einen Client
function getRateLimitInfo(clientKey) {
    const clientData = rateLimitStore[clientKey];
    if (!clientData) {
        return null;
    }
    return {
        count: clientData.count,
        resetTime: clientData.resetTime,
        remaining: Math.max(0, 100 - clientData.count), // Standard-Limit
        resetIn: Math.max(0, clientData.resetTime - Date.now())
    };
}
