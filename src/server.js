const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const app = express();

mongoose.connect('mongodb://192.168.99.100:27017/sudokuking_users_db', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

requireDir('./models');

const User = mongoose.model('User');

app.get('/', (req, res) => {
    User.create({
        username: 'marcus',
        email: 'castanhomarcus@gmail.com',
        password: 'senhasudokuking',
    });

    return res.send("Working")
})

app.listen(3001);