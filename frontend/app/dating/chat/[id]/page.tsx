"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import { 
  Send, 
  ArrowLeft, 
  Heart, 
  Star, 
  MessageCircle, 
  Phone, 
  Video,
  MoreVertical,
  Smile,
  Image as ImageIcon,
  Paperclip
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: Date;
  type: 'text' | 'image' | 'emoji';
}

interface ChatUser {
  id: string;
  name: string;
  age: number;
  image: string;
  hd_type: string;
  profile: string;
  isOnline: boolean;
  lastSeen: string;
}

export default function DatingChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock User Data
  const mockUser: ChatUser = {
    id: chatId,
    name: 'Sarah',
    age: 28,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    hd_type: 'Manifestor',
    profile: '2/4',
    isOnline: true,
    lastSeen: 'vor 2 Minuten'
  };

  // Mock Messages
  const mockMessages: Message[] = [
    {
      id: '1',
      text: 'Hey! Wie geht es dir heute? 😊',
      sender: 'them',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: '2',
      text: 'Hallo! Mir geht es super, danke! Und dir?',
      sender: 'me',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
      type: 'text'
    },
    {
      id: '3',
      text: 'Auch gut! Ich habe gesehen, dass du auch Manifestor bist - das ist cool! 🌟',
      sender: 'them',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: '4',
      text: 'Ja, das stimmt! Ich finde es spannend, wie sich unsere Energien ergänzen.',
      sender: 'me',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 3 * 60 * 1000),
      type: 'text'
    },
    {
      id: '5',
      text: 'Sollten wir uns mal treffen? Ich würde gerne mehr über dein Human Design erfahren! 💫',
      sender: 'them',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setUser(mockUser);
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, [chatId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Das klingt interessant! Erzähl mir mehr darüber 😊',
        sender: 'them',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ 
            color: 'white',
            background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            💬 Lade Chat...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Card sx={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 2,
          mb: 2,
          mt: 2
        }}>
          <CardContent sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton 
                onClick={() => router.back()}
                sx={{ color: '#ff6b9d' }}
              >
                <ArrowLeft size={24} />
              </IconButton>
              
              <Avatar 
                src={user?.image} 
                sx={{ width: 50, height: 50, border: '2px solid #ff6b9d' }}
              />
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {user?.name}, {user?.age}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip 
                    label={user?.hd_type} 
                    size="small" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #ff6b9d, #c44569)', 
                      color: 'white',
                      fontSize: '0.7rem'
                    }} 
                  />
                  <Chip 
                    label={user?.profile} 
                    size="small" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #4ecdc4, #3a9d94)', 
                      color: 'white',
                      fontSize: '0.7rem'
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: user?.isOnline ? '#4ecdc4' : 'rgba(255,255,255,0.6)' }}>
                    {user?.isOnline ? 'Online' : user?.lastSeen}
                  </Typography>
                </Stack>
              </Box>
              
              <Stack direction="row" spacing={1}>
                <IconButton sx={{ color: '#ff6b9d' }}>
                  <Phone size={20} />
                </IconButton>
                <IconButton sx={{ color: '#ff6b9d' }}>
                  <Video size={20} />
                </IconButton>
                <IconButton sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  <MoreVertical size={20} />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Messages */}
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,107,157,0.5)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,107,157,0.7)',
          }
        }}>
          <Stack spacing={2}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1
                }}
              >
                {message.sender === 'them' && (
                  <Avatar 
                    src={user?.image} 
                    sx={{ width: 32, height: 32, border: '1px solid #ff6b9d' }}
                  />
                )}
                
                <Paper
                  sx={{
                    maxWidth: '70%',
                    p: 2,
                    borderRadius: 3,
                    background: message.sender === 'me' 
                      ? 'linear-gradient(135deg, #ff6b9d, #c44569)'
                      : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: message.sender === 'me' 
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    {message.text}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    opacity: 0.7,
                    fontSize: '0.7rem'
                  }}>
                    {message.timestamp.toLocaleTimeString('de-DE', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Typography>
                </Paper>
                
                {message.sender === 'me' && (
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                      border: '1px solid #ff6b9d'
                    }}
                  >
                    <Heart size={16} />
                  </Avatar>
                )}
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Message Input */}
        <Card sx={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 2,
          mb: 2
        }}>
          <CardContent sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <IconButton sx={{ color: '#ff6b9d' }}>
                <Paperclip size={20} />
              </IconButton>
              <IconButton sx={{ color: '#ff6b9d' }}>
                <ImageIcon size={20} />
              </IconButton>
              <IconButton sx={{ color: '#ff6b9d' }}>
                <Smile size={20} />
              </IconButton>
              
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Nachricht schreiben..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: 3,
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff6b9d',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4ecdc4',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.6)',
                  },
                }}
              />
              
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  color: 'white',
                  minWidth: 'auto',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.4)'
                  }
                }}
              >
                <Send size={20} />
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
