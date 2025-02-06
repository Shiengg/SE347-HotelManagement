import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Table, Button, Space, Modal, Select, message, Spin } from 'antd';
import { HomeOutlined, CheckCircleOutlined, CloseCircleOutlined, ToolOutlined, CalendarOutlined, SortAscendingOutlined, SortDescendingOutlined, DollarOutlined, MenuOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 768px) {
    padding: 16px;
    min-height: calc(100vh - 56px);
  }
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid #1890ff;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 576px) {
    margin-bottom: 24px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: #1890ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .anticon {
      font-size: 24px;
      color: white;
    }

    @media (max-width: 576px) {
      width: 40px;
      height: 40px;
      .anticon {
        font-size: 20px;
      }
    }
  }

  .text-content {
    h1 {
      margin: 0;
      font-size: 24px;
      color: #1a3353;
      
      @media (max-width: 576px) {
        font-size: 20px;
      }
    }

    p {
      margin: 4px 0 0;
      color: #666;
      font-size: 14px;
      
      @media (max-width: 576px) {
        font-size: 12px;
      }
    }
  }
`;

const FilterSection = styled.div`
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-radius: 12px;
  padding: 16px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .filter-label {
    font-size: 0.9em;
    color: #1a3353;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;

    .icon {
      font-size: 14px;
      color: #666;
    }
  }

  .ant-select {
    width: 100%;
  }
`;

const StatusTag = styled.span`
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &.available {
    color: #059669;
    background: #d1fae5;
  }

  &.occupied {
    color: #dc2626;
    background: #fee2e2;
  }

  &.maintenance {
    color: #d97706;
    background: #fef3c7;
  }

  &.reserved {
    color: #4f46e5;
    background: #e0e7ff;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
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

  @media (max-width: 576px) {
    width: 36px;
    height: 36px;
  }
`;

const StyledTable = styled(Table)`
  @media (max-width: 576px) {
    .desktop-column {
      display: none;
    }
  }

  @media (min-width: 577px) {
    .mobile-column {
      display: none;
    }
  }
`;

const RoomManagement = ({ onToggleSidebar }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortPrice, setSortPrice] = useState('asc');

  // Fetch rooms data
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      message.error('Failed to fetch rooms');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (roomId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        message.success('Room status updated successfully');
        fetchRooms();
      } else {
        const data = await response.json();
        if (data.bookings) {
          Modal.error({
            title: 'Cannot Update Status',
            content: 'This room has active bookings and cannot be updated.',
          });
        } else {
          throw new Error(data.message || 'Failed to update status');
        }
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      'Available': {
        icon: <CheckCircleOutlined />,
        className: 'available'
      },
      'Occupied': {
        icon: <CloseCircleOutlined />,
        className: 'occupied'
      },
      'Maintenance': {
        icon: <ToolOutlined />,
        className: 'maintenance'
      },
      'Reserved': {
        icon: <CalendarOutlined />,
        className: 'reserved'
      }
    };

    const config = statusConfig[status];
    return (
      <StatusTag className={config.className}>
        <span className="status-dot"></span>
        {config.icon}
        {status}
      </StatusTag>
    );
  };

  const formatVND = (price) => {
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  const mobileColumn = {
    title: 'Room Info',
    key: 'roomInfo',
    className: 'mobile-column',
    render: (record) => (
      <Space direction="vertical" size={4}>
        <div style={{ fontWeight: 500 }}>
          <HomeOutlined /> Room {record.roomNumber}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {record.roomType}
        </div>
        <div style={{ fontSize: '12px', color: '#1890ff' }}>
          Daily: {formatVND(record.dailyPrice)}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Hourly: {formatVND(record.hourlyPrice)}
        </div>
        <div style={{ fontSize: '12px' }}>
          {getStatusTag(record.status)}
        </div>
        <Select
          value={record.status}
          style={{ width: '100%' }}
          onChange={(value) => handleStatusUpdate(record._id, value)}
          disabled={record.status === 'Reserved' || record.status === 'Occupied'}
          size="small"
        >
          <Option value="Available">Available</Option>
          <Option value="Maintenance">Maintenance</Option>
        </Select>
      </Space>
    ),
  };

  const desktopColumns = [
    {
      title: 'Room Number',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      className: 'desktop-column',
      render: (text) => (
        <Space>
          <HomeOutlined />
          Room {text}
        </Space>
      ),
    },
    {
      title: 'Room Type',
      dataIndex: 'roomType',
      key: 'roomType',
      className: 'desktop-column',
    },
    {
      title: 'Daily Price',
      dataIndex: 'dailyPrice',
      key: 'dailyPrice',
      className: 'desktop-column',
      render: (price) => formatVND(price),
    },
    {
      title: 'Hourly Price',
      dataIndex: 'hourlyPrice',
      key: 'hourlyPrice',
      className: 'desktop-column',
      render: (price) => formatVND(price),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      className: 'desktop-column',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          onChange={(value) => handleStatusUpdate(record._id, value)}
          disabled={status === 'Reserved' || status === 'Occupied'}
        >
          <Option value="Available">Available</Option>
          <Option value="Maintenance">Maintenance</Option>
        </Select>
      ),
    },
    {
      title: 'Max Occupancy',
      dataIndex: 'maxOccupancy',
      key: 'maxOccupancy',
      className: 'desktop-column',
      render: (occupancy) => `${occupancy} persons`,
    },
  ];

  const allColumns = [mobileColumn, ...desktopColumns];

  const filteredRooms = rooms.filter(room => {
    const matchesType = filterType === 'All' || room.roomType === filterType;
    const matchesStatus = filterStatus === 'All' || room.status === filterStatus;
    return matchesType && matchesStatus;
  }).sort((a, b) => {
    return sortPrice === 'asc' ? a.dailyPrice - b.dailyPrice : b.dailyPrice - a.dailyPrice;
  });

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <TitleSection>
            <div className="icon-wrapper">
              <HomeOutlined />
            </div>
            <div className="text-content">
              <h1>Room Management</h1>
              <p>View and manage room status</p>
            </div>
          </TitleSection>

          <MenuButton onClick={onToggleSidebar}>
            <MenuOutlined />
          </MenuButton>
        </HeaderSection>

        <FilterSection>
          <FilterGroup>
            <div className="filter-label">
              <HomeOutlined className="icon" />
              Room Type
            </div>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: '100%' }}
            >
              <Option value="All">All Room Types</Option>
              <Option value="Single">Single Room</Option>
              <Option value="Double">Double Room</Option>
              <Option value="Suite">Luxury Suite</Option>
              <Option value="Deluxe">Deluxe Room</Option>
              <Option value="Family">Family Room</Option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <div className="filter-label">
              <CheckCircleOutlined className="icon" />
              Status
            </div>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%' }}
            >
              <Option value="All">All Status</Option>
              <Option value="Available">Available</Option>
              <Option value="Occupied">Occupied</Option>
              <Option value="Maintenance">Maintenance</Option>
              <Option value="Reserved">Reserved</Option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <div className="filter-label">
              <DollarOutlined className="icon" />
              Sort by Price
            </div>
            <Select
              value={sortPrice}
              onChange={setSortPrice}
              style={{ width: '100%' }}
            >
              <Option value="asc">Price: Low to High</Option>
              <Option value="desc">Price: High to Low</Option>
            </Select>
          </FilterGroup>
        </FilterSection>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <StyledTable
            columns={allColumns}
            dataSource={filteredRooms}
            rowKey="_id"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} rooms`,
              responsive: true,
            }}
            scroll={{ x: true }}
          />
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default RoomManagement; 