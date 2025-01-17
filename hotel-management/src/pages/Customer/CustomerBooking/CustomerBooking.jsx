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

const CustomerBooking = () => {
  return (
    <PageContainer>
      <Title>Book Your Room</Title>
      {/* Add booking form and room selection here */}
    </PageContainer>
  );
};

export default CustomerBooking; 