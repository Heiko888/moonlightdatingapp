import express, { Request, Response } from 'express';
import Admin from '../models/admin';

const router = express.Router();

// Alle Admins abrufen
router.get('/all', async (_req: Request, res: Response) => {
  try {
    const admins = await Admin.find().lean();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Admins.' });
  }
});

// Einzelnen Admin abrufen
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById(req.params.id).lean();
    if (!admin) return res.status(404).json({ error: 'Admin nicht gefunden.' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen des Admins.' });
  }
});

// Admin anlegen
router.post('/create', async (req: Request, res: Response) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Erstellen des Admins.' });
  }
});

// Admin löschen
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin nicht gefunden.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Löschen des Admins.' });
  }
});

export default router;