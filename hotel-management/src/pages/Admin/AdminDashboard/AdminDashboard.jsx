import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Statistic, Table, Spin, List, Tag, Tabs, Space, Badge } from 'antd';
import { TeamOutlined, HomeOutlined, CalendarOutlined, DollarOutlined, UserOutlined, CheckCircleOutlined, ToolOutlined } from '@ant-design/icons';
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
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  background: white;
  border: none;

  .ant-statistic-title {
    color: #4b5563;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }

  .ant-statistic-content {
    color: #1a1a1a;
    text-align: right;
  }

  .ant-statistic-content-value {
    font-size: 36px;
    font-weight: 700;
    background: linear-gradient(45deg, #1a1a1a, #4b5563);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  .ant-card-body {
    padding: 24px;
    background: white;
  }

  .anticon {
    font-size: 22px;
    margin-right: 10px;
    color: ${props => props.iconcolor};
    background: ${props => props.iconbg};
    padding: 10px;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  &:hover .anticon {
    transform: scale(1.1);
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

const StatusCard = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .title {
    color: #4b5563;
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;

    .anticon {
      font-size: 18px;
      color: ${props => props.color};
    }
  }

  .count {
    font-size: 28px;
    font-weight: 600;
    color: ${props => props.color};
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

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueType, setRevenueType] = useState('total');

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
      <Title>
        Overview
      </Title>
      
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
                      status === 'Occupied' ? '#ef4444' :
                      status === 'Reserved' ? '#6366f1' :
                      '#f59e0b'
                    } 
                  />
                  <span>{status}</span>
                  <span className="count" style={{
                    background: status === 'Available' ? '#10b981' :
                               status === 'Occupied' ? '#ef4444' :
                               status === 'Reserved' ? '#6366f1' :
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
                        status === 'Occupied' ? 'error' :
                        status === 'Reserved' ? 'processing' :
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

export default AdminDashboard; 