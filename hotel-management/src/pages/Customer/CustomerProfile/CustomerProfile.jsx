import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Form, Input, Button, message } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';

const PageContainer = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: #111827;
`;

const StyledCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CustomerProfile = () => {
  const [form] = Form.useForm();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const userData = await response.json();
        form.setFieldsValue({
          fullname: userData.fullname,
          email: userData.email,
          phonenumber: userData.phonenumber
        });
      } catch (error) {
        message.error('Failed to load profile data');
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

  return (
    <PageContainer>
      <Title>Your Profile</Title>
      <StyledCard>
        <Form
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
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  if (value === currentUser.email) {
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
            <Input placeholder="Enter your email" />
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
            <Input placeholder="Enter your phone number (e.g. 0123456789)" maxLength={10} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </PageContainer>
  );
};

export default CustomerProfile; 