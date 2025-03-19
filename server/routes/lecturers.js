// routes/lecturers.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../models/Users"); // Assuming you have a User model

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Get all lecturers
router.get("/", authenticate, async (req, res) => {
  try {
    // Assuming you have a role field in your User model
    const lecturers = await Users.find({ role: "Lecturer" }).select("name");
    res.json(lecturers);
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;