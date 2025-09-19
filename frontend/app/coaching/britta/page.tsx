"use client";
import React from "react";
import { Box, Card, CardContent, Typography, Avatar, Button, Chip, Rating, IconButton, TextField, MenuItem, Alert, CircularProgress } from "@mui/material";
// import AppHeader from "../../../components/AppHeader";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Heart, Sparkles, ArrowLeft, BookOpen, MessageSquare, User, Mail, Phone, Calendar, Clock, Send } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";

// Animierte Sterne Komponente
const AnimatedStars = () => {
  const starPositions = [
    { left: '10%', top: '15%' }, { left: '85%', top: '25%' }, { left: '45%', top: '35%' },
    { left: '75%', top: '45%' }, { left: '20%', top: '55%' }, { left: '90%', top: '65%' },
    { left: '30%', top: '75%' }, { left: '60%', top: '85%' }, { left: '15%', top: '95%' },
    { left: '80%', top: '5%' }, { left: '50%', top: '15%' }, { left: '25%', top: '25%' },
    { left: '70%', top: '35%' }, { left: '40%', top: '45%' }, { left: '95%', top: '55%' }
  ];

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {starPositions.map((pos, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: '#FFD700',
            borderRadius: '50%',
            boxShadow: '0 0 8px #FFD700, 0 0 16px #FFD700, 0 0 24px #FFD700',
            left: pos.left,
            top: pos.top,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.6, 1.4, 0.6],
          }}
          transition={{
            duration: 2.5 + (i * 0.2),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </Box>
  );
};

// Leuchtender Mond Komponente
const AnimatedMoon = () => (
  <Box sx={{ position: 'absolute', top: 50, right: 50, pointerEvents: 'none', zIndex: 1 }}>
    <motion.div
      style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #fff 0%, #f0f8ff 30%, #e6f3ff 60%, #cce7ff 100%)',
        boxShadow: `
          0 0 20px rgba(255, 255, 255, 0.8),
          0 0 40px rgba(255, 255, 255, 0.6),
          0 0 60px rgba(255, 255, 255, 0.4),
          0 0 80px rgba(255, 255, 255, 0.2),
          inset 0 0 20px rgba(255, 255, 255, 0.3)
        `,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
        rotate: [0, 5, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Mond-Krater */}
      <Box sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: `
          radial-gradient(ellipse 20px 15px at 30% 25%, rgba(200, 220, 255, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 15px 10px at 70% 60%, rgba(200, 220, 255, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse 12px 8px at 20% 70%, rgba(200, 220, 255, 0.25) 0%, transparent 50%),
          radial-gradient(ellipse 18px 12px at 80% 30%, rgba(200, 220, 255, 0.15) 0%, transparent 50%)
        `
      }} />
      
      {/* Mond-Glanz */}
      <motion.div
        style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 70%, transparent 100%)',
          top: '15%',
          left: '15%'
        }}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
    
    {/* Mond-Aura */}
    <motion.div
      style={{
        position: 'absolute',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        top: '-20px',
        left: '-20px',
        zIndex: -1
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </Box>
);

export default function BrittaProfilePage() {
  // Dummy-ID für Britta, in echter App dynamisch
  const coachId = "britta-id";
  // Demo: User aus Session (später aus Auth holen)
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Demo: User aus localStorage holen
    setUserId(localStorage.getItem("userId"));
  }, []);
  
  type Review = {
    _id: string;
    userId: string;
    rating: number;
    comment: string;
    date?: string;
    coachReply?: string;
  };
  
  const [replyText, setReplyText] = useState("");
  const [replyId, setReplyId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [sort, setSort] = useState<'date'|'rating'>('date');
  const [filterText, setFilterText] = useState("");
  
  // Buchungsformular State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    sessionType: "", 
    date: "", 
    time: "", 
    message: "" 
  });
  
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const sessionTypes = [
    "Gesundheit",
    "Wohlbefinden", 
    "Energiearbeit",
    "Lebensstil"
  ];

  const timeSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingSuccess(null);
    setBookingError(null);
    
    try {
      const res = await fetch("http://localhost:4001/sessionrequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookingForm, coach: "Britta Schuhmann" })
      });
      const data = await res.json();
      
      if (data.success) {
        setBookingSuccess("Session-Anfrage erfolgreich versendet! Britta meldet sich bald bei dir. ✨");
        setBookingForm({ name: "", email: "", phone: "", sessionType: "", date: "", time: "", message: "" });
        setShowBookingForm(false);
      } else {
        setBookingError(data.error || "Fehler beim Senden der Anfrage. Bitte versuche es erneut.");
      }
    } catch {
      setBookingError("Verbindungsfehler. Bitte überprüfe deine Internetverbindung.");
    }
    setBookingLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    fetch(`/api/coaching?id=${coachId}`)
      .then(res => res.json())
      .then(data => setReviews(data[0]?.reviews || []));
  };

  const handleReplySubmit = async () => {
    if (!replyId) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/coaching/review/reply", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coachId, reviewId: replyId, coachReply: replyText })
    });
    const data = await res.json();
    if (!data.error) {
      fetchReviews();
      setReplyText("");
      setReplyId(null);
    } else {
      setError(data.error);
    }
    setLoading(false);
  };

  // Durchschnittliche Bewertung berechnen
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  // Sortierte und gefilterte Reviews
  const sortedReviews = [...reviews]
    .filter(r => r.comment.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => sort === 'date'
      ? (new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
      : (b.rating - a.rating)
    );

  const handleReviewSubmit = async () => {
    if (!userId) {
      setError("Du musst eingeloggt sein, um zu bewerten.");
      return;
    }
    setLoading(true);
    setError("");
    let res, data;
    if (editId) {
      // Bearbeiten
      res = await fetch("/api/coaching/review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachId, reviewId: editId, rating, comment, userId })
      });
      data = await res.json();
    } else {
      // Neu
      res = await fetch("/api/coaching/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachId, userId, rating, comment })
      });
      data = await res.json();
    }
    if (!data.error) {
      fetchReviews();
      setRating(0);
      setComment("");
      setEditId(null);
    } else {
      setError(data.error);
    }
    setLoading(false);
  };

  const handleEdit = (review: Review) => {
    setEditId(review._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleDelete = async (reviewId: string) => {
    if (!userId) {
      setError("Du musst eingeloggt sein, um zu löschen.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/coaching/review", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coachId, reviewId, userId })
    });
    const data = await res.json();
    if (!data.error) {
      fetchReviews();
    } else {
      setError(data.error);
    }
    setLoading(false);
  };

  return (
    <>
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)',
        py: 6,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <AnimatedStars />
        <AnimatedMoon />
        
        <Box sx={{ maxWidth: 800, mx: 'auto', px: 3, position: 'relative', zIndex: 1 }}>
          {/* Zurück-Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              component={Link}
              href="/coaching"
              variant="outlined"
              startIcon={<ArrowLeft size={20} />}
              sx={{ 
                color: '#fff', 
                borderColor: 'rgba(255,255,255,0.3)', 
                fontWeight: 600, 
                borderRadius: 3,
                px: 3,
                py: 1.5,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                mb: 4,
                '&:hover': {
                  borderColor: '#FFD700',
                  background: 'rgba(255,215,0,0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Zurück zur Coaching-Übersicht
            </Button>
          </motion.div>

          {/* Hauptkarte */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              overflow: 'hidden',
              mb: 4
            }}>
              {/* Header mit Avatar */}
              <Box sx={{ 
                background: 'radial-gradient(circle, #fff 0%, #f0f8ff 30%, #e6f3ff 60%, #cce7ff 100%)',
                p: 4,
                textAlign: 'center',
                position: 'relative',
                boxShadow: `
                  0 0 20px rgba(255, 255, 255, 0.8),
                  0 0 40px rgba(255, 255, 255, 0.6),
                  0 0 60px rgba(255, 255, 255, 0.4),
                  0 0 80px rgba(255, 255, 255, 0.2),
                  inset 0 0 20px rgba(255, 255, 255, 0.3)
                `
              }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Avatar 
                    src="/images/britta.jpg" 
                    sx={{ 
                      width: 140, 
                      height: 140, 
                      mx: 'auto', 
                      mb: 3, 
                      boxShadow: '0 8px 32px rgba(255,215,0,0.4)', 
                      border: '4px solid #fff',
                      position: 'relative'
                    }} 
                  />
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Sparkles size={24} style={{ color: '#667eea' }} />
                  </Box>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Typography variant="h4" sx={{ 
                    color: '#4b2e83', 
                    fontWeight: 800, 
                    mb: 1,
                    textShadow: '0 2px 4px rgba(255,255,255,0.8)'
                  }}>
                    Britta Schuhmann
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#667eea', 
                    fontWeight: 500,
                    mb: 2
                  }}>
                    Human Design Coach & Reiki-Meisterin
                  </Typography>
                  
                  {/* Tags */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<Star size={16} />} 
                      label="Generator" 
                      sx={{ 
                        background: 'rgba(102, 126, 234, 0.2)', 
                        color: '#667eea', 
                        fontWeight: 600,
                        border: '1px solid rgba(102, 126, 234, 0.3)'
                      }} 
                    />
                    <Chip 
                      icon={<MapPin size={16} />} 
                      label="Köln" 
                      sx={{ 
                        background: 'rgba(75, 46, 131, 0.2)', 
                        color: '#4b2e83', 
                        fontWeight: 600,
                        border: '1px solid rgba(75, 46, 131, 0.3)'
                      }} 
                    />
                    <Chip 
                      icon={<Heart size={16} />} 
                      label="Gesundheit" 
                      sx={{ 
                        background: 'rgba(75, 46, 131, 0.2)', 
                        color: '#4b2e83', 
                        fontWeight: 600,
                        border: '1px solid rgba(75, 46, 131, 0.3)'
                      }} 
                    />
                  </Box>
                </motion.div>
              </Box>

              {/* Content */}
              <CardContent sx={{ p: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Typography variant="h6" sx={{ 
                    color: '#4b2e83', 
                    fontWeight: 700, 
                    mb: 3,
                    textAlign: 'center'
                  }}>
                    Meine Geschichte
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    color: '#4a5568', 
                    mb: 3, 
                    fontWeight: 500,
                    lineHeight: 1.8,
                    fontSize: '1.1rem'
                  }}>
                    Als Human Design Coach und Reiki-Meisterin helfe ich Menschen dabei, 
                    ihre energetische Balance zu finden und Klarheit in ihrem Leben zu schaffen. 
                    Meine Arbeit verbindet Human Design mit energetischen Heilmethoden.
                  </Typography>

                  <Typography variant="body1" sx={{ 
                    color: '#4a5568', 
                    mb: 4, 
                    fontWeight: 500,
                    lineHeight: 1.8,
                    fontSize: '1.1rem'
                  }}>
                    Ich spezialisiere mich auf Reiki-Behandlungen, Kommunikationstraining 
                    und detaillierte Human Design Readings für deine Balance und Klarheit.
                  </Typography>

                  {/* Spezialisierungen */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#4b2e83', 
                      fontWeight: 700, 
                      mb: 2
                    }}>
                      Meine Spezialisierungen
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {['Reiki', 'Kommunikation', 'Human Design Readings', 'Gesundheit', 'Energetische Balance'].map((spec) => (
                        <Chip 
                          key={spec}
                          label={spec} 
                          sx={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff', 
                            fontWeight: 600,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            },
                            transition: 'all 0.3s ease'
                          }} 
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* CTA Buttons */}
                  <Box sx={{ textAlign: 'center', display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button 
                      component={Link}
                      href="/coaching/britta/reiki"
                      variant="contained" 
                      size="large"
                      sx={{ 
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: '#23233a', 
                        fontWeight: 700, 
                        borderRadius: 3,
                        px: 6,
                        py: 2,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Reiki-Sessions
                    </Button>
                    
                    <Button 
                      variant="contained" 
                      size="large"
                      onClick={() => setShowBookingForm(true)}
                      sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff', 
                        fontWeight: 700, 
                        borderRadius: 3,
                        px: 6,
                        py: 2,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Allgemeine Session buchen
                    </Button>
                  </Box>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Review-Liste */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              overflow: 'hidden',
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ color: '#4b2e83', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                  Bewertungen
                </Typography>
                
                {avgRating && (
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <Rating value={parseFloat(avgRating)} precision={0.1} readOnly />
                    <Typography sx={{ fontWeight: 700, color: '#4b2e83' }}>{avgRating} / 5</Typography>
                    <Typography variant="caption" sx={{ color: '#4a5568' }}>({reviews.length} Bewertungen)</Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Button 
                    variant={sort === 'date' ? 'contained' : 'outlined'} 
                    onClick={() => setSort('date')} 
                    sx={{ 
                      fontWeight: 700,
                      background: sort === 'date' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      color: sort === 'date' ? '#fff' : '#4b2e83',
                      borderColor: '#4b2e83'
                    }}
                  >
                    Neueste
                  </Button>
                  <Button 
                    variant={sort === 'rating' ? 'contained' : 'outlined'} 
                    onClick={() => setSort('rating')} 
                    sx={{ 
                      fontWeight: 700,
                      background: sort === 'rating' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      color: sort === 'rating' ? '#fff' : '#4b2e83',
                      borderColor: '#4b2e83'
                    }}
                  >
                    Beste
                  </Button>
                  <TextField
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Suche Kommentar..."
                    size="small"
                    sx={{ 
                      flex: 1, 
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        borderColor: '#4b2e83'
                      }
                    }}
                  />
                </Box>
                
                {sortedReviews.length === 0 && (
                  <Typography sx={{ textAlign: 'center', color: '#4a5568' }}>
                    Keine Bewertungen gefunden.
                  </Typography>
                )}
                
                {sortedReviews.map((r, idx) => (
                  <Box key={r._id || idx} sx={{ 
                    mb: 3, 
                    p: 3, 
                    borderRadius: 3, 
                    background: 'rgba(102, 126, 234, 0.05)', 
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)', 
                    position: 'relative',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}>
                    <Rating value={r.rating} readOnly sx={{ mb: 1 }} />
                    <Typography sx={{ fontWeight: 500, color: '#4a5568', mb: 1 }}>
                      {r.comment}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#667eea' }}>
                      {r.date ? new Date(r.date).toLocaleDateString() : ""}
                    </Typography>
                    
                    {/* Coach-Antwort anzeigen */}
                    {r.coachReply && (
                      <Box sx={{ mt: 2, p: 2, background: 'rgba(255, 215, 0, 0.1)', borderRadius: 2, border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#4b2e83', fontWeight: 700, mb: 1 }}>
                          Antwort vom Coach:
                        </Typography>
                        <Typography sx={{ color: '#4a5568' }}>{r.coachReply}</Typography>
                      </Box>
                    )}
                    
                    {/* Coach kann antworten */}
                    {true && !r.coachReply && (
                      <Box sx={{ mt: 2 }}>
                        {replyId === r._id ? (
                          <>
                            <TextField
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              multiline
                              rows={2}
                              placeholder="Antwort schreiben..."
                              fullWidth
                              sx={{ mb: 2 }}
                            />
                            <Button 
                              variant="contained" 
                              onClick={handleReplySubmit} 
                              disabled={loading || !replyText} 
                              sx={{ 
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                color: '#23233a', 
                                fontWeight: 700, 
                                borderRadius: 2, 
                                px: 3, 
                                py: 1, 
                                mr: 2 
                              }}
                            >
                              Senden
                            </Button>
                            <Button 
                              variant="outlined" 
                              onClick={() => { setReplyId(null); setReplyText(""); }} 
                              sx={{ 
                                color: '#4b2e83', 
                                borderColor: '#4b2e83', 
                                fontWeight: 700, 
                                borderRadius: 2, 
                                px: 2, 
                                py: 1 
                              }}
                            >
                              Abbrechen
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="text" 
                            onClick={() => setReplyId(r._id)} 
                            sx={{ color: '#4b2e83', fontWeight: 700 }}
                            startIcon={<MessageSquare size={16} />}
                          >
                            Antworten
                          </Button>
                        )}
                      </Box>
                    )}
                    
                    {r.userId === "demo-user" && (
                      <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleEdit(r)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(r._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Review-Formular */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              borderRadius: 8, 
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ color: '#4b2e83', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                  {editId ? "Bewertung bearbeiten" : "Bewertung abgeben"}
                </Typography>
                
                {!userId && (
                  <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                    Du musst eingeloggt sein, um eine Bewertung abzugeben.
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Rating value={rating} onChange={(_, v) => setRating(v || 0)} />
                </Box>
                
                <TextField
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Dein Kommentar..."
                  fullWidth
                  sx={{ mb: 3 }}
                />
                
                {error && (
                  <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                    {error}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    onClick={handleReviewSubmit} 
                    disabled={loading || rating === 0 || !userId} 
                    sx={{ 
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: '#23233a', 
                      fontWeight: 700, 
                      borderRadius: 3,
                      px: 4, 
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? "Wird gesendet..." : editId ? "Speichern" : "Bewertung absenden"}
                  </Button>
                  
                  {editId && (
                    <Button 
                      variant="outlined" 
                      onClick={() => { setEditId(null); setRating(0); setComment(""); }} 
                      sx={{ 
                        color: '#4b2e83', 
                        borderColor: '#4b2e83', 
                        fontWeight: 700, 
                        borderRadius: 3,
                        px: 3, 
                        py: 1.5
                      }}
                    >
                      Abbrechen
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Buchungsformular Modal */}
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: 600, width: '100%' }}
            >
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.98)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 4, 
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                maxHeight: '90vh',
                overflow: 'auto'
              }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ 
                      color: '#4b2e83', 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <BookOpen size={28} style={{ color: '#667eea' }} />
                      Session buchen
                    </Typography>
                    <Button
                      onClick={() => setShowBookingForm(false)}
                      sx={{ 
                        color: '#667eea',
                        minWidth: 'auto',
                        p: 1,
                        '&:hover': { background: 'rgba(102, 126, 234, 0.1)' }
                      }}
                    >
                      ✕
                    </Button>
                  </Box>

                  {/* Erfolgs- und Fehlermeldungen */}
                  {bookingSuccess && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                      {bookingSuccess}
                    </Alert>
                  )}
                  
                  {bookingError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {bookingError}
                    </Alert>
                  )}

                  {/* Formular */}
                  <Box component="form" onSubmit={handleBookingSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <User size={20} style={{ color: '#667eea' }} />
                      <TextField 
                        label="Name" 
                        name="name" 
                        value={bookingForm.name} 
                        onChange={handleBookingChange} 
                        required 
                        fullWidth 
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            },
                            '&.Mui-focused': {
                              borderColor: '#667eea'
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Email */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Mail size={20} style={{ color: '#667eea' }} />
                      <TextField 
                        label="E-Mail" 
                        name="email" 
                        value={bookingForm.email} 
                        onChange={handleBookingChange} 
                        required 
                        fullWidth 
                        type="email"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Telefon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Phone size={20} style={{ color: '#667eea' }} />
                      <TextField 
                        label="Telefon" 
                        name="phone" 
                        value={bookingForm.phone} 
                        onChange={handleBookingChange} 
                        required 
                        fullWidth 
                        type="tel"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Session-Typ */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <BookOpen size={20} style={{ color: '#667eea' }} />
                      <TextField
                        select
                        name="sessionType"
                        value={bookingForm.sessionType}
                        onChange={handleBookingChange}
                        required
                        fullWidth
                        label="Session-Typ"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            fontWeight: 500
                          }
                        }}
                      >
                        {sessionTypes.map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    
                    {/* Datum und Uhrzeit in einer Reihe */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Calendar size={20} style={{ color: '#667eea' }} />
                        <TextField 
                          label="Datum" 
                          name="date" 
                          value={bookingForm.date} 
                          onChange={handleBookingChange} 
                          required 
                          fullWidth 
                          type="date"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.9)',
                              '&:hover': {
                                background: 'rgba(255,255,255,1)',
                              }
                            },
                            '& .MuiInputBase-input': {
                              color: '#4b2e83',
                            },
                            '& .MuiInputLabel-root': {
                              color: '#667eea',
                              fontWeight: 500
                            }
                          }} 
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Clock size={20} style={{ color: '#667eea' }} />
                        <TextField
                          select
                          name="time"
                          value={bookingForm.time}
                          onChange={handleBookingChange}
                          required
                          fullWidth
                          label="Uhrzeit"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.9)',
                              '&:hover': {
                                background: 'rgba(255,255,255,1)',
                              }
                            },
                            '& .MuiInputBase-input': {
                              color: '#4b2e83',
                            },
                            '& .MuiInputLabel-root': {
                              color: '#667eea',
                              fontWeight: 500
                            }
                          }}
                        >
                          {timeSlots.map(time => (
                            <MenuItem key={time} value={time}>{time}</MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    </Box>
                    
                    {/* Nachricht */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <MessageSquare size={20} style={{ color: '#667eea', marginTop: '8px' }} />
                      <TextField 
                        label="Nachricht (optional)" 
                        name="message" 
                        value={bookingForm.message} 
                        onChange={handleBookingChange} 
                        fullWidth 
                        multiline 
                        minRows={3}
                        placeholder="Erzähle mir von deinem Anliegen oder deinen Fragen..."
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        mt: 2, 
                        borderRadius: 2, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        color: '#fff', 
                        fontWeight: 700, 
                        fontSize: 16, 
                        py: 1.5,
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                          boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                        },
                        '&:disabled': { 
                          opacity: 0.7,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        } 
                      }}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={20} sx={{ color: '#fff' }} />
                          Wird gesendet...
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Send size={18} />
                          Anfrage absenden
                        </Box>
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </Box>
    </>
  );
}
