import React from "react";
import { Row, Col, Button, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import bannerImage from "../../../assets/product 1.png"; // Replace with your image path

const { Title, Text } = Typography;

const Banner = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: "16px",
        padding: "40px",
        margin: "24px 0",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
        }}
      ></div>

      <Row align="middle" gutter={[24, 24]}>
        <Col xs={24} sm={24} md={14} lg={16}>
          <Title
            level={2}
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Discover Our <span style={{ color: "#1890ff" }}>Premium</span>{" "}
            Services
          </Title>
          <Text
            style={{
              fontSize: "1.1rem",
              display: "block",
              marginBottom: "24px",
              color: "#555",
            }}
          >
            Elevate your experience with our cutting-edge solutions designed to
            help you achieve your goals faster and more efficiently.
          </Text>
          <Button
            type="primary"
            size="large"
            shape="round"
            style={{
              padding: "0 30px",
              height: "48px",
              fontWeight: 600,
            }}
          >
            Get Started <ArrowRightOutlined />
          </Button>
        </Col>
        <Col xs={24} sm={24} md={10} lg={8}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={bannerImage}
              alt="Modern banner"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                transform: "rotate(3deg)",
                border: "5px solid white",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                right: "-20px",
                background: "#1890ff",
                color: "white",
                padding: "8px 16px",
                borderRadius: "50px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                transform: "rotate(-5deg)",
              }}
            >
              NEW!
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Banner;
