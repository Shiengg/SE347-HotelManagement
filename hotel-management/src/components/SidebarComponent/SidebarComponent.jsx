import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MenuWrapper, MenuItem } from "./style";
import {
  HomeOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CoffeeOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd"; // Import Tooltip
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faHouse, faMugHot, faReceipt, faTable, faUsers } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const menuItems = [
    { title: "Home", to: "/", icon: faHouse, color: "#ff6b6b" },
    { title: "Booking", to: "/booking", icon: faCalendarDays, color: "#6b5bff" },
    { title: "Food and Beverage", to: "/food", icon: faMugHot, color: "#ffb74d" },
    { title: "Customers", to: "/customer", icon: faUsers, color: "#4caf50" },
    { title: "Rooms", to: "/roomstaff", icon: faTable, color: "#2196f3" },
    { title: "Invoice", to: "/invoicestaff", icon: faReceipt, color: "#9c27b0" },
  ];

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
    <MenuWrapper   className="panel">
      {menuItems.map((item) => (
        <MenuItem
          key={item.to}
          color={item.color}
          hoverColor={`${item.color}33`} // Add transparency for hover
          activeColor={item.color}
        >
          {isMobile ? (
            <Tooltip title={item.title} placement="bottom">
              <NavLink to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                <FontAwesomeIcon icon={item.icon} />
                <span className="text">{item.title}</span>
              </NavLink>
            </Tooltip>
          ) : (
            <NavLink to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
              <FontAwesomeIcon icon={item.icon} />
              <span className="text">{item.title}</span>
            </NavLink>
          )}
        </MenuItem>
      ))}
    </MenuWrapper>
  );
};

export default Sidebar;
