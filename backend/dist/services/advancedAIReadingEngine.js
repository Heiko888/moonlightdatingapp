"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedAIReadingEngine = void 0;
const openai_1 = __importDefault(require("openai"));
class AdvancedAIReadingEngine {
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.initializeValidationRules();
    }
    initializeValidationRules() {
        this.validationRules = {
            types: ['Generator', 'Manifestor', 'Projector', 'Reflector'],
            profiles: ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'],
            authorities: ['Sacral', 'Splenic', 'Emotional', 'Ego', 'G', 'Self-Projected', 'Lunar', 'None'],
            centers: ['Head', 'Ajna', 'Throat', 'G', 'Heart', 'Solar Plexus', 'Sacral', 'Root', 'Spleen'],
            channels: [
                '1-8', '2-14', '3-60', '4-63', '5-15', '6-59', '7-31', '9-52', '10-20', '10-57',
                '11-56', '12-22', '13-33', '16-48', '17-62', '18-58', '19-49', '20-34', '20-57',
                '21-45', '23-43', '24-61', '25-51', '26-44', '27-50', '28-38', '29-46', '30-41',
                '32-54', '34-57', '35-36', '37-40', '39-55', '42-53', '47-64'
            ],
            gates: Array.from({ length: 64 }, (_, i) => i + 1)
        };
    }
    /**
     * Hauptfunktion: Generiert erweiterte Readings mit Validierung
     */
    async generateAdvancedReading(userProfile, readingType, context) {
        try {
            console.log(`🧠 Erweiterte AI-Reading-Engine gestartet für ${userProfile.name}...`);
            // 1. Chart-Validierung
            const validation = await this.validateChartData(userProfile.chart);
            if (!validation.isValid) {
                throw new Error(`Chart-Validierung fehlgeschlagen: ${validation.errors.join(', ')}`);
            }
            // 2. Persönliche Historie analysieren
            const personalHistory = await this.analyzeUserJourney(userProfile);
            // 3. Verhaltensmuster erkennen
            const behaviorPatterns = await this.identifyPatterns(userProfile);
            // 4. Kontextuelle Reading generieren
            const readingContent = await this.generateContextualReading({
                userProfile,
                readingType,
                context,
                personalHistory,
                behaviorPatterns,
                validation
            });
            // 5. Handlungsplan generieren
            const actionPlan = await this.generateActionPlan(userProfile, readingType, context);
            // 6. Reflektionsfragen generieren
            const reflectionQuestions = await this.generateReflectionQuestions(userProfile, readingType);
            const advancedReading = {
                id: `reading_${Date.now()}_${userProfile.id}`,
                userId: userProfile.id,
                type: readingType,
                content: {
                    overview: readingContent.overview,
                    typeAnalysis: readingContent.typeAnalysis,
                    authority: readingContent.authority,
                    centers: readingContent.centers,
                    channels: readingContent.channels,
                    gates: readingContent.gates,
                    profile: readingContent.profile,
                    practicalApplications: readingContent.practicalApplications,
                    actionPlan: actionPlan,
                    reflectionQuestions: reflectionQuestions
                },
                validation: validation,
                metadata: {
                    generatedAt: new Date(),
                    aiModel: 'gpt-4o',
                    confidence: validation.confidence
                }
            };
            console.log(`✅ Erweiterte Reading erfolgreich generiert mit ${validation.confidence}% Vertrauen`);
            return advancedReading;
        }
        catch (error) {
            console.error('❌ Fehler bei der erweiterten Reading-Generierung:', error);
            throw error;
        }
    }
    /**
     * Chart-Validierung: Überprüft alle Human Design Daten
     */
    async validateChartData(chart) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
        let confidence = 100;
        // Typ-Validierung
        if (!chart.metadata?.type || !this.validationRules.types.includes(chart.metadata.type)) {
            errors.push(`Ungültiger Typ: ${chart.metadata?.type}`);
            confidence -= 20;
        }
        // Profil-Validierung
        if (!chart.metadata?.profile || !this.validationRules.profiles.includes(chart.metadata.profile)) {
            errors.push(`Ungültiges Profil: ${chart.metadata?.profile}`);
            confidence -= 15;
        }
        // Autorität-Validierung
        if (!chart.metadata?.authority || !this.validationRules.authorities.includes(chart.metadata.authority)) {
            errors.push(`Ungültige Autorität: ${chart.metadata?.authority}`);
            confidence -= 15;
        }
        // Zentren-Validierung
        if (chart.centers) {
            const invalidCenters = chart.centers.filter(center => !this.validationRules.centers.includes(center.name));
            if (invalidCenters.length > 0) {
                warnings.push(`Ungültige Zentren gefunden: ${invalidCenters.map(c => c.name).join(', ')}`);
                confidence -= 10;
            }
        }
        // Kanäle-Validierung
        if (chart.channels) {
            const invalidChannels = chart.channels.filter(channel => !this.validationRules.channels.includes(channel.name));
            if (invalidChannels.length > 0) {
                warnings.push(`Ungültige Kanäle gefunden: ${invalidChannels.map(c => c.name).join(', ')}`);
                confidence -= 10;
            }
        }
        // Gates-Validierung
        if (chart.gates) {
            const invalidGates = chart.gates.filter(gate => !this.validationRules.gates.includes(gate.number));
            if (invalidGates.length > 0) {
                warnings.push(`Ungültige Gates gefunden: ${invalidGates.map(g => g.number).join(', ')}`);
                confidence -= 10;
            }
        }
        // Inkarnationskreuz-Validierung
        if (chart.metadata?.incarnationCross) {
            const crossPattern = /^[1-6]\/[1-6]$/;
            if (!crossPattern.test(chart.metadata.incarnationCross)) {
                warnings.push(`Ungültiges Inkarnationskreuz-Format: ${chart.metadata.incarnationCross}`);
                confidence -= 5;
            }
        }
        // Vorschläge generieren
        if (errors.length > 0) {
            suggestions.push('Chart-Daten überprüfen und korrigieren');
        }
        if (warnings.length > 0) {
            suggestions.push('Chart-Berechnung erneut durchführen');
        }
        if (confidence < 80) {
            suggestions.push('Geburtsdaten verifizieren');
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            confidence: Math.max(0, confidence),
            suggestions
        };
    }
    /**
     * Analysiert die persönliche Reise des Benutzers
     */
    async analyzeUserJourney(userProfile) {
        const prompt = `Analysiere die persönliche Reise dieses Benutzers basierend auf seinen bisherigen Readings und Reflektionen:

Benutzer: ${userProfile.name}
Geburtsdaten: ${userProfile.birthDate} ${userProfile.birthTime}, ${userProfile.birthPlace}
Human Design: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}

Bisherige Readings: ${userProfile.readings.length}
Bisherige Reflektionen: ${userProfile.reflections.length}
Bisherige Aktionen: ${userProfile.actions.length}

Erkenne Muster in:
1. Entwicklungstrends
2. Wiederkehrende Themen
3. Erfolgsmuster
4. Herausforderungen
5. Durchbruch-Momente

Antworte in strukturiertem JSON-Format.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1000,
                temperature: 0.3
            });
            return JSON.parse(response.choices[0]?.message?.content || '{}');
        }
        catch (error) {
            console.error('Fehler bei der Reise-Analyse:', error);
            return {};
        }
    }
    /**
     * Erkennt Verhaltensmuster
     */
    async identifyPatterns(userProfile) {
        const prompt = `Identifiziere Verhaltensmuster basierend auf den Benutzerdaten:

Benutzer: ${userProfile.name}
Human Design: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
Autorität: ${userProfile.chart.metadata?.authority}

Analysiere:
1. Entscheidungsmuster
2. Kommunikationsstil
3. Energie-Zyklen
4. Beziehungsmuster
5. Lernstil

Antworte in strukturiertem JSON-Format.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 800,
                temperature: 0.3
            });
            return JSON.parse(response.choices[0]?.message?.content || '{}');
        }
        catch (error) {
            console.error('Fehler bei der Mustererkennung:', error);
            return {};
        }
    }
    /**
     * Generiert kontextuelle Readings
     */
    async generateContextualReading(context) {
        const prompt = `Erstelle ein detailliertes, personalisiertes Human Design Reading:

BENUTZER-PROFIL:
- Name: ${context.userProfile.name}
- Typ: ${context.userProfile.chart.metadata?.type}
- Profil: ${context.userProfile.chart.metadata?.profile}
- Autorität: ${context.userProfile.chart.metadata?.authority}
- Strategie: ${context.userProfile.chart.metadata?.strategy}

CHART-DATEN:
- Definierte Zentren: ${context.userProfile.chart.centers?.map(c => c.name).join(', ')}
- Kanäle: ${context.userProfile.chart.channels?.map(c => c.name).join(', ')}
- Aktive Gates: ${context.userProfile.chart.gates?.map(g => g.number).join(', ')}

PERSÖNLICHE HISTORIE:
${JSON.stringify(context.personalHistory, null, 2)}

VERHALTENSMUSTER:
${JSON.stringify(context.behaviorPatterns, null, 2)}

VALIDIERUNG:
- Vertrauen: ${context.validation.confidence}%
- Warnungen: ${context.validation.warnings.length}

READING-TYP: ${context.readingType}
KONTEXT: ${context.context || 'Allgemein'}

Erstelle ein strukturiertes Reading in deutscher Sprache mit folgenden Abschnitten:

1. **Überblick & Einführung** - Persönliche Begrüßung und Chart-Überblick
2. **Typ & Strategie** - Detaillierte Erklärung mit persönlichen Bezügen
3. **Autorität & Entscheidungsfindung** - Praktische Anleitung basierend auf Mustern
4. **Zentren-Analyse** - Definierte und offene Zentren mit persönlicher Bedeutung
5. **Kanäle & Gates** - Spezifische Talente und Lebensthemen
6. **Profil & Entwicklungsphasen** - Lebensweg und Wachstum
7. **Praktische Anwendungen** - Konkrete Tipps basierend auf Historie
8. **Coaching-Empfehlungen** - Nächste Schritte und Experimente

Das Reading sollte:
- Persönlich und ansprechend sein
- Auf der persönlichen Historie basieren
- Praktisch anwendbar sein
- Ermutigend und motivierend wirken
- Professionell und fundiert sein

Verwende Markdown-Formatierung für bessere Lesbarkeit.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 3000,
                temperature: 0.7
            });
            const content = response.choices[0]?.message?.content || '';
            // Parse das Reading in Abschnitte
            return this.parseReadingContent(content);
        }
        catch (error) {
            console.error('Fehler bei der Reading-Generierung:', error);
            throw error;
        }
    }
    /**
     * Generiert Handlungspläne
     */
    async generateActionPlan(userProfile, readingType, context) {
        const prompt = `Erstelle einen personalisierten Handlungsplan:

BENUTZER: ${userProfile.name}
TYP: ${userProfile.chart.metadata?.type}
AUTORITÄT: ${userProfile.chart.metadata?.authority}
READING-TYP: ${readingType}
KONTEXT: ${context || 'Allgemein'}

Erstelle einen strukturierten Handlungsplan mit:

1. **Sofortige Aktionen** (heute)
2. **Wöchentliche Ziele** (diese Woche)
3. **Monatliche Vision** (diesen Monat)
4. **Langfristiger Pfad** (dieses Jahr)

Jede Aktion sollte:
- Spezifisch und messbar sein
- Zur Human Design Strategie passen
- Realistisch und umsetzbar sein
- Motivation und Klarheit schaffen

Verwende Markdown-Formatierung.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500,
                temperature: 0.6
            });
            return response.choices[0]?.message?.content || '';
        }
        catch (error) {
            console.error('Fehler bei der Handlungsplan-Generierung:', error);
            return 'Handlungsplan konnte nicht generiert werden.';
        }
    }
    /**
     * Generiert Reflektionsfragen
     */
    async generateReflectionQuestions(userProfile, readingType) {
        const prompt = `Erstelle 5-7 personalisierte Reflektionsfragen:

BENUTZER: ${userProfile.name}
TYP: ${userProfile.chart.metadata?.type}
PROFIL: ${userProfile.chart.metadata?.profile}
AUTORITÄT: ${userProfile.chart.metadata?.authority}
READING-TYP: ${readingType}

Die Fragen sollten:
- Tiefe Selbstreflektion fördern
- Zur Human Design Strategie passen
- Praktisch anwendbar sein
- Persönliches Wachstum unterstützen
- Verschiedene Aspekte abdecken

Antworte als JSON-Array mit den Fragen.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 800,
                temperature: 0.5
            });
            const questions = JSON.parse(response.choices[0]?.message?.content || '[]');
            return Array.isArray(questions) ? questions : [];
        }
        catch (error) {
            console.error('Fehler bei der Reflektionsfragen-Generierung:', error);
            return [
                'Wie fühlt sich deine aktuelle Lebenssituation an?',
                'Welche Entscheidungen stehen an?',
                'Wo siehst du dein größtes Wachstumspotential?'
            ];
        }
    }
    /**
     * Parst Reading-Content in strukturierte Abschnitte
     */
    parseReadingContent(content) {
        const sections = {
            overview: '',
            typeAnalysis: '',
            authority: '',
            centers: '',
            channels: '',
            gates: '',
            profile: '',
            practicalApplications: ''
        };
        // Einfache Parsing-Logik (kann erweitert werden)
        const lines = content.split('\n');
        let currentSection = 'overview';
        let currentContent = '';
        for (const line of lines) {
            if (line.includes('**Überblick') || line.includes('**Einführung')) {
                if (currentContent)
                    sections[currentSection] = currentContent.trim();
                currentSection = 'overview';
                currentContent = line + '\n';
            }
            else if (line.includes('**Typ & Strategie')) {
                if (currentContent)
                    sections[currentSection] = currentContent.trim();
                currentSection = 'typeAnalysis';
                currentContent = line + '\n';
            }
            else if (line.includes('**Autorität')) {
                if (currentContent)
                    sections[currentSection] = currentContent.trim();
                currentSection = 'authority';
                currentContent = line + '\n';
            }
            else if (line.includes('**Zentren')) {
                if (currentContent)
                    sections[currentSection] = currentContent.trim();
                currentSection = 'centers';
                currentContent = line + '\n';
            }
            else if (line.includes('**Kanäle')) {
                if (currentContent)
                    sections[currentSection] = currentContent.trim();
                currentSection = 'channels';
                currentContent = line + '\n';
            }
            else if (line.includes('**Profil')) {
                if (currentContent)
                    sections[currentSection] = currentContent.trim();
                currentSection = 'profile';
                currentContent = line + '\n';
            }
            else if (line.includes('**Praktische')) {
                if (currentContent)
                    sections[currentSection] = currentContent.trim();
                currentSection = 'practicalApplications';
                currentContent = line + '\n';
            }
            else {
                currentContent += line + '\n';
            }
        }
        // Letzten Abschnitt hinzufügen
        if (currentContent)
            sections[currentSection] = currentContent.trim();
        return sections;
    }
}
exports.AdvancedAIReadingEngine = AdvancedAIReadingEngine;
exports.default = new AdvancedAIReadingEngine();
