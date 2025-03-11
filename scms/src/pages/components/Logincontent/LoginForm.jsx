<<<<<<< HEAD
import React, { useState } from "react";
import { Input, Form, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
=======
import React, { useState } from 'react';
import { Input, Form, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
>>>>>>> 9c615011a82ef2bd16394cd6348b80fb52804807
import "/src/Login.css";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    setLoading(true);
    try {
<<<<<<< HEAD
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
=======
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
>>>>>>> 9c615011a82ef2bd16394cd6348b80fb52804807
      });

      const data = await response.json();

      if (response.status === 200) {
        message.success(data.message);
        navigate("/");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Form name="login" layout="vertical" onFinish={handleLogin}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input placeholder="Enter your username" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

<<<<<<< HEAD
      <Button type="primary" htmlType="submit" loading={loading}>
=======
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
      >
>>>>>>> 9c615011a82ef2bd16394cd6348b80fb52804807
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
