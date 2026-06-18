import { getWeatherInfo } from '../utils/weatherCodes';

export default function HourlyForecastBar({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  const formatHour = (iso) => {
    const d = new Date(iso);
    const h = d.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}${ampm}`;
  };

  return (
    <div
      className="w-full mt-4 rounded-xl overflow-x-auto"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="flex gap-4 p-3 min-w-max">
        {forecast.map((h, i) => {
          const info = getWeatherInfo(h.weatherCode);
          return (
            <div key={i} className="flex flex-col items-center gap-1 min-w-[56px]">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {i === 0 ? 'Now' : formatHour(h.time)}
              </span>
              <span className="text-lg">{info.icon}</span>
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}
              >
                {Math.round(h.temperature)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
