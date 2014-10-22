var appModule = angular.module('app', []);

appModule.controller('AuthCtrl', function($scope) {
    $scope.message = 'Please sign in';
});
