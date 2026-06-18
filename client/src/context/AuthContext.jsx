import { createContext, useContext, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);
const storedToken = localStorage.getItem('billpilot_token');
if (storedToken) setAuthToken(storedToken);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('billpilot_user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('billpilot_token', data.token);
    localStorage.setItem('billpilot_user', JSON.stringify(data.user));
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('billpilot_token');
    localStorage.removeItem('billpilot_user');
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

