import React from 'react';
import styled from 'styled-components';

const FoodItemContainer = styled.div`
  width: 200px;
  margin: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FoodImage = styled.img`
  width: 190px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 30px;
`;

const FoodName = styled.h4`
  font-size: 16px;
  margin: 5px 0;
`;

const FoodPrice = styled.p`
  font-size: 14px;
  color: green;
  margin: 5px 0;
`;

const OrderButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const FoodItemComponent = ({ name, price, image }) => {
  return (
    <FoodItemContainer>
      <FoodImage src={image} alt={name} />
      <FoodName>{name}</FoodName>
      <FoodPrice>{price} đ</FoodPrice>
      <OrderButton>Add to Order</OrderButton>
    </FoodItemContainer>
  );
};

export default FoodItemComponent;
