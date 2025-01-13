import React from "react";
import { Input, Avatar, Dropdown, Menu } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import {
  Wrapper,
  SearchWrapper,
  AvatarWrapper,
  RoleText,
  SearchContainer,
  RoundWrapper,
  ProfileWrapper,
} from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faBars, faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchComponent = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">Profile</Menu.Item>
      <Menu.Item key="2">Logout</Menu.Item>
    </Menu>
  );

  return (
    <SearchContainer className="panel">
      <Wrapper>
        {/* Search Section */}
        <SearchWrapper>
          <FontAwesomeIcon icon={faSearch}/>
          <Input
            placeholder="Search"
            bordered={false}
            style={{ backgroundColor: "transparent", outline: "none",fontSize:"16px" }}
          />
        </SearchWrapper>

        {/* Avatar Section */}
        <ProfileWrapper>
          <Dropdown overlay={menu} trigger={["click"]}>
            <AvatarWrapper>
              <Avatar
                src="https://via.placeholder.com/40"
                alt="avatar"
                size="big"
              />
              <div>
                <div>Name</div>
                <RoleText>Role</RoleText>
              </div>
              <FontAwesomeIcon icon={faBars} style={{margin:"10px"}} />
            </AvatarWrapper>
          </Dropdown>
        </ProfileWrapper>
      </Wrapper>
    </SearchContainer>
  );
};

export default SearchComponent;
