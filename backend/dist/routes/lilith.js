"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lilithDb_1 = require("../lib/lilithDb");
const insertLilithGatesData_1 = require("../scripts/insertLilithGatesData");
const updateLilithGates6to20_1 = require("../scripts/updateLilithGates6to20");
const updateLilithGates21to30_1 = require("../scripts/updateLilithGates21to30");
const updateLilithGates32to40_1 = require("../scripts/updateLilithGates32to40");
const updateLilithGates41to50_1 = require("../scripts/updateLilithGates41to50");
const updateLilithGates51to64_1 = require("../scripts/updateLilithGates51to64");
const updateLilithGate31_1 = require("../scripts/updateLilithGate31");
const updateLilithGatesUnconscious1to20_1 = require("../scripts/updateLilithGatesUnconscious1to20");
const updateLilithGatesUnconscious21to40_1 = require("../scripts/updateLilithGatesUnconscious21to40");
const updateLilithGatesUnconscious41to60_1 = require("../scripts/updateLilithGatesUnconscious41to60");
const updateLilithGatesUnconscious61to64_1 = require("../scripts/updateLilithGatesUnconscious61to64");
const router = (0, express_1.Router)();
// Lilith Grundinformationen
router.get('/info', (req, res) => {
    try {
        const lilithInfo = (0, lilithDb_1.getLilithInfo)();
        if (!lilithInfo) {
            return res.status(404).json({ error: 'Lilith Informationen nicht gefunden' });
        }
        res.json(lilithInfo);
    }
    catch (error) {
        console.error('Fehler beim Abrufen der Lilith-Informationen:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});
// Alle Lilith Centers
router.get('/centers', (req, res) => {
    try {
        const centers = (0, lilithDb_1.getAllLilithCenters)();
        res.json(centers);
    }
    catch (error) {
        console.error('Fehler beim Abrufen der Lilith Centers:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});
// Spezifisches Lilith Center
router.get('/centers/:centerName', (req, res) => {
    try {
        const { centerName } = req.params;
        const center = (0, lilithDb_1.getLilithCenter)(centerName.toUpperCase());
        if (!center) {
            return res.status(404).json({ error: `Lilith Center '${centerName}' nicht gefunden` });
        }
        res.json(center);
    }
    catch (error) {
        console.error('Fehler beim Abrufen des Lilith Centers:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});
// Alle Lilith Gates
router.get('/gates', (req, res) => {
    try {
        const gates = (0, lilithDb_1.getAllLilithGates)();
        res.json(gates);
    }
    catch (error) {
        console.error('Fehler beim Abrufen der Lilith Gates:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});
// Spezifisches Lilith Gate
router.get('/gates/:gateNumber', (req, res) => {
    try {
        const { gateNumber } = req.params;
        const gateNum = parseInt(gateNumber);
        if (isNaN(gateNum) || gateNum < 1 || gateNum > 64) {
            return res.status(400).json({ error: 'Ungültige Gate-Nummer. Muss zwischen 1 und 64 liegen.' });
        }
        const gate = (0, lilithDb_1.getLilithGate)(gateNum);
        if (!gate) {
            return res.status(404).json({ error: `Lilith Gate ${gateNum} nicht gefunden` });
        }
        res.json(gate);
    }
    catch (error) {
        console.error('Fehler beim Abrufen des Lilith Gates:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});
// Lilith Gates nach Center
router.get('/centers/:centerName/gates', (req, res) => {
    try {
        const { centerName } = req.params;
        const gates = (0, lilithDb_1.getLilithGatesByCenter)(centerName.toUpperCase());
        if (!gates || gates.length === 0) {
            return res.status(404).json({ error: `Keine Lilith Gates für Center '${centerName}' gefunden` });
        }
        res.json(gates);
    }
    catch (error) {
        console.error('Fehler beim Abrufen der Lilith Gates für Center:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});
// Admin Route: Alle Lilith Gates Daten einfügen
router.post('/admin/insert-gates-data', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Einfügen aller Lilith Gates Daten...');
        (0, insertLilithGatesData_1.insertAllLilithGatesData)();
        res.json({
            success: true,
            message: 'Alle 64 Lilith Gates erfolgreich in die Datenbank eingefügt',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Einfügen der Lilith Gates Daten:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Einfügen der Lilith Gates Daten',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Admin Route: Lilith Gates 6-20 aktualisieren
router.post('/admin/update-gates-6to20', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Aktualisierung der Lilith Gates 6-20...');
        (0, updateLilithGates6to20_1.updateLilithGates6to20)();
        res.json({
            success: true,
            message: 'Lilith Gates 6-20 erfolgreich aktualisiert',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren der Lilith Gates 6-20:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren der Lilith Gates 6-20',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Admin Route: Lilith Gates 21-30 aktualisieren
router.post('/admin/update-gates-21to30', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Aktualisierung der Lilith Gates 21-30...');
        (0, updateLilithGates21to30_1.updateLilithGates21to30)();
        res.json({
            success: true,
            message: 'Lilith Gates 21-30 erfolgreich aktualisiert',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren der Lilith Gates 21-30:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren der Lilith Gates 21-30',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Admin Route: Lilith Gates 32-40 aktualisieren
router.post('/admin/update-gates-32to40', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Aktualisierung der Lilith Gates 32-40...');
        (0, updateLilithGates32to40_1.updateLilithGates32to40)();
        res.json({
            success: true,
            message: 'Lilith Gates 32-40 erfolgreich aktualisiert',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren der Lilith Gates 32-40:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren der Lilith Gates 32-40',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Admin Route: Lilith Gates 41-50 aktualisieren
router.post('/admin/update-gates-41to50', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Aktualisierung der Lilith Gates 41-50...');
        (0, updateLilithGates41to50_1.updateLilithGates41to50)();
        res.json({
            success: true,
            message: 'Lilith Gates 41-50 erfolgreich aktualisiert',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren der Lilith Gates 41-50:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren der Lilith Gates 41-50',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Admin Route: Lilith Gates 51-64 aktualisieren
router.post('/admin/update-gates-51to64', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Aktualisierung der Lilith Gates 51-64...');
        (0, updateLilithGates51to64_1.updateLilithGates51to64)();
        res.json({
            success: true,
            message: 'Lilith Gates 51-64 erfolgreich aktualisiert',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren der Lilith Gates 51-64:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren der Lilith Gates 51-64',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Admin Route: Lilith Gate 31 aktualisieren
router.post('/admin/update-gate-31', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Aktualisierung des Lilith Gates 31...');
        (0, updateLilithGate31_1.updateLilithGate31)();
        res.json({
            success: true,
            message: 'Lilith Gate 31 erfolgreich aktualisiert',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren des Lilith Gates 31:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren des Lilith Gates 31',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Admin Route: Lilith Gates 1-20 UNBEWUSST aktualisieren
router.post('/admin/update-gates-unconscious-1to20', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Aktualisierung der Lilith Gates 1-20 UNBEWUSST...');
        (0, updateLilithGatesUnconscious1to20_1.updateLilithGatesUnconscious1to20)();
        res.json({
            success: true,
            message: 'Lilith Gates 1-20 UNBEWUSST erfolgreich aktualisiert',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren der Lilith Gates 1-20 UNBEWUSST:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren der Lilith Gates 1-20 UNBEWUSST',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Admin Route: Lilith Gates 21-40 UNBEWUSST aktualisieren
router.post('/admin/update-gates-unconscious-21to40', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Aktualisierung der Lilith Gates 21-40 UNBEWUSST...');
        (0, updateLilithGatesUnconscious21to40_1.updateLilithGatesUnconscious21to40)();
        res.json({
            success: true,
            message: 'Lilith Gates 21-40 UNBEWUSST erfolgreich aktualisiert',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren der Lilith Gates 21-40 UNBEWUSST:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren der Lilith Gates 21-40 UNBEWUSST',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Admin Route: Lilith Gates 41-60 UNBEWUSST aktualisieren
router.post('/admin/update-gates-unconscious-41to60', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Aktualisierung der Lilith Gates 41-60 UNBEWUSST...');
        (0, updateLilithGatesUnconscious41to60_1.updateLilithGatesUnconscious41to60)();
        res.json({
            success: true,
            message: 'Lilith Gates 41-60 UNBEWUSST erfolgreich aktualisiert',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren der Lilith Gates 41-60 UNBEWUSST:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren der Lilith Gates 41-60 UNBEWUSST',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Admin Route: Lilith Gates 61-64 UNBEWUSST aktualisieren
router.post('/admin/update-gates-unconscious-61to64', (req, res) => {
    try {
        console.log('[LILITH-ADMIN] Starte Aktualisierung der Lilith Gates 61-64 UNBEWUSST...');
        (0, updateLilithGatesUnconscious61to64_1.updateLilithGatesUnconscious61to64)();
        res.json({
            success: true,
            message: 'Lilith Gates 61-64 UNBEWUSST erfolgreich aktualisiert',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren der Lilith Gates 61-64 UNBEWUSST:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren der Lilith Gates 61-64 UNBEWUSST',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
exports.default = router;
