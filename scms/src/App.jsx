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
import { MenuUnfoldOutlined, LogoutOutlined } from "@ant-design/icons";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Schedule from "./pages/Schedule";
import Events from "./pages/Events";
import Previewevent from "./pages/Previewevent";
import Resource from "./pages/Resource";
import Communication from "./pages/Communication";
import LecturerView from "./pages/lecturerView";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import Login from "./Login";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import CourseList from "./pages/Courses/CourseList.jsx";
import Subjects from "./pages/Subjects";
import CreateCourse from "./pages/Courses/CreateCourse.jsx";
import Task from "./pages/Task.jsx";

const { Sider, Header, Content, Footer } = Layout;

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4f6f52",
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      axios
        .get("/api/auth/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
        .then((res) => setCurrentUser(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

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
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sider"
      >
        <Sidebar userRole={userRole} />
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={toggleCollapse}
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
                <Route path="/task" element={<Task />} />
                <Route path="/subjects" element={<Subjects />} />
<<<<<<< HEAD
=======
                <Route path="/communication" element={<Communication />} />
                <Route path="/files" element={<LecturerView />} />
>>>>>>> 9d2582f4fb93be3a8315642bbb81386b3d45422a
                {userRole !== "Admin" && userRole !== "Lecturer" && (
                  <Route path="/communication" element={<Communication />} />
                )}
                {userRole !== "Admin" && userRole !== "Student" && (
                  <Route path="/student-files" element={<LecturerView />} />
                )}
<<<<<<< HEAD
                <Route path="/reports" element={<Reports />} />
=======

                <Route path="/logout" element={<Logout />} />
>>>>>>> 9d2582f4fb93be3a8315642bbb81386b3d45422a

                <Route path="/users" element={<Navigate to="/" replace />} />
                <Route path="/resource" element={<Navigate to="/" replace />} />
                <Route
                  path="/student-file"
                  element={<Navigate to="/" replace />}
                />
                <Route
                  path="/communication"
                  element={<Navigate to="/" replace />}
                />
              </Routes>
            </Col>
          </Row>
        </Content>
        <Footer style={footerStyle}>
          Design and Developed By <b>Si Media Labs</b>
        </Footer>
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
