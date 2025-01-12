import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StatTitle = styled.h3`
  margin: 0;
  color: #666;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
`;

const AdminDashboard = () => {
  return (
    <DashboardContainer>
      <h2>Admin Dashboard</h2>
      <StatsGrid>
        <StatCard>
          <StatTitle>Total Users</StatTitle>
          <StatValue>150</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Rooms</StatTitle>
          <StatValue>50</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Active Bookings</StatTitle>
          <StatValue>25</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Revenue</StatTitle>
          <StatValue>$15,000</StatValue>
        </StatCard>
      </StatsGrid>
      {/* Add more admin-specific components here */}
    </DashboardContainer>
  );
};

export default AdminDashboard; 