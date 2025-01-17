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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          // Chỉ chuyển hướng khi ở trang login hoặc trang gốc
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

    // Chỉ xử lý sự kiện beforeunload khi đóng tab
    const handleBeforeUnload = (e) => {
      if (e.persisted) {
        return; // Không làm gì nếu là reload
      }
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate, location.pathname]);

  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      if (result.success) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        // Chuyển hướng đến dashboard sau khi đăng nhập
        const dashboardPath = `/${result.user.role}/dashboard`;
        navigate(dashboardPath, { replace: true });
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
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