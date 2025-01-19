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

const CustomerRooms = () => {
  return (
    <PageContainer>
      <Title>Available Rooms</Title>
      {/* Add room list and filters here */}
    </PageContainer>
  );
};

export default CustomerRooms; 