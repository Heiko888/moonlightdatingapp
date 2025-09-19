import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import emailService from '../services/emailService';
import { getWelcomeEmailTemplate, getWelcomeEmailSubject } from '../templates/welcomeEmail';
import { chartCalculationService } from '../services/chartCalculationService';
import { localDb } from '../lib/localDb';

const router = Router();

// Pfad zur User-Datenbank
const userDbPath = path.join(__dirname, '../../data/users.json');

// User-Datenbank initialisieren
function initUserDb() {
  const dir = path.dirname(userDbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(userDbPath)) {
    // Standard-User erstellen
    const defaultUser = {
      id: '1',
      username: 'testuser',
      email: 'test@hdapp.com',
      password_hash: bcrypt.hashSync('test123', 10),
      name: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      subscriptionPlan: 'basic',
      subscriptionStatus: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Premium-User erstellen
    const premiumUser = {
      id: '2',
      username: 'premiumuser',
      email: 'premium@hdapp.com',
      password_hash: bcrypt.hashSync('premium123', 10),
      name: 'Premium User',
      firstName: 'Premium',
      lastName: 'User',
      subscriptionPlan: 'premium',
      subscriptionStatus: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // VIP-User erstellen
    const vipUser = {
      id: '3',
      username: 'vipuser',
      email: 'vip@hdapp.com',
      password_hash: bcrypt.hashSync('vip123', 10),
      name: 'VIP User',
      firstName: 'VIP',
      lastName: 'User',
      subscriptionPlan: 'vip',
      subscriptionStatus: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    fs.writeFileSync(userDbPath, JSON.stringify([defaultUser, premiumUser, vipUser], null, 2));
    console.log('✅ Standard-User erstellt: test@hdapp.com / test123');
    console.log('✅ Premium-User erstellt: premium@hdapp.com / premium123');
    console.log('✅ VIP-User erstellt: vip@hdapp.com / vip123');
  }
}

// User-Datenbank laden
function loadUsers() {
  try {
    if (!fs.existsSync(userDbPath)) {
      initUserDb();
    }
    const data = fs.readFileSync(userDbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Fehler beim Laden der User-Datenbank:', error);
    return [];
  }
}

// User-Datenbank speichern
function saveUsers(users: any[]) {
  try {
    fs.writeFileSync(userDbPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Fehler beim Speichern der User-Datenbank:', error);
  }
}

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich' });
    }

    const users = loadUsers();
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Passwort überprüfen
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // JWT Token erstellen
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        subscriptionPlan: user.subscriptionPlan || 'basic',
        subscriptionStatus: user.subscriptionStatus || 'active'
      }
    });
  } catch (error) {
    console.error('[auth/login] Error:', error);
    res.status(500).json({ error: 'Fehler bei der Anmeldung' });
  }
});

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, subscriptionPlan = 'free', birthDate, birthTime, birthPlace } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Benutzername, E-Mail und Passwort sind erforderlich' });
    }

    const users = loadUsers();
    
    // Prüfen ob Benutzer bereits existiert
    const existingUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'E-Mail bereits registriert' });
    }

    // Passwort hashen
    const passwordHash = await bcrypt.hash(password, 10);

    // Neuen Benutzer erstellen
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : username;
    const newUser = {
      id: Date.now().toString(),
      username,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name: fullName,
      firstName: firstName || '',
      lastName: lastName || '',
      subscriptionPlan: subscriptionPlan,
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date().toISOString(),
      birthDate: birthDate || null,
      birthTime: birthTime || null,
      birthPlace: birthPlace || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Automatische Human Design Chart-Erstellung (falls Geburtsdaten vorhanden)
    let chartData = null;
    if (birthDate && birthTime && birthPlace) {
      try {
        console.log('🎯 Erstelle automatisch Human Design Chart für neuen Benutzer...');
        
        // Chart berechnen
        const calculatedChart = await chartCalculationService.calculateChart(
          fullName,
          birthDate,
          birthTime,
          birthPlace
        );

        // Chart in Datenbank speichern
        const chartId = localDb.createChart({
          user_id: newUser.id,
          name: fullName,
          birth_date: birthDate,
          birth_time: birthTime,
          birth_place: birthPlace,
          chart_data: JSON.stringify(calculatedChart.metadata),
          centers: JSON.stringify(calculatedChart.centers),
          channels: JSON.stringify(calculatedChart.channels),
          gates: JSON.stringify(calculatedChart.gates),
          planets: JSON.stringify(calculatedChart.planets || {})
        });

        chartData = {
          id: chartId.lastInsertRowid,
          ...calculatedChart
        };

        console.log('✅ Human Design Chart erfolgreich erstellt:', {
          userId: newUser.id,
          chartId: chartId.lastInsertRowid,
          hdType: calculatedChart.metadata?.type,
          profile: calculatedChart.metadata?.profile
        });

      } catch (chartError) {
        console.error('⚠️ Fehler bei automatischer Chart-Erstellung:', chartError);
        // Chart-Fehler soll die Registrierung nicht verhindern
      }
    }

    // Willkommens-E-Mail senden (asynchron, nicht auf Antwort warten)
    try {
      const emailHtml = getWelcomeEmailTemplate({
        name: newUser.name,
        username: newUser.username,
        email: newUser.email
      });
      
      const emailSubject = getWelcomeEmailSubject(newUser.name);
      
      // E-Mail über Mailchimp/HubSpot senden
      await emailService.sendWelcomeEmail({
        email: newUser.email,
        name: newUser.name,
        username: newUser.username
      });
      
      // Zusätzlich Transaktions-E-Mail senden
      await emailService.sendTransactionalEmail(
        newUser.email,
        emailSubject,
        emailHtml
      );
      
      console.log('✅ Willkommens-E-Mail erfolgreich gesendet an:', newUser.email);
    } catch (emailError) {
      console.error('⚠️ Fehler beim Senden der Willkommens-E-Mail:', emailError);
      // E-Mail-Fehler soll die Registrierung nicht verhindern
    }

    // JWT Token erstellen
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        subscriptionPlan: newUser.subscriptionPlan,
        subscriptionStatus: newUser.subscriptionStatus,
        birthDate: newUser.birthDate,
        birthTime: newUser.birthTime,
        birthPlace: newUser.birthPlace
      },
      chart: chartData ? {
        id: chartData.id,
        hdType: chartData.metadata?.type,
        profile: chartData.metadata?.profile,
        authority: chartData.metadata?.authority,
        strategy: chartData.metadata?.strategy,
        incarnationCross: chartData.metadata?.incarnationCross
      } : null
    });
  } catch (error) {
    console.error('[auth/register] Error:', error);
    res.status(500).json({ error: 'Fehler bei der Registrierung' });
  }
});

// GET /auth/users (nur für Debugging)
router.get('/users', (req, res) => {
  try {
    const users = loadUsers();
    res.json(users.map((user: any) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      created_at: user.created_at
    })));
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Laden der Benutzer' });
  }
});

// Initialisiere User-Datenbank beim Start
initUserDb();

export default router;
