"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptiveActionEngine = void 0;
const openai_1 = __importDefault(require("openai"));
class AdaptiveActionEngine {
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    /**
     * Hauptfunktion: Generiert adaptive Handlungsaufrufe
     */
    async generateActionPlan(userProfile, context, focusArea) {
        try {
            console.log(`🎯 Adaptive Handlungsaufrufe generiert für ${userProfile.name}...`);
            // 1. Erfolgsmuster analysieren
            const successPatterns = await this.analyzeSuccessPatterns(userProfile);
            // 2. Aktuelle Situation bewerten
            const situationAnalysis = await this.analyzeCurrentSituation(userProfile, context);
            // 3. Handlungsplan generieren
            const actionPlan = await this.generateContextualActions(userProfile, context, successPatterns, situationAnalysis, focusArea);
            console.log(`✅ Handlungsplan erfolgreich generiert`);
            return actionPlan;
        }
        catch (error) {
            console.error('❌ Fehler bei der Handlungsplan-Generierung:', error);
            throw error;
        }
    }
    /**
     * Analysiert Erfolgsmuster des Benutzers
     */
    async analyzeSuccessPatterns(userProfile) {
        const prompt = `Analysiere die Erfolgsmuster dieses Benutzers:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
AUTORITÄT: ${userProfile.chart.metadata?.authority}

ERFOLGREICHE AKTIONEN:
${userProfile.actions.filter(a => a.success === true).map(a => `
- ${a.title}: ${a.description}
- Datum: ${a.date}
- Kontext: ${a.context}
`).join('\n')}

DURCHBRUCH-MOMENTE:
${userProfile.successPatterns.map(p => `
- ${p.title}: ${p.description}
- Datum: ${p.date}
- Auslöser: ${p.trigger}
`).join('\n')}

Erkenne Muster in:
1. **Erfolgreiche Aktionen** - Was funktioniert gut?
2. **Optimale Zeiten** - Wann ist der Benutzer am produktivsten?
3. **Erfolgreiche Strategien** - Welche Ansätze funktionieren?
4. **Energie-Muster** - Wann hat der Benutzer die meiste Energie?
5. **Entscheidungsmuster** - Wie trifft der Benutzer erfolgreiche Entscheidungen?

Antworte in strukturiertem JSON-Format.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1200,
                temperature: 0.3
            });
            return JSON.parse(response.choices[0]?.message?.content || '{}');
        }
        catch (error) {
            console.error('Fehler bei der Erfolgsmuster-Analyse:', error);
            return {};
        }
    }
    /**
     * Analysiert die aktuelle Situation
     */
    async analyzeCurrentSituation(userProfile, context) {
        const prompt = `Analysiere die aktuelle Situation:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
AUTORITÄT: ${userProfile.chart.metadata?.authority}

AKTUELLER KONTEXT:
- Tageszeit: ${context.timeOfDay}:00
- Wochentag: ${context.dayOfWeek}
- Mondphase: ${context.moonPhase}
- Benutzer-Energie: ${context.userEnergy}/10
- Aktuelle Herausforderungen: ${context.currentChallenges.join(', ')}
- Letzte Durchbrüche: ${context.recentBreakthroughs.join(', ')}
- Lebensphase: ${context.lifePhase}

Bewerte:
1. **Energie-Level** - Wie ist die aktuelle Energie?
2. **Fokus-Bereich** - Worauf sollte sich der Benutzer konzentrieren?
3. **Herausforderungen** - Was blockiert den Benutzer?
4. **Möglichkeiten** - Welche Chancen gibt es?
5. **Empfohlene Strategie** - Welche Human Design Strategie passt?

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
            console.error('Fehler bei der Situations-Analyse:', error);
            return {};
        }
    }
    /**
     * Generiert kontextuelle Aktionen
     */
    async generateContextualActions(userProfile, context, successPatterns, situationAnalysis, focusArea) {
        const prompt = `Erstelle einen personalisierten Handlungsplan:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
AUTORITÄT: ${userProfile.chart.metadata?.authority}
STRATEGIE: ${userProfile.chart.metadata?.strategy}

ERFOLGSMUSTER:
${JSON.stringify(successPatterns, null, 2)}

AKTUELLE SITUATION:
${JSON.stringify(situationAnalysis, null, 2)}

KONTEXT:
- Tageszeit: ${context.timeOfDay}:00
- Energie: ${context.userEnergy}/10
- Fokus-Bereich: ${focusArea || 'Allgemein'}

Erstelle einen strukturierten Handlungsplan mit:

**SOFORTIGE AKTIONEN:**
- Heute: 3-5 konkrete Aktionen für heute
- Nächste 3 Stunden: 2-3 Aktionen für die nächsten Stunden

**KURZFRISTIG:**
- Diese Woche: 5-7 wöchentliche Ziele
- Nächste 3 Tage: 3-4 Aktionen für die nächsten Tage

**MITTELFRISTIG:**
- Dieser Monat: 4-6 monatliche Ziele
- Nächste 2 Wochen: 3-4 Aktionen für die nächsten Wochen

**LANGZEIT:**
- Dieses Jahr: 3-5 Jahresziele
- Nächste 3 Monate: 3-4 Aktionen für die nächsten Monate

**NOTFALL-PLAN:**
- Niedrige Energie: 3 Aktionen bei Energielosigkeit
- Hoher Stress: 3 Aktionen bei Stress
- Verwirrung: 3 Aktionen bei Unklarheit

Jede Aktion sollte:
- Spezifisch und messbar sein
- Zur Human Design Strategie passen
- Auf Erfolgsmustern basieren
- Realistisch und umsetzbar sein
- Motivation schaffen

Antworte in strukturiertem JSON-Format.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 2500,
                temperature: 0.6
            });
            const result = JSON.parse(response.choices[0]?.message?.content || '{}');
            return this.validateActionPlan(result);
        }
        catch (error) {
            console.error('Fehler bei der Aktions-Generierung:', error);
            return this.getDefaultActionPlan();
        }
    }
    /**
     * Generiert spezifische Handlungsempfehlungen
     */
    async generateSpecificRecommendations(userProfile, context, situation) {
        const prompt = `Erstelle spezifische Handlungsempfehlungen für diese Situation:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
AUTORITÄT: ${userProfile.chart.metadata?.authority}

SITUATION: ${situation}
KONTEXT: ${JSON.stringify(context, null, 2)}

Erstelle 5-7 konkrete Handlungsempfehlungen mit:

- Titel (kurz und prägnant)
- Beschreibung (was genau zu tun ist)
- Typ (energy, decision, communication, growth, rest, connection)
- Priorität (low, medium, high, urgent)
- Geschätzte Zeit (in Minuten)
- Schwierigkeit (easy, medium, hard)
- Human Design Ausrichtung
- Erfolgswahrscheinlichkeit (0-100%)

Antworte in strukturiertem JSON-Array-Format.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500,
                temperature: 0.6
            });
            const recommendations = JSON.parse(response.choices[0]?.message?.content || '[]');
            return Array.isArray(recommendations) ? recommendations : [];
        }
        catch (error) {
            console.error('Fehler bei der Empfehlungs-Generierung:', error);
            return [];
        }
    }
    /**
     * Validiert Action Plan
     */
    validateActionPlan(plan) {
        return {
            immediate: {
                today: Array.isArray(plan.immediate?.today) ? plan.immediate.today : [],
                next3Hours: Array.isArray(plan.immediate?.next3Hours) ? plan.immediate.next3Hours : []
            },
            shortTerm: {
                thisWeek: Array.isArray(plan.shortTerm?.thisWeek) ? plan.shortTerm.thisWeek : [],
                next3Days: Array.isArray(plan.shortTerm?.next3Days) ? plan.shortTerm.next3Days : []
            },
            mediumTerm: {
                thisMonth: Array.isArray(plan.mediumTerm?.thisMonth) ? plan.mediumTerm.thisMonth : [],
                next2Weeks: Array.isArray(plan.mediumTerm?.next2Weeks) ? plan.mediumTerm.next2Weeks : []
            },
            longTerm: {
                thisYear: Array.isArray(plan.longTerm?.thisYear) ? plan.longTerm.thisYear : [],
                next3Months: Array.isArray(plan.longTerm?.next3Months) ? plan.longTerm.next3Months : []
            },
            emergency: {
                lowEnergy: Array.isArray(plan.emergency?.lowEnergy) ? plan.emergency.lowEnergy : [],
                highStress: Array.isArray(plan.emergency?.highStress) ? plan.emergency.highStress : [],
                confusion: Array.isArray(plan.emergency?.confusion) ? plan.emergency.confusion : []
            }
        };
    }
    /**
     * Standard Action Plan für Fehlerfälle
     */
    getDefaultActionPlan() {
        return {
            immediate: {
                today: [
                    'Atme tief durch und komme im Moment an',
                    'Überprüfe deine aktuelle Energie',
                    'Wähle eine kleine, erfüllende Aktion'
                ],
                next3Hours: [
                    'Kurze Pause einlegen',
                    'Energie-Level bewerten'
                ]
            },
            shortTerm: {
                thisWeek: [
                    'Regelmäßige Reflektion etablieren',
                    'Energie-Muster beobachten',
                    'Kleine Erfolge feiern'
                ],
                next3Days: [
                    'Tägliche Gewohnheit etablieren',
                    'Herausforderungen identifizieren'
                ]
            },
            mediumTerm: {
                thisMonth: [
                    'Wachstumsbereiche fokussieren',
                    'Unterstützende Routinen entwickeln'
                ],
                next2Weeks: [
                    'Fortschritt dokumentieren',
                    'Anpassungen vornehmen'
                ]
            },
            longTerm: {
                thisYear: [
                    'Langfristige Vision entwickeln',
                    'Nachhaltige Gewohnheiten etablieren'
                ],
                next3Months: [
                    'Zwischenziele definieren',
                    'Unterstützung suchen'
                ]
            },
            emergency: {
                lowEnergy: [
                    'Ruhe und Erholung priorisieren',
                    'Energie-sparende Aktivitäten wählen',
                    'Unterstützung annehmen'
                ],
                highStress: [
                    'Atemübungen machen',
                    'Prioritäten reduzieren',
                    'Grenzen setzen'
                ],
                confusion: [
                    'Zurück zu den Basics gehen',
                    'Einfache Entscheidungen treffen',
                    'Unterstützung suchen'
                ]
            }
        };
    }
    /**
     * Bewertet den Erfolg von Aktionen
     */
    async evaluateActionSuccess(action, outcome, userFeedback) {
        const prompt = `Bewerte den Erfolg dieser Aktion:

AKTION: ${action.title}
BESCHREIBUNG: ${action.description}
ERWARTETE ZEIT: ${action.estimatedTime} Minuten
SCHWIERIGKEIT: ${action.difficulty}
ERFOLGSWAHRSCHEINLICHKEIT: ${action.successProbability}%

ERGEBNIS: ${outcome}
BENUTZER-FEEDBACK: ${userFeedback}/10

Bewerte:
1. **Erfolg** - War die Aktion erfolgreich?
2. **Erkenntnisse** - Was wurde gelernt?
3. **Verbesserungen** - Was könnte besser gemacht werden?

Antworte in JSON-Format:
{
  "success": true/false,
  "insights": ["Erkenntnis1", "Erkenntnis2"],
  "improvements": ["Verbesserung1", "Verbesserung2"]
}`;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 600,
                temperature: 0.3
            });
            return JSON.parse(response.choices[0]?.message?.content || '{}');
        }
        catch (error) {
            console.error('Fehler bei der Aktions-Bewertung:', error);
            return {
                success: userFeedback >= 7,
                insights: ['Aktion wurde durchgeführt'],
                improvements: ['Weitere Optimierung möglich']
            };
        }
    }
}
exports.AdaptiveActionEngine = AdaptiveActionEngine;
exports.default = new AdaptiveActionEngine();
