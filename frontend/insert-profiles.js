// Script um Test-Profile in Supabase einzufügen
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://njjcywgskzepikyzhihy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs';

const supabase = createClient(supabaseUrl, supabaseKey);

const testProfiles = [
  {
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Sarah',
    age: 28,
    location: 'Berlin',
    bio: 'Leidenschaftliche Generatorin, die ihre sakrale Energie nutzt, um andere zu inspirieren. Liebt Yoga, Meditation und tiefe Gespräche über das Leben.',
    hd_type: 'Generator',
    profile: '2/4',
    authority: 'Sakral',
    strategy: 'Auf andere reagieren',
    interests: ['Yoga', 'Meditation', 'Natur', 'Musik', 'Reisen', 'Heilung'],
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'
    ],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    is_active: true
  },
  {
    user_id: '00000000-0000-0000-0000-000000000002',
    name: 'Marcus',
    age: 32,
    location: 'München',
    bio: 'Erfahrener Projector, der anderen hilft, ihre wahre Bestimmung zu finden. Spezialisiert auf Human Design Beratung und spirituelle Führung.',
    hd_type: 'Projector',
    profile: '3/5',
    authority: 'Splenic',
    strategy: 'Warten auf Einladung',
    interests: ['Human Design', 'Spiritualität', 'Mentoring', 'Philosophie', 'Bücher', 'Kaffee'],
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    ],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    is_active: true
  },
  {
    user_id: '00000000-0000-0000-0000-000000000003',
    name: 'Luna',
    age: 26,
    location: 'Hamburg',
    bio: 'Kreative Manifestorin, die ihre Visionen in die Welt bringt. Künstlerin, Autorin und spirituelle Lehrerin mit einer besonderen Verbindung zum Mond.',
    hd_type: 'Manifestor',
    profile: '1/3',
    authority: 'Splenic',
    strategy: 'Informieren',
    interests: ['Kunst', 'Schreiben', 'Astrologie', 'Mondzyklen', 'Kreativität', 'Heilung'],
    images: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    ],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    is_active: true
  },
  {
    user_id: '00000000-0000-0000-0000-000000000004',
    name: 'David',
    age: 35,
    location: 'Köln',
    bio: 'Weiser Reflector, der die Energie seiner Umgebung widerspiegelt. Mentor und spiritueller Führer mit tiefem Verständnis für energetische Verbindungen.',
    hd_type: 'Reflector',
    profile: '6/2',
    authority: 'Lunar',
    strategy: 'Warten auf Mondzyklus',
    interests: ['Spiritualität', 'Mentoring', 'Heilung', 'Natur', 'Musik', 'Philosophie'],
    images: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    ],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    is_active: true
  },
  {
    user_id: '00000000-0000-0000-0000-000000000005',
    name: 'Emma',
    age: 29,
    location: 'Frankfurt',
    bio: 'Energische Generatorin mit einem starken sakralen Zentrum. Liebt es, andere zu unterstützen und positive Energie zu verbreiten.',
    hd_type: 'Generator',
    profile: '4/6',
    authority: 'Sakral',
    strategy: 'Auf andere reagieren',
    interests: ['Fitness', 'Gesunde Ernährung', 'Natur', 'Tiere', 'Reisen', 'Lernen'],
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
    ],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    is_active: true
  },
  {
    user_id: '00000000-0000-0000-0000-000000000006',
    name: 'Alex',
    age: 31,
    location: 'Stuttgart',
    bio: 'Intelligenter Projector mit einem tiefen Verständnis für Human Design. Hilft anderen dabei, ihre einzigartigen Gaben zu entdecken.',
    hd_type: 'Projector',
    profile: '2/4',
    authority: 'Splenic',
    strategy: 'Warten auf Einladung',
    interests: ['Human Design', 'Psychologie', 'Coaching', 'Bücher', 'Kaffee', 'Gespräche'],
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
    ],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    is_active: true
  }
];

async function insertTestProfiles() {
  try {
    console.log('🚀 Füge Test-Profile in Supabase ein...');
    
    const { data, error } = await supabase
      .from('matching_profiles')
      .insert(testProfiles);
    
    if (error) {
      console.error('❌ Fehler beim Einfügen:', error);
    } else {
      console.log('✅ Test-Profile erfolgreich eingefügt!');
      console.log(`📊 ${testProfiles.length} Profile hinzugefügt`);
    }
  } catch (err) {
    console.error('❌ Unerwarteter Fehler:', err);
  }
}

insertTestProfiles();
