"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../lib/supabase");
const router = express_1.default.Router();
// Mock-Daten für Fallback
const mockProfiles = [
    {
        id: '1',
        user_id: 'user1',
        first_name: 'Max',
        last_name: 'Mustermann',
        email: 'max@example.com',
        username: 'max_mustermann',
        bio: 'Ich bin ein Manifesting Generator und liebe es, neue Dinge zu entdecken.',
        location: 'Berlin, Deutschland',
        birth_date: '1990-05-15',
        birth_time: '14:30',
        birth_place: 'Berlin, Deutschland',
        hd_type: 'Manifesting Generator',
        hd_profile: '1/3',
        hd_strategy: 'To Respond',
        hd_authority: 'Sacral',
        hd_channels: ['1-8', '2-14', '3-60'],
        hd_gates: ['1', '2', '3', '8', '14', '60'],
        interests: ['Human Design', 'Spiritualität', 'Reisen', 'Kochen'],
        relationship_goals: 'Ich suche eine tiefe, spirituelle Verbindung',
        looking_for: 'Partner für gemeinsames Wachstum',
        is_public: true,
        notifications_enabled: true,
        email_notifications: true,
        allow_messages: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_active: new Date().toISOString()
    }
];
// GET /user-profile/profile/:userId - Benutzerprofil abrufen
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { data, error } = await supabase_1.supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return res.status(404).json({ error: 'Profil nicht gefunden' });
                }
                throw error;
            }
            return res.json(data);
        }
        // Fallback: Mock-Daten
        const profile = mockProfiles.find(p => p.user_id === userId);
        if (!profile) {
            return res.status(404).json({ error: 'Profil nicht gefunden' });
        }
        res.json(profile);
    }
    catch (error) {
        console.error('Fehler beim Laden des Profils:', error);
        res.status(500).json({ error: 'Fehler beim Laden des Profils' });
    }
});
// PUT /user-profile/profile/:userId - Benutzerprofil aktualisieren
router.put('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        // Entferne nicht-aktualisierbare Felder
        delete updateData.id;
        delete updateData.user_id;
        delete updateData.created_at;
        // Setze updated_at
        updateData.updated_at = new Date().toISOString();
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { data, error } = await supabase_1.supabase
                .from('user_profiles')
                .update(updateData)
                .eq('user_id', userId)
                .select()
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return res.status(404).json({ error: 'Profil nicht gefunden' });
                }
                throw error;
            }
            return res.json(data);
        }
        // Fallback: Mock-Daten
        const profileIndex = mockProfiles.findIndex(p => p.user_id === userId);
        if (profileIndex === -1) {
            return res.status(404).json({ error: 'Profil nicht gefunden' });
        }
        mockProfiles[profileIndex] = {
            ...mockProfiles[profileIndex],
            ...updateData
        };
        res.json(mockProfiles[profileIndex]);
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren des Profils:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Profils' });
    }
});
// POST /user-profile/avatar - Avatar hochladen
router.post('/avatar', async (req, res) => {
    try {
        const { user_id, avatar_url } = req.body;
        if (!user_id || !avatar_url) {
            return res.status(400).json({ error: 'user_id und avatar_url sind erforderlich' });
        }
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { data, error } = await supabase_1.supabase
                .from('user_profiles')
                .update({ avatar_url, updated_at: new Date().toISOString() })
                .eq('user_id', user_id)
                .select('avatar_url')
                .single();
            if (error)
                throw error;
            return res.json({ avatar_url: data.avatar_url });
        }
        // Fallback: Mock-Daten
        const profile = mockProfiles.find(p => p.user_id === user_id);
        if (profile) {
            profile.avatar_url = avatar_url;
            profile.updated_at = new Date().toISOString();
        }
        res.json({ avatar_url });
    }
    catch (error) {
        console.error('Fehler beim Hochladen des Avatars:', error);
        res.status(500).json({ error: 'Fehler beim Hochladen des Avatars' });
    }
});
// POST /user-profile/create - Neues Profil erstellen
router.post('/create', async (req, res) => {
    try {
        const profileData = req.body;
        if (!profileData.user_id || !profileData.first_name || !profileData.email) {
            return res.status(400).json({ error: 'user_id, first_name und email sind erforderlich' });
        }
        const newProfile = {
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_public: profileData.is_public ?? true,
            notifications_enabled: profileData.notifications_enabled ?? true,
            email_notifications: profileData.email_notifications ?? true,
            allow_messages: profileData.allow_messages ?? true
        };
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { data, error } = await supabase_1.supabase
                .from('user_profiles')
                .insert([newProfile])
                .select()
                .single();
            if (error)
                throw error;
            return res.status(201).json(data);
        }
        // Fallback: Mock-Daten
        const mockProfile = {
            id: Date.now().toString(),
            ...newProfile
        };
        mockProfiles.push(mockProfile);
        res.status(201).json(mockProfile);
    }
    catch (error) {
        console.error('Fehler beim Erstellen des Profils:', error);
        res.status(500).json({ error: 'Fehler beim Erstellen des Profils' });
    }
});
// DELETE /user-profile/profile/:userId - Profil löschen
router.delete('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { error } = await supabase_1.supabase
                .from('user_profiles')
                .delete()
                .eq('user_id', userId);
            if (error)
                throw error;
            return res.json({ success: true });
        }
        // Fallback: Mock-Daten
        const index = mockProfiles.findIndex(p => p.user_id === userId);
        if (index !== -1) {
            mockProfiles.splice(index, 1);
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Fehler beim Löschen des Profils:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Profils' });
    }
});
// GET /user-profile/search - Profile durchsuchen
router.get('/search', async (req, res) => {
    try {
        const { query, location, hd_type, interests, limit = 20, offset = 0 } = req.query;
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            let supabaseQuery = supabase_1.supabase
                .from('user_profiles')
                .select('*')
                .eq('is_public', true)
                .order('updated_at', { ascending: false })
                .range(Number(offset), Number(offset) + Number(limit) - 1);
            if (query) {
                supabaseQuery = supabaseQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,bio.ilike.%${query}%`);
            }
            if (location) {
                supabaseQuery = supabaseQuery.ilike('location', `%${location}%`);
            }
            if (hd_type) {
                supabaseQuery = supabaseQuery.eq('hd_type', hd_type);
            }
            const { data, error } = await supabaseQuery;
            if (error)
                throw error;
            return res.json(data || []);
        }
        // Fallback: Mock-Daten
        let filteredProfiles = mockProfiles.filter(p => p.is_public);
        if (query) {
            const searchTerm = query.toString().toLowerCase();
            filteredProfiles = filteredProfiles.filter(p => p.first_name.toLowerCase().includes(searchTerm) ||
                p.last_name.toLowerCase().includes(searchTerm) ||
                p.bio?.toLowerCase().includes(searchTerm));
        }
        if (location) {
            const locationTerm = location.toString().toLowerCase();
            filteredProfiles = filteredProfiles.filter(p => p.location?.toLowerCase().includes(locationTerm));
        }
        if (hd_type) {
            filteredProfiles = filteredProfiles.filter(p => p.hd_type === hd_type);
        }
        filteredProfiles = filteredProfiles
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(Number(offset), Number(offset) + Number(limit));
        res.json(filteredProfiles);
    }
    catch (error) {
        console.error('Fehler bei der Profilsuche:', error);
        res.status(500).json({ error: 'Fehler bei der Profilsuche' });
    }
});
// PUT /user-profile/last-active/:userId - Letzte Aktivität aktualisieren
router.put('/last-active/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const lastActive = new Date().toISOString();
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { error } = await supabase_1.supabase
                .from('user_profiles')
                .update({ last_active: lastActive })
                .eq('user_id', userId);
            if (error)
                throw error;
            return res.json({ success: true, last_active: lastActive });
        }
        // Fallback: Mock-Daten
        const profile = mockProfiles.find(p => p.user_id === userId);
        if (profile) {
            profile.last_active = lastActive;
        }
        res.json({ success: true, last_active: lastActive });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren der letzten Aktivität:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren der letzten Aktivität' });
    }
});
// ===== MULTI-IMAGE MANAGEMENT ENDPOINTS =====
// POST /user-profile/images/:userId - Mehrere Bilder hochladen
router.post('/images/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { images } = req.body; // Array von { url, alt_text? }
        if (!images || !Array.isArray(images)) {
            return res.status(400).json({ error: 'images Array ist erforderlich' });
        }
        const newImages = images.map((img, index) => ({
            id: Date.now().toString() + index,
            url: img.url,
            is_primary: index === 0, // Erstes Bild ist primär
            uploaded_at: new Date().toISOString(),
            order: index,
            alt_text: img.alt_text || ''
        }));
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            // Hole aktuelles Profil
            const { data: profile, error: fetchError } = await supabase_1.supabase
                .from('user_profiles')
                .select('profile_images')
                .eq('user_id', userId)
                .single();
            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }
            const existingImages = profile?.profile_images || [];
            const updatedImages = [...existingImages, ...newImages];
            const { data, error } = await supabase_1.supabase
                .from('user_profiles')
                .update({
                profile_images: updatedImages,
                updated_at: new Date().toISOString()
            })
                .eq('user_id', userId)
                .select('profile_images')
                .single();
            if (error)
                throw error;
            return res.json({ images: data.profile_images });
        }
        // Fallback: Mock-Daten
        const profile = mockProfiles.find(p => p.user_id === userId);
        if (!profile) {
            return res.status(404).json({ error: 'Profil nicht gefunden' });
        }
        const existingImages = profile.profile_images || [];
        profile.profile_images = [...existingImages, ...newImages];
        profile.updated_at = new Date().toISOString();
        res.json({ images: profile.profile_images });
    }
    catch (error) {
        console.error('Fehler beim Hochladen der Bilder:', error);
        res.status(500).json({ error: 'Fehler beim Hochladen der Bilder' });
    }
});
// PUT /user-profile/images/:userId/primary - Primäres Bild setzen
router.put('/images/:userId/primary', async (req, res) => {
    try {
        const { userId } = req.params;
        const { imageId } = req.body;
        if (!imageId) {
            return res.status(400).json({ error: 'imageId ist erforderlich' });
        }
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { data: profile, error: fetchError } = await supabase_1.supabase
                .from('user_profiles')
                .select('profile_images')
                .eq('user_id', userId)
                .single();
            if (fetchError)
                throw fetchError;
            const updatedImages = profile.profile_images.map((img) => ({
                ...img,
                is_primary: img.id === imageId
            }));
            const { data, error } = await supabase_1.supabase
                .from('user_profiles')
                .update({
                profile_images: updatedImages,
                updated_at: new Date().toISOString()
            })
                .eq('user_id', userId)
                .select('profile_images')
                .single();
            if (error)
                throw error;
            return res.json({ images: data.profile_images });
        }
        // Fallback: Mock-Daten
        const profile = mockProfiles.find(p => p.user_id === userId);
        if (!profile || !profile.profile_images) {
            return res.status(404).json({ error: 'Profil oder Bilder nicht gefunden' });
        }
        profile.profile_images = profile.profile_images.map(img => ({
            ...img,
            is_primary: img.id === imageId
        }));
        profile.updated_at = new Date().toISOString();
        res.json({ images: profile.profile_images });
    }
    catch (error) {
        console.error('Fehler beim Setzen des primären Bildes:', error);
        res.status(500).json({ error: 'Fehler beim Setzen des primären Bildes' });
    }
});
// PUT /user-profile/images/:userId/reorder - Bildreihenfolge ändern
router.put('/images/:userId/reorder', async (req, res) => {
    try {
        const { userId } = req.params;
        const { imageIds } = req.body; // Array von IDs in neuer Reihenfolge
        if (!imageIds || !Array.isArray(imageIds)) {
            return res.status(400).json({ error: 'imageIds Array ist erforderlich' });
        }
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { data: profile, error: fetchError } = await supabase_1.supabase
                .from('user_profiles')
                .select('profile_images')
                .eq('user_id', userId)
                .single();
            if (fetchError)
                throw fetchError;
            const updatedImages = profile.profile_images.map((img) => {
                const newOrder = imageIds.indexOf(img.id);
                return {
                    ...img,
                    order: newOrder >= 0 ? newOrder : img.order
                };
            }).sort((a, b) => a.order - b.order);
            const { data, error } = await supabase_1.supabase
                .from('user_profiles')
                .update({
                profile_images: updatedImages,
                updated_at: new Date().toISOString()
            })
                .eq('user_id', userId)
                .select('profile_images')
                .single();
            if (error)
                throw error;
            return res.json({ images: data.profile_images });
        }
        // Fallback: Mock-Daten
        const profile = mockProfiles.find(p => p.user_id === userId);
        if (!profile || !profile.profile_images) {
            return res.status(404).json({ error: 'Profil oder Bilder nicht gefunden' });
        }
        profile.profile_images = profile.profile_images.map(img => {
            const newOrder = imageIds.indexOf(img.id);
            return {
                ...img,
                order: newOrder >= 0 ? newOrder : img.order
            };
        }).sort((a, b) => a.order - b.order);
        profile.updated_at = new Date().toISOString();
        res.json({ images: profile.profile_images });
    }
    catch (error) {
        console.error('Fehler beim Ändern der Bildreihenfolge:', error);
        res.status(500).json({ error: 'Fehler beim Ändern der Bildreihenfolge' });
    }
});
// DELETE /user-profile/images/:userId/:imageId - Einzelnes Bild löschen
router.delete('/images/:userId/:imageId', async (req, res) => {
    try {
        const { userId, imageId } = req.params;
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { data: profile, error: fetchError } = await supabase_1.supabase
                .from('user_profiles')
                .select('profile_images')
                .eq('user_id', userId)
                .single();
            if (fetchError)
                throw fetchError;
            const updatedImages = profile.profile_images
                .filter((img) => img.id !== imageId)
                .map((img, index) => ({
                ...img,
                order: index,
                is_primary: index === 0 // Erstes verbleibendes Bild wird primär
            }));
            const { data, error } = await supabase_1.supabase
                .from('user_profiles')
                .update({
                profile_images: updatedImages,
                updated_at: new Date().toISOString()
            })
                .eq('user_id', userId)
                .select('profile_images')
                .single();
            if (error)
                throw error;
            return res.json({ images: data.profile_images });
        }
        // Fallback: Mock-Daten
        const profile = mockProfiles.find(p => p.user_id === userId);
        if (!profile || !profile.profile_images) {
            return res.status(404).json({ error: 'Profil oder Bilder nicht gefunden' });
        }
        profile.profile_images = profile.profile_images
            .filter(img => img.id !== imageId)
            .map((img, index) => ({
            ...img,
            order: index,
            is_primary: index === 0
        }));
        profile.updated_at = new Date().toISOString();
        res.json({ images: profile.profile_images });
    }
    catch (error) {
        console.error('Fehler beim Löschen des Bildes:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Bildes' });
    }
});
exports.default = router;
