/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams, PetService) {
        $scope.page_name = "Favorite Teams";
    }

    ctrl.$inject = ['$scope', '$stateParams',];
    return ctrl;

});
