import { useState, useEffect } from 'react';

interface ChironGate {
  gate_number: number;
  name: string;
  deep_meaning: string;
  description: string;
  center: string;
  healing: string;
  wound: string;
  created_at: string;
}

interface ChironCenter {
  center: string;
  healing: string;
  wound: string;
  gates: string; // JSON string
  created_at: string;
}

interface ChironInfo {
  name: string;
  symbol: string;
  description: string;
  totalGates: number;
  totalCenters: number;
  gates: ChironGate[];
  centers: ChironCenter[];
}

export function useChironData() {
  const [chironInfo, setChironInfo] = useState<ChironInfo | null>(null);
  const [chironGates, setChironGates] = useState<ChironGate[]>([]);
  const [chironCenters, setChironCenters] = useState<ChironCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChironData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lade Chiron-Daten direkt aus der lokalen Datenbank
        const gatesResponse = await fetch('http://localhost:4001/api/chiron/gates');
        const centersResponse = await fetch('http://localhost:4001/api/chiron/centers');
        
        let gates = [];
        let centers = [];
        
        if (gatesResponse.ok) {
          const gatesData = await gatesResponse.json();
          gates = gatesData.success ? gatesData.data : [];
        }
        
        if (centersResponse.ok) {
          const centersData = await centersResponse.json();
          centers = centersData.success ? centersData.data : [];
        }
        
        // Erstelle Chiron-Info-Objekt
        const chironInfoData: ChironInfo = {
          name: 'Chiron',
          symbol: '⚷',
          description: 'Der verwundete Heiler - Chiron zeigt uns unsere tiefsten Wunden und größten Heilungspotenziale',
          totalGates: gates.length,
          totalCenters: centers.length,
          gates: gates,
          centers: centers
        };
        
        setChironInfo(chironInfoData);
        setChironGates(gates);
        setChironCenters(centers);
      } catch (err) {
        console.error('Fehler beim Laden der Chiron-Daten:', err);
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
        
        // Verwende Fallback-Daten
        setChironInfo({
          name: 'Chiron',
          symbol: '⚷',
          description: 'Der verwundete Heiler - Chiron zeigt uns unsere tiefsten Wunden und größten Heilungspotenziale',
          totalGates: 64,
          totalCenters: 9,
          gates: [],
          centers: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChironData();
  }, []);

  return {
    chironInfo,
    chironGates,
    chironCenters,
    loading,
    error
  };
}
