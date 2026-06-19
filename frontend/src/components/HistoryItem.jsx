import { getWeatherInfo } from '../utils/weatherCodes';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HistoryItem({ entry, index, compact, onSelect }) {
  const info = getWeatherInfo(entry.weatherCode);

  const handleClick = () => onSelect?.(entry.city);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(entry.city);
    }
  };

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 cursor-pointer"
        style={{
          animation: `fadeUp 0.3s ease-out ${0.03 + (index || 0) * 0.03}s forwards`,
          opacity: 0,
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Search weather for ${entry.city}`}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <span className="text-lg flex-shrink-0">{info.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {entry.city}
          </div>
          <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {info.label}
            {entry.searchedAt && ` · ${timeAgo(entry.searchedAt)}`}
          </div>
        </div>
        <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--amber)', fontFamily: "'JetBrains Mono', monospace" }}>
          {Math.round(entry.temperature)}°
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 transition-colors duration-200 cursor-pointer"
      style={{
        animation: `fadeUp 0.4s ease-out ${0.05 + (index || 0) * 0.04}s forwards`,
        opacity: 0,
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Search weather for ${entry.city}`}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <span className="text-lg flex-shrink-0">{info.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {entry.city}
        </div>
        <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
          {info.label}
          {entry.searchedAt && ` · ${timeAgo(entry.searchedAt)}`}
        </div>
      </div>
      <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--amber)', fontFamily: "'JetBrains Mono', monospace" }}>
        {Math.round(entry.temperature)}°C
      </span>
    </div>
  );
}
