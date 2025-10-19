# Human Design Gate Calculator - Anleitung

## 📚 Übersicht

Das Gate-Calculator-Modul berechnet **präzise Human Design Tore** basierend auf ekliptischer Länge (0-360°). Es verwendet die exakte **Rave-Mandala-Aufteilung** mit allen 64 Toren.

**Quelle:** [Barney + flo(w) - Gate & Zodiac Degrees](https://www.barneyandflow.com/gate-zodiac-degrees)

---

## 🗂️ Dateien

```
frontend/lib/human-design/
├── gate-calculator.ts    # Kern-Berechnungslogik
├── index.ts             # Haupt-Export + Hilfsfunktionen
```

---

## 🚀 Verwendung

### 1. **Tor aus ekliptischer Länge berechnen**

```typescript
import { gateForLongitude, lineForLongitude, getGateAndLine } from '@/lib/human-design';

// Beispiel: Sonne bei 127.5° (Löwe 7.5°)
const sunLongitude = 127.5;

// Tor-Nummer (1-64)
const gate = gateForLongitude(sunLongitude);
console.log(gate); // z.B. 33

// Linie (1-6)
const line = lineForLongitude(sunLongitude);
console.log(line); // z.B. 2

// Beides zusammen
const result = getGateAndLine(sunLongitude);
console.log(result); // { gate: 33, line: 2 }
```

---

### 2. **Formatierte Ausgabe**

```typescript
import { formatGateAndLine, getGateName } from '@/lib/human-design';

const sunLongitude = 127.5;

// Format: "Tor.Linie" (z.B. "33.2")
const formatted = formatGateAndLine(sunLongitude);
console.log(formatted); // "33.2"

// Tor-Name (Deutsch)
const name = getGateName(33);
console.log(name); // "Tor 33: Der Rückzug"
```

---

### 3. **Debug-Informationen**

```typescript
import { getGateInfo } from '@/lib/human-design';

const info = getGateInfo(127.5);
console.log(info);
/*
{
  longitude: 127.5,
  gate: 33,
  line: 2,
  formatted: "33.2",
  gateData: { gate: 33, start: 127.625, span: 5.625 }
}
*/
```

---

## 🔢 Gate-Mapping Details

### Struktur

Jedes Tor hat:
- **Start**: Absolute ekliptische Position (0° = 0° Widder)
- **Span**: Breite des Tors (~5° 37′ 30″ = 5.625°)
- **6 Linien**: Jede Linie = span / 6 (~0.9375°)

### Beispiel: Tor 25

```typescript
{
  gate: 25,
  start: { sign: 'PISCES', d: 28, m: 15, s: 0 },    // Fische 28° 15′
  end: { sign: 'ARIES', d: 3, m: 52, s: 30 }        // Widder 3° 52′ 30″
}

// Intern konvertiert zu:
{
  gate: 25,
  start: 358.25,   // Absolute Grad (Fische 28.25°)
  span: 5.625      // Torbreite in Grad
}
```

### Übergang Fische → Widder (0°)

Tor 25 überspannt die **Sternzeichen-Grenze**:
- Start: 358.25° (Fische 28° 15′)
- Ende: 3.875° (Widder 3° 52′ 30″)

Die Funktion `gateForLongitude()` behandelt diesen Wrap-around **automatisch korrekt**.

---

## 🧮 Berechnungslogik

### DMS → Dezimalgrad

```typescript
dmsToDeg(28, 15, 0) = 28 + 15/60 + 0/3600 = 28.25°
```

### Sternzeichen → Absolute Grad

```typescript
// Fische 28° 15′
SIGN_OFFSETS['PISCES'] + dmsToDeg(28, 15, 0)
= 330 + 28.25
= 358.25°
```

### Normalisierung (0-360°)

```typescript
norm360(x) = (x % 360 + 360) % 360
```

Beispiele:
- `norm360(370)` → 10°
- `norm360(-10)` → 350°

---

## 📊 Alle 64 Tore

Die Tore sind in **GATE_RANGES** definiert und decken die gesamte Ekliptik ab:

| Tor | Start | Ende | Sternzeichen |
|-----|-------|------|--------------|
| 25  | Fische 28° 15′ | Widder 3° 52′ 30″ | Fische/Widder |
| 17  | Widder 3° 52′ 30″ | Widder 9° 30′ | Widder |
| 21  | Widder 9° 30′ | Widder 15° 7′ 30″ | Widder |
| ... | ... | ... | ... |

*Vollständige Liste in `gate-calculator.ts` (64 Einträge)*

---

## 🔗 Integration mit Ephemeris

Für echte Human Design Readings benötigst du die **Planetenpositionen** zum Geburtszeitpunkt:

### Empfohlene Bibliotheken

1. **Swiss Ephemeris (swisseph)**
   ```bash
   npm install swisseph
   ```

2. **Astronomy Engine**
   ```bash
   npm install astronomy-engine
   ```

### Beispiel-Integration

```typescript
import swisseph from 'swisseph';
import { getGateAndLine } from '@/lib/human-design';

// Ephemeris-Dateien laden
swisseph.swe_set_ephe_path('/path/to/ephemeris/files');

// Geburtsdaten
const birthDate = new Date('1990-05-15T14:30:00Z');
const julianDay = swisseph.swe_julday(
  birthDate.getUTCFullYear(),
  birthDate.getUTCMonth() + 1,
  birthDate.getUTCDate(),
  birthDate.getUTCHours() + birthDate.getUTCMinutes() / 60
);

// Sonnenposition berechnen
const sunResult = swisseph.swe_calc_ut(julianDay, swisseph.SE_SUN, swisseph.SEFLG_SWIEPH);
const sunLongitude = sunResult.longitude;

// Human Design Tor berechnen
const sunGate = getGateAndLine(sunLongitude);
console.log(`Sonne: ${sunGate.gate}.${sunGate.line}`);

// Cleanup
swisseph.swe_close();
```

---

## 🎯 Verwendung im Reading Creator

### In `app/coach/readings/create/page.tsx` einbinden:

```typescript
import { getGateAndLine, getGateName } from '@/lib/human-design';

// Beispiel: Automatische Tor-Berechnung aus Geburtsdaten
function calculateDesignData(birthDate: Date, birthTime: string, birthPlace: string) {
  // 1. Ephemeris-Berechnung (mit swisseph o.ä.)
  const sunLongitude = calculateSunPosition(birthDate, birthTime, birthPlace);
  
  // 2. Human Design Tor berechnen
  const sunGate = getGateAndLine(sunLongitude);
  
  return {
    sunGate: `${sunGate.gate}.${sunGate.line}`,
    sunGateName: getGateName(sunGate.gate),
    // ... weitere Planeten
  };
}
```

---

## ✅ Tests

### Beispiel-Test-Fälle

```typescript
import { gateForLongitude, lineForLongitude } from '@/lib/human-design';

// Test 1: Tor 25 (Wrap-around)
const gate25 = gateForLongitude(0); // 0° Widder
console.assert(gate25 === 25, 'Gate 25 should span 0° Aries');

// Test 2: Tor 17
const gate17 = gateForLongitude(5); // Widder 5°
console.assert(gate17 === 17, 'Gate 17 should be at Aries 5°');

// Test 3: Linien-Berechnung
const line = lineForLongitude(127.5);
console.assert(line >= 1 && line <= 6, 'Line should be 1-6');
```

---

## 📖 Weitere Ressourcen

- **Rave Mandala**: [Jovian Archive](https://www.jovianarchive.com/)
- **Gate-Positionen**: [Barney + flo(w)](https://www.barneyandflow.com/gate-zodiac-degrees)
- **Human Design System**: [Official Website](https://www.humandesignsystem.com/)

---

## 🔧 Zukünftige Erweiterungen

1. **Vollständige Ephemeris-Integration**
   - Alle 13 Planeten/Punkte (Sonne, Mond, Merkur, Venus, Mars, Jupiter, Saturn, Uranus, Neptun, Pluto, Mondknoten, Chiron, Erde)
   - Personality (88° vor Sonnenposition)
   - Design (bewusst/unbewusst)

2. **Typ-Berechnung**
   - Manifestor, Generator, MG, Projektor, Reflektor
   - Basierend auf definierten Zentren

3. **Autorität-Berechnung**
   - Emotional, Sakral, Milz, Ego, Self-Projected, Mental, Lunar

4. **Profil-Berechnung**
   - 12 Profile (1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6, 4/1, 5/1, 5/2, 6/2, 6/3)

5. **Kanal-Erkennung**
   - 36 Kanäle zwischen den 9 Zentren

---

## 📞 Support

Bei Fragen oder Problemen:
- **Dokumentation**: Diese Datei
- **Code**: `frontend/lib/human-design/gate-calculator.ts`
- **Tests**: Beispiel-Test-Fälle oben verwenden

---

**Version:** 1.0.0  
**Erstellt:** 2025-10-18  
**Quelle:** Rave-Mandala (Ra Uru Hu)

