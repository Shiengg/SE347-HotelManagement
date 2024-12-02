import React from "react";
import { StyledTd, ActionButton } from "../BookinglistComponent/style";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const BookingItem = ({ booking }) => {
  const { bookingID, customer, checkIn, checkOut, status } = booking;

  return (
    <tr>
      <StyledTd>{bookingID}</StyledTd>
      <StyledTd>{customer}</StyledTd>
      <StyledTd>{checkIn}</StyledTd>
      <StyledTd>{checkOut}</StyledTd>
      <StyledTd style={{ color: status === "Pending" ? "orange" : "green" }}>
        {status}
      </StyledTd>
      <StyledTd>
        <ActionButton>
          <AiFillEdit style={{ color: "green", marginRight: "8px" }} />
        </ActionButton>
        <ActionButton>
          <AiFillDelete style={{ color: "red" }} />
        </ActionButton>
      </StyledTd>
    </tr>
  );
};

export default BookingItem;
