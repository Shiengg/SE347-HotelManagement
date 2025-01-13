import React from "react";
import styled from "styled-components";
import FoodListComponent from "../../components/FoodlistComponent/FoodlistComponent"; // Import FoodListComponent
import Oder from "../../components/OderComponent/OderComponent"; // Nếu cần

// Styled-components for layout
const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr; /* Increase the food list width (4 parts vs. 1 part) */
  grid-gap: 20px; /* Khoảng cách giữa các cột */
`;

const FoodListContainer = styled.div`
  padding: 20px;
  border-radius: 20px; /* Bo góc */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Đổ bóng */
  overflow-y: auto; /* Cuộn khi nội dung quá dài */
`;

const AddOder = styled.div`
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Đổ bóng */
`;

const FoodPage = () => {
  return (
    <LayoutWrapper>
      {/* Food List */}
      <FoodListContainer className="panel">
        <FoodListComponent />
      </FoodListContainer>

      {/* Add Food Form */}
      <AddOder className="panel">
        <Oder />
      </AddOder>
    </LayoutWrapper>
  );
};

export default FoodPage;
