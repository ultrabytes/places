placeApp.config(["$routeProvider",function($routeProvider){

    $routeProvider.when('/', {
        templateUrl: 'templates/home.html'

    });
    $routeProvider.when('/places', {
        templateUrl: 'templates/place/places.html',
        controller:"PlaceListController"

    });

    $routeProvider.when('/place/view/:id', {
        templateUrl: 'templates/place/view-place.html',
        controller:"PlaceViewController"

    });

    $routeProvider.when('/place/edit/:id', {
        templateUrl: 'templates/place/edit-place.html',
        controller:"EditPlaceController"

    });


    $routeProvider.when('/place/form', {
        templateUrl: 'templates/place/place-form.html',
        controller:"PlaceController"

    });
    $routeProvider.when('/place/favourites', {
        templateUrl: 'templates/place/favorites-place.html',
        controller:"FavoritePlaceController"

    });

    $routeProvider.otherwise('/');

}]);