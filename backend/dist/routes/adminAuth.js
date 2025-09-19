"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Pfad zur Admin-Datenbank
const adminDbPath = path_1.default.join(__dirname, '../../data/admins.json');
// Admin-Datenbank initialisieren
function initAdminDb() {
    const dir = path_1.default.dirname(adminDbPath);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    if (!fs_1.default.existsSync(adminDbPath)) {
        // Standard-Admin erstellen
        const defaultAdmin = {
            id: '1',
            username: 'admin',
            email: 'admin@hdapp.com',
            password: bcrypt_1.default.hashSync('admin123', 12),
            role: 'admin',
            created_at: new Date().toISOString()
        };
        fs_1.default.writeFileSync(adminDbPath, JSON.stringify([defaultAdmin], null, 2));
        console.log('✅ Standard-Admin erstellt: admin / admin123');
    }
}
// Admin-Datenbank laden
function loadAdmins() {
    try {
        if (!fs_1.default.existsSync(adminDbPath)) {
            initAdminDb();
        }
        const data = fs_1.default.readFileSync(adminDbPath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Fehler beim Laden der Admin-Datenbank:', error);
        return [];
    }
}
// Admin-Datenbank speichern
function saveAdmins(admins) {
    try {
        fs_1.default.writeFileSync(adminDbPath, JSON.stringify(admins, null, 2));
    }
    catch (error) {
        console.error('Fehler beim Speichern der Admin-Datenbank:', error);
    }
}
// POST /admin/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Benutzername und Passwort sind erforderlich' });
        }
        const admins = loadAdmins();
        const admin = admins.find((a) => a.username === username);
        if (!admin) {
            return res.status(401).json({ error: 'Ungültige Admin-Anmeldedaten' });
        }
        // Passwort überprüfen
        const isValidPassword = await bcrypt_1.default.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Ungültige Admin-Anmeldedaten' });
        }
        // JWT Token erstellen
        const token = jsonwebtoken_1.default.sign({
            adminId: admin.id,
            username: admin.username,
            role: 'admin'
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email
            }
        });
    }
    catch (error) {
        console.error('[admin/login] Error:', error);
        res.status(500).json({ error: 'Fehler bei der Admin-Anmeldung' });
    }
});
// POST /admin/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Benutzername, E-Mail und Passwort sind erforderlich' });
        }
        const admins = loadAdmins();
        // Prüfen ob Admin bereits existiert
        const existingAdmin = admins.find((a) => a.username === username);
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin-Benutzername bereits vergeben' });
        }
        // Passwort hashen
        const passwordHash = await bcrypt_1.default.hash(password, 12);
        // Neuen Admin erstellen
        const newAdmin = {
            id: Date.now().toString(),
            username,
            email,
            password: passwordHash,
            role: 'admin',
            created_at: new Date().toISOString()
        };
        admins.push(newAdmin);
        saveAdmins(admins);
        res.status(201).json({
            message: 'Admin erfolgreich erstellt',
            admin: {
                id: newAdmin.id,
                username: newAdmin.username,
                email: newAdmin.email
            }
        });
    }
    catch (error) {
        console.error('[admin/register] Error:', error);
        res.status(500).json({ error: 'Fehler bei der Admin-Registrierung' });
    }
});
// GET /admin/list (nur für Debugging)
router.get('/list', (req, res) => {
    try {
        const admins = loadAdmins();
        res.json(admins.map((admin) => ({
            id: admin.id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            created_at: admin.created_at
        })));
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Laden der Admins' });
    }
});
// Initialisiere Admin-Datenbank beim Start
initAdminDb();
exports.default = router;
