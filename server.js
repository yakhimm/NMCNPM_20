const express = require('express'),
    app = express(),
    port = 3000,
    fs = require('fs'),
    path = require('path'),
    handlebars = require('express-handlebars');
    usersRouter = require('./signin_signup/routers/users.r')

// cau hinh handlebars
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'container.hbs',
    layoutsDir: __dirname + '/signin_signup/views/layouts'
}))
app.set('view engine', 'hbs');

// Thư mục views nằm cùng cấp với file app.js

var viewPath = path.join(__dirname, 'signin_signup/views');
app.set('views', viewPath);

app.use(express.static(__dirname));
// console.log(__dirname + '\\signin_signup\\css')
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/users', usersRouter);

app.get('/',  (req, res) => {
    res.render('home');
});


app.listen(port, () => {
    console.log(`Server is listening to port ${port}!`)
});