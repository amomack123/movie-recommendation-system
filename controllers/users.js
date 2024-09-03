const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Adjust the path if necessary
const jwt = require('jsonwebtoken');

const SALT_LENGTH = 12;

// @desc    Register a new user (Signup)
// @route   POST /api/users/signup
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        // Check if the username is already taken
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.status(400).json({ error: 'Username already taken.' });
        }

        // Check if the email is already taken
        const emailInDatabase = await User.findOne({ email: req.body.email });
        if (emailInDatabase) {
            return res.status(400).json({ error: 'Email already taken.' });
        }

        // Create a new user with hashed password
        const user = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        });

        // Create a token for the new user
        const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @desc    Authenticate user & get token (Signin)
// @route   POST /api/users/signin
// @access  Public
router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            // Create a token for the signed-in user
            const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
