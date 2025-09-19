// Human Design Chart - Schlankes & robustes Daten-Schema
// Nur Zustände (defined/active), keine Positionen/Geometrie

export type CenterKey = 
  | "head" | "ajna" | "throat" | "g" | "heart"
  | "sacral" | "solar" | "spleen" | "root";

export type GateId = `${number}.${0|1|2|3|4|5}` | `${number}`; // 1…64, optional Linie

export interface ChartData {
  centers: Record<CenterKey, { defined: boolean }>;
  channels: Array<{ from: number; to: number; active: boolean }>; // z.B. 1–8
  gates: Array<{ id: number; active: boolean }>;                  // 1…64
  metadata?: { 
    type?: string; 
    profile?: string; 
    authority?: string;
    strategy?: string;
    incarnationCross?: string;
  };
}

// Hilfsfunktionen für Chart-Daten
export const createEmptyChartData = (): ChartData => ({
  centers: {
    head: { defined: false },
    ajna: { defined: false },
    throat: { defined: false },
    g: { defined: false },
    heart: { defined: false },
    sacral: { defined: false },
    solar: { defined: false },
    spleen: { defined: false },
    root: { defined: false }
  },
  channels: [],
  gates: [],
  metadata: {}
});

// Validierung
export const validateChartData = (data: any): data is ChartData => {
  if (!data || typeof data !== 'object') return false;
  
  // Zentren validieren
  if (!data.centers || typeof data.centers !== 'object') return false;
  const requiredCenters: CenterKey[] = ['head', 'ajna', 'throat', 'g', 'heart', 'sacral', 'solar', 'spleen', 'root'];
  for (const center of requiredCenters) {
    if (!data.centers[center] || typeof data.centers[center].defined !== 'boolean') {
      return false;
    }
  }
  
  // Kanäle validieren
  if (!Array.isArray(data.channels)) return false;
  for (const channel of data.channels) {
    if (!channel || typeof channel.from !== 'number' || typeof channel.to !== 'number' || typeof channel.active !== 'boolean') {
      return false;
    }
  }
  
  // Tore validieren
  if (!Array.isArray(data.gates)) return false;
  for (const gate of data.gates) {
    if (!gate || typeof gate.id !== 'number' || typeof gate.active !== 'boolean') {
      return false;
    }
  }
  
  return true;
};

// Utility-Funktionen
export const getDefinedCenters = (data: ChartData): CenterKey[] => {
  return Object.entries(data.centers)
    .filter(([_, center]) => center.defined)
    .map(([key, _]) => key as CenterKey);
};

export const getActiveChannels = (data: ChartData): Array<{ from: number; to: number }> => {
  return data.channels
    .filter(channel => channel.active)
    .map(channel => ({ from: channel.from, to: channel.to }));
};

export const getActiveGates = (data: ChartData): number[] => {
  return data.gates
    .filter(gate => gate.active)
    .map(gate => gate.id);
};

// Konvertierung von alten Formaten
export const convertLegacyChartData = (legacyData: any): ChartData => {
  const chartData = createEmptyChartData();
  
  // Zentren konvertieren
  if (legacyData.definedCenters && Array.isArray(legacyData.definedCenters)) {
    for (const center of legacyData.definedCenters) {
      if (chartData.centers[center as CenterKey]) {
        chartData.centers[center as CenterKey].defined = true;
      }
    }
  }
  
  // Kanäle konvertieren
  if (legacyData.definedChannels && Array.isArray(legacyData.definedChannels)) {
    for (const channelStr of legacyData.definedChannels) {
      const [from, to] = channelStr.split('-').map(Number);
      if (!isNaN(from) && !isNaN(to)) {
        chartData.channels.push({ from, to, active: true });
      }
    }
  }
  
  // Tore konvertieren
  if (legacyData.hdGates && Array.isArray(legacyData.hdGates)) {
    for (const gateId of legacyData.hdGates) {
      if (typeof gateId === 'number' && gateId >= 1 && gateId <= 64) {
        chartData.gates.push({ id: gateId, active: true });
      }
    }
  }
  
  // Metadata konvertieren
  if (legacyData.type) chartData.metadata!.type = legacyData.type;
  if (legacyData.profile) chartData.metadata!.profile = legacyData.profile;
  if (legacyData.authority) chartData.metadata!.authority = legacyData.authority;
  if (legacyData.strategy) chartData.metadata!.strategy = legacyData.strategy;
  
  return chartData;
};

// Deutsche Übersetzungen für Chart-Typen
export const CHART_TYPE_TRANSLATIONS: Record<string, string> = {
  'Generator': 'Generator',
  'Manifestor': 'Manifestor', 
  'Projector': 'Projektor',
  'Reflector': 'Reflektor',
  'Sacral': 'Sakral',
  'Splenic': 'Splenisch',
  'Emotional': 'Emotional',
  'G': 'G-Zentrum',
  'Ego': 'Ego',
  'Throat': 'Kehle',
  'Mental': 'Mental'
};

// Deutsche Übersetzungen für Strategien
export const STRATEGY_TRANSLATIONS: Record<string, string> = {
  'Wait for a question': 'Warten auf eine Frage',
  'Inform': 'Informieren',
  'Wait for an invitation': 'Warten auf eine Einladung',
  'Wait for a lunar cycle': 'Warten auf einen Mondzyklus'
};
