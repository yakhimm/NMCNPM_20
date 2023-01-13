const exphbs = require('express-handlebars');
const hbsH = require('../helpers/helpers.js');

module.exports = app => {
    app.engine('hbs', exphbs.engine({
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials',
        defaultLayout: 'container.hbs',
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
        },
    }));
    app.set('view engine', 'hbs');

    app.set('view options', {
        layout: 'option01_layouts'
    });

    app.set('view options', {
        layout: 'option02_layouts'
    });
}