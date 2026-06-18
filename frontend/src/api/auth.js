import { setTokens, clearTokens } from '../utils/tokenStorage';
import { authFetch } from './client';

const BASE_URL = '/api/auth';

export async function signup(email, password) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    let message;
    try {
      message = JSON.parse(text).message;
    } catch {
      message = text || 'Signup failed';
    }
    throw new Error(message);
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    let message;
    try {
      message = JSON.parse(text).message;
    } catch {
      message = text || 'Login failed';
    }
    throw new Error(message);
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function logout() {
  try {
    await authFetch(`${BASE_URL}/logout`, { method: 'POST' });
  } finally {
    clearTokens();
  }
}
