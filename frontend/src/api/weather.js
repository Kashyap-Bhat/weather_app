import { authFetch } from './client';

const BASE_URL = '/api';

export async function fetchWeather(city) {
  const res = await authFetch(`${BASE_URL}/weather?city=${encodeURIComponent(city)}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch weather data' }));
    throw new Error(error.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function suggestCities(query, lat, lon) {
  if (!query || query.length < 1) return [];
  try {
    let url = `${BASE_URL}/weather/cities?q=${encodeURIComponent(query)}`;
    if (lat != null && lon != null) url += `&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchHistory() {
  const res = await authFetch(`${BASE_URL}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function clearHistory() {
  const res = await authFetch(`${BASE_URL}/history`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear history');
}
