const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SALT_LENGTH = 10;

router.post('/signup', async (req, res) => {
    try {
        const {username, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create a new user with hashed password
        const user = await User.create({
            username,
            hashedPassword: bcrypt.hashSync(password, SALT_LENGTH)
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ token, user: { id: user._id, username: user.username } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred during signup' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user._id, username: user.username} });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during signin' });
    }
});

module.exports = router;