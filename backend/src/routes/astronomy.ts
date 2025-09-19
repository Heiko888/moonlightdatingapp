// src/routes/astronomy.ts
import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/moon', async (req, res) => {
  try {
    const lat = parseFloat((req.query.lat as string) ?? '52.52');   // Berlin default
    const lon = parseFloat((req.query.lon as string) ?? '13.405');
    const start = (req.query.start as string) ?? new Date().toISOString().slice(0,10);
    const end   = (req.query.end as string)   ?? start;

    const url = new URL('https://api.open-meteo.com/v1/astronomy');
    url.searchParams.set('latitude', String(lat));
    url.searchParams.set('longitude', String(lon));
    url.searchParams.set('daily', 'moon_phase,moonrise,moonset');
    url.searchParams.set('timezone', 'Europe/Berlin');
    url.searchParams.set('start_date', start);
    url.searchParams.set('end_date', end);

    const response = await axios.get(url.toString());
    const data = response.data;
    res.json({
      location: { lat, lon },
      daily: data.daily // { time[], moon_phase[], moonrise[], moonset[] }
    });
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
