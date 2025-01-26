import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Modal, Form, Input, Select, InputNumber, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined, SortAscendingOutlined, SortDescendingOutlined, CheckCircleOutlined, CloseCircleOutlined, ToolOutlined, CalendarOutlined, DollarOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const PageContainer = styled.div`
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 12px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid gold;
`;

const HeaderSection = styled.div`
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
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

  .text-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: #1a3353;
  font-size: 1.8em;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9em;
`;

const AddButton = styled(Button)`
  height: 45px;
  padding: 0 24px;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1a3353;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    background: #264773;
  }

  .anticon {
    font-size: 18px;
  }
`;

const RoomListContainer = styled.div`
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
  border-radius: 12px;
  display: flex;
  gap: 12px;
  flex-direction: column;
  margin-top: 16px;
  border: 1px solid #eee;
`;

const FilterSection = styled.div`
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  gap: 24px;
  align-items: flex-end;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  flex-wrap: wrap;

  .ant-select {
    min-width: 200px;
    
    .ant-select-selector {
      border-radius: 8px !important;
      border: 1.5px solid #eee !important;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #ffd700 !important;
        transform: translateY(-1px);
      }
    }

    &.ant-select-focused .ant-select-selector {
      border-color: #ffd700 !important;
      box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2) !important;
      transform: translateY(-1px);
    }
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 200px;
  max-width: 300px;

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

  .ant-select-selection-item {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .anticon {
      font-size: 16px;
    }
  }
`;

const RoomHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr 1.2fr 1fr 0.8fr;
  padding: 16px 24px;
  background: #f8fafc;
  border-radius: 8px 8px 0 0;
  border: 1px solid #e2e8f0;
  margin-bottom: -1px;

  .header-item {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      color: #64748b;
      font-size: 1rem;
    }
  }
`;

const RoomFilter = styled.select`
  font-size: 1em;
  opacity: 0.7;
  border: none;
  user-select: none;
  outline: none;
  background: transparent;
  appearance: none;
  padding: 2px 5px;
  
  option {
    color: grey;
    background-color: #fff;
    font-weight: semi-bold;
  }
`;

const RoomItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr 1.2fr 1fr 0.8fr;
  padding: 16px 24px;
  border: 1px solid #e2e8f0;
  background: ${props => props.isSelected ? 'linear-gradient(45deg, #ffd700, #ffed4a)' : '#fff'};
  border-color: ${props => props.isSelected ? '#ffd700' : '#e2e8f0'};
  transition: all 0.2s ease;
  cursor: pointer;
  border-radius: 10px;
  margin-bottom: 8px;

  &:hover {
    background: ${props => props.isSelected ? 'linear-gradient(45deg, #ffd700, #ffed4a)' : '#f8fafc'};
    border-color: ${props => props.isSelected ? '#ffd700' : '#e2e8f0'};
  }

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
  }

  .room-number {
    font-weight: 600;
    color: ${props => props.isSelected ? '#1a3353' : '#1e293b'};
  }

  .room-type {
    color: ${props => props.isSelected ? '#1a3353' : '#475569'};
  }

  .price {
    font-weight: 500;
    color: ${props => props.isSelected ? '#1a3353' : '#059669'};
  }

  box-shadow: ${props => props.isSelected ? '0 4px 12px rgba(255, 215, 0, 0.15)' : 'none'};
  transform: ${props => props.isSelected ? 'translateY(-1px)' : 'none'};
`;

const RoomDetailContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 12px;
  border: 2px solid gold;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: fit-content;
`;

const RoomDetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
`;

const RoomNumberBadge = styled.div`
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  color: #1a3353;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1.5em;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const RoomTypeTag = styled.div`
  background: #f8f9fa;
  color: #1a3353;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    color: #ffd700;
  }
`;

const DetailSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .label {
    color: #1a3353;
    font-size: 0.95em;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0.3px;
  }

  .value {
    font-weight: 500;
    color: #1a3353;
    font-size: 1.1em;
  }
`;

const ActionButtons = styled(Space)`
  margin-top: auto;
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
  width: 100%;

  .ant-btn {
    height: 40px;
    flex: 1;
    font-weight: 500;
    
    &.edit-button {
      background: #1a3353;
      border: none;
      
      &:hover {
        background: #264773;
      }
    }

    &.delete-button {
      background: #fff;
      border: 1px solid #ff4d4f;
      color: #ff4d4f;
      
      &:hover {
        background: #ff4d4f;
        color: white;
      }
    }
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

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  font-size: 1.5em;
  background: black;
  align-items: center;
  border-radius: 10px;
  color: white;
  margin-top: auto;
`;

const FormWrapper = styled.div`
  background: linear-gradient(to bottom right, #999999, #f8f9fa);
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.div`
  font-size: 1.6em;
  font-weight: 600;
  color: #1a3353;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;

  .icon {
    background: linear-gradient(45deg, #ffd700, #ffed4a);
    color: #1a3353;
    padding: 8px;
    border-radius: 8px;
    font-size: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  .section-title {
    font-weight: 600;
    color: #1a3353;
    margin-bottom: 16px;
    font-size: 1.1em;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      width: 4px;
      height: 16px;
      background: linear-gradient(45deg, #ffd700, #ffed4a);
      border-radius: 2px;
      display: inline-block;
    }
  }

  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;

const PriceInput = styled(InputNumber)`
  height: 45px;
  width: 100%;

  .ant-input-number-handler-wrap {
    background: #f8f9fa;
  }
  
  .ant-input-number-input {
    height: 45px !important;
    padding: 8px 16px !important;
    font-size: 1.1em;
    font-weight: 500;
  }
`;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    height: 45px !important;
    padding: 0 16px !important;
    border-radius: 8px !important;
    border: 1.5px solid #eee !important;

    .ant-select-selection-item {
      line-height: 45px !important;
      font-size: 1.1em;
    }
  }

  &:hover .ant-select-selector {
    border-color: #ffd700 !important;
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #ffd700 !important;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2) !important;
  }
`;

const StyledInput = styled(Input)`
  height: 45px;
  font-size: 1.1em;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid #eee;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
  }

  &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const StyledTextArea = styled(Input.TextArea)`
  font-size: 1.1em;
  padding: 12px 16px;

  &:focus, &:hover {
    border-color: gold !important;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2) !important;
  }
`;

const SubmitButton = styled(Button)`
  height: 50px;
  font-size: 1.2em;
  font-weight: 500;
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  
  &:hover {
    background: linear-gradient(45deg, #ffed4a, #ffd700);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-size: 1.05em;
    font-weight: 500;
    color: #1a3353;
    margin-bottom: 8px;
    opacity: 0.85;
  }

  .ant-form-item-explain-error {
    margin-top: 4px;
    font-size: 0.9em;
  }
`;

const RoomsManagementPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form] = Form.useForm();
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortPrice, setSortPrice] = useState('asc');
  const [isEditing, setIsEditing] = useState(false);

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

  // Handle form submit
  const handleSubmit = async (values) => {
    try {
      const url = selectedRoom 
        ? `http://localhost:5000/api/rooms/${selectedRoom._id}`
        : 'http://localhost:5000/api/rooms';
      
      const method = selectedRoom ? 'PUT' : 'POST';

      // Kiểm tra tỉ lệ giá ngày và giờ
      if (values.dailyPrice < values.hourlyPrice * 20) {
        message.error('Daily price must be at least 20 times the hourly price');
        return;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();
      if (response.ok) {
        message.success(`Room ${selectedRoom ? 'updated' : 'created'} successfully`);
        form.resetFields();
        setIsEditing(false);
        fetchRooms();
      } else {
        throw new Error(data.message || 'Failed to save room');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Handle delete room
  const handleDelete = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Room deleted successfully');
        fetchRooms(); // Refresh danh sách phòng
      } else {
        if (data.bookings) {
          // Hiển thị thông báo chi tiết về các booking đang sử dụng phòng
          Modal.error({
            title: 'Cannot Delete Room',
            content: (
              <div>
                <p>{data.message}</p>
                <p>Room is being used in the following bookings:</p>
                <ul>
                  {data.bookings.map(booking => (
                    <li key={booking.bookingId}>
                      Booking #{booking.bookingId}<br/>
                      Check-in: {dayjs(booking.checkInDate).format('DD/MM/YYYY')}<br/>
                      Check-out: {dayjs(booking.checkOutDate).format('DD/MM/YYYY')}<br/>
                      Status: {booking.status}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          });
        } else {
          message.error(data.message || 'Failed to delete room');
        }
      }
    } catch (error) {
      message.error('Failed to delete room');
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

  const filteredRooms = rooms.filter(room => {
    const matchesType = filterType === 'All' || room.roomType === filterType;
    const matchesStatus = filterStatus === 'All' || room.status === filterStatus;
    return matchesType && matchesStatus;
  }).sort((a, b) => {
    return sortPrice === 'asc' ? a.price - b.price : b.price - a.price;
  });

  // Thêm hàm format tiền VND
  const formatVND = (price) => {
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  // Thêm kiểm tra phòng có đang được booking không
  const checkRoomHasBookings = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}/bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      return data.hasActiveBookings;
    } catch (error) {
      console.error('Error checking room bookings:', error);
      return false;
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <TitleSection>
            <div className="icon-wrapper">
              <HomeOutlined />
            </div>
            <div className="text-content">
              <Title>Room Management</Title>
              <Subtitle>Manage your hotel rooms efficiently</Subtitle>
            </div>
          </TitleSection>
          
          <AddButton 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedRoom(null);
              form.resetFields();
            }}
          >
            Add New Room
          </AddButton>
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
              dropdownStyle={{ padding: '8px' }}
            >
              <Option value="All">
                <Space>
                  <HomeOutlined style={{ color: '#666' }} />
                  All Room Types
                </Space>
              </Option>
              <Option value="Single">
                <Space>
                  <HomeOutlined style={{ color: '#40a9ff' }} />
                  Single Room
                </Space>
              </Option>
              <Option value="Double">
                <Space>
                  <HomeOutlined style={{ color: '#52c41a' }} />
                  Double Room
                </Space>
              </Option>
              <Option value="Suite">
                <Space>
                  <HomeOutlined style={{ color: '#ffd700' }} />
                  Luxury Suite
                </Space>
              </Option>
              <Option value="Deluxe">
                <Space>
                  <HomeOutlined style={{ color: '#722ed1' }} />
                  Deluxe Room
                </Space>
              </Option>
              <Option value="Family">
                <Space>
                  <HomeOutlined style={{ color: '#eb2f96' }} />
                  Family Room
                </Space>
              </Option>
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
              dropdownStyle={{ padding: '8px' }}
            >
              <Option value="All">
                <Space>
                  <CheckCircleOutlined style={{ color: '#666' }} />
                  All Status
                </Space>
              </Option>
              <Option value="Available">
                <Space>
                  <CheckCircleOutlined style={{ color: '#10b981' }} />
                  Available
                </Space>
              </Option>
              <Option value="Occupied">
                <Space>
                  <CloseCircleOutlined style={{ color: '#ef4444' }} />
                  Occupied
                </Space>
              </Option>
              <Option value="Maintenance">
                <Space>
                  <ToolOutlined style={{ color: '#f59e0b' }} />
                  Under Maintenance
                </Space>
              </Option>
              <Option value="Reserved">
                <Space>
                  <CalendarOutlined style={{ color: '#6366f1' }} />
                  Reserved
                </Space>
              </Option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <div className="filter-label">
              <SortAscendingOutlined className="icon" />
              Sort by Price
            </div>
            <Select
              value={sortPrice}
              onChange={setSortPrice}
              style={{ width: '100%' }}
              dropdownStyle={{ padding: '8px' }}
            >
              <Option value="asc">
                <Space>
                  <SortAscendingOutlined />
                  Price: Low to High
                </Space>
              </Option>
              <Option value="desc">
                <Space>
                  <SortDescendingOutlined />
                  Price: High to Low
                </Space>
              </Option>
            </Select>
          </FilterGroup>
        </FilterSection>

        <RoomHeader>
          <div className="header-item">
            <HomeOutlined className="icon" />
            Room Number
          </div>
          <div className="header-item">
            <i className="fas fa-bed icon"></i>
            Room Type
          </div>
          <div className="header-item">
            <DollarOutlined className="icon" />
            Daily Price
          </div>
          <div className="header-item">
            <ClockCircleOutlined className="icon" />
            Hourly Price
          </div>
          <div className="header-item">
            <CheckCircleOutlined className="icon" />
            Status
          </div>
          <div className="header-item">
            <SettingOutlined className="icon" />
            Actions
          </div>
        </RoomHeader>

        <RoomListContainer>
          {filteredRooms.map(room => (
            <RoomItem 
              key={room._id} 
              onClick={() => setSelectedRoom(room)}
              isSelected={selectedRoom?._id === room._id}
            >
              <div className="room-number">
                <HomeOutlined style={{ color: '#64748b' }} />
                Room {room.roomNumber}
              </div>
              <div className="room-type">
                {room.roomType}
              </div>
              <div className="price">
                {formatVND(room.dailyPrice)}
              </div>
              <div className="price">
                {formatVND(room.hourlyPrice)}
              </div>
              <div>
                {getStatusTag(room.status)}
              </div>
              <div>
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    style={{ color: '#0ea5e9' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoom(room);
                      setIsEditing(true);
                      form.setFieldsValue(room);
                    }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(room._id);
                    }}
                  />
                </Space>
              </div>
            </RoomItem>
          ))}
        </RoomListContainer>
      </ContentWrapper>

      <RoomDetailContainer>
        {selectedRoom ? (
          isEditing ? (
            <FormWrapper>
              <FormTitle>
                <EditOutlined className="icon" />
                Edit Room
              </FormTitle>
              <StyledForm
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={selectedRoom}
              >
                <FormSection>
                  <div className="section-title">Basic Information</div>
                  <Form.Item
                    name="roomNumber"
                    label="Room Number"
                    rules={[{ required: true, message: 'Please input room number!' }]}
                  >
                    <StyledInput placeholder="Enter room number (e.g. 101)" />
                  </Form.Item>

                  <Form.Item
                    name="roomType"
                    label="Room Type"
                    rules={[{ required: true, message: 'Please select room type!' }]}
                  >
                    <StyledSelect placeholder="Select room type">
                      <Option value="Single">Single Room</Option>
                      <Option value="Double">Double Room</Option>
                      <Option value="Suite">Luxury Suite</Option>
                      <Option value="Deluxe">Deluxe Room</Option>
                      <Option value="Family">Family Room</Option>
                    </StyledSelect>
                  </Form.Item>
                </FormSection>

                <FormSection>
                  <div className="section-title">Capacity & Pricing</div>
                  <Form.Item
                    name="hourlyPrice"
                    label="Hourly Price"
                    rules={[
                      { required: true, message: 'Please input hourly price' },
                      { type: 'number', min: 0, message: 'Price must be greater than 0' }
                    ]}
                    tooltip="Daily price should be 20 times the hourly price"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      addonAfter="VND/hour"
                    />
                  </Form.Item>

                  <Form.Item
                    name="dailyPrice"
                    label="Daily Price"
                    rules={[
                      { required: true, message: 'Please input daily price' },
                      { type: 'number', min: 0, message: 'Price must be greater than 0' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const hourlyPrice = getFieldValue('hourlyPrice');
                          if (!value || !hourlyPrice || value >= hourlyPrice * 20) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Daily price must be at least 20 times the hourly price'));
                        },
                      }),
                    ]}
                    tooltip="Daily price should be at least 20 times the hourly price"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      addonAfter="VND/day"
                    />
                  </Form.Item>

                  <Form.Item
                    name="maxOccupancy"
                    label="Maximum Occupancy"
                    rules={[{ required: true, message: 'Please input max occupancy!' }]}
                  >
                    <InputNumber 
                      min={1} 
                      style={{ width: '100%' }} 
                      placeholder="Enter maximum number of guests"
                    />
                  </Form.Item>
                </FormSection>

                <FormSection>
                  <div className="section-title">Room Status & Details</div>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select status!' }]}
                  >
                    <StyledSelect 
                      placeholder="Select status"
                      disabled={selectedRoom?.status === 'Reserved' || selectedRoom?.status === 'Occupied'}
                    >
                      <Option value="Available">Available</Option>
                      <Option value="Maintenance">Maintenance</Option>
                      {!selectedRoom && <Option value="Reserved">Reserved</Option>}
                      {!selectedRoom && <Option value="Occupied">Occupied</Option>}
                    </StyledSelect>
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Room Description"
                  >
                    <StyledTextArea 
                      rows={4} 
                      placeholder="Enter detailed description of the room..."
                    />
                  </Form.Item>
                </FormSection>

                <Form.Item>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <SubmitButton type="primary" htmlType="submit">
                      Update Room
                    </SubmitButton>
                  </Space>
                </Form.Item>
              </StyledForm>
            </FormWrapper>
          ) : (
            <>
              <RoomDetailHeader>
                <RoomNumberBadge>
                  Room {selectedRoom.roomNumber}
                </RoomNumberBadge>
                <RoomTypeTag>
                  <i className="icon fas fa-bed" />
                  {selectedRoom.roomType}
                </RoomTypeTag>
              </RoomDetailHeader>

              <DetailSection>
                <DetailItem>
                  <div className="label">Status</div>
                  <div className="value">
                    {getStatusTag(selectedRoom.status)}
                  </div>
                </DetailItem>

                <DetailItem>
                  <div className="label">Daily Price</div>
                  <div className="value" style={{ color: '#00a854', fontWeight: 'bold' }}>
                    {formatVND(selectedRoom?.dailyPrice || 0)}
                  </div>
                </DetailItem>

                <DetailItem>
                  <div className="label">Hourly Price</div>
                  <div className="value" style={{ color: '#00a854', fontWeight: 'bold' }}>
                    {formatVND(selectedRoom?.hourlyPrice || 0)}
                  </div>
                </DetailItem>

                <DetailItem>
                  <div className="label">Maximum Occupancy</div>
                  <div className="value">
                    {selectedRoom.maxOccupancy} {selectedRoom.maxOccupancy > 1 ? 'persons' : 'person'}
                  </div>
                </DetailItem>

                {selectedRoom.description && (
                  <DetailItem style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                    <div className="label">Description</div>
                    <div className="value" style={{ 
                      padding: '12px',
                      background: '#f0f2f5',
                      borderRadius: '6px',
                      width: '100%',
                      lineHeight: '1.5'
                    }}>
                      {selectedRoom.description}
                    </div>
                  </DetailItem>
                )}
              </DetailSection>

              <ActionButtons>
                <Button 
                  className="edit-button"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsEditing(true);
                    form.setFieldsValue(selectedRoom);
                  }}
                >
                  Edit Room
                </Button>
                <Button
                  className="delete-button"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(selectedRoom._id)}
                >
                  Delete Room
                </Button>
              </ActionButtons>
            </>
          )
        ) : (
          <FormWrapper>
            <FormTitle>
              <PlusOutlined className="icon" />
              Add New Room
            </FormTitle>
            <StyledForm
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <FormSection>
                <div className="section-title">Basic Information</div>
                <Form.Item
                  name="roomNumber"
                  label="Room Number"
                  rules={[{ required: true, message: 'Please input room number!' }]}
                >
                  <StyledInput placeholder="Enter room number (e.g. 101)" />
                </Form.Item>

                <Form.Item
                  name="roomType"
                  label="Room Type"
                  rules={[{ required: true, message: 'Please select room type!' }]}
                >
                  <StyledSelect placeholder="Select room type">
                    <Option value="Single">Single Room</Option>
                    <Option value="Double">Double Room</Option>
                    <Option value="Suite">Luxury Suite</Option>
                    <Option value="Deluxe">Deluxe Room</Option>
                    <Option value="Family">Family Room</Option>
                  </StyledSelect>
                </Form.Item>
              </FormSection>

              <FormSection>
                <div className="section-title">Capacity & Pricing</div>
                <Form.Item
                  name="hourlyPrice"
                  label="Hourly Price"
                  rules={[
                    { required: true, message: 'Please input hourly price' },
                    { type: 'number', min: 0, message: 'Price must be greater than 0' }
                  ]}
                  tooltip="Daily price should be 20 times the hourly price"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    addonAfter="VND/hour"
                  />
                </Form.Item>

                <Form.Item
                  name="dailyPrice"
                  label="Daily Price"
                  rules={[
                    { required: true, message: 'Please input daily price' },
                    { type: 'number', min: 0, message: 'Price must be greater than 0' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const hourlyPrice = getFieldValue('hourlyPrice');
                        if (!value || !hourlyPrice || value >= hourlyPrice * 20) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Daily price must be at least 20 times the hourly price'));
                      },
                    }),
                  ]}
                  tooltip="Daily price should be at least 20 times the hourly price"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    addonAfter="VND/day"
                  />
                </Form.Item>

                <Form.Item
                  name="maxOccupancy"
                  label="Maximum Occupancy"
                  rules={[{ required: true, message: 'Please input max occupancy!' }]}
                >
                  <InputNumber 
                    min={1} 
                    style={{ width: '100%' }} 
                    placeholder="Enter maximum number of guests"
                  />
                </Form.Item>
              </FormSection>

              <FormSection>
                <div className="section-title">Room Status & Details</div>
                <Form.Item
                  name="status"
                  label="Current Status"
                  rules={[{ required: true, message: 'Please select status!' }]}
                >
                  <StyledSelect placeholder="Select room status">
                    <Option value="Available">
                      <Space>
                        <span style={{ color: '#10b981' }}>●</span>
                        Available
                      </Space>
                    </Option>
                    <Option value="Occupied">
                      <Space>
                        <span style={{ color: '#ef4444' }}>●</span>
                        Occupied
                      </Space>
                    </Option>
                    <Option value="Maintenance">
                      <Space>
                        <span style={{ color: '#f59e0b' }}>●</span>
                        Maintenance
                      </Space>
                    </Option>
                    <Option value="Reserved">
                      <Space>
                        <span style={{ color: '#6366f1' }}>●</span>
                        Reserved
                      </Space>
                    </Option>
                  </StyledSelect>
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Room Description"
                >
                  <StyledTextArea 
                    rows={4} 
                    placeholder="Enter detailed description of the room..."
                  />
                </Form.Item>
              </FormSection>

              <Form.Item>
                <SubmitButton type="primary" htmlType="submit" block>
                  Create Room
                </SubmitButton>
              </Form.Item>
            </StyledForm>
          </FormWrapper>
        )}
      </RoomDetailContainer>
    </PageContainer>
  );
};

export default RoomsManagementPage; 