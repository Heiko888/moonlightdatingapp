import express, { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = express.Router();

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'chat' | 'coaching' | 'matching' | 'system' | 'moon';
  is_read: boolean;
  created_at: string;
  action_url?: string;
  metadata?: any;
}

// Mock-Daten für Fallback
const mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: 'user1',
    title: 'Neue Coaching-Nachricht',
    message: 'Elisabeth hat dir eine Nachricht geschickt.',
    type: 'info',
    category: 'coaching',
    is_read: false,
    created_at: new Date().toISOString(),
    action_url: '/coaching/elisabeth'
  },
  {
    id: '2',
    user_id: 'user1',
    title: 'Vollmond heute',
    message: 'Heute ist Vollmond - perfekt für Manifestation und Reflexion.',
    type: 'success',
    category: 'moon',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    action_url: '/mondkalender'
  },
  {
    id: '3',
    user_id: 'user1',
    title: 'Neues Match gefunden',
    message: 'Du hast ein neues Match mit ähnlichen Interessen!',
    type: 'success',
    category: 'matching',
    is_read: true,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    action_url: '/matching'
  }
];

// GET /notifications - Alle Benachrichtigungen eines Users
router.get('/', async (req: Request, res: Response) => {
  try {
    const { user_id, limit = 50, offset = 0, unread_only = false } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id ist erforderlich' });
    }

    // Versuche Supabase zu verwenden
    if (supabase) {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (unread_only === 'true') {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.json(data || []);
    }

    // Fallback: Mock-Daten
    let userNotifications = mockNotifications.filter(n => n.user_id === user_id);
    
    if (unread_only === 'true') {
      userNotifications = userNotifications.filter(n => !n.is_read);
    }
    
    userNotifications = userNotifications
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(Number(offset), Number(offset) + Number(limit));

    res.json(userNotifications);
  } catch (error) {
    console.error('Fehler beim Laden der Benachrichtigungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Benachrichtigungen' });
  }
});

// GET /notifications/unread-count - Anzahl ungelesener Benachrichtigungen
router.get('/unread-count', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id ist erforderlich' });
    }

    // Versuche Supabase zu verwenden
    if (supabase) {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user_id)
        .eq('is_read', false);

      if (error) throw error;
      return res.json({ count: count || 0 });
    }

    // Fallback: Mock-Daten
    const unreadCount = mockNotifications.filter(n => 
      n.user_id === user_id && !n.is_read
    ).length;

    res.json({ count: unreadCount });
  } catch (error) {
    console.error('Fehler beim Zählen der ungelesenen Benachrichtigungen:', error);
    res.status(500).json({ error: 'Fehler beim Zählen der Benachrichtigungen' });
  }
});

// POST /notifications/mark-read - Benachrichtigungen als gelesen markieren
router.post('/mark-read', async (req: Request, res: Response) => {
  try {
    const { user_id, notification_ids, mark_all = false } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id ist erforderlich' });
    }

    // Versuche Supabase zu verwenden
    if (supabase) {
      let query = supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user_id);

      if (!mark_all && notification_ids && Array.isArray(notification_ids)) {
        query = query.in('id', notification_ids);
      }

      const { error } = await query;
      if (error) throw error;
      return res.json({ success: true });
    }

    // Fallback: Mock-Daten
    mockNotifications.forEach(notification => {
      if (notification.user_id === user_id) {
        if (mark_all || (notification_ids && notification_ids.includes(notification.id))) {
          notification.is_read = true;
        }
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Markieren als gelesen:', error);
    res.status(500).json({ error: 'Fehler beim Markieren als gelesen' });
  }
});

// POST /notifications/send - Neue Benachrichtigung senden
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { user_id, title, message, type = 'info', category = 'system', action_url, metadata } = req.body;
    
    if (!user_id || !title || !message) {
      return res.status(400).json({ error: 'user_id, title und message sind erforderlich' });
    }

    const newNotification = {
      user_id,
      title,
      message,
      type,
      category,
      is_read: false,
      created_at: new Date().toISOString(),
      action_url,
      metadata
    };

    // Versuche Supabase zu verwenden
    if (supabase) {
      const { data, error } = await supabase
        .from('notifications')
        .insert([newNotification])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    // Fallback: Mock-Daten
    const mockNotification: Notification = {
      id: Date.now().toString(),
      ...newNotification
    };
    mockNotifications.push(mockNotification);
    res.status(201).json(mockNotification);
  } catch (error) {
    console.error('Fehler beim Senden der Benachrichtigung:', error);
    res.status(500).json({ error: 'Fehler beim Senden der Benachrichtigung' });
  }
});

// DELETE /notifications/:id - Benachrichtigung löschen
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id ist erforderlich' });
    }

    // Versuche Supabase zu verwenden
    if (supabase) {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

      if (error) throw error;
      return res.json({ success: true });
    }

    // Fallback: Mock-Daten
    const index = mockNotifications.findIndex(n => n.id === id && n.user_id === user_id);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen der Benachrichtigung:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Benachrichtigung' });
  }
});

// POST /notifications/bulk-send - Mehrere Benachrichtigungen senden
router.post('/bulk-send', async (req: Request, res: Response) => {
  try {
    const { notifications } = req.body;
    
    if (!Array.isArray(notifications)) {
      return res.status(400).json({ error: 'notifications muss ein Array sein' });
    }

    // Versuche Supabase zu verwenden
    if (supabase) {
      const notificationsWithTimestamp = notifications.map(n => ({
        ...n,
        created_at: new Date().toISOString(),
        is_read: false
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationsWithTimestamp)
        .select();

      if (error) throw error;
      return res.status(201).json(data);
    }

    // Fallback: Mock-Daten
    const newNotifications = notifications.map(n => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...n,
      created_at: new Date().toISOString(),
      is_read: false
    }));
    
    mockNotifications.push(...newNotifications);
    res.status(201).json(newNotifications);
  } catch (error) {
    console.error('Fehler beim Massensenden der Benachrichtigungen:', error);
    res.status(500).json({ error: 'Fehler beim Massensenden der Benachrichtigungen' });
  }
});

export default router;
