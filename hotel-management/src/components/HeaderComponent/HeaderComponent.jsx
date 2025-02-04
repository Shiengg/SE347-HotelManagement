import React from "react";
import { WrapperHeader } from "./style";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import ProfileComponent from "../ProfileComponent/ProfileComponent";
import styled from "styled-components";

const StyledLogoutButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 8px 16px;
  height: auto;
  transition: all 0.3s ease;
  color: #666;

  &:hover {
    background: #fff1f0;
    border-color: #ff4d4f;
    color: #ff4d4f;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(255, 77, 79, 0.2);
  }

  .logout-icon {
    font-size: 16px;
  }

  .logout-text {
    font-size: 14px;
    font-weight: 500;
  }

  @media (max-width: 680px) {
    padding: 6px;
    min-width: 36px;
    width: 36px;
    height: 36px;
    justify-content: center;

    .logout-icon {
      margin: 0;
      font-size: 18px;
    }

    .logout-text {
      display: none;
    }
  }

  @media (max-width: 480px) {
    padding: 4px;
    min-width: 32px;
    width: 32px;
    height: 32px;

    .logout-icon {
      font-size: 16px;
    }
  }
`;

const WrapperContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 680px) {
    gap: 8px;
  }
`;

const HeaderComponent = () => {
  const { logout } = useAuth();

  return (
    <WrapperHeader>
      <WrapperContent>
        <ProfileComponent />
        <StyledLogoutButton onClick={logout}>
          <LogoutOutlined className="logout-icon" />
          <span className="logout-text">Log Out</span>
        </StyledLogoutButton>
      </WrapperContent>
    </WrapperHeader>
  );
};

export default HeaderComponent;
