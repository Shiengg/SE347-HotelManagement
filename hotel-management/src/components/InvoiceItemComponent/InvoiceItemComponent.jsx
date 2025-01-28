import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, formatDate } from "../../utils/format/format";
import PaymentMethodComponent from "../PaymentMethodComponent/PaymentMethodComponent";
import PaymentStatusComponent from "../PaymentStatusComponent/PaymentStatusComponent";

// Pulse animation
const pulse = keyframes`
  0%, 100% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #f5f5f5;
  }
`;

const InvoiceItemContainer = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background: white;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 5px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.isSelected
      ? `background: linear-gradient(45deg, #ffd700, #ffed4a);
    border-color: #ffd700;
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `
      : `&:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }`}

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
const Placeholder = styled.div`
  height: 20px;
  border-radius: 5px;
  animation: ${pulse} 1.5s infinite;
  ${(props) => props.width && `width: ${props.width};`}
`;

const InvoiceId = styled.div`
  background: #ffffff70;
  border-radius: 5px;
  padding: 5px;
  width: fit-content;
  color: navy;
  font-weight: bold;
  font-size: 0.9em;
  word-break: break-all;
  @media (max-width: 1080px) {
    font-size: 0.8em;
  }
`;
const InvoiceDate = styled.div`
  background: #ffffff70;
  color: grey;
  border-radius: 5px;
  padding: 5px;
  width: fit-content;
  font-size: 0.8em;
`;

const InvoiceTotal = styled.div`
  background: #ffffff70;
  border-radius: 5px;
  padding: 5px;
  color: green;
  margin-left: auto;
  width: fit-content;
  font-size: 1.3em;
  font-weight: bold;
  text-align: center;

  @media (max-width: 1080px) {
    grid-column: span 2;
    font-size: 1.2em;
  }
`;

const TotalAmountPlaceholder = styled.div`
  height: 20px;
  border-radius: 5px;
  animation: ${pulse} 1.5s infinite;
  width: 200px;
  margin-left: auto;
  @media (max-width: 1080px) {
    grid-column: span 2;
  }
`;

const InvoiceItemComponent = ({
  isLoading = false,
  item,
  isSelected,
  onClick,
}) => {
  return isLoading ? (
    <InvoiceItemContainer isSelected={false} onClick={() => {}}>
      <Placeholder width="100px" />
      <Placeholder width="150px" />
      <Placeholder width="80px" />
      <Placeholder width="80px" />
      <TotalAmountPlaceholder />
    </InvoiceItemContainer>
  ) : (
    <InvoiceItemContainer isSelected={isSelected} onClick={onClick}>
      <InvoiceId>{item._id}</InvoiceId>
      <InvoiceDate>{formatDate(item.createdAt)}</InvoiceDate>
      <PaymentMethodComponent method={item.paymentMethod} />

      <PaymentStatusComponent status={item.paymentStatus} />
      <InvoiceTotal>{formatCurrency(item.totalAmount)}</InvoiceTotal>
    </InvoiceItemContainer>
  );
};

export default InvoiceItemComponent;
