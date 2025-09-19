"use client";
import React from 'react';
import HDChart from '@/components/HDChart';
import { Box, Typography } from '@mui/material';

export default function ExampleChartPage() {
  // Beispiel: MG mit 34-20 aktiv, plus Gates 34,20,10 aktiv, Zentren Sakral & Kehle definiert
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Beispiel: Human Design Chart (datengetrieben)
      </Typography>
      <HDChart
        width={420}
        height={720}
        definedChannels={["34-20"]}
        activeGates={[34, 20, 10]}
        definedCenters={["sacral", "throat"]}
        colors={{
          background: "linear-gradient(180deg,#fafafa,#fff)",
          centerFillDefined: "#ffe082"
        }}
      />
    </Box>
  );
}
