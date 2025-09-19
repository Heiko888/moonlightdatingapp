import { Router } from 'express';
import { updateMercuryGate, getMercuryGate } from '../lib/localDb';

const router = Router();

// GET: Einzelnes Mercury Gate abrufen
router.get('/gate/:gateNumber', async (req, res) => {
  try {
    const gateNumber = parseInt(req.params.gateNumber);
    
    if (isNaN(gateNumber) || gateNumber < 1 || gateNumber > 64) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ungültige Gate-Nummer. Muss zwischen 1 und 64 liegen.' 
      });
    }
    
    const gate = getMercuryGate(gateNumber);
    
    if (!gate) {
      return res.status(404).json({ 
        success: false, 
        error: `Gate ${gateNumber} nicht gefunden` 
      });
    }
    
    res.json({ success: true, data: gate });
  } catch (error) {
    console.error('Fehler beim Abrufen des Mercury Gates:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Interner Serverfehler beim Abrufen des Gates' 
    });
  }
});

// PUT: Mercury Gate aktualisieren
router.put('/gate/:gateNumber', async (req, res) => {
  try {
    const gateNumber = parseInt(req.params.gateNumber);
    
    if (isNaN(gateNumber) || gateNumber < 1 || gateNumber > 64) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ungültige Gate-Nummer. Muss zwischen 1 und 64 liegen.' 
      });
    }
    
    const gateData = req.body;
    
    // Validierung der eingehenden Daten
    const allowedFields = ['name', 'essence', 'consciousness', 'description', 'deep_meaning', 'shadow_aspects', 'gifts', 'affirmation'];
    const filteredData: any = {};
    
    for (const field of allowedFields) {
      if (gateData[field] !== undefined) {
        filteredData[field] = gateData[field];
      }
    }
    
    // Validierung für Arrays
    if (filteredData.shadow_aspects && !Array.isArray(filteredData.shadow_aspects)) {
      return res.status(400).json({ 
        success: false, 
        error: 'shadow_aspects muss ein Array sein' 
      });
    }
    
    if (filteredData.gifts && !Array.isArray(filteredData.gifts)) {
      return res.status(400).json({ 
        success: false, 
        error: 'gifts muss ein Array sein' 
      });
    }
    
    const result = updateMercuryGate(gateNumber, filteredData);
    
    if (result.success) {
      // Aktualisierte Daten zurückgeben
      const updatedGate = getMercuryGate(gateNumber);
      res.json({ 
        success: true, 
        message: `Gate ${gateNumber} erfolgreich aktualisiert`,
        data: updatedGate,
        changes: result.changes
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error || 'Fehler beim Aktualisieren des Gates' 
      });
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Mercury Gates:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Interner Serverfehler beim Aktualisieren des Gates' 
    });
  }
});

// GET: Alle Mercury Gates abrufen (für Übersicht)
router.get('/gates', async (req, res) => {
  try {
    const gates = [];
    
    for (let i = 1; i <= 64; i++) {
      const gate = getMercuryGate(i);
      if (gate) {
        gates.push({
          gate_number: gate.gate_number,
          name: gate.name,
          essence: gate.essence ? gate.essence.substring(0, 100) + '...' : '',
          consciousness: gate.consciousness ? gate.consciousness.substring(0, 100) + '...' : ''
        });
      }
    }
    
    res.json({ success: true, data: gates });
  } catch (error) {
    console.error('Fehler beim Abrufen aller Mercury Gates:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Interner Serverfehler beim Abrufen der Gates' 
    });
  }
});

export default router;
