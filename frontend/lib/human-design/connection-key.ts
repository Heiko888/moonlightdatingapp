/**
 * The Connection Key - Resonanzanalyse zwischen 2 Human Design Charts
 * 
 * Analysiert:
 * - Gemeinsame/offene Zentren
 * - Komplementäre Tore (Resonanzachsen)
 * - Goldadern (neue Kanäle durch Verbindung)
 * - 3 Ebenen: Mental, Emotional, Körperlich-energetisch
 */

import type { Channel, CenterStatus } from './index';

/**
 * Resonanzebenen
 */
export type ResonanceLevel = 'mental' | 'emotional' | 'physical';

/**
 * Resonanzachse zwischen 2 Toren
 */
export interface ResonanceAxis {
  gate1: number;
  gate2: number;
  person1HasGate: number; // Welches der beiden Tore hat Person 1?
  person2HasGate: number; // Welches der beiden Tore hat Person 2?
  channelName: string;
  level: ResonanceLevel;
  theme: string;
  description: string;
}

/**
 * Goldader - neuer Kanal durch Verbindung
 */
export interface GoldenThread {
  channel: string; // z.B. "34-10"
  gate1: number;
  gate2: number;
  person1Gate: number;
  person2Gate: number;
  theme: string;
  description: string;
}

/**
 * Zentren-Vergleich
 */
export interface CenterComparison {
  centerName: string;
  person1: 'definiert' | 'offen' | 'undefiniert';
  person2: 'definiert' | 'offen' | 'undefiniert';
  type: 'resonance' | 'growth' | 'neutral'; // resonance = beide gleich, growth = einer definiert/einer offen
  description: string;
}

/**
 * Vollständige Connection Key Analyse
 */
export interface ConnectionKeyAnalysis {
  centers: CenterComparison[];
  resonanceAxes: ResonanceAxis[];
  goldenThreads: GoldenThread[];
  summary: {
    totalResonancePoints: number;
    dominantLevel: ResonanceLevel;
    connectionStrength: number; // 0-100
  };
}

/**
 * Komplementäre Tore (die einen Kanal bilden)
 * Basierend auf den 36 Kanälen
 */
const COMPLEMENTARY_GATES: Record<number, { complement: number; channel: string; level: ResonanceLevel; theme: string }> = {
  // Mentale Ebene (Krone, Ajna, Kehle)
  64: { complement: 47, channel: '64-47', level: 'mental', theme: 'Abstraktion & Realisierung' },
  47: { complement: 64, channel: '64-47', level: 'mental', theme: 'Realisierung & Abstraktion' },
  61: { complement: 24, channel: '61-24', level: 'mental', theme: 'Mysterium & Rationalisierung' },
  24: { complement: 61, channel: '61-24', level: 'mental', theme: 'Rationalisierung & Mysterium' },
  63: { complement: 4, channel: '63-4', level: 'mental', theme: 'Zweifel & Antworten' },
  4: { complement: 63, channel: '63-4', level: 'mental', theme: 'Antworten & Zweifel' },
  17: { complement: 62, channel: '17-62', level: 'mental', theme: 'Meinung & Detail' },
  62: { complement: 17, channel: '17-62', level: 'mental', theme: 'Detail & Meinung' },
  43: { complement: 23, channel: '43-23', level: 'mental', theme: 'Einsicht & Assimilation' },
  23: { complement: 43, channel: '43-23', level: 'mental', theme: 'Assimilation & Einsicht' },
  11: { complement: 56, channel: '11-56', level: 'mental', theme: 'Ideen & Stimulation' },
  56: { complement: 11, channel: '11-56', level: 'mental', theme: 'Stimulation & Ideen' },
  
  // Kehle-Verbindungen
  20: { complement: 34, channel: '20-34', level: 'physical', theme: 'Jetzt & Macht' },
  34: { complement: 20, channel: '20-34', level: 'physical', theme: 'Macht & Jetzt' },
  57: { complement: 10, channel: '10-57', level: 'physical', theme: 'Intuition & Selbstliebe' },
  10: { complement: 57, channel: '10-57', level: 'physical', theme: 'Selbstliebe & Intuition' },
  31: { complement: 7, channel: '31-7', level: 'mental', theme: 'Führung & Interaktion' },
  7: { complement: 31, channel: '31-7', level: 'mental', theme: 'Interaktion & Führung' },
  8: { complement: 1, channel: '8-1', level: 'mental', theme: 'Beitrag & Selbstausdruck' },
  1: { complement: 8, channel: '8-1', level: 'mental', theme: 'Selbstausdruck & Beitrag' },
  16: { complement: 48, channel: '16-48', level: 'mental', theme: 'Talent & Tiefe' },
  48: { complement: 16, channel: '16-48', level: 'mental', theme: 'Tiefe & Talent' },
  35: { complement: 36, channel: '35-36', level: 'emotional', theme: 'Erfahrung & Krise' },
  36: { complement: 35, channel: '35-36', level: 'emotional', theme: 'Krise & Erfahrung' },
  12: { complement: 22, channel: '12-22', level: 'emotional', theme: 'Vorsicht & Offenheit' },
  22: { complement: 12, channel: '12-22', level: 'emotional', theme: 'Offenheit & Vorsicht' },
  45: { complement: 21, channel: '45-21', level: 'emotional', theme: 'Herrschaft & Kontrolle' },
  21: { complement: 45, channel: '45-21', level: 'emotional', theme: 'Kontrolle & Herrschaft' },
  33: { complement: 13, channel: '33-13', level: 'mental', theme: 'Rückzug & Zuhören' },
  13: { complement: 33, channel: '33-13', level: 'mental', theme: 'Zuhören & Rückzug' },
  
  // Emotionale Ebene (Solarplexus, Herz)
  6: { complement: 59, channel: '6-59', level: 'emotional', theme: 'Intimität & Sexualität' },
  59: { complement: 6, channel: '6-59', level: 'emotional', theme: 'Sexualität & Intimität' },
  37: { complement: 40, channel: '37-40', level: 'emotional', theme: 'Familie & Befreiung' },
  40: { complement: 37, channel: '37-40', level: 'emotional', theme: 'Befreiung & Familie' },
  49: { complement: 19, channel: '49-19', level: 'emotional', theme: 'Revolution & Bedürfnisse' },
  19: { complement: 49, channel: '49-19', level: 'emotional', theme: 'Bedürfnisse & Revolution' },
  55: { complement: 39, channel: '55-39', level: 'emotional', theme: 'Fülle & Provokation' },
  39: { complement: 55, channel: '55-39', level: 'emotional', theme: 'Provokation & Fülle' },
  
  // Körperlich-energetische Ebene (G, Sakral, Wurzel, Milz)
  25: { complement: 51, channel: '25-51', level: 'physical', theme: 'Unschuld & Schock' },
  51: { complement: 25, channel: '25-51', level: 'physical', theme: 'Schock & Unschuld' },
  15: { complement: 5, channel: '15-5', level: 'physical', theme: 'Rhythmus & Timing' },
  5: { complement: 15, channel: '15-5', level: 'physical', theme: 'Timing & Rhythmus' },
  2: { complement: 14, channel: '2-14', level: 'physical', theme: 'Richtung & Kraft' },
  14: { complement: 2, channel: '2-14', level: 'physical', theme: 'Kraft & Richtung' },
  46: { complement: 29, channel: '46-29', level: 'physical', theme: 'Körper & Commitment' },
  29: { complement: 46, channel: '46-29', level: 'physical', theme: 'Commitment & Körper' },
  27: { complement: 50, channel: '27-50', level: 'physical', theme: 'Fürsorge & Werte' },
  50: { complement: 27, channel: '27-50', level: 'physical', theme: 'Werte & Fürsorge' },
  3: { complement: 60, channel: '3-60', level: 'physical', theme: 'Innovation & Beschränkung' },
  60: { complement: 3, channel: '3-60', level: 'physical', theme: 'Beschränkung & Innovation' },
  42: { complement: 53, channel: '42-53', level: 'physical', theme: 'Wachstum & Anfang' },
  53: { complement: 42, channel: '42-53', level: 'physical', theme: 'Anfang & Wachstum' },
  9: { complement: 52, channel: '9-52', level: 'physical', theme: 'Fokus & Stille' },
  52: { complement: 9, channel: '9-52', level: 'physical', theme: 'Stille & Fokus' },
  18: { complement: 58, channel: '18-58', level: 'physical', theme: 'Korrektur & Vitalität' },
  58: { complement: 18, channel: '18-58', level: 'physical', theme: 'Vitalität & Korrektur' },
  38: { complement: 28, channel: '38-28', level: 'physical', theme: 'Kampf & Risiko' },
  28: { complement: 38, channel: '38-28', level: 'physical', theme: 'Risiko & Kampf' },
  54: { complement: 32, channel: '54-32', level: 'physical', theme: 'Ehrgeiz & Kontinuität' },
  32: { complement: 54, channel: '54-32', level: 'physical', theme: 'Kontinuität & Ehrgeiz' },
  44: { complement: 26, channel: '44-26', level: 'physical', theme: 'Instinkt & Egoist' },
  26: { complement: 44, channel: '44-26', level: 'physical', theme: 'Egoist & Instinkt' },
  30: { complement: 41, channel: '30-41', level: 'emotional', theme: 'Sehnsucht & Fantasie' },
  41: { complement: 30, channel: '30-41', level: 'emotional', theme: 'Fantasie & Sehnsucht' },
};

/**
 * Zentren zu Ebenen Mapping
 */
const CENTER_TO_LEVEL: Record<string, ResonanceLevel> = {
  'krone': 'mental',
  'ajna': 'mental',
  'kehle': 'mental',
  'gZentrum': 'physical',
  'herzEgo': 'emotional',
  'sakral': 'physical',
  'solarplexus': 'emotional',
  'milz': 'physical',
  'wurzel': 'physical'
};

/**
 * Zentren-Namen (deutsch)
 */
const CENTER_NAMES: Record<string, string> = {
  'krone': 'Krone',
  'ajna': 'Ajna',
  'kehle': 'Kehle',
  'gZentrum': 'G-Zentrum',
  'herzEgo': 'Herz/Ego',
  'sakral': 'Sakral',
  'solarplexus': 'Solarplexus',
  'milz': 'Milz',
  'wurzel': 'Wurzel'
};

/**
 * Vergleicht die Zentren von 2 Personen
 */
export function compareCenters(
  person1Centers: CenterStatus,
  person2Centers: CenterStatus
): CenterComparison[] {
  const comparisons: CenterComparison[] = [];
  
  for (const centerKey of Object.keys(person1Centers) as (keyof CenterStatus)[]) {
    const p1Status = person1Centers[centerKey];
    const p2Status = person2Centers[centerKey];
    
    let type: 'resonance' | 'growth' | 'neutral' = 'neutral';
    let description = '';
    
    if (p1Status === p2Status) {
      type = 'resonance';
      description = p1Status === 'definiert' 
        ? 'Beide haben dieses Zentrum definiert - starke Resonanz in dieser Energie.'
        : 'Beide haben dieses Zentrum offen - gemeinsame Lernzone und Empfänglichkeit.';
    } else if (
      (p1Status === 'definiert' && (p2Status === 'offen' || p2Status === 'undefiniert')) ||
      (p2Status === 'definiert' && (p1Status === 'offen' || p1Status === 'undefiniert'))
    ) {
      type = 'growth';
      description = 'Einer definiert, einer offen - Wachstumsfeld. Energie fließt vom Definierten zum Offenen.';
    }
    
    comparisons.push({
      centerName: CENTER_NAMES[centerKey] || centerKey,
      person1: p1Status,
      person2: p2Status,
      type,
      description
    });
  }
  
  return comparisons;
}

/**
 * Findet Resonanzachsen zwischen 2 Personen
 */
export function findResonanceAxes(
  person1Gates: number[],
  person2Gates: number[]
): ResonanceAxis[] {
  const axes: ResonanceAxis[] = [];
  
  for (const gate1 of person1Gates) {
    const complementInfo = COMPLEMENTARY_GATES[gate1];
    if (!complementInfo) continue;
    
    const gate2 = complementInfo.complement;
    
    // Prüfe ob Person 2 das komplementäre Tor hat
    if (person2Gates.includes(gate2)) {
      axes.push({
        gate1,
        gate2,
        person1HasGate: gate1,
        person2HasGate: gate2,
        channelName: complementInfo.channel,
        level: complementInfo.level,
        theme: complementInfo.theme,
        description: `Resonanzachse ${gate1}-${gate2}: ${complementInfo.theme}. Ein unsichtbares Band zwischen beiden Personen.`
      });
    }
  }
  
  return axes;
}

/**
 * Findet Goldadern (neue vollständige Kanäle durch Verbindung)
 */
export function findGoldenThreads(
  resonanceAxes: ResonanceAxis[]
): GoldenThread[] {
  return resonanceAxes.map(axis => ({
    channel: axis.channelName,
    gate1: axis.gate1,
    gate2: axis.gate2,
    person1Gate: axis.person1HasGate,
    person2Gate: axis.person2HasGate,
    theme: axis.theme,
    description: `Goldader ${axis.channelName}: Gemeinsam aktiviert ihr den Kanal der ${axis.theme}. Diese Verbindung schafft neue kreative Möglichkeiten.`
  }));
}

/**
 * Hauptfunktion: Vollständige Connection Key Analyse
 */
export function analyzeConnectionKey(
  person1Gates: number[],
  person2Gates: number[],
  person1Centers: CenterStatus,
  person2Centers: CenterStatus
): ConnectionKeyAnalysis {
  // Zentren vergleichen
  const centers = compareCenters(person1Centers, person2Centers);
  
  // Resonanzachsen finden
  const resonanceAxes = findResonanceAxes(person1Gates, person2Gates);
  
  // Goldadern identifizieren
  const goldenThreads = findGoldenThreads(resonanceAxes);
  
  // Dominante Ebene berechnen
  const levelCounts: Record<ResonanceLevel, number> = {
    mental: 0,
    emotional: 0,
    physical: 0
  };
  
  for (const axis of resonanceAxes) {
    levelCounts[axis.level]++;
  }
  
  const dominantLevel = (Object.keys(levelCounts) as ResonanceLevel[])
    .reduce((a, b) => levelCounts[a] > levelCounts[b] ? a : b);
  
  // Connection Strength berechnen (0-100)
  const resonantCenters = centers.filter(c => c.type === 'resonance').length;
  const connectionStrength = Math.min(100, 
    (resonanceAxes.length * 15) + 
    (goldenThreads.length * 20) + 
    (resonantCenters * 5)
  );
  
  return {
    centers,
    resonanceAxes,
    goldenThreads,
    summary: {
      totalResonancePoints: resonanceAxes.length + goldenThreads.length,
      dominantLevel,
      connectionStrength
    }
  };
}

/**
 * Formatiert die Analyse als Text
 */
export function formatConnectionKeyAnalysis(analysis: ConnectionKeyAnalysis): string {
  let text = '🩵 THE CONNECTION KEY - RESONANZANALYSE\n\n';
  
  text += '📊 ZUSAMMENFASSUNG:\n';
  text += `• Resonanzpunkte: ${analysis.summary.totalResonancePoints}\n`;
  text += `• Verbindungsstärke: ${analysis.summary.connectionStrength}%\n`;
  text += `• Dominante Ebene: ${analysis.summary.dominantLevel === 'mental' ? '🧠 Mental' : analysis.summary.dominantLevel === 'emotional' ? '❤️ Emotional' : '💪 Körperlich-energetisch'}\n\n`;
  
  text += '🔹 ZENTREN-VERGLEICH:\n';
  const resonantCenters = analysis.centers.filter(c => c.type === 'resonance');
  const growthCenters = analysis.centers.filter(c => c.type === 'growth');
  text += `• Resonanzfelder: ${resonantCenters.length}\n`;
  text += `• Wachstumsfelder: ${growthCenters.length}\n\n`;
  
  text += '✨ GOLDADERN (Neue Kanäle durch Verbindung):\n';
  if (analysis.goldenThreads.length > 0) {
    analysis.goldenThreads.forEach((thread, idx) => {
      text += `${idx + 1}. ${thread.channel}: ${thread.theme}\n`;
    });
  } else {
    text += 'Keine vollständigen Kanäle durch Verbindung.\n';
  }
  
  return text;
}

