import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Định nghĩa logout trước
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isAuthenticated');
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Kiểm tra xem có phiên làm việc trong sessionStorage không
        const hasSession = sessionStorage.getItem('isAuthenticated');
        
        // Nếu không có phiên làm việc (trình duyệt mới mở)
        if (!hasSession) {
          logout();
          return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (user && token) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          
          if (location.pathname === '/login' || location.pathname === '/') {
            const dashboardPath = `/${user.role}/dashboard`;
            navigate(dashboardPath, { replace: true });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [navigate, location.pathname]);

  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        // Tạo phiên làm việc mới
        sessionStorage.setItem('isAuthenticated', 'true');
        
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        const dashboardPath = `/${result.user.role}/dashboard`;
        navigate(dashboardPath, { replace: true });
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
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