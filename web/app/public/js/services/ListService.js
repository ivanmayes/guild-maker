define(['angular'], function(angular) {
    'use strict';

    var factory = function($http, $q, $window, API_URL) {

        var selectedList;

        function getUsersLists(userId, access_token) {
            var deferred = $q.defer();

            if (!userId || !access_token) {
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

            if (!listId) {
                deferred.reject("Missing parameters for this call");
            }

            $http({
                url: API_URL + 'lists/' + listId,
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

            if (!name || !userId || !access_token) {
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

        function removeList(list, access_token) {
            var deferred = $q.defer();

            if (!list || !access_token) {
                deferred.reject("Missing parameters for this call");
            }

            $http({
                url: API_URL + 'lists/' + list._id,
                method: 'DELETE',
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

        function updateList(list, access_token) {
            var deferred = $q.defer();


            //TODO: Figure out errors here and having them hit the controller
            /*if (!list || !access_token) {
                deferred.reject("Missing parameters for this call");
            }*/

            // Replace any objects with strings
            angular.forEach(list.Plants, function(plant, key) {
                if (angular.isObject(plant)) {
                    list.Plants[key] = plant._id;
                }
            });

            $http.post(
                API_URL + 'lists/update',
                {
                    listId: list._id,
                    Name: list.Name,
                    Plants: list.Plants,
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
            addList: addList,
            updateList: updateList,
            removeList: removeList,
            selectedList: selectedList
        };

    };

    factory.$inject = ['$http', '$q', '$window', 'API_URL'];
    return factory;
});
