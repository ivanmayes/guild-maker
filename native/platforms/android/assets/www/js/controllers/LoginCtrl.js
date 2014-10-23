/*global define, console */

define(function () {
    'use strict';

    function ctrl($scope, $state) {
    	/*var loggedin = true;

    	if(loggedin) {
    		$state.go('tab.home');
    	}*/

    	$scope.signIn = function() {
    		$state.go('login');
    	};

    	$scope.signUp = function() {
    		$state.go('signup');
    	};

    	$scope.skip = function() {
    		// Create and handle local account
    		$state.go('roleSelect');
    	};

        $scope.login = function () {
            $state.go('tab.pet-index');
        };

        $scope.facebookLogin = function() {
        	// Launch OAUTH process
        };
        
        $scope.register = function() {
        	// Create account and sync to local
        	$state.go('roleSelect');
        };

        $scope.facebookRegister = function() {
        	// Launch OAUTH process
        };

        $scope.selectRole = function(role) {
        	console.log(role);
        };
    }

    ctrl.$inject = ['$scope', '$state'];
    return ctrl;
    
});