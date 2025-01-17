import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ActionButton = styled.button`
  padding: 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #0056b3;
  }
`;

const ReceptionistDashboard = () => {
  return (
    <DashboardContainer>
      <h2>Receptionist Dashboard</h2>
      <QuickActions>
        <ActionButton>New Booking</ActionButton>
        <ActionButton>Check In</ActionButton>
        <ActionButton>Check Out</ActionButton>
        <ActionButton>Room Status</ActionButton>
      </QuickActions>
      {/* Add more receptionist-specific components here */}
    </DashboardContainer>
  );
};

export default ReceptionistDashboard; 