import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Select, Space, Input, Modal, Form, DatePicker, Radio, Button, message, Empty } from 'antd';
import { HomeOutlined, SearchOutlined, DollarOutlined, TeamOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const PageContainer = styled.div`
  padding: 24px;
  height: calc(100vh - 84px);
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 16px;
    height: auto;
  }
`;

const ContentWrapper = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  border: 2px solid gold;
  height: 100%;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ffd700;
    border-radius: 4px;
  }
`;

const HeaderSection = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
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

const FilterSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  gap: 24px;
  align-items: flex-end;
  margin-bottom: 24px;
  border: 1px solid #eee;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }

  .filter-label {
    font-size: 0.9em;
    color: #1a3353;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ant-select, .ant-input {
    min-width: 200px;
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 16px;
`;

const RoomInfo = styled.div`
  padding: 20px;
  background: white;
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 1px;
    background: linear-gradient(to right, transparent, #ffd700, transparent);
  }
`;

const RoomImage = styled.div`
  height: 180px;
  background: linear-gradient(120deg, #1a3353, #264773);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://your-image-url.jpg') center/cover;
    opacity: 0.3;
    transition: all 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 215, 0, 0.8), rgba(255, 237, 74, 0.8));
    opacity: 0;
    transition: all 0.4s ease;
  }

  .anticon {
    font-size: 2.8em;
    z-index: 1;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
    transition: all 0.4s ease;
  }
`;

const BookButton = styled.button`
  width: 100%;
  padding: 10px;
  background: linear-gradient(45deg, #1a3353, #264773);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #ffd700, #ffed4a);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(26, 51, 83, 0.2);
    letter-spacing: 0.5px;

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }

  i, span {
    z-index: 1;
    position: relative;
  }
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;

  &:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: #ffd700;

    ${RoomImage} {
      &::after {
        opacity: 0.85;
      }
      
      .anticon {
        transform: scale(1.1) rotate(5deg);
      }
    }

    ${RoomInfo} {
      background: linear-gradient(to bottom right, #ffffff, #fafafa);
    }

    ${BookButton} {
      background: linear-gradient(45deg, #ffd700, #ffed4a);
      color: #1a3353;
      padding: 12px;
      font-weight: 600;
    }
  }
`;

const RoomBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 30px;
  font-weight: 600;
  color: #1a3353;
  font-size: 0.9em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 2;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 215, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '●';
    color: #ffd700;
  }
`;

const RoomNumber = styled.h2`
  margin: 0 0 8px 0;
  color: #1a3353;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    color: #ffd700;
    font-size: 0.9em;
  }
`;

const RoomType = styled.div`
  color: #666;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1em;
  padding-bottom: 12px;
  border-bottom: 1px dashed #eee;

  .type-icon {
    color: #1a3353;
    opacity: 0.7;
  }
`;

const RoomDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #444;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: ${props => props.className === 'price' ? 'rgba(0, 168, 84, 0.08)' : 'transparent'};

  &:hover {
    background: ${props => props.className === 'price' ? 'rgba(0, 168, 84, 0.15)' : 'rgba(26, 51, 83, 0.05)'};
    transform: translateX(4px);
  }

  .anticon {
    font-size: 1.2em;
    color: ${props => props.className === 'price' ? '#00a854' : '#1a3353'};
    transition: transform 0.3s ease;
  }

  &.price {
    color: #00a854;
    font-weight: 600;
    font-size: 1.1em;
  }

  &:hover .anticon {
    transform: scale(1.1);
  }
`;

const BookingModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 15px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: linear-gradient(45deg, #1a3353, #264773);
    padding: 20px;
    border-bottom: none;
    
    .ant-modal-title {
      color: white;
      font-size: 1.3em;
      font-weight: 600;
    }
  }
`;

const BookingForm = styled(Form)`
  .ant-picker {
    width: 100%;
    height: 45px;
    border-radius: 8px;
  }

  .ant-radio-group {
    width: 100%;
    display: flex;
    gap: 16px;
  }

  .ant-radio-button-wrapper {
    flex: 1;
    text-align: center;
    height: 45px;
    line-height: 43px;
    border-radius: 8px;
    
    &.ant-radio-button-wrapper-checked {
      background: #1a3353;
      border-color: #1a3353;
    }
  }
`;

const PricePreview = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eee;

  .price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    &.total {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed #ddd;
      font-weight: 600;
      font-size: 1.1em;
      color: #00a854;
    }
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 45px;
  font-size: 1.1em;
  font-weight: 500;
  margin-top: 24px;
`;

const EmptyRoomsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  margin: 20px;

  .ant-empty {
    margin-bottom: 24px;
  }

  .empty-text {
    color: #666;
    font-size: 1.1em;
    margin-bottom: 16px;
  }

  .suggestion-text {
    color: #999;
    font-size: 0.9em;
  }
`;

const CustomerRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [sortPrice, setSortPrice] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm] = Form.useForm();
  const [bookingType, setBookingType] = useState('Daily');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      message.error('Please login to book rooms');
      navigate('/login');
    }
  }, [navigate]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      // Chỉ lấy các phòng có status là Available
      setRooms(data.filter(room => room.status === 'Available'));
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const formatVND = (price) => {
    if (price === undefined || price === null) return '0đ';
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  const filteredRooms = rooms
    .filter(room => {
      const matchesType = filterType === 'All' || room.roomType === filterType;
      const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.roomType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      return sortPrice === 'asc' ? a.dailyPrice - b.dailyPrice : b.dailyPrice - a.dailyPrice;
    });

  const calculatePrice = (values) => {
    if (!values?.checkInDate || !values?.checkOutDate || !selectedRoom) return 0;

    const start = values.checkInDate.toDate();
    const end = values.checkOutDate.toDate();
    
    if (bookingType === 'Daily') {
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return selectedRoom.dailyPrice * days;
    } else {
      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      return selectedRoom.hourlyPrice * hours;
    }
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    const price = calculatePrice(allValues);
    setCalculatedPrice(price);
  };

  const validateBookingData = (bookingData) => {
    if (!bookingData.customerID) throw new Error('User not authenticated');
    if (!bookingData.roomID) throw new Error('No room selected');
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      throw new Error('Invalid booking dates');
    }
    if (bookingData.totalPrice <= 0) throw new Error('Invalid price calculation');
    return true;
  };

  const handleBookingSubmit = async (values) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Please login to book rooms');
        navigate('/login');
        return;
      }

      let currentUser;
      try {
        currentUser = JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data:', e);
        message.error('Invalid user data. Please login again');
        navigate('/login');
        return;
      }

      // Kiểm tra chi tiết thông tin user
      if (!currentUser || typeof currentUser !== 'object') {
        message.error('Invalid user data format. Please login again');
        navigate('/login');
        return;
      }

      // Lấy ID từ _id hoặc id
      const userId = currentUser._id || currentUser.id;
      if (!userId) {
        console.error('User data missing ID:', currentUser);
        message.error('User information incomplete. Please login again');
        navigate('/login');
        return;
      }

      const checkInDate = dayjs(values.checkInDate);
      const checkOutDate = dayjs(values.checkOutDate);
      
      // Tính toán số ngày hoặc số giờ
      let totalDays = 0;
      let totalHours = 0;
      
      if (bookingType === 'Daily') {
        totalDays = Math.max(1, Math.ceil(checkOutDate.diff(checkInDate, 'day', true)));
      } else {
        totalHours = Math.max(1, Math.ceil(checkOutDate.diff(checkInDate, 'hour', true)));
      }

      // Tính tổng tiền
      const totalPrice = bookingType === 'Daily' 
        ? selectedRoom.dailyPrice * totalDays
        : selectedRoom.hourlyPrice * totalHours;

      const bookingData = {
        customerID: userId,
        receptionistID: userId,
        roomID: selectedRoom._id,
        bookingType,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        totalDays: bookingType === 'Daily' ? totalDays : null,
        totalHours: bookingType === 'Hourly' ? totalHours : null,
        services: [],
        status: 'Pending',
        totalPrice
      };

      // Log để debug
      console.log('Booking data to be sent:', bookingData);

      // Validate trước khi gửi
      validateBookingData(bookingData);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      message.success('Booking created successfully!');
      setIsBookingModalVisible(false);
      bookingForm.resetFields();
      navigate('/customer/bookings');
    } catch (error) {
      console.error('Booking error:', error);
      if (error.message.includes('authentication') || error.message.includes('login')) {
        navigate('/login');
      }
      message.error(error.message || 'Failed to create booking');
    }
  };

  const handleBookNowClick = (e, room) => {
    e.stopPropagation();
    const user = localStorage.getItem('user');
    if (!user) {
      message.error('Please login to book rooms');
      navigate('/login');
      return;
    }
    setSelectedRoom(room);
    setIsBookingModalVisible(true);
    bookingForm.resetFields();
    setBookingType('Daily');
    setCalculatedPrice(0);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <TitleSection>
            <div className="icon-wrapper">
              <HomeOutlined />
            </div>
            <Title>Available Rooms</Title>
          </TitleSection>
        </HeaderSection>

        <FilterSection>
          <FilterGroup>
            <div className="filter-label">
              <SearchOutlined />
              Search
            </div>
            <Input
              placeholder="Search by room number or type..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <div className="filter-label">
              <HomeOutlined />
              Room Type
            </div>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: '100%' }}
            >
              <Option value="All">All Types</Option>
              <Option value="Single">Single Room</Option>
              <Option value="Double">Double Room</Option>
              <Option value="Suite">Luxury Suite</Option>
              <Option value="Deluxe">Deluxe Room</Option>
              <Option value="Family">Family Room</Option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <div className="filter-label">
              <DollarOutlined />
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

        {filteredRooms.length > 0 ? (
          <RoomGrid>
            {filteredRooms.map(room => (
              <RoomCard key={room._id}>
                <RoomImage>
                  <HomeOutlined />
                </RoomImage>
                <RoomBadge>{room.roomType}</RoomBadge>
                <RoomInfo>
                  <RoomNumber>
                    <HomeOutlined className="icon" />
                    Room {room.roomNumber}
                  </RoomNumber>
                  <RoomType>
                    <i className="fas fa-bed type-icon" />
                    {room.roomType} Room
                  </RoomType>
                  <RoomDetails>
                    <DetailItem className="price">
                      <DollarOutlined />
                      <span>
                        <strong>{formatVND(room?.dailyPrice)}</strong>/day
                      </span>
                    </DetailItem>
                    <DetailItem className="price">
                      <DollarOutlined />
                      <span>
                        <strong>{formatVND(room?.hourlyPrice)}</strong>/hour
                      </span>
                    </DetailItem>
                    <DetailItem>
                      <TeamOutlined />
                      <span>Up to <strong>{room?.maxOccupancy || 0}</strong> {(room?.maxOccupancy || 0) > 1 ? 'guests' : 'guest'}</span>
                    </DetailItem>
                    {room?.description && (
                      <DetailItem>
                        <i className="fas fa-info-circle" />
                        <span>{room.description}</span>
                      </DetailItem>
                    )}
                  </RoomDetails>
                  <BookButton onClick={(e) => handleBookNowClick(e, room)}>
                    <i className="fas fa-calendar-plus" />
                    <span>Book Now</span>
                  </BookButton>
                </RoomInfo>
              </RoomCard>
            ))}
          </RoomGrid>
        ) : (
          <EmptyRoomsContainer>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={false}
            />
            <div className="empty-text">
              No Rooms Available
            </div>
            <div className="suggestion-text">
              {searchTerm || filterType !== 'All' ? 
                'Try adjusting your filters or search criteria' : 
                'All rooms are currently occupied. Please check back later.'}
            </div>
          </EmptyRoomsContainer>
        )}
      </ContentWrapper>

      <BookingModal
        title={`Book Room ${selectedRoom?.roomNumber}`}
        open={isBookingModalVisible}
        onCancel={() => setIsBookingModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <BookingForm
          form={bookingForm}
          layout="vertical"
          onFinish={handleBookingSubmit}
          onValuesChange={handleFormValuesChange}
        >
          <Form.Item
            name="bookingType"
            label="Booking Type"
            initialValue="Daily"
          >
            <Radio.Group 
              buttonStyle="solid"
              onChange={(e) => setBookingType(e.target.value)}
            >
              <Radio.Button value="Daily">Daily</Radio.Button>
              <Radio.Button value="Hourly">Hourly</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="checkInDate"
            label="Check-in Date & Time"
            rules={[{ required: true, message: 'Please select check-in date!' }]}
          >
            <DatePicker
              showTime={bookingType === 'Hourly'}
              format={bookingType === 'Hourly' ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD"}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="checkOutDate"
            label="Check-out Date & Time"
            rules={[
              { required: true, message: 'Please select check-out date!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('checkInDate')) {
                    return Promise.resolve();
                  }
                  if (value.isBefore(getFieldValue('checkInDate'))) {
                    return Promise.reject(new Error('Check-out must be after check-in!'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              showTime={bookingType === 'Hourly'}
              format={bookingType === 'Hourly' ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD"}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <PricePreview>
            <div className="price-row">
              <span>Room Type:</span>
              <span>{selectedRoom?.roomType || 'N/A'}</span>
            </div>
            <div className="price-row">
              <span>Rate:</span>
              <span>{bookingType === 'Daily' ? 
                `${formatVND(selectedRoom?.dailyPrice)}/day` : 
                `${formatVND(selectedRoom?.hourlyPrice)}/hour`}
              </span>
            </div>
            <div className="price-row total">
              <span>Total Price:</span>
              <span>{formatVND(calculatedPrice)}</span>
            </div>
          </PricePreview>

          <SubmitButton type="primary" htmlType="submit">
            Confirm Booking
          </SubmitButton>
        </BookingForm>
      </BookingModal>
    </PageContainer>
  );
};

export default CustomerRooms; 