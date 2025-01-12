import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../utils/format/format";
import PaymentMethodComponent from "../PaymentMethodComponent/PaymentMethodComponent";
import PaymentStatusComponent from "../PaymentStatusComponent/PaymentStatusComponent";

const InvoiceItemContainer = styled.div`
  border-radius: 10px;
  background: white;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 10px;
  cursor: pointer;
  ${(props) =>
    props.isSelected ? "background-color: grey; color: white;" : ""}
  &:hover {
    background-color: grey; /* Use camelCase for CSS properties */
    color: white; /* Optional: adjust text color for contrast */
  }
  transition: background-color 0.1s;
  align-items: center;

  @media (max-width: 680px) {
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
const InvoiceDate = styled.div`
  opacity: 0.7;
`;

const InvoiceTotal = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  text-align: right;

  @media (max-width: 680px) {
    grid-column: span 2;
    font-size: 1.5em;
  }
`;

const InvoiceItemComponent = ({ item, isSelected, onClick }) => {
  return (
    <InvoiceItemContainer isSelected={isSelected} onClick={onClick}>
      <InvoiceId>{item.id}</InvoiceId>
      <InvoiceDate>{item.date}</InvoiceDate>
      <PaymentMethodComponent method={item.method} />

      <PaymentStatusComponent status={item.status} />
      <InvoiceTotal>{formatCurrency(item.total)}</InvoiceTotal>
    </InvoiceItemContainer>
  );
};

export default InvoiceItemComponent;
