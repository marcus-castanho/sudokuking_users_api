const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../modules/mailer')

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    try {
        const { email, username } = req.body;

        if (await User.findOne({ email }))
            return res.status(400).json({ error: 'E-mail already registered' });

        if (await User.findOne({ username }))
            return res.status(400).json({ error: 'Username already registered' });

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

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('+password');

    try {
        if (!user)
            return res.status(400).json({ error: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user._id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: 'support@sudokuking.com',
            template: 'auth/forgot_password',
            context: { token },
        },
            (err) => {
                if (err) {
                    return res.status(400).send({ error: 'Could not send recover password email' });
                }
                return res.send();
            }
        );
    }
    catch (err) {
        return res.status(400).json({ error: 'Recover password process failed. Please try again' })
    }
});

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetTokenExpires');

    try {
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        if (token !== user.passwordResetToken) {
            return res.status(400).json({ error: 'Token Invalid' })
        }

        const now = new Date();

        if (now > user.passwordResetExpires) {
            return res.status(400).json({ error: 'Token expired, please generate a new token' })
        }

        user.password = password;
        user.passwordResetExpires = null;

        await user.save();

        return res.send();
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ error: 'Reset password process failed. Please try again' })
    }
});


module.exports = app => app.use('/auth', router);
