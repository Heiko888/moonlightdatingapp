import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // Authorization Header auslesen
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Authorization Token fehlt'
          }
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_USER_ID',
            message: 'User ID fehlt'
          }
        },
        { status: 400 }
      );
    }

    // Token validieren
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Ungültiger oder abgelaufener Token'
          }
        },
        { status: 401 }
      );
    }

    // Dashboard-Daten parallel abrufen
    const [statsResult, activitiesResult, notificationsResult] = await Promise.all([
      getDashboardStats(userId),
      getDashboardActivities(userId),
      getDashboardNotifications(userId)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: statsResult,
        activities: activitiesResult,
        notifications: notificationsResult
      }
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Interner Serverfehler'
        }
      },
      { status: 500 }
    );
  }
}

async function getDashboardStats(userId: string) {
  try {
    // Moon Tracking Count
    const { count: moonEntries } = await supabase
      .from('moon_tracking')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Readings Count
    const { count: readings } = await supabase
      .from('readings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Matches Count
    const { count: matches } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Community Activity Count
    const { count: communityActivity } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return {
      moonEntries: moonEntries || 0,
      readings: readings || 0,
      matches: matches || 0,
      communityActivity: communityActivity || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      moonEntries: 0,
      readings: 0,
      matches: 0,
      communityActivity: 0
    };
  }
}

async function getDashboardActivities(userId: string) {
  try {
    const activities: any[] = [];

    // Moon Entries
    const { data: moonEntries } = await supabase
      .from('moon_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (moonEntries) {
      moonEntries.forEach((entry: any) => {
        activities.push({
          id: `moon-${entry.id}`,
          type: 'moon',
          title: 'Mondkalender-Eintrag',
          description: `Mondphase: ${entry.moon_phase}`,
          timestamp: entry.created_at,
          metadata: { moonPhase: entry.moon_phase, mood: entry.mood }
        });
      });
    }

    // Readings
    const { data: readings } = await supabase
      .from('readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (readings) {
      readings.forEach((reading: any) => {
        activities.push({
          id: `reading-${reading.id}`,
          type: 'reading',
          title: 'Reading durchgeführt',
          description: `Reading-Typ: ${reading.type}`,
          timestamp: reading.created_at,
          metadata: { readingType: reading.type }
        });
      });
    }

    // Matches
    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (matches) {
      matches.forEach((match: any) => {
        activities.push({
          id: `match-${match.id}`,
          type: 'match',
          title: 'Neuer Match',
          description: `Kompatibilität: ${match.compatibility_score}%`,
          timestamp: match.created_at,
          metadata: { compatibilityScore: match.compatibility_score }
        });
      });
    }

    // Nach Datum sortieren
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10);

  } catch (error) {
    console.error('Error fetching dashboard activities:', error);
    return [];
  }
}

async function getDashboardNotifications(userId: string) {
  try {
    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(10);

    return notifications || [];
  } catch (error) {
    console.error('Error fetching dashboard notifications:', error);
    return [];
  }
}
