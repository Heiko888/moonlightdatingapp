"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const openaiService_1 = __importDefault(require("../services/openaiService"));
const router = express_1.default.Router();
// Mock-Daten für Matches (später durch echte Datenbank ersetzen)
const mockUsers = [
    {
        id: 1,
        name: 'Sarah Müller',
        age: 28,
        location: 'Hamburg',
        hdType: 'Projector',
        hdProfile: '3/5',
        hdStrategy: 'Warten auf Einladung',
        hdAuthority: 'Splenic',
        interests: ['Human Design', 'Musik', 'Reisen', 'Yoga', 'Kochen'],
        bio: 'Leidenschaftliche Projectorin, die gerne neue Menschen kennenlernt und tiefgründige Gespräche führt.',
        avatar: '/api/placeholder/60/60',
        lastActive: 'vor 2 Stunden',
        isOnline: true
    },
    {
        id: 2,
        name: 'Michael Schmidt',
        age: 32,
        location: 'Berlin',
        hdType: 'Manifestor',
        hdProfile: '1/3',
        hdStrategy: 'Informieren',
        hdAuthority: 'Splenic',
        interests: ['Sport', 'Human Design', 'Kochen', 'Fotografie', 'Reisen'],
        bio: 'Energiegeladener Manifestor, der gerne neue Projekte startet und Menschen inspiriert.',
        avatar: '/api/placeholder/60/60',
        lastActive: 'vor 1 Stunde',
        isOnline: true
    },
    {
        id: 3,
        name: 'Lisa Weber',
        age: 26,
        location: 'München',
        hdType: 'Generator',
        hdProfile: '2/4',
        hdStrategy: 'Auf andere reagieren',
        hdAuthority: 'Sakral',
        interests: ['Reisen', 'Kochen', 'Human Design', 'Tanzen', 'Kunst'],
        bio: 'Lebensfrohe Generatorin, die gerne neue Verbindungen knüpft und Abenteuer erlebt.',
        avatar: '/api/placeholder/60/60',
        lastActive: 'vor 3 Stunden',
        isOnline: false
    },
    {
        id: 4,
        name: 'David Fischer',
        age: 30,
        location: 'Köln',
        hdType: 'Reflector',
        hdProfile: '6/2',
        hdStrategy: 'Warten auf Mondzyklus',
        hdAuthority: 'Lunar',
        interests: ['Human Design', 'Astronomie', 'Philosophie', 'Meditation', 'Natur'],
        bio: 'Tiefgründiger Reflector, der die Welt durch eine einzigartige Perspektive betrachtet.',
        avatar: '/api/placeholder/60/60',
        lastActive: 'vor 5 Stunden',
        isOnline: false
    }
];
// GET /matching/profile/:userId - Matches für ein bestimmtes Profil
router.get('/profile/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user?.id;
        console.log('🔍 Matches werden für Benutzer gesucht:', userId);
        // Hier würde normalerweise die echte Benutzerdaten aus der Datenbank geladen
        const currentUser = {
            hdType: 'Generator',
            hdProfile: '2/4',
            hdStrategy: 'Auf andere reagieren',
            hdAuthority: 'Sakral',
            interests: ['Sport', 'Musik', 'Reisen', 'Human Design', 'Kochen']
        };
        // Matches mit Kompatibilitätsberechnung
        const matches = await Promise.all(mockUsers
            .filter(user => user.id.toString() !== userId)
            .map(async (user) => {
            // Kompatibilitätsberechnung basierend auf Human Design
            const compatibility = calculateCompatibility(currentUser, user);
            // Gemeinsame Interessen finden
            const mutualInterests = currentUser.interests.filter(interest => user.interests.includes(interest));
            return {
                ...user,
                compatibility,
                mutualInterests,
                compatibilityDetails: {
                    typeCompatibility: calculateTypeCompatibility(currentUser.hdType, user.hdType),
                    profileCompatibility: calculateProfileCompatibility(currentUser.hdProfile, user.hdProfile),
                    interestOverlap: (mutualInterests.length / Math.max(currentUser.interests.length, user.interests.length)) * 100
                }
            };
        }));
        // Nach Kompatibilität sortieren
        const sortedMatches = matches.sort((a, b) => b.compatibility - a.compatibility);
        console.log('✅ Matches erfolgreich gefunden:', sortedMatches.length);
        res.json({
            success: true,
            matches: sortedMatches,
            total: sortedMatches.length
        });
    }
    catch (error) {
        console.error('❌ Fehler beim Laden der Matches:', error);
        res.status(500).json({
            error: 'Fehler beim Laden der Matches',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// POST /matching/analyze - Detaillierte Kompatibilitätsanalyse
router.post('/analyze', auth_1.authenticateToken, async (req, res) => {
    try {
        const { user1, user2 } = req.body;
        if (!user1 || !user2) {
            return res.status(400).json({ error: 'Zwei Benutzer sind für die Analyse erforderlich' });
        }
        console.log('💕 Detaillierte Kompatibilitätsanalyse wird erstellt...');
        // PDF-basierte Kompatibilitätsanalyse
        const compatibilityResult = await openaiService_1.default.analyzeCompatibility(user1, user2);
        res.json({
            success: true,
            analysis: compatibilityResult.compatibility,
            users: { user1, user2 }
        });
    }
    catch (error) {
        console.error('❌ Fehler bei der Kompatibilitätsanalyse:', error);
        res.status(500).json({
            error: 'Fehler bei der Kompatibilitätsanalyse',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// POST /matching/like - Like für einen Match
router.post('/like', auth_1.authenticateToken, async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUserId = req.user?.id;
        if (!targetUserId) {
            return res.status(400).json({ error: 'Zielbenutzer ist erforderlich' });
        }
        console.log('❤️ Like gesendet von', currentUserId, 'an', targetUserId);
        // Hier würde normalerweise der Like in der Datenbank gespeichert
        // und geprüft, ob es ein gegenseitiges Match gibt
        res.json({
            success: true,
            message: 'Like erfolgreich gesendet',
            isMatch: Math.random() > 0.7 // 30% Chance auf gegenseitiges Match
        });
    }
    catch (error) {
        console.error('❌ Fehler beim Senden des Likes:', error);
        res.status(500).json({
            error: 'Fehler beim Senden des Likes',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// POST /matching/message - Nachricht an einen Match senden
router.post('/message', auth_1.authenticateToken, async (req, res) => {
    try {
        const { targetUserId, message } = req.body;
        const currentUserId = req.user?.id;
        if (!targetUserId || !message) {
            return res.status(400).json({ error: 'Zielbenutzer und Nachricht sind erforderlich' });
        }
        console.log('💬 Nachricht gesendet von', currentUserId, 'an', targetUserId);
        // Hier würde normalerweise die Nachricht in der Datenbank gespeichert
        res.json({
            success: true,
            message: 'Nachricht erfolgreich gesendet',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ Fehler beim Senden der Nachricht:', error);
        res.status(500).json({
            error: 'Fehler beim Senden der Nachricht',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Hilfsfunktionen für Kompatibilitätsberechnung
function calculateCompatibility(user1, user2) {
    const typeCompatibility = calculateTypeCompatibility(user1.hdType, user2.hdType);
    const profileCompatibility = calculateProfileCompatibility(user1.hdProfile, user2.hdProfile);
    const interestOverlap = calculateInterestOverlap(user1.interests, user2.interests);
    // Gewichtete Berechnung
    return Math.round((typeCompatibility * 0.4) +
        (profileCompatibility * 0.3) +
        (interestOverlap * 0.3));
}
function calculateTypeCompatibility(type1, type2) {
    const compatibilityMatrix = {
        'Generator': { 'Generator': 85, 'Manifestor': 70, 'Projector': 90, 'Reflector': 75 },
        'Manifestor': { 'Generator': 70, 'Manifestor': 60, 'Projector': 80, 'Reflector': 65 },
        'Projector': { 'Generator': 90, 'Manifestor': 80, 'Projector': 85, 'Reflector': 90 },
        'Reflector': { 'Generator': 75, 'Manifestor': 65, 'Projector': 90, 'Reflector': 95 }
    };
    return compatibilityMatrix[type1]?.[type2] || 50;
}
function calculateProfileCompatibility(profile1, profile2) {
    // Vereinfachte Profil-Kompatibilität
    const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];
    const index1 = profiles.indexOf(profile1);
    const index2 = profiles.indexOf(profile2);
    if (index1 === -1 || index2 === -1)
        return 50;
    const distance = Math.abs(index1 - index2);
    return Math.max(50, 100 - (distance * 5));
}
function calculateInterestOverlap(interests1, interests2) {
    const mutual = interests1.filter(interest => interests2.includes(interest));
    return (mutual.length / Math.max(interests1.length, interests2.length)) * 100;
}
exports.default = router;
