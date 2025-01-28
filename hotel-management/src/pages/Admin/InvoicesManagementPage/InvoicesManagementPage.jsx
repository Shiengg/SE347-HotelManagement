import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Tag, Space, Button, Modal, Select, message, Tooltip, Tabs } from 'antd';
import { FileTextOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined, CreditCardOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const PageContainer = styled.div`
  padding: 24px;
  height: calc(100vh - 84px);
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  border: 2px solid gold;
  height: 100%;
  overflow-y: auto;
`;

const HeaderSection = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: linear-gradient(45deg, #ffd700, #ffed4a);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .anticon {
      font-size: 24px;
      color: #1a3353;
    }
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #1a3353;
  font-size: 1.8em;
  font-weight: 600;
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: white;
    border-radius: 8px;
  }

  .ant-table-thead > tr > th {
    background: #f8fafc;
    color: #1a3353;
    font-weight: 600;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fafc;
  }
`;

const PaymentModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 15px;
  }

  .payment-details {
    margin: 20px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #eee;

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #ddd;

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .label {
        color: #666;
      }

      .value {
        font-weight: 600;
        color: #1a3353;

        &.price {
          color: #00a854;
        }
      }
    }
  }
`;

const TabsContainer = styled.div`
  margin-bottom: 24px;
  .ant-tabs-nav {
    margin-bottom: 0;
    &::before {
      border: none;
    }
  }
`;

const InvoicesManagementPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [activeTab, setActiveTab] = useState('unpaid');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setInvoices(data.data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      message.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${selectedInvoice._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          paymentStatus: 'Paid',
          paymentMethod: paymentMethod,
          paymentDate: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }

      message.success('Payment confirmed successfully');
      setIsPaymentModalVisible(false);
      fetchInvoices(); // Refresh the list
    } catch (error) {
      console.error('Payment error:', error);
      message.error(error.message);
    }
  };

  const formatVND = (price) => {
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      'Unpaid': { color: 'orange', icon: <ClockCircleOutlined /> },
      'Paid': { color: 'green', icon: <CheckCircleOutlined /> }
    };

    return (
      <Tag color={statusConfig[status].color}>
        <Space>
          {statusConfig[status].icon}
          {status}
        </Space>
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Invoice ID',
      key: 'id',
      render: (record) => record._id.slice(-6).toUpperCase(),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record) => record.bookingID.customerID.fullname,
    },
    {
      title: 'Room',
      key: 'room',
      render: (record) => `Room ${record.bookingID.roomID.roomNumber}`,
    },
    {
      title: 'Total Amount',
      key: 'amount',
      render: (record) => (
        <span style={{ color: '#00a854', fontWeight: 600 }}>
          {formatVND(record.totalAmount)}
        </span>
      ),
    },
    {
      title: 'Payment Status',
      key: 'status',
      render: (record) => getStatusTag(record.paymentStatus),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space>
          {record.paymentStatus === 'Unpaid' && (
            <Tooltip title="Confirm Payment">
              <Button
                type="primary"
                icon={<DollarOutlined />}
                onClick={() => {
                  setSelectedInvoice(record);
                  setIsPaymentModalVisible(true);
                }}
              >
                Confirm Payment
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const paidColumns = [
    {
      title: 'Invoice ID',
      key: 'id',
      render: (record) => record._id.slice(-6).toUpperCase(),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record) => record.bookingID.customerID.fullname,
    },
    {
      title: 'Room',
      key: 'room',
      render: (record) => `Room ${record.bookingID.roomID.roomNumber}`,
    },
    {
      title: 'Total Amount',
      key: 'amount',
      render: (record) => (
        <span style={{ color: '#00a854', fontWeight: 600 }}>
          {formatVND(record.totalAmount)}
        </span>
      ),
    },
    {
      title: 'Payment Method',
      key: 'paymentMethod',
      render: (record) => (
        <Space>
          {record.paymentMethod === 'Cash' ? <DollarOutlined /> : <CreditCardOutlined />}
          {record.paymentMethod}
        </Space>
      ),
    },
    {
      title: 'Payment Date',
      key: 'paymentDate',
      render: (record) => dayjs(record.paymentDate).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          onClick={() => {
            setSelectedInvoice(record);
            setIsPaymentModalVisible(true);
          }}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <TitleSection>
            <div className="icon-wrapper">
              <FileTextOutlined />
            </div>
            <Title>Invoices Management</Title>
          </TitleSection>
        </HeaderSection>

        <TabsContainer>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            items={[
              {
                key: 'unpaid',
                label: (
                  <span>
                    <ClockCircleOutlined /> Unpaid Invoices
                  </span>
                ),
                children: (
                  <StyledTable
                    columns={columns}
                    dataSource={invoices.filter(invoice => invoice.paymentStatus === 'Unpaid')}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                      defaultPageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} unpaid invoices`,
                    }}
                  />
                ),
              },
              {
                key: 'paid',
                label: (
                  <span>
                    <CheckCircleOutlined /> Paid Invoices
                  </span>
                ),
                children: (
                  <StyledTable
                    columns={paidColumns}
                    dataSource={invoices.filter(invoice => invoice.paymentStatus === 'Paid')}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                      defaultPageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} paid invoices`,
                    }}
                  />
                ),
              },
            ]}
          />
        </TabsContainer>
      </ContentWrapper>

      <PaymentModal
        title="Confirm Payment"
        open={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        onOk={handlePayment}
        okText="Confirm Payment"
        cancelText="Cancel"
      >
        <div className="payment-details">
          <div className="detail-row">
            <span className="label">Customer:</span>
            <span className="value">
              {selectedInvoice?.bookingID.customerID.fullname}
            </span>
          </div>
          <div className="detail-row">
            <span className="label">Room:</span>
            <span className="value">
              Room {selectedInvoice?.bookingID.roomID.roomNumber}
            </span>
          </div>
          <div className="detail-row">
            <span className="label">Amount:</span>
            <span className="value price">
              {selectedInvoice && formatVND(selectedInvoice.totalAmount)}
            </span>
          </div>
        </div>

        <Space direction="vertical" style={{ width: '100%' }}>
          <div>Payment Method:</div>
          <Select
            value={paymentMethod}
            onChange={setPaymentMethod}
            style={{ width: '100%' }}
          >
            <Option value="Cash">
              <Space><DollarOutlined /> Cash</Space>
            </Option>
            <Option value="Card">
              <Space><CreditCardOutlined /> Card</Space>
            </Option>
          </Select>
        </Space>
      </PaymentModal>
    </PageContainer>
  );
};

export default InvoicesManagementPage; 