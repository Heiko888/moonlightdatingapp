import { CommunityKPI, KPITrend, KPIGoal, UserEngagementMetrics, ContentMetrics, CommunityHealthMetrics } from '../models/KPI';

export class KPIService {
  private static instance: KPIService;
  private kpiCache: Map<string, CommunityKPI> = new Map();
  private cacheExpiry: Map<string, Date> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): KPIService {
    if (!KPIService.instance) {
      KPIService.instance = new KPIService();
    }
    return KPIService.instance;
  }

  // Calculate comprehensive community KPIs
  public async calculateCommunityKPIs(period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<CommunityKPI> {
    const cacheKey = `kpi_${period}`;
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return this.kpiCache.get(cacheKey)!;
    }

    try {
      const now = new Date();
      const periodStart = this.getPeriodStart(now, period);
      
      // Simulate database queries - in real implementation, these would be actual DB calls
      const kpis: CommunityKPI = {
        // User Engagement KPIs
        totalUsers: await this.getTotalUsers(),
        activeUsers: await this.getActiveUsers(periodStart),
        newUsersThisMonth: await this.getNewUsersThisMonth(),
        userRetentionRate: await this.calculateUserRetentionRate(),
        averageSessionDuration: await this.getAverageSessionDuration(),
        
        // Community Activity KPIs
        totalPosts: await this.getTotalPosts(),
        postsThisWeek: await this.getPostsThisWeek(),
        totalComments: await this.getTotalComments(),
        commentsThisWeek: await this.getCommentsThisWeek(),
        totalLikes: await this.getTotalLikes(),
        likesThisWeek: await this.getLikesThisWeek(),
        
        // Social Connection KPIs
        totalFriendships: await this.getTotalFriendships(),
        newFriendshipsThisWeek: await this.getNewFriendshipsThisWeek(),
        totalMatches: await this.getTotalMatches(),
        newMatchesThisWeek: await this.getNewMatchesThisWeek(),
        averageFriendsPerUser: await this.getAverageFriendsPerUser(),
        
        // Event & Group KPIs
        totalEvents: await this.getTotalEvents(),
        upcomingEvents: await this.getUpcomingEvents(),
        totalEventParticipants: await this.getTotalEventParticipants(),
        averageEventAttendance: await this.getAverageEventAttendance(),
        totalGroups: await this.getTotalGroups(),
        activeGroups: await this.getActiveGroups(),
        
        // Human Design Specific KPIs
        typeDistribution: await this.getTypeDistribution(),
        profileDistribution: await this.getProfileDistribution(),
        channelDistribution: await this.getChannelDistribution(),
        
        // Content Quality KPIs
        averagePostQuality: await this.getAveragePostQuality(),
        reportedContent: await this.getReportedContent(),
        moderatedContent: await this.getModeratedContent(),
        communitySatisfactionScore: await this.getCommunitySatisfactionScore(),
        
        // Growth KPIs
        monthlyGrowthRate: await this.getMonthlyGrowthRate(),
        weeklyGrowthRate: await this.getWeeklyGrowthRate(),
        viralCoefficient: await this.getViralCoefficient(),
        netPromoterScore: await this.getNetPromoterScore(),
        
        // Technical KPIs
        averageResponseTime: await this.getAverageResponseTime(),
        systemUptime: await this.getSystemUptime(),
        errorRate: await this.getErrorRate(),
        apiCallsPerDay: await this.getApiCallsPerDay(),
        
        // Revenue KPIs
        premiumConversions: await this.getPremiumConversions(),
        averageRevenuePerUser: await this.getAverageRevenuePerUser(),
        churnRate: await this.getChurnRate(),
        
        // Timestamps
        lastUpdated: now,
        periodStart,
        periodEnd: now
      };

      // Cache the results
      this.kpiCache.set(cacheKey, kpis);
      this.cacheExpiry.set(cacheKey, new Date(Date.now() + this.CACHE_DURATION));

      return kpis;
    } catch (error) {
      console.error('Error calculating community KPIs:', error);
      throw new Error('Failed to calculate community KPIs');
    }
  }

  // Calculate trends for specific metrics
  public async calculateTrends(metrics: string[], period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<KPITrend[]> {
    const trends: KPITrend[] = [];
    
    for (const metric of metrics) {
      try {
        const currentValue = await this.getCurrentMetricValue(metric, period);
        const previousValue = await this.getPreviousMetricValue(metric, period);
        const changePercentage = ((currentValue - previousValue) / previousValue) * 100;
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (changePercentage > 5) trend = 'up';
        else if (changePercentage < -5) trend = 'down';
        
        trends.push({
          metric,
          currentValue,
          previousValue,
          changePercentage,
          trend,
          period
        });
      } catch (error) {
        console.error(`Error calculating trend for metric ${metric}:`, error);
      }
    }
    
    return trends;
  }

  // Get user engagement metrics
  public async getUserEngagementMetrics(userId: string): Promise<UserEngagementMetrics> {
    // In real implementation, this would query the database
    return {
      userId,
      loginCount: Math.floor(Math.random() * 100) + 10,
      lastLogin: new Date(),
      postsCreated: Math.floor(Math.random() * 50) + 5,
      commentsMade: Math.floor(Math.random() * 200) + 20,
      likesGiven: Math.floor(Math.random() * 500) + 50,
      friendsAdded: Math.floor(Math.random() * 30) + 5,
      eventsAttended: Math.floor(Math.random() * 20) + 2,
      groupsJoined: Math.floor(Math.random() * 10) + 1,
      averageSessionTime: Math.floor(Math.random() * 60) + 15,
      engagementScore: Math.floor(Math.random() * 40) + 60
    };
  }

  // Get content metrics
  public async getContentMetrics(contentId: string): Promise<ContentMetrics> {
    // In real implementation, this would query the database
    return {
      contentId,
      contentType: 'post',
      authorId: 'user123',
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 50) + 5,
      shares: Math.floor(Math.random() * 20) + 2,
      engagementRate: Math.random() * 0.1 + 0.05,
      qualityScore: Math.random() * 40 + 60,
      createdAt: new Date()
    };
  }

  // Calculate community health metrics
  public async calculateCommunityHealth(): Promise<CommunityHealthMetrics> {
    const kpis = await this.calculateCommunityKPIs();
    
    // Calculate overall health score (0-100)
    const engagementScore = Math.min(100, (kpis.activeUsers / kpis.totalUsers) * 100);
    const qualityScore = kpis.communitySatisfactionScore;
    const growthScore = Math.min(100, kpis.weeklyGrowthRate * 10);
    const toxicityScore = Math.max(0, 100 - (kpis.reportedContent / kpis.totalPosts) * 100);
    
    const overallHealth = (engagementScore + qualityScore + growthScore + toxicityScore) / 4;
    
    let engagementLevel: 'low' | 'medium' | 'high' | 'excellent';
    if (overallHealth >= 80) engagementLevel = 'excellent';
    else if (overallHealth >= 60) engagementLevel = 'high';
    else if (overallHealth >= 40) engagementLevel = 'medium';
    else engagementLevel = 'low';
    
    let toxicityLevel: 'low' | 'medium' | 'high';
    const toxicityRatio = kpis.reportedContent / kpis.totalPosts;
    if (toxicityRatio < 0.01) toxicityLevel = 'low';
    else if (toxicityRatio < 0.05) toxicityLevel = 'medium';
    else toxicityLevel = 'high';
    
    return {
      overallHealth,
      engagementLevel,
      toxicityLevel,
      diversityScore: this.calculateDiversityScore(kpis.typeDistribution),
      inclusivityScore: 85, // Placeholder
      supportivenessScore: 78, // Placeholder
      lastCalculated: new Date()
    };
  }

  // Set and track KPI goals
  public async setKPIGoal(goal: Omit<KPIGoal, 'id' | 'status'>): Promise<KPIGoal> {
    const newGoal: KPIGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      status: this.calculateGoalStatus(goal.currentValue, goal.targetValue, goal.deadline)
    };
    
    // In real implementation, save to database
    return newGoal;
  }

  // Private helper methods
  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? expiry > new Date() : false;
  }

  private getPeriodStart(date: Date, period: 'daily' | 'weekly' | 'monthly'): Date {
    const start = new Date(date);
    switch (period) {
      case 'daily':
        start.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        start.setDate(start.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(start.getMonth() - 1);
        break;
    }
    return start;
  }

  private calculateDiversityScore(typeDistribution: any): number {
    const values = Object.values(typeDistribution) as number[];
    const total = values.reduce((sum, val) => sum + val, 0);
    const proportions = values.map(val => val / total);
    
    // Calculate Shannon diversity index
    const diversity = -proportions.reduce((sum, prop) => {
      return sum + (prop > 0 ? prop * Math.log(prop) : 0);
    }, 0);
    
    return Math.min(100, diversity * 25); // Scale to 0-100
  }

  private calculateGoalStatus(currentValue: number, targetValue: number, deadline: Date): 'on-track' | 'at-risk' | 'behind' | 'completed' {
    if (currentValue >= targetValue) return 'completed';
    
    const now = new Date();
    const timeRemaining = deadline.getTime() - now.getTime();
    const totalTime = deadline.getTime() - (now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const progressRatio = currentValue / targetValue;
    const timeRatio = timeRemaining / totalTime;
    
    if (progressRatio >= timeRatio * 0.8) return 'on-track';
    if (progressRatio >= timeRatio * 0.5) return 'at-risk';
    return 'behind';
  }

  // Mock data methods - replace with actual database queries
  private async getTotalUsers(): Promise<number> { return 1250; }
  private async getActiveUsers(periodStart: Date): Promise<number> { return 890; }
  private async getNewUsersThisMonth(): Promise<number> { return 156; }
  private async calculateUserRetentionRate(): Promise<number> { return 78.5; }
  private async getAverageSessionDuration(): Promise<number> { return 24.5; }
  private async getTotalPosts(): Promise<number> { return 3450; }
  private async getPostsThisWeek(): Promise<number> { return 234; }
  private async getTotalComments(): Promise<number> { return 12890; }
  private async getCommentsThisWeek(): Promise<number> { return 567; }
  private async getTotalLikes(): Promise<number> { return 45670; }
  private async getLikesThisWeek(): Promise<number> { return 1234; }
  private async getTotalFriendships(): Promise<number> { return 5670; }
  private async getNewFriendshipsThisWeek(): Promise<number> { return 89; }
  private async getTotalMatches(): Promise<number> { return 1234; }
  private async getNewMatchesThisWeek(): Promise<number> { return 45; }
  private async getAverageFriendsPerUser(): Promise<number> { return 4.5; }
  private async getTotalEvents(): Promise<number> { return 156; }
  private async getUpcomingEvents(): Promise<number> { return 23; }
  private async getTotalEventParticipants(): Promise<number> { return 2340; }
  private async getAverageEventAttendance(): Promise<number> { return 15.0; }
  private async getTotalGroups(): Promise<number> { return 67; }
  private async getActiveGroups(): Promise<number> { return 45; }
  private async getTypeDistribution(): Promise<any> {
    return { generator: 45, projector: 25, manifestor: 20, reflector: 10 };
  }
  private async getProfileDistribution(): Promise<Record<string, number>> {
    return { '1/3': 15, '2/4': 12, '3/5': 18, '4/6': 14, '5/1': 16, '6/2': 13, '6/3': 12 };
  }
  private async getChannelDistribution(): Promise<Record<string, number>> {
    return { '10-20': 8, '20-34': 12, '34-57': 15, '57-10': 6 };
  }
  private async getAveragePostQuality(): Promise<number> { return 7.8; }
  private async getReportedContent(): Promise<number> { return 23; }
  private async getModeratedContent(): Promise<number> { return 8; }
  private async getCommunitySatisfactionScore(): Promise<number> { return 82.5; }
  private async getMonthlyGrowthRate(): Promise<number> { return 12.5; }
  private async getWeeklyGrowthRate(): Promise<number> { return 3.2; }
  private async getViralCoefficient(): Promise<number> { return 1.8; }
  private async getNetPromoterScore(): Promise<number> { return 67; }
  private async getAverageResponseTime(): Promise<number> { return 245; }
  private async getSystemUptime(): Promise<number> { return 99.8; }
  private async getErrorRate(): Promise<number> { return 0.2; }
  private async getApiCallsPerDay(): Promise<number> { return 45670; }
  private async getPremiumConversions(): Promise<number> { return 156; }
  private async getAverageRevenuePerUser(): Promise<number> { return 12.50; }
  private async getChurnRate(): Promise<number> { return 5.2; }
  private async getCurrentMetricValue(metric: string, period: string): Promise<number> {
    return Math.floor(Math.random() * 1000) + 100;
  }
  private async getPreviousMetricValue(metric: string, period: string): Promise<number> {
    return Math.floor(Math.random() * 900) + 90;
  }
}
