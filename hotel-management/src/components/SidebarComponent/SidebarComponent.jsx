import React from "react";
import { NavLink } from "react-router-dom";
import { MenuWrapper, MenuItem } from "./style";
import { HomeOutlined, TeamOutlined, AppstoreOutlined, CoffeeOutlined, FileTextOutlined } from "@ant-design/icons";

const Sidebar = () => {
  return (
    <div>
      <MenuWrapper>
        <MenuItem>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            <HomeOutlined />
            <span>Home</span>
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/guest" className={({ isActive }) => (isActive ? "active" : "")}>
            <TeamOutlined />
            <span>Guest</span>
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/rooms" className={({ isActive }) => (isActive ? "active" : "")}>
            <AppstoreOutlined />
            <span>Rooms</span>
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/service" className={({ isActive }) => (isActive ? "active" : "")}>
            <CoffeeOutlined />
            <span>Service</span>
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/invoice" className={({ isActive }) => (isActive ? "active" : "")}>
            <FileTextOutlined />
            <span>Invoice</span>
          </NavLink>
        </MenuItem>
      </MenuWrapper>
    </div>
  );
};

export default Sidebar;
