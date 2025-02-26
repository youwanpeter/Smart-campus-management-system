import React from "react";
import { Avatar, Flex, Typography } from "antd";
import Search from "antd/es/transfer/search";
import {
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";

const CustomHeader = () => {
  return (
    <Flex align="center" justify="space-between">
      <Typography.Title level={5} type="secondary">
        Welcome Back, Youwan
      </Typography.Title>

      <Flex align="center" gap="3rem">
        <Search placeholder="Search Dashboard" allowClear />

        <Flex align="center" gap="10px">
          <MessageOutlined className="header-icon" />
          <NotificationOutlined className="header-icon" />
          <Avatar icon={<UserOutlined />} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CustomHeader;
