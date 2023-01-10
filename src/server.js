const express = require('express'),
    app = express(),
    port = 3000,
    Router = require('./routers/router.r'),
    path = require('path');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// var viewPath = path.join(__dirname, '/views');
// app.set('views', viewPath);

require('./configs/hbs')(app);
require('./configs/session')(app);

//router
app.use(Router);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send(err.message);
});

app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`));


