import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MenuWrapper, MenuItem, MenuSection } from "./style";
import { 
  DashboardOutlined,
  TeamOutlined,
  HomeOutlined,
  UserOutlined,
  AppstoreOutlined, 
  CoffeeOutlined, 
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  ShopOutlined
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const isReceptionist = currentUser?.role === 'receptionist';
  const isCustomer = currentUser?.role === 'customer';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 680);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log('Current user:', currentUser);
  console.log('Is admin:', isAdmin);

  const renderMenuItem = (to, icon, text) => {
    const content = (
      <NavLink to={to} className={({ isActive }) => (isActive ? "active" : "")}>
        {icon}
        <span className="text">{text}</span>
      </NavLink>
    );

    return isMobile ? (
      <Tooltip title={text} placement="right">
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  if (isAdmin) {
    return (
      <MenuWrapper>
        <MenuSection>
          <h3 className="section-title">Overview</h3>
          <MenuItem>
            {renderMenuItem("/admin/dashboard", <DashboardOutlined />, "Dashboard")}
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3 className="section-title">People Management</h3>
          <MenuItem>
            {renderMenuItem("/admin/employees", <TeamOutlined />, "Employees")}
          </MenuItem>
          <MenuItem>
            {renderMenuItem("/admin/guests", <UserOutlined />, "Guests")}
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3 className="section-title">Operations</h3>
          <MenuItem>
            {renderMenuItem("/admin/bookings", <CalendarOutlined />, "Bookings")}
          </MenuItem>
          <MenuItem>
            {renderMenuItem("/admin/rooms", <AppstoreOutlined />, "Rooms")}
          </MenuItem>
          <MenuItem>
            {renderMenuItem("/admin/restaurant", <CoffeeOutlined />, "Restaurant")}
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3 className="section-title">Finance</h3>
          <MenuItem>
            {renderMenuItem("/admin/invoices", <FileTextOutlined />, "Invoices")}
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3 className="section-title">System</h3>
          <MenuItem>
            {renderMenuItem("/admin/settings", <SettingOutlined />, "Settings")}
          </MenuItem>
        </MenuSection>
      </MenuWrapper>
    );
  }

  if (isReceptionist) {
    return (
      <MenuWrapper>
        <MenuSection>
          <h3 className="section-title">Overview</h3>
          <MenuItem>
            {renderMenuItem("/receptionist/dashboard", <DashboardOutlined />, "Dashboard")}
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3 className="section-title">Guest Management</h3>
          <MenuItem>
            {renderMenuItem("/receptionist/guests", <UserOutlined />, "Guests")}
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3 className="section-title">Operations</h3>
          <MenuItem>
            {renderMenuItem("/receptionist/bookings", <CalendarOutlined />, "Bookings")}
          </MenuItem>
          <MenuItem>
            {renderMenuItem("/receptionist/rooms", <AppstoreOutlined />, "Rooms")}
          </MenuItem>
          <MenuItem>
            {renderMenuItem("/receptionist/restaurant", <CoffeeOutlined />, "Restaurant")}
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3 className="section-title">Finance</h3>
          <MenuItem>
            {renderMenuItem("/receptionist/invoices", <FileTextOutlined />, "Invoices")}
          </MenuItem>
        </MenuSection>
      </MenuWrapper>
    );
  }

  if (isCustomer) {
    return (
      <MenuWrapper>
        <MenuSection>
          <h3 className="section-title">Overview</h3>
          <MenuItem>
            {renderMenuItem("/customer/dashboard", <HomeOutlined />, "Dashboard")}
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3 className="section-title">Services</h3>
          <MenuItem>
            {renderMenuItem("/customer/booking", <CalendarOutlined />, "Booking")}
          </MenuItem>
          <MenuItem>
            {renderMenuItem("/customer/rooms", <ShopOutlined />, "Rooms")}
          </MenuItem>
          <MenuItem>
            {renderMenuItem("/customer/restaurant", <CoffeeOutlined />, "Restaurant")}
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <h3 className="section-title">Personal</h3>
          <MenuItem>
            {renderMenuItem("/customer/invoice", <FileTextOutlined />, "Invoice")}
          </MenuItem>
          <MenuItem>
            {renderMenuItem("/customer/profile", <UserOutlined />, "Profile")}
          </MenuItem>
        </MenuSection>
      </MenuWrapper>
    );
  }

  // Return other role-specific sidebars or null
  return null;
};

export default Sidebar;
