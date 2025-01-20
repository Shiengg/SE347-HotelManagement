import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Button, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const PageContainer = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: #111827;
`;

const ActionBar = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
`;

const RoomsManagementPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRoom, setEditingRoom] = useState(null);

  // Fetch rooms data
  const fetchRooms = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle form submit
  const handleSubmit = async (values) => {
    try {
      const url = editingRoom 
        ? `http://localhost:5000/api/rooms/${editingRoom._id}`
        : 'http://localhost:5000/api/rooms';
      
      const method = editingRoom ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success(`Room ${editingRoom ? 'updated' : 'created'} successfully`);
        setModalVisible(false);
        form.resetFields();
        fetchRooms();
      } else {
        throw new Error('Failed to save room');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Handle delete room
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        message.success('Room deleted successfully');
        fetchRooms();
      } else {
        throw new Error('Failed to delete room');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: 'Room Number',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
    },
    {
      title: 'Room Type',
      dataIndex: 'roomType',
      key: 'roomType',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Max Occupancy',
      dataIndex: 'maxOccupancy',
      key: 'maxOccupancy',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRoom(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <Title>Rooms Management</Title>
      
      <ActionBar>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRoom(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add Room
        </Button>
      </ActionBar>

      <Table 
        columns={columns} 
        dataSource={rooms}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={form.submit}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="roomNumber"
            label="Room Number"
            rules={[{ required: true, message: 'Please input room number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="roomType"
            label="Room Type"
            rules={[{ required: true, message: 'Please select room type!' }]}
          >
            <Select>
              <Option value="Single">Single</Option>
              <Option value="Double">Double</Option>
              <Option value="Suite">Suite</Option>
              <Option value="Deluxe">Deluxe</Option>
              <Option value="Family">Family</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input price!' }]}
          >
            <InputNumber
              formatter={value => `$ ${value}`}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="maxOccupancy"
            label="Max Occupancy"
            rules={[{ required: true, message: 'Please input max occupancy!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select>
              <Option value="Available">Available</Option>
              <Option value="Occupied">Occupied</Option>
              <Option value="Maintenance">Maintenance</Option>
              <Option value="Reserved">Reserved</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default RoomsManagementPage; 