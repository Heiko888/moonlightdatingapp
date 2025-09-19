"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const openaiService_1 = __importDefault(require("../services/openaiService"));
const chartCalculationService_1 = require("../services/chartCalculationService");
const prometheus_1 = require("../monitoring/prometheus");
const router = express_1.default.Router();
// Hilfsfunktionen für lokale Datenspeicherung
function loadCharts() {
    try {
        const fs = require('fs');
        const path = require('path');
        const chartsPath = path.join(__dirname, '../../data/charts.json');
        if (fs.existsSync(chartsPath)) {
            const data = fs.readFileSync(chartsPath, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('Fehler beim Laden der Charts:', error);
    }
    return [];
}
function saveCharts(charts) {
    try {
        const fs = require('fs');
        const path = require('path');
        const chartsPath = path.join(__dirname, '../../data/charts.json');
        // Stelle sicher, dass das Verzeichnis existiert
        const dir = path.dirname(chartsPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(chartsPath, JSON.stringify(charts, null, 2));
    }
    catch (error) {
        console.error('Fehler beim Speichern der Charts:', error);
    }
}
// POST /charts/calculate - Chart-Berechnung mit präziser Ephemeriden-Integration
router.post('/calculate', async (req, res) => {
    try {
        const { birth_date, birth_time, birth_place, name, email, calculation_method = 'precise' } = req.body;
        console.log('📊 Chart-Berechnung gestartet...');
        // Validierung der Eingabedaten
        if (!birth_date || !birth_time || !birth_place) {
            return res.status(400).json({
                error: 'Geburtsdatum, Geburtszeit und Geburtsort sind erforderlich'
            });
        }
        console.log('📊 Geburtsdaten:', { birth_date, birth_time, birth_place, name, email });
        let chartData;
        // Verwende präzise Chart-Berechnung
        if (calculation_method === 'precise') {
            try {
                console.log('🎯 Verwende präzise Chart-Berechnung...');
                // Verwende den neuen präzisen Service
                chartData = await chartCalculationService_1.chartCalculationService.calculateChart(birth_date, birth_time, birth_place, 'Europe/Berlin' // Standard-Zeitzone
                );
                console.log('✅ Präzise Chart-Berechnung erfolgreich');
            }
            catch (preciseError) {
                console.error('❌ Präzise Berechnung fehlgeschlagen:', preciseError);
                console.log('🔄 Verwende Fallback-Berechnung...');
                // Fallback: Vereinfachte lokale Berechnung
                chartData = await generateLocalChartData(birth_date, birth_time, birth_place, name || 'Unbekannt');
            }
        }
        else {
            // Verwende OpenAI (falls verfügbar)
            if (openaiService_1.default) {
                try {
                    console.log('🚀 Verwende OpenAI für Chart-Berechnung...');
                    const pdfChartResult = await openaiService_1.default.calculateHumanDesignChartWithPDFs({
                        birth_date,
                        birth_time,
                        birth_place: birth_place || 'Berlin, Germany',
                        name: name || 'Unbekannt',
                        email: email || 'demo@example.com'
                    });
                    console.log('✅ OpenAI Chart-Berechnung erfolgreich:', pdfChartResult);
                    chartData = pdfChartResult.chartData || await chartCalculationService_1.chartCalculationService.calculateChart(birth_date, birth_time, birth_place, 'Europe/Berlin');
                }
                catch (openaiError) {
                    console.error('❌ OpenAI Fehler:', openaiError);
                    console.log('🔄 Verwende präzise Fallback-Berechnung...');
                    // Fallback: Präzise lokale Berechnung
                    chartData = await chartCalculationService_1.chartCalculationService.calculateChart(birth_date, birth_time, birth_place, 'Europe/Berlin');
                }
            }
            else {
                console.log('⚠️ OpenAI nicht konfiguriert, verwende präzise Berechnung...');
                chartData = await chartCalculationService_1.chartCalculationService.calculateChart(birth_date, birth_time, birth_place, 'Europe/Berlin');
            }
        }
        // Validiere Chart-Daten
        const isValid = chartCalculationService_1.chartCalculationService.validateChart(chartData);
        if (!isValid) {
            throw new Error('Chart-Validierung fehlgeschlagen');
        }
        // Chart in Datenbank speichern
        const newChart = {
            id: Date.now().toString(),
            user_id: "demo_user",
            name: name || 'Unbekannt',
            birth_date,
            birth_time,
            birth_place: birth_place || 'Berlin, Germany',
            chart_data: chartData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            calculation_method: calculation_method === 'precise' ? 'precise_ephemeris' : 'openai_enhanced'
        };
        const charts = loadCharts();
        charts.push(newChart);
        saveCharts(charts);
        console.log('✅ Chart erfolgreich erstellt und gespeichert');
        res.status(201).json({
            success: true,
            chart: newChart,
            calculation: {
                method: calculation_method === 'precise' ? 'precise_ephemeris' : 'openai_enhanced',
                ephemerisVersion: '1.0.0',
                precision: 'high'
            }
        });
    }
    catch (error) {
        console.error('❌ Fehler bei der Chart-Berechnung:', error);
        res.status(500).json({
            error: 'Fehler bei der Chart-Berechnung',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// GET /charts - Alle Charts (ohne Authentifizierung für Demo)
router.get('/', async (req, res) => {
    try {
        const charts = loadCharts();
        res.json(charts);
    }
    catch (error) {
        console.error('[charts] GET error:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Charts' });
    }
});
// POST /charts - Neues Chart erstellen (ohne Authentifizierung für Demo)
router.post('/', async (req, res) => {
    try {
        const { name, birth_date, birth_time, birth_place, chart_data } = req.body;
        // Validierung
        if (!name || !birth_date || !birth_place) {
            return res.status(400).json({
                error: 'Name, Geburtsdatum und Geburtsort sind erforderlich'
            });
        }
        const newChart = {
            id: Date.now().toString(),
            user_id: "demo_user", // Für Demo-Zwecke
            name,
            birth_date,
            birth_time: birth_time || "00:00",
            birth_place,
            chart_data: chart_data || {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        const charts = loadCharts();
        charts.push(newChart);
        saveCharts(charts);
        // Business-Metriken aktualisieren
        if (newChart.chart_data && newChart.chart_data.hdType) {
            prometheus_1.hdTypeDistribution.labels(newChart.chart_data.hdType).inc();
        }
        if (newChart.chart_data && newChart.chart_data.profile) {
            prometheus_1.profileDistribution.labels(newChart.chart_data.profile).inc();
        }
        // OpenAI API Calls tracken
        prometheus_1.openaiApiCalls.labels('chart-generation', 'success').inc();
        // Database Operations tracken
        prometheus_1.databaseOperations.labels('insert', 'charts').inc();
        res.status(201).json(newChart);
    }
    catch (error) {
        // Error-Metriken tracken
        prometheus_1.openaiApiCalls.labels('chart-generation', 'error').inc();
        console.error('[charts] POST error:', error);
        res.status(500).json({ error: 'Fehler beim Erstellen des Charts' });
    }
});
// GET /charts/:id - Einzelnes Chart abrufen (ohne Authentifizierung für Demo)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const charts = loadCharts();
        const chart = charts.find((c) => c.id === id);
        if (!chart) {
            return res.status(404).json({ error: 'Chart nicht gefunden' });
        }
        res.json(chart);
    }
    catch (error) {
        console.error('[charts] GET by ID error:', error);
        res.status(500).json({ error: 'Fehler beim Laden des Charts' });
    }
});
// PUT /charts/:id - Chart aktualisieren
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const charts = loadCharts();
        const chartIndex = charts.findIndex((c) => c.id === id);
        if (chartIndex === -1) {
            return res.status(404).json({ error: 'Chart nicht gefunden' });
        }
        if (charts[chartIndex].user_id !== userId) {
            return res.status(403).json({ error: 'Keine Berechtigung' });
        }
        const updatedChart = {
            ...charts[chartIndex],
            ...req.body,
            updated_at: new Date().toISOString()
        };
        charts[chartIndex] = updatedChart;
        saveCharts(charts);
        res.json(updatedChart);
    }
    catch (error) {
        console.error('[charts] PUT error:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Charts' });
    }
});
// DELETE /charts/:id - Chart löschen
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const charts = loadCharts();
        const chartIndex = charts.findIndex((c) => c.id === id);
        if (chartIndex === -1) {
            return res.status(404).json({ error: 'Chart nicht gefunden' });
        }
        if (charts[chartIndex].user_id !== userId) {
            return res.status(403).json({ error: 'Keine Berechtigung' });
        }
        charts.splice(chartIndex, 1);
        saveCharts(charts);
        res.json({ message: 'Chart erfolgreich gelöscht' });
    }
    catch (error) {
        console.error('[charts] DELETE error:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Charts' });
    }
});
// POST /charts/calculate-with-pdfs - Chart-Berechnung mit PDF-Wissen
router.post('/calculate-with-pdfs', async (req, res) => {
    try {
        const { birth_date, birth_time, birth_place, name, email } = req.body;
        if (!birth_date || !birth_time || !birth_place) {
            return res.status(400).json({ error: 'Geburtsdatum, Geburtszeit und Geburtsort sind erforderlich' });
        }
        console.log('🤔 Chart-Berechnung mit PDF-Wissen...');
        let chartData;
        if (openaiService_1.default) {
            try {
                const pdfChartResult = await openaiService_1.default.calculateHumanDesignChartWithPDFs({
                    birth_date,
                    birth_time,
                    birth_place: birth_place || 'Berlin, Germany',
                    name: name || 'Unbekannt',
                    email: email || 'demo@example.com'
                });
                chartData = pdfChartResult.chartData || await chartCalculationService_1.chartCalculationService.calculateChart(birth_date, birth_time, birth_place, 'Europe/Berlin');
            }
            catch (openaiError) {
                console.error('❌ OpenAI Fehler:', openaiError);
                console.log('🔄 Verwende präzise Fallback-Berechnung...');
                chartData = await chartCalculationService_1.chartCalculationService.calculateChart(birth_date, birth_time, birth_place, 'Europe/Berlin');
            }
        }
        else {
            console.log('⚠️ OpenAI nicht konfiguriert, verwende präzise Berechnung...');
            chartData = await chartCalculationService_1.chartCalculationService.calculateChart(birth_date, birth_time, birth_place, 'Europe/Berlin');
        }
        res.json({
            success: true,
            chartData,
            calculation: {
                method: 'pdf_enhanced',
                ephemerisVersion: '1.0.0',
                precision: 'high'
            }
        });
    }
    catch (error) {
        console.error('❌ Fehler bei der PDF-verstärkten Chart-Berechnung:', error);
        res.status(500).json({
            error: 'Fehler bei der PDF-verstärkten Chart-Berechnung',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// Lokale Chart-Berechnung ohne OpenAI (Fallback)
async function generateLocalChartData(birth_date, birth_time, birth_place, name) {
    // Verwende den präzisen Service als Fallback
    return await chartCalculationService_1.chartCalculationService.calculateChart(birth_date, birth_time, birth_place, 'Europe/Berlin');
}
// POST /charts/reflection-questions - Reflexionsfragen mit PDF-Wissen
router.post('/reflection-questions', async (req, res) => {
    try {
        const { elementType, elementValue, description } = req.body;
        if (!elementType || !elementValue) {
            return res.status(400).json({ error: 'Element-Typ und Wert sind erforderlich' });
        }
        console.log('🤔 Reflexionsfragen mit PDF-Wissen generieren...');
        const questionsResult = await openaiService_1.default.generateReflectionQuestions({
            type: elementType,
            value: elementValue,
            description
        });
        res.json({
            success: true,
            questions: questionsResult.questions,
            element: questionsResult.element
        });
    }
    catch (error) {
        console.error('❌ Fehler bei der Generierung von Reflexionsfragen:', error);
        res.status(500).json({
            error: 'Fehler bei der Generierung von Reflexionsfragen',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
exports.default = router;
