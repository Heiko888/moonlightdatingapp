/**
 * Human Design Strukturdaten
 * 
 * Basierend auf Open-Source Human Design Informationen
 * Ersetzt hdkit/SharpAstrology bis zur vollständigen Integration
 */

export interface Gate {
  number: number;
  name: string;
  description: string;
  center: string;
  hexagram: string;
  lines: {
    [key: number]: {
      name: string;
      description: string;
    };
  };
}

export interface Channel {
  gates: [number, number];
  name: string;
  description: string;
  type: 'individual' | 'tribal' | 'collective';
  centers: [string, string];
}

export interface Center {
  name: string;
  type: 'motor' | 'awareness' | 'pressure' | 'expression';
  description: string;
  defined: {
    characteristics: string[];
    strategy: string;
  };
  undefined: {
    characteristics: string[];
    strategy: string;
  };
  gates: number[];
}

/**
 * Alle 64 Gates des Human Design Systems
 */
export const GATES: { [key: number]: Gate } = {
  1: {
    number: 1,
    name: "Die Schöpfung",
    description: "Das Schöpferische Prinzip - Führung und Originalität",
    center: "g",
    hexagram: "Creative",
    lines: {
      1: { name: "Kraft", description: "Die Grundlage kreativer Energie" },
      2: { name: "Liebe", description: "Kreativität durch Zuneigung" },
      3: { name: "Energie", description: "Anhaltende kreative Kraft" },
      4: { name: "Formen", description: "Kreative Strukturierung" },
      5: { name: "Universell", description: "Kreativität für das Gemeinwohl" },
      6: { name: "Objektivität", description: "Unparteiische Kreativität" }
    }
  },
  2: {
    number: 2,
    name: "Das Empfangende",
    description: "Die empfangende Kraft - Service und Hingabe",
    center: "g",
    hexagram: "Receptive",
    lines: {
      1: { name: "Intuition", description: "Natürliche empfangende Fähigkeit" },
      2: { name: "Genie", description: "Spontane empfangende Weisheit" },
      3: { name: "Dummheit", description: "Lernen durch empfangende Erfahrung" },
      4: { name: "Sanftmut", description: "Rücksichtsvolle Empfänglichkeit" },
      5: { name: "Weisheit", description: "Gelehrte Empfänglichkeit" },
      6: { name: "Führung", description: "Führung durch empfangende Kraft" }
    }
  },
  3: {
    number: 3,
    name: "Die Schwierigkeit am Anfang",
    description: "Initiation und Durchbruch trotz Hindernissen",
    center: "sacral",
    hexagram: "Difficulty at the Beginning",
    lines: {
      1: { name: "Synthese", description: "Ordnung aus dem Chaos schaffen" },
      2: { name: "Immobilität", description: "Warten auf den richtigen Moment" },
      3: { name: "Überleben", description: "Durch Schwierigkeiten durchhalten" },
      4: { name: "Charisma", description: "Andere durch Schwierigkeiten führen" },
      5: { name: "Sieghaftigkeit", description: "Triumph über Hindernisse" },
      6: { name: "Kapitulation", description: "Loslassen wenn nötig" }
    }
  },
  // Weitere Gates...
  // [Aus Platzgründen hier verkürzt - vollständige Implementierung würde alle 64 Gates enthalten]
  
  // Wichtige Gates für Demo:
  14: {
    number: 14,
    name: "Besitz im Großen",
    description: "Reichtum und Ressourcen - die Kraft des Habens",
    center: "sacral",
    hexagram: "Possession in Great Measure",
    lines: {
      1: { name: "Geld ist nicht alles", description: "Materielle Bescheidenheit" },
      2: { name: "Geschäftstüchtigkeit", description: "Praktische Vermögensverwaltung" },
      3: { name: "Service", description: "Ressourcen für andere einsetzen" },
      4: { name: "Sicherheit", description: "Aufbau stabiler Grundlagen" },
      5: { name: "Ego", description: "Stolz auf Besitz und Leistung" },
      6: { name: "Bescheidenheit", description: "Weisheit im Umgang mit Reichtum" }
    }
  },
  20: {
    number: 20,
    name: "Die Betrachtung",
    description: "Bewusstes Handeln und Präsenz im Moment",
    center: "throat",
    hexagram: "Contemplation",
    lines: {
      1: { name: "Oberflächlichkeit", description: "Oberflächliche Betrachtung" },
      2: { name: "Dogma", description: "Starre Überzeugungen" },
      3: { name: "Selbstbewusstsein", description: "Bewusste Selbstreflexion" },
      4: { name: "Anwendung", description: "Praktische Umsetzung" },
      5: { name: "Objektivität", description: "Unparteiische Betrachtung" },
      6: { name: "Weisheit", description: "Weise Betrachtung des Lebens" }
    }
  },
  34: {
    number: 34,
    name: "Die Macht des Großen",
    description: "Große Kraft und Macht - spirituelle Stärke",
    center: "sacral",
    hexagram: "Power of the Great",
    lines: {
      1: { name: "Kraft", description: "Rohe, ungerichtete Kraft" },
      2: { name: "Moment", description: "Kraft im richtigen Moment" },
      3: { name: "Fans", description: "Kraft durch Anhänger" },
      4: { name: "Triumph", description: "Kraft durch Sieg" },
      5: { name: "Zerstörung", description: "Zerstörerische Kraft" },
      6: { name: "Weisheit", description: "Weise Anwendung der Kraft" }
    }
  }
};

/**
 * Kanäle zwischen den Zentren
 */
export const CHANNELS: { [key: string]: Channel } = {
  "1-8": {
    gates: [1, 8],
    name: "Kanal der Inspiration",
    description: "Kreative Inspiration und Führung",
    type: "individual",
    centers: ["g", "throat"]
  },
  "2-14": {
    gates: [2, 14],
    name: "Kanal des Schlagen des Pulses",
    description: "Rhythmus und Ressourcen",
    type: "tribal",
    centers: ["g", "sacral"]
  },
  "20-34": {
    gates: [20, 34],
    name: "Kanal des Charismas",
    description: "Charismatische Führung im Moment",
    type: "individual",
    centers: ["throat", "sacral"]
  }
  // Weitere Kanäle...
};

/**
 * Die 9 Zentren des Human Design Systems
 */
export const CENTERS: { [key: string]: Center } = {
  head: {
    name: "Kopf-Zentrum",
    type: "pressure",
    description: "Inspiration und mentaler Druck",
    defined: {
      characteristics: ["Konstanter Inspirationsdruck", "Feste mentale Konzepte", "Eigener Denkrhythmus"],
      strategy: "Vertraue deinen eigenen Inspirationen"
    },
    undefined: {
      characteristics: ["Empfänglich für Inspirationen anderer", "Flexibles Denken", "Kann sich überfordern"],
      strategy: "Sei offen für Inspirationen, aber lass dich nicht überfordern"
    },
    gates: [64, 61, 63]
  },
  ajna: {
    name: "Ajna-Zentrum",
    type: "awareness",
    description: "Mentales Bewusstsein und Konzeptualisierung",
    defined: {
      characteristics: ["Feste mentale Überzeugungen", "Konstante Denkprozesse", "Eigene Art zu verstehen"],
      strategy: "Vertraue deinem mentalen Prozess"
    },
    undefined: {
      characteristics: ["Empfänglich für fremde Gedanken", "Flexibles Denken", "Kann mental unsicher sein"],
      strategy: "Sei offen für verschiedene Perspektiven"
    },
    gates: [47, 24, 4, 17, 43, 11]
  },
  throat: {
    name: "Kehl-Zentrum",
    type: "expression",
    description: "Kommunikation und Manifestation",
    defined: {
      characteristics: ["Konstante Kommunikationsfähigkeit", "Eigene Stimme", "Kann gut sprechen/ausdrücken"],
      strategy: "Nutze deine Stimme bewusst"
    },
    undefined: {
      characteristics: ["Empfänglich für Kommunikation anderer", "Variable Ausdrucksfähigkeit", "Aufmerksamkeit durch Sprechen"],
      strategy: "Spreche nur wenn du eingeladen wirst oder es sich richtig anfühlt"
    },
    gates: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16]
  },
  g: {
    name: "G-Zentrum",
    type: "expression",
    description: "Identität, Liebe und Richtung",
    defined: {
      characteristics: ["Feste Identität", "Konstante Liebe", "Klare Lebensrichtung"],
      strategy: "Folge deiner inneren Führung"
    },
    undefined: {
      characteristics: ["Suchende Identität", "Empfänglich für Liebe anderer", "Flexible Richtung"],
      strategy: "Sei in verschiedenen Umgebungen und mit verschiedenen Menschen"
    },
    gates: [1, 13, 25, 46, 2, 15, 10, 7]
  },
  heart: {
    name: "Herz-Zentrum",
    type: "motor",
    description: "Willenskraft und Ego",
    defined: {
      characteristics: ["Starker Wille", "Ego-Kraft", "Kann Versprechen halten"],
      strategy: "Nutze deinen Willen gezielt"
    },
    undefined: {
      characteristics: ["Empfänglich für Willenskraft anderer", "Schwierigkeiten mit Versprechen", "Beweisdrang"],
      strategy: "Mache nur Versprechen die du halten kannst"
    },
    gates: [26, 51, 21, 40]
  },
  sacral: {
    name: "Sakral-Zentrum",
    type: "motor",
    description: "Lebenskraft und sexuelle Energie",
    defined: {
      characteristics: ["Konstante Lebensenergie", "Regenerationsfähigkeit", "Arbeitskraft"],
      strategy: "Folge deiner sakralen Antwort"
    },
    undefined: {
      characteristics: ["Empfänglich für Energie anderer", "Kann sich überarbeiten", "Braucht mehr Ruhe"],
      strategy: "Erkenne wann du müde bist und ruhe dich aus"
    },
    gates: [3, 9, 59, 42, 27, 34, 5, 14, 29]
  },
  spleen: {
    name: "Milz-Zentrum",
    type: "awareness",
    description: "Intuition und Überlebensinstitnkt",
    defined: {
      characteristics: ["Konstante Intuition", "Starker Überlebensinstinkt", "Spontane Wahrnehmung"],
      strategy: "Vertraue deiner Intuition"
    },
    undefined: {
      characteristics: ["Empfänglich für Ängste anderer", "Variable Intuition", "Kann ängstlich sein"],
      strategy: "Umgib dich mit gesunden Menschen und Umgebungen"
    },
    gates: [18, 48, 57, 32, 50, 28, 44]
  },
  solar: {
    name: "Solar Plexus",
    type: "motor",
    description: "Emotionen und emotionale Klarheit",
    defined: {
      characteristics: ["Emotionale Wellen", "Intensive Gefühle", "Braucht Zeit für Klarheit"],
      strategy: "Warte auf emotionale Klarheit bevor du entscheidest"
    },
    undefined: {
      characteristics: ["Empfänglich für Emotionen anderer", "Konfliktscheu", "Kann Emotionen verstärken"],
      strategy: "Vermeide emotionale Konfrontationen und sei in harmonischen Umgebungen"
    },
    gates: [6, 37, 22, 36, 30, 55, 49, 19, 39]
  },
  root: {
    name: "Wurzel-Zentrum",
    type: "pressure",
    description: "Druck und Antrieb",
    defined: {
      characteristics: ["Konstanter Druck", "Starker Antrieb", "Kann unter Druck arbeiten"],
      strategy: "Nutze deinen natürlichen Druck konstruktiv"
    },
    undefined: {
      characteristics: ["Empfänglich für Druck anderer", "Kann sich gehetzt fühlen", "Stress-empfindlich"],
      strategy: "Erkenne wessen Druck du spürst und lass ihn los"
    },
    gates: [58, 38, 54, 53, 60, 52, 19, 39, 41]
  }
};

/**
 * Human Design Typen
 */
export const TYPES = {
  manifestor: {
    name: "Manifestor",
    strategy: "Informieren",
    authority: "Emotional oder Milz",
    signature: "Frieden",
    notSelf: "Zorn",
    percentage: "9%",
    description: "Initiatoren und Trendsetter, die andere informieren sollten bevor sie handeln"
  },
  generator: {
    name: "Generator", 
    strategy: "Antworten",
    authority: "Sakral",
    signature: "Zufriedenheit",
    notSelf: "Frustration",
    percentage: "37%",
    description: "Lebenskraft-Lieferanten die auf das Leben antworten und ihrer Begeisterung folgen"
  },
  manifesting_generator: {
    name: "Manifestierender Generator",
    strategy: "Antworten und Informieren", 
    authority: "Sakral",
    signature: "Zufriedenheit",
    notSelf: "Frustration und Zorn",
    percentage: "33%",
    description: "Vielseitige Energiebündel die schnell und effizient arbeiten"
  },
  projector: {
    name: "Projektor",
    strategy: "Warten auf Einladung",
    authority: "Emotional, Milz oder G-Zentrum",
    signature: "Erfolg", 
    notSelf: "Bitterkeit",
    percentage: "20%",
    description: "Natürliche Guides und Führungskräfte die auf Anerkennung warten"
  },
  reflector: {
    name: "Reflektor",
    strategy: "Warten einen Mondzyklus",
    authority: "Lunar",
    signature: "Überraschung",
    notSelf: "Enttäuschung", 
    percentage: "1%",
    description: "Seltene Weisheitsträger die die Gesundheit der Gemeinschaft spiegeln"
  }
};

/**
 * Hilfsfunktionen für Gate/Channel-Zuordnungen
 */
export class HumanDesignDataService {
  
  /**
   * Gibt das Gate für eine bestimmte Nummer zurück
   */
  static getGate(number: number): Gate | undefined {
    return GATES[number];
  }
  
  /**
   * Gibt den Kanal zwischen zwei Gates zurück
   */
  static getChannel(gate1: number, gate2: number): Channel | undefined {
    const channelKey1 = `${gate1}-${gate2}`;
    const channelKey2 = `${gate2}-${gate1}`;
    return CHANNELS[channelKey1] || CHANNELS[channelKey2];
  }
  
  /**
   * Gibt das Zentrum für ein bestimmtes Gate zurück
   */
  static getCenterForGate(gateNumber: number): string | undefined {
    const gate = GATES[gateNumber];
    return gate?.center;
  }
  
  /**
   * Prüft ob zwei Gates einen Kanal bilden
   */
  static isChannelActive(gate1: number, gate2: number): boolean {
    return this.getChannel(gate1, gate2) !== undefined;
  }
  
  /**
   * Gibt alle aktiven Kanäle für eine Liste von Gates zurück
   */
  static getActiveChannels(gates: number[]): Channel[] {
    const activeChannels: Channel[] = [];
    
    for (let i = 0; i < gates.length; i++) {
      for (let j = i + 1; j < gates.length; j++) {
        const channel = this.getChannel(gates[i], gates[j]);
        if (channel) {
          activeChannels.push(channel);
        }
      }
    }
    
    return activeChannels;
  }
  
  /**
   * Gibt definierte Zentren basierend auf aktiven Kanälen zurück
   */
  static getDefinedCenters(activeChannels: Channel[]): string[] {
    const centers = new Set<string>();
    
    activeChannels.forEach(channel => {
      centers.add(channel.centers[0]);
      centers.add(channel.centers[1]);
    });
    
    return Array.from(centers);
  }
  
  /**
   * Bestimmt den Human Design Typ basierend auf definierten Zentren
   */
  static determineType(definedCenters: string[]): string {
    const hasSacral = definedCenters.includes('sacral');
    const hasThroat = definedCenters.includes('throat');
    const hasHeart = definedCenters.includes('heart');
    const hasG = definedCenters.includes('g');
    
    // Kein definiertes Zentrum = Reflektor
    if (definedCenters.length === 0) {
      return 'reflector';
    }
    
    // Sakral definiert = Generator oder Manifestierender Generator
    if (hasSacral) {
      // Sakral mit direkter Verbindung zur Kehle = Manifestierender Generator
      if (hasThroat) {
        return 'manifesting_generator';
      }
      return 'generator';
    }
    
    // Kein Sakral aber Herz/G mit Kehle = Manifestor
    if (!hasSacral && hasThroat && (hasHeart || hasG)) {
      return 'manifestor';
    }
    
    // Alles andere = Projektor
    return 'projector';
  }
}

export default HumanDesignDataService;


