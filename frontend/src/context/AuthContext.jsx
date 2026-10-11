import { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let cachedUser = null;
    const clearSession = () => {
      localStorage.removeItem('hx_user');
      localStorage.removeItem('hx_token');
      setUser(null);
    };

    const onUnauthorized = () => clearSession();
    window.addEventListener('auth:unauthorized', onUnauthorized);

    const validateSession = async () => {
      const token = localStorage.getItem('hx_token');
      const stored = localStorage.getItem('hx_user');

      if (stored) {
        try {
          cachedUser = JSON.parse(stored);
        } catch {
          clearSession();
        }
      }

      if (!token) {
        clearSession();
        if (active) setLoading(false);
        return;
      }

      try {
        const { data } = await API.get('/api/auth/me');
        if (!active) return;
        const nextUser = {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar || '',
          college: data.college || '',
        };
        localStorage.setItem('hx_user', JSON.stringify(nextUser));
        setUser(nextUser);
      } catch (error) {
        if (!active) return;
        if (error.response?.status === 401) {
          clearSession();
        } else if (cachedUser) {
          // Keep the signed-in shell available during a temporary API outage.
          setUser(cachedUser);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    validateSession();
    return () => {
      active = false;
      window.removeEventListener('auth:unauthorized', onUnauthorized);
    };
  }, []);

  const persist = (data) => {
    localStorage.setItem('hx_token', data.token);

    const nextUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar || '',
      college: data.college || '',
    };

    localStorage.setItem('hx_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const register = async (payload) => {
    const { data } = await API.post('/api/auth/register', {
      ...payload,
      name: String(payload.name || '').trim(),
      email: String(payload.email || '').trim().toLowerCase(),
    });

    // Do not save a token until verification and login are complete.
    return data;
  };

  const login = async (payload) => {
    const { data } = await API.post('/api/auth/login', {
      ...payload,
      email: String(payload.email || '').trim().toLowerCase(),
    });

    persist(data);
    return data;
  };

  const updateUser = (updates) => {
    setUser((previous) => {
      if (!previous) return previous;

      const next = { ...previous, ...updates };
      localStorage.setItem('hx_user', JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    localStorage.removeItem('hx_token');
    localStorage.removeItem('hx_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return context;
};
