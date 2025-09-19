import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// Beispiel: API-URL und Key aus Umgebungsvariablen
const ASTRO_API_URL = process.env.ASTRO_API_URL || 'https://example.com/api';
const ASTRO_API_KEY = process.env.ASTRO_API_KEY || 'your-api-key';

/**
 * Daten von der Astro-API abrufen
 */
router.get('/data', async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(`${ASTRO_API_URL}/data`, {
      headers: { Authorization: `Bearer ${ASTRO_API_KEY}` },
    });

    res.json(response.data);
  } catch (err) {
    console.error('[astro-api/data]', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Astro-Daten.' });
  }
});

/**
 * Spezifische Astro-Daten abrufen
 */
router.get('/data/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`${ASTRO_API_URL}/data/${id}`, {
      headers: { Authorization: `Bearer ${ASTRO_API_KEY}` },
    });

    res.json(response.data);
  } catch (err) {
    console.error(`[astro-api/data/${id}]`, err);
    res.status(500).json({ error: 'Fehler beim Abrufen der spezifischen Astro-Daten.' });
  }
});

/**
 * Astro-Daten senden
 */
router.post('/data', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      `${ASTRO_API_URL}/data`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${ASTRO_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(201).json(response.data);
  } catch (err) {
    console.error('[astro-api/data POST]', err);
    res.status(500).json({ error: 'Fehler beim Senden der Astro-Daten.' });
  }
});

export default router;
