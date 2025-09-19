import OpenAI from 'openai';
import { ChartData } from '../types/chartTypes';

interface UserProfile {
  id: string;
  name: string;
  chart: ChartData;
  readings: any[];
  reflections: any[];
  actions: any[];
  lifeEvents: any[];
  currentAge: number;
}

interface LifePhase {
  name: string;
  ageRange: string;
  description: string;
  challenges: string[];
  opportunities: string[];
  recommendations: string[];
  confidence: number;
}

interface Prediction {
  type: 'challenge' | 'opportunity' | 'transition' | 'breakthrough';
  title: string;
  description: string;
  timeframe: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  preparation: string[];
  signs: string[];
  hdAlignment: {
    type: string;
    strategy: string;
    authority: string;
  };
}

interface RelationshipCycle {
  phase: 'attraction' | 'harmony' | 'challenge' | 'growth' | 'transformation';
  description: string;
  duration: string;
  characteristics: string[];
  advice: string[];
}

interface PredictiveAnalysis {
  lifePhases: LifePhase[];
  upcomingChallenges: Prediction[];
  upcomingOpportunities: Prediction[];
  relationshipCycles: RelationshipCycle[];
  optimalTiming: {
    decisions: string[];
    actions: string[];
    rest: string[];
  };
  warnings: string[];
  recommendations: string[];
  confidence: number;
}

export class PredictiveAnalyticsEngine {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  /**
   * Hauptfunktion: Predictive Analytics
   */
  async analyzeLifePhases(userProfile: UserProfile): Promise<PredictiveAnalysis> {
    try {
      console.log(`🔮 Predictive Analytics für ${userProfile.name}...`);

      // 1. Lebensphasen analysieren
      const lifePhases = await this.analyzeLifePhases(userProfile);
      
      // 2. Herausforderungen vorhersagen
      const upcomingChallenges = await this.predictChallenges(userProfile);
      
      // 3. Möglichkeiten vorhersagen
      const upcomingOpportunities = await this.predictOpportunities(userProfile);
      
      // 4. Beziehungszyklen analysieren
      const relationshipCycles = await this.analyzeRelationshipCycles(userProfile);
      
      // 5. Optimales Timing bestimmen
      const optimalTiming = await this.determineOptimalTiming(userProfile);
      
      // 6. Warnungen und Empfehlungen
      const warnings = await this.generateWarnings(userProfile, upcomingChallenges);
      const recommendations = await this.generateRecommendations(userProfile, upcomingOpportunities);

      const analysis: PredictiveAnalysis = {
        lifePhases,
        upcomingChallenges,
        upcomingOpportunities,
        relationshipCycles,
        optimalTiming,
        warnings,
        recommendations,
        confidence: this.calculateConfidence(userProfile)
      };

      console.log(`✅ Predictive Analytics abgeschlossen mit ${analysis.confidence}% Vertrauen`);
      return analysis;

    } catch (error) {
      console.error('❌ Fehler bei der Predictive Analytics:', error);
      throw error;
    }
  }

  /**
   * Analysiert Lebensphasen
   */
  private async analyzeLifePhases(userProfile: UserProfile): Promise<LifePhase[]> {
    const prompt = `Analysiere die Lebensphasen für diesen Benutzer:

BENUTZER: ${userProfile.name}
ALTER: ${userProfile.currentAge} Jahre
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
AUTORITÄT: ${userProfile.chart.metadata?.authority}

LEBENSEREIGNISSE:
${userProfile.lifeEvents.map(e => `
- ${e.title}: ${e.description} (Alter ${e.age})
- Typ: ${e.type}
- Auswirkung: ${e.impact}
`).join('\n')}

Bisherige Readings: ${userProfile.readings.length}
Bisherige Reflektionen: ${userProfile.reflections.length}

Analysiere die Lebensphasen:

1. **Aktuelle Phase** (${userProfile.currentAge} Jahre)
2. **Nächste Phase** (${userProfile.currentAge + 5} Jahre)
3. **Langfristige Phase** (${userProfile.currentAge + 10} Jahre)

Für jede Phase:
- Name und Altersbereich
- Beschreibung der Phase
- Herausforderungen
- Möglichkeiten
- Empfehlungen
- Vertrauen (0-100%)

Antworte in strukturiertem JSON-Format.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '[]');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Fehler bei der Lebensphasen-Analyse:', error);
      return [];
    }
  }

  /**
   * Vorhersage von Herausforderungen
   */
  private async predictChallenges(userProfile: UserProfile): Promise<Prediction[]> {
    const prompt = `Vorhersage von Herausforderungen für diesen Benutzer:

BENUTZER: ${userProfile.name}
ALTER: ${userProfile.currentAge} Jahre
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}

BISHERIGE HERAUSFORDERUNGEN:
${userProfile.reflections.filter(r => r.type === 'challenge').map(r => `
- ${r.title}: ${r.description}
- Datum: ${r.date}
- Auswirkung: ${r.impact}
`).join('\n')}

LEBENSEREIGNISSE:
${userProfile.lifeEvents.map(e => `
- ${e.title}: ${e.description} (Alter ${e.age})
`).join('\n')}

Vorhersage 3-5 mögliche Herausforderungen in den nächsten 2 Jahren:

1. **Typ** (challenge, transition, breakthrough)
2. **Titel** - Kurze Beschreibung
3. **Beschreibung** - Detaillierte Erklärung
4. **Zeitrahmen** - Wann könnte es passieren?
5. **Wahrscheinlichkeit** (0-100%)
6. **Auswirkung** (low, medium, high)
7. **Vorbereitung** - Wie kann man sich vorbereiten?
8. **Anzeichen** - Worauf sollte man achten?
9. **Human Design Ausrichtung** - Wie passt es zur Strategie?

Antworte in strukturiertem JSON-Array-Format.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '[]');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Fehler bei der Herausforderungs-Vorhersage:', error);
      return [];
    }
  }

  /**
   * Vorhersage von Möglichkeiten
   */
  private async predictOpportunities(userProfile: UserProfile): Promise<Prediction[]> {
    const prompt = `Vorhersage von Möglichkeiten für diesen Benutzer:

BENUTZER: ${userProfile.name}
ALTER: ${userProfile.currentAge} Jahre
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}

BISHERIGE ERFOLGE:
${userProfile.actions.filter(a => a.success === true).map(a => `
- ${a.title}: ${a.description}
- Datum: ${a.date}
- Auswirkung: ${a.impact}
`).join('\n')}

DURCHBRUCH-MOMENTE:
${userProfile.reflections.filter(r => r.type === 'breakthrough').map(r => `
- ${r.title}: ${r.description}
- Datum: ${r.date}
`).join('\n')}

Vorhersage 3-5 mögliche Möglichkeiten in den nächsten 2 Jahren:

1. **Typ** (opportunity, breakthrough, growth)
2. **Titel** - Kurze Beschreibung
3. **Beschreibung** - Detaillierte Erklärung
4. **Zeitrahmen** - Wann könnte es passieren?
5. **Wahrscheinlichkeit** (0-100%)
6. **Auswirkung** (low, medium, high)
7. **Vorbereitung** - Wie kann man sich vorbereiten?
8. **Anzeichen** - Worauf sollte man achten?
9. **Human Design Ausrichtung** - Wie passt es zur Strategie?

Antworte in strukturiertem JSON-Array-Format.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '[]');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Fehler bei der Möglichkeiten-Vorhersage:', error);
      return [];
    }
  }

  /**
   * Analysiert Beziehungszyklen
   */
  private async analyzeRelationshipCycles(userProfile: UserProfile): Promise<RelationshipCycle[]> {
    const prompt = `Analysiere die Beziehungszyklen für diesen Benutzer:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
AUTORITÄT: ${userProfile.chart.metadata?.authority}

BEZIEHUNGSERFAHRUNGEN:
${userProfile.lifeEvents.filter(e => e.type === 'relationship').map(e => `
- ${e.title}: ${e.description}
- Alter: ${e.age}
- Auswirkung: ${e.impact}
`).join('\n')}

Analysiere die Beziehungszyklen:

1. **Anziehung** - Phase der ersten Anziehung
2. **Harmonie** - Phase der Harmonie und Verbindung
3. **Herausforderung** - Phase der Konflikte und Wachstum
4. **Wachstum** - Phase des gemeinsamen Wachstums
5. **Transformation** - Phase der tiefen Transformation

Für jeden Zyklus:
- Beschreibung der Phase
- Typische Dauer
- Charakteristika
- Ratschläge

Antworte in strukturiertem JSON-Array-Format.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '[]');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Fehler bei der Beziehungszyklen-Analyse:', error);
      return [];
    }
  }

  /**
   * Bestimmt optimales Timing
   */
  private async determineOptimalTiming(userProfile: UserProfile): Promise<{
    decisions: string[];
    actions: string[];
    rest: string[];
  }> {
    const prompt = `Bestimme das optimale Timing für diesen Benutzer:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
AUTORITÄT: ${userProfile.chart.metadata?.authority}

ENERGIE-MUSTER:
${userProfile.reflections.map(r => `
- Datum: ${r.date}
- Energie: ${r.energy || 'Nicht angegeben'}
- Stimmung: ${r.mood || 'Nicht angegeben'}
`).join('\n')}

Bestimme das optimale Timing für:

1. **Entscheidungen** - Wann sollte der Benutzer wichtige Entscheidungen treffen?
2. **Aktionen** - Wann sollte der Benutzer handeln?
3. **Ruhe** - Wann sollte der Benutzer sich ausruhen?

Berücksichtige:
- Human Design Strategie
- Autorität
- Energie-Muster
- Lebensphase
- Mondzyklen

Antworte in JSON-Format:
{
  "decisions": ["Timing1", "Timing2"],
  "actions": ["Timing1", "Timing2"],
  "rest": ["Timing1", "Timing2"]
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.4
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Fehler bei der Timing-Bestimmung:', error);
      return {
        decisions: ['Folge deiner inneren Autorität'],
        actions: ['Handele entsprechend deiner Strategie'],
        rest: ['Ruhe dich aus, wenn nötig']
      };
    }
  }

  /**
   * Generiert Warnungen
   */
  private async generateWarnings(
    userProfile: UserProfile,
    challenges: Prediction[]
  ): Promise<string[]> {
    const prompt = `Generiere Warnungen basierend auf den vorhergesagten Herausforderungen:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}

VORHERGESAGTE HERAUSFORDERUNGEN:
${challenges.map(c => `
- ${c.title}: ${c.description}
- Zeitrahmen: ${c.timeframe}
- Wahrscheinlichkeit: ${c.probability}%
- Auswirkung: ${c.impact}
`).join('\n')}

Generiere 3-5 konkrete Warnungen, die:
- Auf den Vorhersagen basieren
- Proaktiv sind
- Praktisch anwendbar sind
- Zur Human Design Strategie passen

Antworte als JSON-Array mit den Warnungen.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.4
      });

      const warnings = JSON.parse(response.choices[0]?.message?.content || '[]');
      return Array.isArray(warnings) ? warnings : [];
    } catch (error) {
      console.error('Fehler bei der Warnungs-Generierung:', error);
      return [
        'Achte auf deine Energie und nimm Pausen, wenn nötig',
        'Folge deiner inneren Autorität bei Entscheidungen',
        'Beobachte deine Muster und passe dich an'
      ];
    }
  }

  /**
   * Generiert Empfehlungen
   */
  private async generateRecommendations(
    userProfile: UserProfile,
    opportunities: Prediction[]
  ): Promise<string[]> {
    const prompt = `Generiere Empfehlungen basierend auf den vorhergesagten Möglichkeiten:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}

VORHERGESAGTE MÖGLICHKEITEN:
${opportunities.map(o => `
- ${o.title}: ${o.description}
- Zeitrahmen: ${o.timeframe}
- Wahrscheinlichkeit: ${o.probability}%
- Auswirkung: ${o.impact}
`).join('\n')}

Generiere 5-7 konkrete Empfehlungen, die:
- Auf den Vorhersagen basieren
- Proaktiv sind
- Praktisch anwendbar sind
- Zur Human Design Strategie passen
- Das Wachstum fördern

Antworte als JSON-Array mit den Empfehlungen.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.4
      });

      const recommendations = JSON.parse(response.choices[0]?.message?.content || '[]');
      return Array.isArray(recommendations) ? recommendations : [];
    } catch (error) {
      console.error('Fehler bei der Empfehlungs-Generierung:', error);
      return [
        'Nutze deine Human Design Strategie für Entscheidungen',
        'Folge deiner inneren Autorität',
        'Entwickle dich kontinuierlich weiter',
        'Baue unterstützende Beziehungen auf',
        'Feiere deine Erfolge'
      ];
    }
  }

  /**
   * Berechnet Vertrauen basierend auf Datenmenge
   */
  private calculateConfidence(userProfile: UserProfile): number {
    let confidence = 30; // Basis-Vertrauen

    // Mehr Daten = höheres Vertrauen
    if (userProfile.readings.length >= 10) confidence += 20;
    else if (userProfile.readings.length >= 5) confidence += 15;
    else if (userProfile.readings.length >= 3) confidence += 10;

    if (userProfile.reflections.length >= 20) confidence += 20;
    else if (userProfile.reflections.length >= 10) confidence += 15;
    else if (userProfile.reflections.length >= 5) confidence += 10;

    if (userProfile.lifeEvents.length >= 10) confidence += 15;
    else if (userProfile.lifeEvents.length >= 5) confidence += 10;
    else if (userProfile.lifeEvents.length >= 3) confidence += 5;

    // Alter berücksichtigen (mehr Lebenserfahrung = höheres Vertrauen)
    if (userProfile.currentAge >= 40) confidence += 10;
    else if (userProfile.currentAge >= 30) confidence += 5;

    return Math.min(100, confidence);
  }
}

export default new PredictiveAnalyticsEngine();
