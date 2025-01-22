import styled from "styled-components";

export const MenuWrapper = styled.div`
  background: white;
  padding: 20px;
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng cho sidebar */
  gap: 10px;
  transition: transform 0.5s ease;

  @media (max-width: 680px) {
    padding: 10px 5px;
    gap: 5px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 3px;
  }
  &.open {
    transform: translateX(0); /* Slide in when open */
  }

  &.closed {
    transform: translateX(-100%); /* Slide out when closed */
  }
`;

export const MenuSection = styled.div`
  margin-bottom: 16px;

  .section-title {
    white-space:break-all;
    font-size: 12px;
    text-transform: uppercase;
    color: #6b7280;
    font-weight: 600;
    margin: 16px 12px 8px;
    letter-spacing: 0.05em;

    @media (max-width: 680px) {
     border-top: 2px solid grey;
     opacity:0.7;
     h3{
      display: none;
       
      }
    }
  }
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
    transition: all 0.1s; /* Hiệu ứng chuyển động */

    @media (max-width: 1600px) {
      padding: 10px; /* Tăng khoảng cách trái để làm nổi bật item */
    }

`;

export const MenuItem = styled.div`
  margin: 2px 0;

  a {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: #4b5563;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.2s ease;
    font-weight: bold;

    color: ${(props) => props.color};

    &:hover:not(.active) {
      background-color: ${(props) => props.color}; /* Màu nền khi hover */
      border-radius: 0px 10px 10px 0px;
      color: white; /* Màu chữ khi hover */
      transform-origin:left;
      transform: scale(1.05); /* Phóng to item khi hover */
      
    }

    &.active {
      background-color: white; /* Màu nền khi active */
      color: ${(props) => props.color}; /* Màu chữ khi active */
      border-left: 4px solid ${(props) => props.color}; /* Viền trái khi active */
      border-bottom: 4px solid ${(props) => props.color}; /* Viền trái khi active */
      padding-left: 25px; /* Tăng khoảng cách trái để làm nổi bật item */
      border-radius: 0px 10px 10px 0px;
    }
  }

  @media (max-width: 680px) {
    a {
      padding: 12px;
      justify-content: center;
    }
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  img {
    width: 32px;
    height: auto;

    @media (max-width: 680px) {
      width: 28px;
    }
  }
`;

export const LogoName = styled.div`
  font-family: Times New Roman;
  font-weight: bold;
  font-size: 1.6em;
  color: #ffdd1e;

  @media (max-width: 680px) {
    display: none;
  }
`;

export const MenuButton = styled.button`
  font-size: 1.2em;
  cursor: pointer;
  border: none;
  border-radius: 30%;
  padding: 10px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  aspect-ratio: 1/1;
  color: white;
  background: gold;
  opacity: 0.5;
  transition: all 0.1s;
  position: fixed;
  bottom: 10px;
  left: 10px;

  &:hover {
    opacity: 1;
    border-bottom: 3px solid brown;
    border-left: 3px solid brown;
  }

  &:active {
    border: none;
  }
`;

export const ToggleMenuButton = styled.button`
  background: transparent;
  font-size: 1.2em;
  cursor: pointer;
  border: none;
  margin-top: auto;
  transition: all 0.1s;

  &:hover {
    transform: scale(1.1);
  }

  &:hover {
    transform: scale(1.1);
  }
`;
