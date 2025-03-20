import React, { useState, useEffect } from "react";
import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Button, Layout, Row, Col, theme } from "antd";
import Sidebar from "./components/Sidebar";
import CustomHeader from "./components/CustomHeader";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Schedule from "./pages/Schedule";
import Events from "./pages/Events";
import Previewevent from "./pages/Previewevent";
import Resource from "./pages/Resource";
import Communication from "./pages/Communication";
import LecturerView from "./pages/lecturerView";
import Logout from "./pages/Logout";
import Login from "./Login";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import CourseList from "./pages/Courses/CourseList.jsx";
import Subjects from "./pages/Subjects";
import CreateCourse from "./pages/Courses/CreateCourse.jsx";

const { Sider, Header, Content } = Layout;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [userRole, setUserRole] = useState(null);
  //Check authentication on mount and whenever auth state changes
  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, []);

  //Function to check if token exists and is valid
  const checkAuth = () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setIsAuthenticated(true);
          setUserRole(decoded.role);
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

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    window.location.href = "/";
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  const App = () => {
    return (
      <div>
        <CustomHeader />
        {/* Add other components or content here */}
      </div>
    );
  };

  const AuthenticatedLayout = () => (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" trigger={null} collapsible className="sider">
        <Sidebar userRole={userRole} />{" "}
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
            <Col span={24}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                {userRole !== "Lecturer" && userRole !== "Student" && (
                  <Route path="/users" element={<Users />} />
                )}
                <Route path="/schedule" element={<Schedule />} />
                {userRole !== "Lecturer" && userRole !== "Student" && (
                  <Route path="/events" element={<Events />} />
                )}

                {userRole !== "Student" && (
                  <Route path="/resource" element={<Resource />} />
                )}
                {userRole !== "Admin" && (
                  <Route path="/previewevent" element={<Previewevent />} />
                )}

                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/create" element={<CreateCourse />} />
                <Route path="/subjects" element={<Subjects />} />
<<<<<<< HEAD
                <Route path="/communication" element={<Communication />} />
                <Route path="/files" element={<LecturerView />} />
=======
                {userRole !== "Admin" && userRole !== "Lecturer" && (
                  <Route path="/communication" element={<Communication />} />
                )}
                {userRole !== "Admin" && userRole !== "Student" && (
                  <Route path="/student-files" element={<LecturerView />} />
                )}
                <Route path="/reports" element={<Reports />} />
<<<<<<< HEAD
=======
                <Route path="/settings" element={<Settings />} />
>>>>>>> 13b0c815956a74c6db89e1ee316c4f866ec7f422
                <Route path="/logout" element={<Logout />} />
>>>>>>> e1e5c684f0295eed4576266ea5ef2a61ce7eea2f

                <Route path="/users" element={<Navigate to="/" replace />} />
                <Route path="/resource" element={<Navigate to="/" replace />} />
                <Route path="/student-file" element={<Navigate to="/" replace />} />
                <Route path="/communication" element={<Navigate to="/" replace />} />

              </Routes>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <AuthenticatedLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
