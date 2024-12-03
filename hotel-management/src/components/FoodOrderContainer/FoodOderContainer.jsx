import React, { useState } from 'react';
import FoodListComponent from './FoodListComponent'; // Assuming it's in the same folder
import OrderComponent from './OrderComponent'; // Assuming it's in the same folder

const FoodOrderContainer = () => {
  // State to manage the order items
  const [orderItems, setOrderItems] = useState([]);

  // Function to add items to the order
  const addToOrder = (item) => {
    setOrderItems([...orderItems, item]);
  };

  return (
    <div>
      {/* Pass the addToOrder function as a prop to FoodListComponent */}
      <FoodListComponent addToOrder={addToOrder} />
      
      {/* Pass the orderItems state as a prop to OrderComponent */}
      <OrderComponent orderItems={orderItems} />
    </div>
  );
};

export default FoodOrderContainer;
