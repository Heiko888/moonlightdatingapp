import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Beispiel-Community-Daten
const samplePosts = [
  {
    id: '1',
    userId: 'user1',
    title: 'Meine Erfahrung als Generator',
    content: 'Ich habe vor kurzem mein Human Design Chart berechnet und bin ein Generator. Die Strategie "Warten auf die Antwort" hat mein Leben wirklich verändert. Wie geht es euch damit?',
    type: 'experience',
    tags: ['Generator', 'Strategie', 'Erfahrung'],
    likes: 12,
    comments: 5,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 'user1',
      username: 'generator_lover',
      name: 'Sarah Müller',
      hd_type: 'Generator',
      profile: '1/3',
      avatar: '',
      bio: 'Leidenschaftliche Generator mit viel Energie',
      location: 'Berlin',
      interests: ['Human Design', 'Yoga', 'Kreativität'],
      isOnline: true
    }
  },
  {
    id: '2',
    userId: 'user2',
    title: 'Frage zu Projektor-Strategie',
    content: 'Als Projektor fällt es mir schwer, auf Einladungen zu warten. Wie kann ich das besser umsetzen? Habt ihr Tipps?',
    type: 'question',
    tags: ['Projektor', 'Strategie', 'Frage'],
    likes: 8,
    comments: 12,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 'user2',
      username: 'projector_guide',
      name: 'Michael Schmidt',
      hd_type: 'Projektor',
      profile: '2/4',
      avatar: '',
      bio: 'Projektor auf dem Weg zur Meisterschaft',
      location: 'München',
      interests: ['Human Design', 'Coaching', 'Persönlichkeitsentwicklung'],
      isOnline: false
    }
  },
  {
    id: '3',
    userId: 'user3',
    title: 'Tipp: Mondkalender für Manifestoren',
    content: 'Als Manifestor habe ich festgestellt, dass der Mondkalender mir hilft, die richtigen Zeiten für meine Initiativen zu finden. Besonders bei Neumond ist meine Energie am stärksten!',
    type: 'tip',
    tags: ['Manifestor', 'Mondkalender', 'Tipp'],
    likes: 15,
    comments: 7,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 'user3',
      username: 'manifestor_moon',
      name: 'Lisa Weber',
      hd_type: 'Manifestor',
      profile: '3/5',
      avatar: '',
      bio: 'Manifestor mit Liebe zum Mond',
      location: 'Hamburg',
      interests: ['Human Design', 'Astrologie', 'Mondkalender'],
      isOnline: true
    }
  }
];

const sampleGroups = [
  {
    id: '1',
    name: 'Generators United',
    description: 'Eine Gruppe für alle Generators, die ihre Energie und Strategie verstehen möchten.',
    type: 'hd_type',
    category: 'Generator',
    memberCount: 45,
    isPrivate: false
  },
  {
    id: '2',
    name: 'Projektor Meisterschaft',
    description: 'Für Projektoren, die lernen möchten, wie sie ihre Führungsqualitäten optimal nutzen.',
    type: 'hd_type',
    category: 'Projektor',
    memberCount: 32,
    isPrivate: false
  },
  {
    id: '3',
    name: 'Mondkalender Enthusiasten',
    description: 'Austausch über Mondphasen und deren Einfluss auf unser Human Design.',
    type: 'interest',
    category: 'Astrologie',
    memberCount: 67,
    isPrivate: false
  },
  {
    id: '4',
    name: 'Berlin HD Community',
    description: 'Lokale Human Design Community in Berlin für Treffen und Austausch.',
    type: 'location',
    category: 'Berlin',
    memberCount: 23,
    isPrivate: false
  }
];

const sampleEvents = [
  {
    id: '1',
    title: 'Human Design Workshop: Deine Strategie leben',
    description: 'Ein interaktiver Workshop, in dem wir lernen, wie wir unsere Human Design Strategie im Alltag umsetzen können.',
    type: 'workshop',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '14:00',
    location: 'Berlin, Mitte',
    isOnline: false,
    maxParticipants: 20,
    currentParticipants: 12
  },
  {
    id: '2',
    title: 'Online: Manifestor Meetup',
    description: 'Ein virtuelles Treffen für Manifestoren zum Austausch über Erfahrungen und Strategien.',
    type: 'meetup',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '19:00',
    location: 'Online',
    isOnline: true,
    maxParticipants: 50,
    currentParticipants: 28
  },
  {
    id: '3',
    title: 'Mondmeditation für alle Typen',
    description: 'Eine geführte Meditation, die auf den aktuellen Mondphasen basiert und für alle Human Design Typen geeignet ist.',
    type: 'meditation',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    time: '20:00',
    location: 'Online',
    isOnline: true,
    maxParticipants: 100,
    currentParticipants: 45
  }
];

const sampleFriends = [
  {
    id: 'user1',
    username: 'generator_lover',
    name: 'Sarah Müller',
    hd_type: 'Generator',
    profile: '1/3',
    avatar: '',
    bio: 'Leidenschaftliche Generator mit viel Energie',
    location: 'Berlin',
    interests: ['Human Design', 'Yoga', 'Kreativität'],
    isOnline: true
  },
  {
    id: 'user2',
    username: 'projector_guide',
    name: 'Michael Schmidt',
    hd_type: 'Projektor',
    profile: '2/4',
    avatar: '',
    bio: 'Projektor auf dem Weg zur Meisterschaft',
    location: 'München',
    interests: ['Human Design', 'Coaching', 'Persönlichkeitsentwicklung'],
    isOnline: false
  },
  {
    id: 'user3',
    username: 'manifestor_moon',
    name: 'Lisa Weber',
    hd_type: 'Manifestor',
    profile: '3/5',
    avatar: '',
    bio: 'Manifestor mit Liebe zum Mond',
    location: 'Hamburg',
    interests: ['Human Design', 'Astrologie', 'Mondkalender'],
    isOnline: true
  },
  {
    id: 'user4',
    username: 'reflector_wisdom',
    name: 'Anna Klein',
    hd_type: 'Reflektor',
    profile: '4/6',
    avatar: '',
    bio: 'Reflektor, der die Weisheit der Gemeinschaft widerspiegelt',
    location: 'Köln',
    interests: ['Human Design', 'Gemeinschaft', 'Spiritualität'],
    isOnline: true
  }
];

// GET /community/posts
router.get('/posts', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      posts: samplePosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Posts'
    });
  }
});

// POST /community/posts
router.post('/posts', (req: Request, res: Response) => {
  try {
    const { title, content, type, tags, isPublic } = req.body;

    const newPost = {
      id: (samplePosts.length + 1).toString(),
      userId: 'current_user', // In echter App aus Auth-Token
      title,
      content,
      type: type || 'question',
      tags: tags || [],
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      author: {
        id: 'current_user',
        username: 'current_user',
        name: 'Aktueller Benutzer',
        hd_type: 'Generator',
        profile: '1/3',
        avatar: '',
        bio: 'Human Design Enthusiast',
        location: 'Deutschland',
        interests: ['Human Design'],
        isOnline: true
      }
    };
    
    samplePosts.unshift(newPost);

    res.json({
      success: true,
      post: newPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen des Posts'
    });
  }
});

// POST /community/posts/:id/like
router.post('/posts/:id/like', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = samplePosts.find(p => p.id === id);

    if (post) {
      post.likes += 1;
    res.json({
      success: true,
        likes: post.likes
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Post nicht gefunden'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Liken des Posts'
    });
  }
});

// GET /community/groups
router.get('/groups', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      groups: sampleGroups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Gruppen'
    });
  }
});

// GET /community/events
router.get('/events', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      events: sampleEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Events'
    });
  }
});

// GET /community/friends
router.get('/friends', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      friends: sampleFriends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Freunde'
    });
  }
});

export default router;
