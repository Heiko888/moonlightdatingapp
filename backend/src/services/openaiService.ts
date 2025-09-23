import OpenAI from 'openai';
import FallbackService from './fallbackService';
import APIKeyManager from '../utils/apiKeyManager';

interface OpenAIServiceConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

class OpenAIService {
  private client: OpenAI | null = null;
  private config: OpenAIServiceConfig;
  private isAPIKeyValid: boolean = false;

  constructor(config: OpenAIServiceConfig) {
    this.config = config;
    this.initializeClient();
  }

  private initializeClient() {
    const keyStatus = APIKeyManager.getAPIKeyStatus();
    this.isAPIKeyValid = keyStatus.isValid && !keyStatus.isDemo;
    
    if (this.isAPIKeyValid) {
      this.client = new OpenAI({
        apiKey: this.config.apiKey,
      });
      console.log('✅ OpenAI Client initialisiert');
    } else {
      console.log('⚠️ OpenAI API Key nicht verfügbar - Fallback-Modus aktiviert');
      console.log(`Status: ${keyStatus.message}`);
    }
  }

  // Human Design Chart-Berechnung mit PDF-Wissen
  async calculateHumanDesignChartWithPDFs(birthData: {
    birth_date: string;
    birth_time: string;
    birth_place: string;
    name?: string;
    email?: string;
  }) {
    // Fallback wenn API Key nicht verfügbar
    if (!this.isAPIKeyValid || !this.client) {
      console.log('🔄 Verwende Fallback für Chart-Berechnung');
      return FallbackService.analyzeChartFallback({
        type: 'Generator',
        profile: '1/3',
        authority: 'Sacral',
        strategy: 'To Respond',
        notSelf: 'Frustration'
      });
    }
    try {
      const systemPrompt = `Du bist ein erfahrener Human Design Experte mit Zugang zu umfangreichen PDF-Dokumenten über Human Design. 
      
      Deine Aufgabe ist es, basierend auf den Geburtsdaten eine detaillierte Human Design Chart-Analyse zu erstellen.
      
      Verwende das Wissen aus den hochgeladenen PDFs, um eine tiefgründige und professionelle Analyse zu erstellen.
      
      Die Analyse sollte enthalten:
      1. Typ (Generator, Manifestor, Projector, Reflector)
      2. Strategie
      3. Autorität
      4. Profil
      5. Definition
      6. Zentren (aktiviert/offen)
      7. Kanäle
      8. Tore
      9. Inkarnationskreuz
      10. Detaillierte Interpretationen basierend auf den PDF-Quellen
      
      Verwende die PDFs als Referenz für:
      - Genaue Definitionen und Erklärungen
      - Praktische Anwendungen
      - Beispiele und Fallstudien
      - Aktuelle Entwicklungen im Human Design
      
      Antworte auf Deutsch und sei sehr detailliert.`;

      const userPrompt = `Bitte erstelle eine detaillierte Human Design Chart-Analyse für:
      
      Name: ${birthData.name || 'Nicht angegeben'}
      Geburtsdatum: ${birthData.birth_date}
      Geburtszeit: ${birthData.birth_time}
      Geburtsort: ${birthData.birth_place}
      
      Verwende das Wissen aus den hochgeladenen PDFs für eine professionelle und tiefgründige Analyse.`;

      const response = await this.client!.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      return {
        success: true,
        chartData: response.choices[0].message.content,
        model: this.config.model,
        tokens: response.usage?.total_tokens || 0
      };

    } catch (error) {
      console.error('Fehler bei der Human Design Chart-Berechnung mit PDFs:', error);
      throw error;
    }
  }

  // Reflexionsfragen basierend auf PDF-Wissen generieren
  async generateReflectionQuestions(chartElement: {
    type: 'gate' | 'channel' | 'center' | 'line' | 'profile' | 'authority';
    value: string;
    description?: string;
  }) {
    try {
      const systemPrompt = `Du bist ein Human Design Coach mit Zugang zu umfangreichen PDF-Dokumenten über Human Design.
      
      Erstelle 5-7 tiefgründige Reflexionsfragen für das angegebene Chart-Element.
      Die Fragen sollten:
      - Basierend auf dem Wissen aus den PDFs sein
      - Praktisch und anwendbar sein
      - Zur Selbstreflexion anregen
      - Spezifisch für das Element sein
      
      Verwende das PDF-Wissen für:
      - Genaue Definitionen
      - Praktische Anwendungen
      - Coaching-Techniken
      - Beispiele aus der Praxis`;

      const userPrompt = `Erstelle Reflexionsfragen für:
      
      Element-Typ: ${chartElement.type}
      Wert: ${chartElement.value}
      Beschreibung: ${chartElement.description || 'Nicht verfügbar'}
      
      Verwende das Wissen aus den PDFs für relevante und tiefgründige Fragen.`;

      const response = await this.client!.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return {
        success: true,
        questions: response.choices[0].message.content,
        element: chartElement
      };

    } catch (error) {
      console.error('Fehler bei der Generierung von Reflexionsfragen:', error);
      throw error;
    }
  }

  // Detaillierte Chart-Interpretation mit PDF-Wissen
  async getDetailedInterpretation(chartData: {
    type: string;
    profile: string;
    authority: string;
    definition: string;
    centers: any;
    channels: any;
    gates: any;
  }) {
    try {
      const systemPrompt = `Du bist ein Human Design Experte mit Zugang zu umfangreichen PDF-Dokumenten.
      
      Erstelle eine detaillierte, praktische Interpretation der Human Design Chart.
      Verwende das PDF-Wissen für:
      - Tiefgründige Erklärungen
      - Praktische Anwendungen
      - Coaching-Empfehlungen
      - Lebensbereiche (Beziehungen, Karriere, Gesundheit, etc.)
      - Aktuelle Entwicklungen und Trends
      
      Die Interpretation sollte strukturiert und leicht verständlich sein.`;

      const userPrompt = `Erstelle eine detaillierte Interpretation für:
      
      Typ: ${chartData.type}
      Profil: ${chartData.profile}
      Autorität: ${chartData.authority}
      Definition: ${chartData.definition}
      Zentren: ${JSON.stringify(chartData.centers)}
      Kanäle: ${JSON.stringify(chartData.channels)}
      Tore: ${JSON.stringify(chartData.gates)}
      
      Verwende das PDF-Wissen für eine professionelle und praktische Interpretation.`;

      const response = await this.client!.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      return {
        success: true,
        interpretation: response.choices[0].message.content,
        chartData: chartData
      };

    } catch (error) {
      console.error('Fehler bei der detaillierten Interpretation:', error);
      throw error;
    }
  }

  // Kompatibilitätsanalyse mit PDF-Wissen
  async analyzeCompatibility(chart1: any, chart2: any) {
    try {
      const systemPrompt = `Du bist ein Human Design Beziehungs-Experte mit Zugang zu umfangreichen PDF-Dokumenten.
      
      Analysiere die Kompatibilität zwischen zwei Human Design Charts.
      Verwende das PDF-Wissen für:
      - Beziehungstheorien im Human Design
      - Kompatibilitätsmuster
      - Herausforderungen und Lösungen
      - Praktische Ratschläge
      - Fallstudien aus den PDFs
      
      Erstelle eine ausgewogene, hilfreiche Analyse.`;

      const userPrompt = `Analysiere die Kompatibilität zwischen:
      
      Person 1: ${JSON.stringify(chart1)}
      Person 2: ${JSON.stringify(chart2)}
      
      Verwende das PDF-Wissen für eine professionelle Kompatibilitätsanalyse.`;

      const response = await this.client!.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      return {
        success: true,
        compatibility: response.choices[0].message.content,
        charts: { chart1, chart2 }
      };

    } catch (error) {
      console.error('Fehler bei der Kompatibilitätsanalyse:', error);
      throw error;
    }
  }

  // PDF-Wissen für spezifische Fragen abfragen
  async queryPDFKnowledge(question: string, context?: string) {
    try {
      const systemPrompt = `Du hast Zugang zu umfangreichen Human Design PDF-Dokumenten.
      
      Beantworte die Frage basierend auf dem Wissen aus den PDFs.
      Verwende:
      - Genaue Zitate und Referenzen
      - Praktische Beispiele
      - Aktuelle Entwicklungen
      - Verschiedene Perspektiven aus den PDFs
      
      Sei präzise und hilfreich.`;

      const userPrompt = `Frage: ${question}
      ${context ? `Kontext: ${context}` : ''}
      
      Beantworte basierend auf dem PDF-Wissen.`;

      const response = await this.client!.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.5,
      });

      return {
        success: true,
        answer: response.choices[0].message.content,
        question: question
      };

    } catch (error) {
      console.error('Fehler bei der PDF-Wissensabfrage:', error);
      throw error;
    }
  }

  // Chart-Element-spezifische Analyse
  async analyzeChartElement(elementType: string, elementValue: string, chartContext?: any) {
    try {
      const systemPrompt = `Du bist ein Human Design Experte mit PDF-Wissen.
      
      Analysiere das spezifische Chart-Element detailliert.
      Verwende das PDF-Wissen für:
      - Tiefgründige Definitionen
      - Praktische Anwendungen
      - Coaching-Empfehlungen
      - Beispiele und Fallstudien
      
      Sei spezifisch und praktisch.`;

      const userPrompt = `Analysiere:
      
      Element-Typ: ${elementType}
      Element-Wert: ${elementValue}
      ${chartContext ? `Chart-Kontext: ${JSON.stringify(chartContext)}` : ''}
      
      Verwende das PDF-Wissen für eine detaillierte Analyse.`;

      const response = await this.client!.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.6,
      });

      return {
        success: true,
        analysis: response.choices[0].message.content,
        element: { type: elementType, value: elementValue }
      };

    } catch (error) {
      console.error('Fehler bei der Element-Analyse:', error);
      throw error;
    }
  }

  // ChatGPT-ähnlicher Chat mit Human Design Kontext
  async chatWithContext(message: string, chatHistory: any[] = [], userChart?: any) {
    try {
      const systemPrompt = `Du bist ein freundlicher und hilfsreicher Human Design Coach und Berater. 
      
      Du hast Zugang zu umfangreichen PDF-Dokumenten über Human Design und kannst:
      - Human Design Charts analysieren und interpretieren
      - Persönliche Fragen zu Human Design beantworten
      - Coaching und Beratung anbieten
      - Praktische Tipps für den Alltag geben
      - Bei Entscheidungen helfen
      - Beziehungen und Kompatibilität analysieren
      
      ${userChart ? `
      Aktueller Benutzer-Chart:
      - Typ: ${userChart.type || 'Unbekannt'}
      - Profil: ${userChart.profile || 'Unbekannt'}
      - Autorität: ${userChart.authority || 'Unbekannt'}
      - Strategie: ${userChart.strategy || 'Unbekannt'}
      ` : ''}
      
      Antworte auf Deutsch, sei persönlich, ermutigend und praktisch. 
      Verwende das PDF-Wissen für fundierte Antworten.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
        { role: 'user', content: message }
      ];

      const response = await this.client!.chat.completions.create({
        model: this.config.model,
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7,
      });

      return {
        success: true,
        response: response.choices[0].message.content,
        tokens: response.usage?.total_tokens || 0
      };

    } catch (error) {
      console.error('Fehler beim Chat:', error);
      throw error;
    }
  }

  // Spezielle Human Design Fragen beantworten
  async answerHDQuestion(question: string, context?: any) {
    // Fallback wenn API Key nicht verfügbar
    if (!this.isAPIKeyValid || !this.client) {
      console.log('🔄 Verwende Fallback für Chat-Antwort');
      return {
        answer: FallbackService.getChatFallback(question),
        sources: ['Human Design Grundprinzipien'],
        confidence: 0.7
      };
    }
    try {
      const systemPrompt = `Du bist ein Human Design Experte mit Zugang zu umfangreichen PDF-Dokumenten.
      
      Beantworte die Frage präzise und hilfreich basierend auf dem PDF-Wissen.
      Verwende:
      - Genaue Definitionen aus den PDFs
      - Praktische Beispiele
      - Coaching-Empfehlungen
      - Aktuelle Entwicklungen im Human Design
      
      Sei professionell, aber zugänglich.`;

      const userPrompt = `Frage: ${question}
      ${context ? `Kontext: ${JSON.stringify(context)}` : ''}
      
      Bitte beantworte basierend auf dem PDF-Wissen.`;

      const response = await this.client!.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1200,
        temperature: 0.6,
      });

      return {
        success: true,
        answer: response.choices[0].message.content,
        question: question
      };

    } catch (error) {
      console.error('Fehler bei der HD-Frage:', error);
      throw error;
    }
  }
}

// OpenAI-Service Instanz erstellen
const openaiService = new OpenAIService({
  apiKey: process.env.OPENAI_API_KEY || '',
  model: 'gpt-4o-mini',
  maxTokens: 4000,
  temperature: 0.7
});

// Validierung des API-Keys
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === '') {
  console.log('⚠️ OpenAI API Key nicht gesetzt - AI-Features werden nicht funktionieren');
} else {
  console.log('✅ OpenAI Service mit API Key initialisiert');
}

export default openaiService;
