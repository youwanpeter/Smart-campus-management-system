import { Flex, Menu } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaLeaf } from "react-icons/fa6";
import {
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
  ScheduleOutlined,
  BookOutlined,
  WechatOutlined,
  FileDoneOutlined,
  ReadOutlined,
  HomeOutlined,
  CompassOutlined,
  ContactsOutlined,
} from "@ant-design/icons";

const Sidebar = ({ userRole }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
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
      icon: <ReadOutlined />,
      label: <Link to="/courses">Courses</Link>,
    },
    {
      key: "/subjects",
      icon: <ContactsOutlined />,
      label: <Link to="/subjects">Subjects</Link>,
    },
    ...(userRole !== "Admin" && userRole !== "Student"
      ? [
        {
          key: "/student-files",
          icon: <FileDoneOutlined />,
          label: <Link to="/student-files">Student Files</Link>,
        },
      ]
      : []),
<<<<<<< HEAD
      ...(userRole !== "Admin" && userRole !== "Lecturer"
        ? [
          {
            key: "/communication",
            icon: <WechatOutlined />,
            label: <Link to="/communication">Communication</Link>,
          },
        ]
        : []),
      ...(userRole !== "Student"
        ? [
          {
            key: "/resource",
            icon: <CompassOutlined />,
            label: <Link to="/resource">Resource</Link>,
          },
        ]
        : []),
    ...(userRole !== "Lecturer" && userRole !== "Student"
      ? [
        {
          key: "/events",
          icon: <ScheduleOutlined />,
          label: <Link to="/events">Events</Link>,
        },
      ]
      : []),
    ...(userRole !== "Admin"
      ? [
        {
          key: "/previewevent",
          icon: <ScheduleOutlined />,
          label: <Link to="/previewevent">Events</Link>,
        },
      ]
      : []),
=======
    {
<<<<<<< HEAD
      key: "/communication",
      icon: <WechatOutlined />,
      label: <Link to="/communication">Communication</Link>,
    },
    {
      key: "/files",
      icon: <WechatOutlined />,
      label: <Link to="/files">File</Link>,
    },
    {
      key: "/subjects",
      icon: <ScheduleOutlined />,
      label: <Link to="/subjects">Subjects</Link>,
=======
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
>>>>>>> 13b0c815956a74c6db89e1ee316c4f866ec7f422
    },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: <Link to="/logout">LogOut</Link>,
    },
>>>>>>> e1e5c684f0295eed4576266ea5ef2a61ce7eea2f
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
