import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Statistic, Table, Spin, List, Tag, Button, Space, Tabs, Badge } from 'antd';
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
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 32px;
  position: relative;
  padding-left: 16px;
  display: flex;
  align-items: center;
  gap: 12px;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: linear-gradient(180deg, #1890ff 0%, #096dd9 100%);
    border-radius: 4px;
  }

  .subtitle {
    font-size: 14px;
    color: #6b7280;
    font-weight: 400;
    margin-left: 8px;
  }

  @media (max-width: 576px) {
    font-size: 24px;
    margin-bottom: 24px;
    
    .subtitle {
      font-size: 13px;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  padding: 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
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

const RoomOverviewContainer = styled(Card)`
  margin: 0;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: none;
  overflow: hidden;

  .ant-card-head {
    border-bottom: none;
    padding: 20px;
    
    .ant-card-head-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a3353;
      display: flex;
      align-items: center;
      gap: 12px;

      &:before {
        content: '🏨';
        font-size: 20px;
      }
    }
  }

  .ant-card-body {
    padding: 0 20px 20px;
  }

  @media (max-width: 768px) {
    margin: 0;
    
    .ant-card-head {
      padding: 16px;
    }
    
    .ant-card-body {
      padding: 0 16px 16px;
    }
  }
`;

const RoomList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const RoomGroup = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }

  .status-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px dashed #e5e7eb;

    .ant-badge-status-dot {
      width: 12px;
      height: 12px;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
    }

    span {
      font-weight: 600;
      color: #1a3353;
      font-size: 18px;
    }

    .count {
      margin-left: auto;
      background: ${props => props.statusColor || '#e5e7eb'};
      color: white;
      padding: 6px 16px;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .room-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .ant-tag {
      margin: 0;
      padding: 8px 16px;
      font-size: 14px;
      border-radius: 12px;
      border: none;
      cursor: default;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      &:before {
        content: '🏠';
        font-size: 14px;
      }

      &:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
    
    .status-header {
      margin-bottom: 16px;
      padding-bottom: 12px;
      
      span {
        font-size: 16px;
      }
      
      .count {
        padding: 4px 12px;
        font-size: 13px;
      }
    }
    
    .room-chips {
      gap: 8px;
      
      .ant-tag {
        padding: 6px 12px;
        font-size: 13px;
      }
    }
  }
`;

const getStatusOrder = (status) => {
  const order = {
    'Available': 1,
    'Reserved': 2,
    'Occupied': 3,
    'Maintenance': 4
  };
  return order[status] || 999;
};

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
          <Title>
            Dashboard Overview
            <span className="subtitle">
              Overview of your hotel's performance
            </span>
          </Title>
        </TitleSection>
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

      <RoomOverviewContainer title="Room Overview">
        <RoomList>
          {Object.entries(stats?.roomOverview?.roomsByStatus || {})
            .sort(([statusA], [statusB]) => getStatusOrder(statusA) - getStatusOrder(statusB))
            .map(([status, rooms]) => (
              <RoomGroup 
                key={status} 
                statusColor={
                  status === 'Available' ? '#10b981' : 
                  status === 'Reserved' ? '#6366f1' : 
                  status === 'Occupied' ? '#ef4444' : 
                  '#f59e0b'
                }
              >
                <div className="status-header">
                  <Badge 
                    color={
                      status === 'Available' ? '#10b981' :
                      status === 'Reserved' ? '#6366f1' :
                      status === 'Occupied' ? '#ef4444' :
                      '#f59e0b'
                    } 
                  />
                  <span>{status}</span>
                  <span className="count" style={{
                    background: status === 'Available' ? '#10b981' :
                               status === 'Reserved' ? '#6366f1' :
                               status === 'Occupied' ? '#ef4444' :
                               '#f59e0b'
                  }}>
                    {rooms.length} rooms
                  </span>
                </div>
                <div className="room-chips">
                  {rooms.map(room => (
                    <Tag 
                      key={room.roomNumber}
                      color={
                        status === 'Available' ? 'success' :
                        status === 'Reserved' ? 'processing' :
                        status === 'Occupied' ? 'error' :
                        'warning'
                      }
                    >
                      {room.roomNumber} - {room.roomType}
                    </Tag>
                  ))}
                </div>
              </RoomGroup>
            ))
          }
        </RoomList>
      </RoomOverviewContainer>
    </PageContainer>
  );
};

export default ReceptionistDashboard; 