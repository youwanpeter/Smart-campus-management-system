require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const LoginDetailsModel = require("./models/Login_details.js");
const EventModel = require("./models/Event.js");
const UserModel = require("./models/Users.js");

const eventRoutes = require("./routes/eventRoutes");
const loginRoutes = require("./routes/loginRoute.js");
const userRoutes = require("./routes/userRoutes.js");

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

// Use the login and user routes for authentication and user management
app.use("/api/login", loginRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Get the port from environment variables or use default 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
