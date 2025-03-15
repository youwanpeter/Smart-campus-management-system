import React, { useState, useEffect } from "react";
import { useNavigate, Navigate, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Button, Layout, Row, Col } from "antd";
import Sidebar from "./components/Sidebar";
import CustomHeader from "./components/Header";
import { MenuUnfoldOutlined } from "@ant-design/icons";
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
import * as jwtDecode from "jwt-decode";
import "./App.css";

const { Sider, Header, Content } = Layout;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //checking if the token is available and not expired
  const checkAuth = () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; 

        if (decoded.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
  }, [isAuthenticated]);

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  const AuthenticatedLayout = () => (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" trigger={null} collapsible className="sider">
        <Sidebar />
        <Button
          type="text"
          icon={<MenuUnfoldOutlined />}
          onClick={handleLogout}
          className="trigger-btn"
        />
      </Sider>

      <Layout>
        <Header className="header">
          <CustomHeader />
        </Header>

        <Content className="content" style={{ margin: "24px 16px", padding: 24 }}>
          <Row gutter={[16, 16]}>
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
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/*" element={isAuthenticated ? <AuthenticatedLayout /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
