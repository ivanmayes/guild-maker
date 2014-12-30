define(['angular'], function(angular) {
    'use strict';

    var factory = function($http, $q, $window, API_URL) {

        var userInfo;

        function getPlant(plantId, access_token) {
            var deferred = $q.defer();

            if(!plantId) {
                deferred.reject("Missing parameters for this call");
            }

            $http({
                url: API_URL + 'plants/'+plantId,
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

        function searchPlants(query, access_token) {
            var deferred = $q.defer();

            if(!query) {
                deferred.reject("Missing parameters for this call");
            }

            query.access_token = access_token;

            $http({
                url: API_URL + 'plants/search',
                method: 'GET',
                params: query
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


        // Return all our public functions
        return {
            getPlant: getPlant,
            searchPlants: searchPlants
        };

    };

    factory.$inject = ['$http', '$q', '$window', 'API_URL'];
    return factory;
});
