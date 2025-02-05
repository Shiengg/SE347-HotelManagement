import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Button, Space, Modal, Form, Input, message, Alert, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, PhoneOutlined, MailOutlined, TeamOutlined, SearchOutlined } from '@ant-design/icons';
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

const SearchSection = styled.div`
  margin: 0 0 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  .search-wrapper {
    flex: 1;
    max-width: 400px;
    position: relative;

    .ant-input-affix-wrapper {
      padding: 12px 16px;
      border-radius: 10px;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
      background: white;
      
      &:hover, &:focus-within {
        border-color: #1a3353;
        box-shadow: 0 2px 8px rgba(26, 51, 83, 0.1);
      }

      .anticon-search {
        color: #1a3353;
        font-size: 18px;
      }

      .ant-input {
        font-size: 15px;
        
        &::placeholder {
          color: #94a3b8;
        }
      }
    }
  }

  .search-result {
    background: #1a3353;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;

    .count {
      background: white;
      color: #1a3353;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    
    .search-wrapper {
      max-width: 100%;
    }
  }
`;

const GuestsPage = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredGuests, setFilteredGuests] = useState([]);

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
      setFilteredGuests(customers);
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

  const checkUsername = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/check-username?username=${username}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const checkEmail = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/check-email?email=${email}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredGuests(guests);
      return;
    }

    const filtered = guests.filter(guest => 
      guest.fullname.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredGuests(filtered);
  }, [searchText, guests]);

  // Thêm mobile column
  const mobileColumn = {
    title: 'Guest Info',
    key: 'guestInfo',
    className: 'mobile-column',
    render: (record) => (
      <Space direction="vertical" size={4}>
        <div style={{ fontWeight: 500 }}>
          <UserOutlined /> {record.fullname}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Username: {record.username}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <MailOutlined /> {record.email}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <PhoneOutlined /> {record.phonenumber}
        </div>
        <Space style={{ marginTop: 8 }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingGuest(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
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
      </Space>
    ),
  };

  // Thêm desktop columns
  const desktopColumns = [
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      key: 'fullname',
      className: 'desktop-column',
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
      className: 'desktop-column',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: 'desktop-column',
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
      className: 'desktop-column',
      render: (text) => (
        <Space>
          <PhoneOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'desktop-column',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingGuest(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            type="primary"
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

  const allColumns = [mobileColumn, ...desktopColumns];

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

        <SearchSection>
          <div className="search-wrapper">
            <Input
              placeholder="Search guests by name..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>
          {searchText && (
            <div className="search-result">
              Results: <span className="count">{filteredGuests.length}</span>
            </div>
          )}
        </SearchSection>

        <TableContainer>
          {loading ? (
            <LoadingState>
              <Spin size="large" />
              <div className="text">Loading guests...</div>
            </LoadingState>
          ) : filteredGuests.length > 0 ? (
            <StyledTable
              columns={allColumns}
              dataSource={filteredGuests}
              rowKey="_id"
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} guests`,
                responsive: true,
              }}
              scroll={{ x: true }}
            />
          ) : (
            <EmptyState>
              <TeamOutlined className="icon" />
              <div className="title">
                {searchText ? 'No Matching Guests Found' : 'No Guests Found'}
              </div>
              <div className="subtitle">
                {searchText 
                  ? 'Try adjusting your search criteria'
                  : 'Start by adding your first guest to the system'
                }
              </div>
              {!searchText && (
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
              )}
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
            rules={[
              { required: true, message: 'Please input full name!' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  const validNameRegex = /^[a-zA-ZÀ-ỹ\s]*$/;
                  if (!validNameRegex.test(value)) {
                    return Promise.reject('Full name can only contain letters and spaces!');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please input username!' },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  if (editingGuest) return Promise.resolve();
                  
                  const exists = await checkUsername(value);
                  if (exists) {
                    return Promise.reject('This username is already taken!');
                  }
                  return Promise.resolve();
                }
              }
            ]}
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
              { type: 'email', message: 'Please enter a valid email!' },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                  if (!emailRegex.test(value)) {
                    return Promise.reject('Please enter a valid email address! (e.g. example@domain.com)');
                  }

                  if (editingGuest && value === editingGuest.email) {
                    return Promise.resolve();
                  }
                  
                  const exists = await checkEmail(value);
                  if (exists) {
                    return Promise.reject('This email is already registered!');
                  }
                  
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Enter email (e.g. example@domain.com)" 
            />
          </Form.Item>

          <Form.Item
            name="phonenumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please input phone number!' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  const phoneRegex = /^0\d{9}$/;
                  
                  if (!phoneRegex.test(value)) {
                    return Promise.reject(
                      'Phone number must start with 0 and contain exactly 10 digits!'
                    );
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Enter phone number (e.g. 0123456789)"
              maxLength={10}
            />
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