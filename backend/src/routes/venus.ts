import { Router } from 'express';
import {
  getVenusInfo,
  getAllVenusCenters,
  getVenusCenter,
  getAllVenusGates,
  getVenusGate,
  getVenusGatesByCenter
} from '../lib/venusDb';

const router = Router();

// Venus Grundinformationen
router.get('/info', (req, res) => {
  try {
    const venusInfo = getVenusInfo();
    if (!venusInfo) {
      return res.status(404).json({ error: 'Venus-Informationen nicht gefunden' });
    }
    res.json(venusInfo);
  } catch (error) {
    console.error('Fehler beim Abrufen der Venus-Info:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Alle Venus Centers
router.get('/centers', (req, res) => {
  try {
    const centers = getAllVenusCenters();
    res.json(centers);
  } catch (error) {
    console.error('Fehler beim Abrufen der Venus Centers:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Einzelnes Venus Center
router.get('/centers/:centerNumber', (req, res) => {
  try {
    const centerNumber = parseInt(req.params.centerNumber);
    if (isNaN(centerNumber)) {
      return res.status(400).json({ error: 'Ungültige Center-Nummer' });
    }
    
    const center = getVenusCenter(centerNumber);
    if (!center) {
      return res.status(404).json({ error: 'Venus Center nicht gefunden' });
    }
    
    res.json(center);
  } catch (error) {
    console.error('Fehler beim Abrufen des Venus Centers:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Alle Venus Gates
router.get('/gates', (req, res) => {
  try {
    const gates = getAllVenusGates();
    res.json(gates);
  } catch (error) {
    console.error('Fehler beim Abrufen der Venus Gates:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Einzelnes Venus Gate
router.get('/gates/:gateNumber', (req, res) => {
  try {
    const gateNumber = parseInt(req.params.gateNumber);
    if (isNaN(gateNumber)) {
      return res.status(400).json({ error: 'Ungültige Gate-Nummer' });
    }
    
    const gate = getVenusGate(gateNumber);
    if (!gate) {
      return res.status(404).json({ error: 'Venus Gate nicht gefunden' });
    }
    
    res.json(gate);
  } catch (error) {
    console.error('Fehler beim Abrufen des Venus Gates:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Venus Gates nach Center
router.get('/centers/:centerNumber/gates', (req, res) => {
  try {
    const centerNumber = parseInt(req.params.centerNumber);
    if (isNaN(centerNumber)) {
      return res.status(400).json({ error: 'Ungültige Center-Nummer' });
    }
    
    const gates = getVenusGatesByCenter(centerNumber);
    res.json(gates);
  } catch (error) {
    console.error('Fehler beim Abrufen der Venus Gates nach Center:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

export default router;

