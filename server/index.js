<<<<<<< HEAD
require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const LoginDetailsModel = require("./models/Login_details.js"); // Fixed typo
const EventModel = require("./models/Event.js");
const eventRoutes = require("./routes/eventRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());

// Configure CORS to allow multiple origins (localhost:3000 and localhost:5173)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add all frontend origins that need access
    methods: "GET, POST, PUT, DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type, Authorization", // Allowed headers
  })
);

// Connect to MongoDB
connectDB();

// POST route for login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await LoginDetailsModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Use the event routes for events-related API
app.use("/api/events", eventRoutes);

// Get the port from environment variables or use default 5000
=======
require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const Login_details = require('./models/Login_details.js');
const EventModel = require('./models/Event.js');
const UserModel = require('./models/Users.js');
const cors = require('cors');

const app = express();
app.use(express.json());
const corsOptions = {
    origin: ['http://localhost:5177', 'http://localhost:5173'], 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
connectDB();

app.use("/api/login", require("./routes/loginRoute.js"));
app.use("/api/users", require("./routes/userRoutes.js"));

app.get('/', (req, res) => {
    res.send('API is running...');
});

>>>>>>> 8db9d90ecc369e21bc848a88ea74c0914092c788
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
