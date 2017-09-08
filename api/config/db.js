const mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME + '', {useMongoClient: true});
var db = require("../app/models");
module.exports  = db;
