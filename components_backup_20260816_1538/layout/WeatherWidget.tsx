"use client";

import { useEffect, useState } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Loader2 } from "lucide-react";

interface WeatherData {
  temperatureC: number;
  weatherCode: number;
}

// WMO weather codes -> icon + short label. https://open-meteo.com/en/docs
function describeCode(code: number): { icon: typeof Sun; label: string } {
  if (code === 0) return { icon: Sun, label: "Clear" };
  if (code <= 3) return { icon: Cloud, label: "Cloudy" };
  if (code === 45 || code === 48) return { icon: CloudFog, label: "Fog" };
  if (code >= 51 && code <= 67) return { icon: CloudRain, label: "Rain" };
  if (code >= 71 && code <= 77) return { icon: CloudSnow, label: "Snow" };
  if (code >= 80 && code <= 82) return { icon: CloudRain, label: "Showers" };
  if (code >= 95) return { icon: CloudLightning, label: "Storm" };
  return { icon: Cloud, label: "Cloudy" };
}

// Default location: New Delhi. A real deployment would derive this from the
// visitor's IP/geolocation rather than hardcoding it.
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;
const DEFAULT_CITY = "New Delhi";

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${DEFAULT_LAT}&longitude=${DEFAULT_LON}&current_weather=true`
        );
        if (!res.ok) throw new Error("weather fetch failed");
        const data = await res.json();
        if (!cancelled) {
          setWeather({
            temperatureC: Math.round(data.current_weather.temperature),
            weatherCode: data.current_weather.weathercode,
          });
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    load();
    const id = setInterval(load, 15 * 60 * 1000); // refresh every 15 min
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (failed) return null;

  if (!weather) {
    return (
      <span className="flex items-center gap-1.5 text-ink-300">
        <Loader2 size={12} className="animate-spin" />
      </span>
    );
  }

  const { icon: Icon, label } = describeCode(weather.weatherCode);

  return (
    <span className="flex items-center gap-1.5" title={`${label} in ${DEFAULT_CITY}`}>
      <Icon size={13} className="text-ink-300" />
      <span>
        {weather.temperatureC}°C {DEFAULT_CITY}
      </span>
    </span>
  );
}
