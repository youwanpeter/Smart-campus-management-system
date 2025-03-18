import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import "/src/Login.css";

const Login = ({ onLogin }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLoginRequest = async (values) => {
    setLoading(true);
    setError('');

    try {
      console.log('Sending login request with:', values.username);
      const response = await axios.post('http://localhost:5000/api/login/request', values);
      console.log('Login request response:', response.data);
      setUsername(values.username);
      setVerificationMode(true);
      message.success('Verification code sent to your email');
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Sending verification code:', verificationCode);
      const response = await axios.post("http://localhost:5000/api/login/verify", {
        username,
        code: verificationCode,
      });
      console.log('Verification response:', response.data);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);
      message.success("Login successful");

      window.location.href = "/";
    } catch (error) {
      console.error('Verification error:', error);
      message.error(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Resending verification code...");
      const response = await axios.post("http://localhost:5000/api/login/resend", {
        username,
      });

      console.log("Verification response:", response.data);
      message.success("Verification code resent successfully!");
    } catch (error) {
      console.error("Verification error:", error);
      message.error(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {!verificationMode ? (
        <Form form={form} name="login" onFinish={handleLoginRequest} className="login-form">
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <center><Button type="primary" htmlType="submit" loading={loading} className="login-form-button" block style={{ width: '40%' }}>
              Continue
            </Button></center>
          </Form.Item>
        </Form>
      ) : (
        <div className="verification-form">
          <h3>Verification Required</h3>
          <p>Please enter the verification code sent to your email</p>
          <Input
            prefix={<SafetyOutlined className="site-form-item-icon" />}
            placeholder="6-digit code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ marginBottom: 16 }}
            maxLength={6}
          />
          <center><Button type="primary" onClick={handleVerify} loading={loading} className="login-form-button" block style={{ width: '40%' }}>
            Verify & Login
          </Button></center>
          <center><a href onClick={resendCode} className='resend' block>
            Resend Code
          </a></center>
        </div>
      )}
    </div>
  );
};

export default Login;