import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Datei-Pfade für lokale Speicherung
const coachesFile = path.join(__dirname, '../../data/coaches.json');
const sessionsFile = path.join(__dirname, '../../data/sessions.json');
const bookingsFile = path.join(__dirname, '../../data/bookings.json');
const availabilityFile = path.join(__dirname, '../../data/availability.json');

// Verzeichnis erstellen falls nicht vorhanden
const dataDir = path.dirname(coachesFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Interfaces
interface Coach {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviews: number;
  experience: string;
  specializations: string[];
  description: string;
  sessions: Array<{ type: string; price: string; duration: string }>;
  availability: string[];
  languages: string[];
  profileUrl: string;
  isOnline: boolean;
  lastSeen?: string;
  hourlyRate: number;
  timezone: string;
}

interface Booking {
  id: string;
  coachId: string;
  userId: string;
  sessionType: string;
  date: string;
  time: string;
  duration: number; // in Minuten
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  meetingLink?: string;
}

interface Availability {
  id: string;
  coachId: string;
  dayOfWeek: number; // 0 = Sonntag, 1 = Montag, etc.
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
  maxBookings: number;
  currentBookings: number;
}

// Hilfsfunktionen
const readCoaches = (): Coach[] => {
  try {
    if (fs.existsSync(coachesFile)) {
      const data = fs.readFileSync(coachesFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Fehler beim Lesen der Coaches:', error);
  }
  return getMockCoaches();
};

const writeCoaches = (coaches: Coach[]): void => {
  try {
    fs.writeFileSync(coachesFile, JSON.stringify(coaches, null, 2));
  } catch (error) {
    console.error('Fehler beim Schreiben der Coaches:', error);
    throw error;
  }
};

const readBookings = (): Booking[] => {
  try {
    if (fs.existsSync(bookingsFile)) {
      const data = fs.readFileSync(bookingsFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Fehler beim Lesen der Buchungen:', error);
  }
  return [];
};

const writeBookings = (bookings: Booking[]): void => {
  try {
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
  } catch (error) {
    console.error('Fehler beim Schreiben der Buchungen:', error);
    throw error;
  }
};

const readAvailability = (): Availability[] => {
  try {
    if (fs.existsSync(availabilityFile)) {
      const data = fs.readFileSync(availabilityFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Fehler beim Lesen der Verfügbarkeit:', error);
  }
  return getMockAvailability();
};

const writeAvailability = (availability: Availability[]): void => {
  try {
    fs.writeFileSync(availabilityFile, JSON.stringify(availability, null, 2));
  } catch (error) {
    console.error('Fehler beim Schreiben der Verfügbarkeit:', error);
    throw error;
  }
};

// Mock-Daten
const getMockCoaches = (): Coach[] => [
  {
    id: '1',
    name: 'Britta Müller',
    title: 'Human Design Expertin',
    avatar: '/images/britta.jpg',
    rating: 4.9,
    reviews: 127,
    experience: '8 Jahre',
    specializations: ['Human Design', 'Persönlichkeitsentwicklung', 'Coaching'],
    description: 'Britta ist eine erfahrene Human Design Expertin mit über 8 Jahren Erfahrung. Sie hilft Menschen dabei, ihre wahre Natur zu entdecken und ihr Leben nach ihrem Design zu leben.',
    sessions: [
      { type: '1:1 Coaching', price: '120€', duration: '60 Min' },
      { type: 'Chart Reading', price: '80€', duration: '45 Min' },
      { type: 'Gruppen-Session', price: '50€', duration: '90 Min' }
    ],
    availability: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag'],
    languages: ['Deutsch', 'Englisch'],
    profileUrl: '/coaching/britta',
    isOnline: true,
    hourlyRate: 120,
    timezone: 'Europe/Berlin'
  },
  {
    id: '2',
    name: 'Heiko Schmidt',
    title: 'HD Coach & Mentor',
    avatar: '/images/heiko.jpg',
    rating: 4.8,
    reviews: 89,
    experience: '6 Jahre',
    specializations: ['Human Design', 'Business Coaching', 'Leadership'],
    description: 'Heiko kombiniert Human Design mit modernem Business Coaching. Er hilft Führungskräften dabei, authentisch zu führen und ihre Teams zu inspirieren.',
    sessions: [
      { type: 'Business Coaching', price: '150€', duration: '60 Min' },
      { type: 'Leadership Session', price: '200€', duration: '90 Min' },
      { type: 'Team Workshop', price: '300€', duration: '120 Min' }
    ],
    availability: ['Dienstag', 'Mittwoch', 'Freitag'],
    languages: ['Deutsch', 'Englisch'],
    profileUrl: '/coaching/heiko',
    isOnline: false,
    hourlyRate: 150,
    timezone: 'Europe/Berlin'
  },
  {
    id: '3',
    name: 'Louisa Weber',
    title: 'HD Therapeutin',
    avatar: '/images/louisa.jpg',
    rating: 4.9,
    reviews: 156,
    experience: '10 Jahre',
    specializations: ['Human Design', 'Therapie', 'Heilung', 'Spiritualität'],
    description: 'Louisa ist eine erfahrene Therapeutin, die Human Design mit traditionellen Heilmethoden verbindet. Sie hilft Menschen dabei, tiefe Heilung zu erfahren.',
    sessions: [
      { type: 'Heilungs-Session', price: '100€', duration: '60 Min' },
      { type: 'Spiritual Coaching', price: '90€', duration: '45 Min' },
      { type: 'Gruppen-Heilung', price: '60€', duration: '90 Min' }
    ],
    availability: ['Montag', 'Mittwoch', 'Donnerstag', 'Samstag'],
    languages: ['Deutsch', 'Englisch', 'Französisch'],
    profileUrl: '/coaching/louisa',
    isOnline: true,
    hourlyRate: 100,
    timezone: 'Europe/Berlin'
  }
];

const getMockAvailability = (): Availability[] => [
  // Britta - Montag bis Donnerstag
  { id: '1', coachId: '1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true, maxBookings: 8, currentBookings: 3 },
  { id: '2', coachId: '1', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true, maxBookings: 8, currentBookings: 2 },
  { id: '3', coachId: '1', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true, maxBookings: 8, currentBookings: 4 },
  { id: '4', coachId: '1', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true, maxBookings: 8, currentBookings: 1 },
  
  // Heiko - Dienstag, Mittwoch, Freitag
  { id: '5', coachId: '2', dayOfWeek: 2, startTime: '10:00', endTime: '18:00', isAvailable: true, maxBookings: 6, currentBookings: 2 },
  { id: '6', coachId: '2', dayOfWeek: 3, startTime: '10:00', endTime: '18:00', isAvailable: true, maxBookings: 6, currentBookings: 3 },
  { id: '7', coachId: '2', dayOfWeek: 5, startTime: '10:00', endTime: '18:00', isAvailable: true, maxBookings: 6, currentBookings: 1 },
  
  // Louisa - Montag, Mittwoch, Donnerstag, Samstag
  { id: '8', coachId: '3', dayOfWeek: 1, startTime: '08:00', endTime: '16:00', isAvailable: true, maxBookings: 8, currentBookings: 2 },
  { id: '9', coachId: '3', dayOfWeek: 3, startTime: '08:00', endTime: '16:00', isAvailable: true, maxBookings: 8, currentBookings: 3 },
  { id: '10', coachId: '3', dayOfWeek: 4, startTime: '08:00', endTime: '16:00', isAvailable: true, maxBookings: 8, currentBookings: 1 },
  { id: '11', coachId: '3', dayOfWeek: 6, startTime: '10:00', endTime: '14:00', isAvailable: true, maxBookings: 4, currentBookings: 0 }
];

// Initialisiere Daten
const initializeData = () => {
  if (!fs.existsSync(coachesFile)) {
    writeCoaches(getMockCoaches());
  }
  if (!fs.existsSync(availabilityFile)) {
    writeAvailability(getMockAvailability());
  }
  if (!fs.existsSync(bookingsFile)) {
    writeBookings([]);
  }
};

// Initialisiere beim Start
initializeData();

// API-Endpunkte

// GET /coaching/coaches - Alle Coaches abrufen
router.get('/coaches', (req: Request, res: Response) => {
  try {
    const coaches = readCoaches();
    res.json({
      success: true,
      coaches
    });
  } catch (error) {
    console.error('Fehler beim Laden der Coaches:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Coaches'
    });
  }
});

// GET /coaching/coaches/:id - Einzelnen Coach abrufen
router.get('/coaches/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coaches = readCoaches();
    const coach = coaches.find(c => c.id === id);
    
    if (!coach) {
      return res.status(404).json({
        success: false,
        error: 'Coach nicht gefunden'
      });
    }
    
    res.json({
      success: true,
      coach
    });
  } catch (error) {
    console.error('Fehler beim Laden des Coaches:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden des Coaches'
    });
  }
});

// GET /coaching/availability/:coachId - Verfügbarkeit eines Coaches abrufen
router.get('/availability/:coachId', (req: Request, res: Response) => {
  try {
    const { coachId } = req.params;
    const availability = readAvailability();
    const coachAvailability = availability.filter(a => a.coachId === coachId);
    
    res.json({
      success: true,
      availability: coachAvailability
    });
  } catch (error) {
    console.error('Fehler beim Laden der Verfügbarkeit:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Verfügbarkeit'
    });
  }
});

// GET /coaching/available-slots/:coachId/:date - Verfügbare Zeitslots für einen bestimmten Tag
router.get('/available-slots/:coachId/:date', (req: Request, res: Response) => {
  try {
    const { coachId, date } = req.params;
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();
    
    const availability = readAvailability();
    const bookings = readBookings();
    
    // Finde Verfügbarkeit für diesen Wochentag
    const dayAvailability = availability.find(a => 
      a.coachId === coachId && a.dayOfWeek === dayOfWeek && a.isAvailable
    );
    
    if (!dayAvailability) {
      return res.json({
        success: true,
        slots: []
      });
    }
    
    // Generiere verfügbare Zeitslots
    const slots = [];
    const startTime = new Date(`2000-01-01T${dayAvailability.startTime}`);
    const endTime = new Date(`2000-01-01T${dayAvailability.endTime}`);
    
    // 60-Minuten-Slots generieren
    for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + 60)) {
      const timeString = time.toTimeString().slice(0, 5);
      
      // Prüfe ob Slot bereits gebucht ist
      const isBooked = bookings.some(booking => 
        booking.coachId === coachId &&
        booking.date === date &&
        booking.time === timeString &&
        booking.status !== 'cancelled'
      );
      
      if (!isBooked) {
        slots.push({
          time: timeString,
          available: true
        });
      }
    }
    
    res.json({
      success: true,
      slots
    });
  } catch (error) {
    console.error('Fehler beim Laden der verfügbaren Slots:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der verfügbaren Slots'
    });
  }
});

// POST /coaching/bookings - Neue Buchung erstellen
router.post('/bookings', (req: Request, res: Response) => {
  try {
    const { coachId, userId, sessionType, date, time, duration, notes } = req.body;
    
    if (!coachId || !userId || !sessionType || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Alle Pflichtfelder müssen ausgefüllt werden'
      });
    }
    
    // Finde Coach für Preis
    const coaches = readCoaches();
    const coach = coaches.find(c => c.id === coachId);
    if (!coach) {
      return res.status(404).json({
        success: false,
        error: 'Coach nicht gefunden'
      });
    }
    
    // Berechne Preis basierend auf Dauer
    const price = (duration / 60) * coach.hourlyRate;
    
    const booking: Booking = {
      id: uuidv4(),
      coachId,
      userId,
      sessionType,
      date,
      time,
      duration: duration || 60,
      price,
      status: 'pending',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentStatus: 'pending'
    };
    
    const bookings = readBookings();
    bookings.push(booking);
    writeBookings(bookings);
    
    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Fehler beim Erstellen der Buchung:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen der Buchung'
    });
  }
});

// GET /coaching/bookings/:userId - Buchungen eines Benutzers abrufen
router.get('/bookings/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = readBookings();
    const userBookings = bookings.filter(b => b.userId === userId);
    
    // Füge Coach-Informationen hinzu
    const coaches = readCoaches();
    const bookingsWithCoaches = userBookings.map(booking => {
      const coach = coaches.find(c => c.id === booking.coachId);
      return {
        ...booking,
        coach: coach ? {
          name: coach.name,
          avatar: coach.avatar,
          title: coach.title
        } : null
      };
    });
    
    res.json({
      success: true,
      bookings: bookingsWithCoaches
    });
  } catch (error) {
    console.error('Fehler beim Laden der Buchungen:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Buchungen'
    });
  }
});

// PUT /coaching/bookings/:id - Buchung aktualisieren
router.put('/bookings/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const bookings = readBookings();
    const bookingIndex = bookings.findIndex(b => b.id === id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Buchung nicht gefunden'
      });
    }
    
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    writeBookings(bookings);
    
    res.json({
      success: true,
      booking: bookings[bookingIndex]
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Buchung:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Aktualisieren der Buchung'
    });
  }
});

// DELETE /coaching/bookings/:id - Buchung stornieren
router.delete('/bookings/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const bookings = readBookings();
    const bookingIndex = bookings.findIndex(b => b.id === id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Buchung nicht gefunden'
      });
    }
    
    // Storniere Buchung statt zu löschen
    bookings[bookingIndex].status = 'cancelled';
    bookings[bookingIndex].updatedAt = new Date().toISOString();
    
    writeBookings(bookings);
    
    res.json({
      success: true,
      message: 'Buchung wurde storniert'
    });
  } catch (error) {
    console.error('Fehler beim Stornieren der Buchung:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Stornieren der Buchung'
    });
  }
});

export default router;
