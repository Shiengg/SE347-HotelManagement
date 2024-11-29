import styled from 'styled-components';

// Styled container cho danh sách phòng
export const RoomListContainer = styled.div`
  width: 100%;
  margin-left: 10px;
  border-radius: 30px;
  padding: 10px;
  background-color: #E8E8F0;
  height: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng cho sidebar */
`;

// Styled table
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const StyledTh = styled.th`
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: #E8E8F0;
`;

export const StyledTd = styled.td`
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

export const StyledImg = styled.img`
  display: block;
  max-width: 100%;
  width: 80px;
  height: 50px;
  border-radius: 5px;
`;

// Styled buttons
export const EditButton = styled.button`
  background: none;
  border: none;
  color: green;
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
`;

// Styled pagination
export const PaginationContainer = styled.div`
  text-align: center;
  margin-top: 10px;
`;

export const PaginationButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;

  &.active {
    background-color: #007bff;
    color: #fff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
