# 🌟 Inkarnationskreuz (Incarnation Cross) - Dokumentation

## Was ist das Inkarnationskreuz?

Das **Inkarnationskreuz** (auch **Reinkarnationskreuz** genannt) ist deine **Lebensaufgabe** im Human Design System. Es beschreibt den **Sinn und Zweck deiner Inkarnation** auf der Erde und wird aus den 4 wichtigsten Toren deines Charts berechnet.

---

## 📐 Die 4 Haupttore

Das Inkarnationskreuz besteht aus 4 Toren, die eine Kreuzformation bilden:

1. **Bewusste Sonne** (☀️ Personality Sun)
   - Das Tor deiner bewussten Identität
   - Was du über dich selbst weißt
   - Deine bewusste Lebensrichtung

2. **Bewusste Erde** (🌍 Personality Earth)
   - Das Fundament deiner bewussten Realität
   - Was dich erdet und stabilisiert
   - 180° gegenüber der bewussten Sonne

3. **Unbewusste Sonne** (🌙☀️ Design Sun)
   - Das Tor deiner unbewussten Identität
   - Was andere in dir sehen, du aber nicht
   - Deine unbewusste Lebensrichtung
   - 88° früher (ca. 88 Tage vor der Geburt)

4. **Unbewusste Erde** (🌙🌍 Design Earth)
   - Das Fundament deiner unbewussten Realität
   - Deine unbewusste Erdung
   - 180° gegenüber der unbewussten Sonne

---

## 🎭 Die 3 Kreuz-Typen

### 1. **Rechtswinkel-Kreuz** ⊿ (Right Angle Cross)

- **Profile:** 1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6
- **Fokus:** Persönliches Schicksal
- **Beschreibung:** Du bist hier für deine eigene Entwicklung und Selbstverwirklichung. Dein Leben ist auf dich selbst fokussiert. Die bewusste und unbewusste Sonne stehen im 90°-Winkel zueinander.
- **Natur:** Selbstorientiert, individuell, persönlicher Lebensweg

### 2. **Linkswinkel-Kreuz** ⊾ (Left Angle Cross)

- **Profile:** 4/1, 5/1, 5/2, 6/2, 6/3
- **Fokus:** Transpersonales Schicksal
- **Beschreibung:** Du bist hier, um andere zu beeinflussen und mit ihnen zu interagieren. Dein Leben hat eine soziale Komponente. Andere Menschen spielen eine wichtige Rolle in deiner Lebensaufgabe.
- **Natur:** Beziehungsorientiert, sozial, kollektiver Lebensweg

### 3. **Juxtaposition-Kreuz** ⊡ (Juxtaposition Cross)

- **Profile:** Sehr selten, nur unter speziellen Bedingungen (z.B. 4/1 in bestimmten Fällen)
- **Fokus:** Fixes Schicksal
- **Beschreibung:** Dein Lebensweg ist sehr spezifisch und unveränderlich. Du bist genau das, was du sein sollst, ohne Ausrichtung auf andere.
- **Natur:** Fix, einzigartig, eigenständig

---

## 💻 Berechnung im Code

### Implementierung

Das Inkarnationskreuz wird in 3 Schritten berechnet:

1. **Profil bestimmen** → Kreuz-Typ ableiten
2. **4 Tore extrahieren** (Personality Sun/Earth, Design Sun/Earth)
3. **Namen generieren** (z.B. "RAX 14/8")

### Code-Beispiel

```typescript
import { calculateIncarnationCross } from '@/lib/human-design';

const cross = calculateIncarnationCross(
  '6/3',              // Profil
  14,                 // Personality Sun Gate
  8,                  // Personality Earth Gate
  2,                  // Design Sun Gate
  1                   // Design Earth Gate
);

console.log(cross.type);  // "Linkswinkel"
console.log(cross.name);  // "LAX 14/2"
```

### Funktionen

| Funktion | Beschreibung |
|----------|--------------|
| `calculateIncarnationCross()` | Berechnet das komplette Inkarnationskreuz |
| `formatIncarnationCross()` | Formatiert das Kreuz für die Anzeige |
| `getCrossType()` | Bestimmt den Kreuz-Typ aus dem Profil |
| `generateCrossName()` | Generiert den vollständigen Namen |

---

## 🎯 Namen-Konvention

Das Inkarnationskreuz wird nach folgender Konvention benannt:

### Format
```
[TYP] [PERSONALITY_SUN] / [DESIGN_SUN]
```

### Abkürzungen
- **RAX** = Rechtswinkel-Kreuz (Right Angle Cross)
- **LAX** = Linkswinkel-Kreuz (Left Angle Cross)
- **JUX** = Juxtaposition-Kreuz (Juxtaposition Cross)

### Beispiele
- `RAX 25/17` - Rechtswinkel-Kreuz der Unschuld (Gate 25) / Nachfolge (Gate 17)
- `LAX 14/8` - Linkswinkel-Kreuz des Besitzes (Gate 14) / Zusammenhalten (Gate 8)
- `JUX 1/2` - Juxtaposition-Kreuz der Schöpfung (Gate 1) / Rezeptivität (Gate 2)

---

## 🌐 Anzeige in der UI

### Im Gate Calculator Sidebar
Nach der Berechnung wird das Inkarnationskreuz angezeigt:
- **Icon:** ✨ mit spezifischem Kreuz-Symbol (⊿, ⊾, ⊡)
- **Typ:** z.B. "Rechtswinkel"
- **Name:** z.B. "RAX 25/17"
- **Tore:** Alle 4 Tore mit Symbolen (☀️, 🌍, 🌙☀️, 🌙🌍)

### In der Reading Übersicht
Das Inkarnationskreuz wird als separater Abschnitt angezeigt (nach dem Profil):
- **Status:** Automatisch berechnet (lila Hintergrund)
- **Typ-Bezeichnung:** z.B. "Rechtswinkel-Kreuz"
- **Vollständiger Name**
- **Alle 4 Gate-Nummern**

---

## 📊 Beispiel-Output

### Console Output
```
✨ INKARNATIONSKREUZ:
  Type: Rechtswinkel
  Name: RAX 25/17
  Short: Rechtswinkel-Kreuz der Die Unschuld - Die Nachfolge
  Gates: 25 / 17
```

### UI Display
```
✨ Inkarnationskreuz ⊿
Rechtswinkel
RAX 25/17
Tore: 25 (☀️) / 46 (🌍) | 17 (🌙☀️) / 18 (🌙🌍)
```

---

## 🔍 Debugging

Alle Inkarnationskreuz-Daten werden in der Browser-Console ausgegeben:
1. Öffne die Console (`F12`)
2. Klicke auf "Tore berechnen"
3. Suche nach `✨ INKARNATIONSKREUZ:`
4. Prüfe Type, Name und Gates

---

## 📚 Quellen & Weiterführende Informationen

- **Human Design System:** Ra Uru Hu (Gründer)
- **Profile & Kreuze:** Lynda Bunnell, Jovian Archive
- **Berechnung:** Basiert auf den astronomischen Positionen der Sonne zum Geburtszeitpunkt und 88 Tage davor

---

## ✅ Features

- [x] Automatische Berechnung des Kreuz-Typs aus dem Profil
- [x] Generierung des vollständigen Namens
- [x] Anzeige aller 4 Tore mit Symbolen
- [x] Farbcodierte UI-Integration
- [x] Console-Debugging-Output
- [x] Integration in Reading Übersicht
- [x] Sidebar-Anzeige nach Berechnung

---

**Erstellt:** 2025-10-19  
**Version:** 1.0  
**Status:** ✅ Implementiert und getestet

