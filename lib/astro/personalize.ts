import { MoonToday } from "./types";

type Advice = { headline: string; items: string[] };

function byPhase(phase: MoonToday["phase"]): Advice {
  switch (phase) {
    case "New Moon":         return { headline: "Neumond – Neuanfang", items: ["Intentionen setzen", "Sanft planen", "Ruhig starten"] };
    case "First Quarter":    return { headline: "Zunehmendes Handeln", items: ["Hürden angehen", "Commitments erneuern"] };
    case "Full Moon":        return { headline: "Vollmond – Sichtbarkeit", items: ["Feiern & reflektieren", "Altes loslassen"] };
    case "Last Quarter":     return { headline: "Abschluss & Review", items: ["Aufräumen", "Lehren ziehen"] };
    default:                 return { headline: "Zyklus im Fluss", items: ["Kleine Schritte", "Auf Körper hören"] };
  }
}

function bySign(sign?: string): Advice | null {
  if (!sign) return null;
  const map: Record<string, Advice> = {
    Aquarius: { headline: "Mond im Wassermann", items: ["Think different", "Community & Innovation", "Technik/Netzwerk"] },
    Taurus:   { headline: "Mond im Stier",      items: ["Körper & Genuss", "Finanzen sortieren", "Natur & Rituale"] },
    Scorpio:  { headline: "Mond im Skorpion",   items: ["Tiefe Emotionen", "Schattenarbeit", "Transformation"] },
    // … ergänze nach Bedarf
  };
  return map[sign] ?? { headline: `Mond in ${sign}`, items: ["Sign-spezifische Intentionen", "Ritual nach Gefühl"] };
}

export function buildRecommendations(today: MoonToday, birthDate?: string) {
  const recs: Advice[] = [];
  recs.push(byPhase(today.phase));
  const s = bySign(today.sign);
  if (s) recs.push(s);

  // ganz simple Personalisierungsidee als Platzhalter:
  if (birthDate) {
    recs.push({
      headline: "Persönlicher Hinweis",
      items: ["Stimme Entscheidungen mit deiner Autorität ab", "Reflektiere das, was heute stark getriggert wird"]
    });
  }
  return recs;
}
