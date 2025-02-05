import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, message } from 'antd';

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    border-color: gold;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const ErrorText = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 5px;
  display: block;
`;

const RegisterModal = ({ visible, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    email: '',
    phonenumber: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters and numbers';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Full Name validation
    if (!formData.fullname) {
      newErrors.fullname = 'Full name is required';
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.fullname)) {
      newErrors.fullname = 'Full name can only contain letters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Phone number validation
    if (!formData.phonenumber) {
      newErrors.phonenumber = 'Phone number is required';
    } else if (!/^0\d{9}$/.test(formData.phonenumber)) {
      newErrors.phonenumber = 'Phone number must start with 0 and have 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Registration successful! Please login.');
        onCancel();
        // Reset form
        setFormData({
          username: '',
          password: '',
          fullname: '',
          email: '',
          phonenumber: ''
        });
      } else {
        // Xử lý các lỗi cụ thể từ server
        if (data.message.includes('Username already exists')) {
          setErrors(prev => ({
            ...prev,
            username: 'Username already exists'
          }));
        } else if (data.message.includes('Email already exists')) {
          setErrors(prev => ({
            ...prev,
            email: 'Email already exists'
          }));
        } else {
          message.error(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      message.error('Registration failed. Please try again.');
    }
  };

  // Thêm hàm để reset form khi đóng modal
  const handleCancel = () => {
    setFormData({
      username: '',
      password: '',
      fullname: '',
      email: '',
      phonenumber: ''
    });
    setErrors({});
    onCancel();
  };

  return (
    <Modal
      title="Register New Account"
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Register"
    >
      <FormGroup>
        <Label>Username</Label>
        <Input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username (letters and numbers only)"
        />
        {errors.username && <ErrorText>{errors.username}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password (minimum 6 characters)"
        />
        {errors.password && <ErrorText>{errors.password}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>Full Name</Label>
        <Input
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          placeholder="Enter full name (letters only)"
        />
        {errors.fullname && <ErrorText>{errors.fullname}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter valid email address"
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>Phone Number</Label>
        <Input
          name="phonenumber"
          value={formData.phonenumber}
          onChange={handleChange}
          placeholder="Enter phone number (start with 0, 10 digits)"
        />
        {errors.phonenumber && <ErrorText>{errors.phonenumber}</ErrorText>}
      </FormGroup>
    </Modal>
  );
};

export default RegisterModal; 