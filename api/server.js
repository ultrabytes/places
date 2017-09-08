// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require('dotenv').config();
global.db = require('./config/db');
var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



 require('./app/routes')(app);

app.listen(port);