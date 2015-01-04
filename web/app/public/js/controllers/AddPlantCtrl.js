/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $state, $stateParams, $rootScope, $modal, PlantService, ListService) {

        if (PlantService.query) {
            $scope.query = PlantService.query;
        } else {
            $scope.query = {
                q: ''
            };
        }

        if (ListService.selectedList) {
            $scope.list = ListService.selectedList;
        } else {
            $state.go('dashboard');
        }

        if (PlantService.search_results) {
            $scope.results = PlantService.search_results;
        }

        if ($stateParams.back) {
            $scope.backTitle = $stateParams.back;
        }

        $scope.search = function() {
            var searchPlants = PlantService.searchPlants($scope.query, $rootScope.token);
            searchPlants.then(function(plants) {
                PlantService.query = $scope.query;
                PlantService.search_results = plants;
                $scope.results = plants;
            });
        }

        $scope.add = function(plant_id) {
            var list = $scope.list;
            list.Plants.push(plant_id);
            var addPlant = ListService.updateList(list, $rootScope.token);
            addPlant.then(function(list) {
                ListService.selectedList = list;
                $scope.list = list;
                console.log('Plants', $scope.list);
            })
        }

        $scope.isAddedToList = function(plant_id) {
            var isAdded = false;

            angular.forEach($scope.list.Plants, function(obj) {
                //console.log('isAdded?', obj._id, plant_id);
                if (obj._id == plant_id) {
                    isAdded = true;
                }
            });

            return isAdded;
        }

        $scope.back = function() {
            window.history.back();
        };

    }

    ctrl.$inject = ['$scope', '$state', '$stateParams', '$rootScope', '$modal', 'PlantService', 'ListService'];
    return ctrl;

});
