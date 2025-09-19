import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const router = Router();

// Pfad zur Admin-Datenbank
const adminDbPath = path.join(__dirname, '../../data/admins.json');

// Admin-Datenbank initialisieren
function initAdminDb() {
  const dir = path.dirname(adminDbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(adminDbPath)) {
    // Standard-Admin erstellen
    const defaultAdmin = {
      id: '1',
      username: 'admin',
      email: 'admin@hdapp.com',
      password: bcrypt.hashSync('admin123', 12),
      role: 'admin',
      created_at: new Date().toISOString()
    };
    
    fs.writeFileSync(adminDbPath, JSON.stringify([defaultAdmin], null, 2));
    console.log('✅ Standard-Admin erstellt: admin / admin123');
  }
}

// Admin-Datenbank laden
function loadAdmins() {
  try {
    if (!fs.existsSync(adminDbPath)) {
      initAdminDb();
    }
    const data = fs.readFileSync(adminDbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Fehler beim Laden der Admin-Datenbank:', error);
    return [];
  }
}

// Admin-Datenbank speichern
function saveAdmins(admins: any[]) {
  try {
    fs.writeFileSync(adminDbPath, JSON.stringify(admins, null, 2));
  } catch (error) {
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
    const admin = admins.find((a: any) => a.username === username);

    if (!admin) {
      return res.status(401).json({ error: 'Ungültige Admin-Anmeldedaten' });
    }

    // Passwort überprüfen
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Ungültige Admin-Anmeldedaten' });
    }

    // JWT Token erstellen
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        username: admin.username,
        role: 'admin'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
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
    const existingAdmin = admins.find((a: any) => a.username === username);
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin-Benutzername bereits vergeben' });
    }

    // Passwort hashen
    const passwordHash = await bcrypt.hash(password, 12);

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
  } catch (error) {
    console.error('[admin/register] Error:', error);
    res.status(500).json({ error: 'Fehler bei der Admin-Registrierung' });
  }
});

// GET /admin/list (nur für Debugging)
router.get('/list', (req, res) => {
  try {
    const admins = loadAdmins();
    res.json(admins.map((admin: any) => ({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      created_at: admin.created_at
    })));
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Laden der Admins' });
  }
});

// Initialisiere Admin-Datenbank beim Start
initAdminDb();

export default router;
