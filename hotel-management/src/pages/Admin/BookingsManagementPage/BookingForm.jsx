import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Form, Input, Select, DatePicker, InputNumber, Button, Space, message } from 'antd';
import dayjs from 'dayjs';

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

const BookingForm = ({ booking, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchCustomers();
    fetchServices();
  }, []);

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

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setRooms(data);
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

  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      checkInDate: values.checkInDate.toISOString(),
      checkOutDate: values.checkOutDate.toISOString(),
      receptionistID: JSON.parse(localStorage.getItem('user'))._id,
    };

    onSubmit(formattedValues);
  };

  return (
    <FormContainer>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'Pending',
          services: []
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
                {customer.name} ({customer.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="roomID"
          label="Room"
          rules={[{ required: true, message: 'Please select a room' }]}
        >
          <Select placeholder="Select room">
            {rooms.map(room => (
              <Option key={room._id} value={room._id}>
                Room {room.roomNumber} ({room.roomType})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Space style={{ width: '100%' }} size={16}>
          <Form.Item
            name="checkInDate"
            label="Check In Date"
            rules={[{ required: true, message: 'Please select check in date' }]}
            style={{ width: '100%' }}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="checkOutDate"
            label="Check Out Date"
            rules={[{ required: true, message: 'Please select check out date' }]}
            style={{ width: '100%' }}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Space>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Option value="Pending">Pending</Option>
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Cancelled">Cancelled</Option>
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
};

export default BookingForm; 