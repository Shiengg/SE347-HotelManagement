import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { routes } from "./index";
import { AuthProvider } from "./contexts/AuthContext";
import Sidebar from "./components/SidebarComponent/SidebarComponent";
import styled from "styled-components";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import authService from "./services/authService";
import LoginPage from "./pages/LoginPage/LoginPage";
import { useAuth } from "./contexts/AuthContext";

const AppWrapper = styled.div`
  min-height: fit-content;
  background-attachment: fixed;
`;
const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  height: fit-content;
  position: relative;
`;

const SidebarWrapper = styled.div`
position: sticky;
top:0;
  width: 280px;
  z-index: 100;
  height: 100vh;

  @media (max-width: 680px) {
    position: fixed;
    top: 0;
    left: 0;

    width: 60px;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 90;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const MainContent = styled.div`
  flex: 1;
  padding: 10px;

  @media (max-width: 680px) {
    padding: 5px;
  }
`;

// Tạo component riêng cho layout được bảo vệ
const ProtectedLayout = () => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  return (
    <LayoutWrapper>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
      <ContentWrapper>
        <HeaderWrapper>
          <HeaderComponent />
        </HeaderWrapper>
        <MainContent>
          <Routes>
            {routes.map((route) => {
              if (route.path === "/login" || route.path === "/") return null;

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
      </ContentWrapper>
    </LayoutWrapper>
  );
};

const AppContent = () => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
