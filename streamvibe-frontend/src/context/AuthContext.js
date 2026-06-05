import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser, adminLogin } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const saved = localStorage.getItem('streamvibe_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keeps localStorage + state in sync
  const setUser = (updatedUser) => {
    if (updatedUser) {
      localStorage.setItem('streamvibe_user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('streamvibe_user');
    }
    setUserState(updatedUser);
  };

  // Register
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      await registerUser({ name, email, password });
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed!');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await loginUser({ email, password });
      setUser(data);
      return { success: true, role: data.role };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed!');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Admin Login
  const loginAdmin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await adminLogin({ email, password });
      setUser(data);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed!');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  // Derived subscription status — reads from user object (persisted in localStorage)
  const isSubscribed = user?.subscription?.isActive === true || user?.isSubscribed === true;

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      error,
      register,
      login,
      loginAdmin,
      logout,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
      isSubscribed,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);