import { supabase } from './src/lib/supabase';
import bcrypt from 'bcrypt';

async function seedAdmin() {
  try {
    console.log('🌱 Erstelle Admin-Account...');

    const adminData = {
      username: 'admin',
      email: 'admin@hdapp.com',
      password_hash: await bcrypt.hash('admin123', 12),
      role: 'admin'
    };

    // Prüfen ob Admin bereits existiert
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('*')
      .eq('username', adminData.username)
      .single();

    if (existingAdmin) {
      console.log('✅ Admin-Account existiert bereits');
      return;
    }

    // Admin erstellen
    const { data: admin, error } = await supabase
      .from('admins')
      .insert([adminData])
      .select()
      .single();

    if (error) {
      console.error('❌ Fehler beim Erstellen des Admin-Accounts:', error);
      return;
    }

    console.log('✅ Admin-Account erfolgreich erstellt!');
    console.log('📧 E-Mail:', adminData.email);
    console.log('👤 Benutzername:', adminData.username);
    console.log('🔑 Passwort: admin123');
    console.log('⚠️  Bitte ändere das Passwort nach dem ersten Login!');

  } catch (error) {
    console.error('❌ Fehler:', error);
  }
}

seedAdmin();
