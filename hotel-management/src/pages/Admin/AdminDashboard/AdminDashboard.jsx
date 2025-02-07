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
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 32px;
  position: relative;
  padding-left: 16px;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: #1890ff;
    border-radius: 4px;
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
  margin: 0 24px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: none;
  overflow: hidden;

  .ant-card-head {
    border-bottom: none;
    padding: 20px 24px;
    
    .ant-card-head-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a3353;
      display: flex;
      align-items: center;
      gap: 10px;

      &:before {
        content: '📊';
        font-size: 20px;
      }
    }
  }

  .ant-card-body {
    padding: 0 24px 24px;
  }

  @media (max-width: 768px) {
    margin: 0 16px;
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
  gap: 24px;
`;

const RoomGroup = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .status-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #e5e7eb;

    .ant-badge-status-dot {
      width: 10px;
      height: 10px;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
    }

    span {
      font-weight: 600;
      color: #1a3353;
      font-size: 16px;
    }

    .count {
      margin-left: auto;
      background: ${props => props.statusColor || '#e5e7eb'};
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }
  }

  .room-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .ant-tag {
      margin: 0;
      padding: 6px 14px;
      font-size: 14px;
      border-radius: 8px;
      border: none;
      cursor: default;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;

      &:before {
        content: '🏠';
        font-size: 12px;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
`;

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

      <RoomOverviewContainer title="Room Overview">
        <RoomList>
          {Object.entries(stats?.roomOverview?.roomsByStatus || {}).map(([status, rooms]) => (
            <RoomGroup key={status} statusColor={status === 'Available' ? '#10b981' : status === 'Occupied' ? '#ef4444' : status === 'Reserved' ? '#6366f1' : '#f59e0b'}>
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
          ))}
        </RoomList>
      </RoomOverviewContainer>
    </PageContainer>
  );
};

export default AdminDashboard; 