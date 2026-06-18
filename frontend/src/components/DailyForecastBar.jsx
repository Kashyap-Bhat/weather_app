import { getWeatherInfo } from '../utils/weatherCodes';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return DAYS[d.getDay()];
}

const RANGE_MIN = -5;
const RANGE_MAX = 40;
const RANGE = RANGE_MAX - RANGE_MIN;

function pct(value) {
  return Math.max(0, Math.min(100, ((value - RANGE_MIN) / RANGE) * 100));
}

export default function DailyForecastBar({ dailyForecast }) {
  if (!dailyForecast || dailyForecast.length === 0) return null;

  return (
    <div className="w-full mt-3">
      <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
        7-Day Forecast
      </p>
      <div
        className="rounded-xl divide-y"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        {dailyForecast.map((d, i) => {
          const info = getWeatherInfo(d.weatherCode);
          const left = pct(d.tempMin);
          const right = pct(d.tempMax);
          const barWidth = Math.max(4, right - left);
          return (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="w-20 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {formatDay(d.date)}
              </span>
              <span className="text-base w-6 text-center">{info.icon}</span>
              <div className="flex-1 flex items-center gap-2">
                <span
                  className="text-xs text-right w-8"
                  style={{ color: 'var(--cyan)', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {Math.round(d.tempMin)}°
                </span>
                <div className="flex-1 h-1.5 rounded-full relative" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      left: `${left}%`,
                      width: `${barWidth}%`,
                      backgroundColor: 'var(--amber)',
                    }}
                  />
                </div>
                <span
                  className="text-xs text-right w-8"
                  style={{ color: 'var(--amber)', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {Math.round(d.tempMax)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
