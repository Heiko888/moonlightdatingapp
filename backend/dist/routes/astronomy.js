"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/astronomy.ts
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.get('/moon', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat ?? '52.52'); // Berlin default
        const lon = parseFloat(req.query.lon ?? '13.405');
        const start = req.query.start ?? new Date().toISOString().slice(0, 10);
        const end = req.query.end ?? start;
        const url = new URL('https://api.open-meteo.com/v1/astronomy');
        url.searchParams.set('latitude', String(lat));
        url.searchParams.set('longitude', String(lon));
        url.searchParams.set('daily', 'moon_phase,moonrise,moonset');
        url.searchParams.set('timezone', 'Europe/Berlin');
        url.searchParams.set('start_date', start);
        url.searchParams.set('end_date', end);
        const response = await axios_1.default.get(url.toString());
        const data = response.data;
        res.json({
            location: { lat, lon },
            daily: data.daily // { time[], moon_phase[], moonrise[], moonset[] }
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
