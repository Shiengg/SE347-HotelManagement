import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Button, Space, Modal, Form, Input, message, Alert, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, PhoneOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

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

const AddButton = styled(Button)`
  background-color: #ffd700;
  border: none;
  color: #1a3353;
  font-weight: 600;
  &:hover {
    background-color: #ffed4a;
  }
`;

const TableContainer = styled.div`
  margin-bottom: 24px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: 10px;
  border: 2px dashed #eee;

  .text {
    margin-top: 16px;
    font-size: 16px;
    font-weight: 600;
  }
`;

const StyledTable = styled(Table)`
  .ant-table-row:hover {
    background-color: #f8f9fa;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: 10px;
  border: 2px dashed #eee;

  .icon {
    font-size: 48px;
    color: #666;
  }

  .title {
    margin-top: 16px;
    font-size: 18px;
    font-weight: 600;
  }

  .subtitle {
    margin-top: 8px;
    color: #666;
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
  }
`;

const GuestsPage = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [form] = Form.useForm();
  const [error, setError] = useState(null);

  // Fetch guests data
  const fetchGuests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);

      // Lọc customer dựa trên role_id._id
      const customers = data.filter(user => 
        user.role_id._id === '6783daa202236e8ab00f4ff0'
      );
      
      console.log('Filtered Customers:', customers);
      setGuests(customers);
    } catch (error) {
      console.error('Error fetching guests:', error);
      setError(error.message);
      message.error(error.message || 'Failed to fetch guests');
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('No authentication token found');
      return;
    }
    fetchGuests();
  }, []);

  const handleAddEdit = async (values) => {
    try {
      const url = editingGuest 
        ? `http://localhost:5000/api/users/${editingGuest._id}`
        : 'http://localhost:5000/api/users';
      
      const method = editingGuest ? 'PUT' : 'POST';

      // Thêm role_id cho customer
      const userData = {
        ...values,
        role_id: '6783daa202236e8ab00f4ff0' // ID của role customer
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        message.success(`Guest ${editingGuest ? 'updated' : 'added'} successfully`);
        setIsModalVisible(false);
        form.resetFields();
        fetchGuests();
      } else {
        throw new Error('Failed to save guest');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        message.success('Guest deleted successfully');
        fetchGuests();
      } else {
        throw new Error('Failed to delete guest');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      render: (text) => (
        <Space>
          <PhoneOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingGuest(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to delete this guest?',
                content: 'This action cannot be undone.',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => handleDelete(record._id)
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <TitleSection>
            <div className="icon-wrapper">
              <TeamOutlined />
            </div>
            <div className="text-content">
              <h1>Guest Management</h1>
              <p>Manage your hotel guests</p>
            </div>
          </TitleSection>

          <AddButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingGuest(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Guest
          </AddButton>
        </HeaderSection>

        <TableContainer>
          {loading ? (
            <LoadingState>
              <Spin size="large" />
              <div className="text">Loading guests...</div>
            </LoadingState>
          ) : guests.length > 0 ? (
            <StyledTable
              columns={columns}
              dataSource={guests}
              rowKey="_id"
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} guests`
              }}
            />
          ) : (
            <EmptyState>
              <TeamOutlined className="icon" />
              <div className="title">No Guests Found</div>
              <div className="subtitle">
                Start by adding your first guest to the system
              </div>
              <AddButton
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingGuest(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Add New Guest
              </AddButton>
            </EmptyState>
          )}
        </TableContainer>
      </ContentWrapper>

      <StyledModal
        title={editingGuest ? 'Edit Guest' : 'Add New Guest'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEdit}
        >
          <Form.Item
            name="fullname"
            label="Full Name"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter username" 
              disabled={!!editingGuest}
              className={editingGuest ? 'readonly-input' : ''}
            />
          </Form.Item>

          {!editingGuest && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input password!' }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="phonenumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingGuest ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </StyledModal>
    </PageContainer>
  );
};

export default GuestsPage; 