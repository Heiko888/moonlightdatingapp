import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Fallback-Daten für alle Planeten
const fallbackPlanetData = {
  sonne: {
    id: "planet_sonne",
    planet_name: "Sonne",
    symbol: "☉",
    orbital_period: "365.25 Tage",
    discovery: "Seit Anbeginn der Zeit",
    mythology: "Das Zentrum des Bewusstseins",
    color: "#FFD700",
    description: "Die Sonne repräsentiert unser wahres Selbst, unsere Essenz und unser Bewusstsein. Sie zeigt, wer wir wirklich sind und was uns antreibt."
  },
  mond: {
    id: "planet_mond",
    planet_name: "Mond",
    symbol: "☽",
    orbital_period: "27.3 Tage",
    discovery: "Seit Anbeginn der Zeit",
    mythology: "Der Spiegel der Seele",
    color: "#C0C0C0",
    description: "Der Mond repräsentiert unsere Emotionen, Instinkte und unser Unterbewusstsein. Er zeigt, wie wir uns fühlen und reagieren."
  },
  merkur: {
    id: "planet_merkur",
    planet_name: "Merkur",
    symbol: "☿",
    orbital_period: "88 Tage",
    discovery: "Seit Anbeginn der Zeit",
    mythology: "Der Bote der Götter",
    color: "#87CEEB",
    description: "Merkur repräsentiert Kommunikation, Denken und Lernen. Er zeigt, wie wir Informationen verarbeiten und ausdrücken."
  },
  venus: {
    id: "planet_venus",
    planet_name: "Venus",
    symbol: "♀",
    orbital_period: "225 Tage",
    discovery: "Seit Anbeginn der Zeit",
    mythology: "Die Göttin der Liebe",
    color: "#FFB6C1",
    description: "Venus repräsentiert Liebe, Schönheit und Werte. Sie zeigt, was wir schätzen und wie wir Beziehungen gestalten."
  },
  mars: {
    id: "planet_mars",
    planet_name: "Mars",
    symbol: "♂",
    orbital_period: "687 Tage",
    discovery: "Seit Anbeginn der Zeit",
    mythology: "Der Gott des Krieges",
    color: "#FF4500",
    description: "Mars repräsentiert Energie, Aktion und Durchsetzung. Er zeigt, wie wir unsere Ziele verfolgen und kämpfen."
  },
  jupiter: {
    id: "planet_jupiter",
    planet_name: "Jupiter",
    symbol: "♃",
    orbital_period: "12 Jahre",
    discovery: "Seit Anbeginn der Zeit",
    mythology: "Der König der Götter",
    color: "#DAA520",
    description: "Jupiter repräsentiert Expansion, Weisheit und Optimismus. Er zeigt, wie wir wachsen und uns entwickeln."
  },
  saturn: {
    id: "planet_saturn",
    planet_name: "Saturn",
    symbol: "♄",
    orbital_period: "29 Jahre",
    discovery: "Seit Anbeginn der Zeit",
    mythology: "Der Lehrer",
    color: "#B0C4DE",
    description: "Saturn repräsentiert Struktur, Disziplin und Verantwortung. Er zeigt, wo wir lernen und reifen müssen."
  },
  uranus: {
    id: "planet_uranus",
    planet_name: "Uranus",
    symbol: "♅",
    orbital_period: "84 Jahre",
    discovery: "1781",
    mythology: "Der Revolutionär",
    color: "#00CED1",
    description: "Uranus repräsentiert Revolution, Innovation und Freiheit. Er zeigt, wo wir brechen und Neues erschaffen."
  },
  neptun: {
    id: "planet_neptun",
    planet_name: "Neptun",
    symbol: "♆",
    orbital_period: "165 Jahre",
    discovery: "1846",
    mythology: "Der Mystiker",
    color: "#4169E1",
    description: "Neptun repräsentiert Spiritualität, Illusion und Verbindung. Er zeigt, wo wir spirituell wachsen und uns verbinden."
  },
  pluto: {
    id: "planet_pluto",
    planet_name: "Pluto",
    symbol: "♇",
    orbital_period: "248 Jahre",
    discovery: "1930",
    mythology: "Der Transformator",
    color: "#8B008B",
    description: "Pluto repräsentiert Transformation, Macht und Regeneration. Er zeigt, wo wir sterben und wiedergeboren werden."
  },
  chiron: {
    id: "planet_chiron",
    planet_name: "Chiron",
    symbol: "⚡",
    orbital_period: "50.7 Jahre",
    discovery: "1977",
    mythology: "Der verwundete Heiler",
    color: "#FF6B6B",
    description: "Chiron repräsentiert unsere tiefsten Wunden und unsere Fähigkeit, andere zu heilen. Er zeigt, wo wir verletzt wurden und wo wir anderen helfen können."
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planet: string }> }
) {
  try {
    const resolvedParams = await params;
    const planetName = resolvedParams.planet.toLowerCase();
    
    // Verwende Fallback-Daten
    const planetInfo = fallbackPlanetData[planetName as keyof typeof fallbackPlanetData];
    
    if (!planetInfo) {
      return NextResponse.json(
        { error: `Planet ${planetName} nicht gefunden` },
        { status: 404 }
      );
    }

    return NextResponse.json(planetInfo);
  } catch (error) {
    console.error('Fehler beim Laden der Planet-Info:', error);
    return NextResponse.json(
      { error: `Interner Serverfehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}` },
      { status: 500 }
    );
  }
}
