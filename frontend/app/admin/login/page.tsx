"use client";
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Paper, Link, InputAdornment } from "@mui/material";
import { Shield, Eye, EyeOff, Crown, User, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("http://localhost:4001/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        setMessage("Admin-Login erfolgreich! Weiterleitung zum Dashboard...");
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.admin || { username }));
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else {
        setMessage(data.error || "Admin-Login fehlgeschlagen.");
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
      background: `
        radial-gradient(ellipse at top, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      py: 4,
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Floating Stars Background */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none"
      }}>
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: "rgba(255, 255, 255, 0.6)",
              borderRadius: "50%",
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
              '@keyframes twinkle': {
                '0%': { opacity: 0.3, transform: 'scale(1)' },
                '100%': { opacity: 1, transform: 'scale(1.2)' }
              }
            }}
          />
        ))}
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <Paper elevation={0} sx={{ 
          maxWidth: 450, 
          width: "90%", 
          mx: "auto", 
          p: 4, 
          borderRadius: 4, 
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Box sx={{ 
              width: 90, 
              height: 90, 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)",
              position: "relative",
              animation: "pulse 2s ease-in-out infinite"
            }}>
              <Shield size={36} style={{ color: "#fff" }} />
              <Box sx={{
                position: "absolute",
                top: -8,
                right: -8,
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(251, 191, 36, 0.4)"
              }}>
                <Crown size={14} style={{ color: "#1e3a8a" }} />
              </Box>
            </Box>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Typography variant="h3" sx={{ 
              color: "#FFD700", 
              fontWeight: 800,
              mb: 1,
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              background: "linear-gradient(45deg, #FFD700, #fbbf24)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              <Sparkles size={32} style={{ marginRight: 12, verticalAlign: "middle" }} />
              Admin Portal
            </Typography>
            <Typography variant="h6" sx={{ 
              color: "rgba(255,255,255,0.8)",
              mb: 3,
              fontWeight: 300
            }}>
              Exklusiver Administrator-Zugang
            </Typography>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <form onSubmit={handleLogin}>
              <TextField 
                label="Admin Benutzername" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                fullWidth 
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                    '&:hover': {
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                    },
                    '&.Mui-focused': {
                      border: '1px solid #8b5cf6',
                      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#8b5cf6',
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: 'white !important',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      opacity: 1,
                    }
                  },
                  // Password Manager Override
                  '& input': {
                    color: 'white !important',
                    backgroundColor: 'transparent !important',
                    '&:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.05) inset !important',
                      WebkitTextFillColor: 'white !important',
                      transition: 'background-color 5000s ease-in-out 0s',
                    },
                    '&:-webkit-autofill:hover': {
                      WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.05) inset !important',
                      WebkitTextFillColor: 'white !important',
                    },
                    '&:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.05) inset !important',
                      WebkitTextFillColor: 'white !important',
                    },
                    '&:-webkit-autofill:active': {
                      WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.05) inset !important',
                      WebkitTextFillColor: 'white !important',
                    }
                  }
                }}
                autoFocus
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField 
                label="Admin Passwort" 
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                fullWidth 
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                    '&:hover': {
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                    },
                    '&.Mui-focused': {
                      border: '1px solid #8b5cf6',
                      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#8b5cf6',
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: 'white !important',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      opacity: 1,
                    }
                  },
                  // Password Manager Override
                  '& input': {
                    color: 'white !important',
                    backgroundColor: 'transparent !important',
                    '&:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.05) inset !important',
                      WebkitTextFillColor: 'white !important',
                      transition: 'background-color 5000s ease-in-out 0s',
                    },
                    '&:-webkit-autofill:hover': {
                      WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.05) inset !important',
                      WebkitTextFillColor: 'white !important',
                    },
                    '&:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.05) inset !important',
                      WebkitTextFillColor: 'white !important',
                    },
                    '&:-webkit-autofill:active': {
                      WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.05) inset !important',
                      WebkitTextFillColor: 'white !important',
                    }
                  }
                }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ 
                          minWidth: "auto", 
                          p: 1,
                          color: 'rgba(255, 255, 255, 0.5)',
                          '&:hover': {
                            color: '#8b5cf6',
                            background: 'rgba(139, 92, 246, 0.1)'
                          }
                        }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  disabled={loading || !username || !password}
                  sx={{ 
                    background: "linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)",
                    color: "#fff", 
                    fontWeight: 700, 
                    py: 2,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #7c3aed, #2563eb, #0891b2)",
                      boxShadow: "0 12px 40px rgba(139, 92, 246, 0.6)",
                      transform: "translateY(-2px)"
                    },
                    "&:disabled": {
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.3)",
                      border: "1px solid rgba(255, 255, 255, 0.1)"
                    }
                  }}
                >
                  {loading ? "Anmeldung läuft..." : "🔐 Admin Anmelden"}
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity={message.includes("erfolgreich") ? "success" : "error"} 
                sx={{ 
                  mt: 3, 
                  borderRadius: 3,
                  background: message.includes("erfolgreich") 
                    ? "rgba(34, 197, 94, 0.1)" 
                    : "rgba(239, 68, 68, 0.1)",
                  border: message.includes("erfolgreich")
                    ? "1px solid rgba(34, 197, 94, 0.3)"
                    : "1px solid rgba(239, 68, 68, 0.3)",
                  color: "white",
                  '& .MuiAlert-icon': {
                    color: message.includes("erfolgreich") ? "#22c55e" : "#ef4444"
                  }
                }}
              >
                {message}
              </Alert>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
                Kein Admin-Zugang?
              </Typography>
              <Link 
                href="/login" 
                sx={{ 
                  color: "#8b5cf6", 
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": {
                    textDecoration: "underline",
                    color: "#a855f7"
                  }
                }}
              >
                ← Zurück zum User-Login
              </Link>
            </Box>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Box sx={{ 
              mt: 3, 
              p: 3, 
              background: "rgba(139, 92, 246, 0.1)", 
              borderRadius: 3,
              border: "1px solid rgba(139, 92, 246, 0.2)",
              backdropFilter: "blur(10px)"
            }}>
              <Typography variant="body2" sx={{ 
                color: "rgba(255,255,255,0.8)",
                textAlign: "center",
                fontWeight: 500
              }}>
                ⚠️ Nur für berechtigte Administratoren
              </Typography>
            </Box>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
}
