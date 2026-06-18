import { getWeatherInfo } from '../utils/weatherCodes';
import HourlyForecastBar from './HourlyForecastBar';
import DailyForecastBar from './DailyForecastBar';

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  const info = getWeatherInfo(weather.weatherCode);

  return (
    <div
      className="w-full max-w-xl rounded-2xl border p-6 animate-scale-in"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-serif tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {weather.city}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{info.label}</p>
        </div>
        <span className="text-4xl">{info.icon}</span>
      </div>

      <div className="mb-6">
        <span
          className="text-6xl font-bold tracking-tighter"
          style={{ color: 'var(--amber)', fontFamily: "'JetBrains Mono', monospace" }}
        >
          {Math.round(weather.temperature)}°
        </span>
        <span className="text-lg ml-1" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>C</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Feels</p>
          <p className="text-lg font-semibold" style={{ color: 'var(--amber)', fontFamily: "'JetBrains Mono', monospace" }}>
            {Math.round(weather.feelsLike)}°
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Wind</p>
          <p className="text-lg font-semibold" style={{ color: 'var(--cyan)', fontFamily: "'JetBrains Mono', monospace" }}>
            {weather.windSpeed.toFixed(0)}
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Humidity</p>
          <p className="text-lg font-semibold" style={{ color: 'var(--rose)', fontFamily: "'JetBrains Mono', monospace" }}>
            {Math.round(weather.humidity)}%
          </p>
        </div>
      </div>

      <HourlyForecastBar forecast={weather.forecast} />
      <DailyForecastBar dailyForecast={weather.dailyForecast} />
    </div>
  );
}
