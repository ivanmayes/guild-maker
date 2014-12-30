/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams, $rootScope, $modal, PlantService) {
    	$scope.query = {
    		q: ''
    	};
    	//$scope.results = [];

        if($stateParams.back) {
            $scope.backTitle = $stateParams.back;
        }

        $scope.search = function() {
        	console.log($scope.query);
        	var searchPlants = PlantService.searchPlants($scope.query, $rootScope.access_token);
        	searchPlants.then(function(plants) {
        		$scope.results = plants;
        	});
        }

        $scope.back = function() {
          window.history.back();
        };

    }

    ctrl.$inject = ['$scope', '$stateParams', '$rootScope', '$modal', 'PlantService'];
    return ctrl;

});
