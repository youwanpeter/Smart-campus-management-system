import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./Login.css";
import LoginForm from "./pages/components/Logincontent/LoginForm";
import { FaLeaf } from "react-icons/fa6";

const Login = () => {
  const navigate = useNavigate();

  return (
    <section className="LoginForm">
      {/* Gradient BG */}
      <div className="animated-background"></div>

      {/* Content */}
      <div className="form-content">
        <FaLeaf className="logo-icon" />
        <h2>Login</h2>
        <p>Welcome! Please enter your credentials below.</p>
        <LoginForm />
      </div>
    </section>
  );
};

export default Login;
