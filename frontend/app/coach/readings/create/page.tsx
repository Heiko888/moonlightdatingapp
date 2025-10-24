'use client';

import React from 'react';
import { Box, Container, Typography, Alert, Button } from '@mui/material';
import Link from 'next/link';

export default function ReadingCreatorPage() {
  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Container maxWidth="sm">
        <Alert severity="info" sx={{ mb: 2 }}>
          Diese Seite ist vorübergehend deaktiviert, während wir einen Build-Fehler beheben.
        </Alert>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
          Reading Creator
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Bitte versuche es später erneut. Alle anderen Bereiche der App stehen zur Verfügung.
        </Typography>
        <Link href="/coach/dashboard" passHref>
          <Button variant="contained">Zurück zum Dashboard</Button>
        </Link>
      </Container>
    </Box>
  );
}


