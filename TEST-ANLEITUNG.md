# 🧪 Test-Anleitung für Reading-System

## ✅ Schritt-für-Schritt Tests

### Test 1: Neues Reading erstellen (5 Min)

1. **Öffne:** http://localhost:3005/reading
2. **Klicke:** Tab "✨ Neues Reading" oder Button "Reading starten"
3. **Fülle aus:**
   - Titel: "Mein Erstes Test-Reading"
   - Kategorie: "💼 Business & Karriere"
   - Bereich: "🚀 Karriereplanung"
   - Frage: "Wie finde ich meine berufliche Bestimmung?"
   - Geburtsdatum: 15.01.1990
   - Geburtszeit: 14:30
   - Geburtsort: München, Deutschland
   - E-Mail: deine@email.de
   - Telefon: (optional)

4. **Klicke:** "Anfrage abschicken →"
5. **Erwarte:** 
   - Weiterleitung zu /reading/next-steps
   - Schöne Glückwunsch-Seite mit Erklärung
   - In Browser-Konsole (F12): E-Mail-Logs sehen

6. **Prüfe Konsole:**
   ```
   📧 E-Mail würde gesendet werden:
     An: deine@email.de
     Betreff: 🎉 Deine Reading-Anfrage wurde erhalten!
   
   📧 Neue Reading-Anfrage
     An: coach@humandesign.app
   ```

---

### Test 2: Reading-Übersicht ansehen (2 Min)

1. **Klicke:** "Zurück zu Readings" oder gehe zu http://localhost:3005/reading
2. **Erwarte:**
   - Dein Reading in der Liste
   - Status: "⏳ Warte auf Termin" (gelb)
   - Kategorie: "💼 Business"
   - Button: "📋 Status anzeigen"

3. **Klicke:** "📋 Status anzeigen"
4. **Erwarte:** Du wirst zu /reading/next-steps weitergeleitet

---

### Test 3: Coach-Dashboard öffnen (3 Min)

1. **Öffne:** http://localhost:3005/coach/dashboard
2. **Erwarte:**
   - Statistik-Cards oben:
     - Gesamt: 1
     - Warte auf Termin: 1 (gelb)
     - Rest: 0
   - Tabelle mit deinem Reading
   - Status-Chip: "⏳ Warte auf Termin"

3. **Prüfe Tabs:**
   - "Alle" - zeigt dein Reading
   - "Pending (1)" - zeigt dein Reading
   - Andere Tabs - leer

---

### Test 4: Zoom-Termin vereinbaren (5 Min)

1. **Im Coach-Dashboard:**
2. **Klicke:** Blaues Stift-Icon bei deinem Reading
3. **Im Dialog:**
   - Status: "📅 Termin vereinbart"
   - Zoom-Link: https://zoom.us/j/123456789
   - Zoom-Termin: Wähle ein Datum/Zeit (z.B. morgen 15:00)
   - Coach-Notizen: "Erstes Test-Reading"

4. **Klicke:** "Speichern & E-Mail senden"
5. **Erwarte:**
   - Alert: "Reading erfolgreich aktualisiert!"
   - Status-Update in Tabelle
   - In Konsole: E-Mail-Log

6. **Prüfe Konsole:**
   ```
   📧 Status-Update E-Mail an deine@email.de: Status zoom-scheduled
   📧 E-Mail würde gesendet werden:
     Betreff: 📅 Dein Zoom-Termin für dein Human Design Reading
   ```

7. **Zurück zu User-Seite:**
   - Gehe zu http://localhost:3005/reading
   - Status jetzt: "📅 Termin vereinbart" (blau)
   - Button: "📅 Termin-Info"

---

### Test 5: Reading freigeben & PDF (5 Min)

1. **Zurück zum Coach-Dashboard:**
2. **Klicke:** Stift-Icon bei deinem Reading
3. **Im Dialog:**
   - Status: "🎉 Freigegeben"
   - Rest kann gleich bleiben

4. **Klicke:** "Speichern & E-Mail senden"
5. **Erwarte:**
   - Alert: "Reading erfolgreich aktualisiert!"
   - In Konsole: PDF-Generierung + E-Mail

6. **Prüfe Konsole:**
   ```
   📄 PDF-Generierung gestartet für: Mein Erstes Test-Reading
   ✅ PDF erfolgreich generiert: /api/readings/reading_xxx/download
   📧 E-Mail würde gesendet werden:
     Betreff: 🎉 Dein Human Design Reading ist jetzt verfügbar!
   ```

7. **Zurück zu User-Seite:**
   - Gehe zu http://localhost:3005/reading
   - Status jetzt: "🎉 Freigegeben" (grün)
   - Button: "📥 PDF herunterladen" (GRÜN)

8. **Klicke:** "📥 PDF herunterladen"
9. **Erwarte:** Alert "PDF-Download wird implementiert. Reading ist freigegeben!"

---

## 🎯 Alle Status durchlaufen

### Status-Progression testen:

```
⏳ Pending (gelb)
    ↓ (Coach vereinbart Termin)
📅 Zoom-Scheduled (blau)
    ↓ (Zoom findet statt)
✅ Completed (lila)
    ↓ (Coach gibt frei)
🎉 Approved (grün) → PDF verfügbar!
```

**Teste alle Übergänge:**
1. Erstelle neues Reading → Pending
2. Coach: Status → Zoom-Scheduled (mit Link)
3. Coach: Status → Completed
4. Coach: Status → Approved (PDF wird generiert)

---

## 🔍 Was zu prüfen ist:

### In Browser-Konsole (F12):
- ✅ E-Mail-Logs erscheinen bei jedem Status-Wechsel
- ✅ PDF-Generierung-Log bei "Approved"
- ✅ Keine JavaScript-Fehler

### Im Coach-Dashboard:
- ✅ Statistiken aktualisieren sich
- ✅ Tabs zeigen richtige Anzahl
- ✅ Tabelle aktualisiert sich nach Speichern
- ✅ Filter-Tabs funktionieren

### In User-Ansicht:
- ✅ Status-Farben korrekt (gelb→blau→lila→grün)
- ✅ Button-Text ändert sich je nach Status
- ✅ PDF-Button nur bei "Approved" sichtbar

---

## 🐛 Bekannte Einschränkungen (Development):

1. **In-Memory Store:** 
   - Daten gehen verloren bei Server-Neustart
   - Lösung: Browser neuladen zeigt localStorage-Daten

2. **E-Mails:**
   - Werden nur in Konsole geloggt
   - Keine echten E-Mails (Produktion: SendGrid/Resend)

3. **PDF:**
   - Wird simuliert generiert
   - Keine echten PDFs (Produktion: Puppeteer)

4. **Authentifizierung:**
   - Coach-Dashboard ist öffentlich
   - Produktion: Braucht Login

---

## 🚀 Quick-Test Checklist:

- [ ] Reading erstellen funktioniert
- [ ] Weiterleitung zu /next-steps erfolgt
- [ ] E-Mail-Logs in Konsole sichtbar
- [ ] Reading erscheint in User-Liste
- [ ] Reading erscheint in Coach-Dashboard
- [ ] Status-Update funktioniert
- [ ] E-Mail bei Status-Änderung (Konsole)
- [ ] PDF-Generierung bei "Approved" (Konsole)
- [ ] PDF-Button nur bei "Approved" sichtbar
- [ ] Alle Status-Farben korrekt

---

## 💡 Tipps:

1. **Mehrere Readings erstellen:**
   - Verschiedene Kategorien
   - Verschiedene Status
   - Teste Filter im Coach-Dashboard

2. **Status zurücksetzen:**
   - Aktuell nicht möglich über UI
   - Lösung: Browser-Konsole oder Server-Neustart

3. **Debugging:**
   - F12 → Console für Logs
   - F12 → Network für API-Calls
   - React DevTools für Component-State

---

## 📞 Bei Problemen:

### Server läuft nicht:
```bash
cd frontend
npm run dev
```

### Port 3005 belegt:
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3005).OwningProcess | Stop-Process
```

### Daten löschen:
```javascript
// Browser-Konsole
localStorage.clear();
location.reload();
```

---

**Viel Erfolg beim Testen! 🎉**

