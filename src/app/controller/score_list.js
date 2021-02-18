const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/users_list', async (req, res) => {
    const list_users = await User.find();

    try {
        const users_list = list_users.map(userInfo => ({ username: userInfo.username, score: userInfo.score }));

        return res.send({ users_list })
    }
    catch (err) {
        return res.status(400).json({ error: 'Error getting users soore list, please, try again.' })
    }
})

module.exports = app => app.use('/list', router);