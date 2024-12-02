import React from "react";
import { Input, Avatar, Dropdown, Menu } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import { Wrapper, SearchWrapper, AvatarWrapper, RoleText, SearchContainer } from "./style"; 

const SearchComponent = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">Profile</Menu.Item>
      <Menu.Item key="2">Logout</Menu.Item>
    </Menu>
  );

  return (
    <SearchContainer>
    <Wrapper>
      {/* Search Section */}
      <SearchWrapper>
        <SearchOutlined style={{ fontSize: "16px", marginRight: "10px" }} />
        <Input
          placeholder="Search"
          bordered={false}
          style={{ backgroundColor: "transparent", outline: "none" }}
        />
      </SearchWrapper>

      {/* Avatar Section */}
      <Dropdown overlay={menu} trigger={["click"]}>
        <AvatarWrapper>
          <Avatar
            src="https://via.placeholder.com/40"
            alt="avatar"
            size="small"
          />
          <div>
            <div>Name</div>
            <RoleText>Role</RoleText>
          </div>
          <DownOutlined style={{ fontSize: "12px" }} />
        </AvatarWrapper>
      </Dropdown>
    </Wrapper>
    </SearchContainer>
  );
};

export default SearchComponent;
