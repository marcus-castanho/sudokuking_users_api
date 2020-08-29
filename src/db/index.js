const mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.99.100:27017/sudokuking_users_db', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

module.exports  = mongoose;
