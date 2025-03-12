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

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
