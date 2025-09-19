import { Router } from 'express';
import { getAllChironGates, getChironGate, getAllChironCenters, getChironCenter } from '../lib/chironDb';

const router = Router();

// Alle Chiron Gates abrufen
router.get('/gates', (req, res) => {
  try {
    const gates = getAllChironGates();
    res.json({
      success: true,
      data: gates,
      count: gates.length
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Chiron Gates:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Chiron Gates'
    });
  }
});

// Einzelnes Chiron Gate abrufen
router.get('/gates/:gateNumber', (req, res) => {
  try {
    const gateNumber = parseInt(req.params.gateNumber);
    
    if (isNaN(gateNumber) || gateNumber < 1 || gateNumber > 64) {
      return res.status(400).json({
        success: false,
        error: 'Ungültige Tor-Nummer. Muss zwischen 1 und 64 liegen.'
      });
    }

    const gate = getChironGate(gateNumber);
    
    if (!gate) {
      return res.status(404).json({
        success: false,
        error: `Tor ${gateNumber} nicht gefunden`
      });
    }

    res.json({
      success: true,
      data: gate
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Chiron Gates:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen des Chiron Gates'
    });
  }
});

// Alle Chiron Centers abrufen
router.get('/centers', (req, res) => {
  try {
    const centers = getAllChironCenters();
    res.json({
      success: true,
      data: centers,
      count: centers.length
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Chiron Centers:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Chiron Centers'
    });
  }
});

// Einzelnes Chiron Center abrufen
router.get('/centers/:center', (req, res) => {
  try {
    const center = req.params.center.toUpperCase();
    const centerData = getChironCenter(center);
    
    if (!centerData) {
      return res.status(404).json({
        success: false,
        error: `Center ${center} nicht gefunden`
      });
    }

    res.json({
      success: true,
      data: centerData
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Chiron Centers:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen des Chiron Centers'
    });
  }
});

// Chiron Info abrufen
router.get('/info', (req, res) => {
  try {
    const gates = getAllChironGates();
    const centers = getAllChironCenters();
    
    res.json({
      success: true,
      data: {
        name: 'Chiron',
        symbol: '⚷',
        description: 'Der verwundete Heiler - Chiron zeigt uns unsere tiefsten Wunden und größten Heilungspotenziale',
        totalGates: gates.length,
        totalCenters: centers.length,
        gates: gates,
        centers: centers
      }
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Chiron Info:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Chiron Info'
    });
  }
});

export default router;
