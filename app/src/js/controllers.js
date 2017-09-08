var apiUrl = "http://localhost:8100/";

placeApp.controller("PlaceController", ["$rootScope", "$scope", "$http", "$location", function ($rootScope, $scope, $http, $location) {

    $scope.placeForm = {};
    $scope.errors = {}

    var input = (document.getElementsByClassName('address')[0]);
    initLocationAutocomplete(input);

    $scope.addPlace = function () {

        var fd = new FormData();
        //var fd = new FormData();

        var photo = document.getElementById("photo").files[0];
        fd.append("photo", photo);
        for (var i in $scope.placeForm) {

            fd.append(i, $scope.placeForm[i])
        }

        $http.post(apiUrl + "api/places/location", fd, {
            headers: {'Content-Type': undefined}
        }).then(function (o) {

            if (!o.data.success) {

                $scope.errors = o.data.err.errors;
                return;
            }

            $location.path("/places");


        });

    };


}]);

placeApp.controller("PlaceListController", ["$rootScope", "$scope", "$http", "$location", function ($rootScope, $scope, $http, $location) {

    $scope.places = [];

    $scope.filters = {};

    $scope.sorting = {locationName: 1};

    $scope.getPlacesList = function () {

        var params = $scope.filters;
        params['sorting'] = $scope.sorting;

        $http({
            url: apiUrl + "api/places",
            method: "GET",
            params: params

        }).then(function (o) {

            if (o.data.success) {
                $scope.places = o.data.data;
            }

        });

    }

    $scope.getPlacesList();


    $scope.deletePlace = function (id) {

        $http.delete(apiUrl + "api/places/" + id).then(function (o) {

            if (o.data.success) {
                $scope.getPlacesList();
            }


        });


    };

    $scope.viewPlace = function (id) {

        $location.path("/place/view/" + id)

    };


    $scope.editPlace = function (id) {


        $location.path("/place/edit/" + id);

    };

    $scope.sortPlaces = function (type) {

        $scope.sorting.locationName = parseInt(type);
        $scope.getPlacesList();

    };

    $scope.setFavourite = function (id) {

        $http.post(apiUrl + "api/place/favourite", {location: id}).then(function (o) {

            if (o.data.success) {
                $scope.getPlacesList();
            }

        });


    };

    $scope.deleteFavourite = function (id) {

        $http.delete(apiUrl + "api/place/favourite/" + id).then(function (o) {
            if (o.data.success) {
                $scope.getPlacesList();
            }
        });


    };

    var input = (document.getElementsByClassName('filter_location')[0]);
    initLocationAutocomplete(input);


}]);

placeApp.controller("PlaceViewController", ["$rootScope", "$scope", "$http", "$routeParams", function ($rootScope, $scope, $http, $routeParams) {

    $scope.place = {};
    $scope.host = apiUrl;
    $scope.distance = {};
    $scope.distance.dist = false;
    $http.get(apiUrl + "api/places/" + $routeParams.id).then(function (o) {
        if (o.data.success) {
            $scope.place = o.data.data;
        }
    });

    $scope.getDistance = function () {


        $scope.distance.loc = $scope.place.loc;


        $http({
            url: apiUrl + "api/place/distance",
            method: "POST",
            data: $scope.distance

        }).then(function (o) {
            if (o.data.success) {
                $scope.distance.dist = o.data.data;
            }
        });

    };

    var input = (document.getElementsByClassName('location')[0]);
    initLocationAutocomplete(input);


}]);

placeApp.controller("EditPlaceController", ["$rootScope", "$scope", "$http", "$routeParams", "$location", function ($rootScope, $scope, $http, $routeParams, $location) {

    $scope.placeForm = {};
    $scope.host = apiUrl;

    $http.get(apiUrl + "api/places/" + $routeParams.id).then(function (o) {
        if (o.data.success) {
            $scope.placeForm = o.data.data;
            $scope.placeForm.lat = $scope.placeForm.loc[1];
            $scope.placeForm.lng = $scope.placeForm.loc[0];
            var input = (document.getElementsByClassName('address')[0]);
            initLocationAutocomplete(input);
        }
    });

    $scope.updatePlace = function () {

        var fd = new FormData();
        //var fd = new FormData();

        var photo = document.getElementById("photo").files[0];
        if (photo) {

            fd.append("editedPhoto", photo);

        }


        for (var i in $scope.placeForm) {

            fd.append(i, $scope.placeForm[i]);
        }


        $http.put(apiUrl + "api/places/" + $scope.placeForm._id, fd, {
            headers: {'Content-Type': undefined}
        }).then(function (o) {

            if (!o.data.success) {

                $scope.errors = o.data.err.errors;
                return;
            }
            $location.path("/places");

        });

    };


}]);

placeApp.controller("FavoritePlaceController", ["$rootScope", "$scope", "$http", "$routeParams", "$location", function ($rootScope, $scope, $http, $routeParams, $location) {


    $scope.favourites = [];
    $scope.getFavouritePlaces = function () {
        $http.get(apiUrl + "api/places/favorites").then(function (o) {

            if (o.data.success) {
                $scope.favourites = o.data.data;
            }

        });

    };

    $scope.getFavouritePlaces();

    $scope.viewPlace = function (id) {

        $location.path("/place/view/" + id)

    };

    $scope.deleteFavourite = function (id) {

        $http.delete(apiUrl + "api/place/favourite/" + id).then(function (o) {
            if (o.data.success) {
                $scope.getFavouritePlaces();
            }
        });


    };



}]);


var autocomplete;

function initLocationAutocomplete(input) {


    var input = input;


    if (input) {
        autocomplete = new google.maps.places.Autocomplete(input,

            {types: ['address']});

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            fillInAddress(input);
        });
    }
}

function fillInAddress(input) {

    var fields = {
        postal_code: "zipcode",
        country: "country",
        locality: "city",
        administrative_area_level_1: "province"
    };

    var place = autocomplete.getPlace();

    console.log(place);
    var scope = angular.element(input).scope();

    var ele_lat = input;

    if (ele_lat) {

        angular.element(ele_lat).triggerHandler('input');

    }
    if (scope.placeForm) {
        scope.$apply(function () {
            scope.placeForm['zipcode'] = "";
        });

        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (fields[addressType]) {
                var val = place.address_components[i].long_name;

                scope.$apply(function () {
                    scope.placeForm[fields[addressType]] = val;
                });
            }

        }

    }


    var lat = place.geometry.location.lat(),
        lng = place.geometry.location.lng();


    if (scope.placeForm) {

        scope.$apply(function () {
            scope.placeForm.lat = lat;
            scope.placeForm.lng = lng;
        });


    }

    if (scope.filters) {

        scope.$apply(function () {
            scope.filters.lat = lat;
            scope.filters.lng = lng;
        });


    }

    if (scope.distance) {
        scope.$apply(function () {
            scope.distance.lat = lat;
            scope.distance.lng = lng;
        });
    }


    var ele_lat = document.getElementById('address');

    if (ele_lat) {

        angular.element(ele_lat).triggerHandler('input');

    }
    if (scope.placeForm) {
        initMap(lat, lng);
    }


}

function initMap(latIn, lngIn) {
    var myLatLng = {lat: latIn, lng: lngIn};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Place'
    });
}

