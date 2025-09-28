"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Avatar,
  LinearProgress,
  Button
} from '@mui/material';
import { 
  Trophy, 
  Star, 
  Crown, 
  Target, 
  Award, 
  Flame, 
  Sparkles,
  Moon,
  Heart,
  Users,
  Lock,
  CheckCircle,
  Gift
} from 'lucide-react';
import styles from './AchievementSystem.module.css';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'moon' | 'dating' | 'community' | 'reading' | 'general';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  requirements: string[];
}

interface UserLevel {
  level: number;
  experience: number;
  maxExperience: number;
  title: string;
  nextLevelTitle: string;
  progress: number;
  points: number;
}

interface AchievementSystemProps {
  achievements: Achievement[];
  userLevel: UserLevel;
  onAchievementUnlock: (achievementId: string) => void;
  className?: string;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  achievements,
  userLevel,
  onAchievementUnlock: _onAchievementUnlock, // eslint-disable-line @typescript-eslint/no-unused-vars
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Alle', icon: <Trophy size={16} /> },
    { id: 'moon', label: 'Mond', icon: <Moon size={16} /> },
    { id: 'dating', label: 'Dating', icon: <Heart size={16} /> },
    { id: 'community', label: 'Community', icon: <Users size={16} /> },
    { id: 'reading', label: 'Lesungen', icon: <Star size={16} /> },
    { id: 'general', label: 'Allgemein', icon: <Star size={16} /> }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    return categoryMatch;
  });


  const getLevelTitle = (level: number) => {
    if (level < 5) return 'Neuling';
    if (level < 10) return 'Entdecker';
    if (level < 20) return 'Experte';
    if (level < 30) return 'Meister';
    if (level < 50) return 'Guru';
    return 'Legende';
  };

  const getLevelIcon = (level: number) => {
    if (level < 5) return <Star size={20} />;
    if (level < 10) return <Target size={20} />;
    if (level < 20) return <Award size={20} />;
    if (level < 30) return <Crown size={20} />;
    if (level < 50) return <Trophy size={20} />;
    return <Sparkles size={20} />;
  };

  return (
    <Box className={`${styles.achievementSystem} ${className}`}>
      {/* User Level Card */}
      <Card className={styles.levelCard}>
          <CardContent>
            <Box className={styles.levelHeader}>
              <Box className={styles.levelInfo}>
                <Avatar className={styles.levelAvatar}>
                  {getLevelIcon(userLevel.level)}
                </Avatar>
                <Box className={styles.levelDetails}>
                  <Typography variant="h6" className={styles.levelTitle}>
                    Level {userLevel.level} - {getLevelTitle(userLevel.level)}
                  </Typography>
                  <Typography variant="body2" className={styles.levelSubtitle}>
                    {userLevel.experience} / {userLevel.maxExperience} XP
                  </Typography>
                </Box>
              </Box>
              <Chip 
                icon={<Flame size={16} />}
                label={`${userLevel.points} Punkte`}
                className={styles.pointsChip}
                color="secondary"
              />
            </Box>
            
            <Box className={styles.levelProgress}>
              <LinearProgress 
                variant="determinate" 
                value={userLevel.progress}
                className={styles.levelProgressBar}
              />
              <Typography variant="caption" className={styles.levelProgressText}>
                {userLevel.progress.toFixed(1)}% zum nächsten Level
              </Typography>
            </Box>
          </CardContent>
        </Card>

      {/* Category Filter */}
      <Box className={styles.categoryFilter}>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'contained' : 'outlined'}
            startIcon={category.icon}
            onClick={() => setSelectedCategory(category.id)}
            className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ''}`}
          >
            {category.label}
          </Button>
        ))}
      </Box>

      {/* Achievements Grid */}
      <Box className={styles.achievementsGrid}>
        {filteredAchievements.map((achievement) => (
          <Card 
            key={achievement.id}
            className={`${styles.achievementCard} ${achievement.unlocked ? styles.unlocked : styles.locked} ${styles[achievement.rarity]}`}
          >
              <CardContent>
                <Box className={styles.achievementHeader}>
                  <Box className={styles.achievementIcon}>
                    {achievement.unlocked ? (
                      <Box className={styles.unlockedIcon}>
                        {achievement.icon}
                      </Box>
                    ) : (
                      <Box className={styles.lockedIcon}>
                        <Lock size={20} />
                      </Box>
                    )}
                  </Box>
                  
                  <Box className={styles.achievementInfo}>
                    <Typography variant="h6" className={styles.achievementTitle}>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" className={styles.achievementDescription}>
                      {achievement.description}
                    </Typography>
                  </Box>
                  
                  <Box className={styles.achievementPoints}>
                    <Chip 
                      icon={<Star size={14} />}
                      label={`${achievement.points} XP`}
                      size="small"
                      className={styles.pointsChip}
                    />
                  </Box>
                </Box>

                {!achievement.unlocked && (
                  <Box className={styles.achievementProgress}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(achievement.progress / achievement.maxProgress) * 100}
                      className={styles.progressBar}
                    />
                    <Typography variant="caption" className={styles.progressText}>
                      {achievement.progress} / {achievement.maxProgress}
                    </Typography>
                  </Box>
                )}

                {achievement.unlocked && achievement.unlockedAt && (
                  <Box className={styles.unlockInfo}>
                    <CheckCircle className={styles.unlockIcon} />
                    <Typography variant="caption" className={styles.unlockText}>
                      Freigeschaltet am {achievement.unlockedAt.toLocaleDateString('de-DE')}
                    </Typography>
                  </Box>
                )}

                <Box className={styles.achievementRequirements}>
                  {achievement.requirements.map((requirement, reqIndex) => (
                    <Typography key={reqIndex} variant="caption" className={styles.requirement}>
                      • {requirement}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
        ))}
      </Box>

      {/* Recent Unlocks - Placeholder */}
      {false && (
        <Card className={styles.recentUnlocks}>
            <CardContent>
              <Box className={styles.recentHeader}>
                <Gift className={styles.recentIcon} />
                <Typography variant="h6" className={styles.recentTitle}>
                  Kürzlich freigeschaltet
                </Typography>
              </Box>
              <Box className={styles.recentList}>
                {[].map((achievement: Achievement) => (
                  <Box key={achievement.id} className={styles.recentItem}>
                    <Box className={styles.recentAchievementIcon}>
                      {achievement.icon}
                    </Box>
                    <Box className={styles.recentAchievementInfo}>
                      <Typography variant="body2" className={styles.recentAchievementTitle}>
                        {achievement.title}
                      </Typography>
                      <Typography variant="caption" className={styles.recentAchievementPoints}>
                        +{achievement.points} XP
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
      )}
    </Box>
  );
};

export default AchievementSystem;
