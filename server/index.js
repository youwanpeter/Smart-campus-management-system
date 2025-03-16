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
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179', 'http://localhost:5180', 'http://localhost:5181', 'http://localhost:5182', 'http://localhost:5183', 'http://localhost:5184', 'http://localhost:5185'], 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true  
};

app.use(cors(corsOptions));
connectDB();

app.use("/api/login", require("./routes/loginRoute.js"));
app.use("/api/users", require("./routes/userRoutes.js"));

app.get('/', (req, res) => {
    res.send('API is running...');
});

>>>>>>> ddbcf091640c70d7061dc96ded5b7d6d77f9deb6
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
