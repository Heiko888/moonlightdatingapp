"use client";
import React, { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from "@mui/material";
import axios from "axios";

const AdminRegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post("http://localhost:4000/admin/register", form);
      if (res.data.success) {
        setSuccess("Admin erfolgreich registriert!");
        setForm({ username: "", email: "", password: "" });
      } else {
        setError(res.data.error || "Unbekannter Fehler.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Serverfehler.");
      } else {
        setError("Serverfehler.");
      }
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 8 }}>
      <Card sx={{ p: 3, boxShadow: "0 4px 24px #e0c3fc", borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: "#7c3aed" }}>
            Admin Registrierung
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Benutzername"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="E-Mail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Passwort"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
              {loading ? "Registriere..." : "Registrieren"}
            </Button>
          </form>
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminRegisterPage;
