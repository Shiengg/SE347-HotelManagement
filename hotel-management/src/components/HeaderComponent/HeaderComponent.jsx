import React from "react";
import { Dropdown } from "antd";
import { WrapperHeader } from "./style";
import logo from "../../images/logo2.png";
import SearchComponent from "../SearchComponent/SearchComponent";
import { useAuth } from "../../contexts/AuthContext";

const HeaderComponent = () => {
  const { currentUser, logout } = useAuth();

  const menuItems = {
    items: [
      {
        key: '1',
        label: 'Profile'
      },
      {
        key: '2',
        label: 'Settings'
      },
      {
        key: '3',
        label: 'Logout',
        onClick: logout
      }
    ]
  };

  return (
    <WrapperHeader>
      <img
        id="logo"
        src={logo}
        alt="Logo"
        style={{ width: "170px", height: "auto", borderRadius: "8px" }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <SearchComponent />
        <Dropdown menu={menuItems} placement="bottomRight">
          <div style={{ cursor: 'pointer' }}>
            {currentUser?.name || 'User'}
          </div>
        </Dropdown>
      </div>
    </WrapperHeader>
  );
};

export default HeaderComponent;
