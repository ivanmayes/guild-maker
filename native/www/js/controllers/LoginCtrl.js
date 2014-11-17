/*global define, console */

define(function() {
    'use strict';

    function ctrl($scope, $state, UserService) {
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
            console.log('logging in');
            var checkLogin = UserService.login('ivanmayes@gmail.com', 'mypass');
            checkLogin.then(function(userInfo) {
                console.log(userInfo);
                $state.go('home');
            }, function(reason) {
                    console.log('Failed:', reason);
                });
        };

        $scope.facebookLogin = function() {
            // Launch OAUTH process
        };

        $scope.register = function() {
            // Create account and sync to local
            console.log('logging in');
            //TODO: Check passwords to match
            var checkLogin = UserService.signup('ivanmayes@gmail.com', 'mypass');
            checkLogin.then(function(userInfo) {
                console.log(userInfo);
                $state.go('roleSelect');
            }, function(reason) {
                    console.log('Failed:', reason);
                });
        };

        $scope.facebookRegister = function() {
            // Launch OAUTH process
        };

        $scope.selectRole = function(role) {
            // Log role locally, push to server if needed
            console.log(role);

            // Go to school selection
            $state.go('search');
        };
    }

    ctrl.$inject = ['$scope', '$state', 'UserService'];
    return ctrl;

});
