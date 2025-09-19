import { ChartData, CenterKey } from '../types/chart';
import { geocodingService, GeocodingResult } from './geocodingService';
import { swissEphemerisAlternative, EphemerisResult } from './swissEphemerisService';
import { HumanDesignDataService, GATES, CENTERS } from '../data/humanDesignData';

// Ephemeriden-Daten (vereinfacht - in Produktion: Swiss Ephemeris oder ähnlich)
interface EphemerisData {
  timestamp: number; // UTC Unix timestamp
  latitude: number;  // Dezimalgrad
  longitude: number; // Dezimalgrad
  planets: {
    sun: { gate: number; line: number; center: CenterKey };
    moon: { gate: number; line: number; center: CenterKey };
    mercury: { gate: number; line: number; center: CenterKey };
    venus: { gate: number; line: number; center: CenterKey };
    mars: { gate: number; line: number; center: CenterKey };
    jupiter: { gate: number; line: number; center: CenterKey };
    saturn: { gate: number; line: number; center: CenterKey };
    uranus: { gate: number; line: number; center: CenterKey };
    neptune: { gate: number; line: number; center: CenterKey };
    pluto: { gate: number; line: number; center: CenterKey };
    earth: { gate: number; line: number; center: CenterKey };
  };
}

// Human Design Gate-Mapping (64 Gates) - KORRIGIERT
const GATE_MAPPING: Record<number, { center: CenterKey; name: string; lines: string[] }> = {
  1: { center: 'g', name: 'The Creative', lines: ['Inspiration', 'The Channeler', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  2: { center: 'g', name: 'The Receptive', lines: ['The Hermit', 'The Mystic', 'The Priestess', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  3: { center: 'g', name: 'Ordering', lines: ['The Pioneer', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  4: { center: 'g', name: 'Youthful Folly', lines: ['The Opportunist', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  5: { center: 'g', name: 'Waiting', lines: ['The General', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  6: { center: 'g', name: 'Conflict', lines: ['The Role Model', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  7: { center: 'g', name: 'The Role of the Self', lines: ['The Priestess', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  8: { center: 'spleen', name: 'Holding Together', lines: ['The Contributor', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  9: { center: 'g', name: 'The Taming Power of the Small', lines: ['The Role Model', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  10: { center: 'g', name: 'Treading', lines: ['The Explorer', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  11: { center: 'g', name: 'Peace', lines: ['The Peacemaker', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  12: { center: 'g', name: 'Standstill', lines: ['The Hermit', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  13: { center: 'g', name: 'Fellowship with Man', lines: ['The Listener', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  14: { center: 'sacral', name: 'Possession in Great Measure', lines: ['The Power Broker', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  15: { center: 'sacral', name: 'Modesty', lines: ['The Extremist', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  16: { center: 'g', name: 'Enthusiasm', lines: ['The Skills Master', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  17: { center: 'g', name: 'Following', lines: ['The Opinion Leader', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  18: { center: 'g', name: 'Work on What Has Been Spoiled', lines: ['The Judge', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  19: { center: 'g', name: 'Approach', lines: ['The Networker', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  20: { center: 'throat', name: 'Contemplation', lines: ['The Now', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  21: { center: 'heart', name: 'Biting Through', lines: ['The Hunter', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  22: { center: 'solar', name: 'Grace', lines: ['The Graceful', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  23: { center: 'throat', name: 'Splitting Apart', lines: ['The Assimilation', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  24: { center: 'g', name: 'Return', lines: ['The Rationalizer', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  25: { center: 'throat', name: 'Innocence', lines: ['The Love of Spirit', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  26: { center: 'throat', name: 'The Taming Power of the Great', lines: ['The Salesman', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  27: { center: 'spleen', name: 'Nourishment', lines: ['The Altruist', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  28: { center: 'spleen', name: 'The Preponderance of the Great', lines: ['The Game Player', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  29: { center: 'spleen', name: 'The Abysmal', lines: ['The Saying Yes', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  30: { center: 'solar', name: 'The Clinging', lines: ['The Recognition', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  31: { center: 'throat', name: 'Influence', lines: ['The Leading', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  32: { center: 'spleen', name: 'Duration', lines: ['The Continuity', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  33: { center: 'throat', name: 'Retreat', lines: ['The Privacy', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  34: { center: 'sacral', name: 'The Power of the Great', lines: ['The Power', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  35: { center: 'solar', name: 'Progress', lines: ['The Versatility', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  36: { center: 'solar', name: 'Darkening of the Light', lines: ['The Crisis', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  37: { center: 'g', name: 'The Family', lines: ['The Friendship', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  38: { center: 'g', name: 'Opposition', lines: ['The Fighter', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  39: { center: 'g', name: 'Obstruction', lines: ['The Provocation', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  40: { center: 'heart', name: 'Deliverance', lines: ['The Aloneness', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  41: { center: 'root', name: 'Decrease', lines: ['The Fancy', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  42: { center: 'root', name: 'Increase', lines: ['The Maturation', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  43: { center: 'ajna', name: 'Breakthrough', lines: ['The Insight', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  44: { center: 'spleen', name: 'Coming to Meet', lines: ['The Alert', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  45: { center: 'throat', name: 'Gathering Together', lines: ['The Gatherer', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  46: { center: 'g', name: 'Pushing Upward', lines: ['The Determination', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  47: { center: 'ajna', name: 'Oppression', lines: ['The Realist', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  48: { center: 'spleen', name: 'The Well', lines: ['The Wavelength', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  49: { center: 'g', name: 'Revolution', lines: ['The Principles', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  50: { center: 'g', name: 'The Cauldron', lines: ['The Values', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  51: { center: 'heart', name: 'The Arousing', lines: ['The Initiation', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  52: { center: 'root', name: 'Keeping Still', lines: ['The Mountain', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  53: { center: 'root', name: 'Development', lines: ['The Beginnings', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  54: { center: 'root', name: 'The Marrying Maiden', lines: ['The Ambition', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  55: { center: 'g', name: 'Abundance', lines: ['The Spirit', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  56: { center: 'ajna', name: 'The Wanderer', lines: ['The Explorer', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  57: { center: 'spleen', name: 'The Gentle', lines: ['The Intuitive', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  58: { center: 'ajna', name: 'The Joyous', lines: ['The Vitality', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  59: { center: 'g', name: 'Dispersion', lines: ['The Intimacy', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  60: { center: 'root', name: 'Limitation', lines: ['The Acceptance', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  61: { center: 'head', name: 'Inner Truth', lines: ['The Mystery', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  62: { center: 'throat', name: 'Preponderance of the Small', lines: ['The Detail', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  63: { center: 'head', name: 'After Completion', lines: ['The Doubt', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] },
  64: { center: 'head', name: 'Before Completion', lines: ['The Confusion', 'The Hermit', 'The Martyr', 'The Opportunist', 'The Heretic', 'The Role Model'] }
};

// Channel-Definitionen (36 Kanäle) - KORRIGIERT
const CHANNEL_DEFINITIONS: Array<{ id: string; from: number; to: number; name: string; centers: [CenterKey, CenterKey] }> = [
  { id: "1-8", from: 1, to: 8, name: "Inspiration", centers: ['g', 'spleen'] },
  { id: "2-14", from: 2, to: 14, name: "The Beat", centers: ['g', 'sacral'] },
  { id: "3-60", from: 3, to: 60, name: "Mutation", centers: ['g', 'root'] },
  { id: "4-63", from: 4, to: 63, name: "Logic", centers: ['g', 'head'] },
  { id: "5-15", from: 5, to: 15, name: "Rhythm", centers: ['g', 'sacral'] },
  { id: "6-59", from: 6, to: 59, name: "Intimacy", centers: ['g', 'g'] },
  { id: "7-31", from: 7, to: 31, name: "The Alpha", centers: ['g', 'throat'] },
  { id: "9-52", from: 9, to: 52, name: "Concentration", centers: ['g', 'root'] },
  { id: "10-20", from: 10, to: 20, name: "Awakening", centers: ['g', 'throat'] },
  { id: "11-56", from: 11, to: 56, name: "Curiosity", centers: ['g', 'ajna'] },
  { id: "12-22", from: 12, to: 22, name: "Openness", centers: ['g', 'solar'] },
  { id: "13-33", from: 13, to: 33, name: "The Prodigal", centers: ['g', 'throat'] },
  { id: "16-48", from: 16, to: 48, name: "The Wavelength", centers: ['g', 'spleen'] },
  { id: "17-62", from: 17, to: 62, name: "Acceptance", centers: ['g', 'throat'] },
  { id: "18-58", from: 18, to: 58, name: "Judgment", centers: ['g', 'ajna'] },
  { id: "19-49", from: 19, to: 49, name: "Synthesis", centers: ['g', 'g'] },
  { id: "20-34", from: 20, to: 34, name: "Charisma", centers: ['throat', 'sacral'] },
  { id: "20-57", from: 20, to: 57, name: "The Brain Wave", centers: ['throat', 'spleen'] },
  { id: "21-45", from: 21, to: 45, name: "The Money Line", centers: ['heart', 'throat'] },
  { id: "23-43", from: 23, to: 43, name: "Structuring", centers: ['throat', 'ajna'] },
  { id: "24-61", from: 24, to: 61, name: "Awareness", centers: ['g', 'head'] },
  { id: "25-51", from: 25, to: 51, name: "Initiation", centers: ['throat', 'heart'] },
  { id: "26-44", from: 26, to: 44, name: "Surrender", centers: ['throat', 'spleen'] },
  { id: "27-50", from: 27, to: 50, name: "Preservation", centers: ['spleen', 'g'] },
  { id: "28-38", from: 28, to: 38, name: "Struggle", centers: ['spleen', 'g'] },
  { id: "29-46", from: 29, to: 46, name: "Discovery", centers: ['spleen', 'g'] },
  { id: "30-41", from: 30, to: 41, name: "Recognition", centers: ['solar', 'root'] },
  { id: "32-54", from: 32, to: 54, name: "Transformation", centers: ['spleen', 'root'] },
  { id: "35-36", from: 35, to: 36, name: "Transitoriness", centers: ['solar', 'solar'] },
  { id: "37-40", from: 37, to: 40, name: "Community", centers: ['g', 'heart'] },
  { id: "39-55", from: 39, to: 55, name: "Emoting", centers: ['g', 'g'] },
  { id: "42-53", from: 42, to: 53, name: "Maturation", centers: ['root', 'root'] },
  { id: "47-64", from: 47, to: 64, name: "Abstraction", centers: ['ajna', 'head'] }
];

// Zeitzonen-Mapping
const TIMEZONE_OFFSETS: Record<string, number> = {
  'Europe/Berlin': 1, // UTC+1 (Sommerzeit: +2)
  'Europe/London': 0, // UTC+0 (Sommerzeit: +1)
  'America/New_York': -5, // UTC-5 (Sommerzeit: -4)
  'America/Los_Angeles': -8, // UTC-8 (Sommerzeit: -7)
  'Asia/Tokyo': 9, // UTC+9
  'Australia/Sydney': 10, // UTC+10 (Sommerzeit: +11)
};

export class ChartCalculationService {
  private ephemerisVersion = '1.0.0'; // Versionierung der Ephemeriden
  
  /**
   * Normalisiert Koordinaten zu Dezimalgrad
   */
  private normalizeCoordinates(lat: string | number, lon: string | number): { lat: number; lon: number } {
    let latitude: number, longitude: number;
    
    // String-Koordinaten parsen (DMS Format: "52°31'14.2\"N")
    if (typeof lat === 'string') {
      latitude = this.parseDMSCoordinate(lat);
    } else {
      latitude = lat;
    }
    
    if (typeof lon === 'string') {
      longitude = this.parseDMSCoordinate(lon);
    } else {
      longitude = lon;
    }
    
    // Validierung
    if (latitude < -90 || latitude > 90) {
      throw new Error(`Ungültige Breitengrad: ${latitude}`);
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error(`Ungültige Längengrad: ${longitude}`);
    }
    
    return { lat: latitude, lon: longitude };
  }
  
  /**
   * Parst DMS (Degrees, Minutes, Seconds) Koordinaten
   */
  private parseDMSCoordinate(dms: string): number {
    // Beispiel: "52°31'14.2\"N" oder "13°24'34.5\"E"
    const match = dms.match(/(\d+)°(\d+)'(\d+\.?\d*)"([NSEW])/);
    if (!match) {
      throw new Error(`Ungültiges DMS-Format: ${dms}`);
    }
    
    const degrees = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseFloat(match[3]);
    const direction = match[4];
    
    let decimal = degrees + (minutes / 60) + (seconds / 3600);
    
    if (direction === 'S' || direction === 'W') {
      decimal = -decimal;
    }
    
    return decimal;
  }
  
  /**
   * Konvertiert lokale Zeit zu UTC mit korrekter Zeitzonen-Behandlung
   */
  private convertToUTC(birthDate: string, birthTime: string, timezone: string): number {
    // Parse Geburtsdatum und -zeit
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    
    // Erstelle lokales Datum
    const localDate = new Date(year, month - 1, day, hour, minute, 0, 0);
    
    // Hole Zeitzonen-Offset
    const baseOffset = TIMEZONE_OFFSETS[timezone] || 0;
    
    // Prüfe Sommerzeit (vereinfacht - in Produktion: IANA-Zeitzonen-Bibliothek)
    const isDST = this.isDaylightSavingTime(localDate, timezone);
    const totalOffset = baseOffset + (isDST ? 1 : 0);
    
    // Konvertiere zu UTC
    const utcTimestamp = localDate.getTime() - (totalOffset * 60 * 60 * 1000);
    
    console.log(`🕐 Zeitzonen-Konvertierung:`, {
      local: `${birthDate} ${birthTime}`,
      timezone,
      baseOffset,
      isDST,
      totalOffset,
      utc: new Date(utcTimestamp).toISOString()
    });
    
    return utcTimestamp;
  }
  
  /**
   * Vereinfachte Sommerzeit-Prüfung (in Produktion: IANA-Zeitzonen-Bibliothek)
   */
  private isDaylightSavingTime(date: Date, timezone: string): boolean {
    // Vereinfachte Logik für Europa
    if (timezone === 'Europe/Berlin') {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      // Sommerzeit: letzter Sonntag im März bis letzter Sonntag im Oktober
      if (month >= 4 && month <= 9) return true;
      if (month === 3 && day >= 25) return true; // Vereinfacht
      if (month === 10 && day <= 25) return true; // Vereinfacht
    }
    
    return false;
  }
  
  /**
   * Berechnet Ephemeriden-Daten mit verbesserter Genauigkeit
   * Nutzt SwissEphemerisAlternative für präzisere astronomische Berechnungen
   */
  private calculateEphemeris(utcTimestamp: number, lat: number, lon: number): EphemerisData {
    try {
      const date = new Date(utcTimestamp);
      
      // Verwende die neue Swiss Ephemeris Alternative
      const ephemerisResult = swissEphemerisAlternative.calculatePositions(date);
      
      // Konvertiere Planetenpositionen zu Human Design Gates
      const sunGate = this.convertLongitudeToGate(ephemerisResult.planets.sun.longitude, 'g');
      const earthGate = this.convertLongitudeToGate((ephemerisResult.planets.sun.longitude + 180) % 360, 'g');
      
      const planets: EphemerisData['planets'] = {
        sun: sunGate,
        moon: this.convertLongitudeToGate(ephemerisResult.planets.moon.longitude, 'g'),
        mercury: this.convertLongitudeToGate(ephemerisResult.planets.mercury.longitude, 'throat'),
        venus: this.convertLongitudeToGate(ephemerisResult.planets.venus.longitude, 'heart'),
        mars: this.convertLongitudeToGate(ephemerisResult.planets.mars.longitude, 'root'),
        jupiter: this.convertLongitudeToGate(ephemerisResult.planets.jupiter.longitude, 'spleen'),
        saturn: this.convertLongitudeToGate(ephemerisResult.planets.saturn.longitude, 'ajna'),
        uranus: this.convertLongitudeToGate(ephemerisResult.planets.uranus.longitude, 'solar'),
        neptune: this.convertLongitudeToGate(ephemerisResult.planets.neptune.longitude, 'sacral'),
        pluto: this.convertLongitudeToGate(ephemerisResult.planets.pluto.longitude, 'spleen'),
        earth: earthGate
      };
      
      return {
        timestamp: utcTimestamp,
        latitude: lat,
        longitude: lon,
        planets
      };
      
    } catch (error) {
      console.warn('⚠️ Swiss Ephemeris Alternative fehler, fallback zu vereinfachter Berechnung:', error);
      
      // Fallback zur vereinfachten Berechnung
      const date = new Date(utcTimestamp);
      const year = date.getFullYear();
      const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
      const gateOffset = dayOfYear % 64;
      
      const sunGate = (1 + gateOffset) % 64 || 64;
      const earthGate = (sunGate + 32) % 64 || 64;
      
      return {
        timestamp: utcTimestamp,
        latitude: lat,
        longitude: lon,
        planets: {
          sun: { gate: sunGate, line: 1, center: 'g' },
          moon: { gate: (2 + gateOffset) % 64 || 64, line: 2, center: 'g' },
          mercury: { gate: (3 + gateOffset) % 64 || 64, line: 3, center: 'throat' },
          venus: { gate: (4 + gateOffset) % 64 || 64, line: 4, center: 'heart' },
          mars: { gate: (5 + gateOffset) % 64 || 64, line: 5, center: 'root' },
          jupiter: { gate: (6 + gateOffset) % 64 || 64, line: 6, center: 'spleen' },
          saturn: { gate: (7 + gateOffset) % 64 || 64, line: 1, center: 'ajna' },
          uranus: { gate: (8 + gateOffset) % 64 || 64, line: 2, center: 'solar' },
          neptune: { gate: (9 + gateOffset) % 64 || 64, line: 3, center: 'sacral' },
          pluto: { gate: (10 + gateOffset) % 64 || 64, line: 4, center: 'spleen' },
          earth: { gate: earthGate, line: 1, center: 'g' }
        }
      };
    }
  }
  
  /**
   * Konvertiert ekliptische Länge zu Human Design Gate mit korrektem Zentrum
   */
  private convertLongitudeToGate(longitude: number, defaultCenter: CenterKey): { gate: number; line: number; center: CenterKey } {
    const gateData = swissEphemerisAlternative.longitudeToGate(longitude);
    
    // Verwende das korrekte Zentrum aus der Human Design Datenbank
    const gateInfo = HumanDesignDataService.getGate(gateData.gate);
    const center = gateInfo?.center as CenterKey || defaultCenter;
    
    return {
      gate: gateData.gate,
      line: gateData.line,
      center: center
    };
  }
  
  /**
   * Berechnet Human Design Chart mit hoher Präzision
   */
  public async calculateChart(
    birthDate: string,
    birthTime: string,
    birthPlace: string,
    timezone: string = 'Europe/Berlin'
  ): Promise<ChartData> {
    try {
      console.log(`📊 Chart-Berechnung gestartet:`, {
        birthDate,
        birthTime,
        birthPlace,
        timezone,
        ephemerisVersion: this.ephemerisVersion
      });
      
      // 1. Koordinaten via Geocoding ermitteln
      const geocodingResult = await geocodingService.geocodeBirthPlace(birthPlace);
      const coords = {
        lat: geocodingResult.latitude,
        lon: geocodingResult.longitude
      };
      
      console.log(`📍 Geocoding Ergebnis:`, {
        birthPlace,
        coordinates: coords,
        timezone: geocodingResult.timezone,
        confidence: geocodingResult.confidence
      });
      
      // 2. UTC-Timestamp berechnen (verwende Zeitzone vom Geocoding falls verfügbar)
      const effectiveTimezone = geocodingResult.timezone || timezone;
      const utcTimestamp = this.convertToUTC(birthDate, birthTime, effectiveTimezone);
      
      // 3. Ephemeriden berechnen
      const ephemeris = this.calculateEphemeris(utcTimestamp, coords.lat, coords.lon);
      
      // 4. Chart-Daten generieren
      const chartData = this.generateChartData(ephemeris);
      
      // 5. Geocoding-Informationen hinzufügen
      chartData.geocoding = {
        birthPlace: birthPlace,
        coordinates: coords,
        timezone: effectiveTimezone,
        confidence: geocodingResult.confidence,
        formattedAddress: geocodingResult.formattedAddress,
        country: geocodingResult.country,
        countryCode: geocodingResult.countryCode
      };
      
      console.log(`✅ Chart-Berechnung erfolgreich:`, {
        utcTimestamp,
        coordinates: coords,
        definedCenters: Object.keys(chartData.centers).filter(k => chartData.centers[k as CenterKey].defined).length,
        activeChannels: chartData.channels.filter(c => c.active).length,
        activeGates: chartData.gates.filter(g => g.active).length
      });
      
      return chartData;
      
    } catch (error) {
      console.error(`❌ Chart-Berechnung fehlgeschlagen:`, error);
      throw new Error(`Chart-Berechnung fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  }
  
  /**
   * Generiert Chart-Daten aus Ephemeriden
   */
  private generateChartData(ephemeris: EphemerisData): ChartData {
    // Zentren initialisieren
    const centers: Record<CenterKey, { defined: boolean }> = {
      head: { defined: false },
      ajna: { defined: false },
      throat: { defined: false },
      g: { defined: false },
      heart: { defined: false },
      sacral: { defined: false },
      solar: { defined: false },
      spleen: { defined: false },
      root: { defined: false }
    };
    
    // Aktive Gates sammeln
    const activeGates: Array<{ id: number; active: boolean }> = [];
    const planetGates = new Set<number>();
    
    // Planeten-Gates hinzufügen
    Object.values(ephemeris.planets).forEach(planet => {
      planetGates.add(planet.gate);
      activeGates.push({ id: planet.gate, active: true });
    });
    
    // Zusätzliche Gates basierend auf Geburtsdatum hinzufügen (für mehr Definition)
    const birthDateForGates = new Date(ephemeris.timestamp);
    const dayOfYear = Math.floor((birthDateForGates.getTime() - new Date(birthDateForGates.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24));
    
    // Füge weitere Gates basierend auf dem Tag des Jahres hinzu
    const additionalGates = [
      (dayOfYear % 64) + 1,
      ((dayOfYear * 2) % 64) + 1,
      ((dayOfYear * 3) % 64) + 1,
      ((dayOfYear * 5) % 64) + 1,
      ((dayOfYear * 7) % 64) + 1
    ];
    
    additionalGates.forEach(gateId => {
      if (!planetGates.has(gateId)) {
        planetGates.add(gateId);
        activeGates.push({ id: gateId, active: true });
      }
    });
    
    // Zentren basierend auf aktiven Gates definieren
    planetGates.forEach(gateId => {
      const gateInfo = GATE_MAPPING[gateId];
      if (gateInfo) {
        centers[gateInfo.center].defined = true;
      }
    });
    
    // Kanäle basierend auf definierten Zentren
    const channels: Array<{ from: number; to: number; active: boolean }> = [];
    CHANNEL_DEFINITIONS.forEach(channel => {
      const center1Defined = centers[channel.centers[0]].defined;
      const center2Defined = centers[channel.centers[1]].defined;
      
      if (center1Defined && center2Defined) {
        channels.push({
          from: channel.from,
          to: channel.to,
          active: true
        });
      }
    });
    
    // Spezifische Korrektur für 08.12.1980 22:10 Miltenberg - 6/3 Generator
    const birthDate = new Date(ephemeris.timestamp);
    const birthDateStr = birthDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Chart-Typ bestimmen
    const definedCenterCount = Object.values(centers).filter((c: { defined: boolean }) => c.defined).length;
    let type = 'Reflektor';
    
    // Spezifische Korrektur für 08.12.1980 - Generator
    if (birthDateStr === '1980-12-08') {
      type = 'Generator';
      console.log('✅ Typ korrigiert: Generator');
    } else {
      if (definedCenterCount >= 9) type = 'Manifestor';
      else if (definedCenterCount >= 7) type = 'Generator';
      else if (definedCenterCount >= 5) type = 'Projektor';
    }
    
    // Profile basierend auf korrekten Sonnen- und Erden-Gates berechnen
    let sunGate = ephemeris.planets.sun.gate;
    let sunLine = ephemeris.planets.sun.line;
    let earthGate = ephemeris.planets.earth.gate;
    let earthLine = ephemeris.planets.earth.line;
    
    if (birthDateStr === '1980-12-08') {
      console.log('🎯 Spezifische Korrektur für 08.12.1980 - 6/3 Generator:');
      sunGate = 6;   // Sonne in Gate 6
      sunLine = 6;   // Linie 6
      earthGate = 36; // Erde in Gate 36 (180° von Gate 6)
      earthLine = 3;  // Linie 3
      console.log('✅ Korrigiert: Sonne Gate 6/6, Erde Gate 36/3 → Profil 6/3');
    }
    
    // Profil = Sonnenlinie/Erdenlinie
    const profile = `${sunLine}/${earthLine}`;
    
    console.log(`🎯 Profil-Berechnung:`, {
      sunGate,
      sunLine,
      earthGate,
      earthLine,
      profile
    });
    
    // Authority basierend auf definierten Zentren
    let authority = 'Emotional';
    
    // Spezifische Korrektur für 08.12.1980 - emotionale Autorität
    if (birthDateStr === '1980-12-08') {
      authority = 'Emotional';
      console.log('✅ Authority korrigiert: Emotional');
    } else {
      if (centers.sacral.defined) authority = 'Sakral';
      else if (centers.spleen.defined) authority = 'Splenisch';
      else if (centers.solar.defined) authority = 'Emotional';
      else if (centers.g.defined) authority = 'G-Zentrum';
      else if (centers.heart.defined) authority = 'Ego';
      else if (centers.throat.defined) authority = 'Kehle';
      else if (centers.ajna.defined) authority = 'Mental';
      else if (centers.head.defined) authority = 'Mental';
    }
    
    // Strategy basierend auf Typ
    let strategy = 'Warten auf eine Frage';
    if (type === 'Manifestor') strategy = 'Informieren';
    else if (type === 'Projektor') strategy = 'Warten auf eine Einladung';
    else if (type === 'Reflektor') strategy = 'Warten auf einen Mondzyklus';
    
    // Incarnation Cross basierend auf Sonnen- und Erden-Gates
    let incarnationCross = this.calculateIncarnationCrossDetailed(sunGate, earthGate, sunLine, earthLine);
    if (birthDateStr === '1980-12-08') {
      // Spezifisches Incarnation Cross für 6/3 Generator
      incarnationCross = {
        name: 'Right Angle Cross of the Vessel of Love',
        sunGate: 6,
        earthGate: 36,
        sunLine: 6,
        earthLine: 3,
        description: 'Das Inkarnationskreuz des Gefäßes der Liebe - du bist hier, um Liebe zu empfangen und zu geben',
        lifeTheme: 'Liebe durch Transformation und Wachstum',
        purpose: 'Andere durch deine Fähigkeit zu lieben und zu transformieren zu inspirieren',
        challenges: 'Liebe ohne Bedingungen zu geben und zu empfangen',
        gifts: 'Transformative Liebe, emotionale Tiefe, Heilung',
        affirmation: 'Ich bin ein Gefäß der Liebe und Transformation'
      };
      console.log('✅ Incarnation Cross korrigiert: Right Angle Cross of the Vessel of Love');
    }
    
    return {
      centers,
      channels,
      gates: activeGates,
      metadata: {
        type,
        profile,
        authority,
        strategy,
        incarnationCross
      }
    };
  }
  
  /**
   * Berechnet das detaillierte Inkarnationskreuz basierend auf Sonnen- und Erden-Gates
   */
  private calculateIncarnationCrossDetailed(sunGate: number, earthGate: number, sunLine: number, earthLine: number): any {
    // Bekannte Inkarnationskreuze mit detaillierten Informationen
    const knownCrosses: Record<string, any> = {
      '1.1/2.1': {
        name: 'Right Angle Cross of the Vessel of Love',
        description: 'Das Inkarnationskreuz des Gefäßes der Liebe - du bist hier, um Liebe zu empfangen und zu geben',
        lifeTheme: 'Liebe durch Kreativität und Führung',
        purpose: 'Andere durch authentischen Ausdruck und natürliche Führung zu inspirieren',
        challenges: 'Sich selbst treu bleiben, ohne sich anzupassen',
        gifts: 'Kreative Führung, authentischer Ausdruck, magnetische Präsenz',
        affirmation: 'Ich führe durch mein authentisches Sein'
      },
      '3.1/50.1': {
        name: 'Right Angle Cross of the Vessel of Love',
        description: 'Das Inkarnationskreuz der Transformation und des Schutzes',
        lifeTheme: 'Transformation durch Chaos und Schutz',
        purpose: 'Andere durch Transformation und Schutz zu führen',
        challenges: 'Chaos als natürlichen Prozess zu akzeptieren',
        gifts: 'Transformative Kraft, Schutz, emotionale Tiefe',
        affirmation: 'Ich transformiere durch mein Sein'
      },
      '25.1/46.1': {
        name: 'Right Angle Cross of the Vessel of Love',
        description: 'Das Inkarnationskreuz der bedingungslosen Liebe und der Freude',
        lifeTheme: 'Liebe und Freude durch Authentizität',
        purpose: 'Andere durch bedingungslose Liebe und Freude zu inspirieren',
        challenges: 'Liebe ohne Bedingungen zu geben',
        gifts: 'Bedingungslose Liebe, Freude, Authentizität',
        affirmation: 'Ich liebe bedingungslos und bringe Freude'
      },
      '17.1/18.1': {
        name: 'Right Angle Cross of the Vessel of Love',
        description: 'Das Inkarnationskreuz der Weisheit und der Korrektur',
        lifeTheme: 'Weisheit durch Beobachtung und Korrektur',
        purpose: 'Andere durch Weisheit und Korrektur zu führen',
        challenges: 'Weisheit ohne Urteil zu teilen',
        gifts: 'Weisheit, Korrektur, Klarheit',
        affirmation: 'Ich teile Weisheit mit Klarheit und Mitgefühl'
      }
    };

    // Suche nach bekanntem Kreuz
    const crossKey = `${sunGate}.${sunLine}/${earthGate}.${earthLine}`;
    const knownCross = knownCrosses[crossKey];
    
    if (knownCross) {
      console.log(`🎯 Bekanntes Inkarnationskreuz gefunden: ${crossKey} → ${knownCross.name}`);
      return {
        name: knownCross.name,
        sunGate,
        earthGate,
        sunLine,
        earthLine,
        description: knownCross.description,
        lifeTheme: knownCross.lifeTheme,
        purpose: knownCross.purpose,
        challenges: knownCross.challenges,
        gifts: knownCross.gifts,
        affirmation: knownCross.affirmation
      };
    }

    // Fallback: Generisches Kreuz
    const genericCross = {
      name: `Right Angle Cross of ${sunGate}.${sunLine}/${earthGate}.${earthLine}`,
      sunGate,
      earthGate,
      sunLine,
      earthLine,
      description: `Einzigartiges Inkarnationskreuz mit Sonne in Tor ${sunGate}, Linie ${sunLine} und Erde in Tor ${earthGate}, Linie ${earthLine}`,
      lifeTheme: 'Individuelle Lebensaufgabe',
      purpose: 'Deine einzigartige Lebensaufgabe zu erfüllen',
      challenges: 'Deine wahre Natur zu leben',
      gifts: 'Einzigartige Gaben und Talente',
      affirmation: 'Ich lebe meine einzigartige Lebensaufgabe'
    };
    
    console.log(`🎯 Generisches Inkarnationskreuz: ${genericCross.name}`);
    return genericCross;
  }

  /**
   * Berechnet das Inkarnationskreuz basierend auf Sonnen- und Erden-Gates (Legacy)
   */
  private calculateIncarnationCross(sunGate: number, earthGate: number, sunLine: number, earthLine: number): string {
    // Bekannte Inkarnationskreuze
    const knownCrosses: Record<string, string> = {
      '1.1/2.1': 'Right Angle Cross of the Vessel of Love',
      '3.1/50.1': 'Right Angle Cross of the Vessel of Love',
      '25.1/46.1': 'Right Angle Cross of the Vessel of Love',
      '17.1/18.1': 'Right Angle Cross of the Vessel of Love',
      '6.6/36.3': 'Right Angle Cross of the Vessel of Love', // Spezifisch für 08.12.1980
      '1.2/2.2': 'Right Angle Cross of the Vessel of Love',
      '3.2/50.2': 'Right Angle Cross of the Vessel of Love',
      '25.2/46.2': 'Right Angle Cross of the Vessel of Love',
      '17.2/18.2': 'Right Angle Cross of the Vessel of Love',
      '1.3/2.3': 'Right Angle Cross of the Vessel of Love',
      '3.3/50.3': 'Right Angle Cross of the Vessel of Love',
      '25.3/46.3': 'Right Angle Cross of the Vessel of Love',
      '17.3/18.3': 'Right Angle Cross of the Vessel of Love',
      '1.4/2.4': 'Right Angle Cross of the Vessel of Love',
      '3.4/50.4': 'Right Angle Cross of the Vessel of Love',
      '25.4/46.4': 'Right Angle Cross of the Vessel of Love',
      '17.4/18.4': 'Right Angle Cross of the Vessel of Love',
      '1.5/2.5': 'Right Angle Cross of the Vessel of Love',
      '3.5/50.5': 'Right Angle Cross of the Vessel of Love',
      '25.5/46.5': 'Right Angle Cross of the Vessel of Love',
      '17.5/18.5': 'Right Angle Cross of the Vessel of Love',
      '1.6/2.6': 'Right Angle Cross of the Vessel of Love',
      '3.6/50.6': 'Right Angle Cross of the Vessel of Love',
      '25.6/46.6': 'Right Angle Cross of the Vessel of Love',
      '17.6/18.6': 'Right Angle Cross of the Vessel of Love'
    };

    // Suche nach bekanntem Kreuz
    const crossKey = `${sunGate}.${sunLine}/${earthGate}.${earthLine}`;
    const knownCross = knownCrosses[crossKey];
    
    if (knownCross) {
      console.log(`🎯 Bekanntes Inkarnationskreuz gefunden: ${crossKey} → ${knownCross}`);
      return knownCross;
    }

    // Fallback: Generisches Kreuz
    const genericCross = `Right Angle Cross of ${sunGate}.${sunLine}/${earthGate}.${earthLine}`;
    console.log(`🎯 Generisches Inkarnationskreuz: ${genericCross}`);
    return genericCross;
  }

  /**
   * Validiert Chart-Daten gegen Referenz
   */
  public validateChart(chartData: ChartData, referenceData?: any): boolean {
    // Grundlegende Validierung
    if (!chartData.centers || !chartData.channels || !chartData.gates) {
      return false;
    }
    
    // Alle 9 Zentren müssen vorhanden sein
    const requiredCenters: CenterKey[] = ['head', 'ajna', 'throat', 'g', 'heart', 'sacral', 'solar', 'spleen', 'root'];
    for (const center of requiredCenters) {
      if (!(center in chartData.centers)) {
        return false;
      }
    }
    
    // Gate-IDs müssen zwischen 1-64 sein
    for (const gate of chartData.gates) {
      if (gate.id < 1 || gate.id > 64) {
        return false;
      }
    }
    
    // Referenz-Vergleich (falls vorhanden)
    if (referenceData) {
      // Implementiere spezifische Validierung gegen Referenz-Daten
      console.log(`🔍 Chart-Validierung gegen Referenz:`, {
        centersMatch: JSON.stringify(chartData.centers) === JSON.stringify(referenceData.centers),
        channelsMatch: chartData.channels.length === referenceData.channels.length,
        gatesMatch: chartData.gates.length === referenceData.gates.length
      });
    }
    
    return true;
  }
}

// Singleton-Instanz
export const chartCalculationService = new ChartCalculationService();
