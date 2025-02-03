import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  MenuWrapper,
  MenuItem,
  MenuSection,
  LogoWrapper,
  LogoName,
  MenuButton,
  ToggleMenuButton,
} from "./style";
import { Tooltip } from "antd"; // Import Tooltip
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCalendarDays,
  faGear,
  faHouse,
  faMugHot,
  faReceipt,
  faTable,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../svg/AppLogo.svg";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  const menuConfig = {
    admin: [
      {
        section: "Overview",
        items: [
          {
            title: "Dashboard",
            to: "/admin/dashboard",
            icon: faHouse, // Replace with <DashboardOutlined /> in your rendering logic
            color: "#ff6b6b",
          },
        ],
      },
      {
        section: "People Management",
        items: [
          {
            title: "Employees",
            to: "/admin/employees",
            icon: faUsers, // Replace with <TeamOutlined />
            color: "#4caf50",
          },
          {
            title: "Guests",
            to: "/admin/guests",
            icon: faUsers, // Replace with <UserOutlined />
            color: "#6b5bff",
          },
        ],
      },
      {
        section: "Operations",
        items: [
          {
            title: "Bookings",
            to: "/admin/bookings",
            icon: faCalendarDays, // Replace with <CalendarOutlined />
            color: "#6b5bff",
          },
          {
            title: "Rooms",
            to: "/admin/rooms",
            icon: faTable, // Replace with <AppstoreOutlined />
            color: "#2196f3",
          },
          {
            title: "Restaurant",
            to: "/admin/restaurant",
            icon: faMugHot, // Replace with <CoffeeOutlined />
            color: "#ffb74d",
          },
        ],
      },
      {
        section: "Finance",
        items: [
          {
            title: "Invoices",
            to: "/admin/invoices",
            icon: faReceipt, // Replace with <FileTextOutlined />
            color: "#9c27b0",
          },
        ],
      }
    ],
    receptionist: [
      {
        section: "Overview",
        items: [
          {
            title: "Dashboard",
            to: "/receptionist/dashboard",
            icon: faHouse, // Replace with <DashboardOutlined />
            color: "#ff6b6b",
          },
        ],
      },
      {
        section: "Guest Management",
        items: [
          {
            title: "Guests",
            to: "/receptionist/guests",
            icon: faUsers, // Replace with <UserOutlined />
            color: "#4caf50",
          },
        ],
      },
      {
        section: "Operations",
        items: [
          {
            title: "Bookings",
            to: "/receptionist/bookings",
            icon: faCalendarDays, // Replace with <CalendarOutlined />
            color: "#6b5bff",
          },
          {
            title: "Rooms",
            to: "/receptionist/rooms",
            icon: faTable, // Replace with <AppstoreOutlined />
            color: "#2196f3",
          },
          {
            title: "Restaurant",
            to: "/receptionist/restaurant",
            icon: faMugHot, // Replace with <CoffeeOutlined />
            color: "#ffb74d",
          },
        ],
      },
      {
        section: "Finance",
        items: [
          {
            title: "Invoices",
            to: "/receptionist/invoices",
            icon: faReceipt, // Replace with <FileTextOutlined />
            color: "#9c27b0",
          },
        ],
      },
    ],
    customer: [
      {
        section: "Overview",
        items: [
          {
            title: "Dashboard",
            to: "/customer/dashboard",
            icon: faHouse, // Replace with <HomeOutlined />
            color: "#ff6b6b",
          },
        ],
      },
      {
        section: "Services",
        items: [
          {
            title: "Booking",
            to: "/customer/booking",
            icon: faCalendarDays, // Replace with <CalendarOutlined />
            color: "#6b5bff",
          },
          {
            title: "Rooms",
            to: "/customer/rooms",
            icon: faTable, // Replace with <ShopOutlined />
            color: "#2196f3",
          },
          {
            title: "Restaurant",
            to: "/customer/restaurant",
            icon: faMugHot, // Replace with <CoffeeOutlined />
            color: "#ffb74d",
          },
        ],
      },
      {
        section: "Personal",
        items: [
          {
            title: "Invoice",
            to: "/customer/invoice",
            icon: faReceipt, // Replace with <FileTextOutlined />
            color: "#9c27b0",
          },
          {
            title: "Profile",
            to: "/customer/profile",
            icon: faUsers, // Replace with <UserOutlined />
            color: "#4caf50",
          },
        ],
      },
    ],
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 680);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderMenuItems = (items) =>
    items.map(({ title, to, icon, color }) => (
      <MenuItem
        key={to}
        color={color}
        hoverColor={`${color}33`}
        activeColor={color}
      >
        {isMobile ? (
          <Tooltip title={title} placement="right">
            <NavLink
              to={to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FontAwesomeIcon icon={icon} />
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink
            to={to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FontAwesomeIcon icon={icon} />
            <span className="text">{title}</span>
          </NavLink>
        )}
      </MenuItem>
    ));

  const renderSidebar = () => {
    const role = currentUser?.role;
    if (!role || !menuConfig[role]) return null;

    return menuConfig[role].map(({ section, items }) => (
      <MenuSection key={section}>
        <div className="section-title">
          <h3>{section}</h3>
        </div>
        {renderMenuItems(items)}
      </MenuSection>
    ));
  };

  return (
    <>
      <MenuWrapper className={isMobile ? (isOpen ? "open" : "closed") : ""}>
        <LogoWrapper id="logo">
          <img src={logo} alt="Logo" />
          <LogoName>Le Continental</LogoName>
        </LogoWrapper>
        {renderSidebar()}
        {isMobile && (
          <ToggleMenuButton onClick={() => setIsOpen((prev) => !prev)}>
            <FontAwesomeIcon icon={faBars} />
          </ToggleMenuButton>
        )}
      </MenuWrapper>
      
      {isMobile && !isOpen && (
        <MenuButton onClick={() => setIsOpen((prev) => !prev)}>
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>
      )}
    </>
  );
};

export default Sidebar;
