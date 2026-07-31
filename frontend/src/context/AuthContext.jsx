import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem('th_access_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await client.get('/auth/me');
      setUser(data.user);
      setCompany(data.company);
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMe(); }, [loadMe]);

  const login = async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    localStorage.setItem('th_access_token', data.accessToken);
    localStorage.setItem('th_refresh_token', data.refreshToken);
    setUser(data.user);
    await loadMe();
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await client.post('/auth/register', payload);
    localStorage.setItem('th_access_token', data.accessToken);
    localStorage.setItem('th_refresh_token', data.refreshToken);
    setUser(data.user);
    setCompany(data.company);
    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setCompany(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, company, loading, login, register, logout, refresh: loadMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
