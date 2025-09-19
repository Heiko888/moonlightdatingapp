"use client";
import React, { useState } from "react";
import AppHeader from "../../components/AppHeader";
import { Box, Typography, Paper, TextField, Button, Alert } from "@mui/material";
import axios from "axios";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:4000/admin/login", { username, password });
      if (res.data.success) {
        setMessage("Login erfolgreich!");
        localStorage.setItem("isAdmin", "true");
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 800);
      } else {
        setMessage("Login fehlgeschlagen!");
      }
    } catch {
      setMessage("Login fehlgeschlagen!");
    }
    setLoading(false);
  };

  return (
    <>
      <AppHeader current="/admin/login" />
      <Box sx={{ 
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
        `,
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Paper elevation={4} sx={{ 
          p: 4, 
          borderRadius: 4, 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          maxWidth: 400, 
          mx: "auto", 
          mt: 10 
        }}>
          <Typography variant="h4" sx={{ 
            mb: 3, 
            textAlign: "center", 
            color: "#FFD700",
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700
          }}>
            Admin Login
          </Typography>
          <TextField
            label="Benutzername"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'rgba(255,255,255,0.9)',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#FFD700',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#FFD700',
                },
              },
            }}
          />
          <TextField
            label="Passwort"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'rgba(255,255,255,0.9)',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#FFD700',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#FFD700',
                },
              },
            }}
          />
          <Button 
            variant="contained" 
            sx={{ 
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              color: '#000',
              fontWeight: 600,
              '&:hover': { 
                background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255,215,0,0.4)'
              }
            }} 
            onClick={handleLogin} 
            disabled={loading} 
            fullWidth
          >
            {loading ? "Bitte warten..." : "Login"}
          </Button>
          {message && <Alert severity={message.includes("erfolgreich") ? "success" : "error"} sx={{ mt: 2 }}>{message}</Alert>}
        </Paper>
      </Box>
    </>
  );
}
