// Angular module and inject mongolabResource
var myapp = angular.module('AngularApp',['mongolabResource']);

// Sign up here for a free Mongolab.com account
// https://mongolab.com/signup/
myapp.constant('API_KEY',''); 
myapp.constant('DB_NAME','');

myapp.factory('MongoLabResource', function($mongolabResource){
    return $mongolabResource('contacts');
});

myapp.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/contact/:id', {
            controller: 'SingleCtrl',
            templateUrl: 'tpl/single.html'
        })
        .when('/add', {
            controller: 'AddCtrl',
            templateUrl: 'tpl/add.html'
        })
        .when('/', {
            controller: 'ListCtrl',
            templateUrl: 'tpl/table.html'
        })
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
});

myapp.controller('SingleCtrl', ['$scope', '$location', '$routeParams', 'MongoLabResource', function($scope, $location, $routeParams, $mongolab) {
        // Extract id from route
        var id = $routeParams.id;   
        
        // getById function is not provided by Angular but
        // from the MongolabResource
        $scope.contact = $mongolab.getById(id);
        
        $scope.update = function(){
            
            $scope.contact.update();
            
            // Force an update on the list
            $scope.$apply();
            // Redirect back to root
            $location.path('/');
        };
    }])
    .controller('AddCtrl', ['$scope', '$location', '$routeParams', 'MongoLabResource', function($scope, $location, $routeParams, $mongolab) {
        
        $scope.save = function(){
            
            var contact = { "name": $scope.name,
                            "cellphone": $scope.cellphone,
                            "email": $scope.email,
                            "twitter": $scope.twitter,
                            "website": $scope.website
                          };
            // Save            
            var newContact = new $mongolab(contact);
            newContact.$save();
            
            $scope.$apply();
            // Redirect back to root
            $location.path('/');
        };
    }])
    .controller('ContactsCtrl', function($scope) {
        //do nothing since we will redirected to ListCtrl
    })
    .controller('ListCtrl', ['$scope', 'MongoLabResource', function($scope, $mongolab) {
            $scope.contacts = $mongolab.query();
    
            $scope.remove = function(contact_id){
                // Same with getById() -> provided by MongolabResource
                $mongolab.remove({id: contact_id});
                
                $scope.$apply();
                // Redirect back to root to refresh
                $location.path('/');
            };
    }]);

