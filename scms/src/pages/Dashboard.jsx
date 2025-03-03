import React from "react";
import { Card, Col, Row } from "antd";
import {
  HomeOutlined,
  AppstoreAddOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import "./Dashboard.css";
import Graphs from "./components/Graphs";

const Dashboard = () => {
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
                <span>Card 1</span>
                <HomeOutlined style={{ fontSize: "20px" }} />
              </div>
            }
            variant="bordered"
            style={{ backgroundColor: "#f0f2f5" }}
          >
            <p>Content of Card 1</p>
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
                <span>Card 2</span>
                <AppstoreAddOutlined style={{ fontSize: "20px" }} />
              </div>
            }
            variant="bordered"
            style={{ backgroundColor: "#f0f2f5" }}
          >
            <p>Content of Card 2</p>
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
      <Graphs />
    </div>
  );
};

export default Dashboard;
