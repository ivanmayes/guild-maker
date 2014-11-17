/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams) {
        $scope.page_name = "Settings";
    }

    ctrl.$inject = ['$scope', '$stateParams'];
    return ctrl;

});
