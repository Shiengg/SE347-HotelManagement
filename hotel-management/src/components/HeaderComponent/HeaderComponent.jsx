import React from "react";
import { WrapperHeader } from "./style";

import SearchComponent from "../SearchComponent/SearchComponent";
import { useAuth } from "../../contexts/AuthContext";
import ProfileComponent from "../ProfileComponent/ProfileComponent";

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
      <SearchComponent />

      <ProfileComponent/>
    </WrapperHeader>
  );
};

export default HeaderComponent;
