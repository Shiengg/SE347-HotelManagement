import React, { useState } from 'react';
import styled from 'styled-components';

// Styled-components for the form
const AddBookingContainer = styled.div`
  width: 320px;
  margin-left: 10px;
  margin-right: 0px;
  border-radius: 30px;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const InputField = styled.input`
  width: 90%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-size: 14px;
`;

const SelectField = styled.select`
  width: 90%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #0056b3;
  }
`;

const AddNewBooking = () => {
  const [formData, setFormData] = useState({
    customer: '',
    room: '',
    checkInDate: '',
    checkOutDate: '',
    status: 'Pending',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Booking Added:', formData);
    // Handle form submission logic here
  };

  return (
    <AddBookingContainer className="panel">
      <h3>Add New Booking</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="customer">Customer</Label>
          <SelectField
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            id="customer"
          >
            <option value="" disabled>
              Select Customer
            </option>
            <option value="customer1">Customer 1</option>
            <option value="customer2">Customer 2</option>
          </SelectField>
        </div>

        <div>
          <Label htmlFor="room">Room</Label>
          <SelectField
            name="room"
            value={formData.room}
            onChange={handleChange}
            id="room"
          >
            <option value="" disabled>
              Select Room
            </option>
            <option value="room1">Room 1</option>
            <option value="room2">Room 2</option>
          </SelectField>
        </div>

        <div>
          <Label htmlFor="checkInDate">Check In Date</Label>
          <InputField
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            id="checkInDate"
          />
        </div>

        <div>
          <Label htmlFor="checkOutDate">Check Out Date</Label>
          <InputField
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            id="checkOutDate"
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <SelectField
            name="status"
            value={formData.status}
            onChange={handleChange}
            id="status"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </SelectField>
        </div>

        <Button type="submit">Add Booking</Button>
      </form>
    </AddBookingContainer>
  );
};

export default AddNewBooking;
