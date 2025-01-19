import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../svg/AppLogo.svg";

export const LogoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  img {
    width: 32px;
    height: auto;

    @media (max-width: 680px) {
      width: 48px;
    }
  }
`;

export const LogoName = styled.div`
  font-family: Times New Roman;
  font-weight: bold;
  font-size: 2em;
  color: #ffdd1e;

  @media (max-width: 680px) {
    display: none;
  }
`;
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: white; /* Fallback */
  background: radial-gradient(
      circle at 25% 25%,
      rgba(255, 215, 0, 0.6),
      transparent 70%
    ),
    radial-gradient(circle at 75% 25%, rgba(255, 215, 0, 0.6), transparent 70%),
    linear-gradient(135deg, white, #ffffff);
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
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(229, 231, 235, 0.5);

  @media (max-width: 480px) {
    padding: 30px 24px;
    box-shadow: none;
    border: none;
    border-radius: 0;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #111827;
  margin-bottom: 35px;
  font-size: 26px;
  font-weight: 600;

  &::after {
    content: "";
    display: block;
    width: 36px;
    height: 3px;
    background: gold;
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

  ${(props) =>
    props.hasValue &&
    `
    top: -22px;
    font-size: 13px;
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
    border-color: gold;
    box-shadow: 0 0 0 5px rgba(255, 255, 0, 0.4);
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
  background: linear-gradient(135deg, #ffcc00, #ff9900); /* Gold to Orange gradient */
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
    background: linear-gradient(135deg, #ffcc00, #ff6600); /* More vibrant gradient on hover */
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  }

  &:active {
    transform: translateY(0);
    background: linear-gradient(135deg, #e68a00, #cc6600); /* Darker shades for active state */
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
  display: ${(props) => (props.visible ? "block" : "none")};

  @media (max-width: 480px) {
    margin-top: 14px;
    padding: 10px;
    font-size: 13px;
  }
`;

const LoginPage = React.memo(() => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      const { success, error: loginError } = await login(
        formData.username,
        formData.password
      );

      if (!success) {
        setError(loginError || "Login failed");
      }
    },
    [formData, login]
  );

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LogoWrapper id="logo">
          <img src={logo} alt="Logo" />
          <LogoName>Le Continental</LogoName>
        </LogoWrapper>
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
        <Button type="submit">Sign In</Button>
        <ErrorMessage visible={!!error}>{error}</ErrorMessage>
      </LoginForm>
    </LoginContainer>
  );
});

export default LoginPage;
