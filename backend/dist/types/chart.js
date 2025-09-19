"use strict";
// Human Design Chart - Schlankes & robustes Daten-Schema
// Nur Zustände (defined/active), keine Positionen/Geometrie
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertLegacyChartData = exports.getActiveGates = exports.getActiveChannels = exports.getDefinedCenters = exports.validateChartData = exports.createEmptyChartData = void 0;
// Hilfsfunktionen für Chart-Daten
const createEmptyChartData = () => ({
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
exports.createEmptyChartData = createEmptyChartData;
// Validierung
const validateChartData = (data) => {
    if (!data || typeof data !== 'object')
        return false;
    // Zentren validieren
    if (!data.centers || typeof data.centers !== 'object')
        return false;
    const requiredCenters = ['head', 'ajna', 'throat', 'g', 'heart', 'sacral', 'solar', 'spleen', 'root'];
    for (const center of requiredCenters) {
        if (!data.centers[center] || typeof data.centers[center].defined !== 'boolean') {
            return false;
        }
    }
    // Kanäle validieren
    if (!Array.isArray(data.channels))
        return false;
    for (const channel of data.channels) {
        if (!channel || typeof channel.from !== 'number' || typeof channel.to !== 'number' || typeof channel.active !== 'boolean') {
            return false;
        }
    }
    // Tore validieren
    if (!Array.isArray(data.gates))
        return false;
    for (const gate of data.gates) {
        if (!gate || typeof gate.id !== 'number' || typeof gate.active !== 'boolean') {
            return false;
        }
    }
    return true;
};
exports.validateChartData = validateChartData;
// Utility-Funktionen
const getDefinedCenters = (data) => {
    return Object.entries(data.centers)
        .filter(([_, center]) => center.defined)
        .map(([key, _]) => key);
};
exports.getDefinedCenters = getDefinedCenters;
const getActiveChannels = (data) => {
    return data.channels
        .filter(channel => channel.active)
        .map(channel => ({ from: channel.from, to: channel.to }));
};
exports.getActiveChannels = getActiveChannels;
const getActiveGates = (data) => {
    return data.gates
        .filter(gate => gate.active)
        .map(gate => gate.id);
};
exports.getActiveGates = getActiveGates;
// Konvertierung von alten Formaten
const convertLegacyChartData = (legacyData) => {
    const chartData = (0, exports.createEmptyChartData)();
    // Zentren konvertieren
    if (legacyData.definedCenters && Array.isArray(legacyData.definedCenters)) {
        for (const center of legacyData.definedCenters) {
            if (chartData.centers[center]) {
                chartData.centers[center].defined = true;
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
    if (legacyData.type)
        chartData.metadata.type = legacyData.type;
    if (legacyData.profile)
        chartData.metadata.profile = legacyData.profile;
    if (legacyData.authority)
        chartData.metadata.authority = legacyData.authority;
    if (legacyData.strategy)
        chartData.metadata.strategy = legacyData.strategy;
    return chartData;
};
exports.convertLegacyChartData = convertLegacyChartData;
