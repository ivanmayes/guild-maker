/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams) {
        $scope.page_name = "Home";
        $scope.hideBackButton = !$scope.hideBackButton;
    }

    ctrl.$inject = ['$scope', '$stateParams'];
    return ctrl;

});
