const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    try {
        const { email } = req.body;

        if (await User.findOne({ email }))
            return res.status(400).json({ error: 'E-mail already registered' });

        const user = await User.create(req.body);

        user.password = undefined;

        return res.json({ user, token: generateToken({ id: user._id }) });
    }
    catch (err) {
        return res.status(400).json({ error: 'Registration failed' })
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    try {
        if (!user)
            return res.status(400).json({ error: 'User not found' })
        if (!await bcrypt.compare(password, user.password))
            return res.status(400).json({ error: 'Invalid password' })

        user.password = undefined;
        return res.send({ user, token: generateToken({ id: user._id }) });
    }
    catch (err) {
        return res.status(400).json({ error: 'Authentication failed' })
    }
})

module.exports = app => app.use('/auth', router);
