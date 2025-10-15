import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    logger.error('Unauthorized access to /api/users/discover', userError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Lade bereits gelikte/gepasste User
    const { data: existingFriends, error: friendsError } = await supabase
      .from('friendships')
      .select('friend_id')
      .eq('user_id', user.id);

    const excludedIds = existingFriends?.map(f => f.friend_id) || [];
    excludedIds.push(user.id); // Exclude current user

    // Lade alle Profile aus der friends-Tabelle (potentielle Matches)
    // ODER erstelle Mock-Daten falls keine Profile existieren
    const { data: profiles, error: profilesError } = await supabase
      .from('friends')
      .select('*')
      .not('user_id', 'in', `(${excludedIds.join(',')})`)
      .limit(50);

    if (profilesError && profilesError.code !== 'PGRST116') { // PGRST116 = no rows returned
      logger.error('Error fetching profiles:', profilesError);
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    // Wenn keine Profile existieren, gib Mock-Daten zurück
    if (!profiles || profiles.length === 0) {
      logger.info('No profiles found in database, using mock data');
      return NextResponse.json({
        success: true,
        users: [], // Empty für jetzt
        count: 0,
        message: 'Keine User gefunden. Bitte erstelle zuerst User-Profile in Supabase.'
      });
    }

    // Formatiere Profile für Swipe-Interface
    const enrichedUsers = profiles.map(profile => ({
      id: profile.id,
      user_id: profile.user_id,
      name: profile.name || 'Unbekannt',
      age: profile.age || null,
      location: profile.location || null,
      bio: profile.bio || null,
      hd_type: profile.hd_type || profile.hdType || null,
      profile: profile.hd_profile || profile.hdProfile || null,
      authority: profile.hd_authority || profile.hdAuthority || null,
      strategy: profile.hd_strategy || profile.hdStrategy || null,
      image: profile.avatar || '/dating/default.jpg',
      interests: profile.interests || [],
      compatibility_score: calculateCompatibility(user.id, profile.user_id),
      created_at: profile.created_at
    }));

    logger.info(`Loaded ${enrichedUsers.length} users for discovery`);

    return NextResponse.json({
      success: true,
      users: enrichedUsers,
      count: enrichedUsers.length
    });

  } catch (error) {
    logger.error('Failed to load users for discovery:', error);
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}

// Einfache Kompatibilitäts-Berechnung (kann später erweitert werden)
function calculateCompatibility(userId1: string, userId2: string): number {
  // TODO: Implementiere echte HD-Kompatibilitäts-Logik
  // Für jetzt: Zufälliger Score zwischen 60-100
  return Math.floor(Math.random() * 40) + 60;
}

