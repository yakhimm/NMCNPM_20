const session = require('express-session');

module.exports = app => {
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // secure: true cho phep chuyen trang theo https, false: cho phep chuyen trang theo http
    }))
};