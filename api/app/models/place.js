var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var Place = new mongoose.Schema({
    locationName: {type: String, required: true},
    description: String,
    photo: {type: String, required: true},
    zipcode: String,
    province: String,
    country: String,
    city: String,
    address: {type: String, required: true},
    loc: {type: [Number], index: '2dsphere'},
    favourites:[{ type:objectId, ref:"Favourite" }]

});

module.exports = mongoose.model('Place', Place);