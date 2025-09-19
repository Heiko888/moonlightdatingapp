"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prometheus_1 = require("../monitoring/prometheus");
const User_1 = __importDefault(require("../models/User"));
const Chart_1 = __importDefault(require("../models/Chart"));
const Reading_1 = __importDefault(require("../models/Reading"));
const prometheus_2 = require("../monitoring/prometheus");
const router = (0, express_1.Router)();
// Prometheus Metriken Endpoint
router.get('/prometheus', async (req, res) => {
    try {
        // Business-Metriken aktualisieren
        await updateBusinessMetrics();
        // Prometheus-Format exportieren
        const metrics = await (0, prometheus_1.getMetrics)();
        res.set('Content-Type', 'text/plain');
        res.send(metrics);
    }
    catch (error) {
        console.error('[metrics] Error:', error);
        res.status(500).send('Error collecting metrics');
    }
});
// JSON Metriken für Dashboard
router.get('/json', async (req, res) => {
    try {
        await updateBusinessMetrics();
        const metrics = await (0, prometheus_1.getMetrics)();
        const lines = metrics.split('\n');
        const jsonMetrics = {};
        lines.forEach(line => {
            if (line && !line.startsWith('#')) {
                const [metricName, value] = line.split(' ');
                if (metricName && value) {
                    jsonMetrics[metricName] = parseFloat(value);
                }
            }
        });
        res.json({
            timestamp: new Date().toISOString(),
            metrics: jsonMetrics,
            business: await getBusinessMetrics()
        });
    }
    catch (error) {
        console.error('[metrics/json] Error:', error);
        res.status(500).json({ error: 'Error collecting metrics' });
    }
});
// Business-spezifische Metriken
async function updateBusinessMetrics() {
    try {
        // Benutzer-Statistiken
        const userCount = await User_1.default.countDocuments().catch(() => 0);
        prometheus_2.totalUsers.set(userCount);
        // HD Type Verteilung
        const hdTypes = await User_1.default.aggregate([
            { $group: { _id: '$hdType', count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } }
        ]).catch(() => []);
        hdTypes.forEach(({ _id, count }) => {
            prometheus_2.hdTypeDistribution.labels(_id).set(count);
        });
        // Profile Verteilung
        const profiles = await User_1.default.aggregate([
            { $group: { _id: '$profile', count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } }
        ]).catch(() => []);
        profiles.forEach(({ _id, count }) => {
            prometheus_2.profileDistribution.labels(_id).set(count);
        });
    }
    catch (error) {
        console.error('[updateBusinessMetrics] Error:', error);
        // Fallback-Werte setzen
        prometheus_2.totalUsers.set(0);
    }
}
async function getBusinessMetrics() {
    try {
        const [userCount, chartCount, readingCount] = await Promise.all([
            User_1.default.countDocuments().catch(() => 0),
            Chart_1.default.countDocuments().catch(() => 0),
            Reading_1.default.countDocuments().catch(() => 0)
        ]);
        const recentUsers = await User_1.default.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }).catch(() => 0);
        const recentCharts = await Chart_1.default.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }).catch(() => 0);
        return {
            users: {
                total: userCount,
                last24h: recentUsers
            },
            charts: {
                total: chartCount,
                last24h: recentCharts
            },
            readings: {
                total: readingCount
            }
        };
    }
    catch (error) {
        console.error('[getBusinessMetrics] Error:', error);
        return {
            users: { total: 0, last24h: 0 },
            charts: { total: 0, last24h: 0 },
            readings: { total: 0 }
        };
    }
}
exports.default = router;
