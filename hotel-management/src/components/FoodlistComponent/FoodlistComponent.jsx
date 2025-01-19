import React, { useState } from 'react';
import styled from 'styled-components';
import FoodItemComponent from '../FooditemComponent/FooditemComponent';
import mitron from "../../images/mi-tron.jpg";
import nuocsuoi from "../../images/nuoc-suoi.jpg";
import salad from "../../images/salad.jpg";
import comtam from "../../images/comtam.jpg";
import pho from "../../images/pho.jpg";
import bunbo from "../../images/bunbo.jpg";

// Styled-components
const FoodListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: ${(props) => (props.isActive ? '#007bff' : '#ffffff')};
  color: ${(props) => (props.isActive ? '#ffffff' : '#000000')};
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isActive ? '#0056b3' : '#f1f1f1')};
  }
`;

const FoodListComponent = () => {
  // Sample food data
  const foodItems = [
    { id: 1, name: 'Mì trộn', price: '15.000.000', image: mitron },
    { id: 2, name: 'Nước suối', price: '79.990', image: nuocsuoi },
    { id: 3, name: 'Cơm tấm', price: '150.000', image: comtam },
    { id: 4, name: 'Cobb Salad4', price: '150.000', image: salad },
    { id: 5, name: 'Phở', price: '150.000', image: pho },
    { id: 6, name: 'Bún bò', price: '150.000', image: bunbo },
    { id: 7, name: 'Ceasar Salad7', price: '150.000', image: salad },
    { id: 8, name: 'Caprese Salad8', price: '150.000', image: salad },
  ];

  // Pagination state
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(foodItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {/* Food Items */}
      <FoodListContainer>
        {currentItems.map((item) => (
          <FoodItemComponent
            key={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </FoodListContainer>
      {/* Pagination */}
      {foodItems.length > itemsPerPage && (
        <PaginationContainer>
          <PageButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; {/* Previous */}
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton
              key={i + 1}
              isActive={i + 1 === currentPage}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt; {/* Next */}
          </PageButton>
        </PaginationContainer>
      )}
    </>
  );
};

export default FoodListComponent;
