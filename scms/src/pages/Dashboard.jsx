import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import {
  NotificationOutlined,
  UserOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import "../css/Dashboard.css";
import Graphs from "./components/dashboard/Graphs";
import Calendar from "./components/dashboard/Calendar";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [eventCount, setEventCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    const fetchEventCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events/all");
        const data = await response.json();
        setEventCount(data.length);
      } catch (error) {
        console.error("Error fetching event count:", error);
      }
    };
    fetchEventCount();
  }, []);

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/");
        const data = await response.json();
        setUsersCount(data.length);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    fetchUsersCount();
  }, []);

  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();
        setCourseCount(data.length);
      } catch (error) {
        console.error("Error fetching course count:", error);
      }
    };
    fetchCourseCount();
  }, []);

  return (
    <div style={{ padding: "2px" }}>
      <Title level={2}>Welcome...</Title>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="card" bordered style={{ backgroundColor: "#f0f2f5" }}>
            <Row align="middle" justify="space-between">
              <Text strong>Total Events</Text>
              <NotificationOutlined style={{ fontSize: "24px" }} />
            </Row>
            <Title level={3} style={{ marginTop: 8 }}>{eventCount}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="card" bordered style={{ backgroundColor: "#f0f2f5" }}>
            <Row align="middle" justify="space-between">
              <Text strong >Total Users</Text>
              <UserOutlined style={{ fontSize: "24px" }} />
            </Row>
            <Title level={3} style={{ marginTop: 8 }}>{usersCount}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="card" bordered style={{ backgroundColor: "#f0f2f5" }}>
            <Row align="middle" justify="space-between">
              <Text strong>Total Courses</Text>
              <FileDoneOutlined style={{ fontSize: "24px" }} />
            </Row>
            <Title level={3} style={{ marginTop: 8 }}>{courseCount}</Title>
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: 16 }}>
        <Calendar />
      </div>
    </div>
  );
};

export default Dashboard;
