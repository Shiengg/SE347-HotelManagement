import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.div`
  padding: 10px 0px;
  display: grid;
  align-items: center;
  grid-template-columns: auto 60%;

  position: sticky;
  z-index: 100;
  top: 0;

  padding: 5px 10px;

  background: #ffcc0080;

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);

  @media (max-width: 680px) {
    #logo {
      display: none;
    }
    grid-template-columns: 1fr;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  gap: 10px;
  padding: 5px 10px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
  border-radius: 10px;
  background: white;
`;

export const LogoName = styled.div`
 font-family: Times New Roman;
  font-weight: bold;
  font-size: 1.8em;
  color: #FFDD1E;
`;
