import { DefinedState, CenterId, GateId } from './types';

export interface ChartData {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  type: 'generator' | 'projector' | 'manifestor' | 'reflector' | 'manifesting-generator';
  profile: string;
  authority: string;
  defined: DefinedState;
  gates: {
    id: GateId;
    line: number;
    conscious: boolean;
    unconscious: boolean;
  }[];
  channels: {
    id: string;
    gates: [GateId, GateId];
    defined: boolean;
  }[];
  centers: {
    id: CenterId;
    defined: boolean;
    gates: GateId[];
  }[];
}

export class ChartService {
  private static baseUrl = 'http://localhost:3005/api/charts'; // Frontend API Route

  // Lade alle verfügbaren Charts
  static async getCharts(): Promise<ChartData[]> {
    // Verwende direkt Demo-Charts, da Backend-Route nicht verfügbar ist
    console.log('Verwende Demo-Charts für Bodygraph-Advanced');
    return this.getDemoCharts();
  }

  // Demo-Charts als Fallback
  static getDemoCharts(): ChartData[] {
    return [
      this.generateDemoChart('generator'),
      this.generateDemoChart('projector'),
      this.generateDemoChart('manifestor'),
      this.generateDemoChart('reflector')
    ];
  }

  // Lade spezifischen Chart
  static async getChart(chartId: string): Promise<ChartData | null> {
    // Verwende Demo-Charts
    const demoCharts = this.getDemoCharts();
    return demoCharts.find(chart => chart.id === chartId) || demoCharts[0] || null;
  }

  // Erstelle neuen Chart
  static async createChart(chartData: Partial<ChartData>): Promise<ChartData | null> {
    // Simuliere Chart-Erstellung mit Demo-Daten
    console.log('Chart-Erstellung simuliert:', chartData);
    return this.generateDemoChart('generator');
  }

  // Aktualisiere Chart
  static async updateChart(chartId: string, chartData: Partial<ChartData>): Promise<ChartData | null> {
    // Simuliere Chart-Update
    console.log('Chart-Update simuliert:', chartId, chartData);
    return this.generateDemoChart('generator');
  }

  // Generiere Beispiel-Chart für Demo
  static generateDemoChart(type: 'generator' | 'projector' | 'manifestor' | 'reflector'): ChartData {
    const baseChart: ChartData = {
      id: `demo-${type}-${Date.now()}`,
      name: `Demo ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      birthDate: '1990-01-01',
      birthTime: '12:00',
      birthPlace: 'Berlin, Deutschland',
      type,
      profile: '1/3',
      authority: 'Sakral',
      defined: {
        centers: {},
        channels: {},
        gates: {}
      },
      gates: [],
      channels: [],
      centers: []
    };

    switch (type) {
      case 'generator':
        baseChart.defined = {
          centers: { SACRAL: true, THROAT: true, G: true },
          channels: { "34-20": true, "1-8": true, "10-20": true },
          gates: { 34: true, 20: true, 1: true, 8: true, 10: true }
        };
        break;
      case 'projector':
        baseChart.defined = {
          centers: { THROAT: true, G: true, AJNA: true },
          channels: { "1-8": true, "11-56": true },
          gates: { 1: true, 8: true, 11: true, 56: true }
        };
        break;
      case 'manifestor':
        baseChart.defined = {
          centers: { THROAT: true, G: true, ROOT: true },
          channels: { "20-34": true, "1-8": true },
          gates: { 20: true, 34: true, 1: true, 8: true }
        };
        break;
      case 'reflector':
        baseChart.defined = {
          centers: {},
          channels: {},
          gates: {}
        };
        break;
    }

    return baseChart;
  }
}
