import { faCreditCard, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

const PaymentMethodContainer = styled.div`

  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  width: fit-content;

  @media (max-width: 1080px) {
    font-size: 0.8em;
  }

  &.Cash {
    color: #10b981;
    background: #d1fae5;
  }
  &.Card {
    color: #6366f1;
    background: #e0e7ff;
  }
  &.Unknown {
    color: black;
    background: grey;
  }
`;
const PaymentMethodComponent = ({ method }) => {

  return (
    <PaymentMethodContainer className={method||"Unknown"}>
      <FontAwesomeIcon icon={method === "Cash" ? faMoneyBill : faCreditCard} />{" "}
      {method||"Unknown"}
    </PaymentMethodContainer>
  );
};

export default PaymentMethodComponent;
