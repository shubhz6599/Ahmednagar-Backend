const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config/env');

const nodemailer = require('nodemailer');

const router = express.Router();


router.post('/register', async (req, res) => {
    const { Username, Email, Password } = req.body;
    try {
        console.log("existingUser1");
        const existingUser = await User.findOne({ Username: Username });
        console.log("existingUser");

        const existingUserWithEmail = await User.findOne({ Email: Email });
        if (existingUser || existingUserWithEmail) {
            return res.status(400).json({ message: 'Username or Email already exists', statusMsg: 'Failure' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = new User({ Username, Email, Password: hashedPassword });

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully', statusMsg: 'Success' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', statusMsg: 'Failure' });
    }
});

router.post('/login', async (req, res) => {
    const { Username, Password } = req.body;

    console.log(req.body);
    try {
        const user = await User.findOne({ Username: Username });
        if (!user) {
            return res.status(404).json({ message: 'User not found', statusMsg: 'Failure' });
        }

        const PasswordMatch = await bcrypt.compare(Password, user.Password);
        if (!PasswordMatch) {
            return res.status(401).json({ message: 'Incorrect Password', statusMsg: 'Failure' });
        }

        const token = jwt.sign({ Username: user.Username }, JWT_SECRET);

        return res.json({ message: 'Login successful', token: token, statusMsg: 'Success', userId: user._id });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', statusMsg: 'Failure' });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', statusMsg: 'Failure' });
        }
        return res.json({ user: user, message: 'User data fetched!', statusMsg: 'Success' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', statusMsg: 'Failure' });
    }
});


module.exports = router;
