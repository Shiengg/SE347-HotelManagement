import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";

const SearchInput = styled(Input)`
  width: 400px;
  border-radius: 8px;
  
  @media (max-width: 680px) {
    width: 100%;
  }
`;

const SearchComponent = () => {
  return (
    <SearchInput
      placeholder="Search..."
      prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
      variant="outlined"
    />
  );
};

export default SearchComponent;
