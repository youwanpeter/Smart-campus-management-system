require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const Login_detialsModel = require("./models/Login_details.js");
const EventModel = require("./models/Event.js");
const eventRoutes = require("./routes/eventRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
// Connect to MongoDB
connectDB();

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Login_detialsModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
