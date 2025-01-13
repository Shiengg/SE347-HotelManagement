import React, { useState } from "react";
import BookingItem from "../BookingitemComponent/BookingitemComponent";
import Pagination from "../PaginationComponent/PaginationComponent";
import { StyledTable, StyledTh, BookingListContainer } from "./style";

const bookingsData = [
  { bookingID: 1, customer: "Nguyen Van Anh", checkIn: "28/12/2024", checkOut: "30/12/2024", status: "Pending" },
  { bookingID: 2, customer: "Tran Thi Bi", checkIn: "05/12/2024", checkOut: "08/12/2024", status: "Pending" },
  { bookingID: 3, customer: "Hoang Thi C", checkIn: "01/01/2025", checkOut: "03/01/2025", status: "Completed" },
  // Thêm các bản ghi khác...
];

const BookingList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" }); // Trạng thái sắp xếp
  const itemsPerPage = 7;

  // Hàm sắp xếp dữ liệu
  const sortedData = [...bookingsData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm xử lý khi click vào tiêu đề cột
  const handleSort = (key) => {
    setSortConfig((prevState) => ({
      key,
      direction: prevState.key === key && prevState.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <BookingListContainer className="panel">
      <h2>Booking List</h2>
      {bookingsData.length > 0 ? (
        <>
          <StyledTable>
            <thead>
              <tr>
                <StyledTh onClick={() => handleSort("bookingID")}>
                  Booking ID {sortConfig.key === "bookingID" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </StyledTh>
                <StyledTh onClick={() => handleSort("customer")}>
                  Customer {sortConfig.key === "customer" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </StyledTh>
                <StyledTh onClick={() => handleSort("checkIn")}>
                  Check In {sortConfig.key === "checkIn" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </StyledTh>
                <StyledTh onClick={() => handleSort("checkOut")}>
                  Check Out {sortConfig.key === "checkOut" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </StyledTh>
                <StyledTh onClick={() => handleSort("status")}>
                  Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </StyledTh>
                <StyledTh>Actions</StyledTh>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking) => (
                <BookingItem key={booking.bookingID} booking={booking} />
              ))}
            </tbody>
          </StyledTable>
          <Pagination
            totalItems={bookingsData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p>No bookings available</p>
      )}
    </BookingListContainer>
  );
};

export default BookingList;
