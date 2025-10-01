"use client";
import React, { useEffect, useState } from "react";
import AppHeader from "../../../components/AppHeader";
import { Box, Typography, Paper, Button } from "@mui/material";
import { User, Sparkles } from "lucide-react";
import Image from "next/image";
import axios from "axios";

type Profile = {
  _id: string;
  name: string;
  type: string;
  hdType: string;
  location: string;
  interests: string[];
  img: string;
  description: string;
};

export default function FriendsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [animate, setAnimate] = useState<boolean>(false);
  const userId = "currentUserId"; // Replace with actual user ID

  const [filterType, setFilterType] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [favorites, setFavorites] = useState<{[id:string]:boolean}>({});

  const handleFavorite = (id: string) => {
    setFavorites(f => ({ ...f, [id]: !f[id] }));
  };

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true);
        const res = await axios.get("/api/user/all");
        setProfiles(res.data.filter((p: Profile) => p._id !== userId));
      } catch {
        setError("Fehler beim Laden der Profile.");
        // Dummyprofile anlegen, falls Fehler
        setProfiles([
          {
            _id: "dummy1",
            name: "Anna Beispiel",
            type: "Kreativ & Offen",
            hdType: "Generator",
            location: "Berlin",
            interests: ["Kunst", "Musik", "Yoga"],
            img: "/dating/default.jpg",
            description: "Liebt Kunst, Musik und neue Freundschaften.",
          },
          {
            _id: "dummy2",
            name: "Max Muster",
            type: "Sportlich & Aktiv",
            hdType: "Projektor",
            location: "Hamburg",
            interests: ["Sport", "Reisen", "Kochen"],
            img: "/dating/default.jpg",
            description: "Immer für ein Abenteuer zu haben.",
          },
          {
            _id: "dummy3",
            name: "Sophie Test",
            type: "Leseratte & Genießerin",
            hdType: "Manifestor",
            location: "München",
            interests: ["Bücher", "Kaffee", "Spiritualität"],
            img: "/dating/default.jpg",
            description: "Mag Bücher, Kaffee und gute Gespräche.",
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
    setTimeout(() => setAnimate(true), 120);
  }, [userId]);

  const handleRequest = async (targetId: string) => {
    setSuccess("");
    setError("");
    try {
      await axios.post("/api/friendrequest/send", { from: userId, to: targetId });
      setSuccess("Anfrage gesendet!");
    } catch {
      setError("Fehler beim Senden der Anfrage.");
    }
  };

  return (
    <>
      <AppHeader />
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 8, position: "relative", background: 'rgba(44,24,77,0.92)', borderRadius: 5, boxShadow: '0 4px 32px #2a174d', py: { xs: 4, md: 6 }, px: { xs: 2, md: 6 } }}>
        <User style={{ position: "absolute", top: -40, left: 20, fontSize: 90, color: "#b39ddb", opacity: 0.18, zIndex: 0, filter: "drop-shadow(0 0 16px #b39ddb)" }} />
        <Typography variant="h4" sx={{ mb: 1.5, textAlign: "center", color: "#b39ddb", fontWeight: 900, textShadow: "0 0 16px #7e57c2" }}>
          <Sparkles style={{ marginRight: 8, verticalAlign: "middle", color: "#b39ddb", filter: "drop-shadow(0 0 8px #7e57c2)" }} /> Freundschaftsbereich
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, textAlign: "center", color: "#d1c4e9", fontStyle: "italic" }}>
          &quot;Finde neue Freunde und gemeinsame Interessen.&quot;
        </Typography>
        {loading && <Typography sx={{ color: '#888', textAlign: 'center', mb: 2 }}>Lade Profile...</Typography>}
        {error && <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ textAlign: 'center', mb: 2 }}>{success}</Typography>}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#b39ddb", textAlign: "center", fontWeight: 700 }}>Freundschafts-Profil-Vorschau</Typography>
          {/* Filter */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>Typ:</Typography>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '6px', borderRadius: 6 }}>
                <option value="">Alle</option>
                <option value="Generator">Generator</option>
                <option value="Projektor">Projektor</option>
                <option value="Manifestor">Manifestor</option>
                <option value="Reflektor">Reflektor</option>
              </select>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>Ort:</Typography>
              <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} style={{ padding: '6px', borderRadius: 6 }}>
                <option value="">Alle</option>
                <option value="Berlin">Berlin</option>
                <option value="Hamburg">Hamburg</option>
                <option value="München">München</option>
              </select>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
            {profiles
              .filter(p => (!filterType || p.hdType === filterType) && (!filterLocation || p.location === filterLocation))
              .map((profile, idx) => (
                <Paper elevation={8} sx={{
                  p: 3,
                  borderRadius: 3,
                  minWidth: 260,
                  maxWidth: 320,
                  minHeight: 420,
                  boxShadow: animate ? "0 2px 8px #b39ddb" : "0 6px 32px #4b2e83",
                  background: animate ? "#3a2069" : "#2a174d",
                  color: '#fff',
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  opacity: animate ? 1 : 0,
                  transform: animate ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1), box-shadow 0.7s cubic-bezier(.4,0,.2,1), background 0.3s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: '0 6px 24px #b39ddb', zIndex: 2 }
                }} key={profile._id}>
                  <User style={{ fontSize: 52, color: "#b39ddb", marginBottom: 8, filter: "drop-shadow(0 0 8px #7e57c2)" }} />
                  <Box sx={{
                    borderRadius: "50%",
                    p: 0.5,
                    mb: 1,
                    background: "linear-gradient(135deg,#b39ddb 0%,#7e57c2 100%)",
                    boxShadow: "0 0 12px #b39ddb",
                    transition: "box-shadow 0.3s",
                    '&:hover': { boxShadow: '0 0 24px #7e57c2' }
                  }}>
                    <Image src={profile.img || "/dating/default.jpg"} alt={profile.name} width={72} height={72} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #7e57c2" }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#b39ddb" }}>{profile.name}</Typography>
                  <Typography variant="body2" sx={{ color: "#d1c4e9", mb: 1 }}>{profile.type}</Typography>
                  {profile.hdType && (
                    <Typography variant="body2" sx={{ color: "#d1c4e9" }}>Typ: {profile.hdType}</Typography>
                  )}
                  {profile.location && (
                    <Typography variant="body2" sx={{ color: "#d1c4e9" }}>Ort: {profile.location}</Typography>
                  )}
                  {profile.interests && profile.interests.length > 0 && (
                    <Typography variant="body2" sx={{ color: "#d1c4e9" }}>Interessen: {profile.interests.join(", ")}</Typography>
                  )}
                  <Typography variant="body2" sx={{ color: "#d1c4e9", mb: 2, textAlign: "center" }}>{profile.description}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Button
                      variant={favorites[profile._id] ? "contained" : "outlined"}
                      color="secondary"
                      sx={{ minWidth: 0, px: 1, borderRadius: 2, boxShadow: favorites[profile._id] ? '0 2px 12px #b39ddb' : undefined, background: favorites[profile._id] ? '#b39ddb' : undefined, color: favorites[profile._id] ? '#fff' : '#b39ddb' }}
                      onClick={() => handleFavorite(profile._id)}
                    >
                      <span style={{ fontSize: 18, color: favorites[profile._id] ? '#e91e63' : '#fff' }}>♥</span>
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ minWidth: 0, px: 1, borderRadius: 2, color: '#b39ddb', borderColor: '#b39ddb' }}
                      href="/chat-new"
                    >
                      <span style={{ fontSize: 18, color: '#b39ddb' }}>💬</span>
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Sparkles style={{ color: '#fff', fontSize: 20 }} />}
                    sx={{
                      background: "linear-gradient(90deg,#b39ddb 60%,#7e57c2 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      boxShadow: "0 2px 12px #b39ddb",
                      transition: "background 0.2s, box-shadow 0.2s",
                      '&:hover': {
                        background: "linear-gradient(90deg,#7e57c2 60%,#b39ddb 100%)",
                        boxShadow: "0 4px 24px #7e57c2"
                      }
                    }}
                    onClick={() => handleRequest(profile._id)}
                  >
                    Freundschaft anfragen
                  </Button>
                </Paper>
              ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
