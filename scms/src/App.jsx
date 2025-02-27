import { useState } from "react";
import React from "react";
import { Button, Flex, Layout } from "antd";
import Sidebar from "./components/Sidebar";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import CustomHeader from "./components/Header";
import MainContent from "./components/MainContent";
import SideContent from "./components/SideContent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Schedule from "./pages/Schedule";
import Events from "./pages/Events";
import Resource from "./pages/Resource";
import Communication from "./pages/Communication";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";

const { Sider, Header, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
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
            onClick={() => setCollapsed(!collapsed)}
            className="triger-btn"
          />
        </Sider>

        {/* Main Layout */}
        <Layout>
          {/* Header */}
          <Header className="header">
            <CustomHeader />
          </Header>

          {/* Main Content */}
          <Content className="content">
            <Flex>
              {/* Page Routes */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/events" element={<Events />} />
                <Route path="/resource" element={<Resource />} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </Flex>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
