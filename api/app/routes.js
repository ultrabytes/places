var response = require(__dirname + "/helpers/response")
var geodist = require('geodist');
var fs = require('fs');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        // console.log(file);
        cb(null, file.fieldname + '-' + Date.now() + ".jpg")
    }

});

var upload = multer({storage: storage});
module.exports = function (app) {


    app.post('/api/places/location', upload.single("photo"), function (req, res) {


        db.Place.create({
            locationName: req.body.location_name,
            description: req.body.description,
            zipcode: req.body.zipcode,
            province: req.body.province,
            country: req.body.country,
            photo: (req.file) ? req.file.filename : "",
            city: req.body.city,
            address: req.body.address,
            loc: [req.body.lng, req.body.lat]
        }, function (err, result) {

            if (err) {

                return response(res).error(err);

            }
            return response(res).success(result);


        });
    });

    app.get("/api/places", function (req, res) {

        var sortOption = JSON.parse(req.query.sorting);

        var queryObejct = {};

        if (req.query.lat && req.query.lng) {

            var nearObject = {
                $geometry: { type: "Point",  coordinates: [ req.query.lng, req.query.lat ] }
            };

            if(req.query.min_distance){
                nearObject["$minDistance"] = req.query.min_distance;
            }

            if(req.query.max_distance){
                nearObject["$maxDistance"] = req.query.max_distance;
            }



            queryObejct = {

                loc: {
                    $near:nearObject

                }


            }


        }


        db.Place.find(queryObejct,null,{sort:sortOption}).populate("favourites").exec(function (err, o) {

            return response(res).success(o);


         });

    });


    app.delete("/api/places/:location", function (req, res) {

        db.Place.findByIdAndRemove(req.params.location, function (err, o) {

            if (err) {
                return response(res).error(err);
            }

            return response(res).success(o);

        });

    });

    app.get("/api/places/favorites",function(req,res){

        db.Favourite.find({}).populate("location").exec(function(err,o){

            if(err){
                return response(res).error(err);
            }

            return response(res).success(o);

        });
    });

    app.get("/upload/:photo", function (req, res) {


        fs.readFile('uploads/' + req.params.photo, function (err, data) {

            if (err) {
                return response(res).error(err);
            }
            res.writeHead(200, {'Content-Type': 'image/jpeg'});

            return res.end(data);

        });


    });

    app.get("/api/places/:location", function (req, res) {

        db.Place.findOne({_id: req.params.location}, function (err, o) {

            if (err) {
                return response(res).error(err);
            }

            return response(res).success(o);

        });
    });

    app.put("/api/places/:location", upload.single("editedPhoto"), function (req, res) {

        var dataToUpdate = {

            locationName: req.body.locationName,
            description: req.body.description,
            zipcode: req.body.zipcode,
            province: req.body.province,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            loc: [req.body.lng, req.body.lat]

        };


        if (req.file) {
            dataToUpdate['photo'] = req.file.filename;
        }

        db.Place.update({_id: req.params.location}, dataToUpdate, {runValidators: true}, function (err, results) {

            if (err) {

                return response(res).error(err);

            }
            return response(res).success(results);

        });


    });

    app.post("/api/place/distance",function(req,res){

        var dist = geodist({lat: req.body.lat, lon: req.body.lng}, {lat: req.body.loc[1],lon:req.body.loc[0]});
        return response(res).success(dist);

    });

    app.post("/api/place/favourite",function(req,res){

        var location = req.body.location;
        db.Favourite.update({location:location},{},{upsert:true},function(err,results){

            if(err){
                return response(res).error(err);
            }

            //return res.send(results);

            if(results.upserted){

                db.Place.update({_id:location},{favourites:results.upserted[0]._id},function(err,o){

                    if(err){
                        return response(res).error(err);
                    }

                    return response(res).success(o);

                });

            }else{
                return response(res).success(results);
            }




        });



    });

    app.delete("/api/place/favourite/:favourite",function(req,res){

        db.Favourite.findByIdAndRemove({_id:req.params.favourite},function(err,o){
            if(err){
                return response(res).error(err);
            }

            db.Place.update({favourites:req.params.favourite},{favourites:[]},function(err,r){

                if(err){
                    return response(res).error(err);
                }

                return response(res).success(o);

            });



        });

    });




};