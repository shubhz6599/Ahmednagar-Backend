const mongoose = require('mongoose');
// const { MONGODB_URI } = require('../config/env');
require('dotenv').config()


// mongoose.connect(MONGODB_URI);
// .env
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
console.log("ss",process.env.MONGODB_URI);


const userSchema = new mongoose.Schema({
    Username: { type: String, unique: true },
    Email: { type: String, unique: true },
    Password: { type: String, unique: false },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
