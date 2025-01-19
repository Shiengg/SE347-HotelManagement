import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Statistic } from 'antd';
import { CalendarOutlined, HomeOutlined, CoffeeOutlined, FileTextOutlined } from '@ant-design/icons';

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

const StatCard = styled(Card)`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CustomerDashboard = () => {
  const stats = [
    {
      title: 'Active Bookings',
      value: 2,
      icon: <CalendarOutlined />,
    },
    {
      title: 'Rooms Booked',
      value: 1,
      icon: <HomeOutlined />,
    },
    {
      title: 'Restaurant Orders',
      value: 3,
      icon: <CoffeeOutlined />,
    },
    {
      title: 'Total Invoices',
      value: 5,
      icon: <FileTextOutlined />,
    }
  ];

  return (
    <PageContainer>
      <Title>Welcome Back!</Title>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <Statistic title={stat.title} value={stat.value} prefix={stat.icon} />
          </StatCard>
        ))}
      </StatsGrid>
    </PageContainer>
  );
};

export default CustomerDashboard; 