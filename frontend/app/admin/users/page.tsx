"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Alert
} from '@mui/material';
import { 
  Users, 
  Edit, 
  Trash2, 
  Search, 
  Shield,
  BarChart3,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

import AnimatedStars from '../../../components/AnimatedStars';

// User Interface
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  joinDate: string;
  lastLogin: string;
  chartsCreated: number;
  readingsGenerated: number;
}

// Mock-Daten für Benutzer
const mockUsers: User[] = [
  {
    id: 1,
    username: 'sarah.mueller',
    email: 'sarah.mueller@example.com',
    firstName: 'Sarah',
    lastName: 'Müller',
    role: 'user',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20',
    chartsCreated: 3,
    readingsGenerated: 5
  },
  {
    id: 2,
    username: 'michael.schmidt',
    email: 'michael.schmidt@example.com',
    firstName: 'Michael',
    lastName: 'Schmidt',
    role: 'premium',
    status: 'active',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-19',
    chartsCreated: 8,
    readingsGenerated: 12
  },
  {
    id: 3,
    username: 'lisa.weber',
    email: 'lisa.weber@example.com',
    firstName: 'Lisa',
    lastName: 'Weber',
    role: 'user',
    status: 'inactive',
    joinDate: '2024-01-05',
    lastLogin: '2024-01-12',
    chartsCreated: 1,
    readingsGenerated: 2
  },
  {
    id: 4,
    username: 'admin',
    email: 'admin@moonlight.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-20',
    chartsCreated: 0,
    readingsGenerated: 0
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    status: 'active'
  });

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const saveEdit = () => {
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...editForm }
          : user
      ));
      setMessage('Benutzer erfolgreich aktualisiert!');
      setEditDialogOpen(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setMessage('Benutzer erfolgreich gelöscht!');
      setDeleteDialogOpen(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'premium': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'premium': return 'Premium';
      default: return 'Benutzer';
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
                <Users size={64} style={{ color: '#FFD700' }} />
                Benutzerverwaltung
                <Users size={64} style={{ color: '#FFD700' }} />
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
              Verwalte alle Benutzer, Rollen und Berechtigungen deiner HD App
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

        {/* Message Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          </motion.div>
        )}

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.08)', 
            backdropFilter: 'blur(10px)',
            borderRadius: 4, 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            mb: 4
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 300 }}>
                  <Search size={20} style={{ color: '#667eea' }} />
                  <TextField
                    placeholder="Benutzer suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '& fieldset': {
                          borderColor: 'rgba(102, 126, 234, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(102, 126, 234, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip 
                    label={`${filteredUsers.length} Benutzer`}
                    icon={<Users size={16} />}
                    sx={{ 
                      bgcolor: 'rgba(102, 126, 234, 0.1)', 
                      color: '#667eea',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)',
            borderRadius: 4, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            overflow: 'hidden'
          }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(102, 126, 234, 0.1)' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#4a5568' }}>Benutzer</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#4a5568' }}>Rolle</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#4a5568' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#4a5568' }}>Beitritt</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#4a5568' }}>Letzter Login</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#4a5568' }}>Aktivität</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#4a5568' }}>Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.05)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: 'linear-gradient(135deg, #667eea, #764ba2)',
                            width: 40,
                            height: 40,
                            fontWeight: 700
                          }}>
                            {user.firstName[0]}{user.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#4a5568' }}>
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#718096' }}>
                              {user.email}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                              @{user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getRoleLabel(user.role)}
                          color={getRoleColor(user.role) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                          size="small"
                          icon={user.role === 'admin' ? <Shield size={14} /> : undefined}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                          color={getStatusColor(user.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>
                          {new Date(user.joinDate).toLocaleDateString('de-DE')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>
                          {new Date(user.lastLogin).toLocaleDateString('de-DE')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BarChart3 size={14} style={{ color: '#667eea' }} />
                            <Typography variant="caption" sx={{ color: '#718096' }}>
                              {user.chartsCreated} Charts
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BookOpen size={14} style={{ color: '#667eea' }} />
                            <Typography variant="caption" sx={{ color: '#718096' }}>
                              {user.readingsGenerated} Readings
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(user)}
                            sx={{ 
                              color: '#667eea',
                              '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
                            }}
                          >
                            <Edit size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(user)}
                            sx={{ 
                              color: '#e53e3e',
                              '&:hover': { backgroundColor: 'rgba(229, 62, 62, 0.1)' }
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </motion.div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            fontWeight: 700
          }}>
            Benutzer bearbeiten
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Vorname"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                fullWidth
              />
              <TextField
                label="Nachname"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                fullWidth
              />
              <TextField
                label="E-Mail"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                fullWidth
              />
              <TextField
                select
                label="Rolle"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="user">Benutzer</option>
                <option value="premium">Premium</option>
                <option value="admin">Administrator</option>
              </TextField>
              <TextField
                select
                label="Status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="active">Aktiv</option>
                <option value="inactive">Inaktiv</option>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={saveEdit}
              variant="contained"
              sx={{
                bgcolor: '#667eea',
                '&:hover': { bgcolor: '#5a67d8' }
              }}
            >
              Speichern
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #e53e3e, #c53030)',
            color: '#fff',
            fontWeight: 700
          }}>
            Benutzer löschen
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography>
              Sind Sie sicher, dass Sie den Benutzer &quot;{selectedUser?.firstName} {selectedUser?.lastName}&quot; löschen möchten?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={confirmDelete}
              variant="contained"
              sx={{
                bgcolor: '#e53e3e',
                '&:hover': { bgcolor: '#c53030' }
              }}
            >
              Löschen
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
