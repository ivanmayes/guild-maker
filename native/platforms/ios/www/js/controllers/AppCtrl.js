/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams) {
        $scope.leftButtons = [
            {
                content: 'Test'
            }
        ];
    }

    ctrl.$inject = ['$scope', '$stateParams'];
    return ctrl;

});
