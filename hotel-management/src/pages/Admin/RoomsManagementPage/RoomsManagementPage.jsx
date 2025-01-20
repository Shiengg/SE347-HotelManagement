import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Modal, Form, Input, Select, InputNumber, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0;
  color: #1a3353;
`;

const RoomListContainer = styled.div`
  background: grey;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: 10px;
  display: flex;
  gap: 8px;
  flex-direction: column;
  margin-top: 16px;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
`;

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2em;
  font-weight: bold;
`;

const RoomHeader = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 10px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr 1fr;
    flex-wrap: wrap;
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
  border-radius: 10px;
  background: white;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 10px;
  cursor: pointer;
  ${props => props.isSelected ? "background-color: gold; color: white;" : ""}
  &:hover {
    background-color: ${props => props.isSelected ? "gold" : "#FFD70080"};
    color: white;
  }
  transition: background-color 0.1s;
  align-items: center;

  @media (max-width: 1080px) {
    font-size: 1.2em;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    & > :nth-child(2n) {
      justify-self: end;
      text-align: right;
    }
  }
`;

const RoomDetailContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
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
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  
  &.available { color: #10b981; background: #d1fae5; }
  &.occupied { color: #ef4444; background: #fee2e2; }
  &.maintenance { color: #f59e0b; background: #fef3c7; }
  &.reserved { color: #6366f1; background: #e0e7ff; }
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
  background: white;
  border-radius: 10px;
  padding: 16px;
`;

const FormTitle = styled.div`
  font-size: 1.5em;
  font-weight: 600;
  color: #1a3353;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon {
    color: gold;
    font-size: 24px;
  }
`;

const FormSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #eee;

  .section-title {
    font-weight: 500;
    color: #1a3353;
    margin-bottom: 12px;
    font-size: 1.2em;
  }

  .ant-form-item {
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
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
    border-radius: 6px !important;

    .ant-select-selection-item {
      line-height: 45px !important;
      font-size: 1.1em;
    }
  }

  &.ant-select-focused .ant-select-selector {
    border-color: gold !important;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2) !important;
  }
`;

const StyledInput = styled(Input)`
  height: 45px;
  font-size: 1.1em;
  padding: 8px 16px;

  &:focus, &:hover {
    border-color: gold !important;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2) !important;
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
  height: 45px;
  font-size: 1.1em;
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(45deg, #ffed4a, #ffd700);
    transform: translateY(-1px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-size: 1.1em;
    font-weight: 500;
    color: #1a3353;
    margin-bottom: 8px;
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
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success(`Room ${selectedRoom ? 'updated' : 'created'} successfully`);
        form.resetFields();
        fetchRooms();
      } else {
        throw new Error('Failed to save room');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Handle delete room
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        message.success('Room deleted successfully');
        fetchRooms();
      } else {
        throw new Error('Failed to delete room');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const getStatusTag = (status) => {
    const classNames = {
      'Available': 'available',
      'Occupied': 'occupied',
      'Maintenance': 'maintenance',
      'Reserved': 'reserved'
    };
    return <StatusTag className={classNames[status]}>{status}</StatusTag>;
  };

  const filteredRooms = rooms.filter(room => {
    const matchesType = filterType === 'All' || room.roomType === filterType;
    const matchesStatus = filterStatus === 'All' || room.status === filterStatus;
    return matchesType && matchesStatus;
  }).sort((a, b) => {
    return sortPrice === 'asc' ? a.price - b.price : b.price - a.price;
  });

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <Title>Rooms</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedRoom(null);
              form.resetFields();
            }}
          >
            Add New Room
          </Button>
        </HeaderSection>

        <FilterSection>
          <FilterItem>
            Type:
            <RoomFilter value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="All">All</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Family">Family</option>
            </RoomFilter>
          </FilterItem>

          <FilterItem>
            Status:
            <RoomFilter value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Reserved">Reserved</option>
            </RoomFilter>
          </FilterItem>

          <FilterItem>
            Price:
            <RoomFilter value={sortPrice} onChange={e => setSortPrice(e.target.value)}>
              <option value="asc">ASC</option>
              <option value="desc">DESC</option>
            </RoomFilter>
          </FilterItem>
        </FilterSection>

        <RoomHeader>
          <div>Room</div>
          <div>Type</div>
          <div>Status</div>
          <div>Max Occupancy</div>
          <div>Price</div>
        </RoomHeader>

        <RoomListContainer>
          {filteredRooms.map(room => (
            <RoomItem 
              key={room._id}
              isSelected={selectedRoom?._id === room._id}
              onClick={() => setSelectedRoom(room)}
            >
              <div>{room.roomNumber}</div>
              <div>{room.roomType}</div>
              <div>{getStatusTag(room.status)}</div>
              <div>{room.maxOccupancy}</div>
              <div>${room.price.toLocaleString()}</div>
            </RoomItem>
          ))}
        </RoomListContainer>
      </ContentWrapper>

      <RoomDetailContainer>
        {selectedRoom ? (
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
                <div className="label">Maximum Occupancy</div>
                <div className="value">
                  {selectedRoom.maxOccupancy} {selectedRoom.maxOccupancy > 1 ? 'persons' : 'person'}
                </div>
              </DetailItem>

              <DetailItem>
                <div className="label">Price</div>
                <div className="value" style={{ color: '#00a854', fontWeight: 'bold' }}>
                  ${selectedRoom.price.toLocaleString()}
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
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: 'Please input price!' }]}
                >
                  <PriceInput
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Enter price"
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