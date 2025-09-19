import { MoonToday, AstroEvent } from "../types";

export async function getMoonFromFarmSense(date = new Date()): Promise<MoonToday> {
  // FarmSense liefert per Julian Day; hier simpel: "today" endpoint-ähnlich
  // Hinweis: FarmSense hat mehrere v1 Endpoints; manche sind instabil.
  const ts = Math.floor(date.getTime()/1000);
  const res = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${ts}`, { cache: "no-store" });
  const data = await res.json(); // array with one item
  const first = data?.[0];

  // Map auf unser Schema (fallbacks)
  const phaseMap: Record<string, MoonToday["phase"]> = {
    "New Moon": "New Moon",
    "Waxing Crescent": "Waxing Crescent",
    "First Quarter": "First Quarter",
    "Waxing Gibbous": "Waxing Gibbous",
    "Full Moon": "Full Moon",
    "Waning Gibbous": "Waning Gibbous",
    "Last Quarter": "Last Quarter",
    "Waning Crescent": "Waning Crescent",
  };

  const events: AstroEvent[] = [{
    type: "phase",
    start: new Date(first?.Timestamp * 1000).toISOString(),
    title: first?.Phase || "Moon Phase",
    detail: `Age: ${first?.Age?.toFixed?.(1) ?? "?"} days`,
  }];

  return {
    date: new Date().toISOString().slice(0,10),
    phase: phaseMap[first?.Phase] ?? "Full Moon",
    illumination: (first?.Illumination ?? 100) / 100,
    events
  };
}
