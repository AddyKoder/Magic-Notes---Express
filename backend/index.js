// Importing Packages
const express = require('express');
const path = require('path');

// Importing custom Modules
const endpoints = require('./js/routes');    // Importing routes.js to add routes to this express app

// Initializing Express
const app = express();

// Setting up the Views and view engine
app.set('view engine','pug')
app.set('views', path.join(__dirname, '../frontend/templates'))

// Adding Express middlewares
app.use(endpoints); // adding routes / endpoints
app.use('/',express.static(path.join(__dirname, '../frontend/public')))

app.listen(80);
