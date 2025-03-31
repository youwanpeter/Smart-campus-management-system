import React, { useState } from "react";
import {
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  Upload,
  Dropdown,
  List,
  Typography,
} from "antd";
import Search from "antd/es/transfer/search";
import {
  UserOutlined,
  UploadOutlined,
  NotificationOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const CustomHeader = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    "You have a new assessment.",
    "Your profile was updated successfully.",
    "Special meeting is scheduled for tomorrow at 12.00PM.",
  ]);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Saved Profile Data: ", values);
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error("Validation Error: ", error);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const notificationContent = (
    <div className="custom-notification-popup">
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item className="custom-notification-item">{item}</List.Item>
        )}
      />
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "02px",
        gap: "10px",
        backgroundColor: "#fff",
        align: "center",
        width: "100%",
      }}
    >
      <Search placeholder="Search Dashboard" allowclear />
      <Dropdown
        menu={notificationContent}
        trigger={["click"]}
        menuStyle={{
          maxWidth: "600px",
          borderRadius: "16px",
          boxShadow: "2 8px 24px rgba(25, 6, 134, 0.7)",
          padding: "0px",
          backgroundColor: "#fff",
          fontStyle: "italic",
        }}
      >
        <Button
          type=""
          className="header-icon"
          icon={<NotificationOutlined style={{ cursor: "pointer" }} />}
        />
      </Dropdown>

      <Button
        type=""
        className="header-icon"
        onClick={showModal}
        icon={<UserOutlined />}
        style={{ cursor: "pointer" }}
      ></Button>

      <Button
        type=""
        className="header-icon"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{ cursor: "pointer" }}
      />

      <Modal
        title="My Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="Vertical"
          initialValues={{
            salutation: "Mr.",
          }}
        >
          <Form.Item label="Profile Picture">
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            <Button danger style={{ marginTop: "10px", marginBottom: "10px" }}>
              Remove
            </Button>
          </Form.Item>
          <Form.Item
            name="salutation"
            label="Title"
            rules={[{ required: true, message: "Please select a title" }]}
          >
            <Radio.Group>
              <Radio value="Mr.">Mr.</Radio>
              <Radio value="Mrs.">Mrs.</Radio>
              <Radio value="Ms.">Ms.</Radio>
              <Radio value="Rev.">Rev.</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          >
            <DatePicker style={{ width: "75%" }} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Contact Number"
            rules={[
              { required: true, message: "Please enter your contact number" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomHeader;
