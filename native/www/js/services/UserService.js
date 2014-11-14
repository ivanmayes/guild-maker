define(['angular'], function(angular) {
    "use strict";

    var factory = function($http, $q, $window) {

        var userInfo;

        /**
         * Logs a user into the application
         * @param  {[type]} userName [description]
         * @param  {[type]} password [description]
         * @return {[type]}          [description]
         */
        function login(userName, password) {
            var deferred = $q.defer();

            $http.post("/api/login", {
                userName: userName,
                password: password
            }).then(function(result) {
                userInfo = {
                    accessToken: result.data.access_token,
                    userName: result.data.userName
                };
                $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                deferred.resolve(userInfo);
            }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function isLoggedIn() {
            if ($window.sessionStorage["userInfo"]) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Logs user out of application
         */
        function logout() {

            $window.sessionStorage["userInfo"] = null;

            return true;
        }

        return {
            login: login,
            isLoggedIn: isLoggedIn,
            logout: logout
        };

    };

    factory.$inject = ['$http', '$q', '$window'];
    return factory;
});
