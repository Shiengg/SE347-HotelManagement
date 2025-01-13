import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  border-radius: 40px;
  padding: 5px 15px;
  align-items: center;
  background-color: white;

  @media (max-width: 680px) {
    border-radius: 15px;
    padding: 5px;
  }
`;

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

export const RoleText = styled.div`
  font-size: 12px;
  color: #a0a0a0;
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 50px;
  padding: 10px;
  float: right;

   @media (max-width: 680px) {
    border-radius: 20px;
    padding: 5px;
  }
 
`;
