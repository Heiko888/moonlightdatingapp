export const dynamic = 'force-dynamic';

// Fallback-Daten für Lilith
const fallbackLilithData = {
  id: "lilith_info",
  name: "Lilith",
  symbol: "⚸",
  orbital_period: "8.85 Jahre",
  discovery: "Astronomisch seit Jahrhunderten bekannt",
  mythology: "Die Wilde Frau - Unabhängigkeit und Tabubruch",
  color: "#4B0082",
  description: "Lilith repräsentiert das Wilde, Unabhängige und Tabubrechende in uns. Sie zeigt, wo wir uns weigern, uns zu unterwerfen und wo wir unsere wahre Natur leben."
};

export async function GET() {
  try {
    // Versuche Backend-API zu erreichen
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4001';
    const response = await fetch(`${backendUrl}/lilith/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return Response.json(data);
    } else {
      console.warn('Backend nicht verfügbar, verwende Fallback-Daten');
      return Response.json(fallbackLilithData);
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Lilith-Informationen:', error);
    return Response.json(fallbackLilithData);
  }
}
