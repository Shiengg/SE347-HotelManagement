import React from "react";
import styled from "styled-components";
import FoodListComponent from "../../components/FoodlistComponent/FoodlistComponent"; // Import FoodListComponent
import Oder from "../../components/OderComponent/OderComponent"; // Nếu cần

// Styled-components for layout
const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr; /* Increase the food list width (4 parts vs. 1 part) */
  grid-gap: 20px; /* Khoảng cách giữa các cột */
  height: 100vh; /* Full-screen height */
  background-color: #ffffff;
`;

const FoodListContainer = styled.div`
  background-color: #E8E8F0; /* Màu nền */
  padding: 20px;
  border-radius: 30px; /* Bo góc */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Đổ bóng */
  overflow-y: auto; /* Cuộn khi nội dung quá dài */
`;

const AddOder = styled.div`
  background-color: #E8E8F0; /* Màu nền */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Đổ bóng */
`;

const FoodPage = () => {
  return (
    <LayoutWrapper>
      {/* Food List */}
      <FoodListContainer>
        <FoodListComponent />
      </FoodListContainer>

      {/* Add Food Form */}
      <AddOder>
        <Oder />
      </AddOder>
    </LayoutWrapper>
  );
};

export default FoodPage;
