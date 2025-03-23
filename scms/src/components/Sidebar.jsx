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
