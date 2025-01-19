import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

// Styled-components cho pagination
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 5px;
  font-size: 1.2em; 
  aspect-ratio: 1;
  width: 40px;
  font-weight: bold;

  background-color: ${(props) =>
    props.isActive ? '#007b99' : 'transparent'}; /* Nền xanh cho trang hiện tại */
  color: ${(props) => (props.isActive ? '#ffffff' : '#000000')};
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isActive ? '#0056b3' : '#f1ffff')};
  }
`;

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Sinh danh sách các nút trang
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Hiển thị nút 1, 2 ... và các nút cuối
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Trang đầu
        i === totalPages || // Trang cuối
        (i >= currentPage - 1 && i <= currentPage + 1) // Các trang xung quanh currentPage
      ) {
        pageNumbers.push(i);
      } else if (
        i === currentPage - 2 || // Dấu "..."
        i === currentPage + 2
      ) {
        pageNumbers.push('...');
      }
    }

    return [...new Set(pageNumbers)]; // Loại bỏ các số trùng lặp
  };

  const handlePageChange = (page) => {
    if (page !== '...' && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <PaginationContainer>
      {/* Nút điều hướng trước */}
      <PageButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </PageButton>

      {/* Danh sách các số trang */}
      {getPageNumbers().map((page, index) => (
        <PageButton
          key={index}
          isActive={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </PageButton>
      ))}

      {/* Nút điều hướng sau */}
      <PageButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
       <FontAwesomeIcon icon={faAngleRight} />
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
