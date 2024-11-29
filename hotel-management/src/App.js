import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Sidebar from "./components/SidebarComponent/SidebarComponent"; // Đường dẫn phù hợp với dự án
import styled from "styled-components";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh; /* Toàn màn hình */
`;

const SidebarWrapper = styled.div`
  width: 250px;
  background-color: #ffffff;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 10px;
  background-color: #ffffff;
`;

function App() {
  return (
    <div>
      <HeaderComponent />
      <Router>
        <LayoutWrapper>
          {/* Sidebar */}
          <SidebarWrapper>
            <Sidebar />
          </SidebarWrapper>

          {/* Nội dung chính */}
          <MainContent>
            <Routes>
              {routes.map((route) => {
                const Page = route.page;
                return <Route key={route.path} path={route.path} element={<Page />} />;
              })}
            </Routes>
          </MainContent>
        </LayoutWrapper>
      </Router>
    </div>
  );
}

export default App;
