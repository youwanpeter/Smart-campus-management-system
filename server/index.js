require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const Login_detialsModel = require('./models/Login_details.js');
const EventModel = require('./models/Event.js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
// Connect to MongoDB
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

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
