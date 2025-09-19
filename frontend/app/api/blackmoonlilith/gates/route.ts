import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fallback-Daten für Black Moon Lilith Gates (alle 64 Gates)
    const fallbackGates = [];
    for (let i = 1; i <= 64; i++) {
      fallbackGates.push({
        id: i.toString(),
        gate_number: i,
        name: `Tor ${i}`,
        description: `Black Moon Lilith in Tor ${i} bringt die Kraft der wilden Unabhängigkeit.`,
        deep_meaning: `Die tiefe Bedeutung von Tor ${i} liegt in der natürlichen Black Moon Lilith-Energie.`,
        shadow_aspects: `Unbewusste Scham über Tor ${i}, Angst vor Wildheit`,
        gifts: `Wilde Kraft in Tor ${i}, Ungezähmte Energie`,
        affirmation: `Ich lebe Tor ${i} mit wilder Black Moon Lilith Kraft.`,
        unconscious_description: `Unbewusst in Tor ${i}: Tief in dir liegt die wilde Kraft.`,
        unconscious_deep_meaning: `Unbewusste Bedeutung von Tor ${i}: Deine Wildheit ist heilig.`,
        unconscious_shadow_aspects: `Unbewusste Scham über Tor ${i}, Angst vor Wildheit`,
        unconscious_gifts: `Wilde Kraft in Tor ${i}, Ungezähmte Energie`,
        unconscious_affirmation: `Ich lebe Tor ${i} unbewusst mit wilder Black Moon Lilith Kraft.`
      });
    }

    // Versuche Backend-API zu erreichen
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4001';
    try {
      const response = await fetch(`${backendUrl}/blackmoonlilith/gates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.log('Backend nicht erreichbar, verwende Fallback-Daten');
    }

    // Fallback-Daten zurückgeben
    return NextResponse.json(fallbackGates);

  } catch (error) {
    console.error('Fehler beim Abrufen der Black Moon Lilith Gates:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Black Moon Lilith Gates' },
      { status: 500 }
    );
  }
}
