const express = require('express'),
    app = express(),
    port = 3000,
    fs = require('fs'),
    handbars = require('express-handlebars');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());




