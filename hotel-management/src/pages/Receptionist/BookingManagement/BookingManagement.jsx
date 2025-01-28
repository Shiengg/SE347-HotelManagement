import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Form, Input, Select, DatePicker, message, Space, Modal, Spin, Table, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, UserOutlined, HomeOutlined, InfoCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import BookingForm from '../../Admin/BookingsManagementPage/BookingForm';

const { Option } = Select;

// Reuse styled components but change the theme color to blue
const PageContainer = styled.div`
  padding: 12px;
  width: 100%;
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid #1890ff;
  width: 100%;
`;

const HeaderSection = styled.div`
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: linear-gradient(45deg, #1890ff, #69c0ff);
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
    h1 {
      margin: 0;
      font-size: 24px;
      color: #1a3353;
    }

    p {
      margin: 4px 0 0;
      color: #666;
      font-size: 14px;
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
              {booking.services.map((service, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px',
                  background: '#f8f9fa',
                  borderRadius: '4px',
                  marginBottom: '4px'
                }}>
                  <span>{service.serviceID.serviceName} × {service.quantity}</span>
                  <span>{formatVND(service.totalPrice)}</span>
                </div>
              ))}
            </div>
          </DetailItem>
        )}
      </DetailSection>
    </DetailModal>
  );
};

const BookingManagement = () => {
  // Reuse all state and handlers from BookingsManagementPage
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const formRef = useRef(null);

  // Reuse all the same functions from BookingsManagementPage
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

  // Reuse the same columns configuration
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
            onClick={() => handleDelete(record._id)}
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
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={resetForm}
            style={{ background: '#1890ff' }}
          >
            Add New Booking
          </Button>
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
                        columns={columns}
                        dataSource={bookings.filter(b => b.status !== 'Completed')}
                        rowKey="_id"
                        pagination={{
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          showTotal: (total) => `Total ${total} active bookings`
                        }}
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
                        columns={historyColumns}
                        dataSource={bookings.filter(b => b.status === 'Completed')}
                        rowKey="_id"
                        pagination={{
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          showTotal: (total) => `Total ${total} completed bookings`
                        }}
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