require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const Login_detailsModel = require("./models/Login_details.js");
const EventModel = require("./models/Event.js");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
