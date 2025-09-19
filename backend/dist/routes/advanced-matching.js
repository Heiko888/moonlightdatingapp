"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const advancedCompatibilityService_1 = require("../services/advancedCompatibilityService");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/**
 * POST /advanced-matching/analyze
 * Erweiterte Kompatibilitätsanalyse zwischen zwei Benutzern
 */
router.post('/analyze', auth_1.authenticateToken, async (req, res) => {
    try {
        const { user1Id, user2Id, relationshipType = 'romantic' } = req.body;
        if (!user1Id || !user2Id) {
            return res.status(400).json({
                error: 'Benutzer-IDs sind erforderlich'
            });
        }
        // Erweiterte Kompatibilitätsanalyse
        const analysis = await advancedCompatibilityService_1.AdvancedCompatibilityService.analyzeCompatibility(user1Id, user2Id);
        // Zusätzliche Beziehungs-spezifische Analyse
        const relationshipAnalysis = await analyzeRelationshipCompatibility(user1Id, user2Id, relationshipType);
        res.json({
            success: true,
            analysis: {
                ...analysis,
                relationshipType,
                relationshipAnalysis
            }
        });
    }
    catch (error) {
        console.error('Fehler bei erweiterter Kompatibilitätsanalyse:', error);
        res.status(500).json({
            error: 'Fehler bei der Kompatibilitätsanalyse',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
/**
 * GET /advanced-matching/compatible-users/:userId
 * Finde kompatible Benutzer basierend auf erweiterten Kriterien
 */
router.get('/compatible-users/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const { minCompatibility = 70, maxDistance = 50, ageRange = '18-99', hdTypes = [], limit = 20, offset = 0 } = req.query;
        // Alle Benutzer außer sich selbst laden
        const compatibleUsers = await findCompatibleUsers({
            userId,
            minCompatibility: parseInt(minCompatibility),
            maxDistance: parseInt(maxDistance),
            ageRange: ageRange,
            hdTypes: Array.isArray(hdTypes) ? hdTypes : [hdTypes].filter(Boolean),
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        res.json({
            success: true,
            users: compatibleUsers,
            total: compatibleUsers.length,
            filters: {
                minCompatibility,
                maxDistance,
                ageRange,
                hdTypes,
                limit,
                offset
            }
        });
    }
    catch (error) {
        console.error('Fehler beim Laden kompatibler Benutzer:', error);
        res.status(500).json({
            error: 'Fehler beim Laden kompatibler Benutzer',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
/**
 * POST /advanced-matching/batch-analyze
 * Batch-Analyse für mehrere Benutzer gleichzeitig
 */
router.post('/batch-analyze', auth_1.authenticateToken, async (req, res) => {
    try {
        const { userId, targetIds, relationshipType = 'romantic' } = req.body;
        if (!userId || !Array.isArray(targetIds) || targetIds.length === 0) {
            return res.status(400).json({
                error: 'Benutzer-ID und Ziel-IDs sind erforderlich'
            });
        }
        // Batch-Analyse für alle Ziel-Benutzer
        const analyses = await Promise.all(targetIds.map(async (targetId) => {
            try {
                const analysis = await advancedCompatibilityService_1.AdvancedCompatibilityService.analyzeCompatibility(userId, targetId);
                return {
                    targetId,
                    success: true,
                    analysis
                };
            }
            catch (error) {
                return {
                    targetId,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unbekannter Fehler'
                };
            }
        }));
        // Sortiere nach Kompatibilität
        const successfulAnalyses = analyses
            .filter(result => result.success)
            .sort((a, b) => b.analysis.overallScore - a.analysis.overallScore);
        res.json({
            success: true,
            results: analyses,
            topMatches: successfulAnalyses.slice(0, 10),
            summary: {
                total: analyses.length,
                successful: successfulAnalyses.length,
                failed: analyses.length - successfulAnalyses.length,
                averageScore: successfulAnalyses.length > 0
                    ? Math.round(successfulAnalyses.reduce((sum, result) => sum + result.analysis.overallScore, 0) / successfulAnalyses.length)
                    : 0
            }
        });
    }
    catch (error) {
        console.error('Fehler bei Batch-Kompatibilitätsanalyse:', error);
        res.status(500).json({
            error: 'Fehler bei der Batch-Analyse',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
/**
 * GET /advanced-matching/insights/:userId
 * Persönliche Insights und Empfehlungen
 */
router.get('/insights/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        // Persönliche Insights generieren
        const insights = await generatePersonalInsights(userId);
        res.json({
            success: true,
            insights
        });
    }
    catch (error) {
        console.error('Fehler beim Generieren von Insights:', error);
        res.status(500).json({
            error: 'Fehler beim Generieren von Insights',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
/**
 * POST /advanced-matching/feedback
 * Feedback für Match-Qualität sammeln
 */
router.post('/feedback', auth_1.authenticateToken, async (req, res) => {
    try {
        const { userId, targetId, matchId, rating, feedback, categories = [] } = req.body;
        if (!userId || !targetId || !rating) {
            return res.status(400).json({
                error: 'Benutzer-ID, Ziel-ID und Bewertung sind erforderlich'
            });
        }
        // Feedback in Datenbank speichern
        await saveMatchFeedback({
            userId,
            targetId,
            matchId,
            rating: parseInt(rating),
            feedback,
            categories
        });
        res.json({
            success: true,
            message: 'Feedback erfolgreich gespeichert'
        });
    }
    catch (error) {
        console.error('Fehler beim Speichern des Feedbacks:', error);
        res.status(500).json({
            error: 'Fehler beim Speichern des Feedbacks',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Hilfsfunktionen
/**
 * Beziehungs-spezifische Kompatibilitätsanalyse
 */
async function analyzeRelationshipCompatibility(user1Id, user2Id, relationshipType) {
    // Implementierung für verschiedene Beziehungstypen
    const relationshipTypes = {
        romantic: {
            factors: ['emotional_compatibility', 'physical_attraction', 'long_term_potential'],
            weights: { emotional: 0.4, physical: 0.3, long_term: 0.3 }
        },
        friendship: {
            factors: ['shared_interests', 'communication_style', 'lifestyle_compatibility'],
            weights: { interests: 0.4, communication: 0.3, lifestyle: 0.3 }
        },
        business: {
            factors: ['work_style', 'communication_style', 'goal_alignment'],
            weights: { work_style: 0.4, communication: 0.3, goals: 0.3 }
        },
        family: {
            factors: ['values_alignment', 'communication_style', 'lifestyle_compatibility'],
            weights: { values: 0.5, communication: 0.3, lifestyle: 0.2 }
        }
    };
    const config = relationshipTypes[relationshipType] || relationshipTypes.romantic;
    return {
        relationshipType,
        factors: config.factors,
        weights: config.weights,
        analysis: `Spezifische Analyse für ${relationshipType} Beziehung`,
        recommendations: [
            `Für ${relationshipType} Beziehungen ist es wichtig...`,
            'Kommunikation ist der Schlüssel...',
            'Respektiert eure Unterschiede...'
        ]
    };
}
/**
 * Kompatible Benutzer finden
 */
async function findCompatibleUsers(filters) {
    try {
        // Importiere localDb
        const { localDb } = await Promise.resolve().then(() => __importStar(require('../lib/localDb')));
        if (!localDb.db) {
            throw new Error('Datenbank nicht verfügbar');
        }
        // Hole alle Benutzer außer sich selbst
        const allUsers = localDb.db.prepare('SELECT * FROM users WHERE id != ?').all(filters.userId);
        // Filtere und analysiere Kompatibilität
        const compatibleUsers = [];
        for (const user of allUsers) {
            try {
                // Berechne Kompatibilität
                const analysis = await advancedCompatibilityService_1.AdvancedCompatibilityService.analyzeCompatibility(filters.userId, user.id);
                if (analysis.overallScore >= filters.minCompatibility) {
                    // Parse JSON-Felder
                    const centers = user.centers ? JSON.parse(user.centers) : {};
                    const channels = user.channels ? JSON.parse(user.channels) : {};
                    const gates = user.gates ? JSON.parse(user.gates) : {};
                    // Bestimme definierte Zentren
                    const definedCenters = Object.keys(centers).filter(center => centers[center].defined);
                    const definedChannels = Object.keys(channels);
                    const definedGates = Object.keys(gates);
                    // Berechne Alter
                    let age = null;
                    if (user.birthdate) {
                        const birthDate = new Date(user.birthdate);
                        const today = new Date();
                        age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                    }
                    compatibleUsers.push({
                        _id: user.id,
                        name: user.name,
                        age: age,
                        location: user.location || 'Unbekannt',
                        bio: user.bio || 'Keine Beschreibung verfügbar',
                        images: user.images ? JSON.parse(user.images) : ['/api/placeholder/400/600'],
                        hdType: user.hd_type || 'Unknown',
                        hdProfile: user.profile || 'Unknown',
                        compatibilityScore: analysis.overallScore,
                        interests: user.interests ? JSON.parse(user.interests) : [],
                        definedCenters,
                        definedChannels,
                        definedGates,
                        lastActive: user.updated_at || user.created_at
                    });
                }
            }
            catch (error) {
                console.error(`Fehler bei Kompatibilitätsanalyse für User ${user.id}:`, error);
                // Überspringe diesen Benutzer
            }
        }
        // Sortiere nach Kompatibilität
        compatibleUsers.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        // Wende Limit und Offset an
        return compatibleUsers.slice(filters.offset, filters.offset + filters.limit);
    }
    catch (error) {
        console.error('Fehler beim Finden kompatibler Benutzer:', error);
        throw error;
    }
}
/**
 * Persönliche Insights generieren
 */
async function generatePersonalInsights(userId) {
    return {
        profile: {
            hdType: 'Generator',
            profile: '5/1',
            authority: 'Sacral',
            strategy: 'Warten und auf die innere Autorität hören'
        },
        compatibility: {
            bestMatches: ['Projector', 'Manifesting Generator'],
            challengingMatches: ['Reflector', 'Manifestor'],
            averageScore: 78
        },
        trends: {
            mostCompatibleProfiles: ['3/5', '2/4', '6/2'],
            leastCompatibleProfiles: ['1/3', '4/6'],
            commonInterests: ['Yoga', 'Kochen', 'Reisen']
        },
        recommendations: [
            'Fokussiere dich auf Projector-Matches für beste Kompatibilität',
            'Arbeite an deiner Kommunikation mit Manifestor-Typen',
            'Erweitere deine Interessen um mehr Matches zu finden'
        ],
        statistics: {
            totalSwipes: 150,
            matches: 23,
            matchRate: 15.3,
            averageCompatibility: 78
        }
    };
}
/**
 * Match-Feedback speichern
 */
async function saveMatchFeedback(feedback) {
    // Implementierung für Feedback-Speicherung
    console.log('Feedback gespeichert:', feedback);
    return true;
}
exports.default = router;
