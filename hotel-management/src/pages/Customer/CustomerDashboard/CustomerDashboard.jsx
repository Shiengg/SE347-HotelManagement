import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  CalendarOutlined, 
  CoffeeOutlined, 
  UserOutlined, 
  HomeOutlined,
  RightOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
`;

const WelcomeSection = styled.div`
  padding: 48px 40px;
  background: #1a3353;
  border-radius: 30px;
  margin-bottom: 40px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(26, 51, 83, 0.1);

  @media (max-width: 768px) {
    padding: 32px 24px;
    border-radius: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 8px rgba(26, 51, 83, 0.08);
  }

  h1 {
    font-size: 42px;
    margin-bottom: 16px;
    color: white;
    text-shadow: none;
    font-weight: 700;

    @media (max-width: 768px) {
      font-size: 28px;
    }
  }

  p {
    font-size: 18px;
    opacity: 0.95;
    max-width: 600px;
    line-height: 1.8;
    text-shadow: none;

    @media (max-width: 768px) {
      font-size: 16px;
      line-height: 1.6;
    }
  }
`;

const FeatureCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 30px;
  height: 100%;
  position: relative;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradientColor || 'linear-gradient(90deg, #4158d0, #2c5282)'};
    border-radius: 4px 4px 0 0;
  }

  .feature-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 24px;
    background: ${props => props.iconBg || '#e6f7ff'};
    color: ${props => props.iconColor || '#1890ff'};
    box-shadow: 
      0 10px 15px -3px rgba(0,0,0,0.1),
      0 4px 6px -2px rgba(0,0,0,0.05);
    transform-style: preserve-3d;
    transform: translateZ(20px);
  }

  h3 {
    font-size: 22px;
    margin-bottom: 12px;
    color: #1a3353;
    font-weight: 600;
    transform: translateZ(10px);
  }

  p {
    color: #64748b;
    margin-bottom: 24px;
    line-height: 1.6;
    font-size: 15px;
    transform: translateZ(5px);
  }
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 12px 24px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #1a3353 0%, #2c5282 100%);
  color: white;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform-style: preserve-3d;
  transform: translateZ(15px);
  box-shadow: 
    0 4px 6px -1px rgba(0,0,0,0.1),
    0 2px 4px -1px rgba(0,0,0,0.06);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #2c5282 0%, #4158d0 100%);
    transform: translateZ(20px) translateY(-2px);
    box-shadow: 
      0 8px 12px -3px rgba(0,0,0,0.2),
      0 4px 6px -2px rgba(0,0,0,0.1);
  }

  .anticon {
    font-size: 18px;
    margin-left: 8px;
  }
`;

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUserName(data.fullname || 'Guest');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (currentUser?.id) {
      fetchUserData();
    }
  }, [currentUser]);

  const features = [
    {
      title: 'Book Your Stay',
      description: 'Find and book your perfect room with just a few clicks. Enjoy our best rates and special offers.',
      icon: <HomeOutlined />,
      iconBg: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
      iconColor: '#1890ff',
      gradientColor: 'linear-gradient(90deg, #1890ff, #69c0ff)',
      action: () => navigate('/customer/rooms')
    },
    {
      title: 'Restaurant Services',
      description: 'Explore our delicious menu and order your favorite dishes directly to your room.',
      icon: <CoffeeOutlined />,
      iconBg: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)',
      iconColor: '#fa8c16',
      gradientColor: 'linear-gradient(90deg, #fa8c16, #ffd591)',
      action: () => navigate('/customer/restaurant')
    },
    {
      title: 'Your Profile',
      description: 'Manage your personal information and preferences to enhance your stay experience.',
      icon: <UserOutlined />,
      iconBg: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
      iconColor: '#52c41a',
      gradientColor: 'linear-gradient(90deg, #52c41a, #95de64)',
      action: () => navigate('/customer/profile')
    }
  ];

  return (
    <PageContainer>
      <WelcomeSection>
        <h1>Welcome back, {userName}!</h1>
        <p>
          Experience luxury and comfort at our hotel. We're here to make your stay memorable 
          with our premium rooms and excellent services. What would you like to do today?
        </p>
      </WelcomeSection>

      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col xs={24} md={8} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard
                iconBg={feature.iconBg}
                iconColor={feature.iconColor}
                gradientColor={feature.gradientColor}
                whileHover={{ 
                  translateY: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <ActionButton
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={feature.action}
                >
                  <span>Get Started</span>
                  <RightOutlined />
                </ActionButton>
              </FeatureCard>
            </motion.div>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default CustomerDashboard; 