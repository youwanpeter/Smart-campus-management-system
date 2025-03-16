import React, { useState } from "react";
import { FaLeaf } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import LoginForm from "./pages/components/Logincontent/LoginForm";
import "../src/Login.css";

const Login = () => {
  const [token, setToken] = useState(null);

  const handleLogin = (token) => {
    setToken(token);
  };

  return (
    <section className="LoginForm">
      {/* Gradient BG */}
      <div className="animated-background"></div>

      {/* Content */}
      <div className="form-content">
        <FaLeaf className="logo-icon" />
        <h2>Login</h2>
        <p>Welcome! Please enter your credentials below.</p>
        {token ? (
        <div>Welcome, you're logged in!</div>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
      </div>
    </section>
  );
};

export default Login;
