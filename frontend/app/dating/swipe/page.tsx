"use client";
import React, { useState } from "react";
import { Box, Typography, Card, CardContent, Button, Avatar, Chip } from "@mui/material";
import { Heart, User } from "lucide-react";
import AppHeader from "../../../components/AppHeader";

const profiles = [
    { id: 1, name: "Anna", energy: "hoch", img: "/dating/lena.jpg", description: "Lebensfreude, Offenheit, liebt tiefe Gespräche." },
    { id: 2, name: "Ben", energy: "mittel", img: "/dating/tom.jpg", description: "Empathisch, kreativ, sucht ehrliche Verbindung." },
    { id: 3, name: "Clara", energy: "niedrig", img: "/dating/mia.jpg", description: "Abenteuerlustig, direkt, liebt neue Erfahrungen." },
];

export default function SwipePage() {
    const [current, setCurrent] = useState(0);
    const [matches, setMatches] = useState<number[]>([]);

    const handleSwipeRight = () => {
        setMatches([...matches, profiles[current].id]);
        nextProfile();
    };
    const handleSwipeLeft = () => {
        nextProfile();
    };
    const nextProfile = () => {
        setCurrent((prev) => (prev + 1 < profiles.length ? prev + 1 : prev));
    };

    if (current >= profiles.length) {
        return (
            <>
                <AppHeader current="/dating/swipe" />
                <Box sx={{ maxWidth: 420, mx: "auto", mt: 8, textAlign: "center" }}>
                    <Heart style={{ fontSize: 64, color: "#2196f3", marginBottom: 8, opacity: 0.18 }} />
                    <Typography variant="h4" sx={{ mb: 2, color: "#1565c0", fontWeight: 700 }}>
                        Deine energetischen Matches
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", mb: 3 }}>
                        {matches.map((id) => {
                            const match = profiles.find((p) => p.id === id);
                            return (
                                <Card key={id} sx={{ minWidth: 220, maxWidth: 320, mb: 2, bgcolor: "#fffde4", boxShadow: "0 4px 24px #2196f3" }}>
                                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Avatar src={match?.img} sx={{ width: 72, height: 72, mb: 1, boxShadow: "0 2px 8px #2196f3", border: "2px solid #1565c0" }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1565c0" }}>{match?.name}</Typography>
                                        <Chip label={`Energie: ${match?.energy}`} color={match?.energy === "hoch" ? "success" : match?.energy === "mittel" ? "warning" : "default"} sx={{ mt: 1, mb: 1 }} />
                                        <Typography variant="body2" sx={{ color: "#3b2e5a", textAlign: "center" }}>{match?.description}</Typography>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                    <Typography variant="body2" sx={{ color: "#888", mt: 2 }}>
                        {matches.length === 0 ? "Kein Match gefunden." : `${matches.length} Matches gefunden.`}
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 3, background:'#1565c0' }} onClick={() => { setCurrent(0); setMatches([]); }}>Nochmal swipen</Button>
                </Box>
            </>
        );
    }

    const profile = profiles[current];
    return (
        <>
            <AppHeader current="/dating/swipe" />
            <Box sx={{ maxWidth: 420, mx: "auto", mt: 8, textAlign: "center" }}>
                <Heart style={{ fontSize: 64, color: "#2196f3", marginBottom: 8, opacity: 0.18 }} />
                <Card elevation={6} sx={{ p: 4, borderRadius: 6, boxShadow: "0 4px 24px #2196f3", background: "linear-gradient(135deg,#fffde4 0%,#bbdefb 100%)", display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                    <Avatar src={profile.img} sx={{ width: 96, height: 96, mb: 2, boxShadow: "0 2px 8px #2196f3", border: "2px solid #1565c0" }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1565c0", mb: 1 }}>{profile.name}</Typography>
                    <Chip label={`Energie: ${profile.energy}`} color={profile.energy === "hoch" ? "success" : profile.energy === "mittel" ? "warning" : "default"} sx={{ mb: 1 }} />
                    <Typography variant="body2" sx={{ color: "#3b2e5a", mb: 2, textAlign: "center" }}>{profile.description}</Typography>
                    <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                        <Button variant="outlined" sx={{ borderColor: "#1565c0", color: "#1565c0", fontWeight: 600 }} onClick={handleSwipeLeft}>Nicht mein Typ</Button>
                        <Button variant="contained" sx={{ background: "#1565c0", color: "#fff", fontWeight: 600, boxShadow: "0 2px 8px #2196f3" }} onClick={handleSwipeRight}>Match!</Button>
                    </Box>
                </Card>
                <Typography variant="body2" sx={{ color: "#888", mt: 2 }}>
                    {current + 1} / {profiles.length} Profile
                </Typography>
                <Box sx={{ mt: 3, bgcolor: "#fffde4", p: 2, borderRadius: 4, boxShadow: "0 2px 8px #2196f3" }}>
                    <Typography variant="subtitle2" sx={{ color: "#1565c0", fontWeight: 600, mb: 1 }}>Was bedeutet ein energetisches Match?</Typography>
                    <Typography variant="body2" sx={{ color: "#3b2e5a" }}>
                        Ein energetisches Match bedeutet, dass die Energielevel von zwei Personen besonders gut harmonieren. Das kann zu mehr Verständnis, Harmonie und positiver Dynamik in der Beziehung führen.
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
