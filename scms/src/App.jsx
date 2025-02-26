import React from "react";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
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
      </Sider>
      <Layout>
        <Header className="header"></Header>
        <Content className="content"></Content>
      </Layout>
    </Layout>
  );
};

export default App;
