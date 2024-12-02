import styled from "styled-components";

// Wrapper cho Sidebar
export const MenuWrapper = styled.div`
  width: 230px; /* Chiều rộng sidebar */
  height: 608px;
  background-color: #E8E8F0; /* Màu nền xám nhạt */
  padding: 40px 10px;
  display: flex;
  flex-direction: column;
  border-radius: 40px 40px 40px 40px; /* Bo góc cho sidebar */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng cho sidebar */
  margin-top: 30px;
   
`;

// Wrapper cho mỗi Menu Item
export const MenuItem = styled.div`
  padding: 20px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 50px;

  a {
    text-decoration: none;
    color: black; /* Màu chữ mặc định */
    font-size: 17px;
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%; /* Chiếm toàn bộ chiều rộng item */
    height: 100%;

    &:hover {
      background-color: #e6e6ff; /* Màu nền khi hover */
      border-radius: 10px;
      color: #1890ff; /* Màu chữ khi hover */
    }

    &.active {
      background-color: #d9d9ff; /* Màu nền khi active */
      color: #1890ff; /* Màu chữ khi active */
      border-left: 4px solid #1890ff; /* Viền trái khi active */
      padding-left: 16px; /* Tăng khoảng cách trái để làm nổi bật item */
      border-radius: 10px;
    }

    span {
      margin-left: 8px;
    }
  }
`;

