import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Form, Input, Button, message, Spin, Avatar } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined } from '@ant-design/icons';

const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 24px;
  color: #1a3353;
  text-align: center;
  font-weight: 600;
`;

const StyledCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  border: none;

  .ant-card-body {
    padding: 32px;
  }

  @media (max-width: 768px) {
    margin: 0 16px;
    .ant-card-body {
      padding: 24px 16px;
    }
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  text-align: center;

  .avatar {
    width: 120px;
    height: 120px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #1a3353 0%, #2c5282 100%);
    font-size: 48px;
    
    .anticon {
      margin-top: 8px;
    }
  }

  .user-info {
    h2 {
      font-size: 24px;
      color: #1a3353;
      margin: 0;
      font-weight: 600;
    }

    p {
      color: #64748b;
      margin: 4px 0 0;
    }
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label {
    label {
      font-weight: 500;
      color: #1a3353;
      font-size: 15px;
    }
  }

  .ant-input-affix-wrapper {
    padding: 12px;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    transition: all 0.3s ease;

    &:hover, &:focus-within {
      border-color: #1a3353;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .anticon {
      color: #64748b;
    }

    input {
      font-size: 15px;
      
      &::placeholder {
        color: #94a3b8;
      }
    }
  }

  .ant-btn {
    height: 45px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    background: #1a3353;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      background: #2c5282;
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const CustomerProfile = () => {
  const [form] = Form.useForm();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUserData(data);
        form.setFieldsValue({
          fullname: data.fullname,
          email: data.email,
          phonenumber: data.phonenumber
        });
      } catch (error) {
        message.error('Failed to load profile data');
      } finally {
        setInitialLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchUserData();
    }
  }, [currentUser, form]);

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

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success('Profile updated successfully');
      } else {
        const error = await response.json();
        message.error(error.message || 'Failed to update profile');
      }
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <Title>Profile Settings</Title>
      <StyledCard>
        <ProfileHeader>
          <Avatar className="avatar" icon={<UserOutlined />} />
          <div className="user-info">
            <h2>{userData?.fullname || 'User'}</h2>
            <p>Customer</p>
          </div>
        </ProfileHeader>

        <StyledForm
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="fullname"
            label="Full Name"
            rules={[
              { required: true, message: 'Please input your full name!' },
              {
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: 'Full name can only contain letters and spaces'
              },
              {
                min: 2,
                message: 'Full name must be at least 2 characters'
              }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter your full name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
                  if (value === currentUser.email) return Promise.resolve();
                  const exists = await checkEmail(value);
                  if (exists) return Promise.reject('This email is already registered!');
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            name="phonenumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              {
                pattern: /^0\d{9}$/,
                message: 'Phone number must start with 0 and contain exactly 10 digits'
              }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Enter your phone number (e.g. 0123456789)"
              maxLength={10}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              icon={<EditOutlined />}
            >
              Update Profile
            </Button>
          </Form.Item>
        </StyledForm>
      </StyledCard>
    </PageContainer>
  );
};

export default CustomerProfile; 