"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../lib/supabase");
const chartCalculationService_1 = require("../services/chartCalculationService");
const router = express_1.default.Router();
// GET /dashboard/:userId - Dashboard-Daten für einen Benutzer abrufen
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`📊 Dashboard-Daten für Benutzer ${userId} werden geladen...`);
        // 1. Benutzer-Profil laden
        const { data: userProfile, error: profileError } = await supabase_1.supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Fehler beim Laden des Benutzer-Profils:', profileError);
            return res.status(500).json({ error: 'Fehler beim Laden des Benutzer-Profils' });
        }
        // 2. Statistiken berechnen
        const statistics = await calculateUserStatistics(userId);
        // 3. Letzte Aktivitäten laden
        const recentActivity = await getRecentActivity(userId);
        // 4. Benachrichtigungen laden
        const notifications = await getNotifications(userId);
        // 5. Human Design Chart-Daten berechnen (falls Geburtsdaten vorhanden)
        let hdChart = null;
        if (userProfile?.birth_date && userProfile?.birth_time && userProfile?.birth_place) {
            try {
                const chartData = await chartCalculationService_1.chartCalculationService.calculateChart(userProfile.birth_date, userProfile.birth_time, userProfile.birth_place, 'Europe/Berlin');
                hdChart = {
                    type: chartData.metadata?.type || 'Unbekannt',
                    profile: chartData.metadata?.profile || 'Unbekannt',
                    authority: chartData.metadata?.authority || 'Unbekannt',
                    strategy: chartData.metadata?.strategy || 'Unbekannt',
                    incarnationCross: chartData.metadata?.incarnationCross
                };
            }
            catch (chartError) {
                console.error('Fehler bei Chart-Berechnung:', chartError);
            }
        }
        // 6. Dashboard-Daten zusammenstellen
        const dashboardData = {
            user: {
                id: userId,
                name: userProfile?.first_name && userProfile?.last_name
                    ? `${userProfile.first_name} ${userProfile.last_name}`
                    : userProfile?.username || 'Unbekannter Benutzer',
                email: userProfile?.email || '',
                avatar: userProfile?.avatar_url || undefined,
                hdType: userProfile?.hd_type || hdChart?.type,
                profile: userProfile?.hd_profile || hdChart?.profile,
                authority: userProfile?.hd_authority || hdChart?.authority
            },
            statistics,
            recentActivity,
            notifications,
            hdChart
        };
        console.log(`✅ Dashboard-Daten für Benutzer ${userId} erfolgreich geladen`);
        res.json(dashboardData);
    }
    catch (error) {
        console.error('Fehler beim Laden der Dashboard-Daten:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Dashboard-Daten' });
    }
});
// Hilfsfunktion: Benutzer-Statistiken berechnen
async function calculateUserStatistics(userId) {
    try {
        // Mondkalender-Einträge zählen
        const { count: moonEntries } = await supabase_1.supabase
            .from('moon_calendar_entries')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        // Readings zählen
        const { count: readings } = await supabase_1.supabase
            .from('readings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        // Matches zählen
        const { count: matches } = await supabase_1.supabase
            .from('matches')
            .select('*', { count: 'exact', head: true })
            .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
        // Community-Aktivität (Posts, Kommentare, Likes)
        const { count: posts } = await supabase_1.supabase
            .from('community_posts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        const { count: comments } = await supabase_1.supabase
            .from('community_comments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        const communityActivity = (posts || 0) + (comments || 0);
        return {
            totalMoonEntries: moonEntries || 0,
            totalReadings: readings || 0,
            totalMatches: matches || 0,
            communityActivity
        };
    }
    catch (error) {
        console.error('Fehler beim Berechnen der Statistiken:', error);
        return {
            totalMoonEntries: 0,
            totalReadings: 0,
            totalMatches: 0,
            communityActivity: 0
        };
    }
}
// Hilfsfunktion: Letzte Aktivitäten abrufen
async function getRecentActivity(userId) {
    try {
        const activities = [];
        // Mondkalender-Einträge
        const { data: moonEntries } = await supabase_1.supabase
            .from('moon_calendar_entries')
            .select('id, created_at, moon_phase, notes')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(3);
        if (moonEntries) {
            moonEntries.forEach(entry => {
                activities.push({
                    id: `moon_${entry.id}`,
                    type: 'moon',
                    message: `Mondkalender-Eintrag: ${entry.moon_phase}`,
                    time: getTimeAgo(entry.created_at),
                    timestamp: entry.created_at
                });
            });
        }
        // Readings
        const { data: readings } = await supabase_1.supabase
            .from('readings')
            .select('id, created_at, type, status')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(3);
        if (readings) {
            readings.forEach(reading => {
                activities.push({
                    id: `reading_${reading.id}`,
                    type: 'reading',
                    message: `${reading.type}-Reading ${reading.status === 'completed' ? 'abgeschlossen' : 'gestartet'}`,
                    time: getTimeAgo(reading.created_at),
                    timestamp: reading.created_at
                });
            });
        }
        // Matches
        const { data: matches } = await supabase_1.supabase
            .from('matches')
            .select('id, created_at, user1_id, user2_id')
            .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
            .order('created_at', { ascending: false })
            .limit(3);
        if (matches) {
            matches.forEach(match => {
                activities.push({
                    id: `match_${match.id}`,
                    type: 'match',
                    message: 'Neuer Match gefunden!',
                    time: getTimeAgo(match.created_at),
                    timestamp: match.created_at
                });
            });
        }
        // Nach Zeit sortieren und die neuesten 5 zurückgeben
        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5);
    }
    catch (error) {
        console.error('Fehler beim Laden der Aktivitäten:', error);
        return [];
    }
}
// Hilfsfunktion: Benachrichtigungen abrufen
async function getNotifications(userId) {
    try {
        const { data: notifications } = await supabase_1.supabase
            .from('notifications')
            .select('id, message, type, is_read, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);
        if (notifications) {
            return notifications.map(notification => ({
                id: notification.id,
                message: notification.message,
                unread: !notification.is_read,
                type: notification.type,
                timestamp: notification.created_at
            }));
        }
        return [];
    }
    catch (error) {
        console.error('Fehler beim Laden der Benachrichtigungen:', error);
        return [];
    }
}
// Hilfsfunktion: Zeit-Formatierung
function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return 'vor wenigen Sekunden';
    }
    else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `vor ${minutes} Minute${minutes > 1 ? 'n' : ''}`;
    }
    else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `vor ${hours} Stunde${hours > 1 ? 'n' : ''}`;
    }
    else {
        const days = Math.floor(diffInSeconds / 86400);
        return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
    }
}
exports.default = router;
