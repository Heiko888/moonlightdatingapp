"use client";
import React from "react";
import { Box, Paper, Typography, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import AppHeader from '../../components/AppHeader';

export default function MondphasenInfoPage() {
  const [phase, setPhase] = useState(0);
  const phases = [
    {
      label: "Neumond",
      svg: <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="35" fill="#23233a" /><circle cx="40" cy="40" r="35" fill="#fff" style={{ mixBlendMode: 'multiply' }} /><ellipse cx="40" cy="40" rx="18" ry="35" fill="#4b2e83" /></svg>,
      content: <>
        <Typography variant="body2" sx={{ mb: 2 }}>Neubeginn, Intentionen setzen, frische Energie.<br /><b>Tipp:</b> Nutze den Neumond für Journaling, Visualisierung und das Setzen neuer Ziele.</Typography>
      </>,
    },
    {
      label: "Zunehmender Mond",
      svg: <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="35" fill="#ffd700" /><ellipse cx="55" cy="40" rx="18" ry="35" fill="#fff" /></svg>,
      content: <>
        <Typography variant="body2" sx={{ mb: 2 }}>Wachstum, Projekte voranbringen, Motivation.<br /><b>Tipp:</b> Starte neue Projekte, pflege Routinen und bleibe aktiv.</Typography>
      </>,
    },
    {
      label: "Vollmond",
      svg: <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="35" fill="#fff" stroke="#ffd700" strokeWidth="4" /></svg>,
      content: <>
        <Typography variant="body2" sx={{ mb: 2 }}>Höhepunkt, Klarheit, Manifestation, starke Emotionen.<br /><b>Tipp:</b> Feiere Erfolge, reflektiere, meditiere und manifestiere deine Wünsche.<br /><b>Astro-Hinweis:</b> Der Vollmond steht oft für starke Gefühle und kann zu Schlaflosigkeit führen.</Typography>
      </>,
    },
    {
      label: "Abnehmender Mond",
      svg: <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="35" fill="#ffd700" /><ellipse cx="25" cy="40" rx="18" ry="35" fill="#fff" /></svg>,
      content: <>
        <Typography variant="body2" sx={{ mb: 2 }}>Loslassen, Reflexion, Reinigung, Abschluss.<br /><b>Tipp:</b> Entrümple, beende offene Themen, gönn dir Ruhe und Entspannung.</Typography>
      </>,
    },
  ];
  return (
    <>
      <AppHeader />
      <Box sx={{ minHeight: '100vh', background: 'var(--background)', py: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={4} sx={{ maxWidth: 700, width: '100%', mx: 'auto', p: 4, borderRadius: 3, boxShadow: '0 4px 24px rgba(0,180,216,0.08)', background: 'var(--card-bg)', border: '2px solid #7c3aed' }}>
          <Typography variant="h4" sx={{ mb: 3, color: '#4b2e83', fontWeight: 800 }}>
            Mondphasen – Info & Bedeutung
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            {phases[phase].svg}
          </Box>
          <Tabs value={phase} onChange={(_, v) => setPhase(v)} centered sx={{ mb: 2 }}>
            {phases.map((p, i) => (
              <Tab key={p.label} label={p.label} />
            ))}
          </Tabs>
          {phases[phase].content}
          <Typography variant="h6" sx={{ mt: 4, mb: 1, color: '#4b2e83' }}>Weitere Hinweise</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Die Mondphasen sind ein natürlicher Rhythmus, der dich unterstützen kann, bewusster zu leben. Viele Menschen nutzen sie für Rituale, Meditation und persönliche Entwicklung.<br />
            <b>Ritual-Idee:</b> Schreibe zum Neumond deine Wünsche auf und verbrenne sie zum Vollmond als Zeichen des Loslassens.
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
