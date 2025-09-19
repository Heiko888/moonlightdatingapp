"use client";
import React from "react";
// import AppHeader from "../../../components/AppHeader";
import { Box, Typography, Button, Grid } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import Link from "next/link";
import { Users, BookOpen, MessageCircle, HomeIcon } from "lucide-react";


import { useEffect } from "react";

const AdminDashboard = () => {
  // Login-Weiterleitung entfernt: Adminbereich ist jetzt ohne Login nutzbar

  return (
    <>
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6, p: 2, background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", borderRadius: 6, boxShadow: "0 4px 24px rgba(120, 60, 180, 0.12)" }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", mb: 4, textAlign: "center", color: "#7c3aed", textShadow: "0 2px 8px #e0c3fc" }}>
          Admin Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: "linear-gradient(120deg, #f3e7e9 0%, #c9e4f6 100%)", border: "1px solid #e0c3fc", boxShadow: "0 2px 12px rgba(124, 60, 237, 0.08)", borderRadius: 4 }}>
              <CardHeader>
                <CardTitle>
                  <Users size={28} style={{ marginRight: 8, color: "#7c3aed" }} />
                  <span style={{ color: "#7c3aed", fontWeight: 600 }}>Nutzerverwaltung</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2, color: "#3b2e5a" }}>
                  Übersicht und Verwaltung aller Nutzer.
                </Typography>
                <Link href="/admin">
                  <Button variant="contained" fullWidth sx={{ background: "linear-gradient(90deg, #7c3aed 0%, #8ec5fc 100%)", color: "#fff", fontWeight: 600, boxShadow: "0 2px 8px #e0c3fc" }}>Zum Adminbereich</Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: "linear-gradient(120deg, #f3e7e9 0%, #f6eec7 100%)", border: "1px solid #f6eec7", boxShadow: "0 2px 12px rgba(237, 200, 60, 0.08)", borderRadius: 4 }}>
              <CardHeader>
                <CardTitle>
                  <BookOpen size={28} style={{ marginRight: 8, color: "#eab308" }} />
                  <span style={{ color: "#eab308", fontWeight: 600 }}>Wissensdatenbank</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2, color: "#5a4a1e" }}>
                  Verwalte Einträge und Dateien der Wissensdatenbank.
                </Typography>
                <Link href="/knowledge">
                  <Button variant="contained" fullWidth sx={{ background: "linear-gradient(90deg, #eab308 0%, #f6eec7 100%)", color: "#fff", fontWeight: 600, boxShadow: "0 2px 8px #f6eec7" }}>Zur Wissensdatenbank</Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: "linear-gradient(120deg, #e0c3fc 0%, #a8edea 100%)", border: "1px solid #a8edea", boxShadow: "0 2px 12px rgba(8, 205, 172, 0.08)", borderRadius: 4 }}>
              <CardHeader>
                <CardTitle>
                  <MessageCircle size={28} style={{ marginRight: 8, color: "#06b6d4" }} />
                  <span style={{ color: "#06b6d4", fontWeight: 600 }}>Coaching Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2, color: "#155e63" }}>
                  Übersicht und Verwaltung der Coaching-Angebote.
                </Typography>
                <Link href="/coaching">
                  <Button variant="contained" fullWidth sx={{ background: "linear-gradient(90deg, #06b6d4 0%, #a8edea 100%)", color: "#fff", fontWeight: 600, boxShadow: "0 2px 8px #a8edea" }}>Zu Coaching</Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: "linear-gradient(120deg, #f3e7e9 0%, #e0c3fc 100%)", border: "1px solid #e0c3fc", boxShadow: "0 2px 12px rgba(124, 60, 237, 0.08)", borderRadius: 4 }}>
              <CardHeader>
                <CardTitle>
                  <HomeIcon size={28} style={{ marginRight: 8, color: "#a855f7" }} />
                  <span style={{ color: "#a855f7", fontWeight: 600 }}>Startseite</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2, color: "#3b2e5a" }}>
                  Zurück zur Hauptübersicht der App.
                </Typography>
                <Link href="/">
                  <Button variant="contained" fullWidth sx={{ background: "linear-gradient(90deg, #a855f7 0%, #e0c3fc 100%)", color: "#fff", fontWeight: 600, boxShadow: "0 2px 8px #e0c3fc" }}>Zur Startseite</Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: "linear-gradient(120deg, #e0c3fc 0%, #f9fafc 100%)", border: "1px solid #e0c3fc", boxShadow: "0 2px 12px rgba(124, 60, 237, 0.08)", borderRadius: 4 }}>
              <CardHeader>
                <CardTitle>
                  <span style={{ color: "#7c3aed", fontWeight: 600 }}>Energie-Tracker</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2, color: "#3b2e5a" }}>
                  Tracke und speichere dein Energielevel.
                </Typography>
                <Link href="/admin/energietracker">
                  <Button variant="contained" fullWidth sx={{ background: "linear-gradient(90deg, #7c3aed 0%, #e0c3fc 100%)", color: "#fff", fontWeight: 600, boxShadow: "0 2px 8px #e0c3fc" }}>Zum Energie-Tracker</Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 6, textAlign: "center", background: "rgba(255,255,255,0.7)", borderRadius: 4, p: 3, boxShadow: "0 2px 8px #e0c3fc" }}>
          <Typography variant="h5" sx={{ mb: 2, color: "#7c3aed", textShadow: "0 2px 8px #e0c3fc" }}>
            Statistiken & Schnellzugriff
          </Typography>
          <Typography variant="body1" sx={{ color: "#3b2e5a" }}>
            (Hier können später z. B. Upload-Statistiken, Nutzerzahlen oder Systeminfos angezeigt werden)
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;
