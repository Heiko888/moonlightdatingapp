"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodingService = exports.GeocodingService = void 0;
const axios_1 = __importDefault(require("axios"));
class GeocodingService {
    constructor(config = { provider: 'nominatim' }) {
        this.cache = new Map();
        this.lastRequestTime = 0;
        this.config = {
            rateLimitDelay: 1000, // 1 Sekunde zwischen Requests
            ...config
        };
    }
    /**
     * Geocodiert einen Geburtsort zu Koordinaten
     */
    async geocodeBirthPlace(birthPlace) {
        try {
            // Cache prüfen
            const cacheKey = birthPlace.toLowerCase().trim();
            if (this.cache.has(cacheKey)) {
                console.log(`📍 Geocoding Cache Hit: ${birthPlace}`);
                return this.cache.get(cacheKey);
            }
            // Rate Limiting
            await this.enforceRateLimit();
            console.log(`🌍 Geocoding gestartet für: ${birthPlace}`);
            let result;
            // Versuche verschiedene Provider
            try {
                result = await this.geocodeWithNominatim(birthPlace);
            }
            catch (nominatimError) {
                console.warn('⚠️ Nominatim fehlgeschlagen, versuche Fallback:', nominatimError);
                result = await this.geocodeWithFallback(birthPlace);
            }
            // Cache speichern
            this.cache.set(cacheKey, result);
            console.log(`✅ Geocoding erfolgreich: ${birthPlace} → ${result.latitude}, ${result.longitude}`);
            return result;
        }
        catch (error) {
            console.error(`❌ Geocoding fehlgeschlagen für ${birthPlace}:`, error);
            // Fallback auf Standard-Koordinaten
            return this.getFallbackCoordinates(birthPlace);
        }
    }
    /**
     * Geocoding mit OpenStreetMap Nominatim (kostenlos)
     */
    async geocodeWithNominatim(birthPlace) {
        const searchQuery = encodeURIComponent(birthPlace);
        const url = `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1&addressdetails=1&extratags=1`;
        const response = await axios_1.default.get(url, {
            headers: {
                'User-Agent': 'HD-App-Chart/1.0 (Human Design Chart Calculator)'
            },
            timeout: 10000
        });
        if (!response.data || response.data.length === 0) {
            throw new Error('Keine Ergebnisse von Nominatim');
        }
        const result = response.data[0];
        return {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            formattedAddress: result.display_name,
            country: result.address?.country || 'Unbekannt',
            countryCode: result.address?.country_code?.toUpperCase() || 'XX',
            city: result.address?.city || result.address?.town || result.address?.village || 'Unbekannt',
            state: result.address?.state,
            timezone: await this.getTimezoneFromCoordinates(parseFloat(result.lat), parseFloat(result.lon)),
            confidence: this.calculateConfidence(result, birthPlace)
        };
    }
    /**
     * Fallback-Geocoding mit vereinfachter Logik
     */
    async geocodeWithFallback(birthPlace) {
        // Bekannte Städte mit Koordinaten
        const knownCities = {
            'berlin': { lat: 52.5200, lon: 13.4050, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'hamburg': { lat: 53.5511, lon: 9.9937, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'münchen': { lat: 48.1351, lon: 11.5820, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'köln': { lat: 50.9375, lon: 6.9603, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'frankfurt': { lat: 50.1109, lon: 8.6821, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'stuttgart': { lat: 48.7758, lon: 9.1829, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'düsseldorf': { lat: 51.2277, lon: 6.7735, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'dortmund': { lat: 51.5136, lon: 7.4653, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'essen': { lat: 51.4556, lon: 7.0116, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'leipzig': { lat: 51.3397, lon: 12.3731, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'bremen': { lat: 53.0793, lon: 8.8017, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'dresden': { lat: 51.0504, lon: 13.7373, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'hannover': { lat: 52.3759, lon: 9.7320, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'nürnberg': { lat: 49.4521, lon: 11.0767, country: 'Deutschland', countryCode: 'DE', timezone: 'Europe/Berlin' },
            'wien': { lat: 48.2082, lon: 16.3738, country: 'Österreich', countryCode: 'AT', timezone: 'Europe/Vienna' },
            'zürich': { lat: 47.3769, lon: 8.5417, country: 'Schweiz', countryCode: 'CH', timezone: 'Europe/Zurich' },
            'basel': { lat: 47.5596, lon: 7.5886, country: 'Schweiz', countryCode: 'CH', timezone: 'Europe/Zurich' },
            'genf': { lat: 46.2044, lon: 6.1432, country: 'Schweiz', countryCode: 'CH', timezone: 'Europe/Zurich' },
            'paris': { lat: 48.8566, lon: 2.3522, country: 'Frankreich', countryCode: 'FR', timezone: 'Europe/Paris' },
            'london': { lat: 51.5074, lon: -0.1278, country: 'Vereinigtes Königreich', countryCode: 'GB', timezone: 'Europe/London' },
            'amsterdam': { lat: 52.3676, lon: 4.9041, country: 'Niederlande', countryCode: 'NL', timezone: 'Europe/Amsterdam' },
            'brüssel': { lat: 50.8503, lon: 4.3517, country: 'Belgien', countryCode: 'BE', timezone: 'Europe/Brussels' },
            'kopenhagen': { lat: 55.6761, lon: 12.5683, country: 'Dänemark', countryCode: 'DK', timezone: 'Europe/Copenhagen' },
            'stockholm': { lat: 59.3293, lon: 18.0686, country: 'Schweden', countryCode: 'SE', timezone: 'Europe/Stockholm' },
            'oslo': { lat: 59.9139, lon: 10.7522, country: 'Norwegen', countryCode: 'NO', timezone: 'Europe/Oslo' },
            'helsinki': { lat: 60.1699, lon: 24.9384, country: 'Finnland', countryCode: 'FI', timezone: 'Europe/Helsinki' },
            'madrid': { lat: 40.4168, lon: -3.7038, country: 'Spanien', countryCode: 'ES', timezone: 'Europe/Madrid' },
            'barcelona': { lat: 41.3851, lon: 2.1734, country: 'Spanien', countryCode: 'ES', timezone: 'Europe/Madrid' },
            'rom': { lat: 41.9028, lon: 12.4964, country: 'Italien', countryCode: 'IT', timezone: 'Europe/Rome' },
            'mailand': { lat: 45.4642, lon: 9.1900, country: 'Italien', countryCode: 'IT', timezone: 'Europe/Rome' },
            'new york': { lat: 40.7128, lon: -74.0060, country: 'USA', countryCode: 'US', timezone: 'America/New_York' },
            'los angeles': { lat: 34.0522, lon: -118.2437, country: 'USA', countryCode: 'US', timezone: 'America/Los_Angeles' },
            'chicago': { lat: 41.8781, lon: -87.6298, country: 'USA', countryCode: 'US', timezone: 'America/Chicago' },
            'toronto': { lat: 43.6532, lon: -79.3832, country: 'Kanada', countryCode: 'CA', timezone: 'America/Toronto' },
            'sydney': { lat: -33.8688, lon: 151.2093, country: 'Australien', countryCode: 'AU', timezone: 'Australia/Sydney' },
            'melbourne': { lat: -37.8136, lon: 144.9631, country: 'Australien', countryCode: 'AU', timezone: 'Australia/Melbourne' },
            'tokyo': { lat: 35.6762, lon: 139.6503, country: 'Japan', countryCode: 'JP', timezone: 'Asia/Tokyo' }
        };
        const normalizedPlace = birthPlace.toLowerCase().trim();
        // Suche nach exakter Übereinstimmung
        for (const [city, coords] of Object.entries(knownCities)) {
            if (normalizedPlace.includes(city) || city.includes(normalizedPlace)) {
                return {
                    latitude: coords.lat,
                    longitude: coords.lon,
                    formattedAddress: `${city.charAt(0).toUpperCase() + city.slice(1)}, ${coords.country}`,
                    country: coords.country,
                    countryCode: coords.countryCode,
                    city: city.charAt(0).toUpperCase() + city.slice(1),
                    timezone: coords.timezone,
                    confidence: 0.8
                };
            }
        }
        // Wenn keine Übereinstimmung gefunden, verwende Standard-Koordinaten
        return this.getFallbackCoordinates(birthPlace);
    }
    /**
     * Standard-Fallback-Koordinaten
     */
    getFallbackCoordinates(birthPlace) {
        console.warn(`⚠️ Verwende Fallback-Koordinaten für: ${birthPlace}`);
        return {
            latitude: 52.5200, // Berlin als Standard
            longitude: 13.4050,
            formattedAddress: `${birthPlace} (ungefähre Position)`,
            country: 'Deutschland',
            countryCode: 'DE',
            city: birthPlace,
            timezone: 'Europe/Berlin',
            confidence: 0.1
        };
    }
    /**
     * Berechnet Confidence-Score basierend auf Übereinstimmung
     */
    calculateConfidence(result, searchQuery) {
        let confidence = 0.5; // Basis-Confidence
        const displayName = result.display_name?.toLowerCase() || '';
        const searchLower = searchQuery.toLowerCase();
        // Höhere Confidence wenn der Suchbegriff im Ergebnis enthalten ist
        if (displayName.includes(searchLower)) {
            confidence += 0.3;
        }
        // Höhere Confidence für exakte Stadt-Übereinstimmung
        if (result.address?.city?.toLowerCase() === searchLower) {
            confidence += 0.2;
        }
        return Math.min(confidence, 1.0);
    }
    /**
     * Holt Zeitzone basierend auf Koordinaten
     */
    async getTimezoneFromCoordinates(lat, lon) {
        try {
            // Vereinfachte Zeitzonen-Logik basierend auf Koordinaten
            if (lat >= 47 && lat <= 55 && lon >= 5 && lon <= 15) {
                return 'Europe/Berlin'; // Deutschland, Österreich, Schweiz
            }
            else if (lat >= 40 && lat <= 50 && lon >= -10 && lon <= 10) {
                return 'Europe/London'; // UK, Irland
            }
            else if (lat >= 40 && lat <= 50 && lon >= 0 && lon <= 10) {
                return 'Europe/Paris'; // Frankreich, Belgien, Niederlande
            }
            else if (lat >= 35 && lat <= 45 && lon >= 10 && lon <= 20) {
                return 'Europe/Rome'; // Italien
            }
            else if (lat >= 35 && lat <= 45 && lon >= -5 && lon <= 5) {
                return 'Europe/Madrid'; // Spanien, Portugal
            }
            else if (lat >= 40 && lat <= 50 && lon >= -80 && lon <= -70) {
                return 'America/New_York'; // Ostküste USA
            }
            else if (lat >= 30 && lat <= 40 && lon >= -125 && lon <= -115) {
                return 'America/Los_Angeles'; // Westküste USA
            }
            else if (lat >= 35 && lat <= 45 && lon >= 135 && lon <= 145) {
                return 'Asia/Tokyo'; // Japan
            }
            else if (lat >= -40 && lat <= -30 && lon >= 140 && lon <= 150) {
                return 'Australia/Sydney'; // Australien
            }
            return 'Europe/Berlin'; // Standard-Fallback
        }
        catch (error) {
            console.warn('Fehler beim Bestimmen der Zeitzone:', error);
            return 'Europe/Berlin';
        }
    }
    /**
     * Rate Limiting für API-Requests
     */
    async enforceRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < (this.config.rateLimitDelay || 1000)) {
            const delay = (this.config.rateLimitDelay || 1000) - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        this.lastRequestTime = Date.now();
    }
    /**
     * Cache leeren
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Geocoding Cache geleert');
    }
    /**
     * Cache-Statistiken
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}
exports.GeocodingService = GeocodingService;
// Singleton-Instanz
exports.geocodingService = new GeocodingService({
    provider: 'nominatim',
    rateLimitDelay: 1000
});
