import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(`/${currentUser.role}/dashboard`, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const { success, data, error } = await authService.login(username, password);
      
      if (success && data.user) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        navigate(`/${data.user.role}/dashboard`, { replace: true });
        return { success: true };
      }
      
      return { success: false, error };
    } catch (err) {
      return { success: false, error: 'Login failed' };
    }
  }, [navigate]);

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 