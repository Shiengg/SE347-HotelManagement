import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: #111827;
`;

const CustomerRestaurant = () => {
  return (
    <PageContainer>
      <Title>Restaurant Menu</Title>
      {/* Add menu items and ordering system here */}
    </PageContainer>
  );
};

export default CustomerRestaurant; 