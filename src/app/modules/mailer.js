const dotenv = require('dotenv').config()
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const host = process.env.MAIL_CONFIG_HOST
const port = process.env.MAIL_CONFIG_PORT 
const user = process.env.MAIL_CONFIG_USER 
const pass = process.env.MAIL_CONFIG_PASS 

var transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }
});

transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./src/resources/mail/')
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));

module.exports = transport;