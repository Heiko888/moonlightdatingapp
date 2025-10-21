"use client";

import * as React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function EditProfilPage() {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          background: "var(--background)",
          py: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            maxWidth: 900,
            width: "100%",
            mx: "auto",
            p: 4,
            borderRadius: 3,
            boxShadow: "0 4px 24px rgba(0,180,216,0.08)",
            background: "var(--card-bg)",
            border: "2px solid #7c3aed",
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, color: "#4b2e83", fontWeight: 800 }}>
            Profil bearbeiten
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: "var(--foreground)" }}>
            Hier kannst du deine Profildaten ändern. (Formular folgt)
          </Typography>

          <Button
            component={Link}
            href="/settings"
            variant="outlined"
            sx={{
              color: "#4b2e83",
              borderColor: "#ffd700",
              fontWeight: 700,
              borderRadius: 2,
              px: 2,
              py: 0.7,
              background: "#fff",
              mt: 2,
              "&:hover": {
                borderColor: "#e6c200",
                background: "#fff",
              },
            }}
          >
            &larr; Zu den Einstellungen
          </Button>
        </Paper>
      </Box>
    </>
  );
}
