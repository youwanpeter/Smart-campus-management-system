import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h2>Login Page</h2>
      <p>Welcome! Click below to go to the main app.</p>
      <Button type="primary" onClick={() => navigate("/app")}>
        Enter App
      </Button>
    </div>
  );
};

export default Login;
