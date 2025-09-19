"use client";
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Paper, Link } from "@mui/material";
import { Shield, Eye, EyeOff, Crown, AlertTriangle } from "lucide-react";

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwörter stimmen nicht überein.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Admin-Passwort muss mindestens 8 Zeichen lang sein.");
      setLoading(false);
      return;
    }

    if (!formData.adminCode || formData.adminCode !== "HD2024ADMIN") {
      setMessage("Ungültiger Admin-Code.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:4001/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Admin-Account erfolgreich erstellt! Du wirst zum Admin-Login weitergeleitet...");
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      } else {
        setMessage(data.error || "Admin-Registrierung fehlgeschlagen.");
      }
    } catch (error) {
      setMessage("Verbindungsfehler. Bitte prüfe deine Internetverbindung.");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)",
      py: 4
    }}>
      <Paper elevation={24} sx={{ 
        maxWidth: 550, 
        width: "90%", 
        mx: "auto", 
        p: 4, 
        borderRadius: 4, 
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #1e3a8a, #3b82f6)"
        }
      }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
            boxShadow: "0 8px 32px rgba(30, 58, 138, 0.3)",
            position: "relative"
          }}>
            <Shield size={32} style={{ color: "#fff" }} />
            <Box sx={{
              position: "absolute",
              top: -5,
              right: -5,
              background: "#fbbf24",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Crown size={12} style={{ color: "#1e3a8a" }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ 
            color: "#1e3a8a", 
            fontWeight: 700,
            mb: 1
          }}>
            Admin Account erstellen
          </Typography>
          <Typography variant="body1" sx={{ 
            color: "#64748b",
            mb: 3
          }}>
            Registriere einen neuen Administrator
          </Typography>
        </Box>

        <Box sx={{ 
          mb: 3, 
          p: 2, 
          background: "rgba(245, 158, 11, 0.1)", 
          borderRadius: 2,
          border: "1px solid rgba(245, 158, 11, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: 1
        }}>
          <AlertTriangle size={20} style={{ color: "#f59e0b" }} />
          <Typography variant="body2" sx={{ color: "#92400e" }}>
            Nur für berechtigte Personen mit Admin-Code
          </Typography>
        </Box>

        <form onSubmit={handleRegister}>
          <TextField 
            label="Admin Benutzername" 
            name="username"
            value={formData.username} 
            onChange={handleChange}
            fullWidth 
            sx={{ mb: 3 }}
            autoFocus
            variant="outlined"
            InputProps={{
              style: { borderRadius: 12 }
            }}
            required
          />
          
          <TextField 
            label="Admin E-Mail" 
            name="email"
            type="email"
            value={formData.email} 
            onChange={handleChange}
            fullWidth 
            sx={{ mb: 3 }}
            variant="outlined"
            InputProps={{
              style: { borderRadius: 12 }
            }}
            required
          />
          
          <TextField 
            label="Admin Passwort (min. 8 Zeichen)" 
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password} 
            onChange={handleChange}
            fullWidth 
            sx={{ mb: 3 }}
            variant="outlined"
            InputProps={{
              style: { borderRadius: 12 },
              endAdornment: (
                <Button
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{ minWidth: "auto", p: 1 }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              )
            }}
            required
          />

          <TextField 
            label="Passwort bestätigen" 
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword} 
            onChange={handleChange}
            fullWidth 
            sx={{ mb: 3 }}
            variant="outlined"
            InputProps={{
              style: { borderRadius: 12 },
              endAdornment: (
                <Button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  sx={{ minWidth: "auto", p: 1 }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              )
            }}
            required
          />

          <TextField 
            label="Admin-Code" 
            name="adminCode"
            type="password"
            value={formData.adminCode} 
            onChange={handleChange}
            fullWidth 
            sx={{ mb: 3 }}
            variant="outlined"
            InputProps={{
              style: { borderRadius: 12 }
            }}
            required
            helperText="Erforderlich für Admin-Registrierung"
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.adminCode}
            sx={{ 
              background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
              color: "#fff", 
              fontWeight: 600, 
              py: 1.5,
              borderRadius: 3,
              fontSize: "1.1rem",
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(30, 58, 138, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #1e40af, #2563eb)",
                boxShadow: "0 6px 20px rgba(30, 58, 138, 0.4)"
              },
              "&:disabled": {
                background: "#e2e8f0",
                color: "#a0aec0"
              }
            }}
          >
            {loading ? "Registrierung läuft..." : "Admin Account erstellen"}
          </Button>
        </form>

        {message && (
          <Alert 
            severity={message.includes("erfolgreich") ? "success" : "error"} 
            sx={{ mt: 3, borderRadius: 2 }}
          >
            {message}
          </Alert>
        )}

        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #e2e8f0" }}>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
            Bereits Admin-Account?
          </Typography>
          <Link 
            href="/admin/login" 
            sx={{ 
              color: "#1e3a8a", 
              textDecoration: "none",
              fontWeight: 600,
              "&:hover": {
                textDecoration: "underline"
              }
            }}
          >
            Jetzt Admin anmelden
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
