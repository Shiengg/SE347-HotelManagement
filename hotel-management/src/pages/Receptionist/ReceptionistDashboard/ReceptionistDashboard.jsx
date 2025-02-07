import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Statistic, Table, Spin, List, Tag, Button, Space, Tabs } from 'antd';
import { 
  TeamOutlined, 
  HomeOutlined, 
  CalendarOutlined, 
  DollarOutlined, 
  UserOutlined, 
  CheckCircleOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import { format } from 'date-fns';

const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 768px) {
    padding: 16px;
    min-height: calc(100vh - 56px);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 576px) {
    margin-bottom: 24px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: #1890ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .anticon {
      font-size: 24px;
      color: white;
    }

    @media (max-width: 576px) {
      width: 40px;
      height: 40px;
      .anticon {
        font-size: 20px;
      }
    }
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #1a3353;
  font-size: 28px;
  font-weight: 600;

  @media (max-width: 576px) {
    font-size: 22px;
  }
`;

const MenuButton = styled(Button)`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #1a3353;
  color: white;
  
  &:hover, &:focus {
    background: #2c5282;
    color: white;
  }

  @media (max-width: 768px) {
    display: flex;
  }

  @media (max-width: 576px) {
    width: 36px;
    height: 36px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled(Card)`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  background: white;
  border: 1px solid #e2e8f0;

  .ant-statistic-title {
    color: #666;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }

  .ant-statistic-content {
    color: #1a3353;
  }

  .ant-statistic-content-value {
    font-size: 28px;
    font-weight: 600;
  }

  .anticon {
    font-size: 20px;
    margin-right: 8px;
    color: ${props => props.iconcolor};
    background: ${props => props.iconbg};
    padding: 8px;
    border-radius: 8px;
  }

  @media (max-width: 576px) {
    .ant-card-body {
      padding: 16px;
    }

    .ant-statistic-title {
      font-size: 14px;
    }

    .ant-statistic-content-value {
      font-size: 24px;
    }

    .anticon {
      font-size: 18px;
      padding: 6px;
    }
  }
`;

const ChartContainer = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px;
    
    .ant-card-head-title {
      font-size: 18px;
      font-weight: 600;
    }
  }

  .ant-card-body {
    padding: 16px;
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;

    .ant-card-head {
      padding: 12px 16px;
      
      .ant-card-head-title {
        font-size: 16px;
      }
    }

    .ant-table {
      font-size: 14px;
    }
  }
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #f8fafc !important;
    color: #1a3353;
    font-weight: 600;
    padding: 12px 16px;
  }

  .ant-table-tbody > tr > td {
    padding: 12px 16px;
  }

  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px 12px;
    }
  }
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav-list {
    width: 100%;
    display: flex !important;
    justify-content: space-between;
  }

  .ant-tabs-tab {
    margin: 0 !important;
    padding: 8px 0 !important;
    flex: 1;
    display: flex;
    justify-content: center;
    min-width: auto !important;
  }

  @media (max-width: 576px) {
    .ant-tabs-nav-list {
      gap: 4px;
    }
    
    .ant-tabs-tab {
      padding: 4px 0 !important;
      font-size: 12px;
      
      .ant-tabs-tab-btn {
        font-size: 12px;
      }
    }
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

const ReceptionistDashboard = ({ onToggleSidebar }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueType, setRevenueType] = useState('total');
  
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

  useEffect(() => {
    fetchDashboardStats();
  }, [revenueType]);

  const fetchDashboardStats = async () => {
    try {
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

  const getResponsiveColumns = () => {
    if (window.innerWidth <= 576) {
      return [
        {
          title: 'Customer & Room',
          key: 'customerRoom',
          render: (record) => (
            <Space direction="vertical" size={4}>
              <div>{record.customerID.fullname}</div>
              <div style={{ color: '#666' }}>Room {record.roomID.roomNumber}</div>
            </Space>
          ),
        },
        {
          title: 'Status & Date',
          key: 'statusDate',
          render: (record) => (
            <Space direction="vertical" size={4}>
              <Tag color={record.status === 'Confirmed' ? 'green' : 'gold'}>
                {record.status}
              </Tag>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {format(new Date(record.createdAt), 'dd/MM/yyyy HH:mm')}
              </div>
            </Space>
          ),
        }
      ];
    }

    return [
      {
        title: 'Customer',
        dataIndex: ['customerID', 'fullname'],
      },
      {
        title: 'Room',
        dataIndex: ['roomID', 'roomNumber'],
        render: (number) => `Room ${number}`,
      },
      {
        title: 'Date',
        dataIndex: 'createdAt',
        render: (date) => format(new Date(date), 'dd/MM/yyyy HH:mm'),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => (
          <Tag color={status === 'Confirmed' ? 'green' : 'gold'}>
            {status}
          </Tag>
        ),
      },
    ];
  };

  return (
    <PageContainer>
      <HeaderSection>
        <TitleSection>
          <div className="icon-wrapper">
            <DollarOutlined />
          </div>
          <Title>Dashboard Overview</Title>
        </TitleSection>
        <MenuButton onClick={onToggleSidebar}>
          <MenuOutlined />
        </MenuButton>
      </HeaderSection>
      
      <StatsGrid>
        <StatCard iconcolor="#4F46E5" iconbg="#ede9fe">
          <Statistic
            title={
              <>
                <UserOutlined />
                Total Guests
              </>
            }
            value={stats?.totalGuests}
            valueStyle={{ 
              color: '#1a1a1a',
              fontWeight: 700,
              fontSize: '32px',
              textAlign: 'right'
            }}
          />
        </StatCard>
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
                Today's Check-ins
              </>
            }
            value={stats?.todayCheckIns}
            valueStyle={{ 
              color: '#1a1a1a',
              fontWeight: 700,
              fontSize: '32px',
              textAlign: 'right'
            }}
          />
        </StatCard>
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
      </StatsGrid>

      <ChartContainer title="Recent Bookings">
        <StyledTable
          columns={getResponsiveColumns()}
          dataSource={stats?.recentBookings}
          rowKey="_id"
          pagination={false}
          scroll={{ x: true }}
        />
      </ChartContainer>
    </PageContainer>
  );
};

export default ReceptionistDashboard; 