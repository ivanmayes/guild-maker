/*global define, console */

define(function() {
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

        $scope.login = function() {
            $state.go('home');
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
<<<<<<< HEAD
            console.log(role);
=======
        	// Log role locally, push to server if needed
            console.log(role);

            // Go to school selection
            $state.go('search');
>>>>>>> d7982598b571b45a0300d830dd87f6775631377c
        };
    }

    ctrl.$inject = ['$scope', '$state'];
    return ctrl;

});
