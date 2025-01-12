import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MenuWrapper, MenuItem } from "./style";
import { HomeOutlined, TeamOutlined, AppstoreOutlined, CoffeeOutlined, FileTextOutlined, CalendarOutlined } from "@ant-design/icons";
import { Tooltip } from "antd"; // Import Tooltip

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen size on component mount
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 680); // Set to true if screen width <= 680px (mobile)
    };

    handleResize(); // Run once when component mounts
    window.addEventListener("resize", handleResize); // Listen for window resize events

    return () => window.removeEventListener("resize", handleResize); // Clean up on unmount
  }, []);

  return (
    <MenuWrapper>
      <MenuItem>
        {isMobile ? (
          <Tooltip title="Home" placement="bottom">
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              <HomeOutlined />
              <span className="text">Home</span>
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            <HomeOutlined />
            <span className="text">Home</span>
          </NavLink>
        )}
      </MenuItem>

      <MenuItem>
        {isMobile ? (
          <Tooltip title="Booking" placement="bottom">
            <NavLink to="/booking" className={({ isActive }) => (isActive ? "active" : "")}>
              <CalendarOutlined />
              <span className="text">Booking</span>
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink to="/booking" className={({ isActive }) => (isActive ? "active" : "")}>
            <CalendarOutlined />
            <span className="text">Booking</span>
          </NavLink>
        )}
      </MenuItem>

      <MenuItem>
        {isMobile ? (
          <Tooltip title="Food and Beverage" placement="bottom">
            <NavLink to="/food" className={({ isActive }) => (isActive ? "active" : "")}>
              <CoffeeOutlined />
              <span className="text">Food and Beverage</span>
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink to="/food" className={({ isActive }) => (isActive ? "active" : "")}>
            <CoffeeOutlined />
            <span className="text">Food and Beverage</span>
          </NavLink>
        )}
      </MenuItem>

      <MenuItem>
        {isMobile ? (
          <Tooltip title="Customers" placement="bottom">
            <NavLink to="/customer" className={({ isActive }) => (isActive ? "active" : "")}>
              <TeamOutlined />
              <span className="text">Customers</span>
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink to="/customer" className={({ isActive }) => (isActive ? "active" : "")}>
            <TeamOutlined />
            <span className="text">Customers</span>
          </NavLink>
        )}
      </MenuItem>

      <MenuItem>
        {isMobile ? (
          <Tooltip title="Rooms" placement="bottom">
            <NavLink to="/roomstaff" className={({ isActive }) => (isActive ? "active" : "")}>
              <AppstoreOutlined />
              <span className="text">Rooms</span>
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink to="/roomstaff" className={({ isActive }) => (isActive ? "active" : "")}>
            <AppstoreOutlined />
            <span className="text">Rooms</span>
          </NavLink>
        )}
      </MenuItem>

      <MenuItem>
        {isMobile ? (
          <Tooltip title="Invoice" placement="bottom">
            <NavLink to="/invoicestaff" className={({ isActive }) => (isActive ? "active" : "")}>
              <FileTextOutlined />
              <span className="text">Invoice</span>
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink to="/invoicestaff" className={({ isActive }) => (isActive ? "active" : "")}>
            <FileTextOutlined />
            <span className="text">Invoice</span>
          </NavLink>
        )}
      </MenuItem>
    </MenuWrapper>
  );
};

export default Sidebar;
