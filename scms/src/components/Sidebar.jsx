import { Flex, Menu } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaLeaf } from "react-icons/fa6"; // ✅ Import the logo icon
import {
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  ScheduleOutlined,
  NotificationOutlined,
  BookOutlined,
  WechatOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: "/schedule",
      icon: <ScheduleOutlined />,
      label: <Link to="/schedule">Schedule</Link>,
    },
    {
      key: "/events",
      icon: <NotificationOutlined />,
      label: <Link to="/events">Events</Link>,
    },
    {
      key: "/resource",
      icon: <BookOutlined />,
      label: <Link to="/resource">Resource</Link>,
    },
    {
      key: "/communication",
      icon: <WechatOutlined />,
      label: <Link to="/communication">Communication</Link>,
    },
    {
      key: "/reports",
      icon: <FileTextOutlined />,
      label: <Link to="/reports">Reports</Link>,
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: <Link to="/logout">LogOut</Link>,
    },
  ];

  return (
    <>
      {/* ✅ Add Logo Here */}
      <Flex align="center" justify="center" style={{ padding: "10px" }}>
        <div className="logo">
          <FaLeaf size={30} color="#2c3e50" /> {/* Customize size and color */}
        </div>
      </Flex>

      {/* Sidebar Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="menu-bar"
        items={menuItems}
      />
    </>
  );
};

export default Sidebar;
