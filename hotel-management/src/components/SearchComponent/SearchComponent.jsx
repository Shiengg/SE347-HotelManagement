import React from "react";
import { Input } from "antd";

import { Wrapper, SearchWrapper, SearchContainer } from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import ProfileComponent from "../ProfileComponent/ProfileComponent";

const SearchComponent = () => {
  return (
    <SearchContainer>
      <Wrapper>
        {/* Search Section */}
        <SearchWrapper>
          <FontAwesomeIcon icon={faSearch} />
          <Input
            placeholder="Search"
            bordered={false}
            className="SearchBox"
            size="large"
          />
        </SearchWrapper>

        {/* Avatar Section */}
        <ProfileComponent />
      </Wrapper>
    </SearchContainer>
  );
};

export default SearchComponent;
