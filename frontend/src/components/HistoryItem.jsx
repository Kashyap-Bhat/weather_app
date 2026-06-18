import { getWeatherInfo } from '../utils/weatherCodes';

export default function HistoryItem({ entry, index, compact }) {
  const info = getWeatherInfo(entry.weatherCode);

  if (compact) {
    return (
      <tr
        className="transition-colors duration-200"
        style={{
          borderBottom: '1px solid var(--border)',
          animation: `fadeUp 0.3s ease-out ${0.03 + (index || 0) * 0.03}s forwards`,
          opacity: 0,
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <td className="py-2 px-4">
          <span className="mr-1.5">{info.icon}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{entry.city}</span>
        </td>
        <td className="py-2 px-4 text-right" style={{ color: 'var(--amber)', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>
          {Math.round(entry.temperature)}°
        </td>
      </tr>
    );
  }

  return (
    <tr
      className="transition-colors duration-200"
      style={{
        borderBottom: '1px solid var(--border)',
        animation: `fadeUp 0.4s ease-out ${0.05 + (index || 0) * 0.04}s forwards`,
        opacity: 0,
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <td className="py-3.5 px-4">
        <span className="text-lg mr-2 align-middle">{info.icon}</span>
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{entry.city}</span>
      </td>
      <td className="py-3.5 px-4" style={{ color: 'var(--amber)', fontFamily: "'JetBrains Mono', monospace" }}>
        {Math.round(entry.temperature)}°C
      </td>
      <td className="py-3.5 px-4 text-sm hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>
        {info.label}
      </td>
    </tr>
  );
}
