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
const seedTestData_1 = require("../scripts/seedTestData");
const router = express_1.default.Router();
/**
 * POST /test-data/seed
 * Erstellt Test-Daten für das Swipe & Matching System
 */
router.post('/seed', async (req, res) => {
    try {
        console.log('🌱 Starte Test-Daten Seeding...');
        const result = await (0, seedTestData_1.seedTestData)();
        if (result.success) {
            res.json({
                success: true,
                message: 'Test-Daten erfolgreich erstellt',
                data: {
                    usersCreated: result.usersCreated,
                    timestamp: new Date().toISOString()
                }
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: result.error || 'Unbekannter Fehler beim Seeding'
            });
        }
    }
    catch (error) {
        console.error('Fehler beim Seeding der Test-Daten:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Erstellen der Test-Daten',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
/**
 * GET /test-data/status
 * Zeigt Status der Test-Daten
 */
router.get('/status', async (req, res) => {
    try {
        const { localDb } = await Promise.resolve().then(() => __importStar(require('../lib/localDb')));
        if (!localDb.db) {
            return res.status(500).json({
                success: false,
                error: 'Datenbank nicht verfügbar'
            });
        }
        // Zähle Test-Benutzer
        const testUsers = localDb.db.prepare('SELECT COUNT(*) as count FROM users WHERE email LIKE "%@example.com"').get();
        const totalUsers = localDb.db.prepare('SELECT COUNT(*) as count FROM users').get();
        // Zähle Swipes
        const totalSwipes = localDb.db.prepare('SELECT COUNT(*) as count FROM swipes').get();
        // Zähle Matches
        const totalMatches = localDb.db.prepare('SELECT COUNT(*) as count FROM matches').get();
        // Zähle Kompatibilitätsanalysen
        const totalAnalyses = localDb.db.prepare('SELECT COUNT(*) as count FROM compatibility_analysis').get();
        res.json({
            success: true,
            data: {
                testUsers: testUsers.count,
                totalUsers: totalUsers.count,
                totalSwipes: totalSwipes.count,
                totalMatches: totalMatches.count,
                totalAnalyses: totalAnalyses.count,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Fehler beim Abrufen des Test-Daten-Status:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen des Status',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
/**
 * GET /test-data/users
 * Zeigt alle Test-Benutzer
 */
router.get('/users', async (req, res) => {
    try {
        const { localDb } = await Promise.resolve().then(() => __importStar(require('../lib/localDb')));
        if (!localDb.db) {
            return res.status(500).json({
                success: false,
                error: 'Datenbank nicht verfügbar'
            });
        }
        const testUsers = localDb.db.prepare(`
      SELECT id, name, email, hd_type, profile, location, bio, age, interests, images
      FROM users 
      WHERE email LIKE "%@example.com"
      ORDER BY created_at DESC
    `).all();
        // Parse JSON-Felder
        const users = testUsers.map(user => ({
            ...user,
            interests: user.interests ? JSON.parse(user.interests) : [],
            images: user.images ? JSON.parse(user.images) : []
        }));
        res.json({
            success: true,
            data: {
                users,
                count: users.length,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Fehler beim Abrufen der Test-Benutzer:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen der Test-Benutzer',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
/**
 * DELETE /test-data/cleanup
 * Löscht alle Test-Daten
 */
router.delete('/cleanup', async (req, res) => {
    try {
        const { localDb } = await Promise.resolve().then(() => __importStar(require('../lib/localDb')));
        if (!localDb.db) {
            return res.status(500).json({
                success: false,
                error: 'Datenbank nicht verfügbar'
            });
        }
        console.log('🗑️ Lösche alle Test-Daten...');
        // Lösche in der richtigen Reihenfolge (wegen Foreign Keys)
        localDb.db.exec('DELETE FROM match_feedback WHERE user_id IN (SELECT id FROM users WHERE email LIKE "%@example.com")');
        localDb.db.exec('DELETE FROM compatibility_analysis WHERE user_a IN (SELECT id FROM users WHERE email LIKE "%@example.com") OR user_b IN (SELECT id FROM users WHERE email LIKE "%@example.com")');
        localDb.db.exec('DELETE FROM matches WHERE user_a IN (SELECT id FROM users WHERE email LIKE "%@example.com") OR user_b IN (SELECT id FROM users WHERE email LIKE "%@example.com")');
        localDb.db.exec('DELETE FROM swipes WHERE user_id IN (SELECT id FROM users WHERE email LIKE "%@example.com") OR target_id IN (SELECT id FROM users WHERE email LIKE "%@example.com")');
        localDb.db.exec('DELETE FROM users WHERE email LIKE "%@example.com"');
        console.log('✅ Test-Daten erfolgreich gelöscht');
        res.json({
            success: true,
            message: 'Test-Daten erfolgreich gelöscht',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Löschen der Test-Daten:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Löschen der Test-Daten',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
exports.default = router;
