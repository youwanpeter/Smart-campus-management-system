import React, { useState } from 'react';
import { Input, Form, Button, message } from 'antd';
import "/src/Login.css";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (response.ok) {
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

      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
      >
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
