import {
  faBed,
  faCreditCard,
  faMoneyBill,
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

const ServiceListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: darkgray;
  inner-shadow: 4px 4px 6px rgba(0, 0, 0, 1);
  min-height: 100px;
`;

const ServiceItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: white;
  align-items: center;
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
`

const InvoiceDate = styled.div`
  opacity: 0.7;
  font-size: 1.1em;
`

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
  color: ${(props) =>
    props.serviceId === 1
      ? "orange"
      : props.serviceId === 2
      ? "gray"
      : "green"};
`;

const PaymentMethodLayout = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
`;

const PaymentStatusLayout = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
`;

const Divider = styled.div`
  height: 2px;
  background: black;
`

const InvoiceTotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  font-size: 1.5em;
  background: black;
  align-items: center;
  border-radius: 10px;
  color: white;
`
const InvoiceDetailComponent = ({ selectedInvoice }) => {

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedInvoice]);
  return (
    <InvoiceDetailLayout ref={scrollRef}>
      <InvoiceId>Invoice:{selectedInvoice.id}</InvoiceId>
      <InvoiceDate>Date: {selectedInvoice.date}</InvoiceDate>
      <ServiceListContainer>
        {selectedInvoice.services.map((service) => (
          <ServiceItem key={service.id}>
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
        <PaymentMethodComponent method={selectedInvoice.method} />
      </PaymentMethodLayout>
      <PaymentStatusLayout>
        Status: <PaymentStatusComponent status={selectedInvoice.status}/>
      </PaymentStatusLayout>
      <Divider />

      <InvoiceTotalContainer>
        <div>Total:</div> {formatCurrency(selectedInvoice.total)}
      </InvoiceTotalContainer>
    </InvoiceDetailLayout>
  );
};

export default InvoiceDetailComponent;
