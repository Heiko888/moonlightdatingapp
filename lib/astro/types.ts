export type MoonPhaseName =
  | "New Moon" | "Waxing Crescent" | "First Quarter" | "Waxing Gibbous"
  | "Full Moon" | "Waning Gibbous" | "Last Quarter" | "Waning Crescent";

export type AstroEvent = {
  type: "phase" | "ingress" | "aspect" | "eclipse";
  start: string;          // ISO
  end?: string;
  title: string;
  detail?: string;
  sign?: string;          // e.g. "Aquarius"
  aspect?: string;        // e.g. "Moon square Uranus"
};

export type MoonToday = {
  date: string;           // ISO day
  phase: MoonPhaseName;
  illumination: number;   // 0..1
  sign?: string;          // Moon in <sign>
  events: AstroEvent[];
};
