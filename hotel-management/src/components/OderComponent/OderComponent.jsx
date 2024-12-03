import React, { useState } from 'react';
import styled from 'styled-components';

const OrderContainer = styled.div`
  width: 320px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SelectBooking = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`;

const ItemName = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const ItemPrice = styled.span`
  font-size: 16px;
  color: #333;
`;

const RemoveButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 18px;
  font-weight: 600;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
  }
`;

const CurrentOrderComponent = () => {
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: 'Mì trộn', price: 15000000, quantity: 1 },
    { id: 2, name: 'Nước suối', price: 79990, quantity: 1 },
  ]);
  const [selectedBooking, setSelectedBooking] = useState('');

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleBookingChange = (event) => {
    setSelectedBooking(event.target.value);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <OrderContainer>
        <h3>Add New Booking</h3>
      <label>Select Booking:</label>
      <SelectBooking value={selectedBooking} onChange={handleBookingChange}>
        <option value="">-- Select a Booking --</option>
        <option value="booking1">Booking 1</option>
        <option value="booking2">Booking 2</option>
      </SelectBooking>

      {orderItems.map(item => (
        <ItemContainer key={item.id}>
          <div>
            <ItemName>{item.name} x {item.quantity}</ItemName>
            <ItemPrice>{item.price.toLocaleString()} đ</ItemPrice>
          </div>
          <RemoveButton onClick={() => handleRemoveItem(item.id)}>X</RemoveButton>
        </ItemContainer>
      ))}

      <TotalContainer>
        <span>Total:</span>
        <span>{calculateTotal().toLocaleString()} đ</span>
      </TotalContainer>

      <SubmitButton>Submit Order</SubmitButton>
    </OrderContainer>
  );
};

export default CurrentOrderComponent;
