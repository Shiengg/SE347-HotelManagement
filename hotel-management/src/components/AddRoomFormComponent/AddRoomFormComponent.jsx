import React, { useState } from 'react';
import styled from 'styled-components';

// Styled-components cho form
const AddRoomContainer = styled.div`
  width: 320px;
  height: 100%;
  margin-left: 10px;
  margin-right: 0px;
  border-radius: 30px;
  padding: 10px 20px;
  background-color: #E8E8F0;
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

const UploadArea = styled.div`
  width: 90%;
  padding: 20px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
`;

const Button = styled.button`
  width: 48%;
  padding: 12px;
  margin: 10px 1%;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #45a049;
  }
`;

const ButtonClear = styled.button`
  width: 48%;
  padding: 12px;
  margin: 10px 1%;
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #bdbdbd;
  }
`;

// Wrapper to align the fields horizontally
const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin-bottom: 10px;
`;

const AddRoomForm = () => {
  const [formData, setFormData] = useState({
    type: 'Single bed',
    roomNo: '',
    roomName: '',
    rate: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: URL.createObjectURL(e.target.files[0]),
    }));
  };

  const handleClear = () => {
    setFormData({
      type: 'Single bed',
      roomNo: '',
      roomName: '',
      rate: '',
      image: null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Room Added:', formData);
  };

  return (
    <AddRoomContainer>
      <h3>Add Room</h3>
      <form onSubmit={handleSubmit}>
        <FieldRow>
          <div style={{ width: '48%' }}>
            <Label htmlFor="type">Room Type</Label>
            <SelectField
              name="type"
              value={formData.type}
              onChange={handleChange}
              id="type"
            >
              <option value="Single bed">Single bed</option>
              <option value="Double bed">Double bed</option>
              <option value="Suite">Suite</option>
            </SelectField>
          </div>

          <div style={{ width: '48%' }}>
            <Label htmlFor="roomNo">Room No.</Label>
            <InputField
              type="text"
              name="roomNo"
              placeholder="Room No."
              value={formData.roomNo}
              onChange={handleChange}
              id="roomNo"
            />
          </div>
        </FieldRow>

        <div>
          <Label htmlFor="roomName">Room Name</Label>
          <InputField
            type="text"
            name="roomName"
            placeholder="Room Name"
            value={formData.roomName}
            onChange={handleChange}
            id="roomName"
          />
        </div>

        <div>
          <Label htmlFor="rate">Rate</Label>
          <InputField
            type="text"
            name="rate"
            placeholder="Rate"
            value={formData.rate}
            onChange={handleChange}
            id="rate"
          />
        </div>

        <div>
          <Label htmlFor="image">Upload Image</Label>
          <UploadArea>
            {formData.image ? (
              <img src={formData.image} alt="Room" style={{ width: '100%' }} />
            ) : (
              <span>Upload</span>
            )}
            <input type="file" onChange={handleFileChange} id="image" />
          </UploadArea>
        </div>

        <div>
          <ButtonClear type="button" onClick={handleClear}>
            Clear
          </ButtonClear>
          <Button type="submit">Add Room</Button>
        </div>
      </form>
    </AddRoomContainer>
  );
};

export default AddRoomForm;
