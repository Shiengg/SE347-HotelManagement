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

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const AddButton = styled(Button)`
  height: 40px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1a3353;
  border: none;
  
  &:hover {
    background: #2c4c7c !important;
  }
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

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: #f8fafc;
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
  }

  .ant-modal-title {
    color: #1a3353;
    font-weight: 600;
  }

  .ant-form-item-label > label {
    color: #1a3353;
    font-weight: 500;
  }

  .readonly-input {
    background-color: #f5f5f5;
    cursor: not-allowed;
    
    input {
      color: #666;
    }

    &:hover {
      border-color: #d9d9d9;
    }
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

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();
  const [error, setError] = useState(null);

  // Fetch employees data
  const fetchEmployees = async () => {
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

      // Lọc receptionist dựa trên role_id._id
      const receptionists = data.filter(user => 
        user.role_id._id === '6783da9402236e8ab00f4fee'
      );
      
      console.log('Filtered Receptionists:', receptionists);
      setEmployees(receptionists);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(error.message);
      message.error(error.message || 'Failed to fetch employees');
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token);
    if (!token) {
      message.error('No authentication token found');
      return;
    }
    fetchEmployees();
  }, []);

  // Thêm hàm kiểm tra username
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

  // Thêm hàm kiểm tra email
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

  const handleAddEdit = async (values) => {
    try {
      const url = editingEmployee 
        ? `http://localhost:5000/api/users/${editingEmployee._id}`
        : 'http://localhost:5000/api/users';
      
      const method = editingEmployee ? 'PUT' : 'POST';

      const userData = {
        ...values,
        role_id: '6783da9402236e8ab00f4fee'
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save employee');
      }

      message.success(`Employee ${editingEmployee ? 'updated' : 'added'} successfully`);
      setIsModalVisible(false);
      form.resetFields();
      fetchEmployees();
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
        message.success('Employee deleted successfully');
        fetchEmployees();
      } else {
        throw new Error('Failed to delete employee');
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
              setEditingEmployee(record);
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
                title: 'Are you sure you want to delete this employee?',
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
              <h1>Employee Management</h1>
              <p>Manage your hotel receptionists</p>
            </div>
          </TitleSection>

          <AddButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingEmployee(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Employee
          </AddButton>
        </HeaderSection>

        <TableContainer>
          {loading ? (
            <LoadingState>
              <Spin size="large" />
              <div className="text">Loading employees...</div>
            </LoadingState>
          ) : employees.length > 0 ? (
            <StyledTable
              columns={columns}
              dataSource={employees}
              rowKey="_id"
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} employees`
              }}
            />
          ) : (
            <EmptyState>
              <TeamOutlined className="icon" />
              <div className="title">No Employees Found</div>
              <div className="subtitle">
                Start by adding your first employee to the system
              </div>
              <AddButton
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingEmployee(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Add New Employee
              </AddButton>
            </EmptyState>
          )}
        </TableContainer>
      </ContentWrapper>

      <StyledModal
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
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
                  
                  // Kiểm tra chỉ cho phép chữ cái (bao gồm tiếng Việt có dấu), khoảng trắng
                  const validNameRegex = /^[a-zA-ZÀ-ỹ\s]*$/;
                  if (!validNameRegex.test(value)) {
                    return Promise.reject('Full name can only contain letters and spaces!');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter full name"
            />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please input username!' },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  if (editingEmployee) return Promise.resolve();
                  
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
              disabled={!!editingEmployee}
              className={editingEmployee ? 'readonly-input' : ''}
            />
          </Form.Item>

          {!editingEmployee && (
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
                  
                  // Kiểm tra định dạng email
                  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                  if (!emailRegex.test(value)) {
                    return Promise.reject('Please enter a valid email address! (e.g. example@domain.com)');
                  }

                  // Kiểm tra email tồn tại
                  if (editingEmployee && value === editingEmployee.email) {
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

                  // Kiểm tra số điện thoại bắt đầu bằng 0 và có đúng 10 số
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
                {editingEmployee ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </StyledModal>
    </PageContainer>
  );
};

export default EmployeesPage; 