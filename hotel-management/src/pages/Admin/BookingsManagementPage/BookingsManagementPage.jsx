import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Form, Input, Select, DatePicker, message, Space, Modal, Spin, Table, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, UserOutlined, HomeOutlined, InfoCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import BookingForm from './BookingForm';

const { Option } = Select;

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

const ContentWrapper = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

const HeaderSection = styled.div`
  background: linear-gradient(to right, #ffffff, #f8fafc);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 24px;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #1a3353, #2c5282);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .anticon {
      font-size: 24px;
      color: white;
    }
  }

  .text-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  @media (max-width: 768px) {
    .icon-wrapper {
      width: 40px;
      height: 40px;
      
      .anticon {
        font-size: 20px;
      }
    }
  }
`;

const Title = styled.h2`
  margin: 0;
  color: #1a3353;
  font-size: 24px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .ant-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  @media (max-width: 768px) {
    border-radius: 8px;
  }
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
    padding: 16px;
  }

  .ant-table-tbody > tr > td {
    padding: 16px;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fafc;
  }

  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 12px;
    }
  }

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

const BookingDetailContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 12px;
  border: 2px solid gold;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: fit-content;
`;

const DetailSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .label {
    color: #1a3353;
    font-size: 0.95em;
    font-weight: 500;
  }

  .value {
    font-weight: 500;
    color: #1a3353;
    font-size: 1.1em;
  }
`;

const StatusTag = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  
  &.pending { color: #f59e0b; background: #fef3c7; }
  &.confirmed { color: #10b981; background: #d1fae5; }
`;

const ActionButtons = styled(Space)`
  margin-top: auto;
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
  width: 100%;

  .ant-btn {
    height: 40px;
    flex: 1;
    font-weight: 500;
    
    &.edit-button {
      background: #1a3353;
      border: none;
      
      &:hover {
        background: #264773;
      }
    }

    &.delete-button {
      background: #fff;
      border: 1px solid #ff4d4f;
      color: #ff4d4f;
      
      &:hover {
        background: #ff4d4f;
        color: white;
      }
    }
  }
`;

const formatVND = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const DetailModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: linear-gradient(to right, #ffffff, #f8f9fa);
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-modal-body {
    padding: 24px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: #fff;
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
  margin: 24px 0;

  .icon {
    font-size: 48px;
    color: #94a3b8;
    margin-bottom: 16px;
  }

  .title {
    font-size: 1.1em;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
  }

  .subtitle {
    color: #64748b;
    text-align: center;
    max-width: 400px;
    line-height: 1.5;
  }

  .add-button {
    margin-top: 24px;
    height: 40px;
    padding: 0 24px;
    border-radius: 20px;
    background: #1a3353;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      background: #264773;
    }
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: #fff;
  border-radius: 8px;
  margin: 24px 0;

  .ant-spin {
    margin-bottom: 16px;
  }

  .text {
    color: #64748b;
    font-size: 0.95em;
  }

  @media (max-width: 768px) {
    padding: 32px 20px;
  }
`;

const formatDateTime = (date, bookingType) => {
  if (bookingType === 'Hourly') {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  }
  return dayjs(date).format('DD/MM/YYYY');
};

const getStatusTag = (status) => {
  const classNames = {
    'Pending': 'pending',
    'Confirmed': 'confirmed'
  };
  return <StatusTag className={classNames[status]}>{status}</StatusTag>;
};

const BookingDetailModal = ({ booking, visible, onClose }) => {
  if (!booking) return null;

  // Tính tổng giá service
  const calculateServiceTotal = (service) => {
    if (!service.serviceID || !service.quantity) return 0;
    return service.serviceID.servicePrice * service.quantity;
  };

  return (
    <DetailModal
      title="Booking Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <DetailSection>
        <DetailItem>
          <div className="label">Booking ID</div>
          <div className="value">#{booking._id.slice(-6)}</div>
        </DetailItem>

        <DetailItem>
          <div className="label">Room</div>
          <div className="value">Room {booking.roomID.roomNumber}</div>
        </DetailItem>

        <DetailItem>
          <div className="label">Customer</div>
          <div className="value">
            {booking.customerID?.fullname || booking.customerID?.username || 'N/A'}
          </div>
        </DetailItem>

        <DetailItem>
          <div className="label">Booking Type</div>
          <div className="value">{booking.bookingType}</div>
        </DetailItem>

        <DetailItem>
          <div className="label">Check In</div>
          <div className="value">{formatDateTime(booking.checkInDate, booking.bookingType)}</div>
        </DetailItem>

        <DetailItem>
          <div className="label">Check Out</div>
          <div className="value">{formatDateTime(booking.checkOutDate, booking.bookingType)}</div>
        </DetailItem>

        <DetailItem>
          <div className="label">Duration</div>
          <div className="value">
            {booking.bookingType === 'Daily' 
              ? `${booking.totalDays} days`
              : `${booking.totalHours} hours`
            }
          </div>
        </DetailItem>

        <DetailItem>
          <div className="label">Status</div>
          <div className="value">{getStatusTag(booking.status)}</div>
        </DetailItem>

        {booking.services && booking.services.length > 0 && (
          <DetailItem style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <div className="label">Services</div>
            <div className="value" style={{ width: '100%' }}>
              {booking.services.map((service, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px',
                  background: '#f8f9fa',
                  borderRadius: '4px',
                  marginBottom: '4px'
                }}>
                  <span>
                    {service.serviceID?.serviceName} × {service.quantity}
                  </span>
                  <span>
                    {formatVND(calculateServiceTotal(service))}
                  </span>
                </div>
              ))}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '8px',
                background: '#e6f7ff',
                borderRadius: '4px',
                marginTop: '8px',
                fontWeight: 'bold'
              }}>
                <span>Total Services:</span>
                <span>
                  {formatVND(booking.services.reduce((total, service) => 
                    total + calculateServiceTotal(service), 0
                  ))}
                </span>
              </div>
            </div>
          </DetailItem>
        )}

        <DetailItem>
          <div className="label">Total Price</div>
          <div className="value" style={{ color: '#00a854', fontWeight: 'bold' }}>
            {formatVND(booking.totalPrice)}
          </div>
        </DetailItem>
      </DetailSection>
    </DetailModal>
  );
};

const StyledModal = styled(Modal)`
  .ant-modal-content {
    margin-top: 5px;
  }
  
  @media (max-width: 768px) {
    .ant-modal-content {
      margin-top: 10px;
    }
  }
`;

const TabsContainer = styled.div`
  .ant-tabs-nav {
    margin-bottom: 24px;
  }

  .ant-tabs-tab {
    padding: 12px 20px;
    
    .anticon {
      margin-right: 8px;
    }
  }

  @media (max-width: 768px) {
    .ant-tabs-nav {
      margin-bottom: 16px;
    }

    .ant-tabs-tab {
      padding: 8px 16px;
      
      .anticon {
        margin-right: 6px;
      }
    }
  }
`;

const AddButton = styled(Button)`
  height: 48px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #1a3353, #2c5282);
  border: none;
  box-shadow: 0 4px 12px rgba(26, 51, 83, 0.15);
  transition: all 0.3s ease;
  color: white;

  .anticon {
    font-size: 18px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #2c5282, #1e40af);
    box-shadow: 0 6px 16px rgba(26, 51, 83, 0.25);
    color: white;

    .anticon {
      transform: rotate(90deg);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(26, 51, 83, 0.15);
  }

  @media (max-width: 576px) {
    height: 42px;
    padding: 0 18px;
    font-size: 14px;
    
    .anticon {
      font-size: 16px;
    }
  }
`;

const BookingsManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const formRef = useRef(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      console.log('Fetched bookings data:', data);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Failed to fetch bookings');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Booking deleted successfully');
        fetchBookings();
      } else {
        if (data.invoice) {
          Modal.error({
            title: 'Cannot Delete Booking',
            content: (
              <div>
                <p>{data.message}</p>
                <p>This booking has an associated invoice:</p>
                <ul style={{ listStyle: 'none', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                  <li>Invoice ID: #{data.invoice.id}</li>
                  <li>Total Amount: {formatVND(data.invoice.totalAmount)}</li>
                  <li>Payment Status: {data.invoice.paymentStatus ? 'Paid' : 'Unpaid'}</li>
                </ul>
                <p style={{ marginTop: '10px', color: '#ff4d4f' }}>
                  Please handle the invoice first before attempting to delete this booking.
                </p>
              </div>
            ),
          });
        } else {
          message.error(data.message || 'Failed to delete booking');
        }
      }
    } catch (error) {
      message.error('Failed to delete booking');
    }
  };

  const handleSubmit = async (bookingData) => {
    try {
      const url = editingBooking 
        ? `http://localhost:5000/api/bookings/${editingBooking._id}`
        : 'http://localhost:5000/api/bookings';
      
      const method = editingBooking ? 'PUT' : 'POST';
      
      console.log('Submitting booking data:', bookingData); // Debug log

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      
      if (response.ok) {
        message.success(`Booking ${editingBooking ? 'updated' : 'created'} successfully`);
        if (data.invoice) {
          message.success('Invoice created successfully');
        }
        setIsFormVisible(false);
        setEditingBooking(null);
        fetchBookings();
        return data;
      } else {
        throw new Error(data.message || `Failed to ${editingBooking ? 'update' : 'create'} booking`);
      }
    } catch (error) {
      console.error('API error:', error); // Debug log
      message.error(error.message);
      throw error;
    }
  };

  const resetFormState = () => {
    setIsFormVisible(false);
    setEditingBooking(null);
    setFormMode('create');
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalVisible(true);
  };

  const resetForm = () => {
    setSelectedBooking(null);
    setEditingBooking(null);
    setFormMode('create');
    setIsFormVisible(true);
    if (formRef.current) {
      formRef.current.resetFields();
    }
  };

  const columns = [
    {
      title: 'Booking ID',
      key: 'bookingId',
      render: (record) => `#${record._id.slice(-6)}`,
    },
    {
      title: 'Room',
      key: 'room',
      render: (record) => `Room ${record.roomID.roomNumber}`,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record) => record.customerID?.fullname || record.customerID?.username || 'N/A',
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
      title: 'Total Price',
      key: 'totalPrice',
      render: (record) => formatVND(record.totalPrice),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record) => getStatusTag(record.status),
    },
    {
      title: 'Services',
      key: 'services',
      render: (record) => `${record.services.length} services`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<InfoCircleOutlined />}
            onClick={() => {
              setSelectedBooking(record);
              setIsDetailModalVisible(true);
            }}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setEditingBooking(record);
              setFormMode('edit');
              setIsFormVisible(true);
            }}
          />
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record._id);
            }}
          />
        </Space>
      ),
    },
  ];

  const historyColumns = [
    {
      title: 'Booking ID',
      key: 'bookingId',
      render: (record) => `#${record._id.slice(-6)}`,
    },
    {
      title: 'Room',
      key: 'room',
      render: (record) => `Room ${record.roomID.roomNumber}`,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record) => record.customerID?.fullname || record.customerID?.username || 'N/A',
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
      key: 'totalPrice',
      render: (record) => formatVND(record.totalPrice),
    },
    {
      title: 'Completed Date',
      key: 'completedDate',
      render: (record) => dayjs(record.updatedAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<InfoCircleOutlined />}
          onClick={() => {
            setSelectedBooking(record);
            setIsDetailModalVisible(true);
          }}
        />
      ),
    },
  ];

  // Thêm mobile column cho Active Bookings
  const mobileColumn = {
    title: 'Booking Info',
    key: 'bookingInfo',
    className: 'mobile-column',
    render: (record) => (
      <Space direction="vertical" size={4}>
        <div style={{ fontWeight: 500 }}>#{record._id.slice(-6)}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <HomeOutlined /> Room {record.roomID.roomNumber}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <UserOutlined /> {record.customerID?.fullname || record.customerID?.username || 'N/A'}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Check In: {formatDateTime(record.checkInDate, record.bookingType)}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Check Out: {formatDateTime(record.checkOutDate, record.bookingType)}
        </div>
        <div style={{ fontSize: '12px', color: '#1890ff' }}>
          {formatVND(record.totalPrice)}
        </div>
        <div>{getStatusTag(record.status)}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Services: {record.services.length}
        </div>
        <Space style={{ marginTop: 8 }}>
          <Button 
            type="primary"
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => {
              setSelectedBooking(record);
              setIsDetailModalVisible(true);
            }}
          />
          <Button 
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingBooking(record);
              setFormMode('edit');
              setIsFormVisible(true);
            }}
          />
          <Button 
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      </Space>
    ),
  };

  // Thêm mobile column cho History
  const mobileHistoryColumn = {
    title: 'Booking Info',
    key: 'bookingInfo',
    className: 'mobile-column',
    render: (record) => (
      <Space direction="vertical" size={4}>
        <div style={{ fontWeight: 500 }}>#{record._id.slice(-6)}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <HomeOutlined /> Room {record.roomID.roomNumber}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <UserOutlined /> {record.customerID?.fullname || record.customerID?.username || 'N/A'}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Duration: {record.bookingType === 'Daily' 
            ? `${record.totalDays} days`
            : `${record.totalHours} hours`
          }
        </div>
        <div style={{ fontSize: '12px', color: '#1890ff' }}>
          {formatVND(record.totalPrice)}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Completed: {dayjs(record.updatedAt).format('DD/MM/YYYY HH:mm')}
        </div>
        <Button 
          type="primary"
          icon={<InfoCircleOutlined />}
          size="small"
          onClick={() => {
            setSelectedBooking(record);
            setIsDetailModalVisible(true);
          }}
        />
      </Space>
    ),
  };

  // Cập nhật desktop columns với className
  const desktopColumns = columns.map(col => ({
    ...col,
    className: 'desktop-column'
  }));

  const desktopHistoryColumns = historyColumns.map(col => ({
    ...col,
    className: 'desktop-column'
  }));

  const activeColumns = [mobileColumn, ...desktopColumns];
  const historyColumnsResponsive = [mobileHistoryColumn, ...desktopHistoryColumns];

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <TitleSection>
            <div className="icon-wrapper">
              <CalendarOutlined />
            </div>
            <div className="text-content">
              <Title>Booking Management</Title>
              <Subtitle>Manage your hotel bookings efficiently</Subtitle>
            </div>
          </TitleSection>
          
          <AddButton onClick={() => {
            setFormMode('create');
            setIsFormVisible(true);
          }}>
            <PlusOutlined />
            New Booking
          </AddButton>
        </HeaderSection>

        <TabsContainer>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            items={[
              {
                key: 'active',
                label: (
                  <span>
                    <CalendarOutlined /> Active Bookings
                  </span>
                ),
                children: (
                  <TableContainer>
                    {loading ? (
                      <LoadingState>
                        <Spin size="large" />
                        <div className="text">Loading bookings...</div>
                      </LoadingState>
                    ) : (
                      <StyledTable
                        columns={activeColumns}
                        dataSource={bookings.filter(b => b.status !== 'Completed')}
                        rowKey="_id"
                        pagination={{
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          showTotal: (total) => `Total ${total} active bookings`,
                          pageSizeOptions: ['10', '20', '50', '100'],
                          responsive: true,
                        }}
                        scroll={{ x: true }}
                      />
                    )}
                  </TableContainer>
                ),
              },
              {
                key: 'history',
                label: (
                  <span>
                    <HistoryOutlined /> Booking History
                  </span>
                ),
                children: (
                  <TableContainer>
                    {loading ? (
                      <LoadingState>
                        <Spin size="large" />
                        <div className="text">Loading booking history...</div>
                      </LoadingState>
                    ) : (
                      <StyledTable
                        columns={historyColumnsResponsive}
                        dataSource={bookings.filter(b => b.status === 'Completed')}
                        rowKey="_id"
                        pagination={{
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          showTotal: (total) => `Total ${total} completed bookings`,
                          pageSizeOptions: ['10', '20', '50', '100'],
                          responsive: true,
                        }}
                        scroll={{ x: true }}
                      />
                    )}
                  </TableContainer>
                ),
              },
            ]}
          />
        </TabsContainer>
      </ContentWrapper>

      <StyledModal
        title={formMode === 'edit' ? 'Edit Booking' : 'Create New Booking'}
        open={isFormVisible}
        onCancel={resetFormState}
        footer={null}
        width={800}
        style={{ top: 5 }}
      >
        <BookingForm
          ref={formRef}
          booking={formMode === 'edit' ? editingBooking : null}
          onSubmit={handleSubmit}
          onCancel={resetFormState}
          isFormVisible={isFormVisible}
        />
      </StyledModal>

      <BookingDetailModal
        booking={selectedBooking}
        visible={isDetailModalVisible}
        onClose={() => {
          setSelectedBooking(null);
          setIsDetailModalVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default BookingsManagementPage; 