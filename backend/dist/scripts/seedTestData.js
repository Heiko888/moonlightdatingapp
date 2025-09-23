"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTestData = seedTestData;
const localDb_1 = require("../lib/localDb");
// Test-Daten für das Swipe & Matching System
const testUsers = [
    {
        username: 'sarah_generator',
        email: 'sarah@example.com',
        password_hash: 'hashed_password_123',
        name: 'Sarah',
        birthdate: '1995-03-15',
        birthplace: 'Berlin, Deutschland',
        location: 'Berlin',
        bio: 'Generator mit viel Lebensenergie. Liebe es, Menschen zu inspirieren und gemeinsam zu wachsen. Suche nach echten Verbindungen.',
        age: 29,
        hd_type: 'Generator',
        profile: '5/1',
        authority: 'Sacral',
        strategy: 'Warten und auf die innere Autorität hören',
        centers: {
            sacral: { defined: true, gates: [10, 20] },
            solar_plexus: { defined: true, gates: [34, 57] },
            root: { defined: true, gates: [58, 38] },
            spleen: { defined: false },
            heart: { defined: false },
            throat: { defined: false },
            ajna: { defined: false },
            g_center: { defined: false }
        },
        channels: {
            '10-20': { defined: true, gates: [10, 20] },
            '34-57': { defined: true, gates: [34, 57] },
            '58-38': { defined: true, gates: [58, 38] }
        },
        gates: {
            10: { defined: true, planet: 'Earth' },
            20: { defined: true, planet: 'Sun' },
            34: { defined: true, planet: 'Moon' },
            57: { defined: true, planet: 'Mercury' },
            58: { defined: true, planet: 'Venus' },
            38: { defined: true, planet: 'Mars' }
        },
        planets: {
            sun: { gate: 20, line: 1 },
            earth: { gate: 10, line: 5 },
            moon: { gate: 34, line: 2 },
            mercury: { gate: 57, line: 3 },
            venus: { gate: 58, line: 4 },
            mars: { gate: 38, line: 6 }
        },
        chart_data: {
            type: 'Generator',
            profile: '5/1',
            authority: 'Sacral',
            strategy: 'Warten und auf die innere Autorität hören',
            defined_centers: ['Sacral', 'Solar Plexus', 'Root'],
            open_centers: ['Spleen', 'Heart', 'Throat', 'Ajna', 'G-Center']
        },
        images: ['/api/placeholder/400/600', '/api/placeholder/400/600'],
        interests: ['Yoga', 'Kochen', 'Reisen', 'Human Design', 'Meditation'],
        avatar: '/api/placeholder/100/100'
    },
    {
        username: 'marcus_projector',
        email: 'marcus@example.com',
        password_hash: 'hashed_password_456',
        name: 'Marcus',
        birthdate: '1990-07-22',
        birthplace: 'München, Deutschland',
        location: 'München',
        bio: 'Projector, der gerne andere führt und inspiriert. Suche nach echten Verbindungen und Menschen, die meine Weisheit schätzen.',
        age: 34,
        hd_type: 'Projector',
        profile: '3/5',
        authority: 'Spleen',
        strategy: 'Warten auf Einladung',
        centers: {
            spleen: { defined: true, gates: [20, 34] },
            throat: { defined: true, gates: [20, 34] },
            sacral: { defined: false },
            solar_plexus: { defined: false },
            root: { defined: false },
            heart: { defined: false },
            ajna: { defined: false },
            g_center: { defined: false }
        },
        channels: {
            '20-34': { defined: true, gates: [20, 34] }
        },
        gates: {
            20: { defined: true, planet: 'Sun' },
            34: { defined: true, planet: 'Moon' }
        },
        planets: {
            sun: { gate: 20, line: 3 },
            earth: { gate: 20, line: 3 },
            moon: { gate: 34, line: 5 },
            mercury: { gate: 20, line: 3 },
            venus: { gate: 34, line: 5 },
            mars: { gate: 20, line: 3 }
        },
        chart_data: {
            type: 'Projector',
            profile: '3/5',
            authority: 'Spleen',
            strategy: 'Warten auf Einladung',
            defined_centers: ['Spleen', 'Throat'],
            open_centers: ['Sacral', 'Solar Plexus', 'Root', 'Heart', 'Ajna', 'G-Center']
        },
        images: ['/api/placeholder/400/600'],
        interests: ['Führung', 'Coaching', 'Musik', 'Philosophie', 'Mentoring'],
        avatar: '/api/placeholder/100/100'
    },
    {
        username: 'lisa_mg',
        email: 'lisa@example.com',
        password_hash: 'hashed_password_789',
        name: 'Lisa',
        birthdate: '1998-11-08',
        birthplace: 'Hamburg, Deutschland',
        location: 'Hamburg',
        bio: 'Manifesting Generator mit kreativer Energie. Liebe es, neue Projekte zu starten und Menschen zu inspirieren. Suche nach dynamischen Verbindungen.',
        age: 25,
        hd_type: 'Manifesting Generator',
        profile: '2/4',
        authority: 'Sacral',
        strategy: 'Informieren und dann handeln',
        centers: {
            sacral: { defined: true, gates: [10, 20] },
            throat: { defined: true, gates: [20, 34] },
            g_center: { defined: true, gates: [10, 20] },
            solar_plexus: { defined: false },
            root: { defined: false },
            spleen: { defined: false },
            heart: { defined: false },
            ajna: { defined: false }
        },
        channels: {
            '10-20': { defined: true, gates: [10, 20] },
            '20-34': { defined: true, gates: [20, 34] }
        },
        gates: {
            10: { defined: true, planet: 'Earth' },
            20: { defined: true, planet: 'Sun' },
            34: { defined: true, planet: 'Moon' }
        },
        planets: {
            sun: { gate: 20, line: 2 },
            earth: { gate: 10, line: 4 },
            moon: { gate: 34, line: 2 },
            mercury: { gate: 20, line: 2 },
            venus: { gate: 10, line: 4 },
            mars: { gate: 34, line: 2 }
        },
        chart_data: {
            type: 'Manifesting Generator',
            profile: '2/4',
            authority: 'Sacral',
            strategy: 'Informieren und dann handeln',
            defined_centers: ['Sacral', 'Throat', 'G-Center'],
            open_centers: ['Solar Plexus', 'Root', 'Spleen', 'Heart', 'Ajna']
        },
        images: ['/api/placeholder/400/600', '/api/placeholder/400/600', '/api/placeholder/400/600'],
        interests: ['Kunst', 'Design', 'Startups', 'Meditation', 'Kreativität'],
        avatar: '/api/placeholder/100/100'
    },
    {
        username: 'alex_manifestor',
        email: 'alex@example.com',
        password_hash: 'hashed_password_101',
        name: 'Alex',
        birthdate: '1992-05-12',
        birthplace: 'Köln, Deutschland',
        location: 'Köln',
        bio: 'Manifestor mit starker Initiative. Ich bringe Dinge ins Rollen und suche nach Menschen, die meine Unabhängigkeit respektieren.',
        age: 32,
        hd_type: 'Manifestor',
        profile: '4/6',
        authority: 'Spleen',
        strategy: 'Informieren und dann handeln',
        centers: {
            spleen: { defined: true, gates: [20, 34] },
            throat: { defined: true, gates: [20, 34] },
            sacral: { defined: false },
            solar_plexus: { defined: false },
            root: { defined: false },
            heart: { defined: false },
            ajna: { defined: false },
            g_center: { defined: false }
        },
        channels: {
            '20-34': { defined: true, gates: [20, 34] }
        },
        gates: {
            20: { defined: true, planet: 'Sun' },
            34: { defined: true, planet: 'Moon' }
        },
        planets: {
            sun: { gate: 20, line: 4 },
            earth: { gate: 20, line: 4 },
            moon: { gate: 34, line: 6 },
            mercury: { gate: 20, line: 4 },
            venus: { gate: 34, line: 6 },
            mars: { gate: 20, line: 4 }
        },
        chart_data: {
            type: 'Manifestor',
            profile: '4/6',
            authority: 'Spleen',
            strategy: 'Informieren und dann handeln',
            defined_centers: ['Spleen', 'Throat'],
            open_centers: ['Sacral', 'Solar Plexus', 'Root', 'Heart', 'Ajna', 'G-Center']
        },
        images: ['/api/placeholder/400/600', '/api/placeholder/400/600'],
        interests: ['Führung', 'Innovation', 'Sport', 'Abenteuer', 'Unabhängigkeit'],
        avatar: '/api/placeholder/100/100'
    },
    {
        username: 'maya_reflector',
        email: 'maya@example.com',
        password_hash: 'hashed_password_202',
        name: 'Maya',
        birthdate: '1996-09-30',
        birthplace: 'Stuttgart, Deutschland',
        location: 'Stuttgart',
        bio: 'Reflector mit sensibler Natur. Ich spiegle die Energie meiner Umgebung und suche nach Menschen, die mir Raum geben, ich selbst zu sein.',
        age: 27,
        hd_type: 'Reflector',
        profile: '1/3',
        authority: 'Lunar',
        strategy: 'Warten auf einen Mondzyklus',
        centers: {
            sacral: { defined: false },
            solar_plexus: { defined: false },
            root: { defined: false },
            spleen: { defined: false },
            heart: { defined: false },
            throat: { defined: false },
            ajna: { defined: false },
            g_center: { defined: false }
        },
        channels: {},
        gates: {},
        planets: {
            sun: { gate: 20, line: 1 },
            earth: { gate: 20, line: 1 },
            moon: { gate: 34, line: 3 },
            mercury: { gate: 20, line: 1 },
            venus: { gate: 34, line: 3 },
            mars: { gate: 20, line: 1 }
        },
        chart_data: {
            type: 'Reflector',
            profile: '1/3',
            authority: 'Lunar',
            strategy: 'Warten auf einen Mondzyklus',
            defined_centers: [],
            open_centers: ['Sacral', 'Solar Plexus', 'Root', 'Spleen', 'Heart', 'Throat', 'Ajna', 'G-Center']
        },
        images: ['/api/placeholder/400/600'],
        interests: ['Spiritualität', 'Heilung', 'Natur', 'Sensibilität', 'Reflexion'],
        avatar: '/api/placeholder/100/100'
    }
];
// Test-Daten in die Datenbank einfügen
async function seedTestData() {
    console.log('🌱 Starte Test-Daten Seeding...');
    try {
        // Initialisiere die Datenbank
        console.log('🗄️ Initialisiere Datenbank...');
        (0, localDb_1.initLocalDatabase)();
        if (!localDb.db) {
            throw new Error('Datenbank nicht verfügbar');
        }
        // Lösche die alte Tabelle und erstelle sie neu
        console.log('🔄 Erstelle neue Tabellen-Struktur...');
        try {
            localDb.db.exec('DROP TABLE IF EXISTS users');
        }
        catch (e) {
            console.log('Tabelle users existiert nicht');
        }
        try {
            localDb.db.exec('DROP TABLE IF EXISTS swipes');
        }
        catch (e) {
            console.log('Tabelle swipes existiert nicht');
        }
        try {
            localDb.db.exec('DROP TABLE IF EXISTS matches');
        }
        catch (e) {
            console.log('Tabelle matches existiert nicht');
        }
        try {
            localDb.db.exec('DROP TABLE IF EXISTS compatibility_analysis');
        }
        catch (e) {
            console.log('Tabelle compatibility_analysis existiert nicht');
        }
        try {
            localDb.db.exec('DROP TABLE IF EXISTS match_feedback');
        }
        catch (e) {
            console.log('Tabelle match_feedback existiert nicht');
        }
        // Erstelle die Tabellen neu
        localDb.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        birthdate TEXT,
        birthplace TEXT,
        location TEXT,
        bio TEXT,
        age INTEGER,
        hd_type TEXT,
        profile TEXT,
        authority TEXT,
        strategy TEXT,
        centers TEXT,
        channels TEXT,
        gates TEXT,
        planets TEXT,
        chart_data TEXT,
        images TEXT,
        interests TEXT,
        avatar TEXT,
        is_active BOOLEAN DEFAULT 1,
        last_active TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
        localDb.db.exec(`
      CREATE TABLE IF NOT EXISTS swipes (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        target_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        liked BOOLEAN NOT NULL,
        is_super_like BOOLEAN DEFAULT 0,
        compatibility_score INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
        localDb.db.exec(`
      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        user_a TEXT REFERENCES users(id) ON DELETE CASCADE,
        user_b TEXT REFERENCES users(id) ON DELETE CASCADE,
        compatibility_score INTEGER DEFAULT 0,
        relationship_type TEXT DEFAULT 'romantic',
        is_active BOOLEAN DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
        localDb.db.exec(`
      CREATE TABLE IF NOT EXISTS compatibility_analysis (
        id TEXT PRIMARY KEY,
        user_a TEXT REFERENCES users(id) ON DELETE CASCADE,
        user_b TEXT REFERENCES users(id) ON DELETE CASCADE,
        overall_score INTEGER NOT NULL,
        breakdown TEXT NOT NULL,
        strengths TEXT,
        challenges TEXT,
        recommendations TEXT,
        detailed_analysis TEXT,
        relationship_type TEXT DEFAULT 'romantic',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
        localDb.db.exec(`
      CREATE TABLE IF NOT EXISTS match_feedback (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        target_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        match_id TEXT REFERENCES matches(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        feedback TEXT,
        categories TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Lösche vorhandene Test-Daten
        console.log('🗑️ Lösche vorhandene Test-Daten...');
        localDb.db?.exec('DELETE FROM swipes WHERE user_id IN (SELECT id FROM users WHERE email LIKE \'%@example.com\')');
        localDb.db?.exec('DELETE FROM matches WHERE user_a IN (SELECT id FROM users WHERE email LIKE \'%@example.com\') OR user_b IN (SELECT id FROM users WHERE email LIKE \'%@example.com\')');
        localDb.db?.exec('DELETE FROM compatibility_analysis WHERE user_a IN (SELECT id FROM users WHERE email LIKE \'%@example.com\') OR user_b IN (SELECT id FROM users WHERE email LIKE \'%@example.com\')');
        localDb.db?.exec('DELETE FROM users WHERE email LIKE \'%@example.com\'');
        // Füge Test-Benutzer hinzu
        console.log('👥 Erstelle Test-Benutzer...');
        for (const userData of testUsers) {
            const stmt = localDb.db.prepare(`
        INSERT INTO users (id, username, email, password_hash, name, birthdate, birthplace, location, bio, age, hd_type, profile, authority, strategy, centers, channels, gates, planets, chart_data, images, interests, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            const id = Math.random().toString(36).substr(2, 9);
            const result = stmt.run(id, userData.username, userData.email, userData.password_hash, userData.name, userData.birthdate, userData.birthplace, userData.location, userData.bio, userData.age, userData.hd_type, userData.profile, userData.authority, userData.strategy, JSON.stringify(userData.centers || {}), JSON.stringify(userData.channels || {}), JSON.stringify(userData.gates || {}), JSON.stringify(userData.planets || {}), JSON.stringify(userData.chart_data || {}), JSON.stringify(userData.images || []), JSON.stringify(userData.interests || []), userData.avatar);
            console.log(`✅ Benutzer erstellt: ${userData.name} (${userData.hd_type}) - ID: ${id}`);
        }
        // Erstelle einige Test-Swipes
        console.log('💕 Erstelle Test-Swipes...');
        const users = localDb.db?.prepare('SELECT id FROM users WHERE email LIKE \'%@example.com\'').all();
        if (users.length >= 2) {
            // Sarah liked Marcus
            localDb.createSwipe({
                user_id: users[0].id,
                target_id: users[1].id,
                liked: true,
                is_super_like: false,
                compatibility_score: 95
            });
            // Marcus liked Sarah back (Match!)
            localDb.createSwipe({
                user_id: users[1].id,
                target_id: users[0].id,
                liked: true,
                is_super_like: false,
                compatibility_score: 95
            });
            // Lisa liked Alex
            localDb.createSwipe({
                user_id: users[2].id,
                target_id: users[3].id,
                liked: true,
                is_super_like: true,
                compatibility_score: 78
            });
            console.log('✅ Test-Swipes erstellt');
        }
        // Erstelle Test-Matches
        console.log('🎉 Erstelle Test-Matches...');
        if (users.length >= 2) {
            // Sarah & Marcus Match
            localDb.createMatch({
                user_a: users[0].id,
                user_b: users[1].id,
                compatibility_score: 95,
                relationship_type: 'romantic'
            });
            console.log('✅ Test-Matches erstellt');
        }
        // Erstelle Test-Kompatibilitätsanalysen
        console.log('🧠 Erstelle Test-Kompatibilitätsanalysen...');
        if (users.length >= 2) {
            localDb.createCompatibilityAnalysis({
                user_a: users[0].id,
                user_b: users[1].id,
                overall_score: 95,
                breakdown: {
                    energeticCompatibility: 98,
                    personalityCompatibility: 92,
                    lifestyleCompatibility: 90,
                    communicationCompatibility: 95,
                    relationshipPotential: 100
                },
                strengths: [
                    'Perfekte energetische Ergänzung - Generator liefert Energie, Projector führt',
                    'Komplementäre Kommunikationsstile',
                    'Gemeinsame Werte und Ziele'
                ],
                challenges: [
                    'Unterschiedliche Entscheidungsfindung',
                    'Verschiedene Energie-Rhythmen'
                ],
                recommendations: [
                    'Sarah sollte auf ihre Sacral-Autorität hören',
                    'Marcus sollte auf Einladungen warten',
                    'Gemeinsame Projekte fördern die Verbindung'
                ],
                detailed_analysis: {
                    typeCompatibility: {
                        score: 95,
                        analysis: 'Generator und Projector sind eine klassische Kompatibilität'
                    },
                    centerCompatibility: {
                        score: 90,
                        definedCenters: [],
                        openCenters: []
                    }
                },
                relationship_type: 'romantic'
            });
            console.log('✅ Test-Kompatibilitätsanalysen erstellt');
        }
        console.log('🎉 Test-Daten Seeding erfolgreich abgeschlossen!');
        console.log(`📊 ${testUsers.length} Benutzer erstellt`);
        console.log('🔗 Test-Daten können jetzt für Swipe & Matching verwendet werden');
        return {
            success: true,
            usersCreated: testUsers.length,
            message: 'Test-Daten erfolgreich erstellt'
        };
    }
    catch (error) {
        console.error('❌ Fehler beim Seeding der Test-Daten:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        };
    }
}
// Führe Seeding aus, wenn das Skript direkt ausgeführt wird
if (require.main === module) {
    seedTestData().then(result => {
        if (result.success) {
            console.log('✅ Seeding erfolgreich abgeschlossen');
            process.exit(0);
        }
        else {
            console.error('❌ Seeding fehlgeschlagen:', result.error);
            process.exit(1);
        }
    });
}
