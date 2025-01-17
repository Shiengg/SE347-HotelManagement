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

    // Xử lý đóng tab
    const handleTabClose = (event) => {
      // Chỉ xóa session khi thực sự đóng tab/window
      if (event.type === 'beforeunload') {
        const confirmationMessage = '';
        event.returnValue = confirmationMessage;     // Chuẩn
        return confirmationMessage;                  // Safari
      }
    };

    // Thêm event listener cho việc đóng tab
    window.addEventListener('beforeunload', handleTabClose);
    
    // Xử lý khi tab bị ẩn (chuyển tab khác)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Lưu thời điểm tab bị ẩn
        sessionStorage.setItem('tabHiddenTime', Date.now().toString());
      } else if (document.visibilityState === 'visible') {
        // Kiểm tra xem tab có bị đóng và mở lại không
        const hiddenTime = sessionStorage.getItem('tabHiddenTime');
        if (hiddenTime) {
          const currentTime = Date.now();
          const timeDiff = currentTime - parseInt(hiddenTime);
          // Nếu thời gian ẩn quá lâu (ví dụ: 1 giây), coi như tab đã được đóng và mở lại
          if (timeDiff > 1000) {
            sessionStorage.clear();
            navigate('/login', { replace: true });
          }
          sessionStorage.removeItem('tabHiddenTime');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate, location.pathname]);

  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      if (result.success) {
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