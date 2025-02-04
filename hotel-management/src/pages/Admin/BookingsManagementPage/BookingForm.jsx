import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { Form, Input, Select, DatePicker, InputNumber, Button, Space, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  UserOutlined, 
  HomeOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  CoffeeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;

const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 700px;
  margin: 0 auto;
`;

const ServiceSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const FormSection = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #1a3353;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #ffd700;
    display: flex;
    align-items: center;
    gap: 8px;

    .anticon {
      color: #ffd700;
    }
  }

  .ant-form-item-label > label {
    font-weight: 600;
    color: #2c3e50;
  }
`;

const DateTimeWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;

  .ant-form-item {
    margin-bottom: 0;
  }

  .ant-picker {
    width: 100%;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const PriceDisplay = styled.div`
  margin: 16px 0 8px;
  padding: 12px 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .price-label {
    font-weight: 600;
    color: #389e0d;
    font-size: 14px;
  }

  .price-value {
    font-size: 16px;
    font-weight: 700;
    color: #389e0d;
  }
`;

const StatusSection = styled.div`
  .status-description {
    margin-bottom: 16px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 14px;
    color: #666;
  }

  .status-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    position: relative;
  }

  .status-button {
    padding: 16px;
    border-radius: 8px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;

    .status-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }

    .status-title {
      font-weight: 600;
      font-size: 16px;
    }

    .status-desc {
      font-size: 12px;
      color: #666;
      text-align: center;
    }

    &.pending {
      background: #fff7e6;
      border-color: #ffd591;
      
      .status-icon, .status-title {
        color: #fa8c16;
      }

      &:hover {
        background: #fff1b8;
        border-color: #ffa940;
      }

      &.active {
        background: #fff1b8;
        border-color: #ffa940;
        
        &::after {
          content: '✓';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fa8c16;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
      }
    }

    &.confirmed {
      background: #f6ffed;
      border-color: #b7eb8f;
      
      .status-icon, .status-title {
        color: #52c41a;
      }

      &:hover {
        background: #d9f7be;
        border-color: #73d13d;
      }

      &.active {
        background: #d9f7be;
        border-color: #73d13d;
        
        &::after {
          content: '✓';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #52c41a;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
      }
    }
  }
`;

const StyledButton = styled(Button)`
  &.active {
    transform: scale(1.02);
    font-weight: 600;
  }

  &.pending.active {
    background: #fff7e6 !important;
    border-color: #ffa940;
  }

  &.confirmed.active {
    background: #f6ffed !important;
    border-color: #73d13d;
  }
`;

const BookingForm = forwardRef(({ booking, onSubmit, onCancel, isFormVisible }, ref) => {
  const { currentUser } = useAuth();
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingType, setBookingType] = useState(booking?.bookingType || 'Daily');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'Pending');

  useEffect(() => {
    fetchRooms();
    fetchCustomers();
    fetchServices();
  }, [booking]);

  useEffect(() => {
    if (booking) {
      form.setFieldsValue({
        customerID: booking.customerID._id,
        roomID: booking.roomID._id,
        bookingType: booking.bookingType,
        checkInDate: dayjs(booking.checkInDate),
        checkOutDate: dayjs(booking.checkOutDate),
        services: booking.services,
        status: booking.status,
        receptionistID: booking.receptionistID?._id || currentUser?.id
      });
      setBookingType(booking.bookingType);
      setSelectedRoom(booking.roomID);
      setEstimatedPrice(booking.totalPrice);
    }
  }, [booking, form, currentUser]);

  useEffect(() => {
    console.log('Current user:', currentUser);
  }, [currentUser]);

  useImperativeHandle(ref, () => ({
    resetFields: () => {
      form.resetFields();
      setSelectedRoom(null);
      setBookingType('Daily');
      setEstimatedPrice(0);
      fetchRooms();
    },
    handleSubmit: async () => {
      try {
        // Validate form first
        const values = await form.validateFields();
        
        if (!currentUser?.id) {
          throw new Error('No receptionist ID available');
        }

        const checkInDate = dayjs(values.checkInDate);
        const checkOutDate = dayjs(values.checkOutDate);
        
        let totalDays = 0;
        let totalHours = 0;
        let totalPrice = 0;
        
        if (values.bookingType === 'Daily') {
          totalDays = Math.max(1, Math.ceil(checkOutDate.diff(checkInDate, 'day', true)));
          totalPrice = selectedRoom.dailyPrice * totalDays;
        } else {
          totalHours = Math.max(1, Math.ceil(checkOutDate.diff(checkInDate, 'hour', true)));
          totalPrice = selectedRoom.hourlyPrice * totalHours;
        }

        const formattedServices = values.services?.map(service => {
          const servicePrice = service.serviceID.servicePrice || 
            (typeof service.serviceID === 'string' ? 
              services.find(s => s._id === service.serviceID)?.servicePrice : 
              service.serviceID.servicePrice);

          const serviceTotalPrice = service.quantity * servicePrice;
          totalPrice += serviceTotalPrice;

          return {
            serviceID: typeof service.serviceID === 'string' ? service.serviceID : service.serviceID._id,
            quantity: service.quantity,
            totalPrice: serviceTotalPrice
          };
        }) || [];

        const bookingData = {
          customerID: values.customerID,
          receptionistID: currentUser.id,
          roomID: values.roomID,
          bookingType: values.bookingType,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          totalDays: values.bookingType === 'Daily' ? totalDays : null,
          totalHours: values.bookingType === 'Hourly' ? totalHours : null,
          services: formattedServices,
          totalPrice,
          status: values.status || 'Pending'
        };

        return bookingData;
      } catch (error) {
        console.error('Form validation error:', error);
        message.error(error.message);
        throw error;
      }
    }
  }));

  useEffect(() => {
    if (!booking) {
      setEstimatedPrice(0);
    }
  }, [booking]);

  useEffect(() => {
    const status = form.getFieldValue('status');
    if (status) {
      setCurrentStatus(status);
    }
  }, [form.getFieldValue('status')]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (booking) {
        const currentRoom = data.find(room => room._id === booking.roomID._id);
        const availableRooms = data.filter(room => 
          room.status === 'Available' || (currentRoom && room._id === currentRoom._id)
        );
        setRooms(availableRooms);
      } else {
        const availableRooms = data.filter(room => room.status === 'Available');
        setRooms(availableRooms);
      }
    } catch (error) {
      message.error('Failed to fetch rooms');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Lọc chỉ lấy users có role là Customer
      const customersList = data.filter(user => 
        user.role_id._id === '6783daa202236e8ab00f4ff0' // ID của role Customer
      );
      
      setCustomers(customersList);
    } catch (error) {
      message.error('Failed to fetch customers');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setServices(data);
    } catch (error) {
      message.error('Failed to fetch services');
    }
  };

  const validateDates = (_, value) => {
    if (!value) {
      return Promise.reject('Date is required');
    }

    if (!booking) {
      const today = dayjs().startOf('day');
      if (value.isBefore(today)) {
        return Promise.reject('Date cannot be in the past');
      }
    }
    
    return Promise.resolve();
  };

  const validateCheckOutDate = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value) {
        return Promise.reject('Check-out date is required');
      }
      const checkInDate = getFieldValue('checkInDate');
      if (checkInDate && value.diff(checkInDate) <= 0) {
        return Promise.reject('Check-out date must be after check-in date');
      }
      return Promise.resolve();
    },
  });

  const calculateHours = (checkIn, checkOut) => {
    const totalHours = checkOut.diff(checkIn, 'hour');
    
    if (totalHours === 0) {
      if (checkOut.format('YYYY-MM-DD') !== checkIn.format('YYYY-MM-DD')) {
        return 24;
      }
    }
    
    return totalHours;
  };

  const calculatePrice = () => {
    if (!form.getFieldValue('checkInDate') || !form.getFieldValue('checkOutDate')) {
      return 0;
    }

    const checkIn = dayjs(form.getFieldValue('checkInDate'));
    const checkOut = dayjs(form.getFieldValue('checkOutDate'));
    
    const room = selectedRoom || (booking?.roomID);
    if (!room) return 0;

    if (bookingType === 'Daily') {
      const days = Math.max(1, Math.ceil(checkOut.diff(checkIn, 'day', true)));
      return room.dailyPrice * days;
    } else {
      const hours = Math.max(1, Math.ceil(checkOut.diff(checkIn, 'hour', true)));
      return room.hourlyPrice * hours;
    }
  };

  useEffect(() => {
    if (isFormVisible) {
      fetchRooms();
    }
  }, [isFormVisible]);

  useEffect(() => {
    const checkInDate = form.getFieldValue('checkInDate');
    const checkOutDate = form.getFieldValue('checkOutDate');
    const formServices = form.getFieldValue('services') || [];

    const room = selectedRoom || (booking?.roomID);
    if (room && checkInDate && checkOutDate) {
      const roomPrice = calculatePrice();
      const servicesPrice = formServices.reduce((total, service) => {
        if (service?.serviceID) {
          const serviceData = services.find(s => 
            s._id === (typeof service.serviceID === 'string' ? 
              service.serviceID : service.serviceID._id)
          );
          if (serviceData) {
            return total + (serviceData.servicePrice * (service.quantity || 0));
          }
        }
        return total;
      }, 0);

      setEstimatedPrice(roomPrice + servicesPrice);
    }
  }, [
    selectedRoom,
    booking?.roomID,
    form.getFieldValue('checkInDate'),
    form.getFieldValue('checkOutDate'),
    form.getFieldValue('services'),
    bookingType
  ]);

  const handleFormChange = () => {
    const checkInDate = form.getFieldValue('checkInDate');
    const checkOutDate = form.getFieldValue('checkOutDate');
    const formServices = form.getFieldValue('services') || [];

    if (selectedRoom && checkInDate && checkOutDate) {
      const roomPrice = calculatePrice();
      const servicesPrice = formServices.reduce((total, service) => {
        if (service?.serviceID) {
          const serviceData = services.find(s => s._id === service.serviceID);
          if (serviceData) {
            return total + (serviceData.servicePrice * (service.quantity || 0));
          }
        }
        return total;
      }, 0);

      setEstimatedPrice(roomPrice + servicesPrice);
    }
  };

  return (
    <FormContainer>
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          try {
            const bookingData = await ref.current.handleSubmit();
            await onSubmit(bookingData);
          } catch (error) {
            console.error('Form submission error:', error);
          }
        }}
        onValuesChange={handleFormChange}
        initialValues={{
          bookingType: 'Daily',
          status: 'Pending',
          services: [],
          receptionistID: currentUser?.id
        }}
      >
        <Form.Item
          name="receptionistID"
          hidden
        >
          <Input />
        </Form.Item>

        <FormSection>
          <div className="section-title">
            <UserOutlined />
            Basic Information
          </div>
          <Form.Item
            name="customerID"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer' }]}
          >
            <Select 
              placeholder="Select customer"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {customers.map(customer => (
                <Option key={customer._id} value={customer._id}>
                  <Space>
                    <UserOutlined />
                    <span>{customer.fullname}</span>
                    <span style={{ color: '#8c8c8c' }}>({customer.email})</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="roomID"
            label="Room"
            rules={[{ required: true, message: 'Please select a room' }]}
          >
            <Select 
              placeholder="Select room"
              showSearch
              optionFilterProp="children"
              notFoundContent={rooms.length === 0 ? "No available rooms" : "No rooms found"}
              onChange={(value) => {
                const room = rooms.find(r => r._id === value);
                setSelectedRoom(room);
              }}
            >
              {rooms.map(room => (
                <Option 
                  key={room._id} 
                  value={room._id}
                  disabled={room.status === 'Occupied' && room._id !== booking?.roomID._id}
                >
                  <Space>
                    <span>Room {room.roomNumber}</span>
                    <span style={{ color: '#8c8c8c' }}>({room.roomType})</span>
                    <span style={{ color: '#52c41a' }}>
                      Daily: {room.dailyPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <span style={{ color: '#1890ff' }}>
                      Hourly: {room.hourlyPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </FormSection>

        <FormSection>
          <div className="section-title">
            <HomeOutlined />
            Booking Details
          </div>
          <Form.Item
            name="bookingType"
            label="Booking Type"
            rules={[{ required: true }]}
          >
            <Select 
              value={bookingType}
              onChange={(value) => setBookingType(value)}
            >
              <Option value="Daily">
                <Space>
                  <CalendarOutlined />
                  Book by Day
                </Space>
              </Option>
              <Option value="Hourly">
                <Space>
                  <ClockCircleOutlined />
                  Book by Hour
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <DateTimeWrapper>
            <Form.Item
              name="checkInDate"
              label="Check In"
              rules={[
                { required: true, message: 'Please select check-in time' },
                { validator: validateDates }
              ]}
            >
              <DatePicker 
                showTime={bookingType === 'Hourly'}
                format={bookingType === 'Hourly' ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY"}
                showNow={false}
                disabledDate={(current) => {
                  if (!booking) {
                    return current && current < dayjs().startOf('day');
                  }
                  return false;
                }}
                placeholder={bookingType === 'Hourly' ? "Select check-in date and time" : "Select check-in date"}
              />
            </Form.Item>

            <Form.Item
              name="checkOutDate"
              label="Check Out"
              rules={[
                { required: true, message: 'Please select check-out time' },
                validateCheckOutDate
              ]}
              dependencies={['checkInDate']}
            >
              <DatePicker 
                showTime={bookingType === 'Hourly'}
                format={bookingType === 'Hourly' ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY"}
                showNow={false}
                disabledDate={(current) => {
                  const checkInDate = form.getFieldValue('checkInDate');
                  if (!checkInDate) return true;
                  return current && current < checkInDate;
                }}
                placeholder={bookingType === 'Hourly' ? "Select check-out date and time" : "Select check-out date"}
              />
            </Form.Item>
          </DateTimeWrapper>

          <PriceDisplay>
            <span className="price-label">Estimated Room Price:</span>
            <span className="price-value">{estimatedPrice.toLocaleString('vi-VN')}đ</span>
          </PriceDisplay>
        </FormSection>

        <FormSection>
          <div className="section-title">
            <CoffeeOutlined />
            Additional Services
          </div>
          <Form.List name="services">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 12 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'serviceID']}
                      rules={[{ required: true, message: 'Please select a service' }]}
                    >
                      <Select style={{ width: 250 }} placeholder="Select service">
                        {services.map(service => (
                          <Option key={service._id} value={service._id}>
                            <Space>
                              <span>{service.serviceName}</span>
                              <span style={{ color: '#52c41a' }}>
                                ({service.servicePrice.toLocaleString('vi-VN')}đ)
                              </span>
                            </Space>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'Enter quantity' }]}
                    >
                      <InputNumber 
                        min={1} 
                        placeholder="Qty"
                        style={{ width: 100 }}
                      />
                    </Form.Item>
                    <Button 
                      onClick={() => remove(name)} 
                      type="text" 
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Service
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </FormSection>

        <FormSection>
          <div className="section-title">
            <CheckCircleOutlined />
            Booking Status
          </div>
          
          <StatusSection>
            <div className="status-description">
              Choose the appropriate status for this booking. This will affect room availability and invoice generation.
            </div>
            
            <Form.Item
              name="status"
              initialValue={booking?.status || 'Pending'}
            >
              <div className="status-buttons">
                <div
                  className={`status-button pending ${currentStatus === 'Pending' ? 'active' : ''}`}
                  onClick={() => {
                    form.setFieldsValue({ status: 'Pending' });
                    setCurrentStatus('Pending');
                  }}
                >
                  <ClockCircleOutlined className="status-icon" />
                  <div className="status-title">Pending</div>
                  <div className="status-desc">
                    Reserve the room without immediate confirmation.
                    No invoice will be generated.
                  </div>
                </div>

                <div
                  className={`status-button confirmed ${currentStatus === 'Confirmed' ? 'active' : ''}`}
                  onClick={() => {
                    form.setFieldsValue({ status: 'Confirmed' });
                    setCurrentStatus('Confirmed');
                  }}
                >
                  <CheckCircleOutlined className="status-icon" />
                  <div className="status-title">Confirmed</div>
                  <div className="status-desc">
                    Confirm the booking and generate an invoice.
                    Room will be marked as occupied.
                  </div>
                </div>
              </div>
            </Form.Item>
          </StatusSection>
        </FormSection>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {booking ? 'Update Booking' : 'Create Booking'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </FormContainer>
  );
});

export default BookingForm; 