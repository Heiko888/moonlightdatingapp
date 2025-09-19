import { MoonToday, AstroEvent } from "../types";

export async function getMoonFromMoonAPI(lat?: number, lon?: number, date = new Date()): Promise<MoonToday> {
  const base = process.env.MOON_API_BASE!;
  const key  = process.env.MOON_API_KEY!;
  const d    = date.toISOString().slice(0,10);

  const url = new URL(`${base}/today`);
  if (lat != null && lon != null) { url.searchParams.set("lat", String(lat)); url.searchParams.set("lon", String(lon)); }
  url.searchParams.set("date", d);

  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" });
  if (!res.ok) throw new Error(`MoonAPI error ${res.status}`);
  const j = await res.json();

  // Beispielhafte Zuordnung – passe an die echte Response an:
  const events: AstroEvent[] = [];
  if (j.moonSign) {
    events.push({ type: "ingress", start: d, title: `Moon in ${j.moonSign}", sign: j.moonSign });
  }
  if (Array.isArray(j.aspects)) {
    j.aspects.forEach((a: any) => {
      events.push({
        type: "aspect",
        start: a.exact,
        title: `Moon ${a.aspect} ${a.body}`,
        aspect: `${a.aspect} ${a.body}`
      });
    });
  }

  return {
    date: d,
    phase: j.phaseName,                // z.B. "Full Moon"
    illumination: j.illumination,      // 0..1
    sign: j.moonSign,
    events
  };
}
