"use strict";
/**
 * Swiss Ephemeris Alternative Service
 *
 * Da die native Swiss Ephemeris Python benötigt, implementieren wir eine
 * verbesserte JavaScript-basierte Astronomie-Berechnung als Alternative.
 *
 * Diese Implementierung verwendet moderne astronomische Algorithmen für
 * präzisere Human Design Chart-Berechnungen.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.swissEphemerisAlternative = exports.SwissEphemerisAlternative = void 0;
class SwissEphemerisAlternative {
    /**
     * Konvertiert Datum zu Julianischem Tag
     */
    dateToJulianDay(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        // Julianisches Datum-Algorithmus
        let a = Math.floor((14 - month) / 12);
        let y = year + 4800 - a;
        let m = month + 12 * a - 3;
        let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        // Zeit des Tages hinzufügen
        let dayFraction = (hour - 12) / 24 + minute / 1440 + second / 86400;
        return jdn + dayFraction;
    }
    /**
     * Berechnet die Position der Sonne
     */
    calculateSunPosition(jd) {
        // Anzahl der Tage seit J2000.0
        const T = (jd - 2451545.0) / 36525.0;
        // Mittlere Anomalie der Sonne
        const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
        const MRad = this.degreesToRadians(M);
        // Wahre Anomalie (vereinfacht)
        const nu = M + (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(MRad)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * MRad)
            + 0.000289 * Math.sin(3 * MRad);
        // Ekliptische Länge
        const L = this.normalizeAngle(nu + 102.93735 + 1.71946 * T + 0.00046 * T * T);
        // Entfernung zur Sonne (in AU)
        const R = 1.000001018 * (1 - 0.016708634 * Math.cos(MRad) - 0.000000126 * T * T);
        return {
            longitude: L,
            latitude: 0, // Sonne ist immer in der Ekliptik
            distance: R,
            speed: 0.985647 // Durchschnittliche Geschwindigkeit der Sonne
        };
    }
    /**
     * Berechnet die Position des Mondes (vereinfacht)
     */
    calculateMoonPosition(jd) {
        const T = (jd - 2451545.0) / 36525.0;
        // Mittlere Länge des Mondes
        const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
        // Mittlere Anomalie des Mondes
        const M = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
        const MRad = this.degreesToRadians(M);
        // Mittlere Anomalie der Sonne
        const Ms = 357.5291092 + 35999.0502909 * T;
        const MsRad = this.degreesToRadians(Ms);
        // Längenkorrekturen (vereinfacht)
        const deltaL = 6.288774 * Math.sin(MRad)
            + 1.274027 * Math.sin(2 * this.degreesToRadians(L0 - Ms) - MRad)
            + 0.658314 * Math.sin(2 * this.degreesToRadians(L0 - Ms))
            - 0.185116 * Math.sin(MsRad);
        const longitude = this.normalizeAngle(L0 + deltaL);
        // Vereinfachte Breitenberechnung
        const F = 93.2720950 + 483202.0175233 * T;
        const latitude = 5.128122 * Math.sin(this.degreesToRadians(F));
        return {
            longitude,
            latitude,
            distance: 384400 / 149597870.7, // Mittlere Entfernung in AU
            speed: 13.17639 // Durchschnittliche Geschwindigkeit des Mondes
        };
    }
    /**
     * Berechnet Planetenpositionen mit Kepler-Elementen
     */
    calculatePlanetPosition(planet, jd) {
        const T = (jd - 2451545.0) / 36525.0;
        // Vereinfachte Kepler-Elemente für Planeten (Epoche J2000.0)
        const elements = this.getOrbitalElements(planet, T);
        if (!elements) {
            // Fallback für unbekannte Planeten
            return {
                longitude: 0,
                latitude: 0,
                distance: 1,
                speed: 1
            };
        }
        // Mittlere Anomalie
        const M = this.normalizeAngle(elements.M0 + elements.n * T * 36525);
        const MRad = this.degreesToRadians(M);
        // Exzentrische Anomalie (Kepler-Gleichung, vereinfacht)
        let E = MRad;
        for (let i = 0; i < 5; i++) {
            E = MRad + elements.e * Math.sin(E);
        }
        // Wahre Anomalie
        const nu = 2 * Math.atan(Math.sqrt((1 + elements.e) / (1 - elements.e)) * Math.tan(E / 2));
        // Ekliptische Länge
        const longitude = this.normalizeAngle(this.radiansToDegrees(nu) + elements.w + elements.Omega);
        // Entfernung
        const r = elements.a * (1 - elements.e * Math.cos(E));
        return {
            longitude,
            latitude: 0, // Vereinfacht, ohne Bahnneigung
            distance: r,
            speed: elements.n // Durchschnittliche tägliche Bewegung
        };
    }
    /**
     * Gibt orbital Elemente für Planeten zurück
     */
    getOrbitalElements(planet, T) {
        const elements = {
            mercury: {
                a: 0.387098, // Große Halbachse (AU)
                e: 0.205635, // Exzentrizität
                i: 7.005, // Bahnneigung (Grad)
                Omega: 48.331, // Länge des aufsteigenden Knotens
                w: 29.124, // Argument des Perihels
                M0: 174.796, // Mittlere Anomalie bei Epoche
                n: 4.092317 // Mittlere tägliche Bewegung (Grad/Tag)
            },
            venus: {
                a: 0.723330,
                e: 0.006773,
                i: 3.395,
                Omega: 76.680,
                w: 54.884,
                M0: 50.115,
                n: 1.602136
            },
            mars: {
                a: 1.523688,
                e: 0.093405,
                i: 1.850,
                Omega: 49.558,
                w: 286.502,
                M0: 19.373,
                n: 0.524071
            },
            jupiter: {
                a: 5.202603,
                e: 0.048498,
                i: 1.303,
                Omega: 100.464,
                w: 273.867,
                M0: 20.020,
                n: 0.083091
            },
            saturn: {
                a: 9.536676,
                e: 0.055723,
                i: 2.489,
                Omega: 113.665,
                w: 339.392,
                M0: 317.020,
                n: 0.033494
            },
            uranus: {
                a: 19.189164,
                e: 0.047318,
                i: 0.773,
                Omega: 74.006,
                w: 96.998,
                M0: 142.238,
                n: 0.011733
            },
            neptune: {
                a: 30.069923,
                e: 0.008606,
                i: 1.770,
                Omega: 131.784,
                w: 272.8461,
                M0: 260.2471,
                n: 0.005995
            },
            pluto: {
                a: 39.482117,
                e: 0.248808,
                i: 17.140,
                Omega: 110.299,
                w: 113.834,
                M0: 14.882,
                n: 0.003964
            },
            lilith: {
                a: 0.0, // Lilith ist kein physischer Planet
                e: 0.0,
                i: 0.0,
                Omega: 0.0,
                w: 0.0,
                M0: 0.0,
                n: 0.0
            }
        };
        return elements[planet.toLowerCase()];
    }
    /**
     * Hauptfunktion: Berechnet alle Planetenpositionen
     */
    calculatePositions(date) {
        const jd = this.dateToJulianDay(date);
        return {
            julianDay: jd,
            planets: {
                sun: this.calculateSunPosition(jd),
                moon: this.calculateMoonPosition(jd),
                mercury: this.calculatePlanetPosition('mercury', jd),
                venus: this.calculatePlanetPosition('venus', jd),
                mars: this.calculatePlanetPosition('mars', jd),
                jupiter: this.calculatePlanetPosition('jupiter', jd),
                saturn: this.calculatePlanetPosition('saturn', jd),
                uranus: this.calculatePlanetPosition('uranus', jd),
                neptune: this.calculatePlanetPosition('neptune', jd),
                pluto: this.calculatePlanetPosition('pluto', jd),
                lilith: this.calculateLilithPosition(jd)
            }
        };
    }
    /**
     * Berechnet Lilith-Position (Mondapogäum)
     * Lilith ist der zweite Brennpunkt der Mondbahn
     */
    calculateLilithPosition(jd) {
        // Vereinfachte Lilith-Berechnung basierend auf Mondbahn
        const T = (jd - 2451545.0) / 36525.0; // Julianische Jahrhunderte seit J2000.0
        // Mondbahn-Parameter
        const L = 218.3164477 + 481267.88123421 * T;
        const D = 297.8501921 + 445267.1114034 * T;
        const M = 357.5291092 + 35999.0502909 * T;
        const F = 93.2720950 + 483202.0175233 * T;
        // Lilith-Position (vereinfacht)
        const lilithLongitude = this.normalizeAngle(L + 180 + 0.5 * Math.sin(this.degreesToRadians(D)));
        return {
            longitude: lilithLongitude,
            latitude: 0, // Lilith bewegt sich in der Ekliptik
            distance: 0, // Lilith ist ein geometrischer Punkt
            speed: 0.1114 // Durchschnittliche tägliche Bewegung in Grad
        };
    }
    /**
     * Hilfsfunktionen
     */
    degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }
    normalizeAngle(angle) {
        while (angle < 0)
            angle += 360;
        while (angle >= 360)
            angle -= 360;
        return angle;
    }
    /**
     * Konvertiert ekliptische Länge zu Human Design Gate
     */
    longitudeToGate(longitude) {
        // Human Design Gates sind in 64 Segmente von je 5.625° aufgeteilt
        const gateSize = 360 / 64; // 5.625°
        const lineSize = gateSize / 6; // 0.9375° pro Linie
        // Normalisiere Länge auf 0-360°
        const normalizedLongitude = ((longitude % 360) + 360) % 360;
        // Gate-Nummer (1-64) - Human Design startet bei 0° mit Gate 1
        const gate = Math.floor(normalizedLongitude / gateSize) + 1;
        // Linie innerhalb des Gates (1-6)
        const remainder = normalizedLongitude % gateSize;
        const line = Math.floor(remainder / lineSize) + 1;
        return {
            gate: gate > 64 ? gate - 64 : gate,
            line: Math.min(6, Math.max(1, line))
        };
    }
}
exports.SwissEphemerisAlternative = SwissEphemerisAlternative;
// Export der Service-Instanz
exports.swissEphemerisAlternative = new SwissEphemerisAlternative();
