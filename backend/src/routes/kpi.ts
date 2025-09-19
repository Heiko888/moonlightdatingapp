import { Router, Request, Response } from 'express';
import { KPIService } from '../services/KPIService';

const router = Router();
const kpiService = KPIService.getInstance();

// Get comprehensive community KPIs
router.get('/community', async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as 'daily' | 'weekly' | 'monthly') || 'weekly';
    const kpis = await kpiService.calculateCommunityKPIs(period);
    
    res.json({
      success: true,
      data: kpis,
      period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching community KPIs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch community KPIs'
    });
  }
});

// Get KPI trends
router.get('/trends', async (req: Request, res: Response) => {
  try {
    const metrics = req.query.metrics ? 
      (req.query.metrics as string).split(',') : 
      ['totalUsers', 'activeUsers', 'totalPosts', 'totalLikes'];
    const period = (req.query.period as 'daily' | 'weekly' | 'monthly') || 'weekly';
    
    const trends = await kpiService.calculateTrends(metrics, period);
    
    res.json({
      success: true,
      data: trends,
      period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching KPI trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch KPI trends'
    });
  }
});

// Get user engagement metrics
router.get('/user/:userId/engagement', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const metrics = await kpiService.getUserEngagementMetrics(userId);
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching user engagement metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user engagement metrics'
    });
  }
});

// Get content metrics
router.get('/content/:contentId', async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;
    const metrics = await kpiService.getContentMetrics(contentId);
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching content metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content metrics'
    });
  }
});

// Get community health metrics
router.get('/health', async (req: Request, res: Response) => {
  try {
    const health = await kpiService.calculateCommunityHealth();
    
    res.json({
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching community health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch community health'
    });
  }
});

// Set KPI goal
router.post('/goals', async (req: Request, res: Response) => {
  try {
    const goal = await kpiService.setKPIGoal(req.body);
    
    res.json({
      success: true,
      data: goal,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error setting KPI goal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set KPI goal'
    });
  }
});

// Get specific KPI category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const period = (req.query.period as 'daily' | 'weekly' | 'monthly') || 'weekly';
    const kpis = await kpiService.calculateCommunityKPIs(period);
    
    let categoryData: any = {};
    
    switch (category) {
      case 'engagement':
        categoryData = {
          totalUsers: kpis.totalUsers,
          activeUsers: kpis.activeUsers,
          newUsersThisMonth: kpis.newUsersThisMonth,
          userRetentionRate: kpis.userRetentionRate,
          averageSessionDuration: kpis.averageSessionDuration
        };
        break;
      case 'activity':
        categoryData = {
          totalPosts: kpis.totalPosts,
          postsThisWeek: kpis.postsThisWeek,
          totalComments: kpis.totalComments,
          commentsThisWeek: kpis.commentsThisWeek,
          totalLikes: kpis.totalLikes,
          likesThisWeek: kpis.likesThisWeek
        };
        break;
      case 'social':
        categoryData = {
          totalFriendships: kpis.totalFriendships,
          newFriendshipsThisWeek: kpis.newFriendshipsThisWeek,
          totalMatches: kpis.totalMatches,
          newMatchesThisWeek: kpis.newMatchesThisWeek,
          averageFriendsPerUser: kpis.averageFriendsPerUser
        };
        break;
      case 'events':
        categoryData = {
          totalEvents: kpis.totalEvents,
          upcomingEvents: kpis.upcomingEvents,
          totalEventParticipants: kpis.totalEventParticipants,
          averageEventAttendance: kpis.averageEventAttendance,
          totalGroups: kpis.totalGroups,
          activeGroups: kpis.activeGroups
        };
        break;
      case 'humandesign':
        categoryData = {
          typeDistribution: kpis.typeDistribution,
          profileDistribution: kpis.profileDistribution,
          channelDistribution: kpis.channelDistribution
        };
        break;
      case 'quality':
        categoryData = {
          averagePostQuality: kpis.averagePostQuality,
          reportedContent: kpis.reportedContent,
          moderatedContent: kpis.moderatedContent,
          communitySatisfactionScore: kpis.communitySatisfactionScore
        };
        break;
      case 'growth':
        categoryData = {
          monthlyGrowthRate: kpis.monthlyGrowthRate,
          weeklyGrowthRate: kpis.weeklyGrowthRate,
          viralCoefficient: kpis.viralCoefficient,
          netPromoterScore: kpis.netPromoterScore
        };
        break;
      case 'technical':
        categoryData = {
          averageResponseTime: kpis.averageResponseTime,
          systemUptime: kpis.systemUptime,
          errorRate: kpis.errorRate,
          apiCallsPerDay: kpis.apiCallsPerDay
        };
        break;
      case 'revenue':
        categoryData = {
          premiumConversions: kpis.premiumConversions,
          averageRevenuePerUser: kpis.averageRevenuePerUser,
          churnRate: kpis.churnRate
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid category'
        });
    }
    
    res.json({
      success: true,
      data: categoryData,
      category,
      period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching category KPIs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category KPIs'
    });
  }
});

// Get KPI dashboard summary
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as 'daily' | 'weekly' | 'monthly') || 'weekly';
    const [kpis, health, trends] = await Promise.all([
      kpiService.calculateCommunityKPIs(period),
      kpiService.calculateCommunityHealth(),
      kpiService.calculateTrends(['totalUsers', 'activeUsers', 'totalPosts', 'totalLikes'], period)
    ]);
    
    const dashboard = {
      overview: {
        totalUsers: kpis.totalUsers,
        activeUsers: kpis.activeUsers,
        totalPosts: kpis.totalPosts,
        totalLikes: kpis.totalLikes,
        communityHealth: health.overallHealth,
        engagementLevel: health.engagementLevel
      },
      trends,
      health,
      topMetrics: {
        mostActiveType: Object.entries(kpis.typeDistribution)
          .sort(([,a], [,b]) => (b as number) - (a as number))[0],
        growthRate: kpis.weeklyGrowthRate,
        satisfactionScore: kpis.communitySatisfactionScore,
        retentionRate: kpis.userRetentionRate
      }
    };
    
    res.json({
      success: true,
      data: dashboard,
      period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching KPI dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch KPI dashboard'
    });
  }
});

export default router;
