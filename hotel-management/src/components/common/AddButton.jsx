import styled from 'styled-components';
import { Button } from 'antd';

const AddButton = styled(Button)`
  height: 48px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #1a3353, #2c5282);
  border: none;
  box-shadow: 0 4px 12px rgba(26, 51, 83, 0.15);
  transition: all 0.3s ease;
  color: white;

  .anticon {
    font-size: 18px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #2c5282, #1e40af);
    box-shadow: 0 6px 16px rgba(26, 51, 83, 0.25);
    color: white;

    .anticon {
      transform: rotate(90deg);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(26, 51, 83, 0.15);
  }

  @media (max-width: 576px) {
    height: 42px;
    padding: 0 18px;
    font-size: 14px;
    
    .anticon {
      font-size: 16px;
    }
  }
`;

export default AddButton; 