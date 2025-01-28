import {
  faBed,
  faBusinessTime,
  faCreditCard,
  faMoneyBill,
  faReceipt,
  faSprayCan,
  faUser,
  faUserTie,
  faUtensils,
  faCoffee,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import PaymentMethodComponent from "../PaymentMethodComponent/PaymentMethodComponent";
import { formatCurrency, formatDate } from "../../utils/format/format";
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

  &.FoodandDrinks {
    background: linear-gradient(45deg, #ff7f50, #ff4500); /* Orange gradient */
  }
  &.Cleaning {
    background: linear-gradient(45deg, #d3d3d3, #a9a9a9); /* Gray gradient */
  }
  &.RoomReservation {
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
  word-break: break-all;
  font-weight: bold;
  font-size: 1.3em;
  color: navy;
  @media (max-width: 1080px) {
    font-size: 1em;
  }
`;

const InvoiceDate = styled.div`
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  padding: 10px;
  border-radius: 10px;
  opacity: 0.7;
  font-size: 1.1em;
  @media (max-width: 1080px) {
    font-size: 1em;
  }
`;

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
  font-size: 1em;
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

const InvoiceReceptionist = styled.div`
  text-transform: uppercase; /* Convert text to uppercase */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  padding: 10px;
  border-radius: 10px;
  opacity: 0.7;
  font-size: 1.1em;
`;
const InvoiceCustomer = styled.div`
  text-transform: uppercase; /* Convert text to uppercase */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  padding: 10px;
  border-radius: 10px;
  opacity: 0.7;
  font-size: 1.1em;
`;

const OrderedItemsContainer = styled.div`
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const OrderedItemTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: #333;
  padding: 5px 0;
`;

const OrderedItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  align-items: center;
  background: linear-gradient(45deg, #4b6cb7, #182848);
  color: white;
`;

const OrderedItemIcon = styled.div`
  width: 32px;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OrderedItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const OrderedItemName = styled.div`
  font-weight: bold;
  font-size: 1.1em;
`;

const OrderedItemDate = styled.div`
  font-size: 0.9em;
  opacity: 0.8;
`;

const OrderedItemCostLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: right;
`;

const InvoiceDetailComponent = ({ selectedInvoice }) => {
  const scrollRef = useRef(null);

  // Thêm hàm để gộp các món giống nhau
  const consolidateOrderedItems = (items) => {
    const itemMap = new Map();

    items.forEach(item => {
      const key = item.itemId;
      if (itemMap.has(key)) {
        const existingItem = itemMap.get(key);
        existingItem.quantity += item.quantity;
        existingItem.total += item.total;
        // Giữ lại thời gian đặt hàng gần nhất
        if (new Date(item.orderedAt) > new Date(existingItem.orderedAt)) {
          existingItem.orderedAt = item.orderedAt;
        }
      } else {
        itemMap.set(key, { ...item });
      }
    });

    return Array.from(itemMap.values());
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [selectedInvoice]);

  if (!selectedInvoice) return null;

  // Gộp các món giống nhau trước khi render
  const consolidatedItems = selectedInvoice.orderedItems ? 
    consolidateOrderedItems(selectedInvoice.orderedItems) : [];

  return (
    <InvoiceDetailLayout ref={scrollRef}>
      <Header>
        <IconWrapper>
          <FontAwesomeIcon icon={faReceipt} size="xl" />
        </IconWrapper>
        <InvoiceId>
          {" "}
          <span style={{ "fontSize": "1.2em" }}>ID:</span>{" "}
          {selectedInvoice?._id}
        </InvoiceId>
      </Header>

      <InvoiceDate>Date: {formatDate(selectedInvoice?.createdAt)}</InvoiceDate>
      <InvoiceReceptionist>
        <FontAwesomeIcon icon={faUserTie} size="xl" />
        {selectedInvoice?.bookingID.receptionistID.fullname}
      </InvoiceReceptionist>
      <InvoiceCustomer>
        <FontAwesomeIcon icon={faUser} size="xl" />
        {selectedInvoice?.bookingID.customerID.fullname}
      </InvoiceCustomer>
      <ServiceListContainer>
        {selectedInvoice?.bookingID?.services?.map((service) => (
          <ServiceItem
            key={service.serviceID._id}
            className={`${service.serviceID.serviceName.replace(/\s+/g, "")}`}
          >
            <ServiceIcon>
              <FontAwesomeIcon
                icon={
                  service.serviceID.serviceName === "Food and Drinks"
                    ? faUtensils
                    : service.serviceID.serviceName === "Cleaning"
                    ? faSprayCan
                    : faBed
                }
                size="xl"
              />
            </ServiceIcon>
            <ServiceName>{service.serviceID.serviceName}</ServiceName>
            <ServiceCostLayout>
              <ServiceCost>
                {formatCurrency(service.serviceID.servicePrice)}
              </ServiceCost>
              <ServiceQuantity>x{service.quantity}</ServiceQuantity>
            </ServiceCostLayout>
          </ServiceItem>
        ))}
      </ServiceListContainer>
      {selectedInvoice?.orderedItems && selectedInvoice.orderedItems.length > 0 && (
        <OrderedItemsContainer>
          <OrderedItemTitle>Ordered Items</OrderedItemTitle>
          {consolidatedItems.map((item) => (
            <OrderedItem key={item.itemId}>
              <OrderedItemIcon>
                <FontAwesomeIcon icon={faCoffee} size="xl" />
              </OrderedItemIcon>
              <OrderedItemDetails>
                <OrderedItemName>{item.name}</OrderedItemName>
                <OrderedItemDate>
                  {formatDate(item.orderedAt)}
                </OrderedItemDate>
              </OrderedItemDetails>
              <OrderedItemCostLayout>
                <ServiceCost>{formatCurrency(item.total)}</ServiceCost>
                <ServiceQuantity>x{item.quantity}</ServiceQuantity>
              </OrderedItemCostLayout>
            </OrderedItem>
          ))}
        </OrderedItemsContainer>
      )}
      <PaymentMethodLayout>
        Payment method:{" "}
        <PaymentMethodComponent method={selectedInvoice?.paymentMethod} />
      </PaymentMethodLayout>
      <PaymentStatusLayout>
        Status:{" "}
        <PaymentStatusComponent status={selectedInvoice?.paymentStatus} />
      </PaymentStatusLayout>
      <Divider />

      <InvoiceTotalContainer>
        <div>Total:</div> {formatCurrency(selectedInvoice?.totalAmount)}
      </InvoiceTotalContainer>
    </InvoiceDetailLayout>
  );
};

export default InvoiceDetailComponent;
