import { useState, useRef, useEffect } from 'react';
import { suggestCities } from '../api/weather';

export default function SearchBar({ onSearch, loading, history }) {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentCities, setRecentCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const skipNextFetch = useRef(false);
  const lastSearched = useRef('');
  const locationRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation || locationRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => { locationRef.current = { lat: pos.coords.latitude, lon: pos.coords.longitude }; },
      () => {}
    );
  }, []);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    if (city.trim().length < 1) {
      setSuggestions([]);
      setRecentCities([]);
      setShowDropdown(false);
      return;
    }
    const q = city.trim().toLowerCase();
    const seen = new Set();
    const recent = [];
    for (const h of history || []) {
      if (h.city.toLowerCase().includes(q) && !seen.has(h.city)) {
        seen.add(h.city);
        recent.push(h);
        if (recent.length >= 5) break;
      }
    }
    setRecentCities(recent);

    let cancelled = false;
    const loc = locationRef.current;
    suggestCities(city.trim(), loc?.lat, loc?.lon).then((results) => {
      if (!cancelled) {
        setSuggestions(results);
        setShowDropdown(
          (results.length > 0 || recent.length > 0) &&
          city.trim() !== lastSearched.current
        );
        setActiveIdx(-1);
      }
    }).catch(() => {
      if (!cancelled) {
        setSuggestions([]);
        setShowDropdown(recent.length > 0 && city.trim() !== lastSearched.current);
      }
    });
    return () => { cancelled = true; };
  }, [city, history]);

  useEffect(() => {
    if (city !== lastSearched.current) {
      lastSearched.current = '';
    }
  }, [city]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const itemCount = recentCities.length + suggestions.length;

  const dismissDropdown = () => {
    setShowDropdown(false);
    setSuggestions([]);
    setRecentCities([]);
    setActiveIdx(-1);
  };

  const selectCity = (name) => {
    lastSearched.current = name;
    skipNextFetch.current = true;
    setCity(name);
    dismissDropdown();
    onSearch(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIdx >= 0) {
      const recent = recentCities.length;
      if (activeIdx < recent) {
        selectCity(recentCities[activeIdx].city);
        return;
      }
      selectCity(suggestions[activeIdx - recent].name);
      return;
    }
    const trimmed = city.trim();
    if (!trimmed) return;
    lastSearched.current = trimmed;
    skipNextFetch.current = true;
    dismissDropdown();
    onSearch(trimmed);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (i < itemCount - 1 ? i + 1 : i));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (i > 0 ? i - 1 : 0));
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const hasRecent = recentCities.length > 0;
  const hasSuggestions = suggestions.length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md animate-scale-in relative z-10">
      <div ref={wrapperRef} className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search a city..."
          disabled={loading}
          autoComplete="off"
          className="w-full px-4 py-3 rounded-lg border outline-none transition-all duration-300 text-sm"
          style={{
            backgroundColor: 'var(--bg-input)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--amber)'; e.target.style.boxShadow = '0 0 0 3px var(--amber-glow)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
        />
        {showDropdown && (hasRecent || hasSuggestions) && (
          <div
            className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border overflow-hidden z-50"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            {hasRecent && (
              <>
                <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Recent
                </div>
                {recentCities.map((h, i) => (
                  <button
                    type="button"
                    key={`recent-${h.city}`}
                    onMouseDown={() => selectCity(h.city)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className="w-full text-left px-4 py-2 text-sm transition-colors"
                    style={{
                      backgroundColor: i === activeIdx ? 'var(--bg-card-hover)' : 'transparent',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span className="font-medium">{h.city}</span>
                    <span className="ml-2" style={{ color: 'var(--text-muted)' }}>— {Math.round(h.temperature)}°</span>
                  </button>
                ))}
              </>
            )}
            {hasRecent && hasSuggestions && (
              <div className="mx-3 my-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
            )}
            {hasSuggestions && (
              <>
                <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Suggestions
                </div>
                {suggestions.map((s, i) => {
                  const idx = recentCities.length + i;
                  return (
                    <button
                      type="button"
                      key={`${s.latitude}-${s.longitude}`}
                      onMouseDown={() => selectCity(s.name)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{
                        backgroundColor: idx === activeIdx ? 'var(--bg-card-hover)' : 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span className="font-medium">{s.name}</span>
                      {s.admin1 && <span className="ml-1.5" style={{ color: 'var(--text-muted)' }}>{s.admin1},</span>}
                      <span className="ml-1" style={{ color: 'var(--text-muted)' }}>{s.country}</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || !city.trim()}
        className="px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          backgroundColor: loading ? 'var(--bg-card)' : 'var(--amber)',
          color: loading ? 'var(--text-muted)' : '#0B0D14',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
        }}
        onMouseEnter={(e) => { if (!loading && city.trim()) { e.target.style.backgroundColor = '#D97706'; e.target.style.transform = 'translateY(-1px)'; }}}
        onMouseLeave={(e) => { if (!loading) { e.target.style.backgroundColor = loading ? 'var(--bg-card)' : 'var(--amber)'; e.target.style.transform = 'none'; }}}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full inline-block pulse-dot" style={{ backgroundColor: 'var(--text-muted)' }}></span>
            <span className="w-1.5 h-1.5 rounded-full inline-block pulse-dot" style={{ backgroundColor: 'var(--text-muted)' }}></span>
            <span className="w-1.5 h-1.5 rounded-full inline-block pulse-dot" style={{ backgroundColor: 'var(--text-muted)' }}></span>
          </span>
        ) : 'Search'}
      </button>
    </form>
  );
}
