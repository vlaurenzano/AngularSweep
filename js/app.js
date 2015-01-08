var app = angular.module('app', []);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/new', {
            templateUrl: 'partials/new.html'
        });
        $routeProvider.when('/new/:difficulty', {
            templateUrl: 'partials/board.html',
            controller: 'board'
        });
        $routeProvider.otherwise({
            redirectTo: '/new'
        });
    }]);



