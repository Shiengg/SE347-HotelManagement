import React from 'react';
import styled from 'styled-components';
import { Table, Tag, Space, Button } from 'antd';
import { FileTextOutlined, MenuOutlined } from '@ant-design/icons';
import InvoicePage from '../../InvoicePage/InvoicePage';

const PageContainer = styled.div`
  padding: 24px;
  min-height: calc(100vh - 64px);
  background: #f8fafc;
  overflow-x: hidden;
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
  border: 2px solid #ffd700;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
    border-width: 1px;
    border-radius: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  }
`;

const HeaderSection = styled.div`
  padding: 0 0 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 576px) {
    padding: 0 0 16px 0;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: #ffd700;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .anticon {
      font-size: 24px;
      color: #1a3353;
    }

    @media (max-width: 576px) {
      width: 40px;
      height: 40px;
      .anticon {
        font-size: 20px;
      }
    }
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #1a3353;
  font-size: 1.8em;
  font-weight: 600;

  @media (max-width: 576px) {
    font-size: 1.4em;
  }
`;

const MenuButton = styled(Button)`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #1a3353;
  color: white;
  
  &:hover, &:focus {
    background: #2c5282;
    color: white;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: white;
    border-radius: 12px;
  }

  .ant-table-thead > tr > th {
    background: #f8fafc !important;
    color: #1a3353;
    font-weight: 600;
    border-bottom: 2px solid #edf2f7;
    padding: 16px;

    &::before {
      display: none;
    }
  }

  .ant-table-tbody > tr > td {
    padding: 16px;
    border-bottom: 1px solid #edf2f7;
    background: white !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fafc !important;
  }

  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 12px 8px;
    }
    
    .ant-table-content {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
`;

const CustomerInvoice = ({ onToggleSidebar }) => {
  return (
    <InvoicePage/>
  );
};

export default CustomerInvoice; 