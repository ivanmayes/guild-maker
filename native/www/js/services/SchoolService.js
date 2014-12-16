define(['angular'], function(angular) {
    "use strict";

    var factory = function(API_VERSION, $http, $q, $window) {

        var userInfo;

        /**
         * Checks if user is logged in
         * @return {Boolean} User login state
         */
        function isLoggedIn() {
            if ($window.sessionStorage["userInfo"]) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Logs a user into the application
         * @param  {String} email User Email Address
         * @param  {String} password User Password
         * @return {String} access_token  A user access token to access other page data
         */
        function login(email, password) {
            var deferred = $q.defer();

            $http.post(
                "http://localhost:8280/v" + API_VERSION + "/login",
                {
                    email: email,
                    password: password
                } /*,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }*/
            ).then(function(result) {
                if (result.data && result.data.response && result.data.response.token) {
                    userInfo = {
                        accessToken: result.data.response.token.token,
                        user: result.data.response.token.user
                    };
                    $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                    deferred.resolve(userInfo);
                } else {
                    deferred.reject(result.data.meta.errorDetail[0]);
                }


            }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        /**
         * Logs user out of application
         */
        function logout() {

            $window.sessionStorage["userInfo"] = null;

            return true;
        }

        /**
         * Signs up a new user with our API
         * @param  {String} email User Email Address
         * @param  {String} password User Password (Confirmed with Controller)
         * @return {String} access_token  A user access token to access other page data
         */
        function signup(email, password) {
            var deferred = $q.defer();

            // TODO: Remove hard coded url
            $http.post("http://localhost:8280/v" + API_VERSION + "/signup", {
                email: email,
                password: password
            }).then(function(result) {

                if (result.data && result.data.response && result.data.response) {
                    userInfo = {
                        accessToken: result.data.response.token,
                        email: result.data.email
                    };
                    $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                    deferred.resolve(userInfo);
                } else {
                    deferred.reject(result.data.meta.errorDetail[0]);
                }

            }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        // Return all our public functions
        return {
            login: login,
            isLoggedIn: isLoggedIn,
            logout: logout,
            signup: signup
        };

    };

    factory.$inject = ['API_VERSION', '$http', '$q', '$window'];
    return factory;
});
