/**
 * Human Design Chart Calculation Service
 * Verwendet astronomy-engine für echte astronomische Berechnungen
 */

import * as Astronomy from 'astronomy-engine';

/**
 * Human Design Gate Mapping
 * Jedes Tor entspricht 5.625° des Zodiaks (360° / 64 Tore)
 * Startpunkt: Tor 41 bei 0° Wassermann (ca. 310° ekliptische Länge)
 */
const GATES_MAPPING = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];

/**
 * Zentren im Human Design
 */
export const CENTERS = {
  HEAD: 'Head',
  AJNA: 'Ajna',
  THROAT: 'Throat',
  G: 'G-Center',
  HEART: 'Heart/Ego',
  SACRAL: 'Sacral',
  SPLEEN: 'Spleen',
  SOLAR: 'Solar Plexus',
  ROOT: 'Root'
};

/**
 * Typ-Bestimmung basierend auf definierten Zentren
 */
function determineType(centers: { [key: string]: boolean }): string {
  const sacralDefined = centers.SACRAL;
  const throatDefined = centers.THROAT;
  const motorToThroat = centers.SACRAL || centers.HEART || centers.SOLAR || centers.ROOT;

  if (sacralDefined && motorToThroat && throatDefined) {
    return 'Manifestierender Generator';
  }
  if (sacralDefined) {
    return 'Generator';
  }
  if (!sacralDefined && motorToThroat && throatDefined) {
    return 'Manifestor';
  }
  if (!sacralDefined && !motorToThroat) {
    return 'Projektor';
  }
  return 'Reflektor';
}

/**
 * Autorität bestimmen
 */
function determineAuthority(centers: { [key: string]: boolean }): string {
  if (centers.SOLAR) return 'Emotional';
  if (centers.SACRAL) return 'Sakral';
  if (centers.SPLEEN) return 'Milz';
  if (centers.HEART) return 'Herz/Ego';
  if (centers.G) return 'Selbst';
  if (centers.THROAT) return 'Kehl';
  if (centers.AJNA) return 'Mental';
  if (centers.HEAD) return 'Äußere Autorität';
  return 'Lunar';
}

/**
 * Strategie basierend auf Typ
 */
function determineStrategy(type: string): string {
  switch (type) {
    case 'Manifestor':
      return 'Informieren bevor du handelst';
    case 'Generator':
      return 'Warte um zu reagieren';
    case 'Manifestierender Generator':
      return 'Warte um zu reagieren, dann informiere';
    case 'Projektor':
      return 'Warte auf die Einladung';
    case 'Reflektor':
      return 'Warte einen Mondzyklus';
    default:
      return 'Unbekannt';
  }
}

/**
 * Konvertiert ekliptische Länge in Human Design Tor
 */
function eclipticToGate(longitude: number): { gate: number; line: number } {
  // Normalisiere auf 0-360°
  const normalized = ((longitude % 360) + 360) % 360;
  
  // Startpunkt HD-Rad: 0° = ca. 58° ekliptische Länge (0° Steinbock)
  // HD-System startet bei Tor 41
  const hdPosition = (normalized + 58) % 360;
  
  // Berechne Tor (64 Tore zu je 5.625°)
  const gateIndex = Math.floor(hdPosition / 5.625);
  const gate = GATES_MAPPING[gateIndex] || 1;
  
  // Berechne Linie (6 Linien pro Tor)
  const positionInGate = hdPosition % 5.625;
  const line = Math.floor((positionInGate / 5.625) * 6) + 1;
  
  return { gate, line: Math.min(line, 6) };
}

/**
 * Berechne Planetenpositionen für ein bestimmtes Datum
 */
export function calculatePlanetaryPositions(date: Date) {
  const observer = Astronomy.MakeObserver(0, 0, 0); // Geozentrisch
  
  // Berechne Positionen für alle relevanten Planeten
  const planets = {
    sun: Astronomy.SunPosition(date),
    moon: Astronomy.GeoMoon(date),
    mercury: Astronomy.GeoVector(Astronomy.Body.Mercury, date, false),
    venus: Astronomy.GeoVector(Astronomy.Body.Venus, date, false),
    mars: Astronomy.GeoVector(Astronomy.Body.Mars, date, false),
    jupiter: Astronomy.GeoVector(Astronomy.Body.Jupiter, date, false),
    saturn: Astronomy.GeoVector(Astronomy.Body.Saturn, date, false),
    uranus: Astronomy.GeoVector(Astronomy.Body.Uranus, date, false),
    neptune: Astronomy.GeoVector(Astronomy.Body.Neptune, date, false),
    pluto: Astronomy.GeoVector(Astronomy.Body.Pluto, date, false)
  };

  // Konvertiere zu ekliptischen Koordinaten
  const positions: { [key: string]: { longitude: number; gate: number; line: number } } = {};
  
  // Sonne
  const sunEcliptic = Astronomy.Ecliptic(planets.sun);
  const sunGate = eclipticToGate(sunEcliptic.elon);
  positions.sun = { longitude: sunEcliptic.elon, ...sunGate };

  // Mond
  const moonEcliptic = Astronomy.Ecliptic(planets.moon);
  const moonGate = eclipticToGate(moonEcliptic.elon);
  positions.moon = { longitude: moonEcliptic.elon, ...moonGate };

  // Andere Planeten
  ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].forEach(planet => {
    const vector = planets[planet as keyof typeof planets];
    const ecliptic = Astronomy.Ecliptic(vector);
    const gate = eclipticToGate(ecliptic.elon);
    positions[planet] = { longitude: ecliptic.elon, ...gate };
  });

  return positions;
}

/**
 * Berechne Human Design Chart basierend auf Geburtsdaten
 */
export interface ChartCalculationInput {
  birthDate: string; // ISO format: YYYY-MM-DD
  birthTime: string; // HH:MM format (24h)
  birthPlace: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export interface HumanDesignChart {
  birthData: {
    date: string;
    time: string;
    place: string;
    latitude: number;
    longitude: number;
  };
  personality: {
    sun: { gate: number; line: number };
    earth: { gate: number; line: number };
    moon: { gate: number; line: number };
    mercury: { gate: number; line: number };
    venus: { gate: number; line: number };
    mars: { gate: number; line: number };
    jupiter: { gate: number; line: number };
    saturn: { gate: number; line: number };
    uranus: { gate: number; line: number };
    neptune: { gate: number; line: number };
    pluto: { gate: number; line: number };
  };
  design: {
    sun: { gate: number; line: number };
    earth: { gate: number; line: number };
    moon: { gate: number; line: number };
    mercury: { gate: number; line: number };
    venus: { gate: number; line: number };
    mars: { gate: number; line: number };
    jupiter: { gate: number; line: number };
    saturn: { gate: number; line: number };
    uranus: { gate: number; line: number };
    neptune: { gate: number; line: number };
    pluto: { gate: number; line: number };
  };
  type: string;
  profile: string;
  authority: string;
  strategy: string;
  definedCenters: string[];
  openCenters: string[];
  channels: number[][];
  incarnationCross: string;
}

export async function calculateHumanDesignChart(input: ChartCalculationInput): Promise<HumanDesignChart> {
  // Parse Geburtsdatum und Zeit
  const [year, month, day] = input.birthDate.split('-').map(Number);
  const [hours, minutes] = input.birthTime.split(':').map(Number);
  
  // Erstelle Date-Objekt für Persönlichkeit (Geburtszeitpunkt)
  const personalityDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  
  // Design-Zeitpunkt: 88 Grad (ca. 88 Tage) vor Geburt
  const designDate = new Date(personalityDate);
  designDate.setDate(designDate.getDate() - 88);
  
  // Berechne Planetenpositionen
  const personalityPositions = calculatePlanetaryPositions(personalityDate);
  const designPositions = calculatePlanetaryPositions(designDate);
  
  // Berechne Erde-Positionen (gegenüber Sonne)
  const earthPersonality = eclipticToGate((personalityPositions.sun.longitude + 180) % 360);
  const earthDesign = eclipticToGate((designPositions.sun.longitude + 180) % 360);
  
  // Sammle alle aktiven Tore
  const allGates = new Set<number>();
  Object.values(personalityPositions).forEach(pos => allGates.add(pos.gate));
  Object.values(designPositions).forEach(pos => allGates.add(pos.gate));
  allGates.add(earthPersonality.gate);
  allGates.add(earthDesign.gate);
  
  // Bestimme definierte Zentren (vereinfachte Logik - müsste erweitert werden)
  const centers = {
    HEAD: allGates.has(64) || allGates.has(61) || allGates.has(63),
    AJNA: allGates.has(47) || allGates.has(24) || allGates.has(4) || allGates.has(17) || allGates.has(43) || allGates.has(11),
    THROAT: allGates.has(62) || allGates.has(23) || allGates.has(56) || allGates.has(35) || allGates.has(12) || allGates.has(45) || allGates.has(33) || allGates.has(8) || allGates.has(31) || allGates.has(20) || allGates.has(16),
    G: allGates.has(7) || allGates.has(1) || allGates.has(13) || allGates.has(10) || allGates.has(15) || allGates.has(2) || allGates.has(46) || allGates.has(25),
    HEART: allGates.has(21) || allGates.has(40) || allGates.has(26) || allGates.has(51),
    SACRAL: allGates.has(5) || allGates.has(14) || allGates.has(29) || allGates.has(59) || allGates.has(9) || allGates.has(3) || allGates.has(42) || allGates.has(27) || allGates.has(34),
    SPLEEN: allGates.has(48) || allGates.has(57) || allGates.has(44) || allGates.has(50) || allGates.has(32) || allGates.has(28) || allGates.has(18),
    SOLAR: allGates.has(6) || allGates.has(37) || allGates.has(22) || allGates.has(36) || allGates.has(30) || allGates.has(55) || allGates.has(49),
    ROOT: allGates.has(53) || allGates.has(60) || allGates.has(52) || allGates.has(19) || allGates.has(39) || allGates.has(41) || allGates.has(58) || allGates.has(38) || allGates.has(54)
  };
  
  const type = determineType(centers);
  const authority = determineAuthority(centers);
  const strategy = determineStrategy(type);
  
  // Profil berechnen (aus Sonne und Erde Linien)
  const profile = `${personalityPositions.sun.line}/${earthDesign.line}`;
  
  // Definierte und offene Zentren
  const definedCenters = Object.entries(centers)
    .filter(([_, defined]) => defined)
    .map(([center]) => CENTERS[center as keyof typeof CENTERS]);
  
  const openCenters = Object.entries(centers)
    .filter(([_, defined]) => !defined)
    .map(([center]) => CENTERS[center as keyof typeof CENTERS]);
  
  return {
    birthData: {
      date: input.birthDate,
      time: input.birthTime,
      place: `${input.birthPlace.latitude}, ${input.birthPlace.longitude}`,
      latitude: input.birthPlace.latitude,
      longitude: input.birthPlace.longitude
    },
    personality: {
      sun: personalityPositions.sun,
      earth: earthPersonality,
      moon: personalityPositions.moon,
      mercury: personalityPositions.mercury,
      venus: personalityPositions.venus,
      mars: personalityPositions.mars,
      jupiter: personalityPositions.jupiter,
      saturn: personalityPositions.saturn,
      uranus: personalityPositions.uranus,
      neptune: personalityPositions.neptune,
      pluto: personalityPositions.pluto
    },
    design: {
      sun: designPositions.sun,
      earth: earthDesign,
      moon: designPositions.moon,
      mercury: designPositions.mercury,
      venus: designPositions.venus,
      mars: designPositions.mars,
      jupiter: designPositions.jupiter,
      saturn: designPositions.saturn,
      uranus: designPositions.uranus,
      neptune: designPositions.neptune,
      pluto: designPositions.pluto
    },
    type,
    profile,
    authority,
    strategy,
    definedCenters,
    openCenters,
    channels: [], // TODO: Channel-Berechnung implementieren
    incarnationCross: 'Inkarnationskreuz der Planung' // TODO: Implementieren
  };
}

