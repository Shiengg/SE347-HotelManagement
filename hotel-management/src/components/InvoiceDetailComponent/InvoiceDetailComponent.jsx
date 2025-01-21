import {
  faBed,
  faCreditCard,
  faMoneyBill,
  faReceipt,
  faSprayCan,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import PaymentMethodComponent from "../PaymentMethodComponent/PaymentMethodComponent";
import { formatCurrency } from "../../utils/format/format";
import PaymentStatusComponent from "../PaymentStatusComponent/PaymentStatusComponent";
import { use } from "react";

const Header = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const ServiceListContainer = styled.div`
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  padding: 10px;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const ServiceItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #f0f0f0;

  align-items: center;
  color: white;

  &.service-1 {
    background: linear-gradient(45deg, #ff7f50, #ff4500); /* Orange gradient */
  }
  &.service-2 {
    background: linear-gradient(45deg, #d3d3d3, #a9a9a9); /* Gray gradient */
  }
  &.service-3 {
    background: linear-gradient(45deg, #32cd32, #228b22); /* Green gradient */
  }
`;

const InvoiceDetailLayout = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  gap: 10px;
`;

const InvoiceId = styled.div`
  font-weight: bold;
  font-size: 1.5em;

  @media (max-width: 680px) {
    font-size: 1.2em;
  }
`;

const InvoiceDate = styled.div`
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  padding: 10px;
  border-radius: 10px;
  opacity: 0.7;
  font-size: 1.1em;
`;

const InvoiceCustomer = styled.div``;
const InvoiceReceptionist = styled.div``;

const ServiceName = styled.div`
  text-align: left;
  font-weight: bold;
  font-size: 1.2em;
`;
const ServiceCostLayout = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-direction: column;
  text-align: right;
`;

const ServiceCost = styled.div`
  font-size: 1.2em;
  font-weight: semi-bold;
`;
const ServiceQuantity = styled.div`
  font-size: 0.8em;
  font-weight: semi-bold;
  opacity: 0.7;
`;
const ServiceIcon = styled.div`
  width: 32px;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PaymentMethodLayout = styled.div`
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  padding: 10px;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
`;

const PaymentStatusLayout = styled.div`
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  padding: 10px;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
`;

const Divider = styled.div`
  height: 2px;
  background: black;
`;

const InvoiceTotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  font-size: 1.5em;
  background: black;
  align-items: center;
  border-radius: 10px;
  color: white;
`;
const InvoiceDetailComponent = ({ selectedInvoice }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [selectedInvoice]);
  return (
    <InvoiceDetailLayout ref={scrollRef}>
      <Header>
        <IconWrapper>
          <FontAwesomeIcon icon={faReceipt} size="xl" />
        </IconWrapper>
        <InvoiceId>Invoice:{selectedInvoice.id}</InvoiceId>
      </Header>
      <InvoiceDate>Date: {selectedInvoice.created_at}</InvoiceDate>
      <InvoiceCustomer></InvoiceCustomer>
      <InvoiceReceptionist></InvoiceReceptionist>
      <ServiceListContainer>
        {selectedInvoice.services.map((service) => (
          <ServiceItem key={service.id} className={`service-${service.id}`}>
            <ServiceIcon serviceId={service.id}>
              <FontAwesomeIcon
                icon={
                  service.id === 1
                    ? faUtensils
                    : service.id === 2
                    ? faSprayCan
                    : faBed
                }
                size="xl"
              />
            </ServiceIcon>
            <ServiceName>{service.name}</ServiceName>
            <ServiceCostLayout>
              <ServiceCost>{formatCurrency(service.price)}</ServiceCost>
              <ServiceQuantity>x{service.quantity}</ServiceQuantity>
            </ServiceCostLayout>
          </ServiceItem>
        ))}
      </ServiceListContainer>
      <PaymentMethodLayout>
        Payment method:{" "}
        <PaymentMethodComponent method={selectedInvoice.paymentMethod} />
      </PaymentMethodLayout>
      <PaymentStatusLayout>
        Status:{" "}
        <PaymentStatusComponent status={selectedInvoice.paymentStatus} />
      </PaymentStatusLayout>
      <Divider />

      <InvoiceTotalContainer>
        <div>Total:</div> {formatCurrency(selectedInvoice.totalAmount)}
      </InvoiceTotalContainer>
    </InvoiceDetailLayout>
  );
};

export default InvoiceDetailComponent;
