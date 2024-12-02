import React from "react";
import { NavLink } from "react-router-dom";
import { MenuWrapper, MenuItem } from "./style";
import { HomeOutlined, TeamOutlined, AppstoreOutlined, CoffeeOutlined, FileTextOutlined,CalendarOutlined } from "@ant-design/icons";

const Sidebar = () => {
  return (
    <div>
      <MenuWrapper>
        {/* <MenuItem>
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
        </MenuItem> */}
        <MenuItem>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            <HomeOutlined />
            <span>Home</span>
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/booking" className={({ isActive }) => (isActive ? "active" : "")}>
            <CalendarOutlined />
            <span>Booking</span>
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/food" className={({ isActive }) => (isActive ? "active" : "")}>
            <CoffeeOutlined />
            <span>Food and Beverage</span>
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/customer" className={({ isActive }) => (isActive ? "active" : "")}>
            <TeamOutlined />
            <span>Customers</span>
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/roomstaff" className={({ isActive }) => (isActive ? "active" : "")}>
            <AppstoreOutlined />
            <span>Rooms</span>
          </NavLink>
        </MenuItem> 
        <MenuItem>
          <NavLink to="/invoicestaff" className={({ isActive }) => (isActive ? "active" : "")}>
            <FileTextOutlined />
            <span>Invoice</span>
          </NavLink>
        </MenuItem> 
      </MenuWrapper>
    </div>
  );
};

export default Sidebar;
