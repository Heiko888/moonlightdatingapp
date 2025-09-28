import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const userId = searchParams.get('userId');

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get user analytics data
    const analyticsData = await getAnalyticsData(userId, startDate, now);
    
    return NextResponse.json({
      success: true,
      data: analyticsData,
      period,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function getAnalyticsData(userId: string | null, startDate: Date, endDate: Date) {
  const dateFilter = `created_at >= '${startDate.toISOString()}' AND created_at <= '${endDate.toISOString()}'`;
  
  // User metrics
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (usersError) throw usersError;

  // Active users (users who logged in within the period)
  const { data: activeUsers, error: activeUsersError } = await supabase
    .from('user_sessions')
    .select('user_id')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (activeUsersError) throw activeUsersError;

  // Moon calendar entries
  const { data: moonEntries, error: moonError } = await supabase
    .from('moon_calendar_entries')
    .select('id, user_id, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (moonError) throw moonError;

  // Dating matches
  const { data: matches, error: matchesError } = await supabase
    .from('dating_matches')
    .select('id, user_id, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (matchesError) throw matchesError;

  // Community posts
  const { data: communityPosts, error: communityError } = await supabase
    .from('community_posts')
    .select('id, user_id, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (communityError) throw communityError;

  // Coaching sessions
  const { data: coachingSessions, error: coachingError } = await supabase
    .from('coaching_sessions')
    .select('id, user_id, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (coachingError) throw coachingError;

  // Calculate metrics
  const totalUsers = users?.length || 0;
  const uniqueActiveUsers = new Set(activeUsers?.map(session => session.user_id)).size;
  const newUsers = users?.filter(user => 
    new Date(user.created_at) >= startDate
  ).length || 0;

  // Calculate retention rate (simplified)
  const retentionRate = totalUsers > 0 ? (uniqueActiveUsers / totalUsers) * 100 : 0;

  // Calculate engagement (based on various activities)
  const totalActivities = (moonEntries?.length || 0) + 
                        (matches?.length || 0) + 
                        (communityPosts?.length || 0) + 
                        (coachingSessions?.length || 0);
  
  const engagementRate = totalUsers > 0 ? (totalActivities / totalUsers) : 0;

  // Revenue calculation (if you have subscription data)
  const { data: subscriptions, error: subscriptionError } = await supabase
    .from('user_subscriptions')
    .select('id, amount, status')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .eq('status', 'active');

  if (subscriptionError) throw subscriptionError;

  const revenue = subscriptions?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;

  // Generate insights
  const insights = generateInsights({
    totalUsers,
    uniqueActiveUsers,
    newUsers,
    retentionRate,
    engagementRate,
    revenue,
    moonEntries: moonEntries?.length || 0,
    matches: matches?.length || 0,
    communityPosts: communityPosts?.length || 0,
    coachingSessions: coachingSessions?.length || 0
  });

  return {
    period: {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    },
    metrics: {
      totalUsers,
      activeUsers: uniqueActiveUsers,
      newUsers,
      retention: Math.round(retentionRate * 100) / 100,
      engagement: Math.round(engagementRate * 100) / 100,
      revenue: Math.round(revenue * 100) / 100
    },
    breakdown: {
      moonEntries: moonEntries?.length || 0,
      matches: matches?.length || 0,
      communityPosts: communityPosts?.length || 0,
      coachingSessions: coachingSessions?.length || 0
    },
    insights,
    charts: {
      userGrowth: generateUserGrowthChart(users || []),
      engagement: generateEngagementChart({
        moonEntries: moonEntries?.length || 0,
        matches: matches?.length || 0,
        communityPosts: communityPosts?.length || 0,
        coachingSessions: coachingSessions?.length || 0
      }),
      revenue: generateRevenueChart(subscriptions || []),
      demographics: generateDemographicsChart(users || [])
    }
  };
}

function generateInsights(data: any) {
  const insights = [];

  // High engagement insight
  if (data.engagementRate > 0.7) {
    insights.push({
      id: 'high-engagement',
      title: 'Hohe Engagement-Rate',
      description: `Deine Benutzer sind sehr aktiv mit einer Engagement-Rate von ${Math.round(data.engagementRate * 100)}%`,
      impact: 'high' as const,
      trend: 'up' as const
    });
  }

  // Growth insight
  if (data.newUsers > data.totalUsers * 0.1) {
    insights.push({
      id: 'strong-growth',
      title: 'Starkes Benutzerwachstum',
      description: `${data.newUsers} neue Benutzer in diesem Zeitraum`,
      impact: 'high' as const,
      trend: 'up' as const
    });
  }

  // Retention insight
  if (data.retentionRate > 80) {
    insights.push({
      id: 'excellent-retention',
      title: 'Exzellente Retention',
      description: `Retention-Rate von ${Math.round(data.retentionRate)}% ist hervorragend`,
      impact: 'high' as const,
      trend: 'up' as const
    });
  }

  // Low engagement warning
  if (data.engagementRate < 0.3) {
    insights.push({
      id: 'low-engagement',
      title: 'Niedrige Engagement-Rate',
      description: 'Engagement könnte verbessert werden',
      impact: 'medium' as const,
      trend: 'down' as const
    });
  }

  return insights;
}

function generateUserGrowthChart(users: any[]) {
  const dailyGrowth: { [key: string]: number } = {};
  
  users.forEach(user => {
    const date = new Date(user.created_at).toISOString().split('T')[0];
    dailyGrowth[date] = (dailyGrowth[date] || 0) + 1;
  });

  return Object.entries(dailyGrowth).map(([date, count]) => ({
    date,
    users: count
  }));
}

function generateEngagementChart(data: any) {
  return [
    { feature: 'Mondkalender', usage: data.moonEntries },
    { feature: 'Dating', usage: data.matches },
    { feature: 'Community', usage: data.communityPosts },
    { feature: 'Coaching', usage: data.coachingSessions }
  ];
}

function generateRevenueChart(subscriptions: any[]) {
  const monthlyRevenue: { [key: string]: number } = {};
  
  subscriptions.forEach(sub => {
    const month = new Date(sub.created_at).toISOString().substring(0, 7);
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (sub.amount || 0);
  });

  return Object.entries(monthlyRevenue).map(([month, amount]) => ({
    month,
    amount
  }));
}

function generateDemographicsChart(users: any[]) {
  // This would require additional user profile data
  // For now, return a placeholder
  return [
    { age: '18-25', count: Math.floor(users.length * 0.3) },
    { age: '26-35', count: Math.floor(users.length * 0.4) },
    { age: '36-45', count: Math.floor(users.length * 0.2) },
    { age: '46+', count: Math.floor(users.length * 0.1) }
  ];
}
