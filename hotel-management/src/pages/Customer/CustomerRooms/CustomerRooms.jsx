import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Select, Space, Input } from 'antd';
import { HomeOutlined, SearchOutlined, DollarOutlined, TeamOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';

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
  padding: 16px;
  background: white;
  transition: background-color 0.3s ease;
`;

const RoomImage = styled.div`
  height: 180px;
  background: linear-gradient(45deg, #1a3353, #264773);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2em;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #ffd700, #ffed4a);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .anticon {
    font-size: 2.5em;
    z-index: 1;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #eee;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: #ffd700;

    ${RoomImage} {
      &::after {
        opacity: 0.7;
      }
    }

    ${RoomInfo} {
      background: #fafafa;
    }
  }
`;

const RoomBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  color: #1a3353;
  font-size: 0.9em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 215, 0, 0.3);
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
  gap: 8px;
  color: #444;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.className === 'price' ? 'rgba(0, 168, 84, 0.1)' : '#f5f5f5'};
  }

  .anticon {
    font-size: 1.1em;
    color: ${props => props.className === 'price' ? '#00a854' : '#666'};
  }

  &.price {
    color: #00a854;
    font-weight: 500;
    font-size: 1.1em;
  }
`;

const BookButton = styled.button`
  width: 100%;
  padding: 10px;
  background: linear-gradient(45deg, #1a3353, #264773);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: linear-gradient(45deg, #264773, #1a3353);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26, 51, 83, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  .anticon {
    font-size: 1.1em;
  }
`;

const CustomerRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [sortPrice, setSortPrice] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

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
                    {formatVND(room.dailyPrice)}/day
                  </DetailItem>
                  <DetailItem className="price">
                    <DollarOutlined />
                    {formatVND(room.hourlyPrice)}/hour
                  </DetailItem>
                  <DetailItem>
                    <TeamOutlined />
                    Maximum {room.maxOccupancy} {room.maxOccupancy > 1 ? 'persons' : 'person'}
                  </DetailItem>
                  {room.description && (
                    <DetailItem>
                      <i className="fas fa-info-circle" />
                      {room.description}
                    </DetailItem>
                  )}
                </RoomDetails>
                <BookButton>
                  <i className="fas fa-calendar-plus" />
                  Book Now
                </BookButton>
              </RoomInfo>
            </RoomCard>
          ))}
        </RoomGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default CustomerRooms; 