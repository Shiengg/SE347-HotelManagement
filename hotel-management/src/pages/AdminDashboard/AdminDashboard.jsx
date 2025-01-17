import React from 'react';
import styled from 'styled-components';
import { TeamOutlined, HomeOutlined, BookOutlined, DollarOutlined } from '@ant-design/icons';

const DashboardContainer = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: ${props => props.bg};
  color: ${props => props.color};
`;

const StatTitle = styled.h3`
  margin: 0;
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: #111827;
`;

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '150',
      icon: <TeamOutlined />,
      bg: '#e1effe',
      color: '#1d4ed8'
    },
    {
      title: 'Total Rooms',
      value: '50',
      icon: <HomeOutlined />,
      bg: '#fef3c7',
      color: '#b45309'
    },
    {
      title: 'Active Bookings',
      value: '25',
      icon: <BookOutlined />,
      bg: '#dcfce7',
      color: '#15803d'
    },
    {
      title: 'Revenue',
      value: '$15,000',
      icon: <DollarOutlined />,
      bg: '#fee2e2',
      color: '#b91c1c'
    }
  ];

  return (
    <DashboardContainer>
      <Title>Admin Dashboard</Title>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatHeader>
              <StatIcon bg={stat.bg} color={stat.color}>
                {stat.icon}
              </StatIcon>
              <StatTitle>{stat.title}</StatTitle>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
          </StatCard>
        ))}
      </StatsGrid>
      {/* Add more dashboard content here */}
    </DashboardContainer>
  );
};

export default AdminDashboard; 