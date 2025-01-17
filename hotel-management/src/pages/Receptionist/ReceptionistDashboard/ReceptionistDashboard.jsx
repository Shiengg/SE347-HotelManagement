import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, HomeOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';

const PageContainer = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: #111827;
`;

const StyledCard = styled(Card)`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  
  .ant-statistic-title {
    color: #6b7280;
  }
  
  .ant-statistic-content {
    color: #111827;
  }
`;

const ReceptionistDashboard = () => {
  return (
    <PageContainer>
      <Title>Dashboard</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic
              title="Available Rooms"
              value={15}
              prefix={<HomeOutlined />}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic
              title="Today's Check-ins"
              value={8}
              prefix={<UserOutlined />}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic
              title="Active Bookings"
              value={12}
              prefix={<CalendarOutlined />}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic
              title="Today's Revenue"
              value={2500}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </StyledCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ReceptionistDashboard; 