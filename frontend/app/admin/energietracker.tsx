"use client";
import React, { useState } from "react";
import { Box, Typography, Paper, Slider, Button, Alert } from "@mui/material";

export default function EnergieTrackerPage() {
  const [energy, setEnergy] = useState<number>(50);
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<Array<{ value: number; date: string }>>([]);

  const handleSave = () => {
    const now = new Date().toLocaleString();
    setHistory([...history, { value: energy, date: now }]);
    setMessage("Energielevel gespeichert!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: "linear-gradient(135deg, #f9fafc 0%, #e0c3fc 100%)" }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center", color: "#7c3aed" }}>
          Energie-Tracker
        </Typography>
        <Typography sx={{ mb: 2 }}>Wie hoch ist dein aktuelles Energielevel?</Typography>
        <Slider
          value={energy}
          onChange={(_, val) => setEnergy(val as number)}
          min={0}
          max={100}
          step={1}
          marks={[{ value: 0, label: "Niedrig" }, { value: 100, label: "Hoch" }]}
          sx={{ mb: 2 }}
        />
        <Typography sx={{ mb: 2 }}>Aktueller Wert: <b>{energy}</b></Typography>
        <Button variant="contained" sx={{ background: "#7c3aed" }} onClick={handleSave}>
          Speichern
        </Button>
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Verlauf</Typography>
          {history.length === 0 ? (
            <Typography>Kein Verlauf vorhanden.</Typography>
          ) : (
            history.map((entry, idx) => (
              <Typography key={idx} sx={{ fontSize: 14 }}>
                {entry.date}: <b>{entry.value}</b>
              </Typography>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  );
}
