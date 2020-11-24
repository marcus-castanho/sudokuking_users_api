const express = require('express');
const authMidleware = require('../midlewares/auth');

const router = express.Router();

router.use(authMidleware);

router.post('/', async (req, res) => {

    return res.send({ ok: true, user: req.userId })
});

module.exports = app => app.use('/score', router);