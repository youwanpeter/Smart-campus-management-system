import { useState } from "react";
import React from "react";
import { Button, Layout, theme, Row, Col } from "antd";
import Sidebar from "./components/Sidebar";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import CustomHeader from "./components/Header";
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
import Login from "./Login"; 

const { Sider, Header, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Main Layout Routes */}
      <Route
        path="*"
        element={
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
              <Content
                className="content"
                style={{
                  margin: "24px 16px",
                  padding: 24,
                  minHeight: 280,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Row gutter={[16, 16]}>
                  {/* Page Routes */}
                  <Col span={24}>
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
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Layout>
        }
      />
    </Routes>
  </Router>
);
};

export default App;
