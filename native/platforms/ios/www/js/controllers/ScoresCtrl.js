/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams, PetService) {
        $scope.page_name = "Scores";
    }

    ctrl.$inject = ['$scope', '$stateParams'];
    return ctrl;

});
