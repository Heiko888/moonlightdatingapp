"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionAnalysisEngine = void 0;
const openai_1 = __importDefault(require("openai"));
class ReflectionAnalysisEngine {
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    /**
     * Hauptfunktion: Analysiert alle Reflektionen eines Benutzers
     */
    async analyzeReflections(userId, reflections) {
        try {
            console.log(`🔍 Reflektions-Analyse gestartet für Benutzer ${userId}...`);
            if (reflections.length === 0) {
                return this.getEmptyInsights();
            }
            // 1. Muster erkennen
            const patterns = await this.identifyReflectionPatterns(reflections);
            // 2. Entwicklungstrends analysieren
            const growthTrends = await this.analyzeGrowthTrends(reflections);
            // 3. Empfehlungen generieren
            const recommendations = await this.generateRecommendations(patterns, growthTrends);
            // 4. Nächste Schritte definieren
            const nextSteps = await this.generateNextSteps(patterns, growthTrends);
            const insights = {
                patterns,
                growthTrends,
                recommendations,
                nextSteps,
                confidence: this.calculateConfidence(reflections.length, patterns)
            };
            console.log(`✅ Reflektions-Analyse abgeschlossen mit ${insights.confidence}% Vertrauen`);
            return insights;
        }
        catch (error) {
            console.error('❌ Fehler bei der Reflektions-Analyse:', error);
            throw error;
        }
    }
    /**
     * Erkennt Muster in Reflektionen
     */
    async identifyReflectionPatterns(reflections) {
        const prompt = `Analysiere die folgenden Reflektionen und erkenne Muster:

REFLEKTIONEN:
${reflections.map(r => `
Datum: ${r.date.toISOString().split('T')[0]}
Typ: ${r.type}
Stimmung: ${r.mood || 'Nicht angegeben'}
Inhalt: ${r.content}
Tags: ${r.tags?.join(', ') || 'Keine'}
`).join('\n---\n')}

Erkenne folgende Muster:

1. **Wiederkehrende Themen** - Was kommt immer wieder vor?
2. **Emotionale Muster** - Positive, negative und neutrale Emotionen
3. **Wachstumsbereiche** - Wo entwickelt sich der Benutzer?
4. **Herausforderungen** - Was sind wiederkehrende Probleme?
5. **Durchbruch-Momente** - Wann gab es wichtige Erkenntnisse?
6. **Energie-Zyklen** - Wann ist die Energie hoch/niedrig?

Antworte in strukturiertem JSON-Format:
{
  "recurringThemes": ["Thema1", "Thema2"],
  "emotionalPatterns": {
    "positive": ["Emotion1", "Emotion2"],
    "negative": ["Emotion1", "Emotion2"],
    "neutral": ["Emotion1", "Emotion2"]
  },
  "growthAreas": ["Bereich1", "Bereich2"],
  "challenges": ["Herausforderung1", "Herausforderung2"],
  "breakthroughs": ["Durchbruch1", "Durchbruch2"],
  "energyCycles": {
    "high": ["Situation1", "Situation2"],
    "low": ["Situation1", "Situation2"],
    "transitions": ["Übergang1", "Übergang2"]
  }
}`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500,
                temperature: 0.3
            });
            const result = JSON.parse(response.choices[0]?.message?.content || '{}');
            return this.validatePatternAnalysis(result);
        }
        catch (error) {
            console.error('Fehler bei der Mustererkennung:', error);
            return this.getEmptyPatternAnalysis();
        }
    }
    /**
     * Analysiert Entwicklungstrends
     */
    async analyzeGrowthTrends(reflections) {
        // Gruppiere Reflektionen nach Zeiträumen
        const periods = this.groupReflectionsByPeriod(reflections);
        const trends = [];
        for (const [period, periodReflections] of periods.entries()) {
            const prompt = `Analysiere das Wachstum in diesem Zeitraum:

ZEITRAUM: ${period}
ANZAHL REFLEKTIONEN: ${periodReflections.length}

REFLEKTIONEN:
${periodReflections.map(r => `
Datum: ${r.date.toISOString().split('T')[0]}
Typ: ${r.type}
Stimmung: ${r.mood || 'Nicht angegeben'}
Inhalt: ${r.content}
`).join('\n---\n')}

Bewerte:
1. **Gesamtwachstum** (0-100)
2. **Spezifische Bereiche** (z.B. Selbstvertrauen, Beziehungen, Karriere)
3. **Meilensteine** - Wichtige Fortschritte
4. **Rückschläge** - Herausforderungen oder Rückschritte

Antworte in JSON-Format:
{
  "period": "${period}",
  "overallGrowth": 75,
  "specificAreas": {
    "Selbstvertrauen": 80,
    "Beziehungen": 70,
    "Karriere": 85
  },
  "milestones": ["Meilenstein1", "Meilenstein2"],
  "setbacks": ["Rückschlag1", "Rückschlag2"]
}`;
            try {
                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 800,
                    temperature: 0.3
                });
                const trend = JSON.parse(response.choices[0]?.message?.content || '{}');
                trends.push(trend);
            }
            catch (error) {
                console.error(`Fehler bei der Trend-Analyse für ${period}:`, error);
            }
        }
        return trends;
    }
    /**
     * Generiert Empfehlungen basierend auf Mustern
     */
    async generateRecommendations(patterns, growthTrends) {
        const prompt = `Basierend auf der Reflektions-Analyse, erstelle konkrete Empfehlungen:

MUSTER:
${JSON.stringify(patterns, null, 2)}

WACHSTUMSTRENDS:
${JSON.stringify(growthTrends, null, 2)}

Erstelle 5-7 konkrete, umsetzbare Empfehlungen, die:
- Auf den erkannten Mustern basieren
- Das Wachstum unterstützen
- Herausforderungen adressieren
- Praktisch anwendbar sind
- Zur Human Design Philosophie passen

Antworte als JSON-Array mit den Empfehlungen.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1000,
                temperature: 0.6
            });
            const recommendations = JSON.parse(response.choices[0]?.message?.content || '[]');
            return Array.isArray(recommendations) ? recommendations : [];
        }
        catch (error) {
            console.error('Fehler bei der Empfehlungs-Generierung:', error);
            return [
                'Regelmäßige Reflektion fortsetzen',
                'Auf erkannte Muster achten',
                'Wachstumsbereiche gezielt fördern'
            ];
        }
    }
    /**
     * Generiert nächste Schritte
     */
    async generateNextSteps(patterns, growthTrends) {
        const prompt = `Basierend auf der Analyse, definiere konkrete nächste Schritte:

MUSTER:
${JSON.stringify(patterns, null, 2)}

WACHSTUMSTRENDS:
${JSON.stringify(growthTrends, null, 2)}

Erstelle 3-5 konkrete, sofort umsetzbare nächste Schritte, die:
- Auf den aktuellen Mustern aufbauen
- Das Wachstum beschleunigen
- Herausforderungen proaktiv angehen
- Messbar und spezifisch sind

Antworte als JSON-Array mit den nächsten Schritten.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 800,
                temperature: 0.6
            });
            const nextSteps = JSON.parse(response.choices[0]?.message?.content || '[]');
            return Array.isArray(nextSteps) ? nextSteps : [];
        }
        catch (error) {
            console.error('Fehler bei der Nächste-Schritte-Generierung:', error);
            return [
                'Reflektion fortsetzen',
                'Erkannte Muster beobachten',
                'Wachstumsbereiche fokussieren'
            ];
        }
    }
    /**
     * Gruppiert Reflektionen nach Zeiträumen
     */
    groupReflectionsByPeriod(reflections) {
        const periods = new Map();
        // Sortiere nach Datum
        const sortedReflections = reflections.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        // Gruppiere nach Monaten
        for (const reflection of sortedReflections) {
            const date = new Date(reflection.date);
            const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!periods.has(period)) {
                periods.set(period, []);
            }
            periods.get(period).push(reflection);
        }
        return periods;
    }
    /**
     * Validiert Pattern-Analyse
     */
    validatePatternAnalysis(analysis) {
        return {
            recurringThemes: Array.isArray(analysis.recurringThemes) ? analysis.recurringThemes : [],
            emotionalPatterns: {
                positive: Array.isArray(analysis.emotionalPatterns?.positive) ? analysis.emotionalPatterns.positive : [],
                negative: Array.isArray(analysis.emotionalPatterns?.negative) ? analysis.emotionalPatterns.negative : [],
                neutral: Array.isArray(analysis.emotionalPatterns?.neutral) ? analysis.emotionalPatterns.neutral : []
            },
            growthAreas: Array.isArray(analysis.growthAreas) ? analysis.growthAreas : [],
            challenges: Array.isArray(analysis.challenges) ? analysis.challenges : [],
            breakthroughs: Array.isArray(analysis.breakthroughs) ? analysis.breakthroughs : [],
            energyCycles: {
                high: Array.isArray(analysis.energyCycles?.high) ? analysis.energyCycles.high : [],
                low: Array.isArray(analysis.energyCycles?.low) ? analysis.energyCycles.low : [],
                transitions: Array.isArray(analysis.energyCycles?.transitions) ? analysis.energyCycles.transitions : []
            }
        };
    }
    /**
     * Berechnet Vertrauen basierend auf Datenmenge
     */
    calculateConfidence(reflectionCount, patterns) {
        let confidence = 50; // Basis-Vertrauen
        // Mehr Reflektionen = höheres Vertrauen
        if (reflectionCount >= 50)
            confidence += 30;
        else if (reflectionCount >= 20)
            confidence += 20;
        else if (reflectionCount >= 10)
            confidence += 10;
        else if (reflectionCount >= 5)
            confidence += 5;
        // Klare Muster = höheres Vertrauen
        if (patterns.recurringThemes.length >= 3)
            confidence += 10;
        if (patterns.growthAreas.length >= 2)
            confidence += 5;
        if (patterns.breakthroughs.length >= 1)
            confidence += 5;
        return Math.min(100, confidence);
    }
    /**
     * Leere Insights für neue Benutzer
     */
    getEmptyInsights() {
        return {
            patterns: this.getEmptyPatternAnalysis(),
            growthTrends: [],
            recommendations: [
                'Beginne mit regelmäßigen Reflektionen',
                'Achte auf deine Emotionen und Muster',
                'Dokumentiere wichtige Erkenntnisse'
            ],
            nextSteps: [
                'Erste Reflektion schreiben',
                'Tägliche Gewohnheit etablieren',
                'Wachstumsbereiche identifizieren'
            ],
            confidence: 0
        };
    }
    /**
     * Leere Pattern-Analyse
     */
    getEmptyPatternAnalysis() {
        return {
            recurringThemes: [],
            emotionalPatterns: {
                positive: [],
                negative: [],
                neutral: []
            },
            growthAreas: [],
            challenges: [],
            breakthroughs: [],
            energyCycles: {
                high: [],
                low: [],
                transitions: []
            }
        };
    }
}
exports.ReflectionAnalysisEngine = ReflectionAnalysisEngine;
exports.default = new ReflectionAnalysisEngine();
