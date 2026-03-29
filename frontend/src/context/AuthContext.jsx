import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('luxora_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (_) {
        localStorage.removeItem('luxora_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setUser(data);
    localStorage.setItem('luxora_user', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authApi.register(name, email, password);
    setUser(data);
    localStorage.setItem('luxora_user', JSON.stringify(data));
    return data;
  };

  const googleLogin = async (token) => {
    const data = await authApi.googleLogin(token);
    setUser(data);
    localStorage.setItem('luxora_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxora_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
