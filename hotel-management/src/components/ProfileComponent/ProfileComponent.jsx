import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import styled from "styled-components";
import { Avatar } from "antd";

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
  font-weight: 500;
  color: #1a3353;
  
  @media (max-width: 680px) {
    display: none;
  }
`;

const ProfileComponent = () => {
  const { currentUser } = useAuth();

  return (
    <ProfileWrapper>
      <AvatarWrapper>
        <Avatar
          src="https://via.placeholder.com/40"
          alt="avatar"
          size="big"
        />
        <Username>
          {currentUser?.username || "User"}
        </Username>
      </AvatarWrapper>
    </ProfileWrapper>
  );
};

export default ProfileComponent;
