import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, Gauge, Eye, Sunrise, Sunset, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/weather")({
  head: () => ({ meta: [{ title: "Weather — Mahoba Insight" }, { name: "description", content: "Live weather forecast and air quality." }] }),
  component: Weather;
});

interface Loc { lat: number; lon: number; name: string; }
const DEFAULT: Loc = { lat: 25.293, lon: 79.874, name: "Mahoba" };

function iconFor(code: number) {
  if ([0, 1].includes(code)) return Sun;
  if ([2, 3, 45, 48].includes(code)) return Cloud;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return CloudSnow;
  return CloudRain;
}
function label(code: number) {
  const m: Record<number, string> = { 0: "Clear", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow", 80: "Rain showers", 81: "Rain showers", 82: "Violent showers", 95: "Thunderstorm" };
  return m[code] ?? "—";
}
function gradFor(code: number, isDay: boolean) {
  if (!isDay) return "from-slate-900 via-slate-800 to-indigo-950";
  if ([0, 1].includes(code)) return "from-sky-400 via-sky-500 to-blue-600";
  if ([2, 3, 45, 48].includes(code)) return "from-slate-400 via-slate-500 to-slate-700";
  return "from-slate-600 via-slate-700 to-slate-900";
}

async function fetchWeather(l: Loc) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${l.lat}&longitude=${l.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,is_day&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto&forecast_days=10`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("weather");
  return r.json();
}
async function fetchAqi(l: Loc) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${l.lat}&longitude=${l.lon}&current=us_aqi,pm2_5,pm10`;
  const r = await fetch(url); if (!r.ok) return null; return r.json();
}
async function geocode(q: string): Promise<Loc[]> {
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en`);
  if (!r.ok) return [];
  const j = await r.json();
  return (j.results ?? []).map((x: any) => ({ lat: x.latitude, lon: x.longitude, name: `${x.name}${x.admin1 ? ", " + x.admin1 : ""}${x.country ? ", " + x.country : ""}` }));
}

function Weather() {
  const [loc, setLoc] = useState<Loc | null>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Loc[]>([]);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("weather:loc");
    if (saved) { try { setLoc(JSON.parse(saved)); return; } catch {} }
    if (asked) return;
    setAsked(true);
    if (!navigator.geolocation) { setLoc(DEFAULT); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setLoc({ lat: p.coords.latitude, lon: p.coords.longitude, name: "Current location" }),
      () => setLoc(DEFAULT),
      { timeout: 6000 }
    );
  }, [asked]);

  useEffect(() => { if (loc) localStorage.setItem("weather:loc", JSON.stringify(loc)); }, [loc]);

  const w = useQuery({ queryKey: ["weather", loc?.lat, loc?.lon], queryFn: () => fetchWeather(loc!), enabled: !!loc, refetchInterval: 10 * 60_000 });
  const a = useQuery({ queryKey: ["aqi", loc?.lat, loc?.lon], queryFn: () => fetchAqi(loc!), enabled: !!loc });

  const cur = w.data?.current;
  const daily = w.data?.daily;
  const hourly = w.data?.hourly;
  const Icon = cur ? iconFor(cur.weather_code) : Cloud;
  const grad = cur ? gradFor(cur.weather_code, !!cur.is_day) : "from-slate-500 to-slate-700";

  const nowIdx = hourly ? hourly.time.findIndex((t: string) => new Date(t) >= new Date()) : -1;
  const next24 = hourly && nowIdx >= 0 ? hourly.time.slice(nowIdx, nowIdx + 24) : [];

  return (
    <AppShell title="Weather">
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={async (e) => { setSearch(e.target.value); if (e.target.value.length > 2) setResults(await geocode(e.target.value)); else setResults([]); }}
            placeholder="Search city..."
            className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {results.length > 0 && (
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
              {results.map((r, i) => (
                <button key={i} onClick={() => { setLoc(r); setResults([]); setSearch(""); }} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-muted">{r.name}</button>
              ))}
            </div>
          )}
        </div>

        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${grad} p-6 text-white shadow-lg`}>
          <div className="flex items-center gap-1.5 text-xs font-medium opacity-90">
            <MapPin className="h-3.5 w-3.5" />{loc?.name ?? "…"}
          </div>
          {cur && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center justify-between">
              <div>
                <div className="font-serif text-6xl font-bold leading-none">{Math.round(cur.temperature_2m)}°</div>
                <div className="mt-2 text-sm opacity-90">{label(cur.weather_code)}</div>
                <div className="text-xs opacity-75">Feels like {Math.round(cur.apparent_temperature)}°</div>
              </div>
              <Icon className="h-24 w-24 opacity-95" strokeWidth={1.4} />
            </motion.div>
          )}
          {daily && (
            <div className="mt-4 border-t border-white/20 pt-3 text-xs opacity-90">
              H: {Math.round(daily.temperature_2m_max[0])}° &middot; L: {Math.round(daily.temperature_2m_min[0])}°
            </div>
          )}
        </div>

        {hourly && next24.length > 0 && (
          <section className="mt-6">
            <h3 className="mb-2 font-serif text-lg font-bold">Hourly</h3>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
              {next24.map((t: string, i: number) => {
                const idx = nowIdx + i;
                const HIcon = iconFor(hourly.weather_code[idx]);
                const d = new Date(t);
                return (
                  <div key={t} className="flex min-w-16 flex-col items-center gap-1 rounded-2xl border border-border bg-card px-3 py-3">
                    <div className="text-[11px] font-medium text-muted-foreground">{i === 0 ? "Now" : `${d.getHours()}:00`}</div>
                    <HIcon className="h-5 w-5" strokeWidth={1.7} />
                    <div className="font-serif text-sm font-bold">{Math.round(hourly.temperature_2m[idx])}°</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {daily && (
          <section className="mt-6">
            <h3 className="mb-2 font-serif text-lg font-bold">10-Day Forecast</h3>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {daily.time.map((t: string, i: number) => {
                const DIcon = iconFor(daily.weather_code[i]);
                const d = new Date(t);
                return (
                  <div key={t} className="flex items-center gap-3 border-b border-border/60 px-4 py-3 last:border-b-0">
                    <div className="w-14 text-sm font-semibold">{i === 0 ? "Today" : d.toLocaleDateString("en", { weekday: "short" })}</div>
                    <DIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.7} />
                    <div className="flex-1 text-xs text-muted-foreground">{daily.precipitation_probability_max[i]}% rain</div>
                    <div className="text-sm text-muted-foreground">{Math.round(daily.temperature_2m_min[i])}°</div>
                    <div className="w-10 text-right font-serif font-bold">{Math.round(daily.temperature_2m_max[i])}°</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {cur && daily && (
          <section className="mt-6 grid grid-cols-2 gap-3">
            <Stat icon={Wind} label="Wind" value={`${Math.round(cur.wind_speed_10m)} km/h`} />
            <Stat icon={Droplets} label="Humidity" value={`${cur.relative_humidity_2m}%`} />
            <Stat icon={Gauge} label="Pressure" value={`${Math.round(cur.surface_pressure)} hPa`} />
            <Stat icon={Sun} label="UV Index" value={`${daily.uv_index_max?.[0] ?? "—"}`} />
            <Stat icon={Sunrise} label="Sunrise" value={new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
            <Stat icon={Sunset} label="Sunset" value={new Date(daily.sunset[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
            {a.data?.current && (
              <>
                <Stat icon={Eye} label="AQI (US)" value={`${a.data.current.us_aqi ?? "—"}`} />
                <Stat icon={Eye} label="PM2.5" value={`${a.data.current.pm2_5?.toFixed(0) ?? "—"}`} />
              </>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />{label}
      </div>
      <div className="mt-1 font-serif text-xl font-bold">{value}</div>
    </div>
  );
}