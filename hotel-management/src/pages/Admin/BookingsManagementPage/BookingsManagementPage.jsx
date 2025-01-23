import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Form, Input, Select, DatePicker, message, Space, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, UserOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import BookingForm from './BookingForm';

const { Option } = Select;

const PageContainer = styled.div`
  padding: 12px;
  width: 100%;
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid gold;
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

  .text-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: #1a3353;
  font-size: 1.8em;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9em;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const BookingTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f8f9fa;
    color: #1a3353;
    font-weight: 500;
    font-size: 0.95em;
  }

  tr {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #f8f9fa;
    }

    ${props => props.isSelected && `
      background: linear-gradient(45deg, #ffd700, #ffed4a);
      
      &:hover {
        background: linear-gradient(45deg, #ffd700, #ffed4a);
      }
    `}
  }

  td {
    color: #1a3353;
    font-size: 0.95em;
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
  &.cancelled { color: #ef4444; background: #fee2e2; }
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

const BookingsManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formMode, setFormMode] = useState('create');

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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        message.success('Booking deleted successfully');
        fetchBookings();
        setSelectedBooking(null);
      }
    } catch (error) {
      message.error('Failed to delete booking');
    }
  };

  const getStatusTag = (status) => {
    const classNames = {
      'Pending': 'pending',
      'Confirmed': 'confirmed',
      'Cancelled': 'cancelled'
    };
    return <StatusTag className={classNames[status]}>{status}</StatusTag>;
  };

  const handleSubmit = async (values) => {
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
        body: JSON.stringify(values)
      });

      const data = await response.json();
      
      if (response.ok) {
        message.success(`Booking ${editingBooking ? 'updated' : 'created'} successfully`);
        if (!editingBooking) {
          message.info(`Invoice #${data.invoice._id} has been created`);
        }
        setIsFormVisible(false);
        setEditingBooking(null);
        fetchBookings();
      } else {
        throw new Error(data.message || `Failed to ${editingBooking ? 'update' : 'create'} booking`);
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
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedBooking(null);
              setEditingBooking(null);
              setFormMode('create');
              setIsFormVisible(true);
            }}
          >
            Add New Booking
          </Button>
        </HeaderSection>

        <TableContainer>
          <BookingTable>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Room</th>
                <th>Customer</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Services</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>#{booking._id.slice(-6)}</td>
                  <td>Room {booking.roomID.roomNumber}</td>
                  <td>{booking.customerID.name}</td>
                  <td>{dayjs(booking.checkInDate).format('DD/MM/YYYY')}</td>
                  <td>{dayjs(booking.checkOutDate).format('DD/MM/YYYY')}</td>
                  <td>{formatVND(booking.totalPrice)}</td>
                  <td>{getStatusTag(booking.status)}</td>
                  <td>{booking.services.length} services</td>
                  <td>
                    <Space>
                      <Button 
                        type="text" 
                        icon={<InfoCircleOutlined />}
                        onClick={() => setSelectedBooking(booking)}
                      />
                      <Button 
                        type="text" 
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBooking(booking);
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
                          handleDelete(booking._id);
                        }}
                      />
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </BookingTable>
        </TableContainer>
      </ContentWrapper>

      <Modal
        title={formMode === 'edit' ? 'Edit Booking' : 'Create New Booking'}
        open={isFormVisible}
        onCancel={resetFormState}
        footer={null}
        width={800}
      >
        <BookingForm
          booking={formMode === 'edit' ? editingBooking : null}
          onSubmit={handleSubmit}
          onCancel={resetFormState}
        />
      </Modal>

      <DetailModal
        title="Booking Details"
        open={!!selectedBooking}
        onCancel={() => setSelectedBooking(null)}
        footer={[
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingBooking(selectedBooking);
              setFormMode('edit');
              setIsFormVisible(true);
              setSelectedBooking(null);
            }}
          >
            Edit Booking
          </Button>,
          <Button
            key="delete"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              handleDelete(selectedBooking._id);
              setSelectedBooking(null);
            }}
          >
            Delete Booking
          </Button>
        ]}
        width={600}
      >
        {selectedBooking && (
          <DetailSection>
            <DetailItem>
              <div className="label">Status</div>
              <div className="value">
                {getStatusTag(selectedBooking.status)}
              </div>
            </DetailItem>

            <DetailItem>
              <div className="label">Room</div>
              <div className="value">
                Room {selectedBooking.roomID.roomNumber} ({selectedBooking.roomID.roomType})
              </div>
            </DetailItem>

            <DetailItem>
              <div className="label">Customer</div>
              <div className="value">
                {selectedBooking.customerID.name}
              </div>
            </DetailItem>

            <DetailItem>
              <div className="label">Check In</div>
              <div className="value">
                {dayjs(selectedBooking.checkInDate).format('DD/MM/YYYY')}
              </div>
            </DetailItem>

            <DetailItem>
              <div className="label">Check Out</div>
              <div className="value">
                {dayjs(selectedBooking.checkOutDate).format('DD/MM/YYYY')}
              </div>
            </DetailItem>

            <DetailItem>
              <div className="label">Total Price</div>
              <div className="value" style={{ color: '#00a854', fontWeight: 'bold' }}>
                {formatVND(selectedBooking.totalPrice)}
              </div>
            </DetailItem>

            <DetailItem style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div className="label">Services</div>
              <div style={{ width: '100%' }}>
                {selectedBooking.services.map(service => (
                  <div key={service._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px dashed #eee'
                  }}>
                    <span>{service.serviceID.name} x{service.quantity}</span>
                    <span>{formatVND(service.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </DetailItem>
          </DetailSection>
        )}
      </DetailModal>
    </PageContainer>
  );
};

export default BookingsManagementPage; 