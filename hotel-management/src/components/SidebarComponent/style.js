import styled from "styled-components";

// Wrapper cho Sidebar
export const MenuWrapper = styled.div`
  background-color: #e8e8f0; /* Màu nền xám nhạt */
  padding: 20px;
  display: grid;
  border-radius: 20px; /* Bo góc cho sidebar */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng cho sidebar */
  gap: 10px;

  @media (max-width: 1600px) {
    padding: 10px 20px;
    grid-template-columns: repeat(3, 1fr); /* Chia thành 3 cột trên mobile */
    text-align: left;
  }

  @media (max-width: 680px) {
    display: flex;
    justify-content: space-between;
  }
`;

// Wrapper cho mỗi Menu Item
export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  height: fit-content; /* Chiều cao của mỗi item */

  a {
    padding: 20px; /* Khoảng cách giữa các item */
    text-decoration: none;
    color: black; /* Màu chữ mặc định */
    font-size: 17px;
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%; /* Chiếm toàn bộ chiều rộng item */
    height: 100%;

    @media (max-width: 1600px) {
      padding: 10px; /* Tăng khoảng cách trái để làm nổi bật item */
    }

    @media (max-width: 680px) {
      padding: 10px; /* Khoảng cách giữa các item */
      .text {
        display: none;
      }
    }

    &:hover {
      background-color: #e6e6ff; /* Màu nền khi hover */
      border-radius: 10px;
      color: #1890ff; /* Màu chữ khi hover */
    }
    &.active {
      background-color: #d9d9ff; /* Màu nền khi active */
      color: #1890ff; /* Màu chữ khi active */
      border-left: 4px solid #1890ff; /* Viền trái khi active */
      padding-left: 25px; /* Tăng khoảng cách trái để làm nổi bật item */
      border-radius: 10px;

      @media (max-width: 1600px) {
        padding-left: 10px; /* Tăng khoảng cách trái để làm nổi bật item */
        border-bottom: 4px solid #1890ff; /* Viền trái khi active */
        border-left: none;
      }

      @media (max-width: 680px) {
        padding: 10px; /* Khoảng cách giữa các item */
      }
    }
  }
`;
