<<<<<<< HEAD
import React, { useState } from "react";
import { Input, Form, Button, message } from "antd";
=======
import React, { useState } from 'react';
import { Input, Form, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
>>>>>>> 2b49090027b5e0cfff0e30fa98705acbc5464837
import "/src/Login.css";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.status === 200) {
        message.success(data.message);
        navigate("/");
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
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input placeholder="Enter your username" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

<<<<<<< HEAD
      <Button type="primary" htmlType="submit">
=======
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
      >
>>>>>>> 2b49090027b5e0cfff0e30fa98705acbc5464837
        Login
      </Button>
    </Form>

  );
};

export default LoginForm;
