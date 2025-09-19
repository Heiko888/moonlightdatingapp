import Admin from './models/admin'; // Importiere das Admin-Model

/**
 * Erstellt einen neuen Admin-Benutzer.
 * @param username - Der Benutzername des Admins.
 * @param password - Das Passwort des Admins.
 */
async function createAdmin(username: string, password: string) {
  try {
    // Überprüfen, ob der Admin bereits existiert
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`Admin mit Benutzername "${username}" existiert bereits.`);
      return;
    }

    // Neuen Admin erstellen
    const admin = new Admin({ username, password });
    await admin.save();
    console.log('Admin erfolgreich erstellt:', admin);
  } catch (err) {
    console.error('Fehler beim Erstellen des Admins:', err);
  }
}

// Beispielaufruf
createAdmin('admin', 'securepassword').catch(console.error);
