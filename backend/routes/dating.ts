// ...existing code...
import express, { Request, Response } from 'express';
const router = express.Router();

interface Profile {
	id: number;
	name: string;
	type: string;
	img: string;
	description: string;
	interests: string[];
	hobbies: string[];
	hdProfile: string;
	matchScore: number;
}

const profiles: Profile[] = [
	{
		id: 1,
		name: "Lena",
		type: "Generator",
		img: "/dating/lena.jpg",
		description: "Lebensfreude, Offenheit, liebt tiefe Gespräche.",
		interests: ["Musik", "Yoga", "Kunst"],
		hobbies: ["Lesen", "Reisen"],
		hdProfile: "5/1",
		matchScore: 92,
	},
	{
		id: 2,
		name: "Tom",
		type: "Projektor",
		img: "/dating/tom.jpg",
		description: "Empathisch, kreativ, sucht ehrliche Verbindung.",
		interests: ["Kreativität", "Fotografie", "Musik"],
		hobbies: ["Kochen", "Wandern"],
		hdProfile: "2/4",
		matchScore: 87,
	},
	{
		id: 3,
		name: "Mia",
		type: "Manifestor",
		img: "/dating/mia.jpg",
		description: "Abenteuerlustig, direkt, liebt neue Erfahrungen.",
		interests: ["Abenteuer", "Sport", "Kunst"],
		hobbies: ["Surfen", "Fotografie"],
		hdProfile: "3/5",
		matchScore: 80,
	},
	{
		id: 4,
		name: "Jonas",
		type: "Reflektor",
		img: "/dating/jonas.jpg",
		description: "Sensibel, tiefgründig, sucht Harmonie.",
		interests: ["Meditation", "Natur", "Musik"],
		hobbies: ["Spazieren", "Lesen"],
		hdProfile: "6/2",
		matchScore: 75,
	},
];

// GET /dating/profiles
router.get('/profiles', (req: Request, res: Response) => {
	res.json(profiles);
});

// POST /dating/match
router.post('/match', (req: Request, res: Response) => {
	// Hier könnte man die Match-Logik erweitern
	const { userId, matchId } = req.body as { userId: string; matchId: string };
	res.json({ success: true, message: `Match gespeichert: User ${userId} mit ${matchId}` });
});

export default router;
// TypeScript Migration: routes/dating.js
// TODO: Typen ergänzen und ggf. refaktorieren
