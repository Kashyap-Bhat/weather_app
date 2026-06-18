import { useState, useCallback, useEffect } from 'react';
import { fetchWeather, fetchHistory, clearHistory as clearHistoryApi } from '../api/weather';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch {
      // silent fail for history load
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const searchCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city);
      setWeather(data);
      await loadHistory();
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [loadHistory]);

  const clearAllHistory = useCallback(async () => {
    try {
      await clearHistoryApi();
      setHistory([]);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { weather, history, loading, error, searchCity, clearAllHistory };
}
