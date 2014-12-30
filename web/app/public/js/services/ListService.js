define(['angular'], function(angular) {
    'use strict';

    var factory = function($http, $q, $window, API_URL) {

        var userInfo;



        function getUsersLists(userId, access_token) {
            var deferred = $q.defer();

            if(!userId || !access_token) {
                deferred.reject("Missing parameters for this call");
            }

            $http({
                url: API_URL + 'lists/search',
                method: 'GET',
                params: {
                    userId: userId,
                    access_token: access_token
                }
            }).then(function(result) {
                if (result.data && result.data.response) {
                    deferred.resolve(result.data.response);
                } else {
                    deferred.reject(result.data.meta.errorDetail[0]);
                }

            }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getList(listId, access_token) {
            var deferred = $q.defer();

            if(!listId) {
                deferred.reject("Missing parameters for this call");
            }

            $http({
                url: API_URL + 'lists/'+listId,
                method: 'GET',
                params: {
                    access_token: access_token
                }
            }).then(function(result) {
                if (result.data && result.data.response) {
                    deferred.resolve(result.data.response);
                } else {
                    deferred.reject(result.data.meta.errorDetail[0]);
                }

            }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function addList(name, userId, access_token) {
            var deferred = $q.defer();

            if(!name || !userId || !access_token) {
                deferred.reject("Missing parameters for this call");
            }

            $http.post(
                API_URL + 'lists/add',
                {
                    Name: name,
                    userId: userId,
                    access_token: access_token
                }
            ).then(function(result) {
                if (result.data && result.data.response) {
                    deferred.resolve(result.data.response);
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
            getUsersLists: getUsersLists,
            getList: getList,
            addList: addList
        };

    };

    factory.$inject = ['$http', '$q', '$window', 'API_URL'];
    return factory;
});
