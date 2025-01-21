import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../utils/format/format";
import PaymentMethodComponent from "../PaymentMethodComponent/PaymentMethodComponent";
import PaymentStatusComponent from "../PaymentStatusComponent/PaymentStatusComponent";

const InvoiceItemContainer = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background: white;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.isSelected &&
    `background: linear-gradient(45deg, #ffd700, #ffed4a);
    border-color: #ffd700;
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);`}
  &:hover {
    background: ${(props) =>
      props.isSelected ? "linear-gradient(45deg, #ffd700, #ffed4a)" : "white"};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  align-items: center;

  @media (max-width: 1080px) {
    font-size: 1.2em;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    & > :nth-child(2n) {
      justify-self: end; /* Aligns items in the second column */
      text-align: right; /* Aligns text within the item */
    }
  }
`;

const InvoiceId = styled.div`
  font-weight: bold;
`;
const InvoiceDate = styled.div``;

const InvoiceTotal = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  text-align: right;

  @media (max-width: 1080px) {
    grid-column: span 2;
    font-size: 1.5em;
  }
`;

const InvoiceItemComponent = ({ item, isSelected, onClick }) => {
  return (
    <InvoiceItemContainer isSelected={isSelected} onClick={onClick}>
      <InvoiceId>{item.id}</InvoiceId>
      <InvoiceDate>{item.created_at}</InvoiceDate>
      <PaymentMethodComponent method={item.paymentMethod} />

      <PaymentStatusComponent status={item.paymentStatus} />
      <InvoiceTotal>{formatCurrency(item.totalAmount)}</InvoiceTotal>
    </InvoiceItemContainer>
  );
};

export default InvoiceItemComponent;
