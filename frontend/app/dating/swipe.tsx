"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, TextField } from "@mui/material";
import axios from "axios";
import Image from "next/image";


interface Profile {
  _id?: string;
  name: string;
  img?: string;
  type?: string;
  hdProfile?: string;
  description?: string;
  interests?: string[];
  hobbies?: string[];
  matchScore?: number;
}

const DatingSwipePage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filter, setFilter] = useState("");
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [showMatch, setShowMatch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        // Dummy-Profile mit energetischem Match
        const dummyProfiles: Profile[] = [
          {
            _id: '1',
            name: 'Sophie',
            img: '/images/sophie.jpg',
            type: 'Generator',
            hdProfile: '3/5',
            description: 'Reiselustig, kreativ und offen für Neues.',
            interests: ['Musik', 'Yoga', 'Kunst'],
            hobbies: ['Lesen', 'Reisen'],
            matchScore: 87
          },
          {
            _id: '2',
            name: 'Max',
            img: '/images/max.jpg',
            type: 'Projektor',
            hdProfile: '2/4',
            description: 'Sportlich, naturverbunden und humorvoll.',
            interests: ['Sport', 'Natur', 'Kunst'],
            hobbies: ['Joggen', 'Reisen'],
            matchScore: 73
          },
          {
            _id: '3',
            name: 'Anna',
            img: '/images/anna.jpg',
            type: 'Manifestor',
            hdProfile: '1/3',
            description: 'Musikliebhaberin und Genießerin.',
            interests: ['Musik', 'Kunst', 'Yoga'],
            hobbies: ['Lesen', 'Kochen'],
            matchScore: 92
          }
        ];
        setProfiles(dummyProfiles);
        // Für Demo keine API-Abfrage
        // const res = await axios.get("/api/dating/profiles");
        // setProfiles(res.data);
      } catch (err) {
        setError("Fehler beim Laden der Profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 120);
  }, []);

  const filteredProfiles = profiles.filter(
    (p) =>
      filter === "" ||
      p.interests?.includes(filter) ||
      p.hobbies?.includes(filter)
  );

  if (loading) return <Typography>Lade Profile...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (filteredProfiles.length === 0) return <Typography>Keine Profile gefunden.</Typography>;

  // Zeige 3 Profile nebeneinander
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
        {filteredProfiles.slice(0, 3).map((profile, idx) => {
          const myProfile = { interests: ["Musik", "Yoga", "Kunst"], hobbies: ["Lesen", "Reisen"] };
          const commonInterests = profile.interests?.filter((i: string) => myProfile.interests.includes(i)) || [];
          const commonHobbies = profile.hobbies?.filter((h: string) => myProfile.hobbies.includes(h)) || [];
          return (
            <Paper key={profile._id || idx} elevation={8} sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: animate ? "0 8px 32px #b39ddb" : "0 8px 32px #90caf9",
              background: animate ? "linear-gradient(135deg,#ede7f6 0%,#b39ddb 60%,#7e57c2 100%)" : "linear-gradient(135deg,#e3f2fd 0%,#90caf9 60%,#1976d2 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1), box-shadow 0.3s, background 0.3s',
              '&:hover': { transform: 'scale(1.05)', boxShadow: '0 16px 48px #7e57c2', zIndex: 2 }
            }}>
              {profile.img && (
                <Box sx={{
                  borderRadius: "50%",
                  p: 0.5,
                  mb: 2,
                  background: "linear-gradient(135deg,#90caf9 0%,#1976d2 100%)",
                  boxShadow: "0 0 16px #90caf9",
                  transition: "box-shadow 0.3s",
                  '&:hover': { boxShadow: '0 0 32px #1976d2' }
                }}>
                  <Image
                    src={profile.img}
                    alt={profile.name}
                    width={120}
                    height={120}
                    style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #1976d2" }}
                  />
                </Box>
              )}
              <Typography variant="h5" sx={{ mt: 1, fontWeight: 700, color: "#1976d2" }}>{profile.name}</Typography>
              <Typography variant="subtitle1" sx={{ color: "#1565c0", mb: 1 }}>Typ: {profile.type} | HD: {profile.hdProfile}</Typography>
              <Typography sx={{ mt: 1, color: "#3b2e5a" }}>{profile.description}</Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                {profile.interests?.map((i, idx) => (
                  <Box key={idx} sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: commonInterests.includes(i) ? "#b2ff59" : "#e3f2fd", color: commonInterests.includes(i) ? "#33691e" : "#1976d2", fontWeight: 600, fontSize: 13, boxShadow: commonInterests.includes(i) ? "0 0 8px #b2ff59" : "none" }}>{i}</Box>
                ))}
              </Box>
              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                {profile.hobbies?.map((h, idx) => (
                  <Box key={idx} sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: commonHobbies.includes(h) ? "#ffecb3" : "#e3f2fd", color: commonHobbies.includes(h) ? "#ff9800" : "#1976d2", fontWeight: 600, fontSize: 13, boxShadow: commonHobbies.includes(h) ? "0 0 8px #ff9800" : "none" }}>{h}</Box>
                ))}
              </Box>
              <Typography sx={{ mt: 1, color: "primary.main", fontWeight: 700 }}>Energetisches Match: {profile.matchScore}%</Typography>
            </Paper>
          );
        })}
      </Box>
      <Box sx={{ mt: 3 }}>
        <TextField
          label="Filter (Interesse/Hobby)"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          fullWidth
        />
      </Box>
      <style>{`
        @keyframes matchPop {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default DatingSwipePage;
