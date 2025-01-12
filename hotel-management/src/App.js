import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { routes } from './index';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from "./components/SidebarComponent/SidebarComponent";
import styled from "styled-components";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import authService from "./services/authService";
import LoginPage from "./pages/LoginPage/LoginPage";
import { useAuth } from './contexts/AuthContext';

const AppWrapper = styled.div`
  padding: 10px;
`;

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  gap: 20px;

  @media (max-width: 1600px) {
    display: grid;
    grid-template-rows: auto 1fr;
    text-align: left;
  }
`;

const SidebarWrapper = styled.div`
  width: fit-content;
  background-color: #ffffff;

  @media (max-width: 1600px) {
    width: auto;
  }
`;

const MainContent = styled.div`
  flex: 1;
  background-color: #ffffff;
`;

// Tạo component riêng cho layout được bảo vệ
const ProtectedLayout = () => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  return (
    <>
      <HeaderComponent />
      <LayoutWrapper>
        <SidebarWrapper>
          <Sidebar />
        </SidebarWrapper>
        <MainContent>
          <Routes>
            {routes.map((route) => {
              if (route.path === '/login' || route.path === '/') return null;
              
              const Component = route.page;
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ProtectedRoute roles={route.roles}>
                      <Component />
                    </ProtectedRoute>
                  }
                />
              );
            })}
          </Routes>
        </MainContent>
      </LayoutWrapper>
    </>
  );
};

const AppContent = () => {
  const { isAuthenticated, currentUser } = useAuth();
  
  return (
    <AppWrapper>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={`/${currentUser?.role}/dashboard`} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${currentUser?.role}/dashboard`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <ProtectedLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </AppWrapper>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
