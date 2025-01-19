import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Statistic } from 'antd';
import { TeamOutlined, HomeOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';

const PageContainer = styled.div`
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
      icon: <CalendarOutlined />,
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
    <PageContainer>
      <Title>Admin Dashboard</Title>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.icon}
            />
          </StatCard>
        ))}
      </StatsGrid>
    </PageContainer>
  );
};

export default AdminDashboard; 