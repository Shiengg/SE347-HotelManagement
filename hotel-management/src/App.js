import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Sidebar from "./components/SidebarComponent/SidebarComponent"; // Đường dẫn phù hợp với dự án
import styled from "styled-components";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";

const AppWrapper = styled.div`
  background: linear-gradient(to bottom, #e2e8f0, #ffcc60);
  min-height: fit-content;
  background-attachment: fixed;
`;
const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr; 

  min-height: 100vh;
  gap: 20px;

  padding: 10px;

  @media (max-width: 1600px) {
    grid-template-columns: 1fr; /* Chuyển sang kiểu grid trên mobile 
    grid-template-rows: auto 1fr;

    text-align: left;
  }
`;

const SidebarWrapper = styled.div`
  position: sticky;
  top: 90px;

  z-index: 90;
  width: fit-content;

  @media (max-width: 1600px) {
    width: auto; /* Chiếm toàn bộ chiều rộng trên mobile */
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

function App() {
  return (
    <AppWrapper>
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
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<Page />}
                  />
                );
              })}
            </Routes>
          </MainContent>
        </LayoutWrapper>
      </Router>
    </AppWrapper>
  );
}

export default App;
