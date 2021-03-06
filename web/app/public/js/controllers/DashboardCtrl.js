/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams, $rootScope, $modal, ListService) {

        // TODO: Scope resets, is calling this everytime
        // Cache this data
    	if(!$scope.lists) {
    		var userLists = ListService.getUsersLists($rootScope.user._id, $rootScope.token);
    		userLists.then(function(result) {
    			$scope.lists = result;
    		});
    	}

    	$scope.addListModal = function() {
    		$scope.modalInstance = $modal.open({
		      templateUrl: 'js/views/modals/addList.html',
		      scope: $scope
		    });
    	}

    	$scope.addList = function(name) {
    		if(!name) {
    			$scope.addErrorMsg = "You must give your list a name";
    			return;
    		}

    		var addList = ListService.addList(name, $rootScope.user._id, $rootScope.token);
    		addList.then(function(result) {
    			$scope.lists.push(result);
    			$scope.closeModal();
    		});
    	}
    	$scope.closeModal = function() {
    		$scope.modalInstance.close();
    	}

        $scope.removeListModal = function(list) {
            $scope.selectedList = list;
            $scope.modalInstance = $modal.open({
              templateUrl: 'js/views/modals/removeList.html',
              scope: $scope
            });
        }
        $scope.removeList = function(list) {
            var removeList = ListService.removeList(list, $rootScope.token);
            removeList.then(function(result) {
                // remove list from array
                for(var i = 0; i < $scope.lists.length; i++) {
                if($scope.lists[i]._id == list._id) {
                    var remove = $scope.lists.splice(i, 1);
                }
            }
                $scope.closeModal();
            });
        }


    }

    ctrl.$inject = ['$scope', '$stateParams', '$rootScope', '$modal', 'ListService'];
    return ctrl;

});
