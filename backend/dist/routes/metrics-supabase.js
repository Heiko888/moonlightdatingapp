"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prometheus_1 = require("../monitoring/prometheus");
const prometheus_2 = require("../monitoring/prometheus");
const router = express_1.default.Router();
// Prometheus-Metriken exportieren
router.get('/prometheus', async (req, res) => {
    try {
        // Business-Metriken aktualisieren
        await updateBusinessMetrics();
        const metrics = await (0, prometheus_1.getMetrics)();
        res.set('Content-Type', 'text/plain');
        res.send(metrics);
    }
    catch (error) {
        console.error('Fehler beim Exportieren der Metriken:', error);
        res.status(500).send('Fehler beim Exportieren der Metriken');
    }
});
// JSON-Metriken exportieren
router.get('/json', async (req, res) => {
    try {
        // Business-Metriken aktualisieren
        await updateBusinessMetrics();
        const metrics = await (0, prometheus_1.getMetrics)();
        res.json({
            status: 'success',
            timestamp: new Date().toISOString(),
            metrics: metrics
        });
    }
    catch (error) {
        console.error('Fehler beim Exportieren der JSON-Metriken:', error);
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});
// Business-Metriken aktualisieren
async function updateBusinessMetrics() {
    try {
        // Verwende die direkt importierte Datenbank
        // HD Type Distribution - Mock-Daten für Demo
        const hdTypes = [
            { hd_type: 'Generator', count: 15 },
            { hd_type: 'Manifestor', count: 8 },
            { hd_type: 'Projektor', count: 12 },
            { hd_type: 'Reflektor', count: 3 },
            { hd_type: 'Manifestierender Generator', count: 10 }
        ];
        hdTypes.forEach((row) => {
            prometheus_2.hdTypeDistribution.labels(row.hd_type).set(row.count);
        });
        // Profile Distribution - Mock-Daten für Demo
        const profiles = [
            { profile_type: '1/3', count: 5 },
            { profile_type: '2/4', count: 8 },
            { profile_type: '3/5', count: 12 },
            { profile_type: '4/6', count: 6 },
            { profile_type: '5/1', count: 4 }
        ];
        profiles.forEach((row) => {
            prometheus_2.profileDistribution.labels(row.profile_type).set(row.count);
        });
        // Charts Generated - Mock-Daten für Demo
        const chartsCount = { count: 48 };
        // Readings Generated - Mock-Daten für Demo
        const readingsCount = { count: 156 };
        // Active Users (letzte 24h) - Mock-Daten für Demo
        const activeUsers = { count: 23 };
        // Database Operations
        prometheus_2.databaseOperations.labels('select', 'user_profiles').inc(0);
        prometheus_2.databaseOperations.labels('insert', 'charts').inc(0);
        prometheus_2.databaseOperations.labels('update', 'readings').inc(0);
        console.log('✅ Business-Metriken aktualisiert');
    }
    catch (error) {
        console.error('❌ Fehler beim Aktualisieren der Business-Metriken:', error);
    }
}
exports.default = router;
