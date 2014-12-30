/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams, $rootScope, $modal, ListService) {

        console.log('Getting list');
        var listData = ListService.getList($stateParams.listId, $rootScope.token);
        listData.then(function(result) {
            $scope.list = result;
        });

    }

    ctrl.$inject = ['$scope', '$stateParams', '$rootScope', '$modal', 'ListService'];
    return ctrl;

});
