import express from 'express';
import { 
  getBlackMoonLilithInfo, 
  getBlackMoonLilithCenters, 
  getBlackMoonLilithGates, 
  getBlackMoonLilithGate 
} from '../lib/blackMoonLilithDb';

const router = express.Router();

// Black Moon Lilith Grundinformationen
router.get('/info', (req, res) => {
  try {
    const info = getBlackMoonLilithInfo();
    if (info) {
      res.json(info);
    } else {
      res.status(404).json({ error: 'Black Moon Lilith Informationen nicht gefunden' });
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Black Moon Lilith Informationen:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Alle Black Moon Lilith Centers
router.get('/centers', (req, res) => {
  try {
    const centers = getBlackMoonLilithCenters();
    res.json(centers);
  } catch (error) {
    console.error('Fehler beim Abrufen der Black Moon Lilith Centers:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Spezifisches Black Moon Lilith Center
router.get('/centers/:centerName', (req, res) => {
  try {
    const { centerName } = req.params;
    const centers = getBlackMoonLilithCenters();
    const center = centers.find(c => 
      c.center_name.toLowerCase().replace(/\s+/g, '') === centerName.toLowerCase().replace(/\s+/g, '')
    );
    
    if (center) {
      res.json(center);
    } else {
      res.status(404).json({ error: `Black Moon Lilith Center '${centerName}' nicht gefunden` });
    }
  } catch (error) {
    console.error('Fehler beim Abrufen des Black Moon Lilith Centers:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Alle Black Moon Lilith Gates
router.get('/gates', (req, res) => {
  try {
    const gates = getBlackMoonLilithGates();
    res.json(gates);
  } catch (error) {
    console.error('Fehler beim Abrufen der Black Moon Lilith Gates:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Spezifisches Black Moon Lilith Gate
router.get('/gates/:gateNumber', (req, res) => {
  try {
    const gateNumber = parseInt(req.params.gateNumber);
    if (isNaN(gateNumber) || gateNumber < 1 || gateNumber > 64) {
      return res.status(400).json({ error: 'Ungültige Gate-Nummer. Muss zwischen 1 und 64 liegen.' });
    }

    const gate = getBlackMoonLilithGate(gateNumber);
    if (gate) {
      res.json(gate);
    } else {
      res.status(404).json({ error: `Black Moon Lilith Gate ${gateNumber} nicht gefunden` });
    }
  } catch (error) {
    console.error('Fehler beim Abrufen des Black Moon Lilith Gates:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Gates für ein spezifisches Center
router.get('/centers/:centerName/gates', (req, res) => {
  try {
    const { centerName } = req.params;
    const gates = getBlackMoonLilithGates();
    
    // Hier könntest du eine Logik implementieren, um Gates einem Center zuzuordnen
    // Für jetzt geben wir alle Gates zurück
    res.json(gates);
  } catch (error) {
    console.error('Fehler beim Abrufen der Black Moon Lilith Gates für Center:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

export default router;
