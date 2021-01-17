const express = require('express');
const authMidleware = require('../midlewares/auth');
const User = require('../models/User');

const router = express.Router();

router.use(authMidleware);

router.get('/user/:userId', async (req, res) => {
    const { userId } = req.body;
    const find_user = await User.findOne({ userId });

    try {
        const user = { username: find_user.username, score: find_user.score };

        return res.send({ user })
    }
    catch (err) {
        return res.status(400).json({ error: 'Error getting user info, please try again.' })
    }
});

router.put('/update_score', async (req, res) => {
    const userId = req.userId;
    const { score } = req.body;

    try {
        let user = await User.findOne({ _id: userId });

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

        user = await User.findOne({ _id: userId })

        return res.status(200).send({ user })
    }
    catch (err) {
        return res.status(540000).json({ error: 'New score not saved, please try again.' })
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