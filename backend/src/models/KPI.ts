export interface CommunityKPI {
  // User Engagement KPIs
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  userRetentionRate: number;
  averageSessionDuration: number;
  
  // Community Activity KPIs
  totalPosts: number;
  postsThisWeek: number;
  totalComments: number;
  commentsThisWeek: number;
  totalLikes: number;
  likesThisWeek: number;
  
  // Social Connection KPIs
  totalFriendships: number;
  newFriendshipsThisWeek: number;
  totalMatches: number;
  newMatchesThisWeek: number;
  averageFriendsPerUser: number;
  
  // Event & Group KPIs
  totalEvents: number;
  upcomingEvents: number;
  totalEventParticipants: number;
  averageEventAttendance: number;
  totalGroups: number;
  activeGroups: number;
  
  // Human Design Specific KPIs
  typeDistribution: {
    generator: number;
    projector: number;
    manifestor: number;
    reflector: number;
  };
  profileDistribution: Record<string, number>;
  channelDistribution: Record<string, number>;
  
  // Content Quality KPIs
  averagePostQuality: number;
  reportedContent: number;
  moderatedContent: number;
  communitySatisfactionScore: number;
  
  // Growth KPIs
  monthlyGrowthRate: number;
  weeklyGrowthRate: number;
  viralCoefficient: number;
  netPromoterScore: number;
  
  // Technical KPIs
  averageResponseTime: number;
  systemUptime: number;
  errorRate: number;
  apiCallsPerDay: number;
  
  // Revenue KPIs (if applicable)
  premiumConversions: number;
  averageRevenuePerUser: number;
  churnRate: number;
  
  // Timestamps
  lastUpdated: Date;
  periodStart: Date;
  periodEnd: Date;
}

export interface KPITrend {
  metric: string;
  currentValue: number;
  previousValue: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  period: 'daily' | 'weekly' | 'monthly';
}

export interface KPIGoal {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  category: 'engagement' | 'growth' | 'quality' | 'revenue';
}

export interface UserEngagementMetrics {
  userId: string;
  loginCount: number;
  lastLogin: Date;
  postsCreated: number;
  commentsMade: number;
  likesGiven: number;
  friendsAdded: number;
  eventsAttended: number;
  groupsJoined: number;
  averageSessionTime: number;
  engagementScore: number;
}

export interface ContentMetrics {
  contentId: string;
  contentType: 'post' | 'comment' | 'event' | 'group';
  authorId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  qualityScore: number;
  createdAt: Date;
}

export interface CommunityHealthMetrics {
  overallHealth: number;
  engagementLevel: 'low' | 'medium' | 'high' | 'excellent';
  toxicityLevel: 'low' | 'medium' | 'high';
  diversityScore: number;
  inclusivityScore: number;
  supportivenessScore: number;
  lastCalculated: Date;
}
