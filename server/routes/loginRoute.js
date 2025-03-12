const express = require("express");
const router = express.Router();
const Login = require("../models/Login_details.js");

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Login.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
