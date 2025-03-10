const mongoose = require('mongoose')

const Login_detialsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Login_detialsModel = mongoose.model('Login', Login_detialsSchema );

module.exports = Login_detialsModel;