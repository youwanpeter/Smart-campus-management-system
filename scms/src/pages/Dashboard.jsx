import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import {
  NotificationOutlined,
  UserOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
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
  const [taskCount, setTasksCount] = useState(0);
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

  // Fetch the course count from the API
  useEffect(() => {
    const fetchTasksCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks");
        const data = await response.json();
        setTasksCount(data.length); // Set the total count of events
      } catch (error) {
        console.error("Error fetching event count:", error);
      }
    };

    fetchTasksCount();
  }, []);

  return (
    <div style={{ padding: "2px" }}>
      <Row gutter={[16, 16]}>
        {/* First Row */}
        <Col xs={24} sm={12} md={6}>
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
                <span>Total Events</span>
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
            <Row justify="space-between" align="middle">
              <Col>
                <p style={{ margin: 0, fontSize: "16px", color: "#555" }}>
                  Events Assigned
                </p>
              </Col>
              <Col>
                <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
                  {eventCount}
                </h3>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
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
            <Row justify="space-between" align="middle">
              <Col>
                <p style={{ margin: 0, fontSize: "16px", color: "#555" }}>
                  Users Registered
                </p>
              </Col>
              <Col>
                <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
                  {usersCount}
                </h3>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Second Row */}
        <Col xs={24} sm={12} md={6}>
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
                  style={{ fontSize: "30px", color: "rgb(13, 11, 155)" }}
                />
              </div>
            }
            variant="bordered"
            style={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              borderRadius: "16px",
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <p style={{ margin: 0, fontSize: "16px", color: "#555" }}>
                  Courses Created
                </p>
              </Col>
              <Col>
                <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
                  {courseCount}
                </h3>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
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
                <span>Total Tasks</span>
                <CheckCircleOutlined
                  style={{ fontSize: "30px", color: "rgb(155, 140, 11)" }}
                />
              </div>
            }
            variant="bordered"
            style={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              borderRadius: "16px",
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <p style={{ margin: 0, fontSize: "16px", color: "#555" }}>
                  Tasks Completed
                </p>
              </Col>
              <Col>
                <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
                  {taskCount}
                </h3>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 20 }}>
        <Calendar />
      </div>
      <div>
        <Row>
          <Col span={24}>
            <Banner />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
