<<<<<<< HEAD
require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
=======
require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
>>>>>>> 6f565cad8aba21c8774034ad0245a9a0bb19e8c0

const app = express();
app.use(express.json());

const corsOptions = {
<<<<<<< HEAD
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178",
    "http://localhost:5179",
    "http://localhost:5180",
    "http://localhost:5181",
    "http://localhost:5182",
    "http://localhost:5183",
    "http://localhost:5184",
    "http://localhost:5185",
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
=======
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
    'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179',
    'http://localhost:5180', 'http://localhost:5181', 'http://localhost:5182', 'http://localhost:5183',
    'http://localhost:5184', 'http://localhost:5185'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
>>>>>>> 6f565cad8aba21c8774034ad0245a9a0bb19e8c0
};

// Add this to your main Express app file
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors(corsOptions));

connectDB();

<<<<<<< HEAD
app.use("/api/resources", require("./routes/resourceRoute.js"));
app.use("/api/login", require("./routes/loginRoute.js"));
app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/events", require("./routes/eventRoutes.js"));
=======
app.use("/api/resources", require('./routes/resourceRoute.js'));
app.use("/api/login", require('./routes/loginRoute.js'));
app.use("/api/users", require('./routes/userRoutes.js'));
app.use("/api/events", require('./routes/eventRoutes.js'));
>>>>>>> 6f565cad8aba21c8774034ad0245a9a0bb19e8c0

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
