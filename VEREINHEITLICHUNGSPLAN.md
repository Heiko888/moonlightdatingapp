# 🎯 HD App - Vereinheitlichungsplan

## 📋 Aktuelle Probleme
- **Mehrfache Versionen** derselben Funktionen
- **Inkonsistente Namenskonventionen** (deutsch/englisch)
- **Veraltete Seiten** die nicht mehr verwendet werden
- **Unklare Hierarchie** zwischen verschiedenen Versionen

## 🔧 Vereinheitlichungsstrategie

### 1. **Dating System - BEREINIGUNG**
**BEHALTEN:**
- `/dating` - Hauptseite (Übersicht aller Dating-Optionen)
- `/dating/generator` - Generator Dating
- `/dating/manifestor` - Manifestor Dating  
- `/dating/projector` - Projector Dating
- `/dating/reflector` - Reflector Dating
- `/dating/manifesting-generator` - Manifesting Generator
- `/dating/friends` - Friends
- `/dating/swipe` - Swipe Interface
- `/dating-impulse` - Dating Impulse Generator
- `/moon-dating` - Mond-basiertes Dating

**ENTFERNEN/UMBENENNEN:**
- `/dating-new` → Inhalt in `/dating` integrieren
- `/dating-info` → Inhalt in `/dating` integrieren
- `/swipe` → Inhalt in `/dating/swipe` integrieren

### 2. **Chat System - BEREINIGUNG**
**BEHALTEN:**
- `/chat` - Hauptseite (vereinheitlicht)

**ENTFERNEN:**
- `/chat-new` → Inhalt in `/chat` integrieren

### 3. **Coaching System - BEREINIGUNG**
**BEHALTEN:**
- `/coaching` - Hauptseite (Übersicht aller Coaches)
- `/coaching/britta` - Coach Britta
- `/coaching/elisabeth` - Coach Elisabeth
- `/coaching/heiko` - Coach Heiko
- `/coaching/janine` - Coach Janine
- `/coaching/louisa` - Coach Louisa

**ENTFERNEN/UMBENENNEN:**
- `/coaching-new` → Inhalt in `/coaching` integrieren
- `/coaching-info` → Inhalt in `/coaching` integrieren

### 4. **Pricing System - BEREINIGUNG**
**BEHALTEN:**
- `/pricing` - Hauptseite (englische Version)

**ENTFERNEN:**
- `/preise` → Inhalt in `/pricing` integrieren
- `/preise.tsx` → Datei löschen

### 5. **Chart System - BEREINIGUNG**
**BEHALTEN:**
- `/chart` - Hauptseite (Chart berechnen)
- `/chart-editor` - Chart Editor
- `/chart-comparison` - Chart Vergleich
- `/human-design-chart` - Detaillierte Chart-Ansicht
- `/bodygraph-advanced` - Erweiterte Bodygraph

**ENTFERNEN/UMBENENNEN:**
- `/chart-info` → Inhalt in `/chart` integrieren
- `/bodygraph-demo` → Inhalt in `/chart` integrieren
- `/css-bodygraph` → Inhalt in `/chart` integrieren

### 6. **Profil System - BEREINIGUNG**
**BEHALTEN:**
- `/profil` - Hauptseite
- `/profil/edit` - Profil bearbeiten
- `/profil-einrichten` - Profil einrichten

**ENTFERNEN:**
- `/profiles` → Inhalt in `/profil` integrieren

## 🎯 Neue vereinheitlichte Struktur

### **Hauptnavigation:**
```
🏠 Startseite (/)
📊 Chart (/chart)
📖 Reading (/reading)
💕 Dating (/dating)
🌙 Mondkalender (/mondkalender)
🎯 Coaching (/coaching)
💬 Chat (/chat)
👤 Profil (/profil)
💰 Pricing (/pricing)
```

### **Unterkategorien:**
```
📊 Chart System:
  - /chart (Hauptseite)
  - /chart-editor
  - /chart-comparison
  - /human-design-chart
  - /bodygraph-advanced

💕 Dating System:
  - /dating (Hauptseite)
  - /dating/generator
  - /dating/manifestor
  - /dating/projector
  - /dating/reflector
  - /dating/manifesting-generator
  - /dating/friends
  - /dating/swipe
  - /dating-impulse
  - /moon-dating

🎯 Coaching System:
  - /coaching (Hauptseite)
  - /coaching/britta
  - /coaching/elisabeth
  - /coaching/heiko
  - /coaching/janine
  - /coaching/louisa

👤 Profil System:
  - /profil (Hauptseite)
  - /profil/edit
  - /profil-einrichten
```

## 🚀 Implementierungsplan

### Phase 1: Content-Migration
1. Inhalt von `/dating-new` in `/dating` integrieren
2. Inhalt von `/chat-new` in `/chat` integrieren
3. Inhalt von `/coaching-new` in `/coaching` integrieren
4. Inhalt von `/preise` in `/pricing` integrieren

### Phase 2: Datei-Bereinigung
1. Veraltete Dateien löschen
2. Redirects für alte URLs einrichten
3. Navigation aktualisieren

### Phase 3: Testing
1. Alle Seiten testen
2. Navigation überprüfen
3. Links aktualisieren

## 📊 Erwartete Ergebnisse
- **Reduzierung von ~80 auf ~50 Seiten**
- **Klarere Navigation**
- **Konsistente Namenskonventionen**
- **Bessere Benutzererfahrung**
- **Einfachere Wartung**

