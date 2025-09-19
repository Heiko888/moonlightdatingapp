"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
// Datei-Pfade für lokale Speicherung
const usersFile = path_1.default.join(__dirname, '../../data/users.json');
const vipStatsFile = path_1.default.join(__dirname, '../../data/vip-stats.json');
const achievementsFile = path_1.default.join(__dirname, '../../data/achievements.json');
const activitiesFile = path_1.default.join(__dirname, '../../data/activities.json');
// Verzeichnis erstellen falls nicht vorhanden
const dataDir = path_1.default.dirname(usersFile);
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
// Hilfsfunktionen
const readUsers = () => {
    try {
        if (fs_1.default.existsSync(usersFile)) {
            const data = fs_1.default.readFileSync(usersFile, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('Fehler beim Lesen der Benutzer:', error);
    }
    return getMockUsers();
};
const writeUsers = (users) => {
    try {
        fs_1.default.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    }
    catch (error) {
        console.error('Fehler beim Schreiben der Benutzer:', error);
        throw error;
    }
};
const readVIPStats = () => {
    try {
        if (fs_1.default.existsSync(vipStatsFile)) {
            const data = fs_1.default.readFileSync(vipStatsFile, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('Fehler beim Lesen der VIP-Statistiken:', error);
    }
    return getMockVIPStats();
};
const writeVIPStats = (stats) => {
    try {
        fs_1.default.writeFileSync(vipStatsFile, JSON.stringify(stats, null, 2));
    }
    catch (error) {
        console.error('Fehler beim Schreiben der VIP-Statistiken:', error);
        throw error;
    }
};
const readAchievements = () => {
    try {
        if (fs_1.default.existsSync(achievementsFile)) {
            const data = fs_1.default.readFileSync(achievementsFile, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('Fehler beim Lesen der Achievements:', error);
    }
    return getMockAchievements();
};
const writeAchievements = (achievements) => {
    try {
        fs_1.default.writeFileSync(achievementsFile, JSON.stringify(achievements, null, 2));
    }
    catch (error) {
        console.error('Fehler beim Schreiben der Achievements:', error);
        throw error;
    }
};
const readActivities = () => {
    try {
        if (fs_1.default.existsSync(activitiesFile)) {
            const data = fs_1.default.readFileSync(activitiesFile, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('Fehler beim Lesen der Aktivitäten:', error);
    }
    return getMockActivities();
};
const writeActivities = (activities) => {
    try {
        fs_1.default.writeFileSync(activitiesFile, JSON.stringify(activities, null, 2));
    }
    catch (error) {
        console.error('Fehler beim Schreiben der Aktivitäten:', error);
        throw error;
    }
};
// Mock-Daten
const getMockUsers = () => [
    {
        id: 'user1',
        name: 'Max',
        email: 'max@example.com',
        tier: 'vip',
        vipPoints: 2847,
        joinDate: '2024-01-15T00:00:00Z',
        lastActive: new Date().toISOString(),
        hdType: 'Generator',
        hdProfile: '2/4',
        hdAuthority: 'Sakral'
    },
    {
        id: 'user2',
        name: 'Sarah',
        email: 'sarah@example.com',
        tier: 'premium',
        vipPoints: 1205,
        joinDate: '2024-03-20T00:00:00Z',
        lastActive: new Date().toISOString(),
        hdType: 'Projector',
        hdProfile: '3/5',
        hdAuthority: 'Splenisch'
    },
    {
        id: 'user3',
        name: 'Tom',
        email: 'tom@example.com',
        tier: 'basic',
        vipPoints: 450,
        joinDate: '2024-06-10T00:00:00Z',
        lastActive: new Date().toISOString(),
        hdType: 'Manifestor',
        hdProfile: '1/3',
        hdAuthority: 'Splenisch'
    }
];
const getMockVIPStats = () => [
    {
        userId: 'user1',
        totalConnections: 47,
        totalMatches: 23,
        totalReadings: 156,
        totalMoonEntries: 89,
        monthlyProgress: 87,
        achievements: 12,
        exclusiveAccess: true,
        lastUpdated: new Date().toISOString()
    },
    {
        userId: 'user2',
        totalConnections: 23,
        totalMatches: 12,
        totalReadings: 45,
        totalMoonEntries: 34,
        monthlyProgress: 65,
        achievements: 8,
        exclusiveAccess: false,
        lastUpdated: new Date().toISOString()
    },
    {
        userId: 'user3',
        totalConnections: 8,
        totalMatches: 3,
        totalReadings: 12,
        totalMoonEntries: 15,
        monthlyProgress: 25,
        achievements: 3,
        exclusiveAccess: false,
        lastUpdated: new Date().toISOString()
    }
];
const getMockAchievements = () => [
    {
        id: '1',
        userId: 'user1',
        name: 'Chart-Meister',
        description: 'Vollständige Chart-Analyse abgeschlossen',
        icon: 'BarChart3',
        tier: 'basic',
        earned: true,
        earnedDate: '2024-11-15T00:00:00Z',
        progress: 100,
        maxProgress: 100
    },
    {
        id: '2',
        userId: 'user1',
        name: 'Mond-Experte',
        description: '30 Tage Mondkalender-Tracking',
        icon: 'Moon',
        tier: 'basic',
        earned: true,
        earnedDate: '2024-12-01T00:00:00Z',
        progress: 100,
        maxProgress: 100
    },
    {
        id: '3',
        userId: 'user1',
        name: 'Community-Star',
        description: '50 Community-Beiträge',
        icon: 'Users',
        tier: 'premium',
        earned: true,
        earnedDate: '2024-11-20T00:00:00Z',
        progress: 100,
        maxProgress: 100
    },
    {
        id: '4',
        userId: 'user1',
        name: 'VIP-Pionier',
        description: 'Erste VIP-Features genutzt',
        icon: 'Crown',
        tier: 'vip',
        earned: true,
        earnedDate: '2024-10-01T00:00:00Z',
        progress: 100,
        maxProgress: 100
    },
    {
        id: '5',
        userId: 'user1',
        name: 'Coaching-Profi',
        description: '10 Coaching-Sessions',
        icon: 'MessageCircle',
        tier: 'vip',
        earned: false,
        progress: 5,
        maxProgress: 10
    },
    {
        id: '6',
        userId: 'user1',
        name: 'Analytics-Guru',
        description: '100 Chart-Analysen',
        icon: 'TrendingUp',
        tier: 'premium',
        earned: false,
        progress: 67,
        maxProgress: 100
    }
];
const getMockActivities = () => [
    {
        id: '1',
        userId: 'user1',
        type: 'vip_exclusive',
        title: 'VIP-Exklusiv Event',
        description: 'Teilnahme am exklusiven Human Design Workshop',
        timestamp: '2024-12-10T14:30:00Z',
        icon: 'Crown',
        tier: 'vip',
        points: 50
    },
    {
        id: '2',
        userId: 'user1',
        type: 'coaching_session',
        title: '1:1 Coaching Session',
        description: 'Persönliche Beratung mit Britta Müller',
        timestamp: '2024-12-09T10:00:00Z',
        icon: 'Users',
        tier: 'vip',
        points: 25
    },
    {
        id: '3',
        userId: 'user1',
        type: 'advanced_analysis',
        title: 'Erweiterte Chart-Analyse',
        description: 'Tiefe Analyse deines Human Design Charts',
        timestamp: '2024-12-08T16:45:00Z',
        icon: 'BarChart3',
        tier: 'premium',
        points: 15
    },
    {
        id: '4',
        userId: 'user1',
        type: 'moon_tracking',
        title: 'Mondkalender-Eintrag',
        description: 'Neuer Eintrag im VIP-Mondkalender',
        timestamp: '2024-12-07T20:15:00Z',
        icon: 'Moon',
        tier: 'basic',
        points: 5
    }
];
// Initialisiere Daten
const initializeData = () => {
    if (!fs_1.default.existsSync(usersFile)) {
        writeUsers(getMockUsers());
    }
    if (!fs_1.default.existsSync(vipStatsFile)) {
        writeVIPStats(getMockVIPStats());
    }
    if (!fs_1.default.existsSync(achievementsFile)) {
        writeAchievements(getMockAchievements());
    }
    if (!fs_1.default.existsSync(activitiesFile)) {
        writeActivities(getMockActivities());
    }
};
// Initialisiere beim Start
initializeData();
// API-Endpunkte
// GET /vip-dashboard/user/:userId - Benutzer-Details abrufen
router.get('/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const users = readUsers();
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Benutzer nicht gefunden'
            });
        }
        res.json({
            success: true,
            user
        });
    }
    catch (error) {
        console.error('Fehler beim Laden des Benutzers:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Laden des Benutzers'
        });
    }
});
// GET /vip-dashboard/stats/:userId - VIP-Statistiken abrufen
router.get('/stats/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const stats = readVIPStats();
        const userStats = stats.find(s => s.userId === userId);
        if (!userStats) {
            return res.status(404).json({
                success: false,
                error: 'Statistiken nicht gefunden'
            });
        }
        res.json({
            success: true,
            stats: userStats
        });
    }
    catch (error) {
        console.error('Fehler beim Laden der Statistiken:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Laden der Statistiken'
        });
    }
});
// GET /vip-dashboard/achievements/:userId - Achievements abrufen
router.get('/achievements/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const achievements = readAchievements();
        const userAchievements = achievements.filter(a => a.userId === userId);
        res.json({
            success: true,
            achievements: userAchievements
        });
    }
    catch (error) {
        console.error('Fehler beim Laden der Achievements:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Laden der Achievements'
        });
    }
});
// GET /vip-dashboard/activities/:userId - Aktivitäten abrufen
router.get('/activities/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 10, offset = 0 } = req.query;
        const activities = readActivities();
        const userActivities = activities
            .filter(a => a.userId === userId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(Number(offset), Number(offset) + Number(limit));
        res.json({
            success: true,
            activities: userActivities,
            total: activities.filter(a => a.userId === userId).length
        });
    }
    catch (error) {
        console.error('Fehler beim Laden der Aktivitäten:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Laden der Aktivitäten'
        });
    }
});
// PUT /vip-dashboard/user/:userId/tier - Benutzer-Tier aktualisieren
router.put('/user/:userId/tier', (req, res) => {
    try {
        const { userId } = req.params;
        const { tier } = req.body;
        if (!['basic', 'premium', 'vip'].includes(tier)) {
            return res.status(400).json({
                success: false,
                error: 'Ungültiger Tier-Typ'
            });
        }
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Benutzer nicht gefunden'
            });
        }
        users[userIndex].tier = tier;
        writeUsers(users);
        // Aktualisiere VIP-Statistiken
        const stats = readVIPStats();
        const statsIndex = stats.findIndex(s => s.userId === userId);
        if (statsIndex !== -1) {
            stats[statsIndex].exclusiveAccess = tier === 'vip';
            stats[statsIndex].lastUpdated = new Date().toISOString();
            writeVIPStats(stats);
        }
        res.json({
            success: true,
            user: users[userIndex]
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren des Tiers:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren des Tiers'
        });
    }
});
// POST /vip-dashboard/activity - Neue Aktivität hinzufügen
router.post('/activity', (req, res) => {
    try {
        const { userId, type, title, description, tier, points } = req.body;
        if (!userId || !type || !title || !description || !tier) {
            return res.status(400).json({
                success: false,
                error: 'Alle Pflichtfelder müssen ausgefüllt werden'
            });
        }
        const activity = {
            id: (0, uuid_1.v4)(),
            userId,
            type,
            title,
            description,
            timestamp: new Date().toISOString(),
            icon: getIconForType(type),
            tier,
            points: points || 0
        };
        const activities = readActivities();
        activities.push(activity);
        writeActivities(activities);
        // Aktualisiere VIP-Punkte
        if (points) {
            const users = readUsers();
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                users[userIndex].vipPoints += points;
                users[userIndex].lastActive = new Date().toISOString();
                writeUsers(users);
            }
        }
        res.json({
            success: true,
            activity
        });
    }
    catch (error) {
        console.error('Fehler beim Hinzufügen der Aktivität:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Hinzufügen der Aktivität'
        });
    }
});
// Hilfsfunktion für Icon-Zuordnung
const getIconForType = (type) => {
    const iconMap = {
        'vip_exclusive': 'Crown',
        'coaching_session': 'Users',
        'advanced_analysis': 'BarChart3',
        'moon_tracking': 'Moon',
        'community_post': 'MessageCircle',
        'chart_reading': 'BookOpen',
        'achievement': 'Award',
        'connection': 'Heart'
    };
    return iconMap[type] || 'Activity';
};
// GET /vip-dashboard/tiers - Alle verfügbaren Tiers abrufen
router.get('/tiers', (req, res) => {
    try {
        const tiers = [
            {
                id: 'basic',
                name: 'Basic',
                icon: 'Star',
                color: '#6b7280',
                price: 'Kostenlos',
                features: [
                    'Grundlegende Chart-Berechnung',
                    'Mondkalender (7 Tage)',
                    'Community-Zugang',
                    'Basis-Matching'
                ],
                limitations: [
                    'Begrenzte Chart-Details',
                    'Keine erweiterten Analytics',
                    'Keine VIP-Features'
                ]
            },
            {
                id: 'premium',
                name: 'Premium',
                icon: 'Diamond',
                color: '#8b5cf6',
                price: '19,99€/Monat',
                features: [
                    'Alle Basic-Features',
                    'Erweiterte Chart-Analyse',
                    'Vollständiger Mondkalender',
                    'Erweiterte Matching-Algorithmen',
                    'Coaching-Zugang',
                    'Prioritäts-Support'
                ],
                limitations: [
                    'Keine VIP-Exklusiv-Features',
                    'Begrenzte API-Zugriffe'
                ]
            },
            {
                id: 'vip',
                name: 'VIP',
                icon: 'Crown',
                color: '#f59e0b',
                price: '49,99€/Monat',
                features: [
                    'Alle Premium-Features',
                    'Exklusive VIP-Community',
                    'Persönlicher Coach',
                    'Unbegrenzte API-Zugriffe',
                    'Früher Zugang zu neuen Features',
                    'Premium-Analytics',
                    'Exklusive Events',
                    '1:1 Beratung'
                ],
                limitations: []
            }
        ];
        res.json({
            success: true,
            tiers
        });
    }
    catch (error) {
        console.error('Fehler beim Laden der Tiers:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Laden der Tiers'
        });
    }
});
exports.default = router;
