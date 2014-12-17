/*global define, console */

define( function() {
    'use strict';

    function ctrl($scope, $state, UserService, SchoolService) {
        $scope.query = '';
        $scope.schoolsSeen = {};
        $scope.searchResults = [];
        $scope.userQueried = false;

        var access_token = UserService.getAccessToken();
        var betaSchools;

        var betaSchoolRequest = SchoolService.getBetaSchools( access_token );
        betaSchoolRequest.then( function(schools) {
            console.log( 'schools', schools );
            betaSchools = schools;
            $scope.searchResults = schools;
        } );

        /*
        // TODO:
        // --get user location
        // --query for schools within 50 miles
        // --seed data into searchResults
        $http.get('someurl').success(function(data) {
            $scope.searchResults = JSON.parse(data);
        });
        */

        // SIMULATE nearby schools
        /* var localSchools = [
             {
                 fullName: 'Fayetteville',
                 id: 1
             },
             {
                 fullName: 'Springdale',
                 id: 2
             },
             {
                 fullName: 'Rogers',
                 id: 3
             },
             {
                 fullName: 'Bentonville',
                 id: 4
             }
         ];*/

        // Add to display list


        // This may need to be modified or optimized once we're pinging the server
        $scope.search = function(query) {

            if (query.length) {
                var getSchools = SchoolService.getSchoolsByQuery( query, access_token );
                getSchools.then( function(searchResults) {
                    $scope.userQueried = true;
                    $scope.searchResults = searchResults;
                    console.log( searchResults );

                }, function(reason) {
                        console.log( 'Failed:', reason );
                        $scope.errorMsg = reason;
                    } );
            } else {
                $scope.userQueried = false;
                $scope.searchResults = betaSchools;
            }


            // When the API is implemented we might want to run this
            // before assigning to the scope var
            // Cache these
            //recordSchoolsSeen($scope.searchResults);

        };

        $scope.selectSchool = function(school) {
            alert( school.fullName );
        };
    }

    ctrl.$inject = ['$scope', '$state', 'UserService', 'SchoolService'];
    return ctrl;
} );
