"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lilithDb_1 = require("../lib/lilithDb");
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
// Admin Route: Alle Lilith Gates Daten einfügen - ENTFERNT
// Die Lilith-Daten sind bereits in der Datenbank gespeichert
// Admin-Routen wurden entfernt, da die entsprechenden Skripte gelöscht wurden
// Die Lilith-Daten sind bereits in der Datenbank gespeichert
exports.default = router;
