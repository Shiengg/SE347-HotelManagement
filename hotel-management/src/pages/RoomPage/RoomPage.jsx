import React from "react";
import Sidebar from "../../components/SidebarComponent/SidebarComponent"; // Đường dẫn tùy thuộc vào cấu trúc dự án
import styled from "styled-components";
import RoomList from "../../components/RoomlistComponent/RoomlistComponent";
import AddRoomForm from "../../components/AddRoomFormComponent/AddRoomFormComponent";


// Styled-components cho bố cục
const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh; /* Chiều cao toàn màn hình */
`;

const SidebarWrapper = styled.div`
  width: 250px; /* Sidebar cố định chiều rộng */
  background-color: #ffffff; /* Màu nền Sidebar */
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff; /* Màu nền nội dung chính */
  display: flex;
  justify-content: flex-start; /* Đảm bảo nội dung không bị ép vào giữa */
`;

const RoomListWrapper = styled.div`
  flex: 5; /* RoomList chiếm phần lớn không gian */
  width: 450px;
  margin-right: 20px; /* Khoảng cách giữa RoomList và AddRoomForm */
`;

const AddRoomFormWrapper = styled.div`
  flex: 1; /* AddRoomForm chiếm không gian nhỏ hơn */
  padding-left: 20px;
  
`;
const RoomPage = () => {
  return (
    <LayoutWrapper>
      {/* Sidebar */}
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      {/* Nội dung chính */}
      <MainContent>
        {/* Room List */}
        <RoomListWrapper>
          <RoomList />
        </RoomListWrapper>

        {/* Add Room Form */}
        <AddRoomFormWrapper>
          <AddRoomForm />  {/* Đặt AddRoomForm vào đây */}
        </AddRoomFormWrapper>
      </MainContent>
    </LayoutWrapper>
  );
};

export default RoomPage;
