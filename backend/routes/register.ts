import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User'; // Importiere das User-Model

const router = express.Router();

/**
 * Benutzer registrieren
 */
router.post('/', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Benutzername, E-Mail und Passwort sind erforderlich.' });
  }

  try {
    // Überprüfen, ob die E-Mail oder der Benutzername bereits existiert
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({ error: 'E-Mail oder Benutzername ist bereits vergeben.' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Neuen Benutzer erstellen
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Benutzer erfolgreich registriert.' });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ error: 'Serverfehler.' });
  }
});

export default router;