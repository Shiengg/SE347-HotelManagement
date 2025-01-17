import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MenuWrapper, MenuItem, MenuSection } from "./style";
import { 
  DashboardOutlined, 
  TeamOutlined, 
  UserOutlined,
  AppstoreOutlined, 
  CoffeeOutlined, 
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

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
            {renderMenuItem("/admin/rooms", <AppstoreOutlined />, "Rooms")}
          </MenuItem>
          <MenuItem>
            {renderMenuItem("/admin/restaurant", <CoffeeOutlined />, "Restaurant")}
          </MenuItem>
          <MenuItem>
            {renderMenuItem("/admin/bookings", <CalendarOutlined />, "Bookings")}
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

  // Return other role-specific sidebars or null
  return null;
};

export default Sidebar;
