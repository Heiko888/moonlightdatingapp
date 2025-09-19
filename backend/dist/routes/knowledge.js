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
// Pfad zur Knowledge-Datenbank
const knowledgeDbPath = path_1.default.join(__dirname, '../data/knowledge.json');
// Stelle sicher, dass das data-Verzeichnis existiert
const dataDir = path_1.default.dirname(knowledgeDbPath);
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
// Lade Knowledge-Entries aus der Datei
const loadKnowledgeEntries = () => {
    try {
        if (fs_1.default.existsSync(knowledgeDbPath)) {
            const data = fs_1.default.readFileSync(knowledgeDbPath, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('Fehler beim Laden der Knowledge-Entries:', error);
    }
    return [];
};
// Speichere Knowledge-Entries in die Datei
const saveKnowledgeEntries = (entries) => {
    try {
        fs_1.default.writeFileSync(knowledgeDbPath, JSON.stringify(entries, null, 2));
    }
    catch (error) {
        console.error('Fehler beim Speichern der Knowledge-Entries:', error);
    }
};
// Initialisiere mit Demo-Daten falls keine Daten vorhanden sind
const initializeKnowledgeData = () => {
    const existingEntries = loadKnowledgeEntries();
    if (existingEntries.length === 0) {
        const defaultEntries = [
            {
                id: (0, uuid_1.v4)(),
                title: "Grundlagen des Human Design",
                content: "Human Design ist ein System, das Astrologie, I-Ching, Kabbalah und Chakren kombiniert, um deine einzigartige energetische Blaupause zu enthüllen. Es wurde 1987 von Ra Uru Hu entwickelt und bietet eine praktische Anleitung für das Leben nach deiner wahren Natur.",
                category: "Grundlagen",
                tags: ["Human Design", "Energetik", "Persönlichkeit", "Astrologie"],
                isFavorite: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: "System",
                readTime: "5 Min",
                difficulty: "Anfänger"
            },
            {
                id: (0, uuid_1.v4)(),
                title: "Die vier Human Design Typen",
                content: "Es gibt vier Haupttypen: Manifestoren (8% der Bevölkerung), Generatoren (70%), Projektoren (20%) und Reflektoren (1%). Jeder Typ hat eine spezifische Strategie und Autorität, die als Leitfaden für Entscheidungen dient. Generatoren warten auf die Antwort, Projektoren warten auf die Einladung, Manifestoren informieren und Reflektoren warten einen Mondzyklus ab.",
                category: "Typen",
                tags: ["Typen", "Strategie", "Autorität", "Entscheidungen"],
                isFavorite: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: "System",
                readTime: "8 Min",
                difficulty: "Anfänger"
            },
            {
                id: (0, uuid_1.v4)(),
                title: "Mondphasen und Energie",
                content: "Die verschiedenen Mondphasen beeinflussen unsere Energie und unser Wohlbefinden. Neumond ist ideal für neue Projekte, zunehmender Mond für Wachstum, Vollmond für Höhepunkte und abnehmender Mond für Loslassen. Lerne, wie du mit den Mondzyklen im Einklang leben und deine Energie optimal nutzen kannst.",
                category: "Mondkalender",
                tags: ["Mond", "Energie", "Zyklus", "Astrologie"],
                isFavorite: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: "System",
                readTime: "6 Min",
                difficulty: "Mittel"
            },
            {
                id: (0, uuid_1.v4)(),
                title: "Chakren und Human Design",
                content: "Die neun Zentren im Human Design entsprechen den traditionellen Chakren und zeigen, wo du definiert oder offen bist. Definierte Zentren sind deine Stärken, offene Zentren zeigen, wo du von anderen beeinflusst wirst. Das Verständnis deiner Zentren hilft dir, authentisch zu leben und Manipulation zu vermeiden.",
                category: "Chakren",
                tags: ["Chakren", "Zentren", "Energie", "Authentizität"],
                isFavorite: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: "System",
                readTime: "7 Min",
                difficulty: "Mittel"
            },
            {
                id: (0, uuid_1.v4)(),
                title: "Profile im Human Design",
                content: "Die Profile (1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6, 4/1, 5/1, 5/2, 6/2, 6/3) zeigen deine Lebensaufgabe und wie du am besten mit anderen interagierst. Jedes Profil hat spezifische Eigenschaften: 1/3 ist der Forscher, 2/4 der Hermit, 3/5 der Märtyrer, 4/6 der Opportunist, 5/1 der Generalist und 6/3 das Vorbild.",
                category: "Profile",
                tags: ["Profile", "Lebensaufgabe", "Interaktion", "Persönlichkeit"],
                isFavorite: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: "System",
                readTime: "10 Min",
                difficulty: "Fortgeschritten"
            },
            {
                id: (0, uuid_1.v4)(),
                title: "Autoritäten verstehen",
                content: "Die Autorität ist dein innerer Kompass für Entscheidungen. Es gibt verschiedene Autoritäten: Sakrale (für Generatoren), Splenische (für Projektoren), Solar Plexus (emotional), Ego (willensbasiert), G-Zentrum (magnetisch), Kehle (projiziert) und Keine (für Reflektoren). Lerne, deiner Autorität zu vertrauen.",
                category: "Autorität",
                tags: ["Autorität", "Entscheidungen", "Intuition", "Strategie"],
                isFavorite: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: "System",
                readTime: "9 Min",
                difficulty: "Fortgeschritten"
            }
        ];
        saveKnowledgeEntries(defaultEntries);
        console.log('✅ Standard Knowledge-Entries erstellt');
    }
};
// Initialisiere beim Start
initializeKnowledgeData();
// GET /knowledge - Alle Knowledge-Entries abrufen
router.get('/', (req, res) => {
    try {
        const entries = loadKnowledgeEntries();
        res.json({
            success: true,
            data: entries,
            count: entries.length
        });
    }
    catch (error) {
        console.error('Fehler beim Abrufen der Knowledge-Entries:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen der Knowledge-Entries'
        });
    }
});
// GET /knowledge/:id - Einzelnen Knowledge-Entry abrufen
router.get('/:id', (req, res) => {
    try {
        const entries = loadKnowledgeEntries();
        const entry = entries.find(e => e.id === req.params.id);
        if (!entry) {
            return res.status(404).json({
                success: false,
                error: 'Knowledge-Entry nicht gefunden'
            });
        }
        res.json({
            success: true,
            data: entry
        });
    }
    catch (error) {
        console.error('Fehler beim Abrufen des Knowledge-Entries:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen des Knowledge-Entries'
        });
    }
});
// POST /knowledge - Neuen Knowledge-Entry erstellen
router.post('/', (req, res) => {
    try {
        const { title, content, category, tags, author, readTime, difficulty } = req.body;
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                error: 'Titel, Inhalt und Kategorie sind erforderlich'
            });
        }
        const entries = loadKnowledgeEntries();
        const newEntry = {
            id: (0, uuid_1.v4)(),
            title,
            content,
            category,
            tags: tags || [],
            isFavorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: author || 'Unbekannt',
            readTime: readTime || '5 Min',
            difficulty: difficulty || 'Anfänger'
        };
        entries.push(newEntry);
        saveKnowledgeEntries(entries);
        res.status(201).json({
            success: true,
            data: newEntry,
            message: 'Knowledge-Entry erfolgreich erstellt'
        });
    }
    catch (error) {
        console.error('Fehler beim Erstellen des Knowledge-Entries:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Erstellen des Knowledge-Entries'
        });
    }
});
// PUT /knowledge/:id - Knowledge-Entry aktualisieren
router.put('/:id', (req, res) => {
    try {
        const entries = loadKnowledgeEntries();
        const entryIndex = entries.findIndex(e => e.id === req.params.id);
        if (entryIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Knowledge-Entry nicht gefunden'
            });
        }
        const { title, content, category, tags, author, readTime, difficulty } = req.body;
        entries[entryIndex] = {
            ...entries[entryIndex],
            ...(title && { title }),
            ...(content && { content }),
            ...(category && { category }),
            ...(tags && { tags }),
            ...(author && { author }),
            ...(readTime && { readTime }),
            ...(difficulty && { difficulty }),
            updatedAt: new Date().toISOString()
        };
        saveKnowledgeEntries(entries);
        res.json({
            success: true,
            data: entries[entryIndex],
            message: 'Knowledge-Entry erfolgreich aktualisiert'
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren des Knowledge-Entries:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren des Knowledge-Entries'
        });
    }
});
// PATCH /knowledge/:id/favorite - Favoriten-Status umschalten
router.patch('/:id/favorite', (req, res) => {
    try {
        const entries = loadKnowledgeEntries();
        const entryIndex = entries.findIndex(e => e.id === req.params.id);
        if (entryIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Knowledge-Entry nicht gefunden'
            });
        }
        entries[entryIndex].isFavorite = !entries[entryIndex].isFavorite;
        entries[entryIndex].updatedAt = new Date().toISOString();
        saveKnowledgeEntries(entries);
        res.json({
            success: true,
            data: entries[entryIndex],
            message: `Knowledge-Entry ${entries[entryIndex].isFavorite ? 'zu' : 'aus'} Favoriten hinzugefügt`
        });
    }
    catch (error) {
        console.error('Fehler beim Umschalten des Favoriten-Status:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Umschalten des Favoriten-Status'
        });
    }
});
// DELETE /knowledge/:id - Knowledge-Entry löschen
router.delete('/:id', (req, res) => {
    try {
        const entries = loadKnowledgeEntries();
        const entryIndex = entries.findIndex(e => e.id === req.params.id);
        if (entryIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Knowledge-Entry nicht gefunden'
            });
        }
        const deletedEntry = entries.splice(entryIndex, 1)[0];
        saveKnowledgeEntries(entries);
        res.json({
            success: true,
            data: deletedEntry,
            message: 'Knowledge-Entry erfolgreich gelöscht'
        });
    }
    catch (error) {
        console.error('Fehler beim Löschen des Knowledge-Entries:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Löschen des Knowledge-Entries'
        });
    }
});
// GET /knowledge/categories - Alle Kategorien abrufen
router.get('/meta/categories', (req, res) => {
    try {
        const entries = loadKnowledgeEntries();
        const categories = [...new Set(entries.map(entry => entry.category))];
        res.json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        console.error('Fehler beim Abrufen der Kategorien:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen der Kategorien'
        });
    }
});
// GET /knowledge/search - Suche in Knowledge-Entries
router.get('/search/:query', (req, res) => {
    try {
        const { query } = req.params;
        const entries = loadKnowledgeEntries();
        const filteredEntries = entries.filter(entry => {
            const searchTerm = query.toLowerCase();
            return (entry.title.toLowerCase().includes(searchTerm) ||
                entry.content.toLowerCase().includes(searchTerm) ||
                entry.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                entry.category.toLowerCase().includes(searchTerm));
        });
        res.json({
            success: true,
            data: filteredEntries,
            count: filteredEntries.length,
            query
        });
    }
    catch (error) {
        console.error('Fehler bei der Suche:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler bei der Suche'
        });
    }
});
exports.default = router;
