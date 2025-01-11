import { faCreditCard, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

const PaymentMethodContainer = styled.div`
  color: ${(props) =>
    props.method === 1 ? "lime" : props.method === 2 ? "blue" : "red"};
  width: fit-content;
  background: white;
  border-radius: 5px;
  display: flex;
  gap: 5px;
  font-weight: bold;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const PaymentMethodComponent = ({ method }) => {
  const getPaymentMethodText = (method) => {
    switch (method) {
      case 1:
        return "Cash";
      case 2:
        return "Credit";
      case 3:
        return "Debit";
      default:
        return "Unknown";
    }
  };

  return (
    <PaymentMethodContainer method={method}>
      {getPaymentMethodText(method)}{" "}
      <FontAwesomeIcon icon={method === 1 ? faMoneyBill : faCreditCard} />
    </PaymentMethodContainer>
  );
};

export default PaymentMethodComponent;
