// ...existing code...
import express, { Request, Response } from 'express';
import FriendRequest from '../models/FriendRequest';
import User from '../models/User';
const router = express.Router();

// Alle Freundschaftsanfragen abrufen (Admin/Status)
router.get('/all', async (req: Request, res: Response) => {
	try {
		const requests = await FriendRequest.find();
		res.json(requests);
	} catch (err) {
		res.status(500).json({ error: 'Fehler beim Abrufen der Anfragen.' });
	}
});

// Freundschaftsanfrage senden
router.post('/send', async (req: Request, res: Response) => {
	const { from, to } = req.body as { from: string; to: string };
	if (!from || !to) return res.status(400).json({ error: 'Absender und Empfänger erforderlich.' });
	try {
		// Prüfe, ob Anfrage schon existiert
		const existing = await FriendRequest.findOne({ from, to, status: 'pending' });
		if (existing) return res.status(400).json({ error: 'Anfrage bereits gesendet.' });
		const request = await FriendRequest.create({ from, to });
		res.json(request);
	} catch (err) {
		res.status(500).json({ error: 'Fehler beim Senden der Anfrage.' });
	}
});

// Alle Anfragen für einen Nutzer abrufen
router.get('/for/:userId', async (req: Request, res: Response) => {
	try {
		const requests = await FriendRequest.find({ to: req.params.userId, status: 'pending' }).populate('from to');
		res.json(requests);
	} catch (err) {
		res.status(500).json({ error: 'Fehler beim Abrufen der Anfragen.' });
	}
});

// Anfrage annehmen/ablehnen
router.post('/respond', async (req: Request, res: Response) => {
	const { requestId, status } = req.body as { requestId: string; status: 'accepted'|'declined' };
	if (!requestId || !['accepted','declined'].includes(status)) return res.status(400).json({ error: 'Ungültige Daten.' });
	try {
		const request = await FriendRequest.findByIdAndUpdate(requestId, { status }, { new: true });
		res.json(request);
	} catch (err) {
		res.status(500).json({ error: 'Fehler beim Aktualisieren der Anfrage.' });
	}
});

export default router;
// TypeScript Migration: routes/friendrequest.js
// TODO: Typen ergänzen und ggf. refaktorieren
