// localDb entfernt - verwende nur Supabase

// ==================== READING BAUKASTEN-SYSTEM ====================

export interface ReadingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'fixed' | 'variable';
  order: number;
  isActive: boolean;
}

export interface ReadingTemplate {
  id: string;
  name: string;
  description: string;
  modules: string[]; // Array von Module-IDs
  category: 'business' | 'relationship' | 'spiritual' | 'personal' | 'general';
  isActive: boolean;
}

export interface ReadingRequest {
  userId: string;
  templateId: string;
  focus?: string;
  customModules?: string[];
  context?: {
    question?: string;
    situation?: string;
    timeframe?: string;
  };
}

export interface GeneratedReading {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  content: string;
  modules: ReadingModule[];
  createdAt: string;
  isActive: boolean;
}

// ==================== FIXE MODULE (immer dabei) ====================

const FIXED_MODULES: ReadingModule[] = [
  {
    id: 'intro-setting',
    title: 'Einleitung & Setting',
    description: 'Sorgt für Vertrauen & Klarheit',
    content: `Willkommen zu deinem persönlichen Human Design Reading. 

In den nächsten Minuten werden wir gemeinsam deine einzigartige energetische Signatur erkunden. Dieses Reading basiert auf deinem Geburtsdatum, deiner Geburtszeit und deinem Geburtsort und gibt uns Einblicke in deine wahre Natur.

Bitte nimm dir einen ruhigen Moment, atme tief durch und öffne dich für die Weisheit, die heute für dich bereitsteht.`,
    category: 'fixed',
    order: 1,
    isActive: true
  },
  {
    id: 'energetic-overview',
    title: 'Energetischer Überblick',
    description: 'Einstieg, erste Orientierung',
    content: `Dein energetischer Überblick zeigt uns die grundlegenden Aspekte deines Human Design:

**Dein Typ:** [HD_TYPE] - Dies ist deine grundlegende energetische Strategie
**Dein Profil:** [PROFILE] - Deine Lebensrolle und wie du am besten funktionierst
**Deine Autorität:** [AUTHORITY] - Dein innerer Kompass für Entscheidungen

Diese drei Elemente bilden das Fundament deines Human Design und geben dir eine klare Richtung für dein Leben.`,
    category: 'fixed',
    order: 2,
    isActive: true
  },
  {
    id: 'summary-closing',
    title: 'Zusammenfassung & Abschluss',
    description: 'Damit die Person mit Klarheit rausgeht',
    content: `Zusammenfassung deines Readings:

Die wichtigsten Erkenntnisse für dich:
• [KEY_INSIGHT_1]
• [KEY_INSIGHT_2] 
• [KEY_INSIGHT_3]

**Deine nächsten Schritte:**
1. [ACTION_STEP_1]
2. [ACTION_STEP_2]
3. [ACTION_STEP_3]

Denke daran: Human Design ist ein Werkzeug zur Selbstermächtigung. Nutze diese Erkenntnisse, um authentischer zu leben und deine wahre Natur zu entfalten.

Vielen Dank, dass du dir die Zeit für dieses Reading genommen hast.`,
    category: 'fixed',
    order: 99,
    isActive: true
  }
];

// ==================== VARIABLE MODULE (je nach Fokus) ====================

const VARIABLE_MODULES: ReadingModule[] = [
  {
    id: 'core-aspects',
    title: 'Kernaspekte / Hauptthema',
    description: 'Die wichtigsten Aspekte deines Designs',
    content: `**Deine Kernaspekte:**

**Definierte Zentren:** [DEFINED_CENTERS]
Diese Zentren sind konstant aktiv und geben dir Stabilität und Zuverlässigkeit.

**Offene Zentren:** [OPEN_CENTERS] 
Diese Zentren sind deine Lernbereiche - hier sammelst du Weisheit durch Erfahrung.

**Deine definierten Kanäle:** [DEFINED_CHANNELS]
Diese Kanäle zeigen deine natürlichen Talente und Fähigkeiten.

**Deine definierten Tore:** [DEFINED_GATES]
Diese Tore repräsentieren spezifische Aspekte deiner Persönlichkeit.`,
    category: 'variable',
    order: 3,
    isActive: true
  },
  {
    id: 'personal-area',
    title: 'Persönlicher Bereich',
    description: 'Selbstwahrnehmung und persönliche Entwicklung',
    content: `**Dein persönlicher Bereich:**

**Selbstwahrnehmung:**
Dein offenes [OPEN_CENTER] macht dich besonders empfänglich für die Energien anderer. Du lernst hier durch Beobachtung und Erfahrung.

**Deine Stärken:**
• [STRENGTH_1] - basierend auf deinem definierten [CENTER]
• [STRENGTH_2] - durch deinen [CHANNEL]
• [STRENGTH_3] - manifestiert durch dein [GATE]

**Deine Lernaufgaben:**
• [LEARNING_1] - durch dein offenes [CENTER]
• [LEARNING_2] - durch dein offenes [CENTER]
• [LEARNING_3] - durch dein offenes [CENTER]`,
    category: 'variable',
    order: 4,
    isActive: true
  },
  {
    id: 'business-job',
    title: 'Business/Job',
    description: 'Berufliche Orientierung und Arbeitsweise',
    content: `**Deine berufliche Orientierung:**

**Deine Arbeitsweise:**
Als [HD_TYPE] arbeitest du am besten, wenn du [STRATEGY] befolgst. Dein [PROFILE] zeigt dir, wie du am effektivsten in deinem Berufsleben agierst.

**Ideal für dich:**
• [CAREER_1] - nutzt deine natürlichen Talente
• [CAREER_2] - entspricht deiner energetischen Natur
• [CAREER_3] - ermöglicht dir authentisches Handeln

**Deine Führungsqualitäten:**
Dein [DEFINED_CENTER] gibt dir natürliche Autorität in [AREA]. Nutze diese Stärke, um andere zu inspirieren.

**Herausforderungen im Beruf:**
Dein offenes [OPEN_CENTER] kann dich anfällig für [CHALLENGE] machen. Sei dir dessen bewusst und nutze es als Lernchance.`,
    category: 'variable',
    order: 5,
    isActive: true
  },
  {
    id: 'relationship-level',
    title: 'Beziehungsebene',
    description: 'Partnerschaften und zwischenmenschliche Beziehungen',
    content: `**Deine Beziehungsebene:**

**In Partnerschaften:**
Dein [HD_TYPE] zeigt dir, wie du am besten in Beziehungen agierst. Dein [PROFILE] bestimmt, welche Rolle du in Partnerschaften einnimmst.

**Deine Beziehungsstärken:**
• [RELATIONSHIP_STRENGTH_1] - durch dein definiertes [CENTER]
• [RELATIONSHIP_STRENGTH_2] - durch deinen [CHANNEL]
• [RELATIONSHIP_STRENGTH_3] - durch dein [GATE]

**Deine Beziehungsherausforderungen:**
Dein offenes [OPEN_CENTER] kann dich in Beziehungen [CHALLENGE_BEHAVIOR] machen. Erkenne dies als Lernmöglichkeit.

**Kompatibilität:**
Du harmonierst besonders gut mit Menschen, die [COMPATIBILITY_TRAIT] haben, da sie deine offenen Zentren ausgleichen.`,
    category: 'variable',
    order: 6,
    isActive: true
  },
  {
    id: 'spiritual-level',
    title: 'Spirituelle Ebene',
    description: 'Spirituelle Entwicklung und höhere Zwecke',
    content: `**Deine spirituelle Ebene:**

**Dein spiritueller Weg:**
Dein [HD_TYPE] zeigt dir deinen einzigartigen spirituellen Pfad. Dein [PROFILE] bestimmt, wie du spirituelle Weisheit am besten integrierst.

**Deine spirituellen Gaben:**
• [SPIRITUAL_GIFT_1] - manifestiert durch dein [CENTER]
• [SPIRITUAL_GIFT_2] - durch deinen [CHANNEL]
• [SPIRITUAL_GIFT_3] - durch dein [GATE]

**Deine spirituellen Lernaufgaben:**
Dein offenes [OPEN_CENTER] ist dein spiritueller Lernbereich. Hier sammelst du Weisheit durch [LEARNING_METHOD].

**Deine spirituelle Mission:**
Als [HD_TYPE] mit [PROFILE] bist du hier, um [SPIRITUAL_MISSION] zu erfüllen.`,
    category: 'variable',
    order: 7,
    isActive: true
  },
  {
    id: 'impulses-application',
    title: 'Impulse & praktische Anwendung',
    description: 'Konkrete Handlungsempfehlungen',
    content: `**Deine praktischen Impulse:**

**Sofort umsetzbar:**
1. [IMMEDIATE_ACTION_1] - basierend auf deinem [CENTER]
2. [IMMEDIATE_ACTION_2] - durch deinen [CHANNEL]
3. [IMMEDIATE_ACTION_3] - manifestiert durch dein [GATE]

**Diese Woche:**
• [WEEKLY_ACTION_1]
• [WEEKLY_ACTION_2]
• [WEEKLY_ACTION_3]

**Dieser Monat:**
• [MONTHLY_ACTION_1]
• [MONTHLY_ACTION_2]
• [MONTHLY_ACTION_3]

**Deine tägliche Praxis:**
Als [HD_TYPE] solltest du täglich [DAILY_PRACTICE] praktizieren, um in deiner Kraft zu bleiben.`,
    category: 'variable',
    order: 8,
    isActive: true
  }
];

// ==================== READING TEMPLATES ====================

const READING_TEMPLATES: ReadingTemplate[] = [
  {
    id: 'business-reading',
    name: 'Business Reading',
    description: 'Fokus auf berufliche Orientierung und Arbeitsweise',
    modules: ['intro-setting', 'energetic-overview', 'core-aspects', 'business-job', 'impulses-application', 'summary-closing'],
    category: 'business',
    isActive: true
  },
  {
    id: 'relationship-reading',
    name: 'Beziehungs-Reading',
    description: 'Fokus auf Partnerschaften und zwischenmenschliche Beziehungen',
    modules: ['intro-setting', 'energetic-overview', 'core-aspects', 'relationship-level', 'personal-area', 'summary-closing'],
    category: 'relationship',
    isActive: true
  },
  {
    id: 'spiritual-reading',
    name: 'Spirituelles Reading',
    description: 'Fokus auf spirituelle Entwicklung und höhere Zwecke',
    modules: ['intro-setting', 'energetic-overview', 'core-aspects', 'spiritual-level', 'impulses-application', 'summary-closing'],
    category: 'spiritual',
    isActive: true
  },
  {
    id: 'personal-reading',
    name: 'Persönliches Reading',
    description: 'Fokus auf Selbstwahrnehmung und persönliche Entwicklung',
    modules: ['intro-setting', 'energetic-overview', 'core-aspects', 'personal-area', 'impulses-application', 'summary-closing'],
    category: 'personal',
    isActive: true
  },
  {
    id: 'comprehensive-reading',
    name: 'Umfassendes Reading',
    description: 'Vollständiges Reading mit allen Aspekten',
    modules: ['intro-setting', 'energetic-overview', 'core-aspects', 'personal-area', 'business-job', 'relationship-level', 'spiritual-level', 'impulses-application', 'summary-closing'],
    category: 'general',
    isActive: true
  }
];

// ==================== READING SERVICE ====================

export class ReadingService {
  
  // Alle verfügbaren Module abrufen
  static getAllModules(): ReadingModule[] {
    return [...FIXED_MODULES, ...VARIABLE_MODULES];
  }

  // Alle verfügbaren Templates abrufen
  static getAllTemplates(): ReadingTemplate[] {
    return READING_TEMPLATES;
  }

  // Template nach ID abrufen
  static getTemplateById(templateId: string): ReadingTemplate | null {
    return READING_TEMPLATES.find(template => template.id === templateId) || null;
  }

  // Module nach IDs abrufen
  static getModulesByIds(moduleIds: string[]): ReadingModule[] {
    const allModules = this.getAllModules();
    return moduleIds.map(id => allModules.find(module => module.id === id)).filter(Boolean) as ReadingModule[];
  }

  // Reading generieren
  static async generateReading(request: ReadingRequest): Promise<GeneratedReading> {
    const template = this.getTemplateById(request.templateId);
    if (!template) {
      throw new Error(`Template mit ID ${request.templateId} nicht gefunden`);
    }

    // Benutzerdaten abrufen
    const user = localDb.getUserById(request.userId);
    if (!user) {
      throw new Error(`Benutzer mit ID ${request.userId} nicht gefunden`);
    }

    // Module für das Reading zusammenstellen
    let moduleIds = template.modules;
    if (request.customModules && request.customModules.length > 0) {
      moduleIds = [...template.modules, ...request.customModules];
    }

    const modules = this.getModulesByIds(moduleIds);
    
    // Reading-Inhalt generieren
    const readingContent = await this.generateReadingContent(user, modules, request.context);
    
    // Reading in Datenbank speichern
    const readingId = Math.random().toString(36).substr(2, 9);
    const reading: GeneratedReading = {
      id: readingId,
      userId: request.userId,
      templateId: request.templateId,
      title: `${template.name} - ${new Date().toLocaleDateString('de-DE')}`,
      content: readingContent,
      modules: modules,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // TODO: Reading in Datenbank speichern
    // await this.saveReading(reading);

    return reading;
  }

  // Reading-Inhalt generieren
  private static async generateReadingContent(user: any, modules: ReadingModule[], context?: any): Promise<string> {
    let content = '';
    
    // Benutzerdaten parsen
    const userData = {
      hdType: user.hd_type || 'Nicht definiert',
      profile: user.profile || 'Nicht definiert',
      centers: user.centers ? JSON.parse(user.centers) : {},
      channels: user.channels ? JSON.parse(user.channels) : {},
      gates: user.gates ? JSON.parse(user.gates) : {},
      planets: user.planets ? JSON.parse(user.planets) : {}
    };

    // Module durchgehen und Inhalt generieren
    for (const module of modules.sort((a, b) => a.order - b.order)) {
      content += `\n\n## ${module.title}\n\n`;
      
      // Platzhalter ersetzen
      let moduleContent = module.content;
      moduleContent = this.replacePlaceholders(moduleContent, userData, context);
      
      content += moduleContent;
    }

    return content;
  }

  // Platzhalter ersetzen
  private static replacePlaceholders(content: string, userData: any, context?: any): string {
    let result = content;
    
    // Grundlegende Platzhalter
    result = result.replace(/\[HD_TYPE\]/g, userData.hdType);
    result = result.replace(/\[PROFILE\]/g, userData.profile);
    result = result.replace(/\[AUTHORITY\]/g, this.getAuthority(userData.hdType));
    
    // Zentren
    result = result.replace(/\[DEFINED_CENTERS\]/g, this.getDefinedCenters(userData.centers));
    result = result.replace(/\[OPEN_CENTERS\]/g, this.getOpenCenters(userData.centers));
    
    // Kanäle und Tore
    result = result.replace(/\[DEFINED_CHANNELS\]/g, this.getDefinedChannels(userData.channels));
    result = result.replace(/\[DEFINED_GATES\]/g, this.getDefinedGates(userData.gates));
    
    // Kontext-spezifische Platzhalter
    if (context?.question) {
      result = result.replace(/\[CONTEXT_QUESTION\]/g, context.question);
    }
    
    // Weitere Platzhalter basierend auf dem Inhalt generieren
    result = this.generateDynamicContent(result, userData);
    
    return result;
  }

  // Dynamischen Inhalt generieren
  private static generateDynamicContent(content: string, userData: any): string {
    let result = content;
    
    // Beispiel-Ersetzungen (in einer echten Implementierung würden diese aus einer Wissensdatenbank kommen)
    result = result.replace(/\[KEY_INSIGHT_1\]/g, `Dein ${userData.hdType} zeigt dir deine natürliche Strategie`);
    result = result.replace(/\[KEY_INSIGHT_2\]/g, `Dein ${userData.profile} bestimmt deine Lebensrolle`);
    result = result.replace(/\[KEY_INSIGHT_3\]/g, 'Nutze deine definierten Zentren als Stärke');
    
    result = result.replace(/\[ACTION_STEP_1\]/g, 'Beobachte deine offenen Zentren');
    result = result.replace(/\[ACTION_STEP_2\]/g, 'Folge deiner inneren Autorität');
    result = result.replace(/\[ACTION_STEP_3\]/g, 'Lebe deine Strategie');
    
    return result;
  }

  // Hilfsfunktionen
  private static getAuthority(hdType: string): string {
    const authorities: { [key: string]: string } = {
      'Manifestor': 'Willensautorität',
      'Generator': 'Sakrale Autorität',
      'Manifesting Generator': 'Sakrale Autorität',
      'Projector': 'Emotionale/Sakrale/Willensautorität',
      'Reflector': 'Mondautorität'
    };
    return authorities[hdType] || 'Emotionale Autorität';
  }

  private static getDefinedCenters(centers: any): string {
    if (!centers || typeof centers !== 'object') return 'Keine definierten Zentren';
    const defined = Object.keys(centers).filter(key => centers[key] === true);
    return defined.length > 0 ? defined.join(', ') : 'Keine definierten Zentren';
  }

  private static getOpenCenters(centers: any): string {
    if (!centers || typeof centers !== 'object') return 'Keine offenen Zentren';
    const open = Object.keys(centers).filter(key => centers[key] === false);
    return open.length > 0 ? open.join(', ') : 'Keine offenen Zentren';
  }

  private static getDefinedChannels(channels: any): string {
    if (!channels || typeof channels !== 'object') return 'Keine definierten Kanäle';
    const defined = Object.keys(channels).filter(key => channels[key] === true);
    return defined.length > 0 ? defined.join(', ') : 'Keine definierten Kanäle';
  }

  private static getDefinedGates(gates: any): string {
    if (!gates || typeof gates !== 'object') return 'Keine definierten Tore';
    const defined = Object.keys(gates).filter(key => gates[key] === true);
    return defined.length > 0 ? defined.join(', ') : 'Keine definierten Tore';
  }
}

export default ReadingService;
