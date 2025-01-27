import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Tag, Space, message } from 'antd';
import { CalendarOutlined, HomeOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  padding: 24px;
  height: calc(100vh - 84px);
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  border: 2px solid gold;
  height: 100%;
  overflow-y: auto;
`;

const HeaderSection = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: linear-gradient(45deg, #ffd700, #ffed4a);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .anticon {
      font-size: 24px;
      color: #1a3353;
    }
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #1a3353;
  font-size: 1.8em;
  font-weight: 600;
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: white;
    border-radius: 8px;
  }

  .ant-table-thead > tr > th {
    background: #f8fafc;
    color: #1a3353;
    font-weight: 600;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fafc;
  }
`;

const StatusTag = styled(Tag)`
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 6px;
  border: none;
`;

const CustomerBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      Pending: { color: 'orange', icon: <ClockCircleOutlined /> },
      Confirmed: { color: 'green', icon: <CalendarOutlined /> }
    };

    return (
      <StatusTag color={statusConfig[status].color}>
        <Space>
          {statusConfig[status].icon}
          {status}
        </Space>
      </StatusTag>
    );
  };

  const columns = [
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
        </HeaderSection>

        <StyledTable
          columns={columns}
          dataSource={bookings}
          rowKey="_id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} bookings`,
          }}
        />
      </ContentWrapper>
    </PageContainer>
  );
};

export default CustomerBooking; 