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

  .anticon {
    font-size: 16px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }

  @media (max-width: 680px) {
    padding: 8px;
    span {
      display: none;
    }
  }
`;

const HeaderComponent = () => {
  const { logout } = useAuth();

  return (
    <WrapperHeader>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ProfileComponent />
        <StyledLogoutButton 
          onClick={logout}
          icon={<LogoutOutlined />}
        >
          <span>Log Out</span>
        </StyledLogoutButton>
      </div>
    </WrapperHeader>
  );
};

export default HeaderComponent;
