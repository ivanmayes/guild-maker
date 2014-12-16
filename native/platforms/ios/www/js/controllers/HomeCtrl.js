/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams, $ionicNavBarDelegate) {
        $scope.page_name = "Home";
        setTimeout(function() {
            $ionicNavBarDelegate.$getByHandle('main-nav').changeTitle('test');
            console.log('hidden')
        }, 3000);

        console.log('home');
    }

    ctrl.$inject = ['$scope', '$stateParams', '$ionicNavBarDelegate'];
    return ctrl;

});
