var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var Favourite = new mongoose.Schema({
    location: {type: objectId,ref:"Place"},
    createdAt:{type:Date,default:new Date()}

});


module.exports = mongoose.model('Favourite', Favourite);