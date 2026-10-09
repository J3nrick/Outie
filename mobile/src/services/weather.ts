import type { Forecast } from "../data/outing.ts";
export const WEATHER_MAX_AGE = 3 * 3600000;
export function forecastIsFresh(f: Forecast | undefined, latitude: number, longitude: number, now: number) {
  return !!f && f.latitude === latitude && f.longitude === longitude &&
    f.fetchedAt <= now && now - f.fetchedAt < WEATHER_MAX_AGE &&
    f.hours.some(h => h.at >= now - 3600000);
}
export function parseForecast(raw: unknown, latitude: number, longitude: number, now: number): Forecast {
  const d = raw as { utc_offset_seconds?: number; hourly?: { time?: number[]; precipitation_probability?: number[]; precipitation?: number[] } };
  const h = d?.hourly;
  if (!h || !Array.isArray(h.time) || !Array.isArray(h.precipitation_probability) || !Array.isArray(h.precipitation) ||
      h.time.length !== h.precipitation_probability.length || h.time.length !== h.precipitation.length ||
      !Number.isFinite(d.utc_offset_seconds) || h.time.length > 200 || !h.time.length)
    throw new Error("The weather provider returned an invalid forecast.");
  const hours = h.time.map((seconds, i) => {
    const rainChance = h.precipitation_probability![i], precipitation = h.precipitation![i];
    if (!Number.isFinite(seconds) || typeof rainChance !== "number" || !Number.isFinite(rainChance) || rainChance < 0 || rainChance > 100 ||
        typeof precipitation !== "number" || !Number.isFinite(precipitation) || precipitation < 0)
      throw new Error("The weather provider returned invalid rain data.");
    return { at: seconds * 1000, rainChance, precipitation };
  });
  if (hours.some((h, i) => i > 0 && h.at <= hours[i - 1].at)) throw new Error("Forecast hours are out of order.");
  return { provider: "Open-Meteo", latitude, longitude, fetchedAt: now, utcOffsetSeconds: d.utc_offset_seconds!, hours };
}
export function rainToday(f: Forecast, now: number, threshold: number) {
  const localDay = Math.floor((now + f.utcOffsetSeconds * 1000) / 86400000);
  return f.hours.some(h => h.at >= now - 3600000 &&
    Math.floor((h.at + f.utcOffsetSeconds * 1000) / 86400000) === localDay &&
    h.rainChance >= threshold);
}
export async function fetchForecast(latitude: number, longitude: number): Promise<Forecast> {
  if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180)
    throw new Error("Save a valid Home location before connecting weather.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude),
      hourly: "precipitation_probability,precipitation", forecast_days: "2", timezone: "auto", timeformat: "unixtime" });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Weather is unavailable (${response.status}).`);
    return parseForecast(await response.json(), latitude, longitude, Date.now());
  } finally { clearTimeout(timeout); }
}
