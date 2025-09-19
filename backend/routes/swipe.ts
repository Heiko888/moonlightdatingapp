// ...existing code...
import express, { Request, Response } from 'express';
import Swipe from '../models/swipe';
import Match from '../models/Match';
import User from '../models/User';
const router = express.Router();

// Alle Swipes abrufen (Admin/Status)
router.get('/all', async (req: Request, res: Response) => {
	try {
		const swipes = await Swipe.find();
		res.json(swipes);
	} catch (err) {
		res.status(500).json({ error: 'Fehler beim Abrufen der Swipes.' });
	}
});

// Alle Profile außer sich selbst abrufen
router.get('/profiles/:userId', async (req: Request, res: Response) => {
	try {
		const { hdType, city, interests } = req.query;
		const filter: any = { _id: { $ne: req.params.userId } };
		if (hdType) filter.hdType = hdType;
		if (city) filter.city = city;
		if (interests) filter.interests = { $regex: interests, $options: 'i' };
		const profiles = await User.find(filter);
		res.json(profiles);
	} catch (err) {
		res.status(500).json({ error: 'Fehler beim Laden der Profile.' });
	}
});

// Swipe speichern
router.post('/', async (req: Request, res: Response) => {
	const { userId, targetId, liked } = req.body as { userId: string; targetId: string; liked: boolean };
	if (!userId || !targetId || typeof liked !== 'boolean') return res.status(400).json({ error: 'Ungültige Daten.' });
	try {
		await Swipe.create({ userId, targetId, liked });
		// Prüfe auf Match
		if (liked) {
			const reciprocal = await Swipe.findOne({ userId: targetId, targetId: userId, liked: true });
			if (reciprocal) {
				await Match.create({ userA: userId, userB: targetId });
				return res.json({ match: true });
			}
		}
		res.json({ match: false });
	} catch (err) {
		res.status(500).json({ error: 'Fehler beim Speichern des Swipes.' });
	}
});

// Matches abrufen
router.get('/matches/:userId', async (req: Request, res: Response) => {
	try {
		const matches = await Match.find({ $or: [ { userA: req.params.userId }, { userB: req.params.userId } ] }).populate('userA userB');
		res.json(matches);
	} catch (err) {
		res.status(500).json({ error: 'Fehler beim Laden der Matches.' });
	}
});

// Eigene Swipes (History) abrufen
router.get('/history/:userId', async (req: Request, res: Response) => {
	try {
		const swipes = await Swipe.find({ userId: req.params.userId }).populate('targetId');
		res.json(swipes);
	} catch (err) {
		res.status(500).json({ error: 'Fehler beim Laden der Swipe-History.' });
	}
});

// Neue Matches seit Timestamp abrufen (Benachrichtigung)
router.get('/newmatches/:userId/:since', async (req: Request, res: Response) => {
	try {
		const since = new Date(Number(req.params.since));
		const matches = await Match.find({
			$and: [
				{ $or: [ { userA: req.params.userId }, { userB: req.params.userId } ] },
				{ createdAt: { $gt: since } }
			]
		}).populate('userA userB');
		res.json(matches);
	} catch (err) {
		res.status(500).json({ error: 'Fehler beim Laden der neuen Matches.' });
	}
});

export default router;
// TypeScript Migration: routes/swipe.js
// TODO: Typen ergänzen und ggf. refaktorieren
