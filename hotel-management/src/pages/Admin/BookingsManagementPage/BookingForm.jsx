import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { Form, Input, Select, DatePicker, InputNumber, Button, Space, message } from 'antd';
import dayjs from 'dayjs';
import { useAuth } from '../../../contexts/AuthContext';

const { Option } = Select;

const FormContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
`;

const ServiceSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const BookingForm = forwardRef(({ booking, onSubmit, onCancel }, ref) => {
  const { currentUser } = useAuth();
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingType, setBookingType] = useState(booking?.bookingType || 'Daily');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);

  useEffect(() => {
    fetchRooms();
    fetchCustomers();
    fetchServices();
  }, [booking]);

  useEffect(() => {
    if (booking) {
      form.setFieldsValue({
        ...booking,
        checkInDate: dayjs(booking.checkInDate),
        checkOutDate: dayjs(booking.checkOutDate),
        customerID: booking.customerID._id,
        roomID: booking.roomID._id,
        services: booking.services.map(s => ({
          serviceID: s.serviceID._id,
          quantity: s.quantity
        }))
      });
      setSelectedServices(booking.services);
    } else {
      form.resetFields();
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
      fetchRooms();
    }
  }));

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
    const today = dayjs().startOf('day');
    if (value.isBefore(today)) {
      return Promise.reject('Date cannot be in the past');
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
      let userID = currentUser?.id;
      
      if (!userID) {
        const localUser = localStorage.getItem('user');
        if (localUser) {
          const userData = JSON.parse(localUser);
          userID = userData.id || userData._id;
        }
      }

      if (!userID) {
        throw new Error('User not authenticated');
      }

      const checkIn = dayjs(values.checkInDate);
      const checkOut = dayjs(values.checkOutDate);
      let totalDays = null;
      let totalHours = null;

      if (bookingType === 'Daily') {
        totalDays = Math.ceil(checkOut.diff(checkIn, 'day', true));
      } else {
        totalHours = calculateHours(checkIn, checkOut);
      }

      const roomPrice = calculatePrice();
      const servicesPrice = values.services ? values.services.reduce((total, service) => {
        const serviceData = services.find(s => s._id === service.serviceID);
        return total + (serviceData?.servicePrice || 0) * service.quantity;
      }, 0) : 0;

      const formattedValues = {
        customerID: values.customerID,
        roomID: values.roomID,
        bookingType: bookingType,
        checkInDate: values.checkInDate.toISOString(),
        checkOutDate: values.checkOutDate.toISOString(),
        totalDays: totalDays,
        totalHours: totalHours,
        receptionistID: userID,
        status: values.status || 'Pending',
        services: values.services ? values.services.map(service => ({
          serviceID: service.serviceID,
          quantity: parseInt(service.quantity)
        })) : [],
        totalPrice: roomPrice + servicesPrice
      };

      console.log('Submitting booking:', formattedValues);
      await onSubmit(formattedValues);
      
      fetchRooms();
    } catch (error) {
      console.error('Form submission error:', error);
      message.error(error.message || 'Failed to submit booking');
    }
  };

  const calculatePrice = () => {
    if (!selectedRoom || !form.getFieldValue('checkInDate') || !form.getFieldValue('checkOutDate')) {
      return 0;
    }

    const checkIn = dayjs(form.getFieldValue('checkInDate'));
    const checkOut = dayjs(form.getFieldValue('checkOutDate'));
    
    if (bookingType === 'Daily') {
      const days = Math.ceil(checkOut.diff(checkIn, 'day', true));
      return selectedRoom.dailyPrice * days;
    } else {
      const hours = calculateHours(checkIn, checkOut);
      return selectedRoom.hourlyPrice * hours;
    }
  };

  useEffect(() => {
    if (isFormVisible) {
      fetchRooms();
    }
  }, [isFormVisible]);

  return (
    <FormContainer>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'Pending',
          services: [],
          bookingType: 'Daily'
        }}
      >
        <Form.Item
          name="customerID"
          label="Customer"
          rules={[{ required: true, message: 'Please select a customer' }]}
        >
          <Select placeholder="Select customer">
            {customers.map(customer => (
              <Option key={customer._id} value={customer._id}>
                {customer.name} {customer.fullname}
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
            notFoundContent={rooms.length === 0 ? "No available rooms" : "No rooms found"}
            onChange={(value) => {
              const room = rooms.find(r => r._id === value);
              setSelectedRoom(room);
            }}
          >
            {rooms.map(room => (
              <Option key={room._id} value={room._id}>
                Room {room.roomNumber} ({room.roomType}) - Daily: {room.dailyPrice.toLocaleString('vi-VN')}đ | Hourly: {room.hourlyPrice.toLocaleString('vi-VN')}đ
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="bookingType"
          label="Booking Type"
          rules={[{ required: true }]}
        >
          <Select 
            value={bookingType}
            onChange={(value) => setBookingType(value)}
          >
            <Option value="Daily">Book by Day</Option>
            <Option value="Hourly">Book by Hour</Option>
          </Select>
        </Form.Item>

        <Space style={{ width: '100%' }} size={16}>
          <Form.Item
            name="checkInDate"
            label="Check In"
            rules={[{ required: true }]}
          >
            <DatePicker 
              showTime={bookingType === 'Hourly'}
              format={bookingType === 'Hourly' ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY"}
            />
          </Form.Item>

          <Form.Item
            name="checkOutDate"
            label="Check Out"
            rules={[{ required: true }]}
          >
            <DatePicker 
              showTime={bookingType === 'Hourly'}
              format={bookingType === 'Hourly' ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY"}
            />
          </Form.Item>
        </Space>

        <div>
          Estimated Price: {calculatePrice().toLocaleString('vi-VN')}đ
        </div>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Option value="Pending">Pending</Option>
            <Option value="Confirmed">Confirmed</Option>
          </Select>
        </Form.Item>

        <ServiceSection>
          <h3>Services</h3>
          <Form.List name="services">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'serviceID']}
                      rules={[{ required: true, message: 'Missing service' }]}
                    >
                      <Select style={{ width: 200 }} placeholder="Select service">
                        {services.map(service => (
                          <Option key={service._id} value={service._id}>
                            {service.serviceName} ({service.servicePrice.toLocaleString('vi-VN')}đ)
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'Missing quantity' }]}
                    >
                      <InputNumber min={1} placeholder="Quantity" />
                    </Form.Item>
                    <Button onClick={() => remove(name)} type="text" danger>
                      Delete
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Service
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </ServiceSection>

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