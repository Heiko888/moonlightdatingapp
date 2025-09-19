"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const localDb_1 = require("../lib/localDb");
const router = (0, express_1.Router)();
// Planet Info Endpoint
router.get('/:planet/info', async (req, res) => {
    try {
        const planetName = req.params.planet.charAt(0).toUpperCase() + req.params.planet.slice(1);
        const planetInfo = localDb_1.localDb.getPlanetInfo(planetName);
        if (!planetInfo) {
            return res.status(404).json({
                error: `Planet ${planetName} nicht gefunden`
            });
        }
        res.json(planetInfo);
    }
    catch (error) {
        console.error('Fehler beim Laden der Planet-Info:', error);
        res.status(500).json({
            error: 'Interner Serverfehler'
        });
    }
});
// Planet Gates Endpoint
router.get('/:planet/gates', async (req, res) => {
    try {
        const planetName = req.params.planet.charAt(0).toUpperCase() + req.params.planet.slice(1);
        const planetGates = localDb_1.localDb.getAllPlanetGates(planetName);
        if (!planetGates || planetGates.length === 0) {
            return res.status(404).json({
                error: `Keine Gates für Planet ${planetName} gefunden`
            });
        }
        res.json(planetGates);
    }
    catch (error) {
        console.error('Fehler beim Laden der Planet-Gates:', error);
        res.status(500).json({
            error: 'Interner Serverfehler'
        });
    }
});
// Planet Centers Endpoint
router.get('/:planet/centers', async (req, res) => {
    try {
        const planetName = req.params.planet.charAt(0).toUpperCase() + req.params.planet.slice(1);
        const planetCenters = localDb_1.localDb.getAllPlanetCenters(planetName);
        if (!planetCenters || planetCenters.length === 0) {
            return res.status(404).json({
                error: `Keine Centers für Planet ${planetName} gefunden`
            });
        }
        res.json(planetCenters);
    }
    catch (error) {
        console.error('Fehler beim Laden der Planet-Centers:', error);
        res.status(500).json({
            error: 'Interner Serverfehler'
        });
    }
});
exports.default = router;
