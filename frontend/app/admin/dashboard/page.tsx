"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Grid, Card, CardContent, Alert, Container } from "@mui/material";
import { motion } from 'framer-motion';
import { Shield, Users, Settings, LogOut, Crown, BarChart3, Activity, Database, Server } from "lucide-react";
import AnimatedStars from '@/components/AnimatedStars';

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminUserData = localStorage.getItem("adminUser");

    if (!adminToken) {
      window.location.href = "/admin/login";
      return;
    }

    if (adminUserData) {
      setAdminUser(JSON.parse(adminUserData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  const statsData = [
    {
      icon: <Users size={32} />,
      title: "Registrierte Benutzer",
      value: "1,247",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
    },
    {
      icon: <Shield size={32} />,
      title: "Administratoren",
      value: "5",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
    },
    {
      icon: <Settings size={32} />,
      title: "Aktive Services",
      value: "12",
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
    },
    {
      icon: <Crown size={32} />,
      title: "System Uptime",
      value: "99.9%",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)"
    }
  ];

  const quickActions = [
    {
      icon: <Users size={24} />,
      title: "Benutzer verwalten",
      description: "Benutzerkonten und Berechtigungen verwalten",
      color: "#1e3a8a"
    },
    {
      icon: <Settings size={24} />,
      title: "System-Einstellungen",
      description: "Systemkonfiguration und Parameter anpassen",
      color: "#f59e0b"
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Logs anzeigen",
      description: "Systemprotokolle und Aktivitäten einsehen",
      color: "#8b5cf6"
    },
    {
      icon: <Database size={24} />,
      title: "Backup erstellen",
      description: "Sicherungskopien und Datenexport",
      color: "#10b981"
    }
  ];

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" sx={{ color: "#fef3c7" }}>
            Lade Admin-Dashboard...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 8, position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper elevation={8} sx={{ 
            p: 4, 
            mb: 6, 
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(254,243,199,0.1) 0%, rgba(254,243,199,0.05) 100%)",
            border: "1px solid rgba(254,243,199,0.2)",
            backdropFilter: "blur(20px)"
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "0 8px 25px rgba(254,243,199,0.3)"
                }}>
                  <Shield size={28} style={{ color: "#1e293b" }} />
                  <Box sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(245,158,11,0.4)"
                  }}>
                    <Crown size={10} style={{ color: "#fff" }} />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ color: "#fef3c7", fontWeight: 800, mb: 1 }}>
                    Admin Dashboard
                  </Typography>
                  <Typography variant="h6" sx={{ color: "rgba(254,243,199,0.8)" }}>
                    Willkommen, {adminUser?.username || "Administrator"}
                  </Typography>
                </Box>
              </Box>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  startIcon={<LogOut size={20} />}
                  sx={{ 
                    background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: "0 8px 25px rgba(239,68,68,0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 30px rgba(239,68,68,0.4)"
                    }
                  }}
                >
                  Abmelden
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Typography variant="h4" sx={{ 
            color: "#fef3c7", 
            textAlign: "center", 
            fontWeight: 700, 
            mb: 6 
          }}>
            System Übersicht
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {statsData.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                >
                  <Card sx={{ 
                    borderRadius: 4,
                    background: "linear-gradient(135deg, rgba(254,243,199,0.1) 0%, rgba(254,243,199,0.05) 100%)",
                    border: "1px solid rgba(254,243,199,0.2)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
                    }
                  }}>
                    <CardContent sx={{ textAlign: "center", p: 4 }}>
                      <Box sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: "50%", 
                        background: stat.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        boxShadow: `0 8px 25px ${stat.color}40`
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h3" sx={{ color: "#fef3c7", fontWeight: 800, mb: 2 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="h6" sx={{ color: "rgba(254,243,199,0.8)", fontWeight: 500 }}>
                        {stat.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Paper elevation={8} sx={{ 
            p: 6, 
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(254,243,199,0.1) 0%, rgba(254,243,199,0.05) 100%)",
            border: "1px solid rgba(254,243,199,0.2)",
            backdropFilter: "blur(20px)",
            mb: 6
          }}>
            <Typography variant="h4" sx={{ color: "#fef3c7", fontWeight: 700, mb: 4, textAlign: "center" }}>
              Schnellzugriff
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -8 }}
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={action.icon}
                      sx={{ 
                        background: `linear-gradient(135deg, ${action.color}, ${action.color}80)`,
                        color: "#fff",
                        fontWeight: 600,
                        py: 3,
                        px: 4,
                        borderRadius: 3,
                        fontSize: "1rem",
                        boxShadow: `0 8px 25px ${action.color}30`,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${action.color}80, ${action.color})`,
                          transform: "translateY(-2px)",
                          boxShadow: `0 12px 30px ${action.color}40`
                        }
                      }}
                    >
                      {action.title}
                    </Button>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Paper elevation={8} sx={{ 
            p: 6, 
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(254,243,199,0.1) 0%, rgba(254,243,199,0.05) 100%)",
            border: "1px solid rgba(254,243,199,0.2)",
            backdropFilter: "blur(20px)"
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <Box sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981, #34d399)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 25px rgba(16,185,129,0.3)"
              }}>
                <Server size={24} style={{ color: "#fff" }} />
              </Box>
              <Typography variant="h4" sx={{ color: "#fef3c7", fontWeight: 700 }}>
                System Status
              </Typography>
            </Box>
            <Alert 
              severity="success" 
              sx={{ 
                borderRadius: 3,
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "#fef3c7",
                "& .MuiAlert-icon": {
                  color: "#10b981"
                }
              }}
            >
              <Typography variant="h6" sx={{ color: "#fef3c7", fontWeight: 600, mb: 1 }}>
                Alle Systeme funktionieren normal
              </Typography>
              <Typography sx={{ color: "rgba(254,243,199,0.8)" }}>
                Letzte Überprüfung: {new Date().toLocaleString('de-DE')}
              </Typography>
            </Alert>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
