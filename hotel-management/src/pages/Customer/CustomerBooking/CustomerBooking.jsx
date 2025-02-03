import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Tag, Space, message, Button, Grid } from 'antd';
import { 
  CalendarOutlined, 
  HomeOutlined, 
  ClockCircleOutlined, 
  DollarOutlined, 
  CheckCircleOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { useBreakpoint } = Grid;

const PageContainer = styled.div`
  padding: 24px;
  min-height: calc(100vh - 64px);
  background: #f8fafc;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 2px solid #ffd700;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(0);
  -webkit-backdrop-filter: blur(0);

  @media (max-width: 768px) {
    padding: 16px;
    border-width: 1px;
  }
`;

const HeaderSection = styled.div`
  padding: 0 0 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 576px) {
    padding: 0 0 16px 0;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #ffd700, #ffed4a);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .anticon {
      font-size: 24px;
      color: #1a3353;
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
  font-size: 1.8em;
  font-weight: 600;

  @media (max-width: 576px) {
    font-size: 1.4em;
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
  background: linear-gradient(135deg, #1a3353, #2c5282);
  color: white;
  
  &:hover, &:focus {
    background: linear-gradient(135deg, #2c5282, #1a3353);
    color: white;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: white;
    border-radius: 12px;
  }

  .ant-table-thead > tr > th {
    background: #f8fafc;
    color: #1a3353;
    font-weight: 600;
    border-bottom: 2px solid #edf2f7;
    padding: 16px;

    &::before {
      display: none;
    }
  }

  .ant-table-tbody > tr > td {
    padding: 16px;
    border-bottom: 1px solid #edf2f7;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fafc;
  }

  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 12px 8px;
    }
  }
`;

const StatusTag = styled(Tag)`
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 6px;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;

  .anticon {
    font-size: 12px;
  }
`;

const CustomerBooking = ({ onToggleSidebar }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const screens = useBreakpoint();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      message.error('Please login to view your bookings');
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;

      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      // Lọc chỉ lấy booking của customer hiện tại
      const customerBookings = data.filter(booking => 
        booking.customerID._id === userId || booking.customerID.id === userId
      );
      
      setBookings(customerBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      message.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (price) => {
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  const formatDateTime = (dateTime, type) => {
    const format = type === 'Hourly' ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
    return dayjs(dateTime).format(format);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      'Pending': { color: 'orange', icon: <ClockCircleOutlined /> },
      'Confirmed': { color: 'blue', icon: <CalendarOutlined /> },
      'Completed': { color: 'green', icon: <CheckCircleOutlined /> }
    };

    if (!statusConfig[status]) {
      console.warn(`Unknown status: ${status}`);
      return (
        <Tag color="default">
          <Space>
            {status}
          </Space>
        </Tag>
      );
    }

    return (
      <StatusTag color={statusConfig[status].color}>
        <Space>
          {statusConfig[status].icon}
          {status}
        </Space>
      </StatusTag>
    );
  };

  const getResponsiveColumns = () => {
    if (screens.xs) {
      return [
        {
          title: 'Room & Status',
          key: 'roomAndStatus',
          render: (record) => (
            <Space direction="vertical" size={4}>
              <Space>
                <HomeOutlined />
                Room {record.roomID.roomNumber}
              </Space>
              {getStatusTag(record.status)}
            </Space>
          ),
        },
        {
          title: 'Details',
          key: 'details',
          render: (record) => (
            <Space direction="vertical" size={4}>
              <div>{record.bookingType}</div>
              <div>{formatDateTime(record.checkInDate, record.bookingType)}</div>
              <div style={{ color: '#1a3353', fontWeight: 500 }}>
                {formatVND(record.totalPrice)}
              </div>
            </Space>
          ),
        }
      ];
    }

    return [
      {
        title: 'Room',
        key: 'room',
        render: (record) => (
          <Space>
            <HomeOutlined />
            Room {record.roomID.roomNumber}
          </Space>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'bookingType',
        key: 'type',
      },
      {
        title: 'Check In',
        key: 'checkIn',
        render: (record) => formatDateTime(record.checkInDate, record.bookingType),
      },
      {
        title: 'Check Out',
        key: 'checkOut',
        render: (record) => formatDateTime(record.checkOutDate, record.bookingType),
      },
      {
        title: 'Duration',
        key: 'duration',
        render: (record) => (
          record.bookingType === 'Daily' 
            ? `${record.totalDays} days`
            : `${record.totalHours} hours`
        ),
      },
      {
        title: 'Total Price',
        key: 'price',
        render: (record) => (
          <Space>
            <DollarOutlined />
            {formatVND(record.totalPrice)}
          </Space>
        ),
      },
      {
        title: 'Status',
        key: 'status',
        render: (record) => getStatusTag(record.status),
      }
    ];
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <TitleSection>
            <div className="icon-wrapper">
              <CalendarOutlined />
            </div>
            <Title>My Bookings</Title>
          </TitleSection>
          <MenuButton onClick={onToggleSidebar}>
            <MenuOutlined />
          </MenuButton>
        </HeaderSection>

        <StyledTable
          columns={getResponsiveColumns()}
          dataSource={bookings}
          rowKey="_id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} bookings`,
            responsive: true,
          }}
          scroll={{ x: true }}
        />
      </ContentWrapper>
    </PageContainer>
  );
};

export default CustomerBooking; 