/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams, $ionicNavBarDelegate) {
        $scope.page_name = "Home";

        setTimeout(function() {
            // Hide back button
            $ionicNavBarDelegate.$getByHandle('main-nav').showBackButton(false);
            $scope.$apply();
        }, 10);

    }

    ctrl.$inject = ['$scope', '$stateParams', '$ionicNavBarDelegate'];
    return ctrl;

});
