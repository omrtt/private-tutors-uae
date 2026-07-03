import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع';
    if (err.response?.status !== 401) toast.error(msg);
    return Promise.reject(err);
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';

  useEffect(() => {
    if (token) {
      axios.get('/api/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => { localStorage.removeItem('token'); setToken(null); setUser(null); })
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, [token]);

  const login = async (phone, password) => {
    const res = await axios.post('/api/auth/login', { phone, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await axios.post('/api/auth/register', data);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
