"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, List, ListItem, ListItemIcon, ListItemText, Divider, LinearProgress, Avatar, Badge } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Heart, Target, BookOpen, Users, Calendar, Award, Crown, Medal, Gem, Flame, Eye, Moon, RefreshCw, Share2, Bookmark, TrendingUp, CheckCircle } from 'lucide-react';
import { useNotifications } from './NotificationService';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'energy' | 'relationships' | 'learning' | 'community' | 'achievement' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  color: string;
  requirements: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: string;
  color: string;
}

interface UserStats {
  totalPoints: number;
  level: number;
  experience: number;
  experienceToNext: number;
  badgesUnlocked: number;
  totalBadges: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  streak: number;
  lastActive: Date;
  rank: string;
  nextRank: string;
  pointsToNextRank: number;
}

const badges: Badge[] = [
  {
    id: '1',
    name: 'Energie-Entdecker',
    description: 'Erste sakrale Antwort erkannt',
    icon: '⚡',
    category: 'energy',
    rarity: 'common',
    points: 50,
    unlocked: true,
    unlockedAt: new Date('2024-01-15'),
    progress: 1,
    maxProgress: 1,
    color: '#10B981',
    requirements: ['Erste sakrale Antwort erkennen']
  },
  {
    id: '2',
    name: 'Dating-Meister',
    description: '10 erfolgreiche Dates gehabt',
    icon: '💖',
    category: 'relationships',
    rarity: 'rare',
    points: 200,
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    color: '#EF4444',
    requirements: ['10 Dates absolvieren']
  },
  {
    id: '3',
    name: 'Wissens-Sammler',
    description: '50 Human Design Artikel gelesen',
    icon: '📚',
    category: 'learning',
    rarity: 'epic',
    points: 500,
    unlocked: false,
    progress: 32,
    maxProgress: 50,
    color: '#8B5CF6',
    requirements: ['50 Artikel lesen']
  },
  {
    id: '4',
    name: 'Community-Helfer',
    description: '100 Community-Beiträge gemacht',
    icon: '👥',
    category: 'community',
    rarity: 'legendary',
    points: 1000,
    unlocked: false,
    progress: 23,
    maxProgress: 100,
    color: '#F59E0B',
    requirements: ['100 Beiträge in der Community']
  },
  {
    id: '5',
    name: 'Mondkalender-Experte',
    description: '30 Tage Mondkalender geführt',
    icon: '🌙',
    category: 'achievement',
    rarity: 'rare',
    points: 300,
    unlocked: true,
    unlockedAt: new Date('2024-01-20'),
    progress: 30,
    maxProgress: 30,
    color: '#06B6D4',
    requirements: ['30 Tage Mondkalender führen']
  },
  {
    id: '6',
    name: 'Chart-Experte',
    description: '20 Human Design Charts erstellt',
    icon: '📊',
    category: 'learning',
    rarity: 'epic',
    points: 400,
    unlocked: false,
    progress: 12,
    maxProgress: 20,
    color: '#8B5CF6',
    requirements: ['20 Charts erstellen']
  }
];

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Erste Schritte',
    description: 'Dein erstes Human Design Chart erstellt',
    icon: '🎯',
    points: 100,
    unlocked: true,
    unlockedAt: new Date('2024-01-10'),
    category: 'learning',
    color: '#10B981'
  },
  {
    id: '2',
    title: 'Dating-Start',
    description: 'Dein erstes Date über die App geplant',
    icon: '💕',
    points: 150,
    unlocked: true,
    unlockedAt: new Date('2024-01-12'),
    category: 'relationships',
    color: '#EF4444'
  },
  {
    id: '3',
    title: 'Community-Mitglied',
    description: 'Ersten Beitrag in der Community gepostet',
    icon: '👥',
    points: 75,
    unlocked: true,
    unlockedAt: new Date('2024-01-14'),
    category: 'community',
    color: '#F59E0B'
  },
  {
    id: '4',
    title: 'Wissensdurst',
    description: '10 Artikel gelesen',
    icon: '📖',
    points: 200,
    unlocked: false,
    category: 'learning',
    color: '#8B5CF6'
  },
  {
    id: '5',
    title: 'Energie-Meister',
    description: 'Alle Energie-Badges freigeschaltet',
    icon: '⚡',
    points: 500,
    unlocked: false,
    category: 'energy',
    color: '#10B981'
  }
];

const getRarityColor = (rarity: Badge['rarity']) => {
  switch (rarity) {
    case 'common':
      return '#6b7280';
    case 'rare':
      return '#3b82f6';
    case 'epic':
      return '#8b5cf6';
    case 'legendary':
      return '#f59e0b';
    default:
      return '#6b7280';
  }
};

const getRarityIcon = (rarity: Badge['rarity']) => {
  switch (rarity) {
    case 'common':
      return <Star size={16} />;
    case 'rare':
      return <Gem size={16} />;
    case 'epic':
      return <Crown size={16} />;
    case 'legendary':
      return <Trophy size={16} />;
    default:
      return <Star size={16} />;
  }
};

const getCategoryIcon = (category: Badge['category']) => {
  switch (category) {
    case 'energy':
      return <Zap size={16} />;
    case 'relationships':
      return <Heart size={16} />;
    case 'learning':
      return <BookOpen size={16} />;
    case 'community':
      return <Users size={16} />;
    case 'achievement':
      return <Award size={16} />;
    case 'special':
      return <Crown size={16} />;
    default:
      return <Star size={16} />;
  }
};

const getRankInfo = (level: number) => {
  if (level < 10) return { rank: 'Anfänger', nextRank: 'Entdecker', color: '#6b7280' };
  if (level < 25) return { rank: 'Entdecker', nextRank: 'Experte', color: '#3b82f6' };
  if (level < 50) return { rank: 'Experte', nextRank: 'Meister', color: '#8b5cf6' };
  if (level < 100) return { rank: 'Meister', nextRank: 'Legende', color: '#f59e0b' };
  return { rank: 'Legende', nextRank: 'Legende', color: '#ffd700' };
};

export default function GamificationSystem() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 1250,
    level: 15,
    experience: 750,
    experienceToNext: 250,
    badgesUnlocked: 2,
    totalBadges: badges.length,
    achievementsUnlocked: 3,
    totalAchievements: achievements.length,
    streak: 7,
    lastActive: new Date(),
    rank: 'Entdecker',
    nextRank: 'Experte',
    pointsToNextRank: 500
  });
  
  const [showBadges, setShowBadges] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [savedStats, setSavedStats] = useState<string[]>([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load saved stats
    const saved = localStorage.getItem('saved-gamification-stats');
    if (saved) {
      setSavedStats(JSON.parse(saved));
    }
  }, []);

  const handleBadgeSelect = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  const handleSave = () => {
    const newSaved = [...savedStats, 'gamification-stats'];
    setSavedStats(newSaved);
    localStorage.setItem('saved-gamification-stats', JSON.stringify(newSaved));
    
    addNotification({
      type: 'success',
      title: '💾 Gespeichert',
      message: 'Deine Gamification-Statistiken wurden gespeichert!',
    });
  };

  const handleShare = () => {
    const rankInfo = getRankInfo(userStats.level);
    const shareText = `🏆 Meine Human Design Gamification-Statistiken:\n\n⭐ Level: ${userStats.level} (${rankInfo.rank})\n💎 Punkte: ${userStats.totalPoints}\n🎖️ Badges: ${userStats.badgesUnlocked}/${userStats.totalBadges}\n🏅 Achievements: ${userStats.achievementsUnlocked}/${userStats.totalAchievements}\n🔥 Streak: ${userStats.streak} Tage\n\n#HumanDesign #Gamification #HDApp`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Meine Human Design Gamification-Statistiken',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      addNotification({
        type: 'success',
        title: '📋 Kopiert',
        message: 'Deine Statistiken wurden in die Zwischenablage kopiert!',
      });
    }
  };

  const rankInfo = getRankInfo(userStats.level);
  const levelProgress = (userStats.experience / (userStats.experience + userStats.experienceToNext)) * 100;

  return (
    <Box>
      {/* User Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            background: 'linear-gradient(135deg, #8B5CF6 20%, #A78BFA 10%)',
            border: '2px solid #8B5CF6 40',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            mb: 4,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px #8B5CF6 30',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h2" sx={{ fontSize: '3rem' }}>
                  🏆
                </Typography>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Level {userStats.level} - {rankInfo.rank}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {userStats.totalPoints} Punkte • {userStats.streak} Tage Streak
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handleSave}
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  <Bookmark size={16} />
                </IconButton>
                <IconButton
                  onClick={handleShare}
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  <Share2 size={16} />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Chip
                icon={<Star size={16} />}
                label={`${userStats.totalPoints} Punkte`}
                sx={{
                  backgroundColor: 'primary.20',
                  color: 'primary.main',
                  border: '1px solid primary.40',
                }}
              />
              <Chip
                icon={<Trophy size={16} />}
                label={`${userStats.badgesUnlocked}/${userStats.totalBadges} Badges`}
                sx={{
                  backgroundColor: 'secondary.20',
                  color: 'secondary.main',
                  border: '1px solid secondary.40',
                }}
              />
              <Chip
                icon={<Award size={16} />}
                label={`${userStats.achievementsUnlocked}/${userStats.totalAchievements} Achievements`}
                sx={{
                  backgroundColor: 'success.20',
                  color: 'success.main',
                  border: '1px solid success.40',
                }}
              />
              <Chip
                icon={<Flame size={16} />}
                label={`${userStats.streak} Tage Streak`}
                sx={{
                  backgroundColor: 'warning.20',
                  color: 'warning.main',
                  border: '1px solid warning.40',
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Level-Fortschritt
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {userStats.experience}/{userStats.experience + userStats.experienceToNext} XP
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={levelProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: rankInfo.color,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              🎯 Nächster Rang: {rankInfo.nextRank} ({userStats.pointsToNextRank} Punkte)
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges and Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={3}>
          {/* Badges */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              p: 3
            }}>
              <Typography variant="h5" sx={{ color: 'text.primary', mb: 3, fontWeight: 600 }}>
                🎖️ Badges
              </Typography>
              
              <Grid container spacing={2}>
                {badges.map((badge, index) => (
                  <Grid item xs={12} sm={6} key={badge.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          background: badge.unlocked 
                            ? `linear-gradient(135deg, ${badge.color}20, ${badge.color}10)`
                            : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${badge.unlocked ? badge.color + '40' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          opacity: badge.unlocked ? 1 : 0.6,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${badge.color}20`,
                          },
                        }}
                        onClick={() => handleBadgeSelect(badge)}
                      >
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <Box sx={{ position: 'relative', mb: 1 }}>
                            <Typography variant="h4" sx={{ opacity: badge.unlocked ? 1 : 0.5 }}>
                              {badge.icon}
                            </Typography>
                            {badge.unlocked && (
                              <CheckCircle 
                                size={16} 
                                color="#22c55e" 
                                style={{ 
                                  position: 'absolute', 
                                  top: -5, 
                                  right: -5,
                                  backgroundColor: 'white',
                                  borderRadius: '50%'
                                }} 
                              />
                            )}
                          </Box>
                          
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            mb: 0.5,
                            opacity: badge.unlocked ? 1 : 0.7
                          }}>
                            {badge.name}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                            {getRarityIcon(badge.rarity)}
                            <Typography variant="caption" sx={{ 
                              color: getRarityColor(badge.rarity),
                              fontWeight: 600
                            }}>
                              {badge.rarity}
                            </Typography>
                          </Box>
                          
                          {!badge.unlocked && (
                            <Box sx={{ mb: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(badge.progress / badge.maxProgress) * 100}
                                sx={{
                                  height: 4,
                                  borderRadius: 2,
                                  backgroundColor: 'rgba(255,255,255,0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: badge.color,
                                    borderRadius: 2,
                                  },
                                }}
                              />
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {badge.progress}/{badge.maxProgress}
                              </Typography>
                            </Box>
                          )}
                          
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {badge.points} Punkte
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          {/* Achievements */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              p: 3
            }}>
              <Typography variant="h5" sx={{ color: 'text.primary', mb: 3, fontWeight: 600 }}>
                🏅 Achievements
              </Typography>
              
              <List>
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ListItem
                      sx={{
                        background: achievement.unlocked 
                          ? `linear-gradient(135deg, ${achievement.color}15, ${achievement.color}05)`
                          : 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        mb: 1,
                        border: `1px solid ${achievement.unlocked ? achievement.color + '30' : 'rgba(255,255,255,0.1)'}`,
                        opacity: achievement.unlocked ? 1 : 0.6,
                      }}
                    >
                      <ListItemIcon>
                        <Box sx={{ position: 'relative' }}>
                          <Typography variant="h5" sx={{ opacity: achievement.unlocked ? 1 : 0.5 }}>
                            {achievement.icon}
                          </Typography>
                          {achievement.unlocked && (
                            <CheckCircle 
                              size={12} 
                              color="#22c55e" 
                              style={{ 
                                position: 'absolute', 
                                top: -3, 
                                right: -3,
                                backgroundColor: 'white',
                                borderRadius: '50%'
                              }} 
                            />
                          )}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            opacity: achievement.unlocked ? 1 : 0.7
                          }}>
                            {achievement.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {achievement.description}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: achievement.color,
                              fontWeight: 600,
                              display: 'block'
                            }}>
                              {achievement.points} Punkte
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Badge Details Dialog */}
      <Dialog
        open={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {selectedBadge?.icon} {selectedBadge?.name}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
            {getRarityIcon(selectedBadge?.rarity || 'common')}
            <Typography variant="body2" sx={{ 
              color: getRarityColor(selectedBadge?.rarity || 'common'),
              fontWeight: 600,
              textTransform: 'capitalize'
            }}>
              {selectedBadge?.rarity}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              • {selectedBadge?.points} Punkte
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, textAlign: 'center' }}>
            {selectedBadge?.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              📋 Anforderungen:
            </Typography>
            <List dense>
              {selectedBadge?.requirements.map((req, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Target size={16} color="#8B5CF6" />
                  </ListItemIcon>
                  <ListItemText primary={req} />
                </ListItem>
              ))}
            </List>
          </Box>

          {!selectedBadge?.unlocked && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
                📊 Fortschritt:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {selectedBadge?.progress}/{selectedBadge?.maxProgress}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {Math.round((selectedBadge?.progress || 0) / (selectedBadge?.maxProgress || 1) * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(selectedBadge?.progress || 0) / (selectedBadge?.maxProgress || 1) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: selectedBadge?.color,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          )}

          {selectedBadge?.unlocked && selectedBadge.unlockedAt && (
            <Box sx={{ p: 2, backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                ✅ Freigeschaltet am {selectedBadge.unlockedAt.toLocaleDateString('de-DE')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSelectedBadge(null)} variant="contained">
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
