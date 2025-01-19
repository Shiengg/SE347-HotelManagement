import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import styled from "styled-components";
import { Avatar, Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const ProfileWrapper = styled.div`
  border-radius: 40px;
  padding: 5px;
  align-items: center;
  background-color: white;

  @media (max-width: 680px) {
    border-radius: 15px;
    padding: 5px;
  }
`;

export const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Username = styled.div`
  cursor: pointer;
  @media (max-width: 680px) {
    display: none;
  }
`;
export const OptionButton = styled.div`
  cursor: pointer;
  @media (max-width: 680px) {
    display: none;
  }
`;

const ProfileComponent = () => {
  const { currentUser, logout } = useAuth();

  const menuItems = {
    items: [
      {
        key: "1",
        label: "Profile",
      },
      {
        key: "2",
        label: "Settings",
      },
      {
        key: "3",
        label: "Logout",
        onClick: logout,
      },
    ],
  };
  return (
    <ProfileWrapper>
      <Dropdown menu={menuItems} placement="bottomRight">
        <AvatarWrapper>
          <Avatar
            src="https://via.placeholder.com/40"
            alt="avatar"
            size="big"
          />
          <Username>{currentUser?.name || "User"}</Username>
          <OptionButton><FontAwesomeIcon icon={faBars} style={{ margin: "10px" }} /></OptionButton>
        </AvatarWrapper>
      </Dropdown>
    </ProfileWrapper>
  );
};

export default ProfileComponent;
