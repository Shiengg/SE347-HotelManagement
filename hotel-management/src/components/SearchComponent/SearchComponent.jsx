import React from "react";
import { Input } from "antd";

import { Wrapper, SearchWrapper, SearchContainer } from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ProfileComponent from "../ProfileComponent/ProfileComponent";

const SearchComponent = () => {
  return (
    <SearchWrapper>
      <FontAwesomeIcon icon={faSearch} />
      <Input
        placeholder="Search"
        bordered={false}
        className="SearchBox"
        size="large"
      />
    </SearchWrapper>
  );
};

export default SearchComponent;
