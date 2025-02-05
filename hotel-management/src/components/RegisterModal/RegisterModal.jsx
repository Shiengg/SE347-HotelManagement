import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, message } from 'antd';
import logo from '../../svg/AppLogo.svg';

const ModalWrapper = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
    
    @media (max-width: 480px) {
      margin: 10px;
      border-radius: 12px;
    }
  }

  .ant-modal-header {
    background: linear-gradient(135deg, #ffcc00, #ff9900);
    padding: 24px;
    border-bottom: none;

    @media (max-width: 480px) {
      padding: 16px;
    }
  }

  .ant-modal-title {
    color: white !important;
    font-size: 24px !important;
    text-align: center;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 20px !important;
    }
  }

  .ant-modal-body {
    padding: 32px;

    @media (max-width: 480px) {
      padding: 20px;
    }
  }

  .ant-modal-footer {
    border-top: none;
    padding: 16px 32px 32px;

    @media (max-width: 480px) {
      padding: 16px 20px 20px;
    }
  }

  .ant-btn {
    border-radius: 25px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:active {
      transform: translateY(1px);
    }
  }

  .ant-btn-primary {
    background: linear-gradient(135deg, #ffcc00, #ff9900);
    border: none;
    height: 44px;
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    
    &:hover {
      background: linear-gradient(135deg, #ffcc00, #ff6600);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(255, 153, 0, 0.2);
    }

    @media (max-width: 480px) {
      height: 40px;
      font-size: 15px;
    }
  }

  .ant-btn-default {
    border: 1px solid #ff9900;
    color: #ff9900;
    height: 44px;
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    
    &:hover {
      color: #ff6600;
      border-color: #ff6600;
      background: rgba(255, 153, 0, 0.05);
    }

    @media (max-width: 480px) {
      height: 40px;
      font-size: 15px;
    }
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;

  img {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;

    @media (max-width: 480px) {
      width: 40px;
      height: 40px;
      margin-bottom: 8px;
    }
  }

  h3 {
    color: #ffcc00;
    font-family: 'Times New Roman', serif;
    font-size: 24px;
    font-weight: bold;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 20px;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 28px;
  position: relative;

  @media (max-width: 480px) {
    margin-bottom: 24px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;

  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 6px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.error ? '#ff4d4f' : '#e5e7eb'};
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ffcc00;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 204, 0, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:hover {
    border-color: #ffcc00;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 13px;
    border-radius: 10px;
  }
`;

const ErrorText = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  display: block;
  position: absolute;
  bottom: -20px;

  @media (max-width: 480px) {
    font-size: 11px;
    bottom: -18px;
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 480px) {
    gap: 12px;
    margin-top: 24px;
  }
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
    <ModalWrapper
      title="Create Your Account"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={480}
      centered
      maskClosable={false}
      destroyOnClose={true}
    >
      <LogoWrapper>
        <img src={logo} alt="Hotel Logo" />
        <h3>Le Continental</h3>
      </LogoWrapper>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <FormGroup>
          <Label>Username</Label>
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username (letters and numbers only)"
            error={errors.username}
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
            error={errors.password}
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
            error={errors.fullname}
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
            error={errors.email}
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
            error={errors.phonenumber}
          />
          {errors.phonenumber && <ErrorText>{errors.phonenumber}</ErrorText>}
        </FormGroup>

        <ButtonGroup>
          <button 
            type="button" 
            className="ant-btn ant-btn-default" 
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="ant-btn ant-btn-primary"
          >
            Register
          </button>
        </ButtonGroup>
      </form>
    </ModalWrapper>
  );
};

export default RegisterModal; 