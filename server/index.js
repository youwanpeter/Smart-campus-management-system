require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const Login_detialsModel = require('./models/Login_details.js');
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

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Login_detialsModel.findOne({ username });

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

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
