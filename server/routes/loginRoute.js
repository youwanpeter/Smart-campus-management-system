const express = require("express");
const router = express.Router();
const Users = require("../models/Users.js"); 
const { sendVerificationEmail, verifyCode } = require("../middleware/email.js");
const jwt = require("jsonwebtoken");

//Login request endpoint
router.post("/request", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);

    //Find user in the database
    const user = await Users.findOne({ username });

    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //Compare plaintext passwords
    console.log('User found, comparing passwords');
    console.log("Entered password:", password);
    console.log("Stored password:", user.password);

    if (password !== user.password) {
      console.log(`Password mismatch for user: ${username}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //Send verification email
    console.log(`Password matched, sending verification email to: ${user.email}`);
    await sendVerificationEmail(user.email, username);
    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Verification endpoint
router.post("/verify", async (req, res) => {
  try {
    const { username, code } = req.body;
    console.log(`Verification attempt for: ${username} with code: ${code}`);

    //Verify the code
    if (!verifyCode(username, code)) {
      console.log(`Invalid or expired code for user: ${username}`);
      return res.status(401).json({ message: "Invalid or expired code" });
    }

    //Find user in the database
    const user = await Users.findOne({ username }); // Updated to Users
    console.log(`User verified: ${username}, role: ${user.role}, name: ${user.name}`);

    //Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable not set");
      throw new Error("JWT_SECRET is not defined");
    }

    //Generate JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    //Send token and user details in response
    res.status(200).json({ token, username: user.username, role: user.role });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/resend", async (req, res) => {
  try {
    const { username } = req.body; 
    console.log(`Resending verification code for: ${username}`);

    const user = await Users.findOne({ username }); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendVerificationEmail(user.email, username);
    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;