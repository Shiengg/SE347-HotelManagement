import React, { useState } from 'react';
import RoomItem from '../RoomitemComponent/RoomitemComponent';
import Pagination from '../PaginationComponent/PaginationComponent';
import { RoomListContainer, StyledTable, StyledTh } from './style';
import logo from "../../images/logo.png";

// Dữ liệu mẫu với tên phòng thay vì hình ảnh
const roomsData = Array(50).fill({
    roomName: 'ROOM 1', // Room name
    image: logo, // Placeholder image (replace with actual image URLs)
    type: 'Luxury',
    bedType: 'Single bed',
    rate: '1,000,000 VND/Day',
    status: 'Allocated',
  });
  

const RoomList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Trạng thái sắp xếp
  const itemsPerPage = 7;

  // Tính toán vị trí phần tử hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Hàm xử lý sắp xếp
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });

    // Sắp xếp lại danh sách phòng
    roomsData.sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Lọc và phân trang danh sách phòng
  const currentRooms = roomsData.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm để hiển thị mũi tên sắp xếp
  const renderSortIcon = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  return (
    <RoomListContainer>
      <h2>Rooms</h2>
      {roomsData.length > 0 ? (
        <>
          {/* Bảng hiển thị danh sách phòng */}
          <StyledTable>
            <thead>
              <tr>
                <StyledTh onClick={() => handleSort('roomName')}>
                  Room Name {renderSortIcon('roomName')}
                </StyledTh>
                <StyledTh onClick={() => handleSort('type')}>
                  Type {renderSortIcon('type')}
                </StyledTh>
                <StyledTh onClick={() => handleSort('bedType')}>
                  Bed Type {renderSortIcon('bedType')}
                </StyledTh>
                <StyledTh onClick={() => handleSort('rate')}>
                  Rate {renderSortIcon('rate')}
                </StyledTh>
                <StyledTh onClick={() => handleSort('status')}>
                  Status {renderSortIcon('status')}
                </StyledTh>
                <StyledTh>Action</StyledTh>
              </tr>
            </thead>
            <tbody>
              {currentRooms.map((room, index) => (
                <RoomItem key={index} room={room} />
              ))}
            </tbody>
          </StyledTable>

          {/* Component phân trang */}
          <Pagination
            totalItems={roomsData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p>No rooms available</p> // Hiển thị khi không có dữ liệu
      )}
    </RoomListContainer>
  );
};

export default RoomList;
