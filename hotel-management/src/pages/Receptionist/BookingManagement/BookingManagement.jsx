import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Form, Input, Select, DatePicker, message, Space, Modal, Spin, Table, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, UserOutlined, HomeOutlined, InfoCircleOutlined, HistoryOutlined, MenuOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import BookingForm from '../../Admin/BookingsManagementPage/BookingForm';

const { Option } = Select;

// Reuse styled components but change the theme color to blue
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

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid #1890ff;
  width: 100%;
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

  .text-content {
    h1 {
      margin: 0;
      font-size: 24px;
      color: #1a3353;
      
      @media (max-width: 576px) {
        font-size: 20px;
      }
    }

    p {
      margin: 4px 0 0;
      color: #666;
      font-size: 14px;
      
      @media (max-width: 576px) {
        font-size: 12px;
      }
    }
  }
`;

// Reuse other styled components from BookingsManagementPage but change gold colors to blue (#1890ff)
const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

const StatusTag = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  
  &.pending { color: #f59e0b; background: #fef3c7; }
  &.confirmed { color: #10b981; background: #d1fae5; }
`;

const TabsContainer = styled.div`
  margin-bottom: 24px;
  .ant-tabs-nav {
    margin-bottom: 0;
    &::before {
      border: none;
    }
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
  }
`;

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
    background: #1890ff;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      background: #40a9ff;
    }
  }
`;

// Reuse helper functions
const formatDateTime = (date, bookingType) => {
  if (bookingType === 'Hourly') {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  }
  return dayjs(date).format('DD/MM/YYYY');
};

const formatVND = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const getStatusTag = (status) => {
  const classNames = {
    'Pending': 'pending',
    'Confirmed': 'confirmed'
  };
  return <StatusTag className={classNames[status]}>{status}</StatusTag>;
};

// BookingDetailModal component
const BookingDetailModal = ({ booking, visible, onClose }) => {
  if (!booking) return null;

  return (
    <DetailModal
      title="Booking Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <DetailSection>
        {/* Reuse the same detail items as in BookingsManagementPage */}
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

        <DetailItem>
          <div className="label">Total Price</div>
          <div className="value" style={{ color: '#1890ff', fontWeight: 'bold' }}>
            {formatVND(booking.totalPrice)}
          </div>
        </DetailItem>

        {booking.services.length > 0 && (
          <DetailItem style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <div className="label">Services</div>
            <div className="value" style={{ width: '100%' }}>
              {booking.services.map((service, index) => {
                // Tính toán tổng giá cho mỗi service
                const serviceTotal = service.serviceID.servicePrice * service.quantity;
                
                return (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '8px',
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    marginBottom: '4px'
                  }}>
                    <span>{service.serviceID.serviceName} × {service.quantity}</span>
                    <span>{formatVND(serviceTotal)}</span>
                  </div>
                );
              })}
            </div>
          </DetailItem>
        )}
      </DetailSection>
    </DetailModal>
  );
};

// Thêm MenuButton component
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

const BookingManagement = ({ onToggleSidebar }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const formRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [columns, setColumns] = useState([]);
  const [historyColumns, setHistoryColumns] = useState([]);

  // Định nghĩa columns mặc định trong useEffect
  useEffect(() => {
    const defaultColumns = [
      {
        title: 'Booking ID',
        key: 'bookingId',
        className: 'desktop-column',
        render: (record) => `#${record._id.slice(-6)}`,
      },
      {
        title: 'Room',
        key: 'room',
        className: 'desktop-column',
        render: (record) => `Room ${record.roomID.roomNumber}`,
      },
      {
        title: 'Customer',
        key: 'customer',
        className: 'desktop-column',
        render: (record) => record.customerID?.fullname || record.customerID?.username || 'N/A',
      },
      {
        title: 'Check In',
        key: 'checkIn',
        className: 'desktop-column',
        render: (record) => formatDateTime(record.checkInDate, record.bookingType),
      },
      {
        title: 'Check Out',
        key: 'checkOut',
        className: 'desktop-column',
        render: (record) => formatDateTime(record.checkOutDate, record.bookingType),
      },
      {
        title: 'Total Price',
        key: 'totalPrice',
        className: 'desktop-column',
        render: (record) => formatVND(record.totalPrice),
      },
      {
        title: 'Status',
        key: 'status',
        className: 'desktop-column',
        render: (record) => getStatusTag(record.status),
      },
      {
        title: 'Services',
        key: 'services',
        className: 'desktop-column',
        render: (record) => `${record.services.length} services`,
      },
      {
        title: 'Actions',
        key: 'actions',
        className: 'desktop-column',
        render: (_, record) => (
          <Space>
            <Button 
              type="text" 
              icon={<InfoCircleOutlined />}
              size="small"
              onClick={() => {
                setSelectedBooking(record);
                setIsDetailModalVisible(true);
              }}
            />
            <Button 
              type="text" 
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingBooking(record);
                setFormMode('edit');
                setIsFormVisible(true);
              }}
            />
            <Button 
              type="text" 
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record._id)}
            />
          </Space>
        ),
      },
    ];

    const defaultHistoryColumns = [
      {
        title: 'Booking ID',
        key: 'bookingId',
        className: 'desktop-column',
        render: (record) => `#${record._id.slice(-6)}`,
      },
      {
        title: 'Room',
        key: 'room',
        className: 'desktop-column',
        render: (record) => `Room ${record.roomID.roomNumber}`,
      },
      {
        title: 'Customer',
        key: 'customer',
        className: 'desktop-column',
        render: (record) => record.customerID?.fullname || record.customerID?.username || 'N/A',
      },
      {
        title: 'Check In',
        key: 'checkIn',
        className: 'desktop-column',
        render: (record) => formatDateTime(record.checkInDate, record.bookingType),
      },
      {
        title: 'Check Out',
        key: 'checkOut',
        className: 'desktop-column',
        render: (record) => formatDateTime(record.checkOutDate, record.bookingType),
      },
      {
        title: 'Duration',
        key: 'duration',
        className: 'desktop-column',
        render: (record) => (
          record.bookingType === 'Daily' 
            ? `${record.totalDays} days`
            : `${record.totalHours} hours`
        ),
      },
      {
        title: 'Total Price',
        key: 'totalPrice',
        className: 'desktop-column',
        render: (record) => formatVND(record.totalPrice),
      },
      {
        title: 'Completed Date',
        key: 'completedDate',
        className: 'desktop-column',
        render: (record) => dayjs(record.updatedAt).format('DD/MM/YYYY HH:mm'),
      },
      {
        title: 'Actions',
        key: 'actions',
        className: 'desktop-column',
        render: (_, record) => (
          <Button 
            type="text" 
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => {
              setSelectedBooking(record);
              setIsDetailModalVisible(true);
            }}
          />
        ),
      },
    ];

    setColumns(defaultColumns);
    setHistoryColumns(defaultHistoryColumns);
  }, []);

  // Cập nhật useEffect theo dõi resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
    };

    // Thêm debounce để tránh cập nhật quá nhiều
    let timeoutId = null;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedHandleResize);
    
    // Gọi handleResize ngay lập tức để có giá trị khởi tạo
    handleResize();

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
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
            content: 'This booking has an associated invoice and cannot be deleted.',
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
        setIsFormVisible(false);
        setEditingBooking(null);
        fetchBookings();
      } else {
        throw new Error(data.message || 'Failed to save booking');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const resetFormState = () => {
    setIsFormVisible(false);
    setEditingBooking(null);
    setFormMode('create');
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
          <UserOutlined /> {record.customerID?.fullname || 'N/A'}
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
        <Space style={{ marginTop: 8 }}>
          <Button 
            type="text" 
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => {
              setSelectedBooking(record);
              setIsDetailModalVisible(true);
            }}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingBooking(record);
              setFormMode('edit');
              setIsFormVisible(true);
            }}
          />
          <Button 
            type="text" 
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
          <UserOutlined /> {record.customerID?.fullname || 'N/A'}
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
          type="text" 
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

  // Thêm desktop columns cho Active Bookings
  const desktopColumns = [
    {
      title: 'Booking ID',
      key: 'bookingId',
      className: 'desktop-column',
      render: (record) => `#${record._id.slice(-6)}`,
    },
    {
      title: 'Room',
      key: 'room',
      className: 'desktop-column',
      render: (record) => `Room ${record.roomID.roomNumber}`,
    },
    {
      title: 'Customer',
      key: 'customer',
      className: 'desktop-column',
      render: (record) => record.customerID?.fullname || record.customerID?.username || 'N/A',
    },
    {
      title: 'Check In',
      key: 'checkIn',
      className: 'desktop-column',
      render: (record) => formatDateTime(record.checkInDate, record.bookingType),
    },
    {
      title: 'Check Out',
      key: 'checkOut',
      className: 'desktop-column',
      render: (record) => formatDateTime(record.checkOutDate, record.bookingType),
    },
    {
      title: 'Total Price',
      key: 'totalPrice',
      className: 'desktop-column',
      render: (record) => formatVND(record.totalPrice),
    },
    {
      title: 'Status',
      key: 'status',
      className: 'desktop-column',
      render: (record) => getStatusTag(record.status),
    },
    {
      title: 'Services',
      key: 'services',
      className: 'desktop-column',
      render: (record) => `${record.services.length} services`,
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'desktop-column',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => {
              setSelectedBooking(record);
              setIsDetailModalVisible(true);
            }}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingBooking(record);
              setFormMode('edit');
              setIsFormVisible(true);
            }}
          />
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  // Thêm desktop columns cho History
  const desktopHistoryColumns = [
    {
      title: 'Booking ID',
      key: 'bookingId',
      className: 'desktop-column',
      render: (record) => `#${record._id.slice(-6)}`,
    },
    {
      title: 'Room',
      key: 'room',
      className: 'desktop-column',
      render: (record) => `Room ${record.roomID.roomNumber}`,
    },
    {
      title: 'Customer',
      key: 'customer',
      className: 'desktop-column',
      render: (record) => record.customerID?.fullname || record.customerID?.username || 'N/A',
    },
    {
      title: 'Check In',
      key: 'checkIn',
      className: 'desktop-column',
      render: (record) => formatDateTime(record.checkInDate, record.bookingType),
    },
    {
      title: 'Check Out',
      key: 'checkOut',
      className: 'desktop-column',
      render: (record) => formatDateTime(record.checkOutDate, record.bookingType),
    },
    {
      title: 'Duration',
      key: 'duration',
      className: 'desktop-column',
      render: (record) => (
        record.bookingType === 'Daily' 
          ? `${record.totalDays} days`
          : `${record.totalHours} hours`
      ),
    },
    {
      title: 'Total Price',
      key: 'totalPrice',
      className: 'desktop-column',
      render: (record) => formatVND(record.totalPrice),
    },
    {
      title: 'Completed Date',
      key: 'completedDate',
      className: 'desktop-column',
      render: (record) => dayjs(record.updatedAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'desktop-column',
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<InfoCircleOutlined />}
          size="small"
          onClick={() => {
            setSelectedBooking(record);
            setIsDetailModalVisible(true);
          }}
        />
      ),
    },
  ];

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
              <h1>Booking Management</h1>
              <p>Manage hotel bookings efficiently</p>
            </div>
          </TitleSection>
          
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={resetForm}
              style={{ background: '#1890ff' }}
            >
              Add New Booking
            </Button>
            <MenuButton onClick={onToggleSidebar}>
              <MenuOutlined />
            </MenuButton>
          </Space>
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

export default BookingManagement; 