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
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;

  .status-title {
    font-weight: 600;
    color: #1a3353;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-buttons {
    display: flex;
    gap: 12px;
  }

  .status-button {
    flex: 1;
    height: 40px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &.pending {
      background: ${props => props.status === 'Pending' ? '#fff7e6' : '#fff'};
      color: #fa8c16;
      border: 1px solid #ffd591;
      
      &:hover {
        background: #fff7e6;
      }
    }

    &.confirmed {
      background: ${props => props.status === 'Confirmed' ? '#f6ffed' : '#fff'};
      color: #52c41a;
      border: 1px solid #b7eb8f;
      
      &:hover {
        background: #f6ffed;
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
  const [previousStatus, setPreviousStatus] = useState(booking?.status || 'Pending');

  useEffect(() => {
    fetchRooms();
    fetchCustomers();
    fetchServices();
  }, [booking]);

  useEffect(() => {
    if (booking) {
      form.setFieldsValue({
        customerID: booking.customerID._id,
        receptionistID: booking.receptionistID._id,
        roomID: booking.roomID._id,
        bookingType: booking.bookingType,
        checkInDate: dayjs(booking.checkInDate),
        checkOutDate: dayjs(booking.checkOutDate),
        services: booking.services,
        status: booking.status
      });
      setBookingType(booking.bookingType);
      setPreviousStatus(booking.status);
      setSelectedRoom(booking.roomID);
      setEstimatedPrice(booking.totalPrice);
    }
  }, [booking, form]);

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
    }
  }));

  useEffect(() => {
    if (!booking) {
      setEstimatedPrice(0);
    }
  }, [booking]);

  useEffect(() => {
    setPreviousStatus(booking?.status || 'Pending');
  }, [booking]);

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
      const response = await fetch('http://localhost:5000/api/users?role=customer', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCustomers(data);
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

  const handleSubmit = async (values) => {
    try {
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

      // Xử lý services
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
          totalPrice: serviceTotalPrice // Đảm bảo có totalPrice cho mỗi service
        };
      }) || [];

      const bookingData = {
        customerID: values.customerID,
        receptionistID: values.receptionistID || currentUser._id,
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

      let response;
      if (booking?._id) {
        // Update existing booking
        response = await fetch(`http://localhost:5000/api/bookings/${booking._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(bookingData)
        });
      } else {
        // Create new booking
        response = await fetch('http://localhost:5000/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(bookingData)
        });
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save booking');
      }

      message.success(`Booking ${booking ? 'updated' : 'created'} successfully`);
      onSubmit?.(data);
      onCancel?.();
    } catch (error) {
      console.error('Form submission error:', error);
      message.error(error.message || 'Failed to save booking');
    }
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
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
        initialValues={{
          bookingType: 'Daily',
          status: 'Pending',
          services: []
        }}
      >
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
            >
              {customers.map(customer => (
                <Option key={customer._id} value={customer._id}>
                  {customer.fullname || customer.username}
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
          
          <Form.Item
            name="status"
            initialValue={booking?.status || 'Pending'}
          >
            <StatusSection status={form.getFieldValue('status')}>
              <div className="status-buttons">
                <Button
                  className={`status-button pending ${form.getFieldValue('status') === 'Pending' ? 'active' : ''}`}
                  onClick={() => form.setFieldsValue({ status: 'Pending' })}
                >
                  <ClockCircleOutlined />
                  Pending
                </Button>
                <Button
                  className={`status-button confirmed ${form.getFieldValue('status') === 'Confirmed' ? 'active' : ''}`}
                  onClick={() => form.setFieldsValue({ status: 'Confirmed' })}
                >
                  <CheckCircleOutlined />
                  Confirmed
                </Button>
              </div>
            </StatusSection>
          </Form.Item>
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