"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedCompatibilityService = void 0;
const localDb_1 = require("../lib/localDb");
class AdvancedCompatibilityService {
    /**
     * Hauptfunktion für erweiterte Kompatibilitätsanalyse
     */
    static async analyzeCompatibility(user1Id, user2Id) {
        try {
            const user1 = await this.getHDProfile(user1Id);
            const user2 = await this.getHDProfile(user2Id);
            if (!user1 || !user2) {
                throw new Error('Benutzerprofile nicht gefunden');
            }
            // Mehrdimensionale Analyse
            const typeCompatibility = this.analyzeTypeCompatibility(user1, user2);
            const centerCompatibility = this.analyzeCenterCompatibility(user1, user2);
            const channelCompatibility = this.analyzeChannelCompatibility(user1, user2);
            const gateCompatibility = this.analyzeGateCompatibility(user1, user2);
            const authorityCompatibility = this.analyzeAuthorityCompatibility(user1, user2);
            const profileCompatibility = this.analyzeProfileCompatibility(user1, user2);
            // Gewichtete Gesamtbewertung
            const breakdown = {
                energeticCompatibility: this.calculateEnergeticCompatibility(user1, user2),
                personalityCompatibility: this.calculatePersonalityCompatibility(user1, user2),
                lifestyleCompatibility: this.calculateLifestyleCompatibility(user1, user2),
                communicationCompatibility: this.calculateCommunicationCompatibility(user1, user2),
                relationshipPotential: this.calculateRelationshipPotential(user1, user2)
            };
            const overallScore = this.calculateOverallScore(breakdown);
            // Stärken und Herausforderungen identifizieren
            const strengths = this.identifyStrengths(user1, user2, breakdown);
            const challenges = this.identifyChallenges(user1, user2, breakdown);
            const recommendations = this.generateRecommendations(user1, user2, breakdown);
            return {
                overallScore,
                breakdown,
                strengths,
                challenges,
                recommendations,
                detailedAnalysis: {
                    typeCompatibility,
                    centerCompatibility,
                    channelCompatibility,
                    gateCompatibility,
                    authorityCompatibility,
                    profileCompatibility
                }
            };
        }
        catch (error) {
            console.error('Fehler bei Kompatibilitätsanalyse:', error);
            throw error;
        }
    }
    /**
     * HD-Profil aus Datenbank laden
     */
    static async getHDProfile(userId) {
        try {
            if (!localDb_1.localDb.db) {
                throw new Error('Datenbank nicht verfügbar');
            }
            const user = localDb_1.localDb.db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
            if (!user) {
                return null;
            }
            // Parse JSON-Felder
            const centers = user.centers ? JSON.parse(user.centers) : {};
            const channels = user.channels ? JSON.parse(user.channels) : {};
            const gates = user.gates ? JSON.parse(user.gates) : {};
            const planets = user.planets ? JSON.parse(user.planets) : {};
            const chartData = user.chart_data ? JSON.parse(user.chart_data) : {};
            // Bestimme definierte/offene Zentren
            const definedCenters = Object.keys(centers).filter(center => centers[center].defined);
            const openCenters = Object.keys(centers).filter(center => !centers[center].defined);
            const undefinedCenters = openCenters; // Alias für Klarheit
            return {
                id: user.id,
                name: user.name,
                hdType: user.hd_type || 'Unknown',
                profile: user.profile || 'Unknown',
                authority: user.authority || 'Unknown',
                strategy: this.getStrategyFromType(user.hd_type),
                definedCenters,
                definedChannels: Object.keys(channels),
                definedGates: Object.keys(gates),
                openCenters,
                undefinedCenters,
                centers,
                channels,
                gates,
                planets,
                chartData
            };
        }
        catch (error) {
            console.error('Fehler beim Laden des HD-Profils:', error);
            return null;
        }
    }
    /**
     * Typ-Kompatibilität analysieren
     */
    static analyzeTypeCompatibility(user1, user2) {
        const typeCompatibilityMatrix = {
            'Generator': {
                'Generator': { score: 85, analysis: 'Zwei Generatoren können sich gegenseitig aufladen und unterstützen.' },
                'Manifesting Generator': { score: 90, analysis: 'Perfekte energetische Ergänzung - Generator liefert Energie, MG bringt Initiative.' },
                'Projector': { score: 95, analysis: 'Klassische Kompatibilität - Generator liefert Energie, Projector führt.' },
                'Manifestor': { score: 70, analysis: 'Kann funktionieren, aber Manifestor braucht mehr Unabhängigkeit.' },
                'Reflector': { score: 60, analysis: 'Reflector kann von Generator-Energie überwältigt werden.' }
            },
            'Manifesting Generator': {
                'Generator': { score: 90, analysis: 'Perfekte energetische Ergänzung - MG bringt Initiative, Generator liefert Energie.' },
                'Manifesting Generator': { score: 80, analysis: 'Zwei MGs können sich gegenseitig inspirieren und antreiben.' },
                'Projector': { score: 85, analysis: 'MG kann Projector führen und Energie liefern.' },
                'Manifestor': { score: 75, analysis: 'Beide sind initiativ, können sich ergänzen.' },
                'Reflector': { score: 65, analysis: 'MG-Energie kann für Reflector zu intensiv sein.' }
            },
            'Projector': {
                'Generator': { score: 95, analysis: 'Klassische Kompatibilität - Projector führt, Generator liefert Energie.' },
                'Manifesting Generator': { score: 85, analysis: 'MG kann Projector führen und Energie liefern.' },
                'Projector': { score: 70, analysis: 'Zwei Projectors brauchen einen Generator für Energie.' },
                'Manifestor': { score: 80, analysis: 'Projector kann Manifestor beraten und führen.' },
                'Reflector': { score: 90, analysis: 'Projector kann Reflector gut lesen und verstehen.' }
            },
            'Manifestor': {
                'Generator': { score: 70, analysis: 'Kann funktionieren, aber Manifestor braucht mehr Unabhängigkeit.' },
                'Manifesting Generator': { score: 75, analysis: 'Beide sind initiativ, können sich ergänzen.' },
                'Projector': { score: 80, analysis: 'Projector kann Manifestor beraten und führen.' },
                'Manifestor': { score: 60, analysis: 'Zwei Manifestors können sich in die Quere kommen.' },
                'Reflector': { score: 65, analysis: 'Manifestor-Energie kann für Reflector zu intensiv sein.' }
            },
            'Reflector': {
                'Generator': { score: 60, analysis: 'Reflector kann von Generator-Energie überwältigt werden.' },
                'Manifesting Generator': { score: 65, analysis: 'MG-Energie kann für Reflector zu intensiv sein.' },
                'Projector': { score: 90, analysis: 'Projector kann Reflector gut lesen und verstehen.' },
                'Manifestor': { score: 65, analysis: 'Manifestor-Energie kann für Reflector zu intensiv sein.' },
                'Reflector': { score: 85, analysis: 'Zwei Reflectors können sich gegenseitig verstehen und unterstützen.' }
            }
        };
        const compatibility = typeCompatibilityMatrix[user1.hdType]?.[user2.hdType] ||
            typeCompatibilityMatrix[user2.hdType]?.[user1.hdType] ||
            { score: 50, analysis: 'Unbekannte Typ-Kombination' };
        return {
            score: compatibility.score,
            analysis: compatibility.analysis,
            benefits: this.getTypeBenefits(user1.hdType, user2.hdType),
            challenges: this.getTypeChallenges(user1.hdType, user2.hdType)
        };
    }
    /**
     * Zentren-Kompatibilität analysieren
     */
    static analyzeCenterCompatibility(user1, user2) {
        const definedCenters = user1.definedCenters.map(center => ({
            center,
            compatibility: this.calculateCenterCompatibility(center, user1, user2),
            analysis: this.getCenterAnalysis(center, user1, user2)
        }));
        const openCenters = user1.openCenters.map(center => ({
            center,
            compatibility: this.calculateOpenCenterCompatibility(center, user1, user2),
            analysis: this.getOpenCenterAnalysis(center, user1, user2)
        }));
        const score = Math.round([...definedCenters, ...openCenters].reduce((sum, item) => sum + item.compatibility, 0) /
            (definedCenters.length + openCenters.length));
        return {
            score,
            definedCenters,
            openCenters
        };
    }
    /**
     * Kanäle-Kompatibilität analysieren
     */
    static analyzeChannelCompatibility(user1, user2) {
        const sharedChannels = user1.definedChannels
            .filter(channel => user2.definedChannels.includes(channel))
            .map(channel => ({
            channel,
            compatibility: 95, // Geteilte Kanäle sind sehr kompatibel
            analysis: `Beide haben den ${channel} Kanal definiert - starke energetische Verbindung`
        }));
        const complementaryChannels = user1.definedChannels
            .filter(channel => !user2.definedChannels.includes(channel))
            .map(channel => ({
            channel,
            compatibility: this.calculateChannelCompatibility(channel, user1, user2),
            analysis: this.getChannelAnalysis(channel, user1, user2)
        }));
        const score = Math.round([...sharedChannels, ...complementaryChannels].reduce((sum, item) => sum + item.compatibility, 0) /
            Math.max(sharedChannels.length + complementaryChannels.length, 1));
        return {
            score,
            sharedChannels,
            complementaryChannels
        };
    }
    /**
     * Tore-Kompatibilität analysieren
     */
    static analyzeGateCompatibility(user1, user2) {
        const sharedGates = user1.definedGates
            .filter(gate => user2.definedGates.includes(gate))
            .map(gate => ({
            gate,
            compatibility: 90,
            analysis: `Beide haben Tor ${gate} aktiviert - gemeinsame energetische Qualität`
        }));
        const complementaryGates = user1.definedGates
            .filter(gate => !user2.definedGates.includes(gate))
            .map(gate => ({
            gate,
            compatibility: this.calculateGateCompatibility(gate, user1, user2),
            analysis: this.getGateAnalysis(gate, user1, user2)
        }));
        const score = Math.round([...sharedGates, ...complementaryGates].reduce((sum, item) => sum + item.compatibility, 0) /
            Math.max(sharedGates.length + complementaryGates.length, 1));
        return {
            score,
            sharedGates,
            complementaryGates
        };
    }
    /**
     * Autorität-Kompatibilität analysieren
     */
    static analyzeAuthorityCompatibility(user1, user2) {
        const authorityCompatibility = this.calculateAuthorityCompatibility(user1.authority, user2.authority);
        return {
            score: authorityCompatibility.score,
            analysis: authorityCompatibility.analysis,
            decisionMaking: this.getDecisionMakingCompatibility(user1.authority, user2.authority),
            communication: this.getCommunicationCompatibility(user1.authority, user2.authority)
        };
    }
    /**
     * Profil-Kompatibilität analysieren
     */
    static analyzeProfileCompatibility(user1, user2) {
        const profileCompatibility = this.calculateProfileCompatibility(user1.profile, user2.profile);
        return {
            score: profileCompatibility.score,
            analysis: profileCompatibility.analysis,
            lifePath: this.getLifePathCompatibility(user1.profile, user2.profile),
            challenges: this.getProfileChallenges(user1.profile, user2.profile),
            growth: this.getProfileGrowth(user1.profile, user2.profile)
        };
    }
    // Hilfsfunktionen für spezifische Berechnungen
    static calculateEnergeticCompatibility(user1, user2) {
        const typeScore = this.analyzeTypeCompatibility(user1, user2).score;
        const centerScore = this.analyzeCenterCompatibility(user1, user2).score;
        const channelScore = this.analyzeChannelCompatibility(user1, user2).score;
        return Math.round((typeScore * 0.4 + centerScore * 0.3 + channelScore * 0.3));
    }
    static calculatePersonalityCompatibility(user1, user2) {
        const profileScore = this.analyzeProfileCompatibility(user1, user2).score;
        const authorityScore = this.analyzeAuthorityCompatibility(user1, user2).score;
        return Math.round((profileScore * 0.6 + authorityScore * 0.4));
    }
    static calculateLifestyleCompatibility(user1, user2) {
        // Basierend auf HD-Typ und Profil
        const typeCompatibility = this.analyzeTypeCompatibility(user1, user2);
        const profileCompatibility = this.analyzeProfileCompatibility(user1, user2);
        return Math.round((typeCompatibility.score * 0.5 + profileCompatibility.score * 0.5));
    }
    static calculateCommunicationCompatibility(user1, user2) {
        const authorityCompatibility = this.analyzeAuthorityCompatibility(user1, user2);
        const typeCompatibility = this.analyzeTypeCompatibility(user1, user2);
        return Math.round((authorityCompatibility.score * 0.6 + typeCompatibility.score * 0.4));
    }
    static calculateRelationshipPotential(user1, user2) {
        const energetic = this.calculateEnergeticCompatibility(user1, user2);
        const personality = this.calculatePersonalityCompatibility(user1, user2);
        const communication = this.calculateCommunicationCompatibility(user1, user2);
        return Math.round((energetic * 0.4 + personality * 0.3 + communication * 0.3));
    }
    static calculateOverallScore(breakdown) {
        const weights = {
            energeticCompatibility: 0.25,
            personalityCompatibility: 0.20,
            lifestyleCompatibility: 0.15,
            communicationCompatibility: 0.20,
            relationshipPotential: 0.20
        };
        return Math.round(Object.keys(weights).reduce((sum, key) => sum + (breakdown[key] * weights[key]), 0));
    }
    static identifyStrengths(user1, user2, breakdown) {
        const strengths = [];
        if (breakdown.energeticCompatibility > 80) {
            strengths.push('Starke energetische Verbindung');
        }
        if (breakdown.communicationCompatibility > 80) {
            strengths.push('Gute Kommunikationskompatibilität');
        }
        if (breakdown.personalityCompatibility > 80) {
            strengths.push('Harmonische Persönlichkeitskombination');
        }
        return strengths;
    }
    static identifyChallenges(user1, user2, breakdown) {
        const challenges = [];
        if (breakdown.energeticCompatibility < 60) {
            challenges.push('Energetische Unterschiede können zu Spannungen führen');
        }
        if (breakdown.communicationCompatibility < 60) {
            challenges.push('Kommunikationsstile unterscheiden sich stark');
        }
        if (breakdown.lifestyleCompatibility < 60) {
            challenges.push('Unterschiedliche Lebensstile erfordern Kompromisse');
        }
        return challenges;
    }
    static generateRecommendations(user1, user2, breakdown) {
        const recommendations = [];
        if (breakdown.energeticCompatibility > 80) {
            recommendations.push('Nutzt eure starke energetische Verbindung für gemeinsame Projekte');
        }
        if (breakdown.communicationCompatibility < 70) {
            recommendations.push('Arbeitet bewusst an eurer Kommunikation und respektiert unterschiedliche Stile');
        }
        if (breakdown.lifestyleCompatibility < 70) {
            recommendations.push('Findet einen Kompromiss zwischen euren unterschiedlichen Lebensstilen');
        }
        return recommendations;
    }
    // Weitere Hilfsfunktionen...
    static getStrategyFromType(hdType) {
        const strategies = {
            'Generator': 'Warten und auf die innere Autorität hören',
            'Manifesting Generator': 'Informieren und dann handeln',
            'Projector': 'Warten auf Einladung',
            'Manifestor': 'Informieren und dann handeln',
            'Reflector': 'Warten auf einen Mondzyklus'
        };
        return strategies[hdType] || 'Unbekannt';
    }
    static getTypeBenefits(type1, type2) {
        // Implementierung für Typ-Vorteile
        return ['Gegenseitige Unterstützung', 'Energische Ergänzung'];
    }
    static getTypeChallenges(type1, type2) {
        // Implementierung für Typ-Herausforderungen
        return ['Unterschiedliche Energien', 'Verschiedene Bedürfnisse'];
    }
    // Weitere Hilfsfunktionen für spezifische Berechnungen...
    static calculateCenterCompatibility(center, user1, user2) {
        // Implementierung für Zentren-Kompatibilität
        return 75;
    }
    static getCenterAnalysis(center, user1, user2) {
        return `Analyse für ${center} Zentrum`;
    }
    static calculateOpenCenterCompatibility(center, user1, user2) {
        return 70;
    }
    static getOpenCenterAnalysis(center, user1, user2) {
        return `Analyse für offenes ${center} Zentrum`;
    }
    static calculateChannelCompatibility(channel, user1, user2) {
        return 80;
    }
    static getChannelAnalysis(channel, user1, user2) {
        return `Analyse für ${channel} Kanal`;
    }
    static calculateGateCompatibility(gate, user1, user2) {
        return 75;
    }
    static getGateAnalysis(gate, user1, user2) {
        return `Analyse für Tor ${gate}`;
    }
    static calculateAuthorityCompatibility(authority1, authority2) {
        return { score: 80, analysis: 'Autoritäts-Kompatibilität' };
    }
    static getDecisionMakingCompatibility(authority1, authority2) {
        return 'Entscheidungsfindung-Kompatibilität';
    }
    static getCommunicationCompatibility(authority1, authority2) {
        return 'Kommunikations-Kompatibilität';
    }
    static calculateProfileCompatibility(profile1, profile2) {
        return { score: 85, analysis: 'Profil-Kompatibilität' };
    }
    static getLifePathCompatibility(profile1, profile2) {
        return 'Lebensweg-Kompatibilität';
    }
    static getProfileChallenges(profile1, profile2) {
        return ['Profil-Herausforderung 1', 'Profil-Herausforderung 2'];
    }
    static getProfileGrowth(profile1, profile2) {
        return ['Wachstumsbereich 1', 'Wachstumsbereich 2'];
    }
}
exports.AdvancedCompatibilityService = AdvancedCompatibilityService;
