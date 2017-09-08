const fs = require('fs');



var db = {};
fs.readdirSync(__dirname).forEach(function(file){

    if(file === "index.js"){
        return;
    }
    var model = require("./"+file);
    db[model.modelName] = model;

});




module.exports = db;