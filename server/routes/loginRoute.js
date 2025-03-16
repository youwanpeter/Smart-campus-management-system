const express = require("express");
const router = express.Router();
const User = require("../models/Users.js");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "loginAuthentication";

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;