import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Sidebar from "./components/SidebarComponent/SidebarComponent"; // Đường dẫn phù hợp với dự án
import styled from "styled-components";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";


const AppWrapper = styled.div`
  padding: 10px;
`
const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh; /* Toàn màn hình */
  width: 100%;

  gap: 20px;

  @media (max-width: 1600px) {
    display: grid; /* Chuyển sang kiểu grid trên mobile */
    grid-template-rows: auto 1fr;
    
    text-align: left;
  }
`;

const SidebarWrapper = styled.div`
  width: fit-content;
  background-color: #ffffff;

  @media (max-width: 1600px) {
    width: auto; /* Chiếm toàn bộ chiều rộng trên mobile */
  }
`;

const MainContent = styled.div`
  flex: 1;
  background-color: #ffffff;
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
                return <Route key={route.path} path={route.path} element={<Page />} />;
              })}
            </Routes>
          </MainContent>
        </LayoutWrapper>
      </Router>
    </AppWrapper>
  );
}

export default App;
