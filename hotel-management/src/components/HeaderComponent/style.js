import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  gap: 24px;

  #logo {
    height: 40px;
    width: auto;
  }

  @media (max-width: 1600px) {
    #logo {
      display: none;
    }
  }
`;
