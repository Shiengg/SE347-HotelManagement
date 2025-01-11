import React from 'react';
import styled from 'styled-components';
const PaymentStatus = styled.div`
  color: ${(props) => (props.status ? "lime" : "red")};
  width: fit-content;
  border-radius: 5px;
  background: white;
  padding: 5px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const PaymentStatusComponent = ({status}) => {
  return (
<PaymentStatus status={status}>{status?"Paid":"Unpaid"}</PaymentStatus>
  );
};

export default PaymentStatusComponent;