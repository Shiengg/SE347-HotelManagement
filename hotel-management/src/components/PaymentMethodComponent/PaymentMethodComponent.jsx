import { faCreditCard, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

const PaymentMethodContainer = styled.div`
  font-weight: 500;

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
  &.Debit {
    color: #ef4444;
    background: #fee2e2;
  }
  &.Credit {
    color: #6366f1;
    background: #e0e7ff;
  }
  &.Unknown {
    color: black;
    background: gray;
  }
`;
const PaymentMethodComponent = ({ method }) => {
  const getPaymentMethodText = (method) => {
    switch (method) {
      case "Cash":
        return "Cash";
      case "CreditCard":
        return "Credit";
      case "DebitCard":
        return "Debit";
      default:
        return "Unknown";
    }
  };

  return (
    <PaymentMethodContainer className={getPaymentMethodText(method)}>
      {getPaymentMethodText(method)}{" "}
      <FontAwesomeIcon icon={method === "Cash" ? faMoneyBill : faCreditCard} />
    </PaymentMethodContainer>
  );
};

export default PaymentMethodComponent;
