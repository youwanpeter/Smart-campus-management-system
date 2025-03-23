import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Empty,
  Spin,
  Typography,
  message,
  Pagination,
  Space,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  FileImageOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

// Base URL for the API
const API_BASE_URL = "http://localhost:5000";

const Cardevent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamically adjust cards per row based on screen size
  const ResponsiveConfig = () => {
    // Extra small devices
    if (screenSize < 576) {
      return { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
    }
    // Small devices
    else if (screenSize >= 576 && screenSize < 768) {
      return { xs: 24, sm: 24, md: 12, lg: 12, xl: 8 };
    }
    // Medium devices
    else if (screenSize >= 768 && screenSize < 992) {
      return { xs: 24, sm: 12, md: 12, lg: 8, xl: 8 };
    }
    // Large devices and above
    else {
      return { xs: 24, sm: 12, md: 8, lg: 8, xl: 6 };
    }
  };

  // Fetch events on component mount
  const fetchEvents = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/events/all`)
      .then((response) => {
        console.log("Fetched events:", response.data);
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        message.error("Failed to fetch events");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to get the complete image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If the image path is already a full URL, return it
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Otherwise, append the base URL
    return `${API_BASE_URL}/${imagePath.replace(/^\//, "")}`;
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Adjust page size based on screen width
  useEffect(() => {
    if (screenSize < 768) {
      setPageSize(3); // Show fewer cards on mobile
    } else if (screenSize >= 768 && screenSize < 1200) {
      setPageSize(6); // Medium screens
    } else {
      setPageSize(8); // Large screens
    }
  }, [screenSize]);

  // Get current events for pagination
  const getCurrentEvents = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return events.slice(startIndex, endIndex);
  };

  // Render loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Render empty state
  if (events.length === 0) {
    return (
      <Empty description="No events found" style={{ margin: "50px auto" }} />
    );
  }

  const responsiveColConfig = getResponsiveConfig();

  return (
    <div
      className="event-cards-container"
      style={{ padding: screenSize < 576 ? "10px" : "20px" }}
    >
      <Title
        level={screenSize < 576 ? 3 : 2}
        style={{
          marginBottom: screenSize < 576 ? "15px" : "20px",
          textAlign: screenSize < 576 ? "center" : "left",
        }}
      >
        Events
      </Title>

      <Row
        gutter={[
          { xs: 8, sm: 16, md: 16, lg: 24 },
          { xs: 8, sm: 16, md: 16, lg: 24 },
        ]}
      >
        {getCurrentEvents().map((event) => (
          <Col
            key={event.event_id}
            {...responsiveColConfig}
            style={{ marginBottom: "16px" }}
          >
            <Card
              hoverable
              Style={{
                padding: screenSize < 576 ? "12px" : "24px",
                height: screenSize < 576 ? "auto" : "240px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              cover={
                <div
                  style={{
                    height: screenSize < 576 ? "150px" : "200px",
                    overflow: "hidden",
                    background: "#f5f5f5",
                    position: "relative",
                  }}
                >
                  {event.event_image ? (
                    <img
                      alt={event.event_name}
                      src={getImageUrl(event.event_image)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";

                        const parentDiv = e.target.parentNode;
                        const fallbackContent = document.createElement("div");
                        fallbackContent.style = `
                          width: 100%;
                          height: 100%;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          flex-direction: column;
                          color: #999;
                          background-color: #f5f5f5;
                        `;

                        const iconElement = document.createElement("div");
                        iconElement.innerHTML =
                          '<svg viewBox="64 64 896 896" focusable="false" data-icon="file-image" width="32px" height="32px" fill="currentColor" aria-hidden="true"><path d="M553.1 509.1l-77.8 99.2-41.1-52.4a8 8 0 00-12.6 0l-99.8 127.2a7.98 7.98 0 006.3 12.9H696c6.7 0 10.4-7.7 6.3-12.9l-136.5-174a8.1 8.1 0 00-12.7 0zM360 442a40 40 0 1080 0 40 40 0 10-80 0zm494.6-153.4L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"></path></svg>';

                        const textNode = document.createElement("div");
                        textNode.textContent = "No Image";
                        textNode.style = "margin-top: 8px; font-size: 14px;";

                        fallbackContent.appendChild(iconElement);
                        fallbackContent.appendChild(textNode);
                        parentDiv.appendChild(fallbackContent);
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "#999",
                      }}
                    >
                      <FileImageOutlined
                        style={{ fontSize: "32px", marginBottom: "8px" }}
                      />
                      No Image Available
                    </div>
                  )}

                  {/* Status badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      backgroundColor:
                        event.status === "Published"
                          ? "#52c41a"
                          : event.status === "Unpublished"
                          ? "#faad14"
                          : "#1890ff",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {event.status || "Pending"}
                  </div>
                </div>
              }
              style={{
                height: "100%",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
              }}
              className="event-card"
            >
              <div
                style={{
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Title
                  level={screenSize < 576 ? 5 : 4}
                  ellipsis={{ rows: 1 }}
                  style={{ marginBottom: "8px" }}
                >
                  {event.event_name}
                </Title>

                <Paragraph
                  ellipsis={{ rows: screenSize < 576 ? 1 : 2 }}
                  style={{
                    fontSize: screenSize < 576 ? "12px" : "14px",
                    marginBottom: "8px",
                  }}
                >
                  {event.event_description}
                </Paragraph>

                <Space
                  direction="vertical"
                  size="small"
                  style={{
                    marginBottom: "auto",
                    fontSize: screenSize < 576 ? "12px" : "14px",
                  }}
                >
                  <div>
                    <CalendarOutlined
                      style={{ marginRight: "8px", color: "#1890ff" }}
                    />
                    <Text style={{ fontSize: "inherit" }}>
                      {event.event_date
                        ? dayjs(event.event_date).format("YYYY-MM-DD HH:mm")
                        : "Date not specified"}
                    </Text>
                  </div>
                  <div>
                    <EnvironmentOutlined
                      style={{ marginRight: "8px", color: "#1890ff" }}
                    />
                    <Text
                      ellipsis
                      style={{
                        fontSize: "inherit",
                        maxWidth: "calc(100% - 24px)",
                      }}
                    >
                      {event.event_location || "Location not specified"}
                    </Text>
                  </div>
                  <div>
                    <UserOutlined
                      style={{ marginRight: "8px", color: "#1890ff" }}
                    />
                    <Text
                      ellipsis
                      style={{
                        fontSize: "inherit",
                        maxWidth: "calc(100% - 24px)",
                      }}
                    >
                      {event.organizer_name || "Organizer not specified"}
                    </Text>
                  </div>
                </Space>
              </div>

              <Button
                type="primary"
                icon={<EyeOutlined />}
                block
                size={screenSize < 576 ? "small" : "middle"}
                style={{ marginTop: "15px" }}
              >
                View Details
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={events.length}
          onChange={handlePageChange}
          showSizeChanger={false}
          size={screenSize < 768 ? "small" : "default"}
          responsive={true}
        />
      </div>
    </div>
  );
};

export default Cardevent;
