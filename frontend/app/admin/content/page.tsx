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
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Edit, 
  Delete, 
  Save, 
  X as Cancel,
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
  Folder
} from 'lucide-react';
import Link from 'next/link';
import AnimatedStars from '../../../components/AnimatedStars';

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

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  // Mock-Daten für Content-Items
  const mockContentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Human Design Grundlagen',
      type: 'blog',
      content: 'Eine umfassende Einführung in das Human Design System...',
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
      version: 1
    },
    {
      id: '2',
      title: 'Mondkalender Januar 2024',
      type: 'tutorial',
      content: 'Die wichtigsten Mondphasen und ihre Bedeutung...',
      status: 'published',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-10',
      author: 'Admin',
      tags: ['mondkalender', 'januar', 'mondphasen'],
      category: 'Mondkalender',
      excerpt: 'Alles über die Mondphasen im Januar 2024',
      version: 1
    },
    {
      id: '3',
      title: 'Matching-Algorithmus Erklärung',
      type: 'document',
      content: 'Wie funktioniert unser Matching-System...',
      status: 'review',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-22',
      author: 'Admin',
      tags: ['matching', 'algorithmus', 'technik'],
      category: 'Technik',
      version: 2
    },
    {
      id: '4',
      title: 'Wie funktioniert die Chart-Berechnung?',
      type: 'faq',
      content: 'Die Chart-Berechnung basiert auf deinen Geburtsdaten...',
      status: 'published',
      createdAt: '2024-01-25',
      updatedAt: '2024-01-25',
      author: 'Admin',
      tags: ['faq', 'chart', 'berechnung'],
      category: 'FAQ',
      version: 1
    },
    {
      id: '5',
      title: 'Newsletter Template - Januar 2024',
      type: 'newsletter',
      content: 'Willkommen zu unserem Januar Newsletter...',
      status: 'scheduled',
      createdAt: '2024-01-28',
      updatedAt: '2024-01-28',
      author: 'Admin',
      tags: ['newsletter', 'template', 'januar'],
      category: 'Newsletter',
      publishDate: '2024-02-01T10:00:00Z',
      version: 1
    },
    {
      id: '6',
      title: 'Landing Page - Premium Features',
      type: 'landing-page',
      content: 'Entdecke unsere Premium Features...',
      status: 'draft',
      createdAt: '2024-01-30',
      updatedAt: '2024-01-30',
      author: 'Admin',
      tags: ['landing-page', 'premium', 'features'],
      category: 'Marketing',
      version: 1
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
  };

  const handleSaveContent = (contentData: Partial<ContentItem>) => {
    if (selectedItem) {
      // Bearbeiten
      setContentItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...contentData, updatedAt: new Date().toISOString() }
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
        tags: contentData.tags || []
      };
      setContentItems(prev => [...prev, newItem]);
    }
    setIsEditDialogOpen(false);
    setIsCreateDialogOpen(false);
    setSelectedItem(null);
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
                <FileText size={64} style={{ color: '#FFD700' }} />
                Content-Management
                <FileText size={64} style={{ color: '#FFD700' }} />
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
              Verwalte alle Texte, Stories und Inhalte deiner HD App
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Link href="/admin" style={{ textDecoration: 'none' }}>
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
                  ← Zurück zum Admin
                </Button>
              </Link>
            </Box>
          </Box>
        </motion.div>

        {/* Content Management Interface */}
        <motion.div
          
          
          
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
                <Button
                  variant="outlined"
                  startIcon={<Filter size={20} />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#8B5CF6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)'
                    }
                  }}
                >
                  Filter
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Upload size={20} />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#8B5CF6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)'
                    }
                  }}
                >
                  Import
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download size={20} />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#8B5CF6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)'
                    }
                  }}
                >
                  Export
                </Button>
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
                              {item.category && (
                                <Chip
                                  icon={<Folder size={12} />}
                                  label={item.category}
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {item.publishDate && (
                            <Chip
                              icon={<Calendar size={12} />}
                              label={new Date(item.publishDate).toLocaleDateString('de-DE')}
                              size="small"
                              variant="outlined"
                              sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.3)' }}
                            />
                          )}
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
                        </Box>
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
        maxWidth="md"
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
              <TextField
                label="Content-Typ"
                select
                defaultValue={selectedItem?.type || 'text'}
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
              >
                <option value="text">Text</option>
                <option value="blog">Blog</option>
                <option value="faq">FAQ</option>
                <option value="tutorial">Tutorial</option>
                <option value="template">Template</option>
                <option value="newsletter">Newsletter</option>
                <option value="landing-page">Landing Page</option>
                <option value="document">Dokument</option>
              </TextField>
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
              <TextField
                label="Status"
                select
                defaultValue={selectedItem?.status || 'draft'}
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
              >
                <option value="draft">Entwurf</option>
                <option value="review">Review</option>
                <option value="published">Veröffentlicht</option>
                <option value="scheduled">Geplant</option>
                <option value="archived">Archiviert</option>
              </TextField>
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
            
            <TextField
              label="Content"
              multiline
              rows={6}
              defaultValue={selectedItem?.content || ''}
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

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="SEO Titel"
                defaultValue={selectedItem?.seoTitle || ''}
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
              <TextField
                label="Slug (URL)"
                defaultValue={selectedItem?.slug || ''}
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
            </Box>

            <TextField
              label="SEO Beschreibung"
              multiline
              rows={2}
              defaultValue={selectedItem?.seoDescription || ''}
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
    </Box>
  );
}
