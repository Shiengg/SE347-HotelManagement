import styled from "styled-components";
import { Input } from "antd";
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 10px;
  width: 100%;
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 40px;
  padding: 5px 15px;
  align-items: center;
  background-color: white;
  width:50%;
  height:100%;
  font-size:1.2em;

  @media (max-width: 680px) {
    border-radius: 15px;
    padding: 5px;
    width:100%;
  }
`;
export const SearchBox = styled(Input)`
              backgroundColor: transparent;
              outline: none;
              flex:1;
              
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
  flex: 1;

  @media (max-width: 680px) {
    border-radius: 20px;
    padding: 5px;
  }
`;
