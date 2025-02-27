import React from "react";
import { Routes, Route } from "react-router-dom";
import Users from "./pages/Users";
import Schedule from "./pages/Schedule";
import Events from "./pages/Events";
import Resource from "./pages/Resource";

const Links = () => {
  return (
    <Routes>
      <Route path="/users" element={<Users />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/events" element={<Events />} />
      <Route path="/resource" element={<Resource />} />
    </Routes>
  );
};

export default Links;
