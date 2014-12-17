define( ['angular'], function(angular) {
    'use strict';

    var factory = function(API_VERSION, $http, $q, $window) {
        var accessToken = '';

        /**
         * Gets schools based on search queries
         * @param  {string} query       The search term
         * @param  {string} accessToken Access token for auth
         * @return {array}              Array of Schools
         */
        function getSchoolsByQuery(query, access_token) {
            var deferred = $q.defer();


            $http( {
                url: 'http://localhost:8280/v' + API_VERSION + '/schools/search',
                method: 'GET',
                params: {
                    q: query,
                    access_token: access_token
                }
            } ).then( function(result) {
                if (result.data && result.data.response) {
                    deferred.resolve( result.data.response );
                } else {
                    deferred.reject( result.data.meta.errorDetail );
                }


            }, function(error) {
                    deferred.reject( error );
                } );

            return deferred.promise;
        }

        /**
         * Gets our beta Schools
         * @return {Array} An Array of beta schools
         */
        function getBetaSchools(access_token) {
            // TODO: Make beta flag for schools that are in our program so other schools can be added but not favorited
            var deferred = $q.defer();


            $http( {
                url: 'http://localhost:8280/v' + API_VERSION + '/schools',
                method: 'GET',
                params: {
                    access_token: access_token
                }
            } ).then( function(result) {
                if (result.data && result.data.response) {
                    console.log( 'response', result.data.response );
                    deferred.resolve( result.data.response );
                } else {
                    deferred.reject( result.data.meta.errorDetail );
                }
            } );

            return deferred.promise;
        }



        // Return all our public functions
        return {
            getSchoolsByQuery: getSchoolsByQuery,
            getBetaSchools: getBetaSchools
        };

    };

    factory.$inject = ['API_VERSION', '$http', '$q', '$window'];
    return factory;
} );
