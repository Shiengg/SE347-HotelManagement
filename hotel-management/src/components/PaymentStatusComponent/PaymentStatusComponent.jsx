import React from "react";
import styled from "styled-components";
const PaymentStatus = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: semibold;
  width: fit-content;
  height: fit-content;
  @media (max-width: 1080px) {
    font-size: 0.8em;
  }

  &.Paid {
    color: #10b981;
    background: #d1fae5;
  }
  &.Unpaid {
    color: #ef4444;
    background: #fee2e2;
  }
`;
const PaymentStatusComponent = ({ status }) => {
  return (
    <PaymentStatus className={`${status ? "Paid" : "Unpaid"}`}>{status ? "Paid" : "Unpaid"}</PaymentStatus>
  );
};

export default PaymentStatusComponent;
