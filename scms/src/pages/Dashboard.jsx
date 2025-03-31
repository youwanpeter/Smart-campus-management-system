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
import { useLocation } from "react-router-dom";
import Banner from "./components/dashboard/Banner";

const Dashboard = () => {
  const [eventCount, setEventCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const location = useLocation();

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

  // Fetch the course count from the API
  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();
        setCourseCount(data.length); // Set the total count of events
      } catch (error) {
        console.error("Error fetching event count:", error);
      }
    };

    fetchCourseCount();
  }, []);

  return (
    <div style={{ padding: "2px" }}>
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
                <NotificationOutlined
                  style={{ fontSize: "30px", color: "rgb(255, 17, 0)" }}
                />
              </div>
            }
            variant="bordered"
            style={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              borderRadius: "16px",
            }}
          >
            <Row>
              <Col>
                <p>Total Events Assign</p>
              </Col>
              <Col
                style={{
                  marginLeft: "200px",
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
                <UserOutlined
                  style={{ fontSize: "30px", color: "rgb(23, 92, 27)" }}
                />
              </div>
            }
            variant="bordered"
            style={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              borderRadius: "16px",
            }}
          >
            <Row>
              <Col>
                <p>Total Users Assign</p>
              </Col>
              <Col
                style={{
                  marginLeft: "200px",
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
                <span>Total Courses</span>
                <FileDoneOutlined
                  style={{ fontSize: "30px", color: "rgb(17, 0, 255)" }}
                />
              </div>
            }
            variant="bordered"
            style={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              borderRadius: "16px",
            }}
          >
            <Row>
              <Col>
                <p>Total Courses Create</p>
              </Col>
              <Col
                style={{
                  marginLeft: "180px",
                  fontSize: "20px",
                  marginTop: "-5px",
                }}
              >
                <h3>{courseCount}</h3>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <div>
        <Row>
          <Col span={24}>
            <Banner />
          </Col>
        </Row>
      </div>

      <div style={{ marginTop: 20 }}>
        <Calendar />
      </div>
    </div>
  );
};

export default Dashboard;
