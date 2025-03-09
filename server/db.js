require('dotenv').config(); 
const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('Mongo URI:', process.env.MONGO_URI); //Log the URI to verify it loads correctly
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
