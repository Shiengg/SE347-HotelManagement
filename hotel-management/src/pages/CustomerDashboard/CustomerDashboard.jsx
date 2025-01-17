import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const BookingSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const ServiceSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #0056b3;
  }
`;

const CustomerDashboard = () => {
  return (
    <DashboardContainer>
      <h2>Welcome, Customer!</h2>
      
      <BookingSection>
        <h3>Your Bookings</h3>
        {/* Add booking list component here */}
        <Button>New Booking</Button>
      </BookingSection>

      <ServiceSection>
        <h3>Available Services</h3>
        {/* Add services list component here */}
        <Button>Request Service</Button>
      </ServiceSection>
    </DashboardContainer>
  );
};

export default CustomerDashboard; 