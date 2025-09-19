import express, { Request, Response } from 'express';
import Match from '../models/Match'; // Importiere das Match-Model
import User from '../models/User'; // Importiere das User-Model

const router = express.Router();

/**
 * Alle Matches eines Benutzers abrufen
 */
router.get('/user/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const matches = await Match.find({ $or: [{ userA: userId }, { userB: userId }] }).lean();
    res.json(matches);
  } catch (err) {
    console.error('[match/user/:id]', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Matches.' });
  }
});

/**
 * Neues Match erstellen
 */
router.post('/create', async (req: Request, res: Response) => {
  const { userA, userB, score } = req.body;

  if (!userA || !userB) {
    return res.status(400).json({ error: 'Benutzer A und Benutzer B sind erforderlich.' });
  }

  try {
    // Überprüfen, ob das Match bereits existiert
    const existingMatch = await Match.findOne({ userA, userB });
    if (existingMatch) {
      return res.status(409).json({ error: 'Match existiert bereits.' });
    }

    const match = new Match({ userA, userB, score });
    await match.save();
    res.status(201).json(match);
  } catch (err) {
    console.error('[match/create]', err);
    res.status(500).json({ error: 'Fehler beim Erstellen des Matches.' });
  }
});

/**
 * Match löschen
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const matchId = req.params.id;
    const match = await Match.findByIdAndDelete(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match nicht gefunden.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[match/:id]', err);
    res.status(500).json({ error: 'Fehler beim Löschen des Matches.' });
  }
});

export default router;
