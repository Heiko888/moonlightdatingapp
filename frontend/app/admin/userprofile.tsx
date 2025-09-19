"use client";
import React, { useState, useRef } from "react";
import { Box, Typography, Paper, Avatar, Button, TextField, Alert, CircularProgress } from "@mui/material";

const AdminUserProfile = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setLoading(false);
      setMessage("Profil erfolgreich gespeichert!");
    }, 1200);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          <Avatar src={avatar || undefined} sx={{ width: 100, height: 100, mx: "auto" }} />
          <Button
            variant="outlined"
            size="small"
            sx={{ position: "absolute", bottom: 0, right: 0 }}
            onClick={() => fileInputRef.current?.click()}
          >
            Bild ändern
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </Box>
        <Typography variant="h4" gutterBottom>Profil anlegen</Typography>
        <TextField
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Beschreibung"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          multiline
          minRows={2}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSave} disabled={loading} fullWidth>
          {loading ? <CircularProgress size={24} /> : "Speichern"}
        </Button>
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      </Paper>
    </Box>
  );
};

export default AdminUserProfile;
