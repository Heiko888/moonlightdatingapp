"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// WebSocket-Verbindungen für Live-Analyse
const activeConnections = new Map();
// POST /realtime-analysis/analyze - Echtzeit-Analyse zwischen zwei Charts
router.post('/analyze', async (req, res) => {
    try {
        const { chart1, chart2 } = req.body;
        if (!chart1 || !chart2) {
            return res.status(400).json({ error: 'Beide Charts sind erforderlich' });
        }
        // Führe umfassende Analyse durch
        const analysis = await performComprehensiveAnalysis(chart1, chart2);
        const result = {
            timestamp: Date.now(),
            analysis,
            confidence: calculateConfidence(analysis),
            insights: generateInsights(analysis)
        };
        res.json(result);
    }
    catch (error) {
        console.error('Fehler bei der Echtzeit-Analyse:', error);
        res.status(500).json({ error: 'Fehler bei der Analyse' });
    }
});
// WebSocket für Live-Analyse (wird in server-supabase.ts implementiert)
// router.ws('/live', ...) - WebSocket wird separat im Server eingerichtet
// Umfassende Analyse durchführen
async function performComprehensiveAnalysis(chart1, chart2) {
    // Basis-Kompatibilität
    const compatibilityScore = calculateBaseCompatibility(chart1, chart2);
    // Energetische Dynamiken
    const energeticDynamics = calculateEnergeticDynamics(chart1, chart2);
    // Zentren-Interaktionen
    const centerInteractions = analyzeCenterInteractions(chart1, chart2);
    // Kanal-Resonanz
    const channelResonance = analyzeChannelResonance(chart1, chart2);
    // Tor-Interaktionen
    const gateInteractions = analyzeGateInteractions(chart1, chart2);
    // Beziehungs-Wahrscheinlichkeit
    const relationshipProbability = calculateRelationshipProbability(compatibilityScore, energeticDynamics, centerInteractions);
    // Empfehlungen
    const recommendations = generateRecommendations(energeticDynamics, centerInteractions, channelResonance);
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
function calculateBaseCompatibility(chart1, chart2) {
    let score = 0;
    // HD-Typ Kompatibilität (30%)
    const typeCompatibility = getTypeCompatibility(chart1.type, chart2.type);
    score += typeCompatibility * 0.3;
    // Profil-Kompatibilität (25%)
    const profileCompatibility = getProfileCompatibility(chart1.profile, chart2.profile);
    score += profileCompatibility * 0.25;
    // Autorität-Kompatibilität (20%)
    const authorityCompatibility = getAuthorityCompatibility(chart1.authority, chart2.authority);
    score += authorityCompatibility * 0.2;
    // Zentren-Kompatibilität (15%)
    const centerCompatibility = getCenterCompatibility(chart1.centers, chart2.centers);
    score += centerCompatibility * 0.15;
    // Kanal-Kompatibilität (10%)
    const channelCompatibility = getChannelCompatibility(chart1.channels, chart2.channels);
    score += channelCompatibility * 0.1;
    return Math.min(100, Math.max(0, score));
}
// Energetische Dynamiken berechnen
function calculateEnergeticDynamics(chart1, chart2) {
    const attraction = calculateAttraction(chart1, chart2);
    const harmony = calculateHarmony(chart1, chart2);
    const challenge = calculateChallenge(chart1, chart2);
    const growth = calculateGrowth(chart1, chart2);
    return {
        attraction: Math.min(100, Math.max(0, attraction)),
        harmony: Math.min(100, Math.max(0, harmony)),
        challenge: Math.min(100, Math.max(0, challenge)),
        growth: Math.min(100, Math.max(0, growth))
    };
}
// Anziehungskraft berechnen
function calculateAttraction(chart1, chart2) {
    let attraction = 50; // Basis-Anziehung
    // Komplementäre Zentren erhöhen Anziehung
    const complementaryCenters = getComplementaryCenters(chart1.centers, chart2.centers);
    attraction += complementaryCenters.length * 8;
    // Verschiedene HD-Typen haben oft mehr Anziehung
    if (chart1.type !== chart2.type) {
        attraction += 15;
    }
    // Bestimmte Profil-Kombinationen
    const profileAttraction = getProfileAttraction(chart1.profile, chart2.profile);
    attraction += profileAttraction;
    // Mond-Transite berücksichtigen (falls verfügbar)
    if (chart1.planets && chart2.planets) {
        const moonTransit = getMoonTransitInfluence(chart1.planets, chart2.planets);
        attraction += moonTransit;
    }
    return attraction;
}
// Harmonie berechnen
function calculateHarmony(chart1, chart2) {
    let harmony = 50;
    // Ähnliche Autoritäten
    if (chart1.authority === chart2.authority) {
        harmony += 20;
    }
    // Kompatible Strategien
    const strategyHarmony = getStrategyHarmony(chart1.strategy, chart2.strategy);
    harmony += strategyHarmony;
    // Gemeinsame Kanäle
    const sharedChannels = getSharedChannels(chart1.channels, chart2.channels);
    harmony += sharedChannels.length * 5;
    // Komplementäre Zentren
    const complementaryCenters = getComplementaryCenters(chart1.centers, chart2.centers);
    harmony += complementaryCenters.length * 3;
    return harmony;
}
// Herausforderung berechnen
function calculateChallenge(chart1, chart2) {
    let challenge = 30; // Basis-Herausforderung
    // Konfliktierende Zentren
    const conflictingCenters = getConflictingCenters(chart1.centers, chart2.centers);
    challenge += conflictingCenters.length * 10;
    // Verschiedene HD-Typen können herausfordernd sein
    if (chart1.type === 'Manifestor' && chart2.type === 'Projector') {
        challenge += 15;
    }
    else if (chart1.type === 'Projector' && chart2.type === 'Manifestor') {
        challenge += 15;
    }
    else if (chart1.type === 'Reflector' && chart2.type !== 'Reflector') {
        challenge += 10;
    }
    // Konfliktierende Kanäle
    const conflictingChannels = getConflictingChannels(chart1.channels, chart2.channels);
    challenge += conflictingChannels.length * 8;
    return challenge;
}
// Wachstumspotential berechnen
function calculateGrowth(chart1, chart2) {
    let growth = 40;
    // Komplementäre Zentren fördern Wachstum
    const complementaryCenters = getComplementaryCenters(chart1.centers, chart2.centers);
    growth += complementaryCenters.length * 6;
    // Verschiedene Profile fördern Wachstum
    if (chart1.profile !== chart2.profile) {
        growth += 10;
    }
    // Bestimmte Kanal-Kombinationen
    const growthChannels = getGrowthChannels(chart1.channels, chart2.channels);
    growth += growthChannels.length * 8;
    // Verschiedene HD-Typen fördern Wachstum
    if (chart1.type !== chart2.type) {
        growth += 5;
    }
    return growth;
}
// Zentren-Interaktionen analysieren
function analyzeCenterInteractions(chart1, chart2) {
    const centers1 = Object.keys(chart1.centers || {}).filter(key => chart1.centers[key]);
    const centers2 = Object.keys(chart2.centers || {}).filter(key => chart2.centers[key]);
    const complementary = centers1.filter(center => !centers2.includes(center));
    const conflicting = getConflictingCenters(chart1.centers, chart2.centers);
    const neutral = centers1.filter(center => centers2.includes(center));
    return {
        complementary,
        conflicting,
        neutral
    };
}
// Kanal-Resonanz analysieren
function analyzeChannelResonance(chart1, chart2) {
    const channels1 = Object.keys(chart1.channels || {}).filter(key => chart1.channels[key]);
    const channels2 = Object.keys(chart2.channels || {}).filter(key => chart2.channels[key]);
    const shared = channels1.filter(channel => channels2.includes(channel));
    const complementary = getComplementaryChannels(chart1.channels, chart2.channels);
    const conflicting = getConflictingChannels(chart1.channels, chart2.channels);
    return {
        shared,
        complementary,
        conflicting
    };
}
// Tor-Interaktionen analysieren
function analyzeGateInteractions(chart1, chart2) {
    const gates1 = Object.keys(chart1.gates || {}).filter(key => chart1.gates[key]);
    const gates2 = Object.keys(chart2.gates || {}).filter(key => chart2.gates[key]);
    const harmonious = getHarmoniousGates(gates1, gates2);
    const challenging = getChallengingGates(gates1, gates2);
    const neutral = gates1.filter(gate => gates2.includes(gate));
    return {
        harmonious,
        challenging,
        neutral
    };
}
// Beziehungs-Wahrscheinlichkeit berechnen
function calculateRelationshipProbability(compatibility, dynamics, centerInteractions) {
    let probability = compatibility * 0.4;
    // Energetische Dynamiken
    probability += dynamics.attraction * 0.2;
    probability += dynamics.harmony * 0.2;
    probability -= dynamics.challenge * 0.1;
    probability += dynamics.growth * 0.1;
    // Zentren-Interaktionen
    const totalInteractions = centerInteractions.complementary.length +
        centerInteractions.conflicting.length + centerInteractions.neutral.length;
    if (totalInteractions > 0) {
        const complementaryRatio = centerInteractions.complementary.length / totalInteractions;
        probability += complementaryRatio * 20;
    }
    return Math.min(100, Math.max(0, probability));
}
// Empfehlungen generieren
function generateRecommendations(dynamics, centerInteractions, channelResonance) {
    const strengths = [];
    const challenges = [];
    const advice = [];
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
    if (channelResonance.shared.length > 0) {
        strengths.push("Gemeinsame Kanäle stärken eure Verbindung");
    }
    // Herausforderungen
    if (dynamics.challenge > 60) {
        challenges.push("Herausfordernde energetische Dynamiken");
    }
    if (centerInteractions.conflicting.length > 2) {
        challenges.push("Einige Zentren können Konflikte verursachen");
    }
    if (channelResonance.conflicting.length > 0) {
        challenges.push("Konfliktierende Kanäle erfordern bewusste Kommunikation");
    }
    // Ratschläge
    if (dynamics.growth > 70) {
        advice.push("Nutzt euer hohes Wachstumspotential gemeinsam");
    }
    if (channelResonance.shared.length > 0) {
        advice.push("Gemeinsame Kanäle können eure Verbindung stärken");
    }
    if (centerInteractions.complementary.length > 0) {
        advice.push("Komplementäre Zentren bieten Lernmöglichkeiten");
    }
    if (dynamics.challenge > 50) {
        advice.push("Herausforderungen können zu persönlichem Wachstum führen");
    }
    return { strengths, challenges, advice };
}
// Hilfsfunktionen
function getTypeCompatibility(type1, type2) {
    const compatibilityMatrix = {
        'Generator': { 'Generator': 70, 'Manifesting Generator': 80, 'Projector': 60, 'Manifestor': 50, 'Reflector': 40 },
        'Manifesting Generator': { 'Generator': 80, 'Manifesting Generator': 70, 'Projector': 65, 'Manifestor': 55, 'Reflector': 45 },
        'Projector': { 'Generator': 60, 'Manifesting Generator': 65, 'Projector': 75, 'Manifestor': 40, 'Reflector': 50 },
        'Manifestor': { 'Generator': 50, 'Manifesting Generator': 55, 'Projector': 40, 'Manifestor': 60, 'Reflector': 35 },
        'Reflector': { 'Generator': 40, 'Manifesting Generator': 45, 'Projector': 50, 'Manifestor': 35, 'Reflector': 80 }
    };
    return compatibilityMatrix[type1]?.[type2] || 50;
}
function getProfileCompatibility(profile1, profile2) {
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
function getAuthorityCompatibility(auth1, auth2) {
    if (auth1 === auth2)
        return 70;
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
function getCenterCompatibility(centers1, centers2) {
    const centers1List = Object.keys(centers1 || {}).filter(key => centers1[key]);
    const centers2List = Object.keys(centers2 || {}).filter(key => centers2[key]);
    const complementary = centers1List.filter(center => !centers2List.includes(center));
    const shared = centers1List.filter(center => centers2List.includes(center));
    return (complementary.length * 10) + (shared.length * 5);
}
function getChannelCompatibility(channels1, channels2) {
    const channels1List = Object.keys(channels1 || {}).filter(key => channels1[key]);
    const channels2List = Object.keys(channels2 || {}).filter(key => channels2[key]);
    const shared = channels1List.filter(channel => channels2List.includes(channel));
    return shared.length * 8;
}
function getComplementaryCenters(centers1, centers2) {
    const centers1List = Object.keys(centers1 || {}).filter(key => centers1[key]);
    const centers2List = Object.keys(centers2 || {}).filter(key => centers2[key]);
    return centers1List.filter(center => !centers2List.includes(center));
}
function getConflictingCenters(centers1, centers2) {
    const conflictingPairs = [
        ['Head', 'Ajna'],
        ['Throat', 'G'],
        ['Heart', 'Solar']
    ];
    const centers1List = Object.keys(centers1 || {}).filter(key => centers1[key]);
    const centers2List = Object.keys(centers2 || {}).filter(key => centers2[key]);
    const conflicts = [];
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
function getProfileAttraction(profile1, profile2) {
    const p1 = parseInt(profile1.split('/')[0]);
    const p2 = parseInt(profile2.split('/')[0]);
    if ((p1 === 1 && p2 === 3) || (p1 === 3 && p2 === 1))
        return 20;
    if ((p1 === 2 && p2 === 4) || (p1 === 4 && p2 === 2))
        return 25;
    if ((p1 === 5 && p2 === 1) || (p1 === 1 && p2 === 5))
        return 15;
    return 0;
}
function getStrategyHarmony(strategy1, strategy2) {
    if (strategy1 === strategy2)
        return 15;
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
function getSharedChannels(channels1, channels2) {
    const channels1List = Object.keys(channels1 || {}).filter(key => channels1[key]);
    const channels2List = Object.keys(channels2 || {}).filter(key => channels2[key]);
    return channels1List.filter(channel => channels2List.includes(channel));
}
function getComplementaryChannels(channels1, channels2) {
    // Erweiterte komplementäre Kanal-Erkennung
    return [];
}
function getConflictingChannels(channels1, channels2) {
    // Erweiterte Konflikt-Kanal-Erkennung
    return [];
}
function getGrowthChannels(channels1, channels2) {
    // Kanäle die Wachstum fördern
    return [];
}
function getHarmoniousGates(gates1, gates2) {
    // Harmonische Tor-Kombinationen
    return [];
}
function getChallengingGates(gates1, gates2) {
    // Herausfordernde Tor-Kombinationen
    return [];
}
function getMoonTransitInfluence(planets1, planets2) {
    // Mond-Transit-Einfluss auf Anziehung
    return 0; // Vereinfacht
}
function calculateConfidence(analysis) {
    // Berechne Vertrauen in die Analyse basierend auf Datenqualität
    let confidence = 0.7; // Basis-Vertrauen
    if (analysis.energeticDynamics.attraction > 0)
        confidence += 0.1;
    if (analysis.centerInteractions.complementary.length > 0)
        confidence += 0.1;
    if (analysis.channelResonance.shared.length > 0)
        confidence += 0.1;
    return Math.min(1.0, confidence);
}
function generateInsights(analysis) {
    const insights = [];
    if (analysis.compatibilityScore > 80) {
        insights.push("Sehr hohe Kompatibilität - eine starke energetische Verbindung");
    }
    else if (analysis.compatibilityScore > 60) {
        insights.push("Gute Kompatibilität mit Potenzial für eine harmonische Beziehung");
    }
    else if (analysis.compatibilityScore > 40) {
        insights.push("Moderate Kompatibilität - Raum für Wachstum und Entwicklung");
    }
    else {
        insights.push("Herausfordernde Kompatibilität - erfordert bewusste Arbeit");
    }
    if (analysis.energeticDynamics.attraction > 70) {
        insights.push("Starke energetische Anziehung zwischen den Charts");
    }
    if (analysis.energeticDynamics.growth > 70) {
        insights.push("Hohes Wachstumspotential in dieser Verbindung");
    }
    if (analysis.relationshipProbability > 80) {
        insights.push("Hohe Wahrscheinlichkeit für eine erfolgreiche Beziehung");
    }
    return insights;
}
// Live-Analyse starten
async function startLiveAnalysis(connectionId, chart1, chart2) {
    const ws = activeConnections.get(connectionId);
    if (!ws)
        return;
    // Sende initiale Analyse
    const initialAnalysis = await performComprehensiveAnalysis(chart1, chart2);
    ws.send(JSON.stringify({
        type: 'analysis_update',
        result: {
            timestamp: Date.now(),
            analysis: initialAnalysis,
            confidence: calculateConfidence(initialAnalysis),
            insights: generateInsights(initialAnalysis)
        }
    }));
    // Simuliere Live-Updates (alle 5 Sekunden)
    const interval = setInterval(async () => {
        if (!activeConnections.has(connectionId)) {
            clearInterval(interval);
            return;
        }
        // Simuliere kleine Änderungen in der Analyse
        const updatedAnalysis = await performComprehensiveAnalysis(chart1, chart2);
        ws.send(JSON.stringify({
            type: 'analysis_update',
            result: {
                timestamp: Date.now(),
                analysis: updatedAnalysis,
                confidence: calculateConfidence(updatedAnalysis),
                insights: generateInsights(updatedAnalysis)
            }
        }));
    }, 5000);
}
// Live-Analyse stoppen
function stopLiveAnalysis(connectionId) {
    activeConnections.delete(connectionId);
}
// Verbindungs-ID generieren
function generateConnectionId() {
    return Math.random().toString(36).substr(2, 9);
}
exports.default = router;
