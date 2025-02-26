import { useState } from "react";
import React from "react";
import { Button, Layout } from "antd";
import Sidebar from "./components/Sidebar";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import CustomHeader from "./components/Header";
import "./App.css";

const { Sider, Header, Content } = Layout;
const App = () => {
  const [collapsed, setcollapsed] = useState(false);
  return (
    <Layout>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sider"
      >
        <Sidebar />

        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setcollapsed(!collapsed)}
          className="triger-btn"
        />
      </Sider>
      <Layout>
        <Header className="header">
          <CustomHeader />
        </Header>
        <Content className="content"></Content>
      </Layout>
    </Layout>
  );
};

export default App;
