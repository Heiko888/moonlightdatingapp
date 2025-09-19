"use client";
import React, { useState, useRef } from "react";
import { Box, Typography, Button, Paper, Alert, Card, Grid, TextField, LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import AppHeader from '../../../components/AppHeader';
import { Upload, Image, FileText, Trash2 } from "lucide-react";
import axios from 'axios';

export default function AdminUploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    setMessage("");
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMessage("Bitte wählen Sie mindestens eine Datei aus.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage("");

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post('http://localhost:4001/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      });

      if (response.data.success) {
        setMessage("Dateien erfolgreich hochgeladen!");
        setUploadedFiles(prev => [...prev, ...response.data.files]);
        setSelectedFiles([]);
        setUploadProgress(0);
      } else {
        setMessage("Fehler beim Hochladen: " + response.data.error);
      }
    } catch (error: any) {
      setMessage("Fehler beim Hochladen: " + (error.response?.data?.error || error.message));
    }

    setUploading(false);
  };

  const clearUploaded = () => {
    setUploadedFiles([]);
    setMessage("Hochgeladene Dateien gelöscht.");
  };

  return (
    <>
      <AppHeader current="/admin" />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg,#2a174d 0%,#3a2069 100%)', py: 8 }}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} 
          style={{ maxWidth: 1000, margin: '0 auto' }}
        >
          <Paper elevation={6} sx={{ 
            p: 4, 
            borderRadius: 4, 
            background: 'rgba(44,24,77,0.85)', 
            color: '#fff', 
            boxShadow:'0 8px 32px #7c3aed', 
            position:'relative'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                color: "#fff", 
                fontWeight: 700, 
                textShadow:'0 2px 8px #7c3aed' 
              }}>
                🖼️ Bild-Upload
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => window.history.back()}
                sx={{ 
                  color: '#b39ddb', 
                  borderColor: '#b39ddb',
                  '&:hover': { borderColor: '#7c3aed', color: '#7c3aed' }
                }}
              >
                Zurück zum Dashboard
              </Button>
            </Box>

            <Grid container spacing={4}>
              {/* Upload-Bereich */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  p: 3, 
                  background: 'rgba(179, 157, 219, 0.1)',
                  border: '2px dashed #b39ddb',
                  color: '#fff',
                  textAlign: 'center'
                }}>
                  <Upload size={48} style={{ color: '#b39ddb', marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: '#b39ddb', mb: 2 }}>
                    Dateien auswählen
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b39ddb', mb: 3 }}>
                    Wählen Sie Bilder, Logos oder andere Dateien aus
                  </Typography>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  
                  <Button 
                    variant="contained"
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ 
                      background: '#7c3aed', 
                      color: '#fff',
                      mb: 2,
                      '&:hover': { background: '#6d28d9' }
                    }}
                  >
                    Dateien auswählen
                  </Button>

                  {selectedFiles.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#b39ddb', mb: 2 }}>
                        Ausgewählte Dateien ({selectedFiles.length}):
                      </Typography>
                      {selectedFiles.map((file, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          p: 1, 
                          mb: 1, 
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: 1
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Image size={16} style={{ color: '#b39ddb', marginRight: 8 }} />
                            <Typography variant="body2" sx={{ color: '#fff' }}>
                              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            onClick={() => removeFile(index)}
                            sx={{ color: '#ef4444', minWidth: 'auto', p: 0.5 }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Box>
                      ))}
                      
                      <Button 
                        variant="contained"
                        fullWidth
                        onClick={handleUpload}
                        disabled={uploading}
                        sx={{ 
                          background: '#10b981', 
                          color: '#fff',
                          mt: 2,
                          '&:hover': { background: '#059669' },
                          '&:disabled': { background: '#6b7280' }
                        }}
                      >
                        {uploading ? "Hochladen..." : "Dateien hochladen"}
                      </Button>

                      {uploading && (
                        <Box sx={{ mt: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={uploadProgress} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#10b981'
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ color: '#b39ddb', mt: 1 }}>
                            {uploadProgress}% hochgeladen
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Card>
              </Grid>

              {/* Hochgeladene Dateien */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  p: 3, 
                  background: 'rgba(179, 157, 219, 0.1)',
                  border: '1px solid #b39ddb',
                  color: '#fff'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#b39ddb' }}>
                      📁 Hochgeladene Dateien
                    </Typography>
                    {uploadedFiles.length > 0 && (
                      <Button
                        size="small"
                        onClick={clearUploaded}
                        sx={{ color: '#ef4444' }}
                      >
                        Alle löschen
                      </Button>
                    )}
                  </Box>

                  {uploadedFiles.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#b39ddb', textAlign: 'center', py: 4 }}>
                      Noch keine Dateien hochgeladen
                    </Typography>
                  ) : (
                    <Box>
                      {uploadedFiles.map((file, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          p: 2, 
                          mb: 1, 
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: 1
                        }}>
                          <FileText size={16} style={{ color: '#10b981', marginRight: 8 }} />
                          <Typography variant="body2" sx={{ color: '#fff', flex: 1 }}>
                            {file}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#10b981' }}>
                            ✓ Hochgeladen
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>

            {message && (
              <Alert 
                severity={message.includes("erfolgreich") ? "success" : "error"} 
                sx={{ mt: 4, borderRadius: 2 }}
              >
                {message}
              </Alert>
            )}

            {/* Hilfetext */}
            <Card sx={{ 
              mt: 4, 
              p: 3, 
              background: 'rgba(179, 157, 219, 0.05)',
              border: '1px solid #b39ddb'
            }}>
              <Typography variant="h6" sx={{ color: '#b39ddb', mb: 2 }}>
                💡 Hinweise zum Upload:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#b39ddb', mb: 1 }}>
                    • Unterstützte Formate: JPG, PNG, GIF, PDF, DOC, DOCX
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b39ddb', mb: 1 }}>
                    • Maximale Dateigröße: 10 MB pro Datei
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#b39ddb', mb: 1 }}>
                    • Bilder werden automatisch optimiert
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b39ddb' }}>
                    • Dateien werden sicher auf dem Server gespeichert
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Paper>
        </motion.div>
      </Box>
    </>
  );
}
