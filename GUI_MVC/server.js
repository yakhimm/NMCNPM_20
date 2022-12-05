const express = require('express');
const exphbs = require('express-handlebars');
const Router = require('./routers/router.r');

const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('hbs', exphbs.engine({
    layoutsDir: 'views/layouts',
    defaultLayout: 'container.hbs',
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b,
    },
}));
app.set('view engine', 'hbs');

//router
app.use(Router);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send(err.message);
});

app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`));


