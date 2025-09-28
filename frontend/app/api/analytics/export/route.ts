import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { format, period, filters } = await request.json();
    
    if (!format || !['csv', 'json', 'pdf'].includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Invalid export format' },
        { status: 400 }
      );
    }

    // Get analytics data
    const analyticsData = await getAnalyticsData(period, filters);
    
    // Generate export based on format
    let exportData: any;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'csv':
        exportData = generateCSV(analyticsData);
        contentType = 'text/csv';
        filename = `analytics-${period}-${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      case 'json':
        exportData = JSON.stringify(analyticsData, null, 2);
        contentType = 'application/json';
        filename = `analytics-${period}-${new Date().toISOString().split('T')[0]}.json`;
        break;
        
      case 'pdf':
        // For PDF, you would use a library like puppeteer or jsPDF
        // This is a simplified version
        exportData = generatePDF(analyticsData);
        contentType = 'application/pdf';
        filename = `analytics-${period}-${new Date().toISOString().split('T')[0]}.pdf`;
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported format' },
          { status: 400 }
        );
    }

    return new NextResponse(exportData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to export analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function getAnalyticsData(period: string, filters: any) {
  // Calculate date range
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

  // Get comprehensive analytics data
  const [users, moonEntries, matches, communityPosts, coachingSessions, subscriptions] = await Promise.all([
    supabase.from('users').select('*').gte('created_at', startDate.toISOString()),
    supabase.from('moon_calendar_entries').select('*').gte('created_at', startDate.toISOString()),
    supabase.from('dating_matches').select('*').gte('created_at', startDate.toISOString()),
    supabase.from('community_posts').select('*').gte('created_at', startDate.toISOString()),
    supabase.from('coaching_sessions').select('*').gte('created_at', startDate.toISOString()),
    supabase.from('user_subscriptions').select('*').gte('created_at', startDate.toISOString())
  ]);

  return {
    period: {
      start: startDate.toISOString(),
      end: now.toISOString(),
      label: period
    },
    summary: {
      totalUsers: users.data?.length || 0,
      totalMoonEntries: moonEntries.data?.length || 0,
      totalMatches: matches.data?.length || 0,
      totalCommunityPosts: communityPosts.data?.length || 0,
      totalCoachingSessions: coachingSessions.data?.length || 0,
      totalRevenue: subscriptions.data?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0
    },
    detailed: {
      users: users.data || [],
      moonEntries: moonEntries.data || [],
      matches: matches.data || [],
      communityPosts: communityPosts.data || [],
      coachingSessions: coachingSessions.data || [],
      subscriptions: subscriptions.data || []
    },
    generatedAt: new Date().toISOString()
  };
}

function generateCSV(data: any): string {
  const headers = [
    'Date',
    'Total Users',
    'Moon Entries',
    'Matches',
    'Community Posts',
    'Coaching Sessions',
    'Revenue'
  ];

  const rows = [headers.join(',')];
  
  // Add summary row
  const summaryRow = [
    data.period.start,
    data.summary.totalUsers,
    data.summary.totalMoonEntries,
    data.summary.totalMatches,
    data.summary.totalCommunityPosts,
    data.summary.totalCoachingSessions,
    data.summary.totalRevenue
  ];
  
  rows.push(summaryRow.join(','));

  // Add detailed data rows
  const maxLength = Math.max(
    data.detailed.users.length,
    data.detailed.moonEntries.length,
    data.detailed.matches.length,
    data.detailed.communityPosts.length,
    data.detailed.coachingSessions.length
  );

  for (let i = 0; i < maxLength; i++) {
    const row = [
      new Date().toISOString(),
      data.detailed.users[i]?.id || '',
      data.detailed.moonEntries[i]?.id || '',
      data.detailed.matches[i]?.id || '',
      data.detailed.communityPosts[i]?.id || '',
      data.detailed.coachingSessions[i]?.id || '',
      data.detailed.subscriptions[i]?.amount || 0
    ];
    rows.push(row.join(','));
  }

  return rows.join('\n');
}

function generatePDF(data: any): string {
  // This is a simplified PDF generation
  // In a real implementation, you would use a library like puppeteer or jsPDF
  
  const pdfContent = `
    Analytics Report
    Period: ${data.period.start} to ${data.period.end}
    
    Summary:
    - Total Users: ${data.summary.totalUsers}
    - Moon Entries: ${data.summary.totalMoonEntries}
    - Matches: ${data.summary.totalMatches}
    - Community Posts: ${data.summary.totalCommunityPosts}
    - Coaching Sessions: ${data.summary.totalCoachingSessions}
    - Revenue: €${data.summary.totalRevenue}
    
    Generated at: ${data.generatedAt}
  `;

  // This would be converted to actual PDF format
  return pdfContent;
}
