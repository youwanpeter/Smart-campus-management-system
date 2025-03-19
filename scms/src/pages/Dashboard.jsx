import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import {
  NotificationOutlined,
  UserOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import "../css/Dashboard.css";
import Graphs from "./components/dashboard/Graphs";
import Calendar from "./components/dashboard/Calendar";

const Dashboard = () => {
  const [eventCount, setEventCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  // Fetch the event count from the API
  useEffect(() => {
    const fetchEventCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events/all");
        const data = await response.json();
        setEventCount(data.length); // Set the total count of events
      } catch (error) {
        console.error("Error fetching event count:", error);
      }
    };

    fetchEventCount();
  }, []);

  // Fetch the users count from the API
  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/");
        const data = await response.json();
        setUsersCount(data.length); // Set the total count of events
      } catch (error) {
        console.error("Error fetching event count:", error);
      }
    };

    fetchUsersCount();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="card"
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Total Events </span>
                <NotificationOutlined style={{ fontSize: "20px" }} />
              </div>
            }
            variant="bordered"
            style={{ backgroundColor: "#f0f2f5" }}
          >
            <Row>
              <Col>
                <p>Total Events Assign</p>
              </Col>
              <Col
                style={{
                  marginLeft: "90px",
                  fontSize: "20px",
                  marginTop: "-5px",
                }}
              >
                <h3>{eventCount}</h3>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="card"
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Total Users</span>
                <UserOutlined style={{ fontSize: "20px" }} />
              </div>
            }
            variant="bordered"
            style={{ backgroundColor: "#f0f2f5" }}
          >
            <Row>
              <Col>
                <p>Total Users Assign</p>
              </Col>
              <Col
                style={{
                  marginLeft: "100px",
                  fontSize: "20px",
                  marginTop: "-5px",
                }}
              >
                <h3>{usersCount}</h3>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="card"
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Card 3</span>
                <FileDoneOutlined style={{ fontSize: "20px" }} />
              </div>
            }
            variant="bordered"
            style={{ backgroundColor: "#f0f2f5" }}
          >
            <p>Content of Card 3</p>
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: 20 }}>
        <Calendar />
      </div>

      <Graphs />
    </div>
  );
};

export default Dashboard;
