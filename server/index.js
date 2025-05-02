require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const path = require("path");
const taskRoutes = require("./routes/taskRoute");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    // ... keep other origins as needed
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

// API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/resources", require("./routes/resourceRoute.js"));
app.use("/api/login", require("./routes/loginRoute.js"));
app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/events", require("./routes/eventRoutes.js"));

app.use("/api/files", require("./routes/files"));
app.use("/api/lecturers", require("./routes/lecturers"));
app.use("/api/courses", require("./routes/courseRoute.js"));
app.use("/api/subjects", require("./routes/subjectsRoute.js"));

<<<<<<< HEAD

app.get("/", (req, res) => {
  res.send("API is running...");
=======
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
>>>>>>> 9d2582f4fb93be3a8315642bbb81386b3d45422a
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
