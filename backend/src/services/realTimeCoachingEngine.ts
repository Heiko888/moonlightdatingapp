import OpenAI from 'openai';
import { ChartData } from '../types/chartTypes';

interface UserProfile {
  id: string;
  name: string;
  chart: ChartData;
  currentEnergy: number;
  currentMood: string;
  recentActivities: any[];
  preferences: any;
}

interface CoachingContext {
  timeOfDay: number;
  dayOfWeek: number;
  moonPhase: string;
  weather?: string;
  userLocation?: string;
  recentEvents: string[];
  currentChallenges: string[];
  userGoals: string[];
}

interface CoachingResponse {
  id: string;
  type: 'guidance' | 'encouragement' | 'warning' | 'celebration' | 'reflection';
  message: string;
  actionItems: string[];
  energyRecommendation: string;
  timingAdvice: string;
  hdAlignment: {
    strategy: string;
    authority: string;
    type: string;
  };
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
  followUp?: {
    when: string;
    what: string;
  };
}

interface EnergyAssessment {
  current: number;
  trend: 'rising' | 'stable' | 'falling';
  optimal: number;
  recommendations: string[];
  warnings: string[];
}

export class RealTimeCoachingEngine {
  private openai: OpenAI;
  private coachingHistory: Map<string, CoachingResponse[]> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  /**
   * Hauptfunktion: Echtzeit-Coaching
   */
  async provideRealTimeGuidance(
    userProfile: UserProfile,
    context: CoachingContext,
    userMessage?: string
  ): Promise<CoachingResponse> {
    try {
      console.log(`🤖 Echtzeit-Coaching für ${userProfile.name}...`);

      // 1. Energie bewerten
      const energyAssessment = await this.assessUserEnergy(userProfile, context);
      
      // 2. Kontext analysieren
      const contextAnalysis = await this.analyzeContext(userProfile, context, userMessage);
      
      // 3. Coaching-Response generieren
      const coachingResponse = await this.generateCoachingResponse(
        userProfile,
        context,
        energyAssessment,
        contextAnalysis,
        userMessage
      );

      // 4. Coaching-Historie aktualisieren
      this.updateCoachingHistory(userProfile.id, coachingResponse);

      console.log(`✅ Echtzeit-Coaching erfolgreich generiert`);
      return coachingResponse;

    } catch (error) {
      console.error('❌ Fehler beim Echtzeit-Coaching:', error);
      throw error;
    }
  }

  /**
   * Bewertet die Benutzer-Energie
   */
  private async assessUserEnergy(
    userProfile: UserProfile,
    context: CoachingContext
  ): Promise<EnergyAssessment> {
    const prompt = `Bewerte die Energie dieses Benutzers:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
AKTUELLE ENERGIE: ${userProfile.currentEnergy}/10
AKTUELLE STIMMUNG: ${userProfile.currentMood}

KONTEXT:
- Tageszeit: ${context.timeOfWeek}:00
- Wochentag: ${context.dayOfWeek}
- Mondphase: ${context.moonPhase}
- Letzte Aktivitäten: ${userProfile.recentActivities.map(a => a.title).join(', ')}
- Aktuelle Herausforderungen: ${context.currentChallenges.join(', ')}

Bewerte:
1. **Aktuelle Energie** (0-10)
2. **Energie-Trend** (steigend, stabil, fallend)
3. **Optimale Energie** für diese Tageszeit
4. **Empfehlungen** für Energie-Management
5. **Warnungen** bei niedriger Energie

Antworte in JSON-Format:
{
  "current": 7,
  "trend": "falling",
  "optimal": 8,
  "recommendations": ["Empfehlung1", "Empfehlung2"],
  "warnings": ["Warnung1", "Warnung2"]
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.3
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Fehler bei der Energie-Bewertung:', error);
      return {
        current: userProfile.currentEnergy,
        trend: 'stable',
        optimal: 7,
        recommendations: ['Energie beobachten', 'Pausen einlegen'],
        warnings: []
      };
    }
  }

  /**
   * Analysiert den Kontext
   */
  private async analyzeContext(
    userProfile: UserProfile,
    context: CoachingContext,
    userMessage?: string
  ): Promise<any> {
    const prompt = `Analysiere den aktuellen Kontext:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
AUTORITÄT: ${userProfile.chart.metadata?.authority}

KONTEXT:
- Tageszeit: ${context.timeOfDay}:00
- Wochentag: ${context.dayOfWeek}
- Mondphase: ${context.moonPhase}
- Wetter: ${context.weather || 'Unbekannt'}
- Standort: ${context.userLocation || 'Unbekannt'}

AKTUELLE SITUATION:
- Letzte Ereignisse: ${context.recentEvents.join(', ')}
- Herausforderungen: ${context.currentChallenges.join(', ')}
- Ziele: ${context.userGoals.join(', ')}

BENUTZER-NACHRICHT: ${userMessage || 'Keine Nachricht'}

Analysiere:
1. **Aktuelle Lebenssituation** - Was passiert gerade?
2. **Emotionale Verfassung** - Wie fühlt sich der Benutzer?
3. **Dringlichkeit** - Wie dringend ist Unterstützung?
4. **Coaching-Typ** - Welche Art von Coaching wird benötigt?
5. **Timing** - Ist jetzt der richtige Zeitpunkt?

Antworte in strukturiertem JSON-Format.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.3
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Fehler bei der Kontext-Analyse:', error);
      return {
        situation: 'Allgemein',
        emotionalState: 'Neutral',
        urgency: 'medium',
        coachingType: 'guidance',
        timing: 'appropriate'
      };
    }
  }

  /**
   * Generiert Coaching-Response
   */
  private async generateCoachingResponse(
    userProfile: UserProfile,
    context: CoachingContext,
    energyAssessment: EnergyAssessment,
    contextAnalysis: any,
    userMessage?: string
  ): Promise<CoachingResponse> {
    const prompt = `Erstelle eine personalisierte Coaching-Response:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type} ${userProfile.chart.metadata?.profile}
AUTORITÄT: ${userProfile.chart.metadata?.authority}
STRATEGIE: ${userProfile.chart.metadata?.strategy}

ENERGIE-BEWERTUNG:
- Aktuell: ${energyAssessment.current}/10
- Trend: ${energyAssessment.trend}
- Optimal: ${energyAssessment.optimal}/10

KONTEXT-ANALYSE:
- Situation: ${contextAnalysis.situation}
- Emotionale Verfassung: ${contextAnalysis.emotionalState}
- Dringlichkeit: ${contextAnalysis.urgency}
- Coaching-Typ: ${contextAnalysis.coachingType}

BENUTZER-NACHRICHT: ${userMessage || 'Keine spezifische Nachricht'}

Erstelle eine Coaching-Response mit:

1. **Typ** (guidance, encouragement, warning, celebration, reflection)
2. **Nachricht** - Persönliche, ermutigende Nachricht
3. **Aktionspunkte** - 2-3 konkrete nächste Schritte
4. **Energie-Empfehlung** - Spezifische Energie-Tipps
5. **Timing-Beratung** - Wann was zu tun ist
6. **Human Design Ausrichtung** - Strategie und Autorität
7. **Vertrauen** - Wie sicher ist die Empfehlung
8. **Dringlichkeit** - Wie wichtig ist es
9. **Follow-up** - Wann und was als nächstes

Die Response sollte:
- Persönlich und warm sein
- Zur Human Design Strategie passen
- Praktisch und umsetzbar sein
- Ermutigend und motivierend wirken
- Den aktuellen Kontext berücksichtigen

Antworte in strukturiertem JSON-Format.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.7
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{}');
      return this.validateCoachingResponse(result, userProfile);
    } catch (error) {
      console.error('Fehler bei der Coaching-Response-Generierung:', error);
      return this.getDefaultCoachingResponse(userProfile);
    }
  }

  /**
   * Generiert proaktive Coaching-Nachrichten
   */
  async generateProactiveCoaching(
    userProfile: UserProfile,
    context: CoachingContext
  ): Promise<CoachingResponse | null> {
    try {
      // Prüfe, ob proaktives Coaching benötigt wird
      const needsCoaching = await this.assessCoachingNeed(userProfile, context);
      
      if (!needsCoaching.shouldCoach) {
        return null;
      }

      return await this.provideRealTimeGuidance(userProfile, context);
    } catch (error) {
      console.error('Fehler beim proaktiven Coaching:', error);
      return null;
    }
  }

  /**
   * Bewertet, ob Coaching benötigt wird
   */
  private async assessCoachingNeed(
    userProfile: UserProfile,
    context: CoachingContext
  ): Promise<{ shouldCoach: boolean; reason: string; urgency: string }> {
    const prompt = `Bewerte, ob proaktives Coaching benötigt wird:

BENUTZER: ${userProfile.name}
HUMAN DESIGN: ${userProfile.chart.metadata?.type}
AKTUELLE ENERGIE: ${userProfile.currentEnergy}/10
STIMMUNG: ${userProfile.currentMood}

KONTEXT:
- Tageszeit: ${context.timeOfDay}:00
- Herausforderungen: ${context.currentChallenges.join(', ')}
- Ziele: ${context.userGoals.join(', ')}

Bewerte:
1. **Sollte Coaching angeboten werden?** (ja/nein)
2. **Grund** - Warum oder warum nicht?
3. **Dringlichkeit** - Wie dringend ist es?

Antworte in JSON-Format:
{
  "shouldCoach": true/false,
  "reason": "Grund für die Entscheidung",
  "urgency": "low/medium/high"
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.3
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Fehler bei der Coaching-Bewertung:', error);
      return {
        shouldCoach: false,
        reason: 'Fehler bei der Bewertung',
        urgency: 'low'
      };
    }
  }

  /**
   * Validiert Coaching-Response
   */
  private validateCoachingResponse(response: any, userProfile: UserProfile): CoachingResponse {
    return {
      id: `coaching_${Date.now()}_${userProfile.id}`,
      type: response.type || 'guidance',
      message: response.message || 'Ich bin hier, um dich zu unterstützen.',
      actionItems: Array.isArray(response.actionItems) ? response.actionItems : [],
      energyRecommendation: response.energyRecommendation || 'Achte auf deine Energie.',
      timingAdvice: response.timingAdvice || 'Folge deiner inneren Autorität.',
      hdAlignment: {
        strategy: response.hdAlignment?.strategy || userProfile.chart.metadata?.strategy || '',
        authority: response.hdAlignment?.authority || userProfile.chart.metadata?.authority || '',
        type: response.hdAlignment?.type || userProfile.chart.metadata?.type || ''
      },
      confidence: response.confidence || 70,
      urgency: response.urgency || 'medium',
      followUp: response.followUp || undefined
    };
  }

  /**
   * Standard Coaching-Response
   */
  private getDefaultCoachingResponse(userProfile: UserProfile): CoachingResponse {
    return {
      id: `coaching_default_${Date.now()}_${userProfile.id}`,
      type: 'guidance',
      message: `Hallo ${userProfile.name}, ich bin hier, um dich zu unterstützen. Wie kann ich dir heute helfen?`,
      actionItems: [
        'Atme tief durch und komme im Moment an',
        'Überprüfe deine aktuelle Energie',
        'Wähle eine kleine, erfüllende Aktion'
      ],
      energyRecommendation: 'Achte auf deine Energie und nimm Pausen, wenn nötig.',
      timingAdvice: 'Folge deiner inneren Autorität und deiner Human Design Strategie.',
      hdAlignment: {
        strategy: userProfile.chart.metadata?.strategy || '',
        authority: userProfile.chart.metadata?.authority || '',
        type: userProfile.chart.metadata?.type || ''
      },
      confidence: 50,
      urgency: 'low'
    };
  }

  /**
   * Aktualisiert Coaching-Historie
   */
  private updateCoachingHistory(userId: string, response: CoachingResponse): void {
    if (!this.coachingHistory.has(userId)) {
      this.coachingHistory.set(userId, []);
    }
    
    const history = this.coachingHistory.get(userId)!;
    history.push(response);
    
    // Behalte nur die letzten 50 Einträge
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
  }

  /**
   * Holt Coaching-Historie
   */
  getCoachingHistory(userId: string): CoachingResponse[] {
    return this.coachingHistory.get(userId) || [];
  }

  /**
   * Analysiert Coaching-Effektivität
   */
  async analyzeCoachingEffectiveness(userId: string): Promise<{
    effectiveness: number;
    patterns: string[];
    improvements: string[];
  }> {
    const history = this.getCoachingHistory(userId);
    
    if (history.length === 0) {
      return {
        effectiveness: 0,
        patterns: [],
        improvements: ['Mehr Coaching-Interaktionen sammeln']
      };
    }

    const prompt = `Analysiere die Coaching-Effektivität:

COACHING-HISTORIE:
${history.map(h => `
- Typ: ${h.type}
- Nachricht: ${h.message}
- Vertrauen: ${h.confidence}%
- Dringlichkeit: ${h.urgency}
`).join('\n')}

Bewerte:
1. **Effektivität** (0-100%)
2. **Muster** - Was funktioniert gut?
3. **Verbesserungen** - Was könnte besser werden?

Antworte in JSON-Format.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.3
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Fehler bei der Effektivitäts-Analyse:', error);
      return {
        effectiveness: 70,
        patterns: ['Konsistente Unterstützung'],
        improvements: ['Weitere Personalisierung']
      };
    }
  }
}

export default new RealTimeCoachingEngine();
