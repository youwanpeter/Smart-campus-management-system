import React, { useState } from "react";
import { Input, Form, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import "/src/Login.css";

const LoginForm = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("authToken", data.token);
        onLogin(data.token);
        message.success(data.message);
        window.location.href = "/";
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Form name="login" layout="vertical" onFinish={handleLogin}>
      <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]}>
        <Input placeholder="Enter your username" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        Login
      </Button>
    </Form>
  );
};
export default LoginForm;