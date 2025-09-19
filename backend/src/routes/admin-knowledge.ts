import express from 'express';
import fs from 'fs';
import path from 'path';
import { supabase } from '../lib/supabase';

const router = express.Router();

// Knowledge-Dateien Ordner
const knowledgePath = path.join(__dirname, '../../data/knowledge');

// Stelle sicher, dass der Knowledge-Ordner existiert
if (!fs.existsSync(knowledgePath)) {
  fs.mkdirSync(knowledgePath, { recursive: true });
}

// GET /admin/knowledge - Alle Knowledge-Einträge abrufen
router.get('/', async (req, res) => {
  try {
    // Aus Supabase laden
    const { data: dbEntries, error: dbError } = await supabase
      .from('knowledge_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('[KNOWLEDGE] Database error:', dbError);
      return res.status(500).json({ error: 'Database error' });
    }

    // Markdown-Dateien aus dem knowledge-Ordner laden
    const mdFiles: any[] = [];
    if (fs.existsSync(knowledgePath)) {
      const files = fs.readdirSync(knowledgePath);
      for (const file of files) {
        if (file.endsWith('.md') || file.endsWith('.json') || file.endsWith('.txt')) {
          const filePath = path.join(knowledgePath, file);
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf8');
          
          mdFiles.push({
            _id: `file_${file}`,
            title: file.replace(/\.(md|json|txt)$/, ''),
            content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
            module: 'Human Design',
            category: getCategoryFromFilename(file),
            tags: getTagsFromFilename(file),
            fileUrl: `/admin/knowledge/files/${file}`,
            fileName: file,
            fileSize: stats.size,
            createdAt: stats.birthtime,
            updatedAt: stats.mtime,
            type: 'file'
          });
        }
      }
    }

    // Kombiniere Datenbank-Einträge und Dateien
    const allEntries = [
      ...(dbEntries || []).map(entry => ({ ...entry, type: 'database' })),
      ...mdFiles
    ];

    res.json(allEntries);
  } catch (error) {
    console.error('[KNOWLEDGE] Error fetching entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /admin/knowledge/files/:filename - Markdown-Datei abrufen
router.get('/files/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(knowledgePath, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ 
      filename, 
      content,
      size: fs.statSync(filePath).size,
      lastModified: fs.statSync(filePath).mtime
    });
  } catch (error) {
    console.error('[KNOWLEDGE] Error reading file:', error);
    res.status(500).json({ error: 'Error reading file' });
  }
});

// POST /admin/knowledge - Neuen Knowledge-Eintrag erstellen
router.post('/', async (req, res) => {
  try {
    const { title, content, module, category, tags, fileName, saveAsFile } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Als Datei speichern
    if (saveAsFile || fileName) {
      const filename = fileName || `${title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
      const filePath = path.join(knowledgePath, filename);
      
      fs.writeFileSync(filePath, content, 'utf8');
      
      res.json({
        _id: `file_${filename}`,
        title,
        content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        module: module || 'Human Design',
        category: category || 'General',
        tags: tags || [],
        fileUrl: `/admin/knowledge/files/${filename}`,
        fileName: filename,
        type: 'file',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // In Datenbank speichern
      const { data, error } = await supabase
        .from('knowledge_items')
        .insert([{
          title,
          content,
          module: module || 'Human Design',
          category: category || 'General',
          tags: tags || []
        }])
        .select()
        .single();

      if (error) {
        console.error('[KNOWLEDGE] Database error:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ ...data, type: 'database' });
    }
  } catch (error) {
    console.error('[KNOWLEDGE] Error creating entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /admin/knowledge/:id - Knowledge-Eintrag aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, module, category, tags } = req.body;

    if (id.startsWith('file_')) {
      // Datei aktualisieren
      const filename = id.replace('file_', '');
      const filePath = path.join(knowledgePath, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      fs.writeFileSync(filePath, content, 'utf8');
      
      res.json({
        _id: id,
        title,
        content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        module: module || 'Human Design',
        category: category || 'General',
        tags: tags || [],
        fileUrl: `/admin/knowledge/files/${filename}`,
        fileName: filename,
        type: 'file',
        updatedAt: new Date()
      });
    } else {
      // Datenbank-Eintrag aktualisieren
      const { data, error } = await supabase
        .from('knowledge_items')
        .update({
          title,
          content,
          module,
          category,
          tags,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[KNOWLEDGE] Database error:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ ...data, type: 'database' });
    }
  } catch (error) {
    console.error('[KNOWLEDGE] Error updating entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /admin/knowledge/:id - Knowledge-Eintrag löschen
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (id.startsWith('file_')) {
      // Datei löschen
      const filename = id.replace('file_', '');
      const filePath = path.join(knowledgePath, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      // Datenbank-Eintrag löschen
      const { error } = await supabase
        .from('knowledge_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[KNOWLEDGE] Database error:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: 'Entry deleted successfully' });
    }
  } catch (error) {
    console.error('[KNOWLEDGE] Error deleting entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Hilfsfunktionen
function getCategoryFromFilename(filename: string): string {
  if (filename.includes('gate')) return 'Gates';
  if (filename.includes('channel')) return 'Channels';
  if (filename.includes('center')) return 'Centers';
  if (filename.includes('type')) return 'Types';
  if (filename.includes('profile')) return 'Profiles';
  if (filename.includes('reflection')) return 'Reflection Questions';
  if (filename.includes('reading')) return 'Readings';
  return 'General';
}

function getTagsFromFilename(filename: string): string[] {
  const tags: string[] = [];
  if (filename.includes('gate')) tags.push('gates');
  if (filename.includes('channel')) tags.push('channels');
  if (filename.includes('center')) tags.push('centers');
  if (filename.includes('type')) tags.push('types');
  if (filename.includes('profile')) tags.push('profiles');
  if (filename.includes('reflection')) tags.push('reflection');
  if (filename.includes('reading')) tags.push('readings');
  return tags;
}

export default router;
