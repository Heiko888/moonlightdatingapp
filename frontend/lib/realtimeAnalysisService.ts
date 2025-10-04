'use client';

import { ChartData } from './hd-bodygraph/chartService';

export interface EnergeticAnalysis {
  compatibilityScore: number;
  relationshipProbability: number;
  energeticDynamics: {
    attraction: number;
    harmony: number;
    challenge: number;
    growth: number;
  };
  centerInteractions: {
    complementary: string[];
    conflicting: string[];
    neutral: string[];
  };
  channelResonance: {
    shared: string[];
    complementary: string[];
    conflicting: string[];
  };
  gateInteractions: {
    harmonious: string[];
    challenging: string[];
    neutral: string[];
  };
  recommendations: {
    strengths: string[];
    challenges: string[];
    advice: string[];
  };
}

export interface RealtimeAnalysisResult {
  timestamp: number;
  analysis: EnergeticAnalysis;
  confidence: number;
  insights: string[];
}

export class RealtimeAnalysisService {
  private static baseUrl = 'http://localhost:4001';

  // Echtzeit-Analyse zwischen zwei Charts
  static async analyzeCharts(
    chart1: ChartData, 
    chart2: ChartData
  ): Promise<RealtimeAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/realtime-analysis/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chart1: this.prepareChartForAnalysis(chart1),
          chart2: this.prepareChartForAnalysis(chart2)
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in realtime analysis:', error);
      // Fallback zu lokaler Analyse
      return this.performLocalAnalysis(chart1, chart2);
    }
  }

  // Live-Analyse mit WebSocket (für Echtzeit-Updates)
  static async startLiveAnalysis(
    chart1: ChartData,
    chart2: ChartData,
    onUpdate: (result: RealtimeAnalysisResult) => void
  ): Promise<WebSocket> {
    const ws = new WebSocket(`ws://localhost:4001/realtime-analysis/live`);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'start_analysis',
        chart1: this.prepareChartForAnalysis(chart1),
        chart2: this.prepareChartForAnalysis(chart2)
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'analysis_update') {
        onUpdate(data.result);
      }
    };

    return ws;
  }

  // Chart für Analyse vorbereiten
  private static prepareChartForAnalysis(chart: ChartData) {
    return {
      id: chart.id,
      name: chart.name,
      type: chart.type,
      profile: chart.profile,
      authority: chart.authority,
      strategy: (chart as any).strategy || 'Not defined',
      centers: chart.centers,
      channels: chart.channels,
      gates: chart.gates,
      planets: (chart as any).planets || {},
      defined: chart.defined
    };
  }

  // Lokale Analyse als Fallback
  private static performLocalAnalysis(
    chart1: ChartData,
    chart2: ChartData
  ): RealtimeAnalysisResult {
    const analysis = this.calculateEnergeticCompatibility(chart1, chart2);
    
    return {
      timestamp: Date.now(),
      analysis,
      confidence: 0.85,
      insights: this.generateInsights(analysis)
    };
  }

  // Energetische Kompatibilität berechnen
  private static calculateEnergeticCompatibility(
    chart1: ChartData,
    chart2: ChartData
  ): EnergeticAnalysis {
    // Basis-Kompatibilität
    const compatibilityScore = this.calculateBaseCompatibility(chart1, chart2);
    
    // Energetische Dynamiken
    const energeticDynamics = this.calculateEnergeticDynamics(chart1, chart2);
    
    // Zentren-Interaktionen
    const centerInteractions = this.analyzeCenterInteractions(chart1, chart2);
    
    // Kanal-Resonanz
    const channelResonance = this.analyzeChannelResonance(chart1, chart2);
    
    // Tor-Interaktionen
    const gateInteractions = this.analyzeGateInteractions(chart1, chart2);
    
    // Beziehungs-Wahrscheinlichkeit
    const relationshipProbability = this.calculateRelationshipProbability(
      compatibilityScore,
      energeticDynamics,
      centerInteractions
    );
    
    // Empfehlungen
    const recommendations = this.generateRecommendations(
      energeticDynamics,
      centerInteractions,
      channelResonance
    );

    return {
      compatibilityScore,
      relationshipProbability,
      energeticDynamics,
      centerInteractions,
      channelResonance,
      gateInteractions,
      recommendations
    };
  }

  // Basis-Kompatibilität berechnen
  private static calculateBaseCompatibility(chart1: ChartData, chart2: ChartData): number {
    let score = 0;

    // HD-Typ Kompatibilität
    const typeCompatibility = this.getTypeCompatibility(chart1.type, chart2.type);
    score += typeCompatibility * 0.3;

    // Profil-Kompatibilität
    const profileCompatibility = this.getProfileCompatibility(chart1.profile, chart2.profile);
    score += profileCompatibility * 0.25;

    // Autorität-Kompatibilität
    const authorityCompatibility = this.getAuthorityCompatibility(chart1.authority, chart2.authority);
    score += authorityCompatibility * 0.2;

    // Zentren-Kompatibilität
    const centerCompatibility = this.getCenterCompatibility(chart1.centers, chart2.centers);
    score += centerCompatibility * 0.15;

    // Kanal-Kompatibilität
    const channelCompatibility = this.getChannelCompatibility(chart1.channels, chart2.channels);
    score += channelCompatibility * 0.1;

    return Math.min(100, Math.max(0, score));
  }

  // Energetische Dynamiken berechnen
  private static calculateEnergeticDynamics(chart1: ChartData, chart2: ChartData) {
    const attraction = this.calculateAttraction(chart1, chart2);
    const harmony = this.calculateHarmony(chart1, chart2);
    const challenge = this.calculateChallenge(chart1, chart2);
    const growth = this.calculateGrowth(chart1, chart2);

    return {
      attraction: Math.min(100, Math.max(0, attraction)),
      harmony: Math.min(100, Math.max(0, harmony)),
      challenge: Math.min(100, Math.max(0, challenge)),
      growth: Math.min(100, Math.max(0, growth))
    };
  }

  // Anziehungskraft berechnen
  private static calculateAttraction(chart1: ChartData, chart2: ChartData): number {
    let attraction = 50; // Basis-Anziehung

    // Komplementäre Zentren erhöhen Anziehung
    const complementaryCenters = this.getComplementaryCenters(chart1.centers, chart2.centers);
    attraction += complementaryCenters.length * 8;

    // Verschiedene HD-Typen haben oft mehr Anziehung
    if (chart1.type !== chart2.type) {
      attraction += 15;
    }

    // Bestimmte Profil-Kombinationen
    const profileAttraction = this.getProfileAttraction(chart1.profile, chart2.profile);
    attraction += profileAttraction;

    return attraction;
  }

  // Harmonie berechnen
  private static calculateHarmony(chart1: ChartData, chart2: ChartData): number {
    let harmony = 50;

    // Ähnliche Autoritäten
    if (chart1.authority === chart2.authority) {
      harmony += 20;
    }

    // Kompatible Strategien
    const strategyHarmony = this.getStrategyHarmony((chart1 as any).strategy, (chart2 as any).strategy);
    harmony += strategyHarmony;

    // Gemeinsame Kanäle
    const sharedChannels = this.getSharedChannels(chart1.channels, chart2.channels);
    harmony += sharedChannels.length * 5;

    return harmony;
  }

  // Herausforderung berechnen
  private static calculateChallenge(chart1: ChartData, chart2: ChartData): number {
    let challenge = 30; // Basis-Herausforderung

    // Konfliktierende Zentren
    const conflictingCenters = this.getConflictingCenters(chart1.centers, chart2.centers);
    challenge += conflictingCenters.length * 10;

    // Verschiedene HD-Typen können herausfordernd sein
    if (chart1.type === 'manifestor' && chart2.type === 'projector') {
      challenge += 15;
    } else if (chart1.type === 'projector' && chart2.type === 'manifestor') {
      challenge += 15;
    }

    return challenge;
  }

  // Wachstumspotential berechnen
  private static calculateGrowth(chart1: ChartData, chart2: ChartData): number {
    let growth = 40;

    // Komplementäre Zentren fördern Wachstum
    const complementaryCenters = this.getComplementaryCenters(chart1.centers, chart2.centers);
    growth += complementaryCenters.length * 6;

    // Verschiedene Profile fördern Wachstum
    if (chart1.profile !== chart2.profile) {
      growth += 10;
    }

    // Bestimmte Kanal-Kombinationen
    const growthChannels = this.getGrowthChannels(chart1.channels, chart2.channels);
    growth += growthChannels.length * 8;

    return growth;
  }

  // Zentren-Interaktionen analysieren
  private static analyzeCenterInteractions(chart1: ChartData, chart2: ChartData) {
    const centers1 = Object.keys(chart1.centers || {}).filter(key => chart1.centers[key as keyof typeof chart1.centers]);
    const centers2 = Object.keys(chart2.centers || {}).filter(key => chart2.centers[key as keyof typeof chart2.centers]);

    const complementary = centers1.filter(center => !centers2.includes(center));
    const conflicting = this.getConflictingCenters(chart1.centers, chart2.centers);
    const neutral = centers1.filter(center => centers2.includes(center));

    return {
      complementary,
      conflicting,
      neutral
    };
  }

  // Kanal-Resonanz analysieren
  private static analyzeChannelResonance(chart1: ChartData, chart2: ChartData) {
    const channels1 = Object.keys(chart1.channels || {}).filter(key => chart1.channels[key as keyof typeof chart1.channels]);
    const channels2 = Object.keys(chart2.channels || {}).filter(key => chart2.channels[key as keyof typeof chart2.channels]);

    const shared = channels1.filter(channel => channels2.includes(channel));
    const complementary = this.getComplementaryChannels(chart1.channels, chart2.channels);
    const conflicting = this.getConflictingChannels(chart1.channels, chart2.channels);

    return {
      shared,
      complementary,
      conflicting
    };
  }

  // Tor-Interaktionen analysieren
  private static analyzeGateInteractions(chart1: ChartData, chart2: ChartData) {
    const gates1 = Object.keys(chart1.gates || {}).filter(key => chart1.gates[key as keyof typeof chart1.gates]);
    const gates2 = Object.keys(chart2.gates || {}).filter(key => chart2.gates[key as keyof typeof chart2.gates]);

    const harmonious = this.getHarmoniousGates(gates1, gates2);
    const challenging = this.getChallengingGates(gates1, gates2);
    const neutral = gates1.filter(gate => gates2.includes(gate));

    return {
      harmonious,
      challenging,
      neutral
    };
  }

  // Beziehungs-Wahrscheinlichkeit berechnen
  private static calculateRelationshipProbability(
    compatibility: number,
    dynamics: any,
    centerInteractions: any
  ): number {
    let probability = compatibility * 0.4;
    
    // Energetische Dynamiken
    probability += dynamics.attraction * 0.2;
    probability += dynamics.harmony * 0.2;
    probability -= dynamics.challenge * 0.1;
    probability += dynamics.growth * 0.1;

    // Zentren-Interaktionen
    const complementaryRatio = centerInteractions.complementary.length / 
      (centerInteractions.complementary.length + centerInteractions.conflicting.length + 1);
    probability += complementaryRatio * 20;

    return Math.min(100, Math.max(0, probability));
  }

  // Empfehlungen generieren
  private static generateRecommendations(
    dynamics: any,
    centerInteractions: any,
    channelResonance: any
  ) {
    const strengths: string[] = [];
    const challenges: string[] = [];
    const advice: string[] = [];

    // Stärken
    if (dynamics.attraction > 70) {
      strengths.push("Starke energetische Anziehung zwischen euch");
    }
    if (dynamics.harmony > 70) {
      strengths.push("Hohe Harmonie in der Beziehung");
    }
    if (centerInteractions.complementary.length > 3) {
      strengths.push("Viele komplementäre Zentren fördern das Wachstum");
    }

    // Herausforderungen
    if (dynamics.challenge > 60) {
      challenges.push("Herausfordernde energetische Dynamiken");
    }
    if (centerInteractions.conflicting.length > 2) {
      challenges.push("Einige Zentren können Konflikte verursachen");
    }

    // Ratschläge
    if (dynamics.growth > 70) {
      advice.push("Nutzt euer hohes Wachstumspotential gemeinsam");
    }
    if (channelResonance.shared.length > 0) {
      advice.push("Gemeinsame Kanäle können eure Verbindung stärken");
    }

    return { strengths, challenges, advice };
  }

  // Hilfsfunktionen
  private static getTypeCompatibility(type1: string, type2: string): number {
    const compatibilityMatrix: { [key: string]: { [key: string]: number } } = {
      'Generator': { 'Generator': 70, 'Manifesting Generator': 80, 'Projector': 60, 'Manifestor': 50, 'Reflector': 40 },
      'Manifesting Generator': { 'Generator': 80, 'Manifesting Generator': 70, 'Projector': 65, 'Manifestor': 55, 'Reflector': 45 },
      'Projector': { 'Generator': 60, 'Manifesting Generator': 65, 'Projector': 75, 'Manifestor': 40, 'Reflector': 50 },
      'Manifestor': { 'Generator': 50, 'Manifesting Generator': 55, 'Projector': 40, 'Manifestor': 60, 'Reflector': 35 },
      'Reflector': { 'Generator': 40, 'Manifesting Generator': 45, 'Projector': 50, 'Manifestor': 35, 'Reflector': 80 }
    };
    
    return compatibilityMatrix[type1]?.[type2] || 50;
  }

  private static getProfileCompatibility(profile1: string, profile2: string): number {
    // Vereinfachte Profil-Kompatibilität
    const p1 = parseInt(profile1.split('/')[0]);
    const p2 = parseInt(profile2.split('/')[0]);
    
    const compatiblePairs = [
      [1, 3], [2, 4], [3, 5], [4, 6], [5, 1], [6, 2]
    ];
    
    for (const pair of compatiblePairs) {
      if ((p1 === pair[0] && p2 === pair[1]) || (p1 === pair[1] && p2 === pair[0])) {
        return 80;
      }
    }
    
    return 50;
  }

  private static getAuthorityCompatibility(auth1: string, auth2: string): number {
    if (auth1 === auth2) return 70;
    
    const compatibleAuthorities = [
      ['Sacral', 'Emotional'],
      ['Splenic', 'Ego'],
      ['G', 'Throat']
    ];
    
    for (const pair of compatibleAuthorities) {
      if ((auth1 === pair[0] && auth2 === pair[1]) || (auth1 === pair[1] && auth2 === pair[0])) {
        return 75;
      }
    }
    
    return 50;
  }

  private static getCenterCompatibility(centers1: any, centers2: any): number {
    const centers1List = Object.keys(centers1 || {}).filter(key => centers1[key]);
    const centers2List = Object.keys(centers2 || {}).filter(key => centers2[key]);
    
    const complementary = centers1List.filter(center => !centers2List.includes(center));
    const shared = centers1List.filter(center => centers2List.includes(center));
    
    return (complementary.length * 10) + (shared.length * 5);
  }

  private static getChannelCompatibility(channels1: any, channels2: any): number {
    const channels1List = Object.keys(channels1 || {}).filter(key => channels1[key]);
    const channels2List = Object.keys(channels2 || {}).filter(key => channels2[key]);
    
    const shared = channels1List.filter(channel => channels2List.includes(channel));
    return shared.length * 8;
  }

  private static getComplementaryCenters(centers1: any, centers2: any): string[] {
    const centers1List = Object.keys(centers1 || {}).filter(key => centers1[key]);
    const centers2List = Object.keys(centers2 || {}).filter(key => centers2[key]);
    
    return centers1List.filter(center => !centers2List.includes(center));
  }

  private static getConflictingCenters(centers1: any, centers2: any): string[] {
    // Vereinfachte Konflikt-Erkennung
    const conflictingPairs = [
      ['Head', 'Ajna'],
      ['Throat', 'G'],
      ['Heart', 'Solar']
    ];
    
    const centers1List = Object.keys(centers1 || {}).filter(key => centers1[key]);
    const centers2List = Object.keys(centers2 || {}).filter(key => centers2[key]);
    
    const conflicts: string[] = [];
    for (const pair of conflictingPairs) {
      if (centers1List.includes(pair[0]) && centers2List.includes(pair[1])) {
        conflicts.push(`${pair[0]}-${pair[1]}`);
      }
      if (centers1List.includes(pair[1]) && centers2List.includes(pair[0])) {
        conflicts.push(`${pair[1]}-${pair[0]}`);
      }
    }
    
    return conflicts;
  }

  private static getProfileAttraction(profile1: string, profile2: string): number {
    const p1 = parseInt(profile1.split('/')[0]);
    const p2 = parseInt(profile2.split('/')[0]);
    
    // Bestimmte Profil-Kombinationen haben hohe Anziehung
    if ((p1 === 1 && p2 === 3) || (p1 === 3 && p2 === 1)) return 20;
    if ((p1 === 2 && p2 === 4) || (p1 === 4 && p2 === 2)) return 25;
    if ((p1 === 5 && p2 === 1) || (p1 === 1 && p2 === 5)) return 15;
    
    return 0;
  }

  private static getStrategyHarmony(strategy1: string, strategy2: string): number {
    if (strategy1 === strategy2) return 15;
    
    const compatibleStrategies = [
      ['Wait to Respond', 'Wait for Invitation'],
      ['Inform', 'Wait to Respond']
    ];
    
    for (const pair of compatibleStrategies) {
      if ((strategy1 === pair[0] && strategy2 === pair[1]) || (strategy1 === pair[1] && strategy2 === pair[0])) {
        return 20;
      }
    }
    
    return 5;
  }

  private static getSharedChannels(channels1: any, channels2: any): string[] {
    const channels1List = Object.keys(channels1 || {}).filter(key => channels1[key]);
    const channels2List = Object.keys(channels2 || {}).filter(key => channels2[key]);
    
    return channels1List.filter(channel => channels2List.includes(channel));
  }

  private static getComplementaryChannels(channels1: any, channels2: any): string[] {
    // Vereinfachte komplementäre Kanal-Erkennung
    return [];
  }

  private static getConflictingChannels(channels1: any, channels2: any): string[] {
    // Vereinfachte Konflikt-Kanal-Erkennung
    return [];
  }

  private static getGrowthChannels(channels1: any, channels2: any): string[] {
    // Kanäle die Wachstum fördern
    return [];
  }

  private static getHarmoniousGates(gates1: string[], gates2: string[]): string[] {
    // Harmonische Tor-Kombinationen
    return [];
  }

  private static getChallengingGates(gates1: string[], gates2: string[]): string[] {
    // Herausfordernde Tor-Kombinationen
    return [];
  }

  private static generateInsights(analysis: EnergeticAnalysis): string[] {
    const insights: string[] = [];
    
    if (analysis.compatibilityScore > 80) {
      insights.push("Sehr hohe Kompatibilität - eine starke energetische Verbindung");
    } else if (analysis.compatibilityScore > 60) {
      insights.push("Gute Kompatibilität mit Potenzial für eine harmonische Beziehung");
    } else if (analysis.compatibilityScore > 40) {
      insights.push("Moderate Kompatibilität - Raum für Wachstum und Entwicklung");
    } else {
      insights.push("Herausfordernde Kompatibilität - erfordert bewusste Arbeit");
    }
    
    if (analysis.energeticDynamics.attraction > 70) {
      insights.push("Starke energetische Anziehung zwischen den Charts");
    }
    
    if (analysis.energeticDynamics.growth > 70) {
      insights.push("Hohes Wachstumspotential in dieser Verbindung");
    }
    
    return insights;
  }
}
