import { getAccessToken, setTokens, getRefreshToken, clearTokens } from '../utils/tokenStorage';

let isRefreshing = false;
let refreshPromise = null;

async function refreshTokens() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('No refresh token');

  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refresh }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error('Refresh failed');
  }

  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

export async function authFetch(url, options = {}) {
  const token = getAccessToken();
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && token) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshTokens().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    try {
      const newToken = await refreshPromise;
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers });
    } catch {
      clearTokens();
      window.location.reload();
      throw new Error('Session expired');
    }
  }

  return res;
}
