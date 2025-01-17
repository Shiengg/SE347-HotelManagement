import React from 'react';
import styled from 'styled-components';
import { Card, Form, Input, Button } from 'antd';

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

  const onFinish = (values) => {
    console.log('Updated profile:', values);
    // Add profile update logic here
  };

  return (
    <PageContainer>
      <Title>Your Profile</Title>
      <StyledCard>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            fullname: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890'
          }}
        >
          <Form.Item
            name="fullname"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </PageContainer>
  );
};

export default CustomerProfile; 