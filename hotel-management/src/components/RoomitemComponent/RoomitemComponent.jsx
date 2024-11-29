import React from 'react';
import { StyledTd, StyledImg, EditButton, DeleteButton } from '../RoomlistComponent/style';
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const RoomItem = ({ room }) => {
  const { roomName, image, type, bedType, rate, status } = room;  // Destructure roomName

  return (
    <tr>
      {/* Room Image and Name in the same cell */}
      <StyledTd style={{ display: 'flex', alignItems: 'center' }}>
        <StyledImg src={image} alt="Room" style={{ marginRight: '10px' }} />
        <span>{roomName}</span> {/* Display Room Name */}
      </StyledTd>

      <StyledTd>{type}</StyledTd>
      <StyledTd style={{ color: 'green' }}>{bedType}</StyledTd>
      <StyledTd>{rate}</StyledTd>
      <StyledTd style={{ color: 'green' }}>{status}</StyledTd>

      <StyledTd>
        <EditButton>
          <AiFillEdit />
        </EditButton>
        <DeleteButton>
          <AiFillDelete />
        </DeleteButton>
      </StyledTd>
    </tr>
  );
};

export default RoomItem;
