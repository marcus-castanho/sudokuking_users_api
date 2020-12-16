const express = require('express');
const authMidleware = require('../midlewares/auth');
const User = require('../models/User');

const router = express.Router();

router.use(authMidleware);

router.get('/user/:userId', async (req, res) => {
    const { userId } = req.body;
    const user = await User.findOne({ userId });

    try {
        return res.send({ user })
    }
    catch (err) {
        return res.status(400).json({ error: 'Error getting user info, please try again.' })
    }
});

router.get('/users_list', async (req, res) => {
    const users_list = await User.find();

    try {
        return res.send({ users_list })
    }
    catch (err) {
        return res.status(400).json({ error: 'Error getting users soore list, please, try again.' })
    }
})

router.put('/update_score', async (req, res) => {
    const { email, score } = req.body;

    try {
        const user = await User.findOne({ email });

        if (score <= user.score) {
            return res.status(200).json({ Message: 'Your best score has not changed.' })
        }
        else {
            await User.findByIdAndUpdate(user._id, {
                '$set': {
                    score: score,
                }
            });
        }

        return res.send(User.findOne({ email }));
    }
    catch (err) {
        return res.status(400).json({ error: 'New score not saved, please try again.' })
    }
});

router.delete('/delete_users/:userId', async (req, res) => {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });

    try {
        await User.findByIdAndDelete({ _id: userId })
        return res.send({ message: `The user ${user.username} has been unregistered.` })
    }
    catch (err) {
        return res.status(400).json({ error: 'Error unregistering user, please try again.' })
    }
});


module.exports = app => app.use('/score', router);