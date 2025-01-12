import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.div`
  padding: 10px 0px;
  display: grid;
  align-items: center;
  grid-template-columns: auto 40%;

  @media (max-width: 1600px) {
    #logo {
      display: none;
    }
    grid-template-columns: 1fr;
  }
`;
