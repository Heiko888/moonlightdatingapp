import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User'; // Importiere das User-Model

const router = express.Router();

// JWT-Secret aus Umgebungsvariablen
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

/**
 * Login-Route
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Serverfehler.' });
  }
});

/**
 * Registrierung-Route
 */
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Benutzername, E-Mail und Passwort sind erforderlich.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'E-Mail ist bereits registriert.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Benutzer erfolgreich registriert.' });
  } catch (err) {
    console.error('[auth/register]', err);
    res.status(500).json({ error: 'Serverfehler.' });
  }
});

/**
 * Authentifizierungsprüfung
 */
router.get('/me', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token fehlt.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
    }

    res.json(user);
  } catch (err) {
    console.error('[auth/me]', err);
    res.status(401).json({ error: 'Ungültiges Token.' });
  }
});

export default router;