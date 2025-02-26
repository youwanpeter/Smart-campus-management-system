import { Flex, Menu } from "antd";
import React from "react";
import { FaLeaf } from "react-icons/fa6";

const Sidebar = () => {
  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <FaLeaf />
        </div>
      </Flex>

      <Menu></Menu>
    </>
  );
};

export default Sidebar;
