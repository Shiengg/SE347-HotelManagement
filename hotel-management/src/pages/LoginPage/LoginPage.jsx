import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import logo from '../../images/logo2.png';
import { useAuth } from '../../contexts/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  padding: 20px;
  position: relative;

  @media (max-width: 480px) {
    padding: 16px;
    background: #ffffff;
  }
`;

const LoginForm = styled.form`
  background: #ffffff;
  padding: 45px 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  position: relative;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(229, 231, 235, 0.5);

  @media (max-width: 480px) {
    padding: 30px 24px;
    box-shadow: none;
    border: none;
    border-radius: 0;
  }
`;

const Logo = styled.img`
  width: 150px;
  margin: 0 auto 35px;
  display: block;

  @media (max-width: 480px) {
    width: 120px;
    margin: 0 auto 25px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #111827;
  margin-bottom: 35px;
  font-size: 26px;
  font-weight: 600;
  
  &::after {
    content: '';
    display: block;
    width: 36px;
    height: 3px;
    background: #4f46e5;
    margin: 12px auto 0;
    border-radius: 2px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 30px;
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 24px;

  &:focus-within label {
    top: -22px;
    font-size: 13px;
    color: #4f46e5;
    transform: translateY(0) scale(0.85);
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const Label = styled.label`
  position: absolute;
  left: 16px;
  top: 14px;
  font-size: 15px;
  color: #6b7280;
  transition: all 0.2s ease;
  pointer-events: none;
  transform-origin: left;
  
  ${props => props.hasValue && `
    top: -22px;
    font-size: 13px;
    color: #4f46e5;
    transform: translateY(0) scale(0.85);
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 18px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #111827;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
    outline: none;
  }

  &::placeholder {
    color: transparent;
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 16px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 32px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: #4338ca;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  }

  &:active {
    transform: translateY(0);
    background: #3730a3;
  }

  @media (max-width: 480px) {
    margin-top: 24px;
    padding: 16px;
    font-size: 17px;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  padding: 12px;
  background-color: #fef2f2;
  border-radius: 10px;
  border: 1px solid rgba(220, 38, 38, 0.1);
  display: ${props => props.visible ? 'block' : 'none'};

  @media (max-width: 480px) {
    margin-top: 14px;
    padding: 10px;
    font-size: 13px;
  }
`;

const LoginPage = React.memo(() => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    
    const { success, error: loginError } = await login(
      formData.username,
      formData.password
    );

    if (!success) {
      setError(loginError || 'Login failed');
    }
  }, [formData, login]);

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Logo src={logo} alt="Hotel Logo" />
        <Title>Welcome Back</Title>
        <InputGroup>
          <Input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Label htmlFor="username" hasValue={formData.username.length > 0}>
            Username
          </Label>
        </InputGroup>
        <InputGroup>
          <Input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Label htmlFor="password" hasValue={formData.password.length > 0}>
            Password
          </Label>
        </InputGroup>
        <Button type="submit">
          Sign In
        </Button>
        <ErrorMessage visible={!!error}>{error}</ErrorMessage>
      </LoginForm>
    </LoginContainer>
  );
});

export default LoginPage; 