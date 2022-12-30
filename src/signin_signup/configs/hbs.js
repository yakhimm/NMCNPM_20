const handlebars = require('express-handlebars');
// const hbsH = require('../helpers/hbs_helpers');

module.exports = app => {
    app.engine('hbs', handlebars.engine({
        layoutsDir: 'signin_signup/views/layouts/',
        defaultLayout: 'container.hbs',
        extname: 'hbs',
        // helpers: hbsH
    }));
    app.set('view engine', 'hbs');
    
}