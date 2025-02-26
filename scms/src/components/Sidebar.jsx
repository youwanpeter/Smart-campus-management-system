import { Flex, Menu } from "antd";
import React from "react";
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
} from "@ant-design/icons";

const Sidebar = () => {
  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <FaLeaf />
        </div>
      </Flex>

      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        className="menu-bar"
        items={[
          {
            key: "1",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
          {
            key: "2",
            icon: <UserOutlined />,
            label: "Users",
          },
          {
            key: "3",
            icon: <ScheduleOutlined />,
            label: "Schedule",
          },
          {
            key: "4",
            icon: <NotificationOutlined />,
            label: "Events",
          },
          {
            key: "5",
            icon: <BookOutlined />,
            label: "Resource",
          },
          {
            key: "6",
            icon: <WechatOutlined />,
            label: "Communication ",
          },
          {
            key: "7",
            icon: <FileTextOutlined />,
            label: "Reports ",
          },
          {
            key: "8",
            icon: <SettingOutlined />,
            label: "Settings",
          },
          {
            key: "9",
            icon: <LogoutOutlined />,
            label: "LogOut",
          },
        ]}
      />
    </>
  );
};

export default Sidebar;
