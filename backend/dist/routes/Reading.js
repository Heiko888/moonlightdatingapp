"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const readingService_1 = __importDefault(require("../services/readingService"));
const router = express_1.default.Router();
// GET /reading/templates - Alle verfügbaren Reading-Templates abrufen
router.get('/templates', auth_1.authenticateToken, async (req, res) => {
    try {
        const templates = readingService_1.default.getAllTemplates();
        res.json({
            success: true,
            templates: templates.filter(template => template.isActive)
        });
    }
    catch (error) {
        console.error('[reading] Get templates error:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Reading-Templates' });
    }
});
// POST /reading/generate - Neues Reading generieren
router.post('/generate', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { templateId, focus, customModules, context } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
        }
        if (!templateId) {
            return res.status(400).json({ error: 'Template-ID ist erforderlich' });
        }
        const readingRequest = {
            userId,
            templateId,
            focus,
            customModules,
            context
        };
        const reading = await readingService_1.default.generateReading(readingRequest);
        res.status(201).json({
            success: true,
            reading
        });
    }
    catch (error) {
        console.error('[reading] Generate reading error:', error);
        res.status(500).json({ error: 'Fehler beim Generieren des Readings' });
    }
});
exports.default = router;
