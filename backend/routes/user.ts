import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User'; // 👈 PascalCase

// Typ für Multer-Request
type MulterRequest = Request & { file?: Express.Multer.File };

// Upload-Verzeichnis zuverlässig im Projektroot
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

// Stelle sicher, dass der Ordner existiert
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer-Storage: behält Originalext und legt in UPLOAD_DIR ab
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // sichere, einfache Dateibenennung: timestamp + random + original ext
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

const router = express.Router();

// Alle User
router.get('/all', async (_req: Request, res: Response) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    console.error('[users/all]', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der User.' });
  }
});

// Einzelner User
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User nicht gefunden.' });
    res.json(user);
  } catch (err) {
    console.error('[users/:id]', err);
    res.status(500).json({ error: 'Fehler beim Abrufen des Users.' });
  }
});

// User-Daten ändern
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!user) return res.status(404).json({ error: 'User nicht gefunden.' });
    res.json(user);
  } catch (err: any) {
    console.error('[users PUT]', err);
    // Unique-Fehler freundlich melden
    if (err?.code === 11000) return res.status(409).json({ error: 'E-Mail oder Username bereits vergeben.' });
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Users.' });
  }
});

// Profilbild-Upload
router.post('/:id/avatar', upload.single('avatar'), async (req: MulterRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User nicht gefunden.' });
    if (!req.file) return res.status(400).json({ error: 'Keine Datei hochgeladen.' });

    // Public URL relativ zu deinem Static-Serve (siehe Hinweis unten)
    const avatarUrl = `/uploads/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.json({ avatar: avatarUrl });
  } catch (err) {
    console.error('[users/avatar]', err);
    res.status(500).json({ error: 'Fehler beim Hochladen des Profilbilds.' });
  }
});

// User löschen
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User nicht gefunden.' });
    res.json({ success: true });
  } catch (err) {
    console.error('[users DELETE]', err);
    res.status(500).json({ error: 'Fehler beim Löschen des Users.' });
  }
});

// E-Mail ändern
router.post('/changeemail', async (req: Request, res: Response) => {
  const { userId, newEmail } = req.body as { userId: string; newEmail: string };
  if (!userId || !newEmail) return res.status(400).json({ error: 'Fehlende Felder.' });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User nicht gefunden.' });

    user.email = newEmail.toLowerCase().trim(); // 👈 normalisieren
    await user.save(); // triggert unique + pre('save')-Validierungen
    res.json({ success: true });
  } catch (err: any) {
    console.error('[users/changeemail]', err);
    if (err?.code === 11000) return res.status(409).json({ error: 'E-Mail bereits vergeben.' });
    res.status(500).json({ error: 'Fehler beim Ändern der E-Mail.' });
  }
});

// Passwort ändern
router.post('/changepassword', async (req: Request, res: Response) => {
  const { userId, oldPassword, newPassword } = req.body as { userId: string; oldPassword: string; newPassword: string };
  if (!userId || !oldPassword || !newPassword) return res.status(400).json({ error: 'Fehlende Felder.' });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User nicht gefunden.' });

    const valid = await user.comparePassword(oldPassword);
    if (!valid) return res.status(401).json({ error: 'Altes Passwort falsch.' });

    user.password = newPassword; // dein pre('save') hasht
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error('[users/changepassword]', err);
    res.status(500).json({ error: 'Fehler beim Ändern des Passworts.' });
  }
});

export default router;
