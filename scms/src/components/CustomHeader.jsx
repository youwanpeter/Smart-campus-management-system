import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Modal,
  Dropdown,
  List,
  Typography,
  message,
  Tag,
  Card,
  Divider,
  Badge
} from "antd";
import Search from "antd/es/transfer/search";
import {
  UserOutlined,
  NotificationOutlined,
  LogoutOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Text, Title } = Typography;

const CustomHeader = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    "You have a new assessment.",
    "Your profile was updated successfully.",
    "Special meeting is scheduled for tomorrow at 12.00PM.",
  ]);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Get the auth token from localStorage or sessionStorage
      const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!authToken) {
        // Redirect to login if not authenticated
        window.location.href = "/login";
        return;
      }

      // Try different methods to get the user info

      // Method 1: Try to get user ID from localStorage/sessionStorage
      const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId") || localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

      // Method 2: If we have a userId, use it to fetch the specific user
      if (userId) {
        try {
          const response = await axios.get(`/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          });

          setUserData(response.data);
          setLoading(false);
          return;
        } catch (err) {
          console.log("Couldn't fetch by ID, trying alternative methods...");
          // If this fails, continue to the next method
        }
      }

      // Method 3: Get the current user's data via a /me or /profile endpoint
      try {
        const response = await axios.get(`/api/users/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        setUserData(response.data);
        setLoading(false);
        return;
      } catch (err) {
        console.log("Couldn't fetch from /me endpoint, trying next method...");
        // If this fails, continue to the next method
      }

      // Method 4: Get all users and find the current one
      // This is less efficient but might work if the API supports it
      const response = await axios.get(`/api/users`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      // If we have a userId, use it to find the user
      if (userId && response.data && Array.isArray(response.data)) {
        const currentUser = response.data.find(user => user.id === userId || user._id === userId);

        if (currentUser) {
          setUserData(currentUser);
          setLoading(false);
          return;
        }
      }

      // If we still don't have a user, use the first one (only as a fallback for development)
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setUserData(response.data[0]);

        // Store this userId for future use
        if (response.data[0].id) {
          localStorage.setItem("userId", response.data[0].id);
        } else if (response.data[0]._id) {
          localStorage.setItem("userId", response.data[0]._id);
        }

        setLoading(false);
        return;
      }

      // If we reach here, we couldn't get user data
      message.warning("Could not retrieve user details. Please try logging in again.");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to load user profile");
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const notificationContent = (
      <div className="custom-notification-popup" style={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <Text strong>Notifications</Text>
          {notifications.length > 0 && (
              <Badge count={notifications.length} style={{ marginLeft: 8 }} />
          )}
        </div>
        <List
            dataSource={notifications}
            renderItem={(item, index) => (
                <List.Item className="custom-notification-item" style={{ padding: '10px 16px' }}>
                  <List.Item.Meta
                      avatar={<NotificationOutlined style={{ color: '#1890ff' }} />}
                      title={<Text>{item}</Text>}
                      description={<Text type="secondary">{moment().subtract(index, 'hours').fromNow()}</Text>}
                  />
                </List.Item>
            )}
            locale={{ emptyText: "No notifications" }}
        />
      </div>
  );

  // User dropdown menu content
  const userDropdownContent = (
      <div style={{ width: 180 }}>
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
          {userData && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {userData.profilePicture ? (
                      <Avatar src={userData.profilePicture} size="small" />
                  ) : (
                      <Avatar icon={<UserOutlined />} size="small" />
                  )}
                  <div>
                    <Text strong>{userData.name}</Text>
                    <div>
                      <Tag color={userData.role === "Admin" ? "red" : "blue"}>
                        {userData.role}
                      </Tag>
                    </div>
                  </div>
                </div>
              </>
          )}
        </div>
        <div style={{ padding: '8px 0' }}>
          <Button type="text" block onClick={showModal} style={{ textAlign: 'left' }}>
            View Profile
          </Button>
          <Button type="text" block onClick={handleLogout} icon={<LogoutOutlined />} style={{ textAlign: 'left' }}>
            Log Out
          </Button>
        </div>
      </div>
  );

  return (
      <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px",
            gap: "10px",
            backgroundColor: "#fff",
            alignItems: "center",
            width: "100%",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Search placeholder="Search Dashboard" allowClear style={{ width: 250 }} />
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "15px" }}>
          {userData && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text style={{ marginRight: "5px" }}>
                  Welcome, {userData.salutation ? userData.salutation + " " : ""}
                  <Text strong>{userData.name}</Text>
                </Text>
                {userData.role && (
                    <Tag color={userData.role === "Admin" ? "red" : "blue"}>
                      {userData.role}
                    </Tag>
                )}
              </div>
          )}

          <Dropdown
              overlay={notificationContent}
              trigger={["click"]}
              placement="bottomRight"
          >
            <Badge count={notifications.length} size="small">
              <Button
                  type="text"
                  className="header-icon"
                  icon={<NotificationOutlined style={{ fontSize: '18px' }} />}
              />
            </Badge>
          </Dropdown>

          <Dropdown
              overlay={userDropdownContent}
              trigger={["click"]}
              placement="bottomRight"
          >
            <Button
                type="text"
                className="header-icon"
                icon={
                  userData?.profilePicture ? (
                      <Avatar src={userData.profilePicture} size="small" />
                  ) : (
                      <Avatar icon={<UserOutlined />} size="small" />
                  )
                }
                style={{ cursor: "pointer" }}
            />
          </Dropdown>
        </div>

        <Modal
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IdcardOutlined />
                <span>User Profile</span>
              </div>
            }
            open={isModalVisible}
            onCancel={handleCancel}
            width={600}
            footer={[
              <Button key="close" onClick={handleCancel}>
                Close
              </Button>
            ]}
        >
          {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Loading user data...
              </div>
          ) : userData ? (
              <div className="profile-container">
                <Card bordered={false}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    {userData.profilePicture ? (
                        <Avatar
                            src={userData.profilePicture}
                            size={100}
                        />
                    ) : (
                        <Avatar
                            icon={<UserOutlined />}
                            size={100}
                            style={{ backgroundColor: '#1890ff' }}
                        />
                    )}
                    <Title level={4} style={{ marginTop: '16px', marginBottom: '4px' }}>
                      {userData.salutation ? userData.salutation + " " : ""}
                      {userData.name}
                    </Title>
                    <Tag color={userData.role === "Admin" ? "red" : "blue"} style={{ marginBottom: '8px' }}>
                      {userData.role}
                    </Tag>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      {userData.email && (
                          <Button type="text" icon={<MailOutlined />} size="small">
                            {userData.email}
                          </Button>
                      )}
                      {userData.phone && (
                          <Button type="text" icon={<PhoneOutlined />} size="small">
                            {userData.phone}
                          </Button>
                      )}
                    </div>
                  </div>

                  <Divider orientation="left">Personal Information</Divider>

                  <List
                      itemLayout="horizontal"
                      dataSource={[
                        {
                          label: "ID",
                          value: userData.id || "Not available"
                        },
                        {
                          label: "Username",
                          value: userData.username || "Not available"
                        },
                        {
                          label: "Date of Birth",
                          value: userData.dob ? moment(userData.dob).format('MMMM D, YYYY') : "Not provided"
                        },
                        {
                          label: "Address",
                          value: userData.address || "Not provided"
                        },
                        {
                          label: "Last Login",
                          value: moment().subtract(2, 'hours').format('MMMM D, YYYY, h:mm A') // Example value
                        }
                      ]}
                      renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                                title={item.label}
                                description={<Text>{item.value}</Text>}
                            />
                          </List.Item>
                      )}
                  />
                </Card>
              </div>
          ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                No user data available
              </div>
          )}
        </Modal>
      </div>
  );
};

export default CustomHeader;