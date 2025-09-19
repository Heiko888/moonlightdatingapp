"use client";
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Edit, 
  Delete, 
  Save, 
  Cancel,
  BookOpen,
  MessageSquare,
  Image,
  Video,
  File,
  Search,
  Filter,
  Upload,
  Download,
  Mail,
  Globe,
  Calendar,
  Clock,
  Eye,
  History,
  Tag,
  Folder,
  Settings,
  Code,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List as ListIcon,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
  Image as ImageIcon,
  Table,
  Minus,
  Plus as PlusIcon,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';
import AnimatedStars from '../../../../components/AnimatedStars';

interface ContentItem {
  id: string;
  title: string;
  type: 'story' | 'text' | 'image' | 'video' | 'document' | 'blog' | 'faq' | 'tutorial' | 'template' | 'newsletter' | 'landing-page';
  content: string;
  status: 'draft' | 'review' | 'published' | 'archived' | 'scheduled';
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  category?: string;
  excerpt?: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
  publishDate?: string;
  version?: number;
  revisions?: ContentRevision[];
  customFields?: Record<string, any>;
  isMarkdown?: boolean;
  template?: string;
  layout?: string;
}

interface ContentRevision {
  id: string;
  version: number;
  content: string;
  title: string;
  author: string;
  createdAt: string;
  changes: string;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  isMarkdown?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, isMarkdown = false }) => {
  const [isPreview, setIsPreview] = useState(false);

  const handleFormat = (format: string) => {
    // Einfache Formatierungslogik
    let newContent = content;
    
    switch (format) {
      case 'bold':
        newContent = `**${content}**`;
        break;
      case 'italic':
        newContent = `*${content}*`;
        break;
      case 'underline':
        newContent = `<u>${content}</u>`;
        break;
      case 'link':
        newContent = `[${content}](url)`;
        break;
      case 'list':
        newContent = `- ${content}`;
        break;
      case 'quote':
        newContent = `> ${content}`;
        break;
    }
    
    onChange(newContent);
  };

  return (
    <Box sx={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box sx={{ 
        p: 1, 
        background: 'rgba(255,255,255,0.05)', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap'
      }}>
        <IconButton size="small" onClick={() => handleFormat('bold')} sx={{ color: 'white' }}>
          <Bold size={16} />
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('italic')} sx={{ color: 'white' }}>
          <Italic size={16} />
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('underline')} sx={{ color: 'white' }}>
          <Underline size={16} />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <IconButton size="small" onClick={() => handleFormat('link')} sx={{ color: 'white' }}>
          <LinkIcon size={16} />
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('list')} sx={{ color: 'white' }}>
          <ListIcon size={16} />
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('quote')} sx={{ color: 'white' }}>
          <Quote size={16} />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <IconButton size="small" onClick={() => handleFormat('image')} sx={{ color: 'white' }}>
          <ImageIcon size={16} />
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('table')} sx={{ color: 'white' }}>
          <Table size={16} />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <Button
          size="small"
          variant={isPreview ? "contained" : "outlined"}
          onClick={() => setIsPreview(!isPreview)}
          sx={{ 
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            '&:hover': { borderColor: '#8B5CF6' }
          }}
        >
          {isPreview ? 'Bearbeiten' : 'Vorschau'}
        </Button>
      </Box>

      {/* Editor/Preview */}
      <Box sx={{ minHeight: 300 }}>
        {isPreview ? (
          <Box sx={{ p: 2, color: 'white' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#8B5CF6' }}>
              Vorschau:
            </Typography>
            <Box sx={{ 
              p: 2, 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: 1,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {isMarkdown ? (
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  {content}
                </pre>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              )}
            </Box>
          </Box>
        ) : (
          <TextField
            multiline
            fullWidth
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isMarkdown ? "Markdown-Text eingeben..." : "HTML-Text eingeben..."}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                minHeight: 300,
                '& fieldset': {
                  border: 'none',
                },
                '& textarea': {
                  fontFamily: isMarkdown ? 'monospace' : 'inherit',
                  fontSize: '14px',
                  lineHeight: 1.6
                }
              }
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default function AdvancedContentPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  // Mock-Daten
  const mockContentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Human Design Grundlagen - Erweitert',
      type: 'blog',
      content: '# Human Design Grundlagen\n\nDas Human Design System ist ein **umfassendes** System...\n\n## Die 4 Typen\n\n- Generator\n- Manifestor\n- Projector\n- Reflector',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      author: 'Admin',
      tags: ['human-design', 'grundlagen', 'einführung'],
      category: 'Human Design',
      excerpt: 'Lerne die Grundlagen des Human Design Systems kennen',
      seoTitle: 'Human Design Grundlagen - Kompletter Guide',
      seoDescription: 'Entdecke die Grundlagen des Human Design Systems',
      slug: 'human-design-grundlagen',
      version: 1,
      isMarkdown: true,
      template: 'blog-post',
      layout: 'sidebar'
    }
  ];

  useEffect(() => {
    setContentItems(mockContentItems);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreateContent = () => {
    setSelectedItem(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditContent = (item: ContentItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContent = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
    setSnackbar({ open: true, message: 'Content erfolgreich gelöscht', severity: 'success' });
  };

  const handleSaveContent = (contentData: Partial<ContentItem>) => {
    if (selectedItem) {
      // Bearbeiten
      setContentItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...contentData, updatedAt: new Date().toISOString(), version: (item.version || 1) + 1 }
          : item
      ));
    } else {
      // Erstellen
      const newItem: ContentItem = {
        id: Date.now().toString(),
        title: contentData.title || '',
        type: contentData.type || 'text',
        content: contentData.content || '',
        status: contentData.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'Admin',
        tags: contentData.tags || [],
        version: 1,
        isMarkdown: contentData.isMarkdown || false
      };
      setContentItems(prev => [...prev, newItem]);
    }
    setIsEditDialogOpen(false);
    setIsCreateDialogOpen(false);
    setSelectedItem(null);
    setSnackbar({ open: true, message: 'Content erfolgreich gespeichert', severity: 'success' });
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return <BookOpen size={20} />;
      case 'text': return <FileText size={20} />;
      case 'image': return <Image size={20} />;
      case 'video': return <Video size={20} />;
      case 'document': return <File size={20} />;
      case 'blog': return <BookOpen size={20} />;
      case 'faq': return <MessageSquare size={20} />;
      case 'tutorial': return <BookOpen size={20} />;
      case 'template': return <File size={20} />;
      case 'newsletter': return <Mail size={20} />;
      case 'landing-page': return <Globe size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'review': return 'info';
      case 'scheduled': return 'secondary';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 8, px: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 215, 0, 0.5)',
                  '0 0 30px rgba(255, 215, 0, 0.8)',
                  '0 0 20px rgba(255, 215, 0, 0.5)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <Code size={64} style={{ color: '#FFD700' }} />
                Advanced CMS
                <Code size={64} style={{ color: '#FFD700' }} />
              </Typography>
            </motion.div>

            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 4,
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.2rem' },
                textAlign: 'center',
                lineHeight: 1.7,
                maxWidth: '800px',
                mx: 'auto',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              Erweiterte Content-Verwaltung mit Rich Text Editor und Markdown-Unterstützung
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Link href="/admin/content" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
                    }
                  }}
                >
                  ← Standard CMS
                </Button>
              </Link>
            </Box>
          </Box>
        </motion.div>

        {/* Advanced Content Management Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Content durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8B5CF6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    }
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Typ</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#8B5CF6',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255,255,255,0.7)',
                      }
                    }}
                  >
                    <MenuItem value="all">Alle Typen</MenuItem>
                    <MenuItem value="blog">Blog</MenuItem>
                    <MenuItem value="faq">FAQ</MenuItem>
                    <MenuItem value="tutorial">Tutorial</MenuItem>
                    <MenuItem value="template">Template</MenuItem>
                    <MenuItem value="newsletter">Newsletter</MenuItem>
                    <MenuItem value="landing-page">Landing Page</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={handleCreateContent}
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
                    }
                  }}
                >
                  Neuer Content
                </Button>
              </Box>
            </Box>

            {/* Content List */}
            <Grid container spacing={3}>
              {filteredContent.map((item, index) => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(139, 92, 246, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                              color: 'white',
                              mr: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {getTypeIcon(item.type)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                              {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                              <Chip
                                label={item.status}
                                size="small"
                                color={getStatusColor(item.status) as any}
                              />
                              {item.isMarkdown && (
                                <Chip
                                  icon={<Code size={12} />}
                                  label="Markdown"
                                  size="small"
                                  variant="outlined"
                                  sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.3)' }}
                                />
                              )}
                              {item.version && (
                                <Chip
                                  icon={<History size={12} />}
                                  label={`v${item.version}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.3)' }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                        
                        {item.excerpt && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              mb: 2,
                              fontStyle: 'italic',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {item.excerpt}
                          </Typography>
                        )}
                        
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {item.content}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {item.tags.map((tag, tagIndex) => (
                            <Chip
                              key={tagIndex}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                fontSize: '0.75rem'
                              }}
                            />
                          ))}
                        </Box>
                        
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Erstellt: {new Date(item.createdAt).toLocaleDateString('de-DE')}
                        </Typography>
                      </CardContent>
                      
                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditContent(item)}
                            sx={{ color: '#8B5CF6' }}
                            title="Bearbeiten"
                          >
                            <Edit size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: '#10B981' }}
                            title="Versionen anzeigen"
                          >
                            <History size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: '#F59E0B' }}
                            title="Vorschau"
                          >
                            <Eye size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteContent(item.id)}
                            sx={{ color: '#ef4444' }}
                            title="Löschen"
                          >
                            <Delete size={16} />
                          </IconButton>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: '#8B5CF6',
                              backgroundColor: 'rgba(139, 92, 246, 0.1)'
                            }
                          }}
                        >
                          Ansehen
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {filteredContent.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  Keine Inhalte gefunden
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Erstelle deinen ersten Content oder passe deine Suchkriterien an
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedItem(null);
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 4
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          {selectedItem ? 'Content bearbeiten' : 'Neuen Content erstellen'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Titel"
                defaultValue={selectedItem?.title || ''}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B5CF6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                  }
                }}
              />
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Content-Typ</InputLabel>
                <Select
                  defaultValue={selectedItem?.type || 'text'}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#8B5CF6',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(255,255,255,0.7)',
                    }
                  }}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="blog">Blog</MenuItem>
                  <MenuItem value="faq">FAQ</MenuItem>
                  <MenuItem value="tutorial">Tutorial</MenuItem>
                  <MenuItem value="template">Template</MenuItem>
                  <MenuItem value="newsletter">Newsletter</MenuItem>
                  <MenuItem value="landing-page">Landing Page</MenuItem>
                  <MenuItem value="document">Dokument</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Kategorie"
                defaultValue={selectedItem?.category || ''}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B5CF6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                  }
                }}
              />
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Status</InputLabel>
                <Select
                  defaultValue={selectedItem?.status || 'draft'}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#8B5CF6',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(255,255,255,0.7)',
                    }
                  }}
                >
                  <MenuItem value="draft">Entwurf</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="published">Veröffentlicht</MenuItem>
                  <MenuItem value="scheduled">Geplant</MenuItem>
                  <MenuItem value="archived">Archiviert</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Excerpt (Kurzbeschreibung)"
              multiline
              rows={2}
              defaultValue={selectedItem?.excerpt || ''}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8B5CF6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                }
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked={selectedItem?.isMarkdown || false}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#8B5CF6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#8B5CF6',
                      },
                    }}
                  />
                }
                label="Markdown verwenden"
                sx={{ color: 'white' }}
              />
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Content Editor
              </Typography>
              <RichTextEditor
                content={selectedItem?.content || ''}
                onChange={(content) => {
                  // Handle content change
                }}
                isMarkdown={selectedItem?.isMarkdown || false}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
              setSelectedItem(null);
            }}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Abbrechen
          </Button>
          <Button
            variant="contained"
            startIcon={<Save size={20} />}
            onClick={() => handleSaveContent({})}
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)'
              }
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
