import React from 'react';
import "/src/Login.css";

import { Input, Form } from 'antd';

const LoginForm = () => (
  <Form
    name="login"
    layout="vertical" 
  >
    <Form.Item
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input placeholder="Enter your username" />
    </Form.Item>

    {/* Password Field */}
    <Form.Item
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password placeholder="Enter your password" />
    </Form.Item>
  </Form>
);

export default LoginForm;
