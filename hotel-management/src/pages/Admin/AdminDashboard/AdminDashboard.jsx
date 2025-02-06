import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Statistic, Table, Spin, List, Tag, Tabs, Space } from 'antd';
import { TeamOutlined, HomeOutlined, CalendarOutlined, DollarOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import axios from 'axios';
import { format } from 'date-fns';

const PageContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 768px) {
    padding: 16px;
    min-height: calc(100vh - 56px);
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 32px;
  text-align: left;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 576px) {
    font-size: 24px;
    margin-bottom: 24px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  padding: 0 16px;
`;

const StatCard = styled(Card)`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  background: white;

  .ant-statistic-title {
    color: #666;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }

  .ant-statistic-content {
    color: #1a1a1a;
    text-align: right;
  }

  .ant-statistic-content-value {
    font-size: 32px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .percentage {
    font-size: 14px;
    color: #16a34a;
    background: #dcfce7;
    padding: 4px 8px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .ant-card-body {
    padding: 20px;
    background: white;
  }

  .anticon {
    font-size: 20px;
    margin-right: 8px;
    color: ${props => props.iconcolor};
    background: ${props => props.iconbg};
    padding: 8px;
    border-radius: 8px;
  }
`;

const ChartContainer = styled(Card)`
  margin: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
    
    .ant-card-head-title {
      font-size: 18px;
      font-weight: 600;
    }
  }

  .ant-card-body {
    padding: 24px;
  }
`;

const RevenueCard = styled(StatCard)`
  .ant-tabs {
    margin-top: -16px;
  }

  .ant-tabs-nav {
    margin-bottom: 12px;
  }

  .ant-tabs-tab {
    padding: 6px 12px;
    
    &:hover {
      color: #1890ff;
    }
  }

  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #1890ff !important;
      font-weight: 500;
    }
  }

  .revenue-content {
    padding-top: 8px;
  }
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

const StyledTable = styled(Table)`
  @media (max-width: 576px) {
    .desktop-column {
      display: none;
    }
  }

  @media (min-width: 577px) {
    .mobile-column {
      display: none;
    }
  }
`;

const StyledTabs = styled(Tabs)`
  @media (max-width: 576px) {
    .ant-tabs-nav-list {
      gap: 4px;
    }
    
    .ant-tabs-tab {
      padding: 4px 8px !important;
      margin: 0 !important;
      font-size: 12px;
      min-width: auto;
      
      .ant-tabs-tab-btn {
        font-size: 12px;
      }
    }
  }
`;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueType, setRevenueType] = useState('total'); // total, daily, monthly, yearly

  useEffect(() => {
    fetchDashboardStats();
  }, [revenueType]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/dashboard/stats?revenueType=${revenueType}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </PageContainer>
    );
  }

  const bookingLineConfig = {
    data: stats?.monthlyBookings || [],
    xField: '_id',
    yField: 'count',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  const roomTypePieConfig = {
    data: stats?.roomTypeDistribution || [],
    angleField: 'count',
    colorField: '_id',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [{ type: 'element-active' }],
  };

  const mobileColumn = {
    title: 'Booking Info',
    key: 'bookingInfo',
    className: 'mobile-column',
    render: (record) => (
      <Space direction="vertical" size={4}>
        <div style={{ fontWeight: 500 }}>
          <UserOutlined /> {record.customerID?.fullname}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <HomeOutlined /> Room {record.roomID?.roomNumber}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {format(new Date(record.createdAt), 'dd/MM/yyyy HH:mm')}
        </div>
        <Tag color={record.status === 'Confirmed' ? 'green' : 'gold'}>
          {record.status}
        </Tag>
      </Space>
    ),
  };

  const desktopColumns = [
    {
      title: 'Customer',
      dataIndex: ['customerID', 'fullname'],
      className: 'desktop-column',
    },
    {
      title: 'Room',
      dataIndex: ['roomID', 'roomNumber'],
      className: 'desktop-column',
      render: (number) => `Room ${number}`,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      className: 'desktop-column',
      render: (date) => format(new Date(date), 'dd/MM/yyyy HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      className: 'desktop-column',
      render: (status) => (
        <Tag color={status === 'Confirmed' ? 'green' : 'gold'}>
          {status}
        </Tag>
      ),
    },
  ];

  const allColumns = [mobileColumn, ...desktopColumns];

  const tabItems = [
    {
      key: 'total',
      label: 'Total',
    },
    {
      key: 'daily',
      label: 'Today',
    },
    {
      key: 'monthly',
      label: 'This Month',
    },
    {
      key: 'yearly',
      label: 'This Year',
    },
  ];

  return (
    <PageContainer>
      <Title>Overview</Title>
      
      <StatsGrid>
        <RevenueCard iconcolor="#4F46E5" iconbg="#ede9fe">
          <StyledTabs
            activeKey={revenueType}
            onChange={setRevenueType}
            items={tabItems}
            size="small"
            type="card"
          />
          <div className="revenue-content">
            <Statistic
              title={
                <>
                  <DollarOutlined />
                  {revenueType === 'daily' && "Today's Revenue"}
                  {revenueType === 'monthly' && "This Month's Revenue"}
                  {revenueType === 'yearly' && "This Year's Revenue"}
                  {revenueType === 'total' && "Total Revenue"}
                </>
              }
              value={stats?.revenue || 0}
              valueStyle={{ 
                color: '#1a1a1a',
                fontWeight: 700,
                fontSize: '32px',
                textAlign: 'right'
              }}
              formatter={formatCurrency}
            />
          </div>
        </RevenueCard>
        <StatCard iconcolor="#059669" iconbg="#dcfce7">
          <Statistic
            title={
              <>
                <HomeOutlined />
                Available Rooms
              </>
            }
            value={stats?.availableRooms}
            valueStyle={{ 
              color: '#1a1a1a',
              fontWeight: 700,
              fontSize: '32px',
              textAlign: 'right'
            }}
          />
        </StatCard>
        <StatCard iconcolor="#EA580C" iconbg="#fff7ed">
          <Statistic
            title={
              <>
                <CheckCircleOutlined />
                Confirmed Bookings
              </>
            }
            value={stats?.confirmedBookings}
            valueStyle={{ 
              color: '#1a1a1a',
              fontWeight: 700,
              fontSize: '32px',
              textAlign: 'right'
            }}
          />
        </StatCard>
      </StatsGrid>

      <ChartContainer title="Recent Bookings">
        <StyledTable
          columns={allColumns}
          dataSource={stats?.recentBookings}
          rowKey="_id"
          pagination={false}
          scroll={{ x: true }}
        />
      </ChartContainer>
    </PageContainer>
  );
};

export default AdminDashboard; 