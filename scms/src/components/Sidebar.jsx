import { Flex, Menu } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaLeaf } from "react-icons/fa6";
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
  FileOutlined,
} from "@ant-design/icons";

const Sidebar = ({ userRole }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    ...(userRole !== "Lecturer" && userRole !== "Student"
      ? [
        {
          key: "/users",
          icon: <UserOutlined />,
          label: <Link to="/users">Users</Link>,
        },
      ]
      : []),
    {
      key: "/courses",
      icon: <ScheduleOutlined />,
      label: <Link to="/courses">Courses</Link>,
    },
    {
      key: "/schedule",
      icon: <ScheduleOutlined />,
      label: <Link to="/schedule">Schedule</Link>,
    },
    ...(userRole !== "Lecturer" && userRole !== "Student"
      ? [
        {
          key: "/events",
          icon: <UserOutlined />,
          label: <Link to="/events">Events</Link>,
        },
      ]
      : []),

    ...(userRole !== "Student"
      ? [
        {
          key: "/resource",
          icon: <BookOutlined />,
          label: <Link to="/resource">Resource</Link>,
        },
      ]
      : []),

    ...(userRole !== "Admin"
      ? [
        {
          key: "/previewevent",
          icon: <BookOutlined />,
          label: <Link to="/previewevent">Events</Link>,
        },
      ]
      : []),

    ...(userRole !== "Admin" && userRole !== "Lecturer"
      ? [
        {
          key: "/communication",
          icon: <WechatOutlined />,
          label: <Link to="/communication">Communication</Link>,
        },
      ]
      : []),
    ...(userRole !== "Admin" && userRole !== "Student"
      ? [
        {
          key: "/student-files",
          icon: <FileOutlined />,
          label: <Link to="/student-files">Student Files</Link>,
        },
      ]
      : []),
    {
      key: "/subjects",
      icon: <ScheduleOutlined />,
      label: <Link to="/subjects">Subjects</Link>,
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
