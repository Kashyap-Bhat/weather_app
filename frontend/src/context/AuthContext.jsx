import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/auth';
import { isAuthenticated, clearTokens, getAccessToken } from '../utils/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      const token = getAccessToken();
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.email });
      } catch {
        clearTokens();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    setUser({ email: data.email });
  }, []);

  const signup = useCallback(async (email, password) => {
    const data = await apiSignup(email, password);
    setUser({ email: data.email });
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
