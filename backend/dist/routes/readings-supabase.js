"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const openai_1 = __importDefault(require("openai"));
const openaiService_1 = __importDefault(require("../services/openaiService"));
const router = express_1.default.Router();
// OpenAI Client
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function generateReadingWithAI(chartData, scope) {
    try {
        const prompt = `Erstelle ein detailliertes Human Design Reading für folgende Daten:

Geburtsdaten:
- Geburtsdatum: ${chartData.birthDate}
- Geburtszeit: ${chartData.birthTime}
- Geburtsort: ${chartData.birthPlace}

Chart-Daten:
- Typ: ${chartData.type}
- Profil: ${chartData.profile}
- Definierte Zentren: ${chartData.definedCenters?.join(', ') || 'Unbekannt'}
- Definierte Kanäle: ${chartData.definedChannels?.join(', ') || 'Unbekannt'}
- Aktive Gates: ${chartData.activeGates?.join(', ') || 'Unbekannt'}
- Strategie: ${chartData.strategy}
- Autorität: ${chartData.authority}
- Inkarnationskreuz: ${chartData.incarnationCross || 'Unbekannt'}

Bereich: ${scope}

Bitte erstelle ein strukturiertes Reading in deutscher Sprache mit folgenden Abschnitten:

1. **Überblick** - Kurze Einführung in das Chart
2. **Typ & Strategie** - Detaillierte Erklärung des Typs und der Strategie
3. **Autorität** - Wie Entscheidungen getroffen werden sollten
4. **Zentren** - Analyse der definierten und undefinierten Zentren
5. **Kanäle & Gates** - Bedeutung der aktivierten Kanäle und Gates
6. **Profil** - Lebensprofil und Entwicklungsphasen
7. **Praktische Anwendung** - Konkrete Tipps für den Alltag
8. **Experimente** - Vorschläge für Human Design Experimente

Das Reading sollte persönlich, ermutigend und praktisch anwendbar sein.`;
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 2000,
            temperature: 0.7
        });
        return aiResponse.choices[0]?.message?.content || generateSimpleReading(chartData, scope);
    }
    catch (error) {
        console.error('[readings] AI generation error:', error);
        return generateSimpleReading(chartData, scope);
    }
}
// Neue Funktion: PDF-basiertes Reading mit erweitertem Wissen
async function generateReadingWithPDFs(chartData, scope) {
    try {
        console.log('📖 PDF-basiertes Reading wird generiert...');
        // Verwende den OpenAI Service für PDF-basierte Chart-Analyse
        const pdfChartResult = await openaiService_1.default.calculateHumanDesignChartWithPDFs({
            birth_date: chartData.birthDate,
            birth_time: chartData.birthTime || '00:00',
            birth_place: chartData.birthPlace,
            name: chartData.name
        });
        // Erstelle ein strukturiertes Reading basierend auf den PDF-Daten
        const readingPrompt = `Erstelle ein detailliertes, professionelles Human Design Reading basierend auf den folgenden Chart-Daten und dem PDF-Wissen:

Chart-Analyse:
${pdfChartResult.chartData}

Bereich: ${scope}

Erstelle ein strukturiertes Reading in deutscher Sprache mit folgenden Abschnitten:

1. **Überblick & Einführung** - Persönliche Begrüßung und Chart-Überblick
2. **Typ & Strategie** - Detaillierte Erklärung mit PDF-Referenzen
3. **Autorität & Entscheidungsfindung** - Praktische Anleitung
4. **Zentren-Analyse** - Definierte und offene Zentren mit Bedeutung
5. **Kanäle & Gates** - Spezifische Talente und Lebensthemen
6. **Profil & Entwicklungsphasen** - Lebensweg und Wachstum
7. **Praktische Anwendungen** - Konkrete Tipps für den Alltag
8. **Coaching-Empfehlungen** - Nächste Schritte und Experimente
9. **Zusammenfassung** - Wichtige Erkenntnisse und Aufforderung zum Handeln

Verwende das PDF-Wissen für:
- Professionelle Definitionen und Erklärungen
- Praktische Beispiele und Fallstudien
- Aktuelle Entwicklungen im Human Design
- Coaching-Techniken und Methoden

Das Reading sollte:
- Persönlich und ansprechend sein
- Praktisch anwendbar sein
- Ermutigend und motivierend wirken
- Professionell und fundiert sein

Verwende Markdown-Formatierung für bessere Lesbarkeit.`;
        const readingResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: readingPrompt }],
            max_tokens: 3000,
            temperature: 0.7
        });
        console.log('✅ PDF-basiertes Reading erfolgreich generiert');
        return readingResponse.choices[0]?.message?.content || generateSimpleReading(chartData, scope);
    }
    catch (error) {
        console.error('❌ Fehler bei der PDF-Reading-Generierung:', error);
        return generateSimpleReading(chartData, scope);
    }
}
// Neue Funktion: Erweiterte Reflexionsfragen mit PDF-Wissen
async function generateReflectionQuestionsWithPDFs(chartData, scope) {
    try {
        console.log('🤔 PDF-basierte Reflexionsfragen werden generiert...');
        const questionsResult = await openaiService_1.default.generateReflectionQuestions({
            type: 'profile',
            value: chartData.profile || 'Unbekannt',
            description: `Human Design Profil für ${scope} Bereich`
        });
        console.log('✅ PDF-basierte Reflexionsfragen erfolgreich generiert');
        return questionsResult.questions;
    }
    catch (error) {
        console.error('❌ Fehler bei der Generierung von Reflexionsfragen:', error);
        return null;
    }
}
function generateSimpleReading(chartData, scope) {
    return `# Human Design Reading für ${chartData.name || 'Sie'}

## Geburtsdaten
- **Geburtsdatum:** ${chartData.birthDate}
- **Geburtszeit:** ${chartData.birthTime}
- **Geburtsort:** ${chartData.birthPlace}

## ${scope} Analyse

### Typ & Strategie
**Typ:** ${chartData.type}
**Strategie:** ${chartData.strategy}

Ihr Human Design Typ zeigt Ihnen, wie Sie am besten mit der Welt interagieren sollten. Als ${chartData.type} ist Ihre Strategie: ${chartData.strategy}.

### Autorität
**Autorität:** ${chartData.authority}

Ihre innere Autorität ist Ihr Kompass für Entscheidungen. Vertrauen Sie auf ${chartData.authority} und lernen Sie, auf diese innere Stimme zu hören.

### Zentren
**Definierte Zentren:** ${chartData.definedCenters?.join(', ') || 'Unbekannt'}

Ihre definierten Zentren sind Ihre stabilen Energien. Sie geben Ihnen Stärke und Zuverlässigkeit in diesen Bereichen.

### Kanäle & Gates
**Aktivierte Kanäle:** ${chartData.definedChannels?.join(', ') || 'Unbekannt'}
**Aktive Gates:** ${chartData.activeGates?.join(', ') || 'Unbekannt'}

Diese Kanäle und Gates zeigen Ihre spezifischen Talente und Lebensthemen.

### Praktische Anwendung
- Beobachten Sie, wie Sie auf verschiedene Situationen reagieren
- Experimentieren Sie mit Ihrer Strategie im Alltag
- Vertrauen Sie auf Ihre innere Autorität bei Entscheidungen
- Nehmen Sie sich Zeit für Selbstreflexion

*Dieses Reading wurde automatisch generiert und dient als Ausgangspunkt für eine tiefere Analyse.*`;
}
// Datei-Operationen
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readingsFile = path_1.default.join(__dirname, '../../data/readings.json');
function loadReadings() {
    try {
        if (fs_1.default.existsSync(readingsFile)) {
            const data = fs_1.default.readFileSync(readingsFile, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('[readings] Load error:', error);
    }
    return [];
}
function saveReadings(readings) {
    try {
        fs_1.default.writeFileSync(readingsFile, JSON.stringify(readings, null, 2));
    }
    catch (error) {
        console.error('[readings] Save error:', error);
    }
}
// GET /readings - Alle Readings eines Users
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Nicht authentifiziert' });
        }
        const readings = loadReadings();
        const userReadings = readings.filter((r) => r.user_id === userId);
        res.json(userReadings);
    }
    catch (error) {
        console.error('[readings] GET error:', error);
        res.status(500).json({ error: 'Fehler beim Laden des Readings' });
    }
});
// POST /readings - Neues Reading erstellen
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Nicht authentifiziert' });
        }
        const { chartData, scope, useAI = true, usePDFs = false } = req.body;
        // Validierung
        if (!chartData || !scope) {
            return res.status(400).json({
                error: 'chartData und scope sind erforderlich'
            });
        }
        let content;
        let reflectionQuestions = null;
        let generationMethod = 'simple';
        if (usePDFs && process.env.OPENAI_API_KEY) {
            // Verwende PDF-basiertes Reading mit erweitertem Wissen
            console.log('📚 PDF-basiertes Reading wird erstellt...');
            content = await generateReadingWithPDFs(chartData, scope);
            reflectionQuestions = await generateReflectionQuestionsWithPDFs(chartData, scope);
            generationMethod = 'PDF-enhanced';
        }
        else if (useAI && process.env.OPENAI_API_KEY) {
            // Verwende OpenAI für detailliertes Reading
            content = await generateReadingWithAI(chartData, scope);
            generationMethod = 'AI-powered';
        }
        else {
            // Verwende einfaches Reading
            content = generateSimpleReading(chartData, scope);
        }
        const newReading = {
            id: Date.now().toString(),
            user_id: userId,
            chart_id: `chart_${Date.now()}`,
            scope,
            content,
            reflection_questions: reflectionQuestions,
            title: `Reading für ${chartData.name || 'Sie'} - ${scope}`,
            summary: `${generationMethod === 'PDF-enhanced' ? 'PDF-verstärktes' : generationMethod === 'AI-powered' ? 'KI-generiertes' : 'Automatisch generiertes'} Reading für ${scope}`,
            sources: generationMethod === 'PDF-enhanced' ? ['HD App PDF Generator', 'Human Design PDFs'] : generationMethod === 'AI-powered' ? ['HD App AI Generator'] : ['HD App Generator'],
            tags: [scope, generationMethod === 'PDF-enhanced' ? 'PDF-verstärkt' : generationMethod === 'AI-powered' ? 'KI-generiert' : 'automatisch generiert'],
            generation_method: generationMethod,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        const readings = loadReadings();
        readings.push(newReading);
        saveReadings(readings);
        res.status(201).json(newReading);
    }
    catch (error) {
        console.error('[readings] POST error:', error);
        res.status(500).json({ error: 'Fehler beim Erstellen des Readings' });
    }
});
// PUT /readings/:id - Reading aktualisieren
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const readings = loadReadings();
        const readingIndex = readings.findIndex((r) => r.id === id);
        if (readingIndex === -1) {
            return res.status(404).json({ error: 'Reading nicht gefunden' });
        }
        if (readings[readingIndex].user_id !== userId) {
            return res.status(403).json({ error: 'Keine Berechtigung' });
        }
        const updatedReading = {
            ...readings[readingIndex],
            ...req.body,
            updated_at: new Date().toISOString()
        };
        readings[readingIndex] = updatedReading;
        saveReadings(readings);
        res.json(updatedReading);
    }
    catch (error) {
        console.error('[readings] PUT error:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Readings' });
    }
});
// DELETE /readings/:id - Reading löschen
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const readings = loadReadings();
        const readingIndex = readings.findIndex((r) => r.id === id);
        if (readingIndex === -1) {
            return res.status(404).json({ error: 'Reading nicht gefunden' });
        }
        if (readings[readingIndex].user_id !== userId) {
            return res.status(403).json({ error: 'Keine Berechtigung' });
        }
        readings.splice(readingIndex, 1);
        saveReadings(readings);
        res.json({ message: 'Reading erfolgreich gelöscht' });
    }
    catch (error) {
        console.error('[readings] DELETE error:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Readings' });
    }
});
// POST /readings/pdf-enhanced - PDF-verstärktes Reading erstellen
router.post('/pdf-enhanced', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Nicht authentifiziert' });
        }
        const { chartData, scope } = req.body;
        // Validierung
        if (!chartData || !scope) {
            return res.status(400).json({
                error: 'chartData und scope sind erforderlich'
            });
        }
        console.log('📚 PDF-verstärktes Reading wird erstellt...');
        // PDF-basiertes Reading mit erweitertem Wissen
        const content = await generateReadingWithPDFs(chartData, scope);
        const reflectionQuestions = await generateReflectionQuestionsWithPDFs(chartData, scope);
        const newReading = {
            id: Date.now().toString(),
            user_id: userId,
            chart_id: `chart_${Date.now()}`,
            scope,
            content,
            reflection_questions: reflectionQuestions,
            title: `PDF-Reading für ${chartData.name || 'Sie'} - ${scope}`,
            summary: `PDF-verstärktes Reading basierend auf professionellen Human Design Dokumenten für ${scope}`,
            sources: ['HD App PDF Generator', 'Human Design PDFs', 'Professionelle HD Literatur'],
            tags: [scope, 'PDF-verstärkt', 'professionell', 'detailliert'],
            generation_method: 'PDF-enhanced',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        const readings = loadReadings();
        readings.push(newReading);
        saveReadings(readings);
        console.log('✅ PDF-verstärktes Reading erfolgreich erstellt');
        res.status(201).json({
            ...newReading,
            success: true,
            message: 'PDF-verstärktes Reading erfolgreich erstellt'
        });
    }
    catch (error) {
        console.error('❌ Fehler beim Erstellen des PDF-Readings:', error);
        res.status(500).json({
            error: 'Fehler beim Erstellen des PDF-Readings',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// GET /readings/pdf-status - PDF-Integration Status prüfen
router.get('/pdf-status', (req, res) => {
    const status = {
        pdfIntegration: true,
        openaiAvailable: !!process.env.OPENAI_API_KEY,
        features: [
            'PDF-basierte Chart-Analyse',
            'Erweiterte Reflexionsfragen',
            'Professionelle Reading-Generierung',
            'Detaillierte Interpretationen'
        ],
        availableScopes: [
            'Persönlichkeit',
            'Beziehungen',
            'Karriere',
            'Gesundheit',
            'Spiritualität',
            'Entscheidungsfindung'
        ]
    };
    res.json({
        success: true,
        status
    });
});
exports.default = router;
