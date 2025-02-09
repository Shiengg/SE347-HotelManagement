import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Button, Space, Modal, Form, Input, message, Alert, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, PhoneOutlined, MailOutlined, TeamOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AddButton from '../../../components/common/AddButton';

const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 768px) {
    padding: 16px;
    min-height: calc(100vh - 56px);
  }
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

const HeaderSection = styled.div`
  background: linear-gradient(to right, #ffffff, #f8fafc);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 24px;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #1a3353, #2c5282);
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
      font-weight: 600;
    }

    p {
      margin: 4px 0 0;
      color: #6b7280;
      font-size: 14px;
    }
  }

  @media (max-width: 768px) {
    .icon-wrapper {
      width: 40px;
      height: 40px;
      
      .anticon {
        font-size: 20px;
      }
    }

    .text-content {
      h1 {
        font-size: 20px;
      }

      p {
        font-size: 13px;
      }
    }
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .ant-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  @media (max-width: 768px) {
    border-radius: 8px;
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
    padding: 16px;
  }

  .ant-table-tbody > tr > td {
    padding: 16px;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fafc;
  }

  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 12px;
    }
  }

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

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: #f8fafc;
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .ant-modal-title {
    color: #1a3353;
    font-weight: 600;
  }

  .ant-form-item-label > label {
    color: #1a3353;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .ant-modal-content {
      margin: 0 16px;
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
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  margin: 24px 0;

  .icon {
    font-size: 48px;
    color: #94a3b8;
    margin-bottom: 16px;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #1a3353;
    margin-bottom: 8px;
    text-align: center;
  }

  .subtitle {
    color: #6b7280;
    text-align: center;
    max-width: 400px;
    line-height: 1.5;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    padding: 32px 20px;

    .icon {
      font-size: 40px;
    }

    .title {
      font-size: 16px;
    }

    .subtitle {
      font-size: 13px;
    }
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

const SearchSection = styled.div`
  margin: 0 0 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  .search-wrapper {
    flex: 1;
    max-width: 400px;

    .ant-input-affix-wrapper {
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
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
    padding: 16px;
    gap: 12px;
    
    .search-wrapper {
      max-width: 100%;

      .ant-input-affix-wrapper {
        padding: 10px 14px;
      }
    }

    .search-result {
      font-size: 13px;
      justify-content: center;
    }
  }
`;

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

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
      // Kiểm tra xem employee có booking nào không
      const checkResponse = await fetch(`http://localhost:5000/api/users/${id}/check-bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const checkData = await checkResponse.json();

      if (checkData.hasBookings) {
        const { asReceptionist } = checkData.details;
        message.error(
          `Cannot delete employee because they are associated with ${asReceptionist} booking(s)`
        );
        return;
      }

      // Nếu không có booking thì tiến hành xóa
      const deleteResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (deleteResponse.ok) {
        message.success('Employee deleted successfully');
        fetchEmployees();
      } else {
        throw new Error('Failed to delete employee');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Thêm useEffect để xử lý search
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(employee => 
      employee.fullname.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchText, employees]);

  // Thêm mobile column
  const mobileColumn = {
    title: 'Employee Info',
    key: 'employeeInfo',
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
              setEditingEmployee(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={async () => {
              try {
                const response = await fetch(`http://localhost:5000/api/users/${record._id}/check-bookings`, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });
                const data = await response.json();

                if (data.hasBookings) {
                  const { asReceptionist } = data.details;
                  message.error(
                    `Cannot delete employee because they are associated with ${asReceptionist} booking(s)`
                  );
                  return;
                }

                Modal.confirm({
                  title: 'Are you sure you want to delete this employee?',
                  content: 'This action cannot be undone.',
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk: () => handleDelete(record._id)
                });
              } catch (error) {
                message.error('Error checking employee bookings');
              }
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
              setEditingEmployee(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={async () => {
              try {
                const response = await fetch(`http://localhost:5000/api/users/${record._id}/check-bookings`, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });
                const data = await response.json();

                if (data.hasBookings) {
                  const { asReceptionist } = data.details;
                  message.error(
                    `Cannot delete employee because they are associated with ${asReceptionist} booking(s)`
                  );
                  return;
                }

                Modal.confirm({
                  title: 'Are you sure you want to delete this employee?',
                  content: 'This action cannot be undone.',
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk: () => handleDelete(record._id)
                });
              } catch (error) {
                message.error('Error checking employee bookings');
              }
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
              <h1>Employee Management</h1>
              <p>Manage your hotel receptionists</p>
            </div>
          </TitleSection>

          <AddButton onClick={() => setIsModalVisible(true)}>
            <PlusOutlined />
            Add New Employee
          </AddButton>
        </HeaderSection>

        <SearchSection>
          <div className="search-wrapper">
            <Input
              placeholder="Search employees by name..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>
          {searchText && (
            <div className="search-result">
              Results: <span className="count">{filteredEmployees.length}</span>
            </div>
          )}
        </SearchSection>

        <TableContainer>
          {loading ? (
            <LoadingState>
              <Spin size="large" />
              <div className="text">Loading employees...</div>
            </LoadingState>
          ) : filteredEmployees.length > 0 ? (
            <StyledTable
              columns={allColumns}
              dataSource={filteredEmployees}
              rowKey="_id"
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} employees`,
                responsive: true,
              }}
              scroll={{ x: true }}
            />
          ) : (
            <EmptyState>
              <TeamOutlined className="icon" />
              <div className="title">
                {searchText ? 'No Matching Employees Found' : 'No Employees Found'}
              </div>
              <div className="subtitle">
                {searchText 
                  ? 'Try adjusting your search criteria'
                  : 'Start by adding your first employee to the system'
                }
              </div>
              {!searchText && (
                <AddButton onClick={() => setIsModalVisible(true)}>
                  <PlusOutlined />
                  Add New Employee
                </AddButton>
              )}
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