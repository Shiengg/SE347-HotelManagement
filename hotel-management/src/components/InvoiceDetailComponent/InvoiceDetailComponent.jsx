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
  faHouse,
  faBowlFood,
  faMugHot,
  faCake,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PaymentMethodComponent from "../PaymentMethodComponent/PaymentMethodComponent";
import { formatCurrency, formatDate } from "../../utils/format/format";
import PaymentStatusComponent from "../PaymentStatusComponent/PaymentStatusComponent";
import { use } from "react";
import { Button, Select, Space, message } from "antd";
import authService from "../../services/authService";

const Header = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
`;

const IconWrapper = styled.div`
  padding: 10px;
  height:fit-content;
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 1.2em;
  gap: 5px;
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
  align-text: center;
  word-break: break-all;
  font-weight: bold;
  font-size: 1.1em;
  color: navy;
  @media (max-width: 1080px) {
    font-size: 1em;
  }
`;

const InvoiceDate = styled.div`
    background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding 10px;
  border-radius: 10px;
  opacity: 0.7;
`;

const ServiceTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: #333;
  padding: 5px 0;
`;

const ServiceName = styled.div`
  text-align: left;
  font-weight: bold;
  font-size: 1em;
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
  font-weight: bold;
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
  font-weight: bold;
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

  color: white;

  &.Food {
    background: linear-gradient(
      45deg,
      #28a745,
      #218838
    ); /* Fresh green gradient for food */
  }

  &.Beverage {
    background: linear-gradient(
      45deg,
      #007bff,
      #0056b3
    ); /* Vibrant blue gradient for beverages */
  }

  &.Dessert {
    background: linear-gradient(
      45deg,
      #ff5733,
      #c70039
    ); /* Bold red-orange gradient for desserts */
  }
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

const PaymentActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  justify-content: flex-end;
`;

const PaymentButton = styled(Button)`
  background: #1890ff;
  color: white;
  border: none;
  height: 40px;
  padding: 0 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #40a9ff;
  }

  &:disabled {
    background: #d9d9d9;
  }
`;

const PaymentMethodSelect = styled(Select)`
  width: 100%;
  .ant-select-selector {
    height: 40px !important;
    padding: 4px 11px !important;
    align-items: center;
  }
`;

const InvoiceDetailComponent = ({ selectedInvoice }) => {
  const scrollRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [processing, setProcessing] = useState(false);

  // Thêm hàm kiểm tra role
  const canConfirmPayment = () => {
    const currentUser = authService.getCurrentUser();
    return (
      currentUser &&
      (currentUser.role === "admin" || currentUser.role === "receptionist")
    );
  };

  const renderServices = (services) => (
    <ServiceListContainer>
      <ServiceTitle>Services</ServiceTitle>
      {services?.map((service) =>
        service.serviceID.serviceName === "Room Reservation" ? (
          <ServiceItem
            key={service.serviceID._id}
            className={`${service.serviceID.serviceName.replace(/\s+/g, "")}`}
          >
            <ServiceIcon>
              <FontAwesomeIcon icon={faBed} size="xl" />
            </ServiceIcon>
            <ServiceName>{service.serviceID.serviceName}</ServiceName>
            <ServiceCostLayout>
              <ServiceCost>
                {formatCurrency(
                  selectedInvoice.bookingID.bookingType === "Hourly"
                    ? selectedInvoice.bookingID.roomID.hourlyPrice
                    : selectedInvoice.bookingID.roomID.dailyPrice
                )}
              </ServiceCost>
              {selectedInvoice.bookingID.bookingType}
              <ServiceQuantity>
                x
                {selectedInvoice.bookingID.bookingType === "Hourly"
                  ? selectedInvoice.bookingID.totalHours
                  : selectedInvoice.bookingID.totalDays}
              </ServiceQuantity>
            </ServiceCostLayout>
          </ServiceItem>
        ) : (
          <ServiceItem
            key={service.serviceID._id}
            className={`${service.serviceID.serviceName.replace(/\s+/g, "")}`}
          >
            <ServiceIcon>
              <FontAwesomeIcon icon={faSprayCan} size="xl" />
            </ServiceIcon>
            <ServiceName>{service.serviceID.serviceName}</ServiceName>
            <ServiceCostLayout>
              <ServiceCost>
                {formatCurrency(service.serviceID.servicePrice)}
              </ServiceCost>
              <ServiceQuantity>x{service.quantity}</ServiceQuantity>
            </ServiceCostLayout>
          </ServiceItem>
        )
      )}
    </ServiceListContainer>
  );
  // Thêm hàm để gộp các món giống nhau
  const consolidateOrderedItems = (items) => {
    const itemMap = new Map();

    items.forEach((item) => {
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
  const consolidatedItems = selectedInvoice.orderedItems
    ? consolidateOrderedItems(selectedInvoice.orderedItems)
    : [];

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/invoices/${selectedInvoice._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            paymentStatus: "Paid",
            paymentMethod: paymentMethod,
            paymentDate: new Date(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      message.success("Payment processed successfully");
      // Reload trang sau khi thanh toán thành công
      window.location.reload();
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Failed to process payment");
    } finally {
      setProcessing(false);
    }
  };

  const renderOrders = (orders) => (
    <OrderedItemsContainer>
      <OrderedItemTitle>Ordered Items</OrderedItemTitle>
      {consolidatedItems.map((item) => (
        <OrderedItem key={item.itemId} className={item.category}>
          <OrderedItemIcon>
            <FontAwesomeIcon
              icon={
                item.category === "Food"
                  ? faBowlFood
                  : item.category === "Beverage"
                  ? faMugHot
                  : faCake
              }
              size="xl"
            />
          </OrderedItemIcon>
          <OrderedItemDetails>
            <OrderedItemName>{item.name}</OrderedItemName>
            <OrderedItemDate>{formatDate(item.orderedAt)}</OrderedItemDate>
          </OrderedItemDetails>
          <OrderedItemCostLayout>
            <ServiceCost>{formatCurrency(item.price)}</ServiceCost>
            <ServiceQuantity>x{item.quantity}</ServiceQuantity>
          </OrderedItemCostLayout>
        </OrderedItem>
      ))}
    </OrderedItemsContainer>
  );
  return (
    <InvoiceDetailLayout>
      <Header ref={scrollRef}>
        <IconWrapper>
          <FontAwesomeIcon icon={faHouse} />{" "}
          {selectedInvoice?.bookingID.roomID.roomNumber}
          {" - "}
          {selectedInvoice?.bookingID.roomID.roomType}
        </IconWrapper>
        <InvoiceId>
          {" "}
          <span style={{ fontSize: "1.2em" }}></span> {selectedInvoice?._id}
        </InvoiceId>
      </Header>

      <div
        style={{
          display: "grid",
          "grid-template-columns": "1fr 1fr",
          gap: "10px",
        }}
      >
        <InvoiceDate>
          <b>from:</b>{" "}
          {formatDate(selectedInvoice?.bookingID.checkInDate)}
        </InvoiceDate>
        <InvoiceDate>
          <b>to:</b>{" "}
          {formatDate(selectedInvoice?.bookingID.checkOutDate)}
        </InvoiceDate>
      </div>

      <InvoiceReceptionist>
        <FontAwesomeIcon icon={faUserTie} size="xl" />
        {selectedInvoice?.bookingID.receptionistID.fullname}
      </InvoiceReceptionist>
      <InvoiceCustomer>
        <FontAwesomeIcon icon={faUser} size="xl" />
        {selectedInvoice?.bookingID.customerID.fullname}
      </InvoiceCustomer>
      {renderServices(selectedInvoice.bookingID.services)}
      {renderOrders(selectedInvoice.orderedItems)}
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

      {/* Chỉ hiển thị phần Payment Actions nếu là admin/receptionist và invoice chưa thanh toán */}
      {selectedInvoice?.paymentStatus === "Unpaid" && canConfirmPayment() && (
        <>
          <PaymentMethodLayout>
            <div>Select Payment Method:</div>
            <PaymentMethodSelect
              value={paymentMethod}
              onChange={setPaymentMethod}
              style={{ width: "100%" }}
            >
              <Select.Option value="Cash">
                <Space>
                  <FontAwesomeIcon icon={faMoneyBill} />
                  Cash
                </Space>
              </Select.Option>
              <Select.Option value="Card">
                <Space>
                  <FontAwesomeIcon icon={faCreditCard} />
                  Card
                </Space>
              </Select.Option>
            </PaymentMethodSelect>
          </PaymentMethodLayout>

          <PaymentActions>
            <PaymentButton
              type="primary"
              icon={<FontAwesomeIcon icon={faMoneyBill} />}
              onClick={handlePayment}
              loading={processing}
              disabled={processing}
            >
              {processing ? "Processing..." : "Confirm Payment"}
            </PaymentButton>
          </PaymentActions>
        </>
      )}
    </InvoiceDetailLayout>
  );
};

export default InvoiceDetailComponent;
