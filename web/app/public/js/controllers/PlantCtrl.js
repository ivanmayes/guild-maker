/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams, $rootScope, $modal, PlantService) {

        if($stateParams.plant) {
            $scope.plant = $stateParams.plant;
        }else{
            console.log('Getting Plant Information');
            var plantData = PlantService.getPlant($stateParams.plantId, $rootScope.token);
            plantData.then(function(result) {
                $scope.plant = result;
            });
        }

        if($stateParams.back) {
            $scope.backTitle = $stateParams.back;
        }

        $scope.back = function() {
          window.history.back();
        };

    }

    ctrl.$inject = ['$scope', '$stateParams', '$rootScope', '$modal', 'PlantService'];
    return ctrl;

});
