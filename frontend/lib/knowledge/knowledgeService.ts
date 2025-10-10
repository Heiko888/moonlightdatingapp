export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  readTime: string;
  difficulty: 'Anfänger' | 'Mittel' | 'Fortgeschritten';
}

export interface KnowledgeResponse {
  success: boolean;
  data: KnowledgeEntry[];
  count: number;
}

export interface KnowledgeSingleResponse {
  success: boolean;
  data: KnowledgeEntry;
}

export interface KnowledgeSearchResponse {
  success: boolean;
  data: KnowledgeEntry[];
  count: number;
  query: string;
}

export interface KnowledgeCategoriesResponse {
  success: boolean;
  data: string[];
}

export class KnowledgeService {
  private static baseUrl = 'http://localhost:3005/api/knowledge'; // Frontend API Route

  // Alle Knowledge-Entries abrufen
  static async getKnowledgeEntries(): Promise<KnowledgeEntry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/`);
      const result: KnowledgeResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Fehler beim Abrufen der Knowledge-Entries');
      }
      
      return result.data;
    } catch (error) {
      console.error('Backend nicht verfügbar, verwende Demo-Daten:', error);
      // Fallback zu Demo-Daten
      return this.getDemoKnowledgeEntries();
    }
  }

  // Einzelnen Knowledge-Entry abrufen
  static async getKnowledgeEntry(id: string): Promise<KnowledgeEntry | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const result: KnowledgeSingleResponse = await response.json();
      
      if (!result.success) {
        return null;
      }
      
      return result.data;
    } catch (error) {
      console.error('Fehler beim Abrufen des Knowledge-Entries:', error);
      return null;
    }
  }

  // Neuen Knowledge-Entry erstellen
  static async createKnowledgeEntry(entry: Partial<KnowledgeEntry>): Promise<KnowledgeEntry | null> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      
      const result: KnowledgeSingleResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Fehler beim Erstellen des Knowledge-Entries');
      }
      
      return result.data;
    } catch (error) {
      console.error('Fehler beim Erstellen des Knowledge-Entries:', error);
      return null;
    }
  }

  // Knowledge-Entry aktualisieren
  static async updateKnowledgeEntry(id: string, entry: Partial<KnowledgeEntry>): Promise<KnowledgeEntry | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      
      const result: KnowledgeSingleResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Fehler beim Aktualisieren des Knowledge-Entries');
      }
      
      return result.data;
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Knowledge-Entries:', error);
      return null;
    }
  }

  // Favoriten-Status umschalten
  static async toggleFavorite(id: string): Promise<KnowledgeEntry | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/favorite`, {
        method: 'PATCH',
      });
      
      const result: KnowledgeSingleResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Fehler beim Umschalten des Favoriten-Status');
      }
      
      return result.data;
    } catch (error) {
      console.error('Backend nicht verfügbar, simuliere Favoriten-Update:', error);
      // Fallback: Simuliere Favoriten-Update mit Demo-Daten
      const demoEntries = this.getDemoKnowledgeEntries();
      const entry = demoEntries.find(e => e.id === id);
      if (entry) {
        return { ...entry, isFavorite: !entry.isFavorite };
      }
      return null;
    }
  }

  // Knowledge-Entry löschen
  static async deleteKnowledgeEntry(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Fehler beim Löschen des Knowledge-Entries:', error);
      return false;
    }
  }

  // Kategorien abrufen
  static async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/meta/categories`);
      const result: KnowledgeCategoriesResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Fehler beim Abrufen der Kategorien');
      }
      
      return result.data;
    } catch (error) {
      console.error('Fehler beim Abrufen der Kategorien:', error);
      return ['Grundlagen', 'Typen', 'Mondkalender', 'Chakren', 'Profile', 'Autorität'];
    }
  }

  // Suche in Knowledge-Entries
  static async searchKnowledgeEntries(query: string): Promise<KnowledgeEntry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/${encodeURIComponent(query)}`);
      const result: KnowledgeSearchResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Fehler bei der Suche');
      }
      
      return result.data;
    } catch (error) {
      console.error('Fehler bei der Suche:', error);
      // Fallback: Lokale Suche in Demo-Daten
      const demoEntries = this.getDemoKnowledgeEntries();
      return demoEntries.filter(entry => 
        entry.title.toLowerCase().includes(query.toLowerCase()) ||
        entry.content.toLowerCase().includes(query.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        entry.category.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  // Demo-Daten als Fallback
  private static getDemoKnowledgeEntries(): KnowledgeEntry[] {
    return [
      {
        id: 'demo-1',
        title: 'Grundlagen des Human Design',
        content: 'Human Design ist ein System, das Astrologie, I-Ching, Kabbalah und Chakren kombiniert, um deine einzigartige energetische Blaupause zu enthüllen.',
        category: 'Grundlagen',
        tags: ['Human Design', 'Energetik', 'Persönlichkeit'],
        isFavorite: true,
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z',
        author: 'System',
        readTime: '5 Min',
        difficulty: 'Anfänger'
      },
      {
        id: 'demo-2',
        title: 'Die vier Human Design Typen',
        content: 'Es gibt vier Haupttypen: Manifestoren, Generatoren, Projektoren und Reflektoren. Jeder Typ hat eine spezifische Strategie und Autorität.',
        category: 'Typen',
        tags: ['Typen', 'Strategie', 'Autorität'],
        isFavorite: false,
        createdAt: '2024-01-20T00:00:00.000Z',
        updatedAt: '2024-01-20T00:00:00.000Z',
        author: 'System',
        readTime: '8 Min',
        difficulty: 'Anfänger'
      },
      {
        id: 'demo-3',
        title: 'Mondphasen und Energie',
        content: 'Die verschiedenen Mondphasen beeinflussen unsere Energie und unser Wohlbefinden. Lerne, wie du mit den Mondzyklen im Einklang leben kannst.',
        category: 'Mondkalender',
        tags: ['Mond', 'Energie', 'Zyklus'],
        isFavorite: true,
        createdAt: '2024-01-25T00:00:00.000Z',
        updatedAt: '2024-01-25T00:00:00.000Z',
        author: 'System',
        readTime: '6 Min',
        difficulty: 'Mittel'
      },
      {
        id: 'demo-4',
        title: 'Chakren und Human Design',
        content: 'Die neun Zentren im Human Design entsprechen den traditionellen Chakren und zeigen, wo du definiert oder offen bist.',
        category: 'Chakren',
        tags: ['Chakren', 'Zentren', 'Energie'],
        isFavorite: false,
        createdAt: '2024-02-01T00:00:00.000Z',
        updatedAt: '2024-02-01T00:00:00.000Z',
        author: 'System',
        readTime: '7 Min',
        difficulty: 'Mittel'
      }
    ];
  }
}
